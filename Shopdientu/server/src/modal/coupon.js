const mongoose = require('mongoose');


var CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: String,
        require: true,
    },
    expiry: {
        type: Date,
        require: true
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('coupons', CouponSchema);