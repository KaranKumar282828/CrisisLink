import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    search: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const updateUserStatus = async (userId, isActive) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: isActive });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="volunteer">Volunteers</option>
            <option value="admin">Admins</option>
          </select>
          
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading users...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'volunteer' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => updateUserStatus(user._id, !user.isActive)}
                        className={`px-3 py-1 rounded text-sm ${
                          user.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="p-6 border-t">
              <div className="flex justify-between items-center">
                <span>Showing {users.length} of {pagination.total} users</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {filters.page} of {pagination.pages}</span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page === pagination.pages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}