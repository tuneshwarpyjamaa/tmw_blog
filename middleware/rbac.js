const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    family: 4,
});

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
};

// Middleware to require specific role
const requireRole = (requiredRole) => {
    return async (req, res, next) => {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        try {
            const result = await pool.query('SELECT role FROM users WHERE user_id = $1', [req.session.userId]);
            if (result.rows.length === 0) {
                return res.status(403).send('User not found');
            }

            const userRole = result.rows[0].role;
            const roleHierarchy = {
                'Reader': 1,
                'Contributor': 2,
                'Editor': 3,
                'Admin': 4
            };

            if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
                return next();
            } else {
                return res.status(403).send('Insufficient permissions');
            }
        } catch (err) {
            console.error('Role check error:', err);
            return res.status(500).send('Internal server error');
        }
    };
};

// Middleware to check if user can create posts (Contributor or higher)
const canCreatePosts = requireRole('Contributor');

// Middleware to check if user can review posts (Editor or higher)
const canReviewPosts = requireRole('Editor');

// Middleware to check if user can manage users (Admin only)
const canManageUsers = requireRole('Admin');

// Function to log audit events
const logAuditEvent = async (userId, action, details, performedBy = null) => {
    try {
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, details, performed_by) VALUES ($1, $2, $3, $4)',
            [userId, action, details, performedBy || userId]
        );
    } catch (err) {
        console.error('Audit logging error:', err);
    }
};

module.exports = {
    requireAuth,
    requireRole,
    canCreatePosts,
    canReviewPosts,
    canManageUsers,
    logAuditEvent
};