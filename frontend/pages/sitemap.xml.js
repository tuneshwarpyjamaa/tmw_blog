import api from '@/services/api';

function generateSiteMap(posts, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://yourdomain.com</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${categories
       .map(({ slug }) => {
         return `
       <url>
           <loc>https://yourdomain.com/category/${slug}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
     ${posts
       .map(({ slug, createdAt }) => {
         return `
        <url>
            <loc>https://yourdomain.com/post/${slug}</loc>
            <lastmod>${new Date(createdAt).toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      api.get('/posts'),
      api.get('/categories')
    ]);

    const posts = postsRes.data || [];
    const categories = categoriesRes.data || [];

    const sitemap = generateSiteMap(posts, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;