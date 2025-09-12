const mongoose = require('mongoose');


var OrderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId, ref: "Product",
            },
            count: { type: Number },
            size: { type: String },
            color: { type: String },
            image: { type: String },
            price: { type: Number }
        }
    ],
    total: { type: Number },
    coupon: { type: mongoose.Types.ObjectId, ref: "coupons" },
    status: {
        type: String,
        default: "Đang xử lí",
        enum: ["Đang xử lí", "Đã giao", "Đã huỷ"],
    },
    paymentIntent: {},
    orderBy: { type: mongoose.Types.ObjectId, ref: "User" }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('orders', OrderSchema);