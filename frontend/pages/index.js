import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

const FullLayout = ({ posts }) => {
  const latestPost = posts[0];
  const opinionPosts = posts.slice(1, 6);
  const morePosts = posts.slice(6);

  return (
    <div className="space-y-10">
      {/* Light hero section */}
      <section className="bg-white text-black -mx-4 md:rounded-none rounded-md">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left: Large headline and deck - slightly smaller */}
            <div className="col-span-12 md:col-span-4">
              <article>
                <Link href={`/post/${latestPost?.slug}`} className="hover:opacity-90 transition-opacity">
                  <h1 className="font-serif text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 cursor-pointer">
                    {latestPost?.title}
                  </h1>
                </Link>
                <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
                  {(latestPost?.content || '').slice(0, 180)}...
                </p>
                <p className="mt-6 text-sm text-gray-500">
                  By <span className="font-medium">{latestPost?.author || 'Staff Writer'}</span>
                </p>
              </article>
            </div>

            {/* Center: Feature image (or placeholder) - pushed left with more space */}
            <div className="col-span-12 md:col-span-5 md:-ml-4">
              <Link href={`/post/${latestPost?.slug}`}>
                <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <span className="text-gray-500">Image Placeholder</span>
                </div>
              </Link>
            </div>

            {/* Right: Opinions list - wider */}
            <aside className="col-span-12 md:col-span-3 md:pl-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Opinions</h3>
                <span className="text-gray-400">›</span>
              </div>
              <ul className="space-y-4">
                {opinionPosts.map((p) => (
                  <li key={p._id} className="border-t border-gray-200 pt-4 first:pt-0 first:border-0">
                    <PostCard post={p} variant="list" />
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* More stories section */}
      <section>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {morePosts.slice(0, 6).map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 border-l border-gray-200 pl-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">More Stories</h3>
            <div className="space-y-4">
              {morePosts.slice(6, 14).map((p) => (
                <PostCard key={p._id} post={p} variant="list" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SimpleLayout = ({ posts }) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (posts.length === 0) return <div>No posts found.</div>;

  return posts.length >= 1 ? <FullLayout posts={posts} /> : <SimpleLayout posts={posts} />;
}