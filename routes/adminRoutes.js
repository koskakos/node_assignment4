const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadFiles = require('../middleware/uploadFiles');

router.post('/news/create', authMiddleware.isAdmin, uploadFiles, adminController.createNewsItem);

router.get('/news/:id/update', authMiddleware.isAdmin, adminController.renderNewsUpdateForm);

router.post('/news/:id/update', authMiddleware.isAdmin, uploadFiles, adminController.updateNewsItem);

router.post('/news/:id/delete', authMiddleware.isAdmin, adminController.deleteNewsItem);

module.exports = router;
