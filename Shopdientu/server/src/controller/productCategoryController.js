const ProductCategory = require('../modal/productCategoris');
const asyncHandler = require('express-async-handler');


class ProductCategoryControlller {
    createProductCategori = asyncHandler(async (req, res) => {
        if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
        const newProductCategory = await ProductCategory.create(req.body)
        return res.status(200).json({
            success: newProductCategory ? true : false,
            createdProductCategory: newProductCategory ? newProductCategory : 'Cannot create new ProductCategory'
        })
    })

    getAllProductCategoryvs = asyncHandler(async (req, res) => {
        const ProductCate = await ProductCategory.find({}).select("title");

        res.status(200).json({
            mes: "Success",
            data: ProductCate
        })
    })

    getAllProductCategory = asyncHandler(async (req, res) => {
        const ProductCate = await ProductCategory.find({});

        res.status(200).json({
            mes: "Success",
            data: ProductCate
        })

    });


    updateProductCategori = asyncHandler(async (req, res) => {
        const { cid } = req.params

        const updatedProductCategory = await ProductCategory.findByIdAndUpdate(cid, req.body, { new: true })
        return res.status(200).json({
            success: updatedProductCategory ? true : false,
            updatedProductCategory: updatedProductCategory ? updatedProductCategory : 'Cannot update ProductCategory'
        })
    })

    deleteProductCategori = asyncHandler(async (req, res) => {
        const { cid } = req.params
        const deletedProduct = await ProductCategory.findByIdAndDelete(cid)
        return res.status(200).json({
            success: deletedProduct ? true : false,
            deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
        })
    })

}

module.exports = new ProductCategoryControlller;