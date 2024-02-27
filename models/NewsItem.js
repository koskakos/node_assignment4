const mongoose = require('mongoose');

const newsItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_ru: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    description_ru: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const NewsItem = mongoose.model('NewsItem', newsItemSchema);

module.exports = NewsItem;
