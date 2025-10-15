import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

const FullLayout = ({ posts }) => {
  // Post distribution for news layout
  const heroPost = posts[0] || null;
  const latestNewsPosts = posts.slice(1, 6);
  const featuredPosts = posts.slice(6, 12);
  const moreStoriesPosts = posts.slice(12);

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* Main Hero Section - More compact */}
      <section className="mb-8 border-b border-gray-200 pb-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Main Hero Content */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* Hero Text */}
              <div className="col-span-12 md:col-span-6">
                {heroPost ? (
                  <Link href={`/post/${encodeURIComponent(heroPost.slug)}`} className="group">
                    <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {heroPost.title}
                    </h1>
                    <p className="text-gray-700 text-base leading-relaxed mb-3 line-clamp-3">
                      {(heroPost?.content || '').slice(0, 200)}...
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>By {heroPost?.author || 'Staff Writer'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-400">No featured post</span>
                  </div>
                )}
              </div>

              {/* Hero Image */}
              <div className="col-span-12 md:col-span-6">
                {heroPost ? (
                  <Link href={`/post/${encodeURIComponent(heroPost.slug)}`}>
                    <div className="w-full h-48 md:h-56 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity overflow-hidden">
                      <div className="text-gray-500 bg-gray-300 w-full h-full flex items-center justify-center">
                        <span>Image: {heroPost.title}</span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="w-full h-48 md:h-56 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Latest News Sidebar - More compact */}
          <aside className="col-span-12 lg:col-span-4 border-l border-gray-200 pl-4 lg:pl-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide text-sm">Latest News</h3>
              <span className="text-gray-400 text-lg">›</span>
            </div>
            <ul className="space-y-3">
              {latestNewsPosts.length > 0 ? (
                latestNewsPosts.map((p, index) => (
                  <li key={p._id} className={`pb-3 ${index < latestNewsPosts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <PostCard post={p} variant="compact" />
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm py-2">No latest news</li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      {/* Featured Posts Grid - More dense */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Featured Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredPosts.length > 0 ? (
            featuredPosts.slice(0, 6).map((p) => (
              <PostCard key={p._id} post={p} variant="featured" />
            ))
          ) : (
            <div className="col-span-3 text-gray-500 text-center py-4">
              No featured stories available
            </div>
          )}
        </div>
      </section>

      {/* More Stories Section - If we have additional posts */}
      {moreStoriesPosts.length > 0 && (
        <section className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">More Stories</h2>
              <div className="grid gap-4">
                {moreStoriesPosts.map((p) => (
                  <PostCard key={p._id} post={p} variant="list" />
                ))}
              </div>
            </div>
            
            {/* Newsletter Signup or Ads */}
            <div className="col-span-12 md:col-span-4">
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Subscribe to our newsletter</h3>
                <p className="text-sm text-gray-600 mb-3">Get the latest news delivered to your inbox</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-r hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const SimpleLayout = ({ posts }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (e) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-red-600 bg-red-50 p-4 rounded border border-red-200">
      {error}
    </div>
  );
  
  if (posts.length === 0) return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-500 text-center">
      No posts found.
    </div>
  );

  // Use FullLayout when we have enough posts, otherwise SimpleLayout
  return posts.length >= 7 ? <FullLayout posts={posts} /> : <SimpleLayout posts={posts} />;
}