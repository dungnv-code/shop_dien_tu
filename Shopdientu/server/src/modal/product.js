const mongoose = require('mongoose');


var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
    },
    variants: [
        {
            size: { type: String, required: true },
            color: [{ type: String, required: true }],
            price: [{ type: Number, required: true }],
            image: [{ type: String }]
        }
    ]
    ,
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
        }
    ],
    comments: [
        {
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    disCount: { type: Number },
    totalRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);