const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.isAuthenticated, newsController.renderAllNews);

router.get('/:id', authMiddleware.isAuthenticated, newsController.renderNewsById);

module.exports = router;
