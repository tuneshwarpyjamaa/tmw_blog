import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

dotenv.config();

// Connect to database
await connectDB(process.env.DATABASE_URL);

async function run() {
  try {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';

    let admin = await User.findByEmail(adminEmail);
    if (!admin) {
      admin = await User.create({ email: adminEmail, password: adminPassword, role: 'admin' });
      console.log('Created admin', adminEmail);
    }

    const categoriesData = [
      { name: 'News', slug: 'news' },
      { name: 'Technology', slug: 'technology' },
      { name: 'Sports', slug: 'sports' }
    ];

    for (const cat of categoriesData) {
      const existing = await Category.findBySlug(cat.slug);
      if (!existing) {
        await Category.create(cat);
      }
    }
    console.log('Seeded categories');

    const tech = await Category.findBySlug('technology');
    const news = await Category.findBySlug('news');

    const postsData = [
      {
        title: 'Welcome to TMW Blog',
        slug: 'welcome-to-tmw-blog',
        content: 'This is a sample post. Edit or delete it from the admin dashboard.',
        categoryId: news?.id,
        author: 'Admin'
      },
      {
        title: 'Tech Trends 2025',
        slug: 'tech-trends-2025',
        content: 'A brief look at upcoming technology trends.',
        categoryId: tech?.id,
        author: 'Admin'
      }
    ];

    for (const p of postsData) {
      if (!p.categoryId) continue;
      const existing = await Post.findBySlug(p.slug);
      if (!existing) {
        await Post.create(p);
      }
    }
    console.log('Seeded posts');

    console.log('Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

run();
