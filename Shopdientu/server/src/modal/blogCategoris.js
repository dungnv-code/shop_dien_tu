const mongoose = require('mongoose');
var BlogCategorisSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('BlogCategoris', BlogCategorisSchema);