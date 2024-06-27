const express = require('express');
const db = require('../db');
const authenticateUser = require('../middleware/authenticate');
const upload = require('../utils/upload');

const router = express.Router();

router.use(authenticateUser);

// Create user

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await db.createUser(username, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by JWT token
router.get('/', async (req, res) => {
    const username = req.user.username;
    try {
        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user bio
router.put('/update-bio', authenticateUser, async (req, res) => {
    const { username } = req.user;
    const { bio } = req.body;
    try {
        const updatedUser = await db.updateUserBio(username, bio);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user username
router.put('/update-username', authenticateUser, async (req, res) => {
    const { username } = req.user;
    const { changedUsername } = req.body;
    try {
        const updatedUser = await db.updateUserUsername(username, changedUsername);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload profile picture
// router.post('/upload-profile-picture', async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             res.status(400).send({ message: err });
//         } else {
//             if (req.file == undefined) {
//                 res.status(400).send({ message: 'No file selected!' });
//             } else {
//                 try {
//                     const username = req.user.username;
//                     const filePath = `/uploads/profile_pictures/${req.file.filename}`;
                    
//                     const result = await db.updateUserProfilePicture(username, filePath);

//                     res.status(200).send({
//                         message: 'File uploaded!',
//                         filePath: filePath,
//                         user: result
//                     });
//                 } catch (error) {
//                     res.status(500).send({ message: 'Database update failed!', error });
//                 }
//             }
//         }
//     });
// });

// Delete user

router.delete('/profile', authenticateUser, async (req, res) => {
    const { username } = req.user; // From authenticated middleware
    try {
        await db.deleteUser(username);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
