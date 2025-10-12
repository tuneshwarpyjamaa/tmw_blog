const express = require('express');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
        res.redirect('/auth/login');
    } catch (err) {
        console.error('Registration error:', err);
        let errorMessage = 'Registration failed';
        if (err.code === '23505') { // Unique constraint violation
            if (err.constraint === 'users_username_key') {
                errorMessage = 'Username already exists';
            } else if (err.constraint === 'users_email_key') {
                errorMessage = 'Email already exists';
            }
        }
        res.render('register', { error: errorMessage });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        if (await bcrypt.compare(password, user.password_hash)) {
            req.session.userId = user.user_id;
            res.redirect('/');
        } else {
            res.render('login', { error: 'Invalid credentials' });
        }
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;