const cloudinary = require('cloudinary').v2;
const NewsItem = require('../models/NewsItem');

cloudinary.config({
    cloud_name: 'dqpr9x04c',
    api_key: '475936874763872',
    api_secret: 'j4EMdCMF5NWnqbYDqg0w4TMe71c'
});

async function uploadImage(file) {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    } catch (error) {
        throw new Error('Failed to upload image to Cloudinary');
    }
}

async function createNewsItem(req, res) {
    const { name, name_ru, description, description_ru } = req.body;
    const files = req.files;

    try {
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error('No files uploaded');
        }

        const imageUrls = await Promise.all(files.map(async file => await uploadImage(file)));

        const newItem = await NewsItem.create({
            name,
            name_ru,
            description,
            description_ru,
            images: imageUrls,
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating news item:', error);
        res.status(500).json({ message: 'Failed to create news item' });
    }
}

async function updateNewsItem(req, res) {
    const { id } = req.params;
    const { name, name_ru, description, description_ru } = req.body;
    const files = req.files;

    try {
        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new Error('No files uploaded');
        }

        const imageUrls = await Promise.all(files.map(async file => await uploadImage(file)));

        const updatedItem = await NewsItem.findByIdAndUpdate(id, {
            name,
            name_ru,
            description,
            description_ru,
            images: imageUrls,
        }, { new: true });
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating news item:', error);
        res.status(500).json({ message: 'Failed to update news item' });
    }
}

async function deleteNewsItem(req, res) {
    const { id } = req.params;

    try {
        const deletedItem = await NewsItem.findByIdAndDelete(id);
        if (!deletedItem) {
            throw new Error('News item not found');
        }
        res.json({ message: 'News item deleted successfully' });
    } catch (error) {
        console.error('Error deleting news item:', error);
        res.status(500).json({ message: 'Failed to delete news item' });
    }
}

function renderNewsUpdateForm(req, res) {
    const { id } = req.params;
    NewsItem.findById(id)
        .then(newsItem => {
            if (!newsItem) {
                res.status(404).send('News item not found');
            } else {
                const user = req.session.user;
                res.render('newsUpdate', { newsItem, user });
            }
        })
        .catch(error => {
            console.error('Error fetching news item:', error);
            res.status(500).send('Failed to fetch news item');
        });
}

module.exports = {
    createNewsItem,
    renderNewsUpdateForm,
    updateNewsItem,
    deleteNewsItem
};