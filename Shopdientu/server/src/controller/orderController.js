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