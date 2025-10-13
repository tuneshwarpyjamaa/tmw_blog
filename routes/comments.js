const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
};

router.post('/:postId', requireAuth, [
    body('content').isLength({ min: 1, max: 1000 }).withMessage('Comment must be 1-1000 characters').trim()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirect back with error - in a real app, you'd pass error via session or flash messages
        return res.redirect('/posts/' + req.params.postId + '?error=' + encodeURIComponent(errors.array()[0].msg));
    }

    const { content } = req.body;
    const sanitizedContent = xss(content); // Sanitize HTML content
    await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)', [req.params.postId, req.session.userId, sanitizedContent]);
    res.redirect('/posts/' + req.params.postId);
});

module.exports = router;