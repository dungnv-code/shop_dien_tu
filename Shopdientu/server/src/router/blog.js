const router = require("express").Router();

const BlogController = require("../controller/blogController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadder = require("../config/uploadCloudinary")

router.post("/createBlog", [verifyAccessToken], uploadder.single("image"), BlogController.createBlog);
router.get("/getAllBlog", BlogController.getAllBlog);
router.put("/updateBlog/:bid", [verifyAccessToken], uploadder.single("image"), BlogController.updateBlog);
router.get("/getDetailBlog/:bid", BlogController.getDetailBlog);
router.delete("/deleteBlog/:bid", [verifyAccessToken], BlogController.deleteBlog);
router.put("/updateStatusBlog/:bid", [verifyAccessToken, isAdmin], BlogController.updateStatusBlog);
router.post("/likeBlog/:bid", [verifyAccessToken], BlogController.likeBlog);
router.post("/dislikeBlog/:bid", [verifyAccessToken], BlogController.dislikeBlog);
router.post("/upLoadImageBlog/:bid", [verifyAccessToken, isAdmin], uploadder.single("image"), BlogController.upLoadImageBlog);
module.exports = router;
