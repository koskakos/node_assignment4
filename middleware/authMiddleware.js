const User = require('../models/User');

function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}

async function isAdmin(req, res, next) {
    try {
        const userId = req.session.user._id;

        const user = await User.findById(userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { isAuthenticated, isAdmin };
