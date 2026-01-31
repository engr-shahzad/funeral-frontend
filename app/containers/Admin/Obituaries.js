/**
 * Admin Obituaries Management - Updated with Data Mapping
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants';

// Data mapper utility
const cleanHtmlText = (htmlString) => {
  if (!htmlString) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = htmlString;
  const decoded = txt.value;
  return decoded
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim();
};

const mapObituary = (jsonObituary) => {
  return {
    _id: jsonObituary._id || jsonObituary.ID,
    ID: jsonObituary.ID,
    firstName: jsonObituary.FIRST || jsonObituary.firstName || '',
    middleName: jsonObituary.MIDDLE || jsonObituary.middleName || '',
    lastName: jsonObituary.LAST || jsonObituary.lastName || '',
    birthDate: jsonObituary.DOB || jsonObituary.birthDate || null,
    deathDate: jsonObituary.DOD || jsonObituary.deathDate || null,
    location: jsonObituary.location || '', // Extract from biography if needed
    biography: jsonObituary.OBITUARY ? cleanHtmlText(jsonObituary.OBITUARY) : (jsonObituary.biography || ''),
    photo: jsonObituary.IMAGE || jsonObituary.photo || '',
    serviceType: jsonObituary.serviceType || 'PRIVATE FAMILY SERVICE',
    serviceDate: jsonObituary.serviceDate || null,
    serviceLocation: jsonObituary.serviceLocation || '',
    isPublished: jsonObituary.isPublished !== false,
    embeddedVideo: jsonObituary.EMBEDDEDVIDEO || jsonObituary.embeddedVideo || ''
  };
};

const ObituariesAdmin = () => {
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingObituary, setEditingObituary] = useState(null);
  const [deletingObituary, setDeletingObituary] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    location: '',
    biography: '',
    photo: '',
    serviceType: 'PRIVATE FAMILY SERVICE',
    serviceDate: '',
    serviceLocation: '',
    isPublished: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchObituaries();
  }, []);

  const fetchObituaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/obituaries`);
      
      // Map the obituaries data to the expected format
      let obituariesData = response.data.obituaries || response.data || [];
      
      // If data is not an array, try to extract it
      if (!Array.isArray(obituariesData)) {
        obituariesData = [];
      }
      
      // Map each obituary to the frontend format
      const mappedObituaries = obituariesData.map(mapObituary);
      
      setObituaries(mappedObituaries);
    } catch (error) {
      console.error('Error fetching obituaries:', error);
      setObituaries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setEditingObituary(null);
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      birthDate: '',
      deathDate: '',
      location: '',
      biography: '',
      photo: '',
      serviceType: 'PRIVATE FAMILY SERVICE',
      serviceDate: '',
      serviceLocation: '',
      isPublished: true
    });
    setShowModal(true);
  };

  const openEditModal = (obituary) => {
    setEditingObituary(obituary);
    setFormData({
      firstName: obituary.firstName || '',
      middleName: obituary.middleName || '',
      lastName: obituary.lastName || '',
      birthDate: obituary.birthDate ? obituary.birthDate.split('T')[0] : '',
      deathDate: obituary.deathDate ? obituary.deathDate.split('T')[0] : '',
      location: obituary.location || '',
      biography: obituary.biography || '',
      photo: obituary.photo || '',
      serviceType: obituary.serviceType || 'PRIVATE FAMILY SERVICE',
      serviceDate: obituary.serviceDate ? obituary.serviceDate.split('T')[0] : '',
      serviceLocation: obituary.serviceLocation || '',
      isPublished: obituary.isPublished !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        birthDate: formData.birthDate || null,
        deathDate: formData.deathDate || null,
        serviceDate: formData.serviceDate || null
      };

      if (editingObituary) {
        await axios.put(`${API_URL}/obituaries/${editingObituary._id}`, payload);
      } else {
        await axios.post(`${API_URL}/obituaries`, payload);
      }

      setShowModal(false);
      fetchObituaries();
    } catch (error) {
      console.error('Error saving obituary:', error);
      alert('Error saving obituary. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (obituary) => {
    setDeletingObituary(obituary);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingObituary) return;

    try {
      await axios.delete(`${API_URL}/obituaries/${deletingObituary._id}`);
      setShowDeleteModal(false);
      setDeletingObituary(null);
      fetchObituaries();
    } catch (error) {
      console.error('Error deleting obituary:', error);
      alert('Error deleting obituary. Please try again.');
    }
  };

  const togglePublished = async (obituary) => {
    try {
      await axios.put(`${API_URL}/obituaries/${obituary._id}`, {
        isPublished: !obituary.isPublished
      });
      fetchObituaries();
    } catch (error) {
      console.error('Error toggling obituary status:', error);
    }
  };

  const filteredObituaries = obituaries.filter(obituary => {
    const fullName = `${obituary.firstName} ${obituary.middleName || ''} ${obituary.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      obituary.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter ||
      (statusFilter === 'published' && obituary.isPublished) ||
      (statusFilter === 'draft' && !obituary.isPublished);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return '-';
    try {
      const birth = new Date(birthDate);
      const end = deathDate ? new Date(deathDate) : new Date();
      let age = end.getFullYear() - birth.getFullYear();
      const monthDiff = end.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 0 ? age : '-';
    } catch {
      return '-';
    }
  };

  return (
    <div className="admin-obituaries">
      <div className="admin-page-header">
        <h1>Obituaries</h1>
        <div className="header-actions">
          <button className="btn-admin btn-primary" onClick={openAddModal}>
            <i className="fa fa-plus" /> Add Obituary
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Obituaries Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading obituaries...</p>
          </div>
        ) : filteredObituaries.length === 0 ? (
          <div className="admin-empty">
            <i className="icon-book-open" />
            <h3>No obituaries found</h3>
            <p>Add a new obituary to get started</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Dates</th>
                  <th>Age</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredObituaries.map(obituary => (
                  <tr key={obituary._id}>
                    <td>
                      {obituary.photo ? (
                        <img src={obituary.photo} alt="" className="image-preview" />
                      ) : (
                        <div className="image-preview" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="fa fa-user" style={{ color: '#9ca3af' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>
                        {obituary.firstName} {obituary.middleName} {obituary.lastName}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        <div>Born: {formatDate(obituary.birthDate)}</div>
                        <div>Died: {formatDate(obituary.deathDate)}</div>
                      </div>
                    </td>
                    <td>{calculateAge(obituary.birthDate, obituary.deathDate)}</td>
                    <td>{obituary.location || '-'}</td>
                    <td>
                      <span className={`status-badge ${obituary.isPublished ? 'success' : 'neutral'}`}>
                        {obituary.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/admin/condolences?obituaryId=${obituary._id}`}
                          className="btn-admin btn-sm btn-secondary btn-icon"
                          title="View Condolences"
                        >
                          <i className="fa fa-comments" />
                        </Link>
                        <button
                          className="btn-admin btn-sm btn-secondary btn-icon"
                          onClick={() => togglePublished(obituary)}
                          title={obituary.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          <i className={`fa fa-${obituary.isPublished ? 'eye-slash' : 'eye'}`} />
                        </button>
                        <button
                          className="btn-admin btn-sm btn-primary btn-icon"
                          onClick={() => openEditModal(obituary)}
                          title="Edit"
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          className="btn-admin btn-sm btn-danger btn-icon"
                          onClick={() => confirmDelete(obituary)}
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>{editingObituary ? 'Edit Obituary' : 'Add New Obituary'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="admin-form">
                  <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Birth Date</label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Death Date</label>
                      <input
                        type="date"
                        name="deathDate"
                        value={formData.deathDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                    />
                  </div>

                  <div className="form-group">
                    <label>Photo URL</label>
                    <input
                      type="url"
                      name="photo"
                      value={formData.photo}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Biography</label>
                    <textarea
                      name="biography"
                      value={formData.biography}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Write a biography..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Service Type</label>
                      <select name="serviceType" value={formData.serviceType} onChange={handleInputChange}>
                        <option value="PRIVATE FAMILY SERVICE">Private Family Service</option>
                        <option value="PUBLIC SERVICE">Public Service</option>
                        <option value="MEMORIAL SERVICE">Memorial Service</option>
                        <option value="GRAVESIDE SERVICE">Graveside Service</option>
                        <option value="CELEBRATION OF LIFE">Celebration of Life</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Service Date</label>
                      <input
                        type="date"
                        name="serviceDate"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Service Location</label>
                    <input
                      type="text"
                      name="serviceLocation"
                      value={formData.serviceLocation}
                      onChange={handleInputChange}
                      placeholder="Address or venue name"
                    />
                  </div>

                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingObituary ? 'Update Obituary' : 'Add Obituary')}
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
                <h3>Delete Obituary?</h3>
                <p>Are you sure you want to delete the obituary for "{deletingObituary?.firstName} {deletingObituary?.lastName}"? This will also delete all associated condolences.</p>
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

export default ObituariesAdmin;