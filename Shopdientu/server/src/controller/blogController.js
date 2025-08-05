const Blog = require('../modal/blog');
const asyncHandler = require('express-async-handler');


class BlogControlller {
    createBlog = asyncHandler(async (req, res) => {

        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            throw new Error('Thiếu đầu vào');
        }

        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào');

        const newBlog = await Blog.create(req.body)
        return res.status(200).json({
            success: newBlog ? true : false,
            createdProductCategory: newBlog ? newBlog : 'Cannot create new Blog'
        })
    })

    getAllBlog = asyncHandler(async (req, res) => {
        const Blogs = await Blog.find({});
        res.status(200).json({
            mes: "Success",
            data: Blogs
        })
    });

    updateBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào');
        const updatedBlog = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
        return res.status(200).json({
            success: updatedBlog ? true : false,
            updatedProductCategory: updatedBlog ? updatedBlog : 'Cannot update updatedBlog'
        })
    })

    getDetailBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        const excludeFiedl = "-refreshToken -password -updatedAt -createdAt -passwordChangeAt -passwordChangedAt";
        const blogDetail = await Blog.findByIdAndUpdate(bid, { $inc: { numberView: 1 } }, { new: true }).populate("dislikes", excludeFiedl).populate("likes", excludeFiedl);
        return res.status(200).json({
            mes: "Success",
            data: blogDetail,
        })
    })

    deleteBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params
        const deletedBlog = await Blog.findByIdAndDelete(bid)
        return res.status(200).json({
            success: deletedBlog ? true : false,
            deletedProduct: deletedBlog ? deletedBlog : 'Cannot delete blog'
        })
    })

    likeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { bid } = req.params;
        if (!bid) {
            throw new Error("Thiếu đầu vào");
        }
        const blog = await Blog.findById(bid);

        const alreadyDislike = blog.dislikes?.find((el) => el.toString() == _id);

        if (alreadyDislike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id }, isDislike: false });
        }

        const alreadyLike = blog.isLike;
        if (alreadyLike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLike: false });
            return res.status(200).json({ mes: "Đã bỏ like" });
        }

        const like = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id }, isLike: true }, { new: true })

        return res.status(200).json({
            mes: "Success",
            data: like
        })
    })


    dislikeBlog = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { bid } = req.params;
        if (!bid) {
            throw new Error("Thiếu đầu vào");
        }
        const blog = await Blog.findById(bid);

        const alreadyDislike = blog.likes?.find((el) => el.toString() == _id);

        if (alreadyDislike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id }, isLike: false });
        }

        const alreadyLike = blog.isDislike;
        if (alreadyLike) {
            await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id }, isDislike: false });
            return res.status(200).json({ mes: "Đã bỏ dislike" });
        }

        const like = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id }, isDislike: true }, { new: true })

        return res.status(200).json({
            mes: "Success",
            data: like
        })
    })

    upLoadImageBlog = asyncHandler(async (req, res) => {
        const { bid } = req.params;
        if (!req.file) throw new Error("Thiếu đầu vào");
        const reponse = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });
        res.status(200).json({
            mes: "Success",
            data: reponse
        })
    })
}

module.exports = new BlogControlller;