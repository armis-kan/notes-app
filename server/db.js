const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
    }
});

pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected successfully to PostgreSQL database');
    }
});

// users table

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    return result.rows[0];
};

const getUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
};

const updateUserBio = async (username, bio) => {
    const result = await pool.query('UPDATE users SET bio = $1 WHERE username = $2', [bio, username]);
    return result.rows[0];
};

const updateUserUsername = async (username, changedUsername) => {
    const result = await pool.query('UPDATE users SET username = $1 WHERE username = $2 RETURNING *', [changedUsername, username]);
    return result.rows[0];
}

const updateUserProfilePicture = async (username, filePath) => {
    const result = await pool.query('UPDATE users SET profile_picture = $1 WHERE username = $2 RETURNING *', [filePath, username]);
    return result.rows[0];
};

// notes table

const getNoteById = async (id) => {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    return result.rows[0];
}

const getNotesByUserId = async (userId) => {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
};

const createNote = async (title, content, background_color, text_color, userId) => {
    const updatedAt = new Date().toUTCString();
    const result = await pool.query('INSERT INTO notes (title, content, updated_at, background_color, text_color, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, content, updatedAt, background_color, text_color, userId]);
    return result.rows[0];
};

const updateNote = async (id, title, content, background_color, text_color) => {
    updatedAt = new Date();
    const result = await pool.query('UPDATE notes SET title = $1, content = $2, updated_at = $3, background_color = $4, text_color = $5 WHERE id = $6 RETURNING *', [title, content, updatedAt, background_color, text_color, id]);
    return result.rows[0];
};

const deleteNote = async (id) => {
    const result = await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    return result.rows[0];
};

module.exports = {
    createUser,
    getUserByUsername,
    updateUserBio,
    updateUserUsername,
    updateUserProfilePicture,
    getNoteById,
    getNotesByUserId,
    createNote,
    updateNote,
    deleteNote,
};

