const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const axios = require('axios');

const RECAPTCHA_SECRET_KEY = '6LcWDoIpAAAAAEcsCsL31z5OsneoeMxwlhFMOVmO';

router.post('/register', async (req, res) => {
    const { username, password, 'g-recaptcha-response': token } = req.body;

    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            }
        });

        const { success } = response.data;
        if (!success) {
            return res.status(400).json({ message: 'CAPTCHA verification failed' });
        }

        await authController.registerUser(req, res);
    } catch (error) {
        console.error('CAPTCHA verification error:', error);
        res.status(500).json({ message: 'Failed to verify CAPTCHA' });
    }
});

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);

module.exports = router;
