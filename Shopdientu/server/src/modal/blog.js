const mongoose = require('mongoose');


var BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    numberView: {
        type: Number,
        default: 0,
    },
    isLike: {
        type: Boolean,
        default: false,
    },
    isDislike: {
        type: Boolean,
        default: false,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    image: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLb8GmXKz4-VIiuD5WRN-XvZkVYnDkLg1oKQ&s" },
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        default: "Chờ xét duyệt",
        enum: ["Chờ xét duyệt", "Đã duyệt"],
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

module.exports = mongoose.model('Blogs', BlogSchema);