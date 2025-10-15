import Link from 'next/link';
import Image from 'next/image';

const PostImage = ({ src, alt, width, height, className, variant }) => {
  if (variant === 'list' || !src) return null;

  return <Image src={src} alt={alt} width={width} height={height} className={`${className} rounded-lg shadow-md`} />;
};

export default function PostCard({ post, variant = 'default' }) {
  const { title, slug, content, category_name, category_slug, createdAt, image } = post;
  const date = new Date(createdAt || Date.now()).toLocaleDateString();
  const summary = (content || '').slice(0, 160) + '...';

  const CategoryLink = () => (
    <>
      <span className="mx-2 text-gray-400">•</span>
      <Link
        href={`/category/${category_slug}`}
        onClick={(e) => e.stopPropagation()}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        {category_name}
      </Link>
    </>
  );

  const renderContent = () => {
    switch (variant) {
      case 'featured':
        return (
          <article className="group cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <PostImage src={image} alt={title} width={800} height={600} className="w-full mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">{title}</h2>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">{summary}</p>
            <div className="text-sm text-gray-500 font-medium">
              <span>{date}</span>
              {category_name && <CategoryLink />}
            </div>
          </article>
        );

      case 'main':
        return (
          <article className="group cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <PostImage src={image} alt={title} width={1200} height={800} className="w-full mb-6" />
            <h1 className="text-6xl font-extrabold leading-tight mb-6 text-gray-900 group-hover:text-blue-700 transition-colors">{title}</h1>
            <p className="text-xl text-gray-800 mb-6 leading-relaxed">{summary}</p>
            <div className="text-sm text-gray-500 font-medium">
              <span>{date}</span>
              {category_name && <CategoryLink />}
            </div>
          </article>
        );

      case 'side':
        return (
          <article className="group cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <PostImage src={image} alt={title} width={400} height={300} className="w-full mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">{title}</h3>
            <div className="text-xs text-gray-500 font-medium">
              <span>{date}</span>
              {category_name && <CategoryLink />}
            </div>
          </article>
        );

      case 'list':
        return (
          <article className="group cursor-pointer bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">{title}</h3>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-2">{summary}</p>
            <div className="text-xs text-gray-500 mt-3 font-medium">
              <span>{date}</span>
              {category_name && <CategoryLink />}
            </div>
          </article>
        );

      default:
        return (
          <article className="group cursor-pointer bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
            <PostImage src={image} alt={title} width={640} height={360} className="w-full mb-4" />
            <div className="text-sm text-gray-500 mb-3 font-medium">
              <span>{date}</span>
              {category_name && <CategoryLink />}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">{post.title}</h3>
            <p className="text-gray-600 leading-relaxed line-clamp-3">{summary}</p>
          </article>
        );
    }
  };

  return <Link href={`/post/${slug}`}>{renderContent()}</Link>;
}
