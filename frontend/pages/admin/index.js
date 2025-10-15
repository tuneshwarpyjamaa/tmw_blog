import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';

export default function AdminPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
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

  async function fetchPosts() {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch posts:', e);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchPosts();
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
      fetchPosts(); // Refresh posts list
    } catch (e) {
      setPostError('Failed to create post');
    } finally {
      setPostLoading(false);
    }
  }

  async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts(); // Refresh posts list
    } catch (e) {
      console.error('Failed to delete post:', e);
    }
  }

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  const buttonStyles = "bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors";
  const labelStyles = "block text-sm font-semibold mb-1 text-gray-700";

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">Manage posts and content</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Create Post Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Create New Post</h2>
          <form onSubmit={onPostSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyles}>Title</label>
                <input 
                  className={inputStyles} 
                  value={postData.title} 
                  onChange={(e)=>setPostData({...postData, title: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className={labelStyles}>Slug</label>
                <input 
                  className={inputStyles} 
                  value={postData.slug} 
                  onChange={(e)=>setPostData({...postData, slug: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Content</label>
              <textarea 
                className={`${inputStyles} h-32`} 
                value={postData.content} 
                onChange={(e)=>setPostData({...postData, content: e.target.value})} 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyles}>Category</label>
                <select 
                  className={inputStyles} 
                  value={postData.categorySlug} 
                  onChange={(e)=>setPostData({...postData, categorySlug: e.target.value})} 
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Author</label>
                <input 
                  className={inputStyles} 
                  value={postData.author} 
                  onChange={(e)=>setPostData({...postData, author: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>Image URL (optional)</label>
              <input 
                className={inputStyles} 
                value={postData.image} 
                onChange={(e)=>setPostData({...postData, image: e.target.value})} 
              />
            </div>

            <button disabled={postLoading} className={`${buttonStyles} w-full py-2.5`}>
              {postLoading ? 'Creating Post...' : 'Create Post'}
            </button>
          </form>
          
          {postError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {postError}
            </div>
          )}
          {postSuccess && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {postSuccess}
            </div>
          )}
        </div>

        {/* Existing Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-lg font-bold">Existing Posts</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {posts.length} posts
            </span>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {posts.map(post => (
              <div key={post.id} className="border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{post.title}</h3>
                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                      <span>Slug: {post.slug}</span>
                      <span>•</span>
                      <span>Category: {post.categoryId?.name || 'Uncategorized'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => deletePost(post.id)} 
                    className="ml-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600 transition-colors flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No posts created yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}