require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const hbs = require('express-handlebars');

// ייבוא המודל והראוטרים
const Url = require('./api/v1/models/Url');
const userRouter = require('./api/v1/routes/user');
const linkRouter = require('./api/v1/routes/link');

// הגדרת מנוע התצוגה Handlebars
app.set('views', './api/v1/views');
app.engine('handlebars', hbs.engine({
    layoutsDir: './api/v1/views/layouts',
    partialsDir: './api/v1/views/partials',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// --- Middlewares ---
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- Routes ---

// ראוטר דף הבית
app.get('/', (req, res) => {
    res.render('index'); 
});

// חיבור הראוטרים של המשתמש והקישורים
app.use('/user', userRouter);
app.use('/api/link', linkRouter);

// הפונקציה שמתפעלת את הקישור הקצר (Redirect)
// חשוב שזה יהיה אחרי הראוטרים האחרים כדי לא לחסום אותם
app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.code });
        if (url) {
            url.clicks++; // ספירת לחיצה
            await url.save();
            return res.redirect(url.longUrl); 
        }
        res.status(404).send('הקישור לא נמצא');
    } catch (err) {
        res.status(500).send('שגיאת שרת');
    }
});

// --- התחברות ל-MongoDB ---
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoServer = process.env.MONGO_SERVER;
const mongoConstr = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoServer}/insurance_links`;

mongoose.connect(mongoConstr).then(() => {
    console.log("Connected to MongoDB - Insurance Project");
}).catch(err => console.error("MongoDB Connection Error:", err));

module.exports = app;