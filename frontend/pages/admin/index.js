import { useState } from 'react';
import api, { setAuthToken } from '@/services/api';

export default function AdminPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuthToken(data.token);
      setSuccess('Logged in. Token saved. You can now create/edit posts via API.');
    } catch (e) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
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
    </div>
  );
}
