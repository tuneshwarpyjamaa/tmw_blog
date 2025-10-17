// components/PostCard.jsx
import Link from 'next/link';

const PostCard = ({ post, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Link href={`/post/${encodeURIComponent(post.slug)}`} className="group block">
        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 text-sm leading-tight">
          {post.title}
        </h4>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link href={`/post/${encodeURIComponent(post.slug)}`} className="group block py-3 border-b border-gray-100 last:border-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {(post.content || '').slice(0, 120)}...
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <span>By {post.author || 'Staff Writer'}</span>
          <span className="mx-2">•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/post/${encodeURIComponent(post.slug)}`} className="group block">
        <div className="bg-gray-200 rounded-lg h-40 mb-3 flex items-center justify-center overflow-hidden">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="text-gray-500 bg-gray-300 w-full h-full flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
          {(post.content || '').slice(0, 100)}...
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/post/${encodeURIComponent(post.slug)}`} className="group block">
      <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-500 bg-gray-300 w-full h-full flex items-center justify-center">
            <span>No Image</span>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
        {post.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
        {(post.content || '').slice(0, 150)}...
      </p>
      <div className="flex items-center text-xs text-gray-500">
        <span>By {post.author || 'Staff Writer'}</span>
        <span className="mx-2">•</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </Link>
  );
};

export default PostCard;