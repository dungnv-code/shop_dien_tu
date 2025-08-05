const mongoose = require('mongoose');


var ProductCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    brand: [{ type: String }],
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('ProductCategoris', ProductCategorySchema);