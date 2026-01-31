/**
 * Admin Users Management
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'Member',
    password: ''
  });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user`, {
        params: { page: currentPage, limit: 20 }
      });
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'Member',
      password: ''
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'Member',
      password: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await axios.put(`${API_URL}/user/${editingUser._id}`, payload);
      } else {
        // For new users, password is required
        if (!formData.password) {
          alert('Password is required for new users');
          setSaving(false);
          return;
        }
        await axios.post(`${API_URL}/auth/register`, {
          ...payload,
          isAdmin: payload.role === 'Admin'
        });
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.error || 'Error saving user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    try {
      await axios.delete(`${API_URL}/user/${deletingUser._id}`);
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phoneNumber?.includes(search);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProviderIcon = (provider) => {
    switch (provider?.toLowerCase()) {
      case 'google':
        return <i className="fa fa-google" style={{ color: '#db4437' }} />;
      case 'facebook':
        return <i className="fa fa-facebook" style={{ color: '#4267b2' }} />;
      default:
        return <i className="fa fa-envelope" style={{ color: '#6b7280' }} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Merchant':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-page-header">
        <h1>Users</h1>
        <div className="header-actions">
          <button className="btn-admin btn-primary" onClick={openAddModal}>
            <i className="fa fa-plus" /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Merchant">Merchant</option>
          <option value="Member">Member</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty">
            <i className="icon-people" />
            <h3>No users found</h3>
            <p>Add a new user to get started</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Provider</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="image-preview" style={{ borderRadius: '50%' }} />
                        ) : (
                          <div className="image-preview" style={{
                            background: '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%'
                          }}>
                            <i className="fa fa-user" style={{ color: '#9ca3af' }} />
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{user.firstName || '-'} {user.lastName || ''}</strong>
                      </td>
                      <td>{user.email || '-'}</td>
                      <td>{user.phoneNumber || '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        {getProviderIcon(user.provider)}
                      </td>
                      <td>
                        <span className={`status-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role || 'Member'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {formatDate(user.created)}
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-admin btn-sm btn-primary btn-icon"
                            onClick={() => openEditModal(user)}
                            title="Edit"
                          >
                            <i className="fa fa-pencil" />
                          </button>
                          <button
                            className="btn-admin btn-sm btn-danger btn-icon"
                            onClick={() => confirmDelete(user)}
                            title="Delete"
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? 'active' : ''}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" value={formData.role} onChange={handleInputChange}>
                        <option value="Member">Member</option>
                        <option value="Merchant">Merchant</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{editingUser ? 'New Password (leave empty to keep current)' : 'Password *'}</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      minLength={6}
                    />
                    <p className="form-help">Minimum 6 characters</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-body" style={{ padding: '40px 20px' }}>
              <div className="confirm-dialog">
                <div className="confirm-icon">
                  <i className="fa fa-trash" />
                </div>
                <h3>Delete User?</h3>
                <p>Are you sure you want to delete "{deletingUser?.email}"? This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-admin btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
