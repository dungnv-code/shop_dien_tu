const router = require("express").Router();

const ProductCategoryControlller = require("../controller/productCategoryController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.get("/getAllProductCategory", ProductCategoryControlller.getAllProductCategory);
router.get("/getAllProductCategoryvs", ProductCategoryControlller.getAllProductCategoryvs);
router.post("/createProductCategori", [verifyAccessToken, isAdmin], ProductCategoryControlller.createProductCategori);
router.put("/updateProductCategori/:cid", [verifyAccessToken, isAdmin], ProductCategoryControlller.updateProductCategori);
router.delete("/deleteProductCategori/:cid", [verifyAccessToken, isAdmin], ProductCategoryControlller.deleteProductCategori);

module.exports = router;

