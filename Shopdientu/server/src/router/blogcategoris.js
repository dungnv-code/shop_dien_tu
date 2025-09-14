const Route = require("express").Router()

const BlogCategoryController = require("../controller/blogCategorisController")

Route.get("/getAllBlogCategori", BlogCategoryController.getAllBlogCategori)

module.exports = Route