const User = require('../models/User');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
}

async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user = {
            _id: user._id,
            username: user.username,
            role: user.role
        };

        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
}

function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.render('login', { error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
