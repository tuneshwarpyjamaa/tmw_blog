import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import PostCard from '@/components/PostCard';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState({ category: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await api.get(`/categories/${slug}/posts`);
        setData(res.data);
      } catch (e) {
        setError('Category not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{data.category?.name}</h1>
      {data.posts.length === 0 ? (
        <div>No posts yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
