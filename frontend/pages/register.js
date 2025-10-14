import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { register } from '../services/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      window.alert('Sign up successful! Please sign in.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";
  const buttonStyles = "w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800";
  const labelStyles = "block text-sm font-bold mb-1";

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelStyles}>Email Address</label>
          <input
            type="email"
            className={inputStyles}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelStyles}>Password</label>
          <input
            type="password"
            className={inputStyles}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button disabled={loading} className={buttonStyles}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-bold underline hover:text-gray-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
