import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';

const FullLayout = ({ posts }) => {
  const mainStories = posts.slice(0, 5); // For the left column
  const highValueStories = posts.slice(5, 7); // For the middle column
  const utilityStories = posts.slice(7); // For the right column

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Column 1 (Main/Left) Feature Well */}
      <div className="col-span-12 md:col-span-5">
        <div className="space-y-8">
          {mainStories.map((post, index) => (
            <PostCard key={post._id} post={post} variant={index === 0 ? 'featured' : 'side'} />
          ))}
        </div>
      </div>

      {/* Column 2 (Middle/Mixed) High-Value Modules */}
      <div className="col-span-12 md:col-span-4">
        <div className="space-y-8">
          {highValueStories.map(post => (
            <PostCard key={post._id} post={post} variant="main" />
          ))}
        </div>
      </div>

      {/* Column 3 (Side Rail/Right) Utility & Engagement */}
      <div className="col-span-12 md:col-span-3 border-l border-gray-300 pl-8">
        <div className="space-y-6">
          {utilityStories.map(post => (
            <PostCard key={post._id} post={post} variant="list" />
          ))}
        </div>
      </div>
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

  return posts.length >= 5 ? <FullLayout posts={posts} /> : <SimpleLayout posts={posts} />;
}
