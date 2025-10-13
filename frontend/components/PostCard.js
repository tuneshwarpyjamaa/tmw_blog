import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <Link href={`/post/${post.slug}`}>
      <article className="group cursor-pointer">
        <div className="text-sm text-gray-500 mb-2">
          <span>{new Date(post.createdAt || post.created_at || Date.now()).toLocaleDateString()}</span>
          {post.categoryId?.name && (
            <>
              <span className="mx-2">•</span>
              <Link
                href={`/category/${post.categoryId.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="underline hover:text-gray-800"
              >
                {post.categoryId.name}
              </Link>
            </>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:underline">{post.title}</h3>
        <p className="text-gray-600 line-clamp-3">{(post.content || '').slice(0, 160)}...</p>
      </article>
    </Link>
  );
}
