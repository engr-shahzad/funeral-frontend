/**
 * Admin Condolences Management - Updated with Data Mapping
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../../constants';

// Data mapper utility (same as in ObituariesAdmin)
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
    location: jsonObituary.location || '',
    biography: jsonObituary.OBITUARY ? cleanHtmlText(jsonObituary.OBITUARY) : (jsonObituary.biography || ''),
    photo: jsonObituary.IMAGE || jsonObituary.photo || '',
    serviceType: jsonObituary.serviceType || 'PRIVATE FAMILY SERVICE',
    serviceDate: jsonObituary.serviceDate || null,
    serviceLocation: jsonObituary.serviceLocation || '',
    isPublished: jsonObituary.isPublished !== false,
    embeddedVideo: jsonObituary.EMBEDDEDVIDEO || jsonObituary.embeddedVideo || ''
  };
};

const CondolencesAdmin = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialObituaryId = queryParams.get('obituaryId') || '';

  const [condolences, setCondolences] = useState([]);
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [obituaryFilter, setObituaryFilter] = useState(initialObituaryId);
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCondolence, setEditingCondolence] = useState(null);
  const [deletingCondolence, setDeletingCondolence] = useState(null);
  const [formData, setFormData] = useState({
    obituaryId: '',
    name: '',
    email: '',
    message: '',
    isPrivate: false,
    hasCandle: false,
    isApproved: true,
    type: 'message'
  });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchObituaries();
  }, []);

  useEffect(() => {
    fetchCondolences();
  }, [obituaryFilter, currentPage]);

  const fetchObituaries = async () => {
    try {
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
    }
  };

  const fetchCondolences = async () => {
    try {
      setLoading(true);
      let response;

      if (obituaryFilter) {
        response = await axios.get(`${API_URL}/condolences/obituary/${obituaryFilter}`, {
          params: { includePrivate: true }
        });
        setCondolences(response.data.condolences || []);
        setTotalPages(1);
      } else {
        response = await axios.get(`${API_URL}/condolences`, {
          params: { page: currentPage, limit: 50 }
        });
        setCondolences(response.data.condolences || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching condolences:', error);
      setCondolences([]);
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
    setEditingCondolence(null);
    setFormData({
      obituaryId: obituaryFilter || '',
      name: '',
      email: '',
      message: '',
      isPrivate: false,
      hasCandle: false,
      isApproved: true,
      type: 'message'
    });
    setShowModal(true);
  };

  const openEditModal = (condolence) => {
    setEditingCondolence(condolence);
    
    // Handle obituaryId which might be populated or just an ID
    let obituaryId = '';
    if (condolence.obituaryId) {
      if (typeof condolence.obituaryId === 'object') {
        obituaryId = condolence.obituaryId._id || condolence.obituaryId.ID || '';
      } else {
        obituaryId = condolence.obituaryId;
      }
    }
    
    setFormData({
      obituaryId: obituaryId,
      name: condolence.name || '',
      email: condolence.email || '',
      message: condolence.message || '',
      isPrivate: condolence.isPrivate || false,
      hasCandle: condolence.hasCandle || false,
      isApproved: condolence.isApproved !== false,
      type: condolence.type || 'message'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCondolence) {
        await axios.put(`${API_URL}/condolences/${editingCondolence._id}`, formData);
      } else {
        await axios.post(`${API_URL}/condolences`, formData);
      }

      setShowModal(false);
      fetchCondolences();
    } catch (error) {
      console.error('Error saving condolence:', error);
      alert('Error saving condolence. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (condolence) => {
    setDeletingCondolence(condolence);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingCondolence) return;

    try {
      await axios.delete(`${API_URL}/condolences/${deletingCondolence._id}`);
      setShowDeleteModal(false);
      setDeletingCondolence(null);
      fetchCondolences();
    } catch (error) {
      console.error('Error deleting condolence:', error);
      alert('Error deleting condolence. Please try again.');
    }
  };

  const toggleApproval = async (condolence) => {
    try {
      await axios.put(`${API_URL}/condolences/${condolence._id}`, {
        isApproved: !condolence.isApproved
      });
      fetchCondolences();
    } catch (error) {
      console.error('Error toggling condolence approval:', error);
    }
  };

  const getObituaryName = (condolence) => {
    // First check if obituaryId is populated (object)
    if (condolence.obituaryId && typeof condolence.obituaryId === 'object') {
      const obit = condolence.obituaryId;
      // Handle both old and new field names
      const firstName = obit.FIRST || obit.firstName || '';
      const lastName = obit.LAST || obit.lastName || '';
      return firstName && lastName ? `${firstName} ${lastName}` : 'Unknown';
    }
    
    // If obituaryId is just an ID string, find it in the obituaries list
    const obituaryId = condolence.obituaryId;
    const obituary = obituaries.find(o => o._id === obituaryId || o.ID === obituaryId);
    
    if (obituary) {
      return `${obituary.firstName} ${obituary.lastName}`;
    }
    
    return 'Unknown';
  };

  const filteredCondolences = condolences.filter(condolence => {
    const matchesSearch = condolence.name?.toLowerCase().includes(search.toLowerCase()) ||
      condolence.message?.toLowerCase().includes(search.toLowerCase()) ||
      condolence.email?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || condolence.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      message: 'Message',
      tree: 'Tree',
      flower: 'Flower',
      gift: 'Gift'
    };
    return labels[type] || type;
  };

  return (
    <div className="admin-condolences">
      <div className="admin-page-header">
        <h1>Condolences</h1>
        <div className="header-actions">
          <button className="btn-admin btn-primary" onClick={openAddModal}>
            <i className="fa fa-plus" /> Add Condolence
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search by name, email or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={obituaryFilter}
          onChange={(e) => {
            setObituaryFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Obituaries</option>
          {obituaries.map(obituary => (
            <option key={obituary._id} value={obituary._id}>
              {obituary.firstName} {obituary.lastName}
            </option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="message">Messages</option>
          <option value="tree">Trees</option>
          <option value="flower">Flowers</option>
          <option value="gift">Gifts</option>
        </select>
      </div>

      {/* Condolences Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading condolences...</p>
          </div>
        ) : filteredCondolences.length === 0 ? (
          <div className="admin-empty">
            <i className="icon-heart" />
            <h3>No condolences found</h3>
            <p>{obituaryFilter ? 'No condolences for this obituary yet' : 'Add a new condolence to get started'}</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>For</th>
                    <th>Message</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCondolences.map(condolence => (
                    <tr key={condolence._id}>
                      <td>
                        <strong>{condolence.name}</strong>
                        {condolence.email && (
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                            {condolence.email}
                          </p>
                        )}
                      </td>
                      <td>{getObituaryName(condolence)}</td>
                      <td style={{ maxWidth: '250px' }}>
                        <p style={{ margin: 0, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {condolence.message}
                        </p>
                        <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                          {condolence.isPrivate && (
                            <span className="status-badge neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              <i className="fa fa-lock" /> Private
                            </span>
                          )}
                          {condolence.hasCandle && (
                            <span className="status-badge warning" style={{ fontSize: '10px', padding: '2px 6px' }}>
                              <i className="fa fa-fire" /> Candle
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          condolence.type === 'tree' ? 'success' :
                          condolence.type === 'flower' ? 'info' :
                          condolence.type === 'gift' ? 'warning' : 'neutral'
                        }`}>
                          {getTypeLabel(condolence.type)}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {formatDate(condolence.createdAt)}
                      </td>
                      <td>
                        <span className={`status-badge ${condolence.isApproved ? 'success' : 'danger'}`}>
                          {condolence.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className={`btn-admin btn-sm ${condolence.isApproved ? 'btn-secondary' : 'btn-success'} btn-icon`}
                            onClick={() => toggleApproval(condolence)}
                            title={condolence.isApproved ? 'Unapprove' : 'Approve'}
                          >
                            <i className={`fa fa-${condolence.isApproved ? 'times' : 'check'}`} />
                          </button>
                          <button
                            className="btn-admin btn-sm btn-primary btn-icon"
                            onClick={() => openEditModal(condolence)}
                            title="Edit"
                          >
                            <i className="fa fa-pencil" />
                          </button>
                          <button
                            className="btn-admin btn-sm btn-danger btn-icon"
                            onClick={() => confirmDelete(condolence)}
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
              <h2>{editingCondolence ? 'Edit Condolence' : 'Add New Condolence'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="admin-form">
                  <div className="form-group">
                    <label>Obituary *</label>
                    <select
                      name="obituaryId"
                      value={formData.obituaryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select an obituary</option>
                      {obituaries.map(obituary => (
                        <option key={obituary._id} value={obituary._id}>
                          {obituary.firstName} {obituary.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="message">Message</option>
                      <option value="tree">Tree</option>
                      <option value="flower">Flower</option>
                      <option value="gift">Gift</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        name="isPrivate"
                        checked={formData.isPrivate}
                        onChange={handleInputChange}
                      />
                      <span>Private (only visible to family)</span>
                    </label>
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        name="hasCandle"
                        checked={formData.hasCandle}
                        onChange={handleInputChange}
                      />
                      <span>Light a candle</span>
                    </label>
                  </div>

                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      name="isApproved"
                      checked={formData.isApproved}
                      onChange={handleInputChange}
                    />
                    <span>Approved</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingCondolence ? 'Update Condolence' : 'Add Condolence')}
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
                <h3>Delete Condolence?</h3>
                <p>Are you sure you want to delete this condolence from "{deletingCondolence?.name}"? This action cannot be undone.</p>
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

export default CondolencesAdmin;