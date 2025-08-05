const router = require("express").Router();

const BlogController = require("../controller/blogController");

const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploadder = require("../config/uploadCloudinary")

router.post("/createBlog", [verifyAccessToken, isAdmin], BlogController.createBlog);
router.get("/getAllBlog", BlogController.getAllBlog);
router.put("/updateBlog/:bid", [verifyAccessToken, isAdmin], BlogController.updateBlog);
router.get("/getDetailBlog/:bid", BlogController.getDetailBlog);
router.delete("/deleteBlog/:bid", [verifyAccessToken, isAdmin], BlogController.deleteBlog);
router.post("/likeBlog/:bid", [verifyAccessToken, isAdmin], BlogController.likeBlog);
router.post("/dislikeBlog/:bid", [verifyAccessToken, isAdmin], BlogController.dislikeBlog);
router.post("/upLoadImageBlog/:bid", [verifyAccessToken, isAdmin], uploadder.single("image"), BlogController.upLoadImageBlog);
module.exports = router;
