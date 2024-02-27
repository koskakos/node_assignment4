const NewsItem = require('../models/NewsItem');

async function renderAllNews(req, res) {
    try {
        const lang = req.query.lang || 'en';

        const selectFields = lang === 'en' ? 'name description images' : `name_${lang} description_${lang} images`;

        const newsItems = await NewsItem.find().select(selectFields);

        const user = req.session.user;
        res.render('news', { newsItems, user, lang });
    } catch (error) {
        res.status(500).send('Failed to fetch news articles');
    }
}

async function renderNewsById(req, res) {
    const { id } = req.params;
    try {
        const newsItem = await NewsItem.findById(id);
        if (!newsItem) {
            return res.status(404).send('News article not found');
        }
        res.render('newsDetails', { newsItem });
    } catch (error) {
        res.status(500).send('Failed to fetch news article');
    }
}

module.exports = {
    renderAllNews,
    renderNewsById
};
