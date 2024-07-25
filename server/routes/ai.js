const express = require('express');
const db = require('../db');
const { OpenAI } = require('openai');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { Readable } = require('stream');
const authenticateUser = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticateUser);

const storage = multer.memoryStorage();
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

    const audioBuffer = req.file.buffer;

    try {
        const form = new FormData();
        form.append('file', Readable.from(audioBuffer), { filename: 'audio.mp3' });
        form.append('model', 'whisper-1');

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            body: form,
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                ...form.getHeaders()
            }
        });

        if (!response.ok) {
            throw new Error('Error with OpenAI API');
        }

        const result = await response.json();
        res.json({ transcript: result.text });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing audio');
    }
});

module.exports = router;