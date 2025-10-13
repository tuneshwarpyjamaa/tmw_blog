import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <article className="border rounded-lg p-4 hover:shadow transition">
      <h3 className="text-lg font-semibold mb-2">
        <Link href={`/post/${post.slug}`}>{post.title}</Link>
      </h3>
      <div className="text-xs text-gray-500 mb-2">
        <span>{new Date(post.createdAt || post.created_at || Date.now()).toLocaleDateString()}</span>
        {post.categoryId?.name && (
          <>
            <span className="mx-2">•</span>
            <Link className="underline" href={`/category/${post.categoryId.slug}`}>{post.categoryId.name}</Link>
          </>
        )}
      </div>
      <p className="text-gray-700 line-clamp-3">{(post.content || '').slice(0, 160)}...</p>
    </article>
  );
}
