import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';

export default function AdminPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    content: '',
    categorySlug: '',
    author: 'Admin',
    image: ''
  });
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

  async function fetchCategories() {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuthToken(data.token);
      setIsLoggedIn(true);
      setSuccess('Logged in successfully. You can now create posts.');
      console.log('Login successful, isLoggedIn set to true');
    } catch (e) {
      setError('Login failed');
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function onPostSubmit(e) {
    e.preventDefault();
    setPostLoading(true);
    setPostError('');
    setPostSuccess('');
    try {
      await api.post('/posts', postData);
      setPostSuccess('Post created successfully!');
      setPostData({
        title: '',
        slug: '',
        content: '',
        categorySlug: '',
        author: 'Admin',
        image: ''
      });
    } catch (e) {
      setPostError('Failed to create post');
    } finally {
      setPostLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>
      <p>isLoggedIn: {isLoggedIn ? 'true' : 'false'}</p>

      {!isLoggedIn ? (
        <>
          <h2 className="text-xl font-medium mb-4">Login</h2>
          <form onSubmit={onSubmit} className="space-y-3 mb-8">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <div className="text-red-600 mt-3">{error}</div>}
          {success && <div className="text-green-600 mt-3">{success}</div>}
        </>
      ) : (
        <>
          <h2 className="text-xl font-medium mb-4">Create New Post</h2>
          <form onSubmit={onPostSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={postData.title}
                onChange={(e)=>setPostData({...postData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Slug</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={postData.slug}
                onChange={(e)=>setPostData({...postData, slug: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Content</label>
              <textarea
                className="w-full border rounded px-3 py-2 h-32"
                value={postData.content}
                onChange={(e)=>setPostData({...postData, content: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={postData.categorySlug}
                onChange={(e)=>setPostData({...postData, categorySlug: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Author</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={postData.author}
                onChange={(e)=>setPostData({...postData, author: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Image URL (optional)</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={postData.image}
                onChange={(e)=>setPostData({...postData, image: e.target.value})}
              />
            </div>
            <button disabled={postLoading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
              {postLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
          {postError && <div className="text-red-600 mt-3">{postError}</div>}
          {postSuccess && <div className="text-green-600 mt-3">{postSuccess}</div>}
        </>
      )}
    </div>
  );
}
