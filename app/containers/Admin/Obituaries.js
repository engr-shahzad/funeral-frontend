/**
 * Admin Obituaries Management - Updated with Multiple Image URLs, Background Image, and Music
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
    location: jsonObituary.location || '',
    biography: jsonObituary.OBITUARY ? cleanHtmlText(jsonObituary.OBITUARY) : (jsonObituary.biography || ''),
    photos: jsonObituary.photos || (jsonObituary.photo ? [jsonObituary.photo] : []) || (jsonObituary.IMAGE ? [jsonObituary.IMAGE] : []),
    primaryPhoto: jsonObituary.primaryPhoto || jsonObituary.photo || jsonObituary.IMAGE || '',
    backgroundImage: jsonObituary.backgroundImage || '',
    music: jsonObituary.music || '',
    musicType: jsonObituary.musicType || null,
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
    photos: [],
    backgroundImage: '',
    music: '',
    musicType: null,
    serviceType: 'PRIVATE FAMILY SERVICE',
    serviceDate: '',
    serviceLocation: '',
    isPublished: true
  });
  const [saving, setSaving] = useState(false);
  // State for adding photo URLs
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  // ✅ NEW: State for background image
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  // ✅ NEW: State for music (link or file)
  const [musicUrl, setMusicUrl] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [musicInputType, setMusicInputType] = useState('link'); // 'link' or 'file'

  useEffect(() => {
    fetchObituaries();
  }, []);

  const fetchObituaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/obituaries`);
      
      let obituariesData = response.data.obituaries || response.data || [];
      
      if (!Array.isArray(obituariesData)) {
        obituariesData = [];
      }
      
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

  // Add photo URL to the list
  const addPhotoUrl = () => {
    if (newPhotoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl.trim()]
      }));
      setNewPhotoUrl('');
    }
  };

  // Remove photo from the list
  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // ✅ NEW: Add background image URL
  const addBackgroundImage = () => {
    if (backgroundImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        backgroundImage: backgroundImageUrl.trim()
      }));
    }
  };

  // ✅ NEW: Remove background image
  const removeBackgroundImage = () => {
    setFormData(prev => ({
      ...prev,
      backgroundImage: ''
    }));
    setBackgroundImageUrl('');
  };

  // ✅ NEW: Add music (link or file)
  const addMusic = () => {
    if (musicInputType === 'link' && musicUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        music: musicUrl.trim(),
        musicType: 'link'
      }));
    }
  };

  // ✅ NEW: Remove music
  const removeMusic = () => {
    setFormData(prev => ({
      ...prev,
      music: '',
      musicType: null
    }));
    setMusicUrl('');
    setMusicFile(null);
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
      photos: [],
      backgroundImage: '',
      music: '',
      musicType: null,
      serviceType: 'PRIVATE FAMILY SERVICE',
      serviceDate: '',
      serviceLocation: '',
      isPublished: true
    });
    setNewPhotoUrl('');
    setBackgroundImageUrl('');
    setMusicUrl('');
    setMusicFile(null);
    setMusicInputType('link');
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
      photos: obituary.photos || [],
      backgroundImage: obituary.backgroundImage || '',
      music: obituary.music || '',
      musicType: obituary.musicType || null,
      serviceType: obituary.serviceType || 'PRIVATE FAMILY SERVICE',
      serviceDate: obituary.serviceDate ? obituary.serviceDate.split('T')[0] : '',
      serviceLocation: obituary.serviceLocation || '',
      isPublished: obituary.isPublished !== false
    });
    setNewPhotoUrl('');
    setBackgroundImageUrl(obituary.backgroundImage || '');
    setMusicUrl(obituary.musicType === 'link' ? obituary.music : '');
    setMusicFile(null);
    setMusicInputType(obituary.musicType === 'upload' ? 'file' : 'link');
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

      // Handle music file upload separately if needed
      if (musicFile) {
        // You'll need to implement file upload logic here
        // For now, we're just handling URLs
        console.log('Music file upload not yet implemented:', musicFile);
      }

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
                  <th>Photos</th>
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
                      {obituary.photos && obituary.photos.length > 0 ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {obituary.photos.slice(0, 3).map((photo, idx) => (
                            <img 
                              key={idx}
                              src={photo} 
                              alt="" 
                              className="image-preview" 
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ))}
                          {obituary.photos.length > 3 && (
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              background: '#e5e7eb', 
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              +{obituary.photos.length - 3}
                            </div>
                          )}
                        </div>
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
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
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

                  {/* Photo URL Input Section */}
                  <div className="form-group">
                    <label>Photo URLs</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="url"
                        placeholder="Enter image URL (https://...)"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addPhotoUrl();
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={addPhotoUrl}
                        className="btn-admin btn-sm btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <i className="fa fa-plus" /> Add
                      </button>
                    </div>
                    
                    {/* Show added photos */}
                    {formData.photos && formData.photos.length > 0 && (
                      <div>
                        <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>
                          Added Photos ({formData.photos.length}):
                        </small>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {formData.photos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                              <img 
                                src={photo} 
                                alt="" 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover', 
                                  borderRadius: '4px',
                                  border: '2px solid #e5e7eb'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div style={{
                                display: 'none',
                                width: '100%',
                                height: '100%',
                                background: '#f3f4f6',
                                borderRadius: '4px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                color: '#9ca3af',
                                textAlign: 'center',
                                padding: '5px'
                              }}>
                                Invalid URL
                              </div>
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                                title="Remove photo"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ NEW: Background Image URL Section */}
                  <div className="form-group">
                    <label>Background Image URL (Optional)</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="url"
                        placeholder="Enter background image URL (https://...)"
                        value={backgroundImageUrl}
                        onChange={(e) => setBackgroundImageUrl(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addBackgroundImage();
                          }
                        }}
                        style={{ flex: 1 }}
                        disabled={!!formData.backgroundImage}
                      />
                      <button
                        type="button"
                        onClick={addBackgroundImage}
                        className="btn-admin btn-sm btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
                        disabled={!!formData.backgroundImage}
                      >
                        <i className="fa fa-plus" /> Add
                      </button>
                    </div>
                    
                    {/* Show background image preview */}
                    {formData.backgroundImage && (
                      <div>
                        <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>
                          Background Image:
                        </small>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '150px' }}>
                          <img 
                            src={formData.backgroundImage} 
                            alt="Background" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              borderRadius: '4px',
                              border: '2px solid #e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div style={{
                            display: 'none',
                            width: '100%',
                            height: '100%',
                            background: '#f3f4f6',
                            borderRadius: '4px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#9ca3af',
                            textAlign: 'center',
                            padding: '5px'
                          }}>
                            Invalid URL
                          </div>
                          <button
                            type="button"
                            onClick={removeBackgroundImage}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Remove background image"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ NEW: Music Section */}
                  <div className="form-group">
                    <label>Music (Optional)</label>
                    
                    {/* Music type selector */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="musicInputType"
                          value="link"
                          checked={musicInputType === 'link'}
                          onChange={() => setMusicInputType('link')}
                        />
                        <span>Music Link</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="musicInputType"
                          value="file"
                          checked={musicInputType === 'file'}
                          onChange={() => setMusicInputType('file')}
                        />
                        <span>Upload File (MP3)</span>
                      </label>
                    </div>

                    {/* Music Link Input */}
                    {musicInputType === 'link' && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="url"
                          placeholder="Enter music URL (https://...song.mp3)"
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addMusic();
                            }
                          }}
                          style={{ flex: 1 }}
                          disabled={!!formData.music}
                        />
                        <button
                          type="button"
                          onClick={addMusic}
                          className="btn-admin btn-sm btn-primary"
                          style={{ whiteSpace: 'nowrap' }}
                          disabled={!!formData.music}
                        >
                          <i className="fa fa-plus" /> Add
                        </button>
                      </div>
                    )}

                    {/* Music File Input */}
                    {musicInputType === 'file' && (
                      <div style={{ marginBottom: '10px' }}>
                        <input
                          type="file"
                          accept="audio/mp3,audio/mpeg"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setMusicFile(file);
                              setFormData(prev => ({
                                ...prev,
                                music: file.name,
                                musicType: 'upload'
                              }));
                            }
                          }}
                          disabled={!!formData.music && !musicFile}
                        />
                        <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
                          Only MP3 files are supported
                        </small>
                      </div>
                    )}
                    
                    {/* Show added music */}
                    {formData.music && (
                      <div>
                        <small style={{ color: '#666', display: 'block', marginBottom: '8px' }}>
                          Added Music:
                        </small>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          padding: '10px', 
                          background: '#f3f4f6', 
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <i className="fa fa-music" style={{ color: '#6366f1', fontSize: '20px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                              {formData.musicType === 'link' ? 'Music Link' : 'Uploaded File'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                              {formData.music}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeMusic}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            title="Remove music"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
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