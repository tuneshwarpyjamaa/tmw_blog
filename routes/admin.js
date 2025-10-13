const express = require('express');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const { canManageUsers, logAuditEvent } = require('../middleware/rbac');
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

// Get all users for role management
router.get('/users', canManageUsers, async (req, res) => {
    const result = await pool.query('SELECT user_id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.render('admin-users', { users: result.rows, userId: req.session.userId });
});

// Update user role
router.post('/users/:userId/role', canManageUsers, [
    body('role').isIn(['Reader', 'Contributor', 'Editor', 'Admin']).withMessage('Invalid role')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { role } = req.body;
    const userId = req.params.userId;

    // Prevent admin from demoting themselves
    if (userId == req.session.userId && role !== 'Admin') {
        return res.status(400).json({ error: 'Cannot change your own admin role' });
    }

    const oldRoleResult = await pool.query('SELECT role FROM users WHERE user_id = $1', [userId]);
    if (oldRoleResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('UPDATE users SET role = $1 WHERE user_id = $2', [role, userId]);

    await logAuditEvent(userId, 'ROLE_CHANGE', `Role changed from ${oldRoleResult.rows[0].role} to ${role}`, req.session.userId);

    res.redirect('/admin/users');
});

// Get audit logs
router.get('/audit-logs', canManageUsers, async (req, res) => {
    const result = await pool.query(`
        SELECT al.*, u1.username as affected_user, u2.username as performed_by_user
        FROM audit_logs al
        LEFT JOIN users u1 ON al.user_id = u1.user_id
        LEFT JOIN users u2 ON al.performed_by = u2.user_id
        ORDER BY al.created_at DESC
        LIMIT 100
    `);
    res.render('audit-logs', { logs: result.rows, userId: req.session.userId });
});

// Promote user to Contributor after verification
router.post('/users/:userId/verify', canManageUsers, async (req, res) => {
    const userId = req.params.userId;

    // Check current role
    const userResult = await pool.query('SELECT role FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (userResult.rows[0].role !== 'Reader') {
        return res.status(400).json({ error: 'User is already verified or has higher privileges' });
    }

    await pool.query('UPDATE users SET role = $1 WHERE user_id = $2', ['Contributor', userId]);

    await logAuditEvent(userId, 'USER_VERIFICATION', 'User verified and granted Contributor role', req.session.userId);

    res.redirect('/admin/users');
});

module.exports = router;