import { useState, useEffect } from 'react';
import api, { setAuthToken } from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('tmw_token');
      if (token) {
        setAuthToken(token);
      }
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (e) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleRoleChange(id, role) {
    try {
      await api.put(`/users/${id}/role`, { role });
      fetchUsers(); // Refresh users list
    } catch (e) {
      setError('Failed to update user role');
    }
  }

  const tableHeaderStyles = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tableCellStyles = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={tableHeaderStyles}>User</th>
              <th className={tableHeaderStyles}>Role</th>
              <th className={tableHeaderStyles}>Joined</th>
              <th className={tableHeaderStyles}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className={tableCellStyles}>{user.email}</td>
                <td className={tableCellStyles}>{user.role}</td>
                <td className={tableCellStyles}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Member">Member</option>
                    <option value="Contributor">Contributor</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}