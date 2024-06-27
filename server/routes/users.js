const express = require('express');
const db = require('../db');
const authenticateUser = require('../middleware/authenticate');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const config = require('../config/firebaseConfig');
const multer = require('multer');

const router = express.Router();

router.use(authenticateUser);

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

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
router.post("/upload-profile-picture", upload.single("profilePicture"), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}


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
