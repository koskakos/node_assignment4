const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const ejs = require('ejs');

const app = express();

mongoose.connect('mongodb+srv://koskakos:12345@cluster0.ogigjhg.mongodb.net/news', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secretKEY',
    resave: false,
    saveUninitialized: false
}));



app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Pass null as the error variable
});

app.get('/register', (req, res) => {
    res.render('register', { error: null }); // Render the register.ejs view
});

app.get('/admin', authMiddleware.isAdmin, (req, res) => {
    const user = req.session.user;
    res.render('admin', { user });
});

app.use('/auth', authRoutes); // Authentication routes
app.use('/admin', adminRoutes); // Admin routes
app.use('/news', newsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
