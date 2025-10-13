import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data);
      } catch (e) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!post) return null;

  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        <span>{new Date(post.createdAt).toLocaleString()}</span>
        {post.categoryId?.name && (
          <>
            <span className="mx-2">•</span>
            <span>{post.categoryId.name}</span>
          </>
        )}
      </div>
      {post.image && (
        <img src={post.image} alt={post.title} className="rounded mb-4 max-h-96 object-cover w-full" />
      )}
      <div className="whitespace-pre-wrap leading-7">{post.content}</div>
    </article>
  );
}
