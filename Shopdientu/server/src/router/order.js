const router = require("express").Router();

const OrderController = require("../controller/orderController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/getAllOrder", [verifyAccessToken, isAdmin], OrderController.getAllOrder);
router.get("/getOrderUser", [verifyAccessToken], OrderController.getOrderUser);
router.post("/createOrder", [verifyAccessToken, isAdmin], OrderController.createOrder);
router.put("/updateOrderStatus/:oid", [verifyAccessToken, isAdmin], [verifyAccessToken, isAdmin], OrderController.updateOrderStatus);


module.exports = router;
