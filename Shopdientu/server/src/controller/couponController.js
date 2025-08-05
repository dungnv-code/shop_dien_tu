const Coupon = require('../modal/coupon');
const asyncHandler = require('express-async-handler');


class CouponControlller {
    createCoupon = asyncHandler(async (req, res) => {
        const { name, expiry, discount } = req.body;
        if (!name || !expiry || !discount) {
            throw new Error('Thiếu đầu vào');
        }
        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào');

        const newCoupon = await Coupon.create({
            ...req.body,
            expiry: Date.now() + expiry * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: newCoupon ? true : false,
            createdCoupon: newCoupon ? newCoupon : 'Cannot create new updateCoupon'
        })
    })

    getAllCoupon = asyncHandler(async (req, res) => {
        const Cou_pon = await Coupon.find({});
        res.status(200).json({
            mes: "Success",
            data: Cou_pon
        })

    });


    updateCoupon = asyncHandler(async (req, res) => {
        const { cid } = req.params
        const { name, expiry, discount } = req.body;
        if (!name || !expiry || !discount) {
            throw new Error('Thiếu đầu vào');
        }
        const updateCoupon = await Coupon.findByIdAndUpdate(cid, {
            ...req.body,
            expiry: Date.now() + expiry * 60 * 60 * 1000
        }, { new: true });

        return res.status(200).json({
            success: updateCoupon ? true : false,
            updateCoupon: updateCoupon ? updateCoupon : 'Cannot update updateCoupon'
        })
    })

    deleteCoupon = asyncHandler(async (req, res) => {
        const { cid } = req.params
        const deletedCoupon = await Coupon.findByIdAndDelete(cid)
        return res.status(200).json({
            success: deletedCoupon ? true : false,
            deletedCoupon: deletedCoupon ? deletedCoupon : 'Cannot delete updateCoupon'
        })
    })

}

module.exports = new CouponControlller;