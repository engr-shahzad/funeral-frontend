/**
 * Admin - Redirects
 * Create and manage 301/302 URL redirects stored in the database.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const emptyForm = () => ({ from: '', to: '', statusCode: 301, isActive: true });

const RedirectsAdmin = () => {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingRedirect, setDeletingRedirect] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/redirects`);
      setRedirects(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load redirects.' });
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowModal(true);
  };

  const openEdit = (redirect) => {
    setEditingId(redirect._id);
    setFormData({
      from: redirect.from,
      to: redirect.to,
      statusCode: redirect.statusCode,
      isActive: redirect.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.from.trim() || !formData.to.trim()) {
      setMessage({ type: 'error', text: 'Both "From" and "To" fields are required.' });
      return;
    }
    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`${API_URL}/redirects/${editingId}`, {
          to: formData.to,
          statusCode: formData.statusCode,
          isActive: formData.isActive,
        });
      } else {
        await axios.post(`${API_URL}/redirects`, formData);
      }
      setShowModal(false);
      setMessage({ type: 'success', text: `Redirect ${editingId ? 'updated' : 'created'} successfully.` });
      await fetchRedirects();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save redirect.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/redirects/${deletingRedirect._id}`);
      setShowDeleteModal(false);
      setMessage({ type: 'success', text: 'Redirect deleted.' });
      await fetchRedirects();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete redirect.' });
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const toggleActive = async (redirect) => {
    try {
      await axios.put(`${API_URL}/redirects/${redirect._id}`, { isActive: !redirect.isActive });
      await fetchRedirects();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update redirect.' });
    }
  };

  const filtered = redirects.filter(r =>
    r.from.toLowerCase().includes(search.toLowerCase()) ||
    r.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Redirects</h1>
          <p style={{ color: '#666', marginBottom: 0 }}>
            Manage 301/302 URL redirects. Active redirects are applied before any page renders.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: '10px 20px',
            background: '#00a097',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + Add Redirect
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search by from or to URL..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 14px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px',
            width: '320px',
          }}
        />
      </div>

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                {['From', 'To', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                    {redirects.length === 0 ? 'No redirects yet. Click "+ Add Redirect" to create one.' : 'No results found.'}
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#333' }}>{r.from}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#555' }}>{r.to}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: r.statusCode === 301 ? '#e3f2fd' : '#fff3cd',
                        color: r.statusCode === 301 ? '#1565c0' : '#856404',
                      }}>
                        {r.statusCode}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => toggleActive(r)}
                        style={{
                          padding: '3px 10px',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          background: r.isActive ? '#d4edda' : '#f8d7da',
                          color: r.isActive ? '#155724' : '#721c24',
                        }}
                      >
                        {r.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openEdit(r)}
                          style={{
                            padding: '5px 12px',
                            border: '1px solid #00a097',
                            borderRadius: '4px',
                            background: 'transparent',
                            color: '#00a097',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { setDeletingRedirect(r); setShowDeleteModal(true); }}
                          style={{
                            padding: '5px 12px',
                            border: '1px solid #dc3545',
                            borderRadius: '4px',
                            background: 'transparent',
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: '8px', padding: '28px',
            width: '520px', maxWidth: '95vw', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
              {editingId ? 'Edit Redirect' : 'Add Redirect'}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                From (old path) *
              </label>
              <input
                type="text"
                value={formData.from}
                onChange={e => setFormData(f => ({ ...f, from: e.target.value }))}
                disabled={!!editingId}
                placeholder="/old-page-url"
                style={{
                  width: '100%', padding: '9px 12px', border: '1px solid #ced4da',
                  borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace',
                  background: editingId ? '#f8f9fa' : '#fff',
                }}
              />
              {!editingId && (
                <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                  Must be a path (e.g. <code>/old-url</code>). Cannot be changed after creation.
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                To (new URL or path) *
              </label>
              <input
                type="text"
                value={formData.to}
                onChange={e => setFormData(f => ({ ...f, to: e.target.value }))}
                placeholder="/new-page-url or https://example.com"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                  Redirect Type
                </label>
                <select
                  value={formData.statusCode}
                  onChange={e => setFormData(f => ({ ...f, statusCode: parseInt(e.target.value) }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value={301}>301 — Permanent</option>
                  <option value={302}>302 — Temporary</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={e => setFormData(f => ({ ...f, isActive: e.target.value === 'true' }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '9px 20px', border: '1px solid #dee2e6', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '9px 24px', background: '#00a097', color: '#fff',
                  border: 'none', borderRadius: '4px', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && deletingRedirect && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: '8px', padding: '28px',
            width: '420px', maxWidth: '95vw', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginTop: 0 }}>Delete Redirect</h3>
            <p>
              Are you sure you want to delete the redirect from{' '}
              <code style={{ background: '#f8f9fa', padding: '2px 6px', borderRadius: '3px' }}>
                {deletingRedirect.from}
              </code>
              ?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '9px 20px', border: '1px solid #dee2e6', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ padding: '9px 20px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedirectsAdmin;
