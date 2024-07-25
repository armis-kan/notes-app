const express = require('express');
const db = require('../db');
const { OpenAI } = require('openai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticateUser);

const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tmpDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,

});

router.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    const userId = await db.getUserById(req.user.user_id);
    if (userId === undefined) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        res.json({ generatedText: response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating text');
    }
});

router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
    }

    const userId = await db.getUserById(req.user.user_id);
    if (userId === undefined) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const audioFilePath = req.file.path;

    try {
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: 'whisper-1',
        });

        fs.unlinkSync(audioFilePath);
        res.json({ transcript: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing audio');

        if (fs.existsSync(audioFilePath)) {
            fs.unlinkSync(audioFilePath);
        }
    }
});

module.exports = router;