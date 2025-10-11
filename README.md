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

## Deployment on Vercel
1. Push your code to a Git repository (GitHub, GitLab, etc.).
2. Connect your repository to Vercel.
3. In Vercel dashboard, set the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: A secure secret key for sessions
   - `NODE_ENV`: production
4. Deploy. Vercel will automatically detect the `vercel.json` and deploy the Express app.