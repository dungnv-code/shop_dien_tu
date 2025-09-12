const router = require("express").Router();

const UserController = require("../controller/userController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadder = require("../config/uploadCloudinary");
router.get("/getAllUsers", verifyAccessToken, isAdmin, UserController.getAllUsers);
router.post("/logIn", UserController.login);
router.post("/register", UserController.register);
router.put("/finalRegister/:token", UserController.finalRegister);
router.get("/getSingleUser", verifyAccessToken, UserController.getCurrent);
router.post("/refreshAccessToken", UserController.refreshAccessToken);
router.delete("/deleteUser", [verifyAccessToken, isAdmin], UserController.deleteUser);
router.put("/updateUser", verifyAccessToken, uploadder.single("image"), UserController.updateUser);
router.post("/logOut", verifyAccessToken, UserController.logout);
router.put("/updateUserbyAdmin/:uid", [verifyAccessToken, isAdmin], UserController.updateUserByAdmin);
router.post("/forgotPassword", UserController.forgotPassword);
router.put("/resetPassword", UserController.resetPassword);
router.post("/updateCart", verifyAccessToken, UserController.updateCart);
router.delete("/removeCart/:cid", verifyAccessToken, UserController.removeCart);
router.post("/updateCartQuantity/:cid", verifyAccessToken, UserController.updateCartQuantity);
router.put("/updateAddress", verifyAccessToken, UserController.updateAddress);
router.put("/updateWishList/:pid", verifyAccessToken, UserController.updateWishList);

module.exports = router;
