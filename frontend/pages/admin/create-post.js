import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await api.post('/posts', { title, content });
      router.push('/admin');
    } catch (e) {
      setError('Failed to create post');
    }
  }

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500";
  const buttonStyles = "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new article for the blog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={inputStyles}
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button type="submit" className={buttonStyles}>
          Create Post
        </button>
      </form>
    </div>
  );
}