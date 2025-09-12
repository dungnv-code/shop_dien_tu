const Order = require('../modal/order');
const User = require('../modal/user');
const Coupon = require("../modal/coupon")
const asyncHandler = require('express-async-handler');


class OrderControlller {
    createOrder = asyncHandler(async (req, res) => {
        const { _id } = req.user;

        let { products, total, address, coupon } = req.body;

        // Nếu có mã giảm giá
        if (coupon) {
            const couponDoc = await Coupon.findById(coupon);
            if (couponDoc && couponDoc.discount) {
                total = Math.round(total * (1 - couponDoc.discount / 100));
            }
        }

        // Nếu có địa chỉ thì update vào user
        if (address) {
            await User.findByIdAndUpdate(_id, { address, cart: [] }, { new: true });
        }

        // Tạo đơn hàng
        const rs = await Order.create({ products, total, orderBy: _id, coupon });

        return res.status(200).json({
            success: true,
            mes: "Success",
            data: rs
        });
    });

    getAllOrder = asyncHandler(async (req, res) => {
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
                const value = queries[key];
                if (typeof value === "string" && value.includes(",")) {
                    filter[key] = { $in: value.split(",") };
                } else if (!isNaN(value)) {
                    filter[key] = Number(value);
                } else {
                    filter[key] = value;
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

            if (isRandom) {
                const filteredOrders = await Order.find(filter)
                    .populate("products.product") // ✅ populate vào product
                    .lean();

                const rng = seedrandom(seed);
                const shuffled = filteredOrders
                    .map(o => ({ o, sortKey: rng() }))
                    .sort((a, b) => a.sortKey - b.sortKey)
                    .map(el => el.o);

                const selected = shuffled.slice(skip, skip + limit);

                return res.status(200).json({
                    success: true,
                    orderData: selected,
                    counts: filteredOrders.length,
                    totalPages: Math.ceil(filteredOrders.length / limit),
                    currentPage: page,
                });
            } else {
                const orderQuery = Order.find(filter)
                    .populate("products.product") // ✅ populate vào product
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);

                const [orders, total] = await Promise.all([
                    orderQuery, // bỏ .lean() tạm để test
                    Order.countDocuments(filter),
                ]);

                console.log(JSON.stringify(orders, null, 2)); // check có title không

                return res.status(200).json({
                    success: true,
                    orderData: orders,
                    counts: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                });

            }
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    });



    updateOrderStatus = asyncHandler(async (req, res) => {
        const { oid } = req.params;
        const { status } = req.body;

        const updateStus = await Order.findByIdAndUpdate(oid, { status }, { new: true });

        return res.status(200).json({
            success: updateStus ? true : false,
            updateCoupon: updateStus ? updateStus : 'Cannot update updateCoupon'
        })
    })

    getOrderUser = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const Cou_pon = await Order.find({ orderBy: _id });
        res.status(200).json({
            mes: "Success",
            data: Cou_pon
        })
    })

    // deleteCoupon = asyncHandler(async (req, res) => {
    //     const { cid } = req.params
    //     const deletedCoupon = await Coupon.findByIdAndDelete(cid)
    //     return res.status(200).json({
    //         success: deletedCoupon ? true : false,
    //         deletedCoupon: deletedCoupon ? deletedCoupon : 'Cannot delete updateCoupon'
    //     })
    // })

}

module.exports = new OrderControlller;