const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const { requireAuth, canCreatePosts, canReviewPosts, logAuditEvent } = require('../middleware/rbac');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

router.get('/', async (req, res) => {
    const category = req.query.category;

    let query = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE posts.status = \'approved\'';
    let params = [];

    if (category) {
        query += ' AND posts.category = $1';
        params.push(category);
    }

    query += ' ORDER BY posts.published_at DESC';

    const result = await pool.query(query, params);
    res.render('home', { posts: result.rows, userId: req.session.userId });
});

router.get('/create', canCreatePosts, (req, res) => {
    res.render('create', { userId: req.session.userId });
});

router.post('/create', canCreatePosts, [
    body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters').trim().escape(),
    body('content').isLength({ min: 1 }).withMessage('Content is required').trim(),
    body('category').isLength({ min: 1, max: 50 }).withMessage('Category must be 1-50 characters').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('create', { error: errors.array()[0].msg, userId: req.session.userId });
    }

    const { title, content, category } = req.body;
    const sanitizedContent = xss(content); // Sanitize HTML content
    await pool.query('INSERT INTO posts (title, content, category, author_id, status) VALUES ($1, $2, $3, $4, \'draft\')', [title, sanitizedContent, category, req.session.userId]);

    // Log the creation
    await logAuditEvent(req.session.userId, 'CREATE_POST', `Created draft post: ${title}`);

    res.redirect('/posts/my-drafts');
});

router.get('/my-drafts', canCreatePosts, async (req, res) => {
    const result = await pool.query('SELECT * FROM posts WHERE author_id = $1 AND status = \'draft\' ORDER BY created_at DESC', [req.session.userId]);
    res.render('my-drafts', { posts: result.rows, userId: req.session.userId });
});

router.post('/:postId/submit', canCreatePosts, async (req, res) => {
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    await pool.query('UPDATE posts SET status = \'under_review\', submitted_at = CURRENT_TIMESTAMP WHERE post_id = $1 AND author_id = $2 AND status = \'draft\'', [req.params.postId, req.session.userId]);

    await logAuditEvent(req.session.userId, 'SUBMIT_POST', `Submitted post ${req.params.postId} for review`);

    res.redirect('/posts/my-drafts');
});

router.get('/review-queue', canReviewPosts, async (req, res) => {
    const result = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE status = \'under_review\' ORDER BY submitted_at ASC');
    res.render('review-queue', { posts: result.rows, userId: req.session.userId });
});

router.post('/:postId/review', canReviewPosts, async (req, res) => {
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const { action } = req.body;
    if (action === 'approve') {
        await pool.query('UPDATE posts SET status = \'fact_checked\', reviewed_by = $1 WHERE post_id = $2', [req.session.userId, req.params.postId]);
        await logAuditEvent(req.session.userId, 'REVIEW_POST', `Approved post ${req.params.postId} for fact-checking`);
    } else if (action === 'reject') {
        await pool.query('UPDATE posts SET status = \'draft\' WHERE post_id = $1', [req.params.postId]);
        await logAuditEvent(req.session.userId, 'REVIEW_POST', `Rejected post ${req.params.postId}, returned to draft`);
    }

    res.redirect('/posts/review-queue');
});

router.get('/fact-check-queue', canReviewPosts, async (req, res) => {
    const result = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE status = \'fact_checked\' ORDER BY submitted_at ASC');
    res.render('fact-check-queue', { posts: result.rows, userId: req.session.userId });
});

router.post('/:postId/fact-check', canReviewPosts, async (req, res) => {
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const { action } = req.body;
    if (action === 'approve') {
        await pool.query('UPDATE posts SET status = \'approved\', fact_checked_by = $1, published_at = CURRENT_TIMESTAMP WHERE post_id = $2', [req.session.userId, req.params.postId]);
        await logAuditEvent(req.session.userId, 'FACT_CHECK_POST', `Approved and published post ${req.params.postId}`);
    } else if (action === 'reject') {
        await pool.query('UPDATE posts SET status = \'draft\' WHERE post_id = $1', [req.params.postId]);
        await logAuditEvent(req.session.userId, 'FACT_CHECK_POST', `Rejected post ${req.params.postId}, returned to draft`);
    }

    res.redirect('/posts/fact-check-queue');
});

router.get('/:postId', async (req, res) => {
    // Check if postId is numeric to avoid conflicts with other routes
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const postResult = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE posts.post_id = $1', [req.params.postId]);
    if (postResult.rows.length === 0) {
        return res.status(404).send('Post not found');
    }
    const commentsResult = await pool.query('SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.user_id WHERE post_id = $1 ORDER BY created_at ASC', [req.params.postId]);
    res.render('post', { post: postResult.rows[0], comments: commentsResult.rows, userId: req.session.userId });
});

router.get('/:postId/edit', canCreatePosts, async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const result = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND author_id = $2 AND status = \'draft\'', [req.params.postId, req.session.userId]);
    if (result.rows.length > 0) {
        res.render('edit', { post: result.rows[0], userId: req.session.userId });
    } else {
        res.redirect('/posts/my-drafts');
    }
});

router.post('/:postId/edit', canCreatePosts, [
    body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be 1-200 characters').trim().escape(),
    body('content').isLength({ min: 1 }).withMessage('Content is required').trim(),
    body('category').isLength({ min: 1, max: 50 }).withMessage('Category must be 1-50 characters').trim().escape()
], async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const result = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND author_id = $2', [req.params.postId, req.session.userId]);
        return res.render('edit', { post: result.rows[0], error: errors.array()[0].msg, userId: req.session.userId });
    }

    const { title, content, category } = req.body;
    const sanitizedContent = xss(content); // Sanitize HTML content
    await pool.query('UPDATE posts SET title = $1, content = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE post_id = $4 AND author_id = $5 AND status = \'draft\'', [title, sanitizedContent, category, req.params.postId, req.session.userId]);

    await logAuditEvent(req.session.userId, 'EDIT_POST', `Edited draft post ${req.params.postId}`);

    res.redirect('/posts/my-drafts');
});

router.post('/:postId/delete', canCreatePosts, async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    await pool.query('DELETE FROM posts WHERE post_id = $1 AND author_id = $2 AND status = \'draft\'', [req.params.postId, req.session.userId]);

    await logAuditEvent(req.session.userId, 'DELETE_POST', `Deleted draft post ${req.params.postId}`);

    res.redirect('/posts/my-drafts');
});

module.exports = router;