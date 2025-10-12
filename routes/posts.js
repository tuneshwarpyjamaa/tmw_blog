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
    const category = req.query.category;

    let query = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.user_id WHERE posts.status = \'published\'';
    let params = [];

    if (category) {
        query += ' AND posts.category = $1';
        params.push(category);
    }

    query += ' ORDER BY posts.published_at DESC';

    const result = await pool.query(query, params);
    res.render('home', { posts: result.rows, userId: req.session.userId });
});

router.get('/create', requireAuth, (req, res) => {
    res.render('create', { userId: req.session.userId });
});

router.post('/create', requireAuth, async (req, res) => {
    const { title, content, category } = req.body;
    await pool.query('INSERT INTO posts (title, content, category, author_id, status, published_at) VALUES ($1, $2, $3, $4, \'published\', CURRENT_TIMESTAMP)', [title, content, category, req.session.userId]);
    res.redirect('/posts');
});

router.get('/create-sample-posts', requireAuth, async (req, res) => {
    const samplePosts = [
        { title: 'Breaking News: Major Event', content: 'This is a news article about current events.', category: 'News' },
        { title: 'Championship Victory', content: 'Sports team wins the championship.', category: 'Sport' },
        { title: 'Market Analysis Report', content: 'Business market trends and analysis.', category: 'Business' },
        { title: 'Tech Innovation Breakthrough', content: 'New technology innovation announced.', category: 'Innovation' },
        { title: 'Cultural Festival Review', content: 'Review of the annual cultural festival.', category: 'Culture' },
        { title: 'Art Exhibition Opening', content: 'New art exhibition opens to public.', category: 'Arts' },
        { title: 'Travel Guide: Hidden Gems', content: 'Discover hidden travel destinations.', category: 'Travel' },
        { title: 'Climate Change Impact', content: 'Environmental issues and solutions.', category: 'Earth' }
    ];

    for (const post of samplePosts) {
        await pool.query('INSERT INTO posts (title, content, category, author_id, status, published_at) VALUES ($1, $2, $3, $4, \'published\', CURRENT_TIMESTAMP)',
            [post.title, post.content, post.category, req.session.userId]);
    }

    res.redirect('/posts');
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

router.get('/:postId/edit', requireAuth, async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const result = await pool.query('SELECT * FROM posts WHERE post_id = $1 AND author_id = $2', [req.params.postId, req.session.userId]);
    if (result.rows.length > 0) {
        res.render('edit', { post: result.rows[0], userId: req.session.userId });
    } else {
        res.redirect('/posts');
    }
});

router.post('/:postId/edit', requireAuth, async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    const { title, content, category } = req.body;
    await pool.query('UPDATE posts SET title = $1, content = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE post_id = $4 AND author_id = $5', [title, content, category, req.params.postId, req.session.userId]);
    res.redirect('/posts/' + req.params.postId);
});

router.post('/:postId/delete', requireAuth, async (req, res) => {
    // Check if postId is numeric
    if (isNaN(req.params.postId)) {
        return res.status(404).send('Post not found');
    }

    await pool.query('DELETE FROM posts WHERE post_id = $1 AND author_id = $2', [req.params.postId, req.session.userId]);
    res.redirect('/posts');
});

module.exports = router;