import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';

const FullLayout = ({ posts }) => {
  const featuredPost = posts[0];
  const mainStory = posts[1];
  const sideStories = posts.slice(2, 4);
  const rightColumnStories = posts.slice(4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Left and Middle Columns */}
      <div className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column (Featured Post and 2 side stories) */}
          <div className="md:col-span-1">
            {featuredPost && <PostCard post={featuredPost} variant="featured" />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-8 mt-8">
              {sideStories.map(post => (
                <PostCard key={post._id} post={post} variant="side" />
              ))}
            </div>
          </div>

          {/* Middle Column (Main Story) */}
          <div className="md:col-span-1">
            {mainStory && <PostCard post={mainStory} variant="main" />}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:col-span-1 border-l border-gray-300 pl-8">
        <div className="space-y-6">
          {rightColumnStories.map(post => (
            <PostCard key={post._id} post={post} variant="list" />
          ))}
        </div>
      </div>
    </div>
  );
};

const SimpleLayout = ({ posts }) => (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {posts.map((p) => (
      <PostCard key={p._id} post={p} />
    ))}
  </div>
);


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
