import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import Head from 'next/head';

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

  const postUrl = `https://yourdomain.com/post/${post.slug}`;
  const postImage = post.image || 'https://yourdomain.com/default-post-image.jpg';
  const postDescription = (post.content || '').slice(0, 160).replace(/<[^>]*>/g, '');
  const publishedDate = new Date(post.createdAt).toISOString();

  return (
    <>
      <Head>
        <title>{post.title} | TMW Blog</title>
        <meta name="description" content={postDescription} />
        <meta name="keywords" content={`news, blog, ${post.categoryId?.name || 'article'}, TMW`} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={postImage} />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:author" content={post.author || 'TMW Blog'} />
        {post.categoryId && <meta property="article:section" content={post.categoryId.name} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": postDescription,
              "image": postImage,
              "datePublished": publishedDate,
              "author": {
                "@type": "Person",
                "name": post.author || "Staff Writer"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TMW Blog"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              }
            })
          }}
        />
      </Head>
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
    </>
  );
}
