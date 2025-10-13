# The Mandate Wire

## Product Overview
The Mandate Wire is a simple blog website that allows users to create, publish, and read blog posts. Users can register, log in, comment on posts, and browse posts by categories or tags. The website aims to provide a clean, user-friendly platform for blogging and reader engagement.

## Business Objectives
- Provide a minimalistic blogging platform for writers to share articles easily.
- Encourage community interaction through commenting.
- Support content organization via tags or categories.
- Ensure a scalable and maintainable codebase using PostgreSQL for data storage.
- Deliver a responsive design accessible on desktop and mobile.

## Target Users & Use Cases
**User Persona:** Casual bloggers or writers looking to share articles.

**Reader Persona:** Visitors who enjoy reading blog content and engaging with authors through comments.

**Use Cases:**
- User registration and authentication.
- Writing, editing, and publishing blog posts.
- Browsing posts by date or category/tag.
- Commenting on articles.

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up PostgreSQL database and update `.env` with `DATABASE_URL`.
4. Start the server: `npm start`

## Security Features
This application includes production-ready security features:
- **Helmet.js** security headers (CSP, HSTS, XSS protection)
- **Rate limiting** on authentication endpoints
- **Input validation** and sanitization
- **XSS protection** with output encoding
- **Secure session management** with proper cookie flags
- **CORS configuration** for production deployment

## Deployment on Vercel

### Prerequisites
- Vercel account
- PostgreSQL database (e.g., Neon, Supabase, or Railway)
- Git repository

### Deployment Steps (Updating Existing Deployment)
1. **Commit and push your changes** to your Git repository

2. **Automatic Redeployment**:
   - Vercel will automatically detect changes in your repository
   - A new deployment will start automatically
   - You'll see the build progress in your Vercel dashboard

3. **Verify Environment Variables** are still set in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://username:password@hostname:5432/database_name
   SECRET_KEY=your-super-secure-secret-key-here
   NODE_ENV=production
   ```

4. **Monitor the deployment**:
   - Check the "Deployments" tab in your Vercel project
   - Wait for the "Ready" status before testing
   - Your updated app will be available at your existing URL

### What to Expect After Update
- **Improved Security**: Enhanced protection against XSS, injection attacks, and session hijacking
- **Better Performance**: Optimized database connections and error handling
- **Health Monitoring**: New `/health` endpoint for uptime monitoring
- **Production Optimizations**: Proper SSL configuration and security headers

### Post-Deployment Steps
1. **Set up your PostgreSQL database** with the required tables (users, posts, comments)
2. **Test your deployment** by visiting the URL
3. **Monitor your app** using Vercel's dashboard and the `/health` endpoint
4. **Set up custom domain** (optional) in Vercel settings

### Health Check
Your deployed app includes a health check endpoint at `/health` that you can use for monitoring:
- Returns `200 OK` with database connectivity status
- Useful for uptime monitoring services

### Environment Variables Explained
- `DATABASE_URL`: PostgreSQL connection string (get from your database provider)
- `SECRET_KEY`: Random 32+ character string for session encryption
- `NODE_ENV`: Set to "production" for production deployment

### Database Setup
Ensure your PostgreSQL database has the following tables:
```sql
-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    author_id INTEGER REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'published',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(post_id),
    user_id INTEGER REFERENCES users(user_id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```