import Link from 'next/link';
import Image from 'next/image';

const PostImage = ({ src, alt, width, height, className, variant }) => {
  const placeholder = `https://placehold.co/${width}x${height}/EEE/31343C`;
  const imageSrc = src || placeholder;

  if (variant === 'list') return null;

  return <Image src={imageSrc} alt={alt} width={width} height={height} className={className} />;
};

export default function PostCard({ post, variant = 'default' }) {
  const { title, slug, content, categoryId, createdAt, image } = post;
  const date = new Date(createdAt || Date.now()).toLocaleDateString();
  const summary = (content || '').slice(0, 160) + '...';

  const CategoryLink = () => (
    <>
      <span className="mx-2">|</span>
      <Link
        href={`/category/${categoryId.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="underline hover:text-gray-800"
      >
        {categoryId.name}
      </Link>
    </>
  );

  const renderContent = () => {
    switch (variant) {
      case 'featured':
        return (
          <article className="group cursor-pointer">
            <PostImage src={image} alt={title} width={800} height={600} className="w-full mb-4" />
            <h2 className="text-3xl font-bold mb-2 group-hover:underline">{title}</h2>
            <p className="text-gray-700 mb-2">{summary}</p>
            <div className="text-sm text-gray-600">
              <span>{date}</span>
              {categoryId?.name && <CategoryLink />}
            </div>
          </article>
        );

      case 'main':
        return (
          <article className="group cursor-pointer">
            <PostImage src={image} alt={title} width={1200} height={800} className="w-full mb-4" />
            <h1 className="text-5xl font-extrabold leading-tight mb-4 group-hover:underline">{title}</h1>
            <p className="text-lg text-gray-800 mb-4">{summary}</p>
            <div className="text-sm text-gray-600">
              <span>{date}</span>
              {categoryId?.name && <CategoryLink />}
            </div>
          </article>
        );

      case 'side':
        return (
          <article className="group cursor-pointer">
             <PostImage src={image} alt={title} width={400} height={300} className="w-full mb-2" />
            <h3 className="text-xl font-bold mb-2 group-hover:underline">{title}</h3>
            <div className="text-xs text-gray-600">
              <span>{date}</span>
              {categoryId?.name && <CategoryLink />}
            </div>
          </article>
        );

      case 'list':
        return (
          <article className="group cursor-pointer border-t border-gray-300 pt-4">
            <h3 className="text-lg font-bold group-hover:underline">{title}</h3>
            <p className="text-sm text-gray-700 line-clamp-2 mt-1">{summary}</p>
            <div className="text-xs text-gray-600 mt-2">
              <span>{date}</span>
              {categoryId?.name && <CategoryLink />}
            </div>
          </article>
        );

      default:
        return (
          <article className="group cursor-pointer">
            <PostImage src={image} alt={title} width={640} height={360} className="w-full mb-4" />
            <div className="text-sm text-gray-500 mb-2">
              <span>{date}</span>
              {categoryId?.name && <CategoryLink />}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:underline">{post.title}</h3>
            <p className="text-gray-600 line-clamp-3">{summary}</p>
          </article>
        );
    }
  };

  return <Link href={`/post/${slug}`}>{renderContent()}</Link>;
}
