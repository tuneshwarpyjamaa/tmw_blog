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

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";
  const buttonStyles = "bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800";
  const labelStyles = "block text-sm font-bold mb-1";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold border-b pb-4 mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={onPostSubmit} className="space-y-4">
              <div>
                <label className={labelStyles}>Title</label>
                <input className={inputStyles} value={postData.title} onChange={(e)=>setPostData({...postData, title: e.target.value})} required />
              </div>
              <div>
                <label className={labelStyles}>Slug</label>
                <input className={inputStyles} value={postData.slug} onChange={(e)=>setPostData({...postData, slug: e.target.value})} required />
              </div>
              <div>
                <label className={labelStyles}>Content</label>
                <textarea className={`${inputStyles} h-40`} value={postData.content} onChange={(e)=>setPostData({...postData, content: e.target.value})} required />
              </div>
              <div>
                <label className={labelStyles}>Category</label>
                <select className={inputStyles} value={postData.categorySlug} onChange={(e)=>setPostData({...postData, categorySlug: e.target.value})} required>
                  <option value="">Select a category</option>
                  {categories.map(cat => (<option key={cat.id} value={cat.slug}>{cat.name}</option>))}
                </select>
              </div>
              <div>
                <label className={labelStyles}>Author</label>
                <input className={inputStyles} value={postData.author} onChange={(e)=>setPostData({...postData, author: e.target.value})} />
              </div>
              <div>
                <label className={labelStyles}>Image URL (optional)</label>
                <input className={inputStyles} value={postData.image} onChange={(e)=>setPostData({...postData, image: e.target.value})} />
              </div>
              <button disabled={postLoading} className={buttonStyles}>
                {postLoading ? 'Creating...' : 'Create Post'}
              </button>
            </form>
            {postError && <div className="text-red-600 mt-4">{postError}</div>}
            {postSuccess && <div className="text-green-800 mt-4">{postSuccess}</div>}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Existing Posts</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-sm text-gray-600">Slug: {post.slug} | Category: {post.categoryId.name}</p>
                  </div>
                  <button onClick={() => deletePost(post.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
}
