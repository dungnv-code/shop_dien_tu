const router = require("express").Router();

const ProductController = require("../controller/productController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

const uploadder = require("../config/uploadCloudinary");

router.get("/getAllProducts", ProductController.getAllProduct);
router.post("/createProduct", [verifyAccessToken, isAdmin], uploadder.single("images"), ProductController.createProduct);
router.get("/getDetailProduct/:pid", ProductController.getDetailProduct);
router.put("/updateProduct/:pid", uploadder.single("images"), ProductController.updateProduct);
router.delete("/deleteProduct/:pid", ProductController.deleteProduct);
router.put("/ratings", verifyAccessToken, ProductController.ratings);
router.delete("/deleteComment/:pid/:cid", verifyAccessToken, ProductController.deleteComment);
router.post("/addVariantItem", [verifyAccessToken, isAdmin], uploadder.single("images"), ProductController.addVariantItem);
router.post("/upLoadImage/:pid", [verifyAccessToken, isAdmin], uploadder.single("images"), ProductController.upLoadImage);


module.exports = router;

