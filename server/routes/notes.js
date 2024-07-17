const express = require('express');
const db = require('../db');
const authenticateUser = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticateUser);

router.get('/mynotes', async (req, res) => {
    const userId = req.user.user_id;
    try {
        const notes = await db.getNotesByUserId(userId);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get note by ID
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const note = await db.getNoteById(id);
//         if (!note) {
//             return res.status(404).json({ error: 'Note not found' });
//         }
//         res.status(200).json(note);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Create a new note
router.post('/create', async (req, res) => {
    const { title, content, background_color, text_color } = req.body;
    const userId = req.user.user_id;
    try {

        if (userId !== req.user.user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const note = await db.createNote(title, content, background_color, text_color, userId);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a note by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, background_color, text_color } = req.body;
    try {
        const note = await db.getNoteById(id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.user_id !== req.user.user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedNote = await db.updateNote(id, title, content, background_color, text_color);
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a note by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await db.getNoteById(id);
        
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.user_id !== req.user.user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await db.deleteNote(id);
        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
