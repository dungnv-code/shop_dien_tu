const BlogCategoris = require("../modal/blogCategoris")
const asyncHandler = require('express-async-handler');

class BlogCategoryController {
    getAllBlogCategori = asyncHandler(async (req, res) => {
        const reponse = await BlogCategoris.find({})
        res.json({
            success: true,
            data: reponse,
            mes: "get thành công Blog Cate"
        })
    })
}

module.exports = new BlogCategoryController;