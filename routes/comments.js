const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
};

router.post('/:postId', requireAuth, async (req, res) => {
    const { content } = req.body;
    await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)', [req.params.postId, req.session.userId, content]);
    res.redirect('/posts/' + req.params.postId);
});

module.exports = router;