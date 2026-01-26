import React, { useState, useEffect } from 'react';
import { 
    Users as UsersIcon,
    Search,
    Edit2,
    Trash2,
    Eye,
    Shield,
    Mail,
    Phone,
    Calendar,
    UserCheck,
    UserX,
    Plus
} from 'lucide-react';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}api/user`);
            const data = await response.json();
            console.log('Fetched users:', data);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${API_URL}api/user/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setUsers(users.filter(u => u._id !== id));
                alert('User deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await fetch(`${API_URL}api/user/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                fetchUsers();
                alert('User role updated successfully');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user role');
        }
    };

    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber?.includes(searchTerm);

        const matchesRole = 
            filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role) => {
        const colors = {
            Admin: 'bg-red-100 text-red-800',
            Merchant: 'bg-blue-100 text-blue-800',
            Member: 'bg-green-100 text-green-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getProviderBadge = (provider) => {
        const badges = {
            email: '📧 Email',
            google: '🔵 Google',
            facebook: '🔷 Facebook'
        };
        return badges[provider] || provider;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Merchant">Merchant</option>
                        <option value="Member">Member</option>
                    </select>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-red-600">
                        {users.filter(u => u.role === 'Admin').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Merchants</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {users.filter(u => u.role === 'Merchant').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Members</p>
                    <p className="text-2xl font-bold text-green-600">
                        {users.filter(u => u.role === 'Member').length}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Provider
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {user.avatar ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.avatar}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-500 font-medium">
                                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            {user.email && (
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail size={14} className="mr-2 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            )}
                                            {user.phoneNumber && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone size={14} className="mr-2 text-gray-400" />
                                                    {user.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {getProviderBadge(user.provider)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                                            className={`text-xs font-medium px-3 py-1 rounded-full border-0 ${getRoleColor(user.role)}`}
                                        >
                                            <option value="Member">Member</option>
                                            <option value="Merchant">Merchant</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-2 text-gray-400" />
                                            {formatDate(user.created)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => viewUserDetails(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <UsersIcon className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No users found</p>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">User Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Profile */}
                            <div className="flex items-center gap-4">
                                {selectedUser.avatar ? (
                                    <img
                                        className="h-20 w-20 rounded-full"
                                        src={selectedUser.avatar}
                                        alt=""
                                    />
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-2xl font-medium">
                                            {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-xl font-semibold">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(selectedUser.role)}`}>
                                        <Shield size={14} className="mr-1" />
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>

                            {/* User Information */}
                            <div>
                                <h4 className="font-semibold mb-2">Account Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">User ID:</span> {selectedUser._id}</p>
                                    <p><span className="font-medium">Email:</span> {selectedUser.email || 'N/A'}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber || 'N/A'}</p>
                                    <p><span className="font-medium">Provider:</span> {getProviderBadge(selectedUser.provider)}</p>
                                    <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                                    <p><span className="font-medium">Joined:</span> {formatDate(selectedUser.created)}</p>
                                    {selectedUser.updated && (
                                        <p><span className="font-medium">Last Updated:</span> {formatDate(selectedUser.updated)}</p>
                                    )}
                                </div>
                            </div>

                            {/* Social IDs */}
                            {(selectedUser.googleId || selectedUser.facebookId) && (
                                <div>
                                    <h4 className="font-semibold mb-2">Social Accounts</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        {selectedUser.googleId && (
                                            <p><span className="font-medium">Google ID:</span> {selectedUser.googleId}</p>
                                        )}
                                        {selectedUser.facebookId && (
                                            <p><span className="font-medium">Facebook ID:</span> {selectedUser.facebookId}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Merchant Info */}
                            {selectedUser.merchant && (
                                <div>
                                    <h4 className="font-semibold mb-2">Merchant Information</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p><span className="font-medium">Merchant ID:</span> {selectedUser.merchant}</p>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Edit User
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedUser._id);
                                        setShowModal(false);
                                    }}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersAdmin;