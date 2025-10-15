import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

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
        const { data } = await api.get(`/posts/${encodeURIComponent(slug)}`);
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
    <article className="max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-600 mb-8 border-b pb-4">
        <span>{new Date(post.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
        {post.categoryId?.name && (
          <>
            <span className="mx-2">•</span>
            <Link href={`/category/${post.categoryId.slug}`} className="hover:underline">
              {post.categoryId.name}
            </Link>
          </>
        )}
      </div>
      {post.image && (
        <img src={post.image} alt={post.title} className="rounded mb-8 w-full" />
      )}
      <div className="prose max-w-none text-lg leading-8 text-justify">{post.content}</div>
    </article>
  );
}
