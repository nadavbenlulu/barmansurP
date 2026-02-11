const express = require('express');
const router = express.Router();
const Url = require('../models/Url');

// יצירת קישור מקוצר
router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    // יצירת קוד רנדומלי בן 6 תווים
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    try {
        const newUrl = new Url({ longUrl, shortCode });
        await newUrl.save();
        res.json({ shortUrl: `${req.headers.host}/${shortCode}` });
    } catch (err) {
        res.status(500).json({ error: "שגיאת שרת" });
    }
});

module.exports = router;