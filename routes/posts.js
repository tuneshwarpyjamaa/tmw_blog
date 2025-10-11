const express = require('express');
const { Pool } = require('pg');
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

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE posts.status = \'published\' ORDER BY posts.published_at DESC');
    res.render('home', { posts: result.rows, userId: req.session.userId });
});

router.get('/create', requireAuth, (req, res) => {
    res.render('create');
});

router.post('/create', requireAuth, async (req, res) => {
    const { title, content } = req.body;
    await pool.query('INSERT INTO posts (title, content, author_id, status, published_at) VALUES ($1, $2, $3, \'published\', CURRENT_TIMESTAMP)', [title, content, req.session.userId]);
    res.redirect('/posts');
});

router.get('/:postId', async (req, res) => {
    const postResult = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE posts.post_id = $1', [req.params.postId]);
    if (postResult.rows.length === 0) {
        return res.status(404).send('Post not found');
    }
    const commentsResult = await pool.query('SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.user_id WHERE post_id = $1 ORDER BY created_at ASC', [req.params.postId]);
    res.render('post', { post: postResult.rows[0], comments: commentsResult.rows, userId: req.session.userId });
});

router.get('/:postId/edit', requireAuth, async (req, res) => {
    const result = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND author_id = $2', [req.params.postId, req.session.userId]);
    if (result.rows.length > 0) {
        res.render('edit', { post: result.rows[0] });
    } else {
        res.redirect('/posts');
    }
});

router.post('/:postId/edit', requireAuth, async (req, res) => {
    const { title, content } = req.body;
    await pool.query('UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE post_id = $3 AND author_id = $4', [title, content, req.params.postId, req.session.userId]);
    res.redirect('/posts/' + req.params.postId);
});

router.post('/:postId/delete', requireAuth, async (req, res) => {
    await pool.query('DELETE FROM posts WHERE post_id = $1 AND author_id = $2', [req.params.postId, req.session.userId]);
    res.redirect('/posts');
});

module.exports = router;