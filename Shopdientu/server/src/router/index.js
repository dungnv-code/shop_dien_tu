const userRouter = require('./user');
const productRouter = require("./product");
const productCategoryRouter = require("./productcategory");
const blogRouter = require("./blog")
const couponRouter = require("./coupon")
const orderRouter = require("./order")
const blogCategoris = require("./blogcategoris")
const { notFound, errHandler } = require("../middlewares/errHandler");

const root = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/productcategory", productCategoryRouter);
    app.use("/api/blog", blogRouter);
    app.use("/api/coupon", couponRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/blogcategoris", blogCategoris);
    app.use(notFound)
    app.use(errHandler)
}

module.exports = root;