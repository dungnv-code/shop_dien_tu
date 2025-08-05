const Order = require('../modal/order');
const User = require('../modal/user');
const Coupon = require("../modal/coupon")
const asyncHandler = require('express-async-handler');


class OrderControlller {
    createOrder = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const cart = await User.findById(_id)
            .select("cart")
            .populate("cart.product", "title");

        const products = cart?.cart?.map((el) => ({
            product: el.product._id,
            count: el.quantity,
            color: el.color,
            size: el.size,
            image: el.image,
            price: el.price,
        }));

        // Tính tổng tiền
        let total = cart?.cart?.reduce((sum, el) => sum + el.price * el.quantity, 0);

        // Kiểm tra và áp dụng mã giảm giá
        const coupon = await Coupon.findById(req.body?.coupon);
        if (coupon && coupon.discount) {
            total = Math.round(total * (1 - coupon.discount / 100));
        }

        const rs = await Order.create({ products, total, orderBy: _id });

        res.status(200).json({
            mes: "Success",
            data: rs
        });
    });


    getAllOrder = asyncHandler(async (req, res) => {
        const Cou_pon = await Order.find({});
        res.status(200).json({
            mes: "Success",
            data: Cou_pon
        })
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