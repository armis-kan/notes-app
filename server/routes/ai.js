const express = require('express');
const db = require('../db');
const { OpenAI } = require('openai');
const authenticateUser = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticateUser);

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

module.exports = router;