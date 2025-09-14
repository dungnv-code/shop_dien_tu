const Blog = require('../modal/blog');
const asyncHandler = require('express-async-handler');


class BlogControlller {
    createBlog = asyncHandler(async (req, res) => {
        const { _id } = req.user
        const { title, description, category } = req.body;

        if (!req.file) throw new Error("Thiếu đầu vào");

        if (!title || !description || !category) {
            throw new Error('Thiếu đầu vào');
        }

        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào');

        const newBlog = await Blog.create({ ...req.body, image: req.file.path, author: _id })
        return res.status(200).json({
            success: newBlog ? true : false,
            createdProductCategory: newBlog ? newBlog : 'Cannot create new Blog'
        })
    })

    getAllBlog = asyncHandler(async (req, res) => {
        const excludeFiedl = "-refreshToken -password -updatedAt -createdAt -passwordChangeAt -passwordChangedAt";
        const queries = { ...req.query };
        const excludeFields = ["limit", "sort", "page", "fields", "random", "seed"];
        excludeFields.forEach(el => delete queries[el]);

        // Build filter động
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
                const value = queries[key];
                if (typeof value === "string" && value.includes(",")) {
                    filter[key] = { $in: value.split(",") };
                } else {
                    // ⚠️ chỉ ép số nếu chắc chắn numeric
                    if (!isNaN(value) && value.trim() !== "") {
                        filter[key] = Number(value);
                    } else {
                        filter[key] = value;
                    }
                }
            }
        }

        try {
            const seedrandom = require("seedrandom");
            const isRandom = req.query.random === "true";
            const limit = Number(req.query.limit) || 20;
            const sort = req.query.sort || "-createdAt";
            const page = Number(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const seed = req.query.seed || "default-seed";
            const fields = req.query.fields?.split(",").join(" ") || "";

            if (isRandom) {
                // Lấy toàn bộ để shuffle có seed
                const allBlogs = await Blog.find(filter)
                    .select(fields)
                    .populate("author", excludeFiedl)
                    .lean();

                const rng = seedrandom(seed);
                const shuffled = allBlogs
                    .map(o => ({ o, sortKey: rng() }))
                    .sort((a, b) => a.sortKey - b.sortKey)
                    .map(el => el.o);

                const selected = shuffled.slice(skip, skip + limit);

                return res.status(200).json({
                    success: true,
                    blogData: selected,
                    counts: allBlogs.length,
                    totalPages: Math.ceil(allBlogs.length / limit),
                    currentPage: page,
                });
            } else {
                const blogQuery = Blog.find(filter)
                    .select(fields)
                    .populate("author", excludeFiedl)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean();

                const [blogs, total] = await Promise.all([
                    blogQuery,
                    Blog.countDocuments(filter),
                ]);

                return res.status(200).json({
                    success: true,
                    blogData: blogs,
                    counts: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                });
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    });


    updateBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào');

        const updateData = { ...req.body };

        // Nếu có file upload thì mới thêm image
        if (req.file) {
            updateData.image = req.file.path; // hoặc req.file.filename nếu bạn lưu local
        }

        const updatedBlog = await Blog.findByIdAndUpdate(bid, updateData, { new: true })
        return res.status(200).json({
            success: updatedBlog ? true : false,
            updatedProductCategory: updatedBlog ? updatedBlog : 'Cannot update updatedBlog'
        })
    })

    getDetailBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        const excludeField = "-refreshToken -password -updatedAt -createdAt -passwordChangeAt -passwordChangedAt";

        const blogDetail = await Blog.findByIdAndUpdate(
            bid,
            { $inc: { numberView: 1 } },
            { new: true }
        )
            .populate("author", "name email avatar")   // 👈 populate tác giả, chỉ lấy vài field cần thiết
            .populate("dislikes", excludeField)
            .populate("likes", excludeField);

        return res.status(200).json({
            mes: "Success",
            data: blogDetail,
        });
    });


    deleteBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const deletedBlog = await Blog.findByIdAndDelete(bid)
        return res.status(200).json({
            success: deletedBlog ? true : false,
            deletedProduct: deletedBlog ? deletedBlog : 'Cannot delete blog'
        })
    })

    updateStatusBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const reponsive = await Blog.findByIdAndUpdate(bid, { ...req.body }, { new: true })
        return res.status(200).json({
            success: reponsive ? true : false,
            data: reponsive ? reponsive : 'Cannot update blog'
        })
    })

    likeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { bid } = req.params;
        if (!bid) {
            throw new Error("Thiếu đầu vào");
        }
        const blog = await Blog.findById(bid);

        const alreadyDislike = blog.dislikes?.find((el) => el.toString() == _id);

        if (alreadyDislike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id }, isDislike: false });
        }

        const alreadyLike = blog.isLike;
        if (alreadyLike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLike: false });
            return res.status(200).json({ mes: "Đã bỏ like" });
        }

        const like = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id }, isLike: true }, { new: true })

        return res.status(200).json({
            mes: "Success",
            data: like
        })
    })


    dislikeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { bid } = req.params;
        if (!bid) {
            throw new Error("Thiếu đầu vào");
        }
        const blog = await Blog.findById(bid);

        const alreadyDislike = blog.likes?.find((el) => el.toString() == _id);

        if (alreadyDislike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLike: false });
        }

        const alreadyLike = blog.isDislike;
        if (alreadyLike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id }, isDislike: false });
            return res.status(200).json({ mes: "Đã bỏ dislike" });
        }

        const like = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id }, isDislike: true }, { new: true })

        return res.status(200).json({
            mes: "Success",
            data: like
        })
    })

    upLoadImageBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        if (!req.file) throw new Error("Thiếu đầu vào");
        const reponse = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });
        res.status(200).json({
            mes: "Success",
            data: reponse
        })
    })
}

module.exports = new BlogControlller;