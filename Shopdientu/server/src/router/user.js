const router = require("express").Router();

const UserController = require("../controller/userController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/getAllUsers", verifyAccessToken, isAdmin, UserController.getAllUsers);
router.post("/logIn", UserController.login);
router.post("/register", UserController.register);
router.put("/finalRegister/:token", UserController.finalRegister);
router.get("/getSingleUser", verifyAccessToken, UserController.getCurrent);
router.post("/refreshAccessToken", UserController.refreshAccessToken);
router.delete("/deleteUser", [verifyAccessToken, isAdmin], UserController.deleteUser);
router.put("/updateUser", verifyAccessToken, UserController.updateUser);
router.post("/logOut", verifyAccessToken, UserController.logout);
router.put("/updateUserbyAdmin/:uid", [verifyAccessToken, isAdmin], UserController.updateUserByAdmin);
router.post("/forgotPassword", UserController.forgotPassword);
router.put("/resetPassword", UserController.resetPassword);
router.post("/updateCart", verifyAccessToken, UserController.updateCart);

module.exports = router;
