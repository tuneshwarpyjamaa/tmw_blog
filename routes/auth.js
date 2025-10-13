const express = require('express');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.'
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', authLimiter, [
    body('username').isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { error: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query('INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, 'Reader']);
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

router.post('/login', authLimiter, [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', { error: errors.array()[0].msg });
    }

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