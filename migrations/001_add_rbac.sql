-- Add role column to users table with default 'Reader'
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'Reader' NOT NULL;

-- Create audit_logs table for tracking role changes and content actions
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    performed_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update posts table to include status and approval workflow
ALTER TABLE posts ADD COLUMN status VARCHAR(20) DEFAULT 'draft' NOT NULL;
ALTER TABLE posts ADD COLUMN submitted_at TIMESTAMP;
ALTER TABLE posts ADD COLUMN reviewed_by INTEGER REFERENCES users(user_id);
ALTER TABLE posts ADD COLUMN fact_checked_by INTEGER REFERENCES users(user_id);
ALTER TABLE posts ADD COLUMN approved_by INTEGER REFERENCES users(user_id);

-- Update existing posts to 'published' status
UPDATE posts SET status = 'published' WHERE status IS NULL;

-- Add constraints to ensure only approved posts are visible
-- This will be enforced in application logic as well