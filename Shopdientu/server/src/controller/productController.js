const Product = require('../modal/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

class ProductControlller {
    createProduct = asyncHandler(async (req, res) => {
        if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
        if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
        const newProduct = await Product.create(req.body)
        return res.status(200).json({
            success: newProduct ? true : false,
            createdProduct: newProduct ? newProduct : 'Cannot create new product'
        })
    })

    getDetailProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params
        const product = await Product.findById(pid)
        return res.status(200).json({
            success: product ? true : false,
            productData: product ? product : 'Cannot get product'
        })
    })
    // Filtering, sorting & pagination
    getAllProduct = asyncHandler(async (req, res) => {
        const queries = { ...req.query };
        const excludeFields = ["limit", "sort", "page", "fields", "random", "seed"];
        excludeFields.forEach(el => delete queries[el]);

        const filter = {};
        for (const key in queries) {
            const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
            if (match) {
                const [_, field, op] = match;
                filter[field] = filter[field] || {};
                filter[field][`$${op}`] = Number(req.query[key]);
            } else if (key === "title") {
                filter.title = { $regex: queries[key], $options: "i" };
            } else {
                filter[key] = queries[key];
            }
        }

        try {
            const seedrandom = require("seedrandom");
            const isRandom = req.query.random === "true";
            const limit = Number(req.query.limit);
            const sort = req.query.sort || "-createdAt";
            const page = Number(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const seed = req.query.seed || "default-seed";

            if (isRandom) {
                const filteredProducts = await Product.find(filter).lean();
                const rng = seedrandom(seed);

                const shuffled = filteredProducts
                    .map(p => ({ p, sortKey: rng() }))
                    .sort((a, b) => a.sortKey - b.sortKey)
                    .map(el => el.p);

                const selected = shuffled.slice(0, limit);

                return res.status(200).json({
                    success: true,
                    productDatas: selected,
                    counts: selected.length,
                    totalPages: 1,
                    currentPage: 1,
                });
            } else {
                // Xử lý truy vấn bình thường (có phân trang, sắp xếp,...)
                const productQuery = Product.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);

                const [products, total] = await Promise.all([
                    productQuery.lean(),
                    Product.countDocuments(filter)
                ]);

                return res.status(200).json({
                    success: true,
                    productDatas: products,
                    counts: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                });
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    });


    updateProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params
        if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
        const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
        return res.status(200).json({
            success: updatedProduct ? true : false,
            updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
        })
    })

    deleteProduct = asyncHandler(async (req, res) => {
        const { pid } = req.params
        const deletedProduct = await Product.findByIdAndDelete(pid)
        return res.status(200).json({
            success: deletedProduct ? true : false,
            deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
        })
    })

    ratings = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { pid, star } = req.body;
        const product = await Product.findById(pid);
        const isratings = product.ratings.find((rating) => { return rating.postedBy.toString() == _id.toString() })
        if (isratings) {
            isratings.star = star;
            await product.save();
        } else {
            product.ratings.push({ star, postedBy: _id });
            await product.save();
        }
        const totalRatings = product.ratings.length;
        const totalStars = product.ratings.reduce((sum, rating) => sum + rating.star, 0);
        product.totalRating = (totalStars / totalRatings).toFixed(1);

        await product.save();

        return res.status(200).json({
            mes: isratings ? "Đánh giá lần sau" : "Đánh giá lần đầu",
            data: product
        })
    })

    commentProduct = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { pid, comment } = req.body;
        const commentNew = await Product.findByIdAndUpdate(pid, { $push: { comments: { comment, postedBy: _id } } }, { new: true });
        res.status(200).json({
            mes: "success",
            data: commentNew
        })
    })

    deleteComment = asyncHandler(async (req, res) => {
        const { pid, cid } = req.params;

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ mes: "Sản phẩm không tồn tại" });

        const comment = product.comments.find(
            (c) => c._id.toString() === cid
        );
        if (!comment) return res.status(404).json({ mes: "Bình luận không tồn tại" });

        if (
            comment.postedBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({ mes: "Không có quyền xoá bình luận này" });
        }

        product.comments = product.comments.filter(
            (c) => c._id.toString() !== cid
        );
        await product.save();

        return res.status(200).json({
            mes: "Đã xoá bình luận thành công",
            comments: product.comments
        });
    });

    addVariantItem = asyncHandler(async (req, res) => {
        try {
            const { pid, size, color, price, image } = req.body;

            if (!pid || !size || !color || price == null) {
                return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
            }

            const product = await Product.findById(pid);
            if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

            // Tìm variant theo size
            const variant = product.variants.find(v => v.size === size);

            if (variant) {
                // Kiểm tra trùng color
                if (variant.color.includes(color)) {
                    return res.status(400).json({ message: "Màu này đã tồn tại trong size đã chọn." });
                }

                // Thêm vào mảng
                variant.color.push(color);
                variant.price.push(price);
                variant.image.push(image || "");
            } else {
                // Chưa có size đó → tạo mới
                product.variants.push({
                    size,
                    color: [color],
                    price: [price],
                    image: [image || ""]
                });
            }

            await product.save();

            return res.status(200).json({ message: "Thêm biến thể thành công.", product });
        } catch (err) {
            return res.status(500).json({ message: "Lỗi server.", error: err.message });
        }
    });

    upLoadImage = asyncHandler(async (req, res) => {
        const { pid } = req.params;
        if (!req.file) throw new Error("Thiếu đầu vào");
        const reponse = await Product.findByIdAndUpdate(pid, { image: req.file.path }, { new: true });
        res.status(200).json({
            mes: "Success",
            data: reponse
        })
    })
}

module.exports = new ProductControlller;