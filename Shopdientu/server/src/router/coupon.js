const router = require("express").Router();

const CouponController = require("../controller/couponController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/createCoupon", [verifyAccessToken, isAdmin], CouponController.createCoupon);
router.get("/getAllCoupon", CouponController.getAllCoupon);
router.put("/updateCoupon/:cid", [verifyAccessToken, isAdmin], CouponController.updateCoupon);

router.delete("/deleteCoupon/:cid", [verifyAccessToken, isAdmin], CouponController.deleteCoupon);


module.exports = router;
