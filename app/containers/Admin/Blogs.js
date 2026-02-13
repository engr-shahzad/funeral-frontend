/**
 * Admin Blogs Management - CRUD with SEO Meta Fields
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const BlogsAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const emptyForm = {
    title: '',
    slug: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '',
    image: '',
    readTime: '',
    isPublished: false,
    content: [{ type: 'paragraph', text: '' }],
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterTitle: '',
      twitterDescription: ''
    }
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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

  const handleSeoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [field]: value }
    }));
  };

  // Content block management
  const addContentBlock = (blockType) => {
    const newBlock = { type: blockType, text: '' };
    if (blockType === 'code') newBlock.language = 'javascript';
    if (blockType === 'list') { newBlock.items = ['']; newBlock.text = undefined; }
    if (blockType === 'image') { newBlock.url = ''; newBlock.alt = ''; newBlock.text = undefined; }
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const updateContentBlock = (index, field, value) => {
    setFormData(prev => {
      const content = [...prev.content];
      content[index] = { ...content[index], [field]: value };
      return { ...prev, content };
    });
  };

  const removeContentBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const moveContentBlock = (index, direction) => {
    setFormData(prev => {
      const content = [...prev.content];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= content.length) return prev;
      [content[index], content[newIndex]] = [content[newIndex], content[index]];
      return { ...prev, content };
    });
  };

  // List item management within a content block
  const addListItem = (blockIndex) => {
    setFormData(prev => {
      const content = [...prev.content];
      content[blockIndex] = {
        ...content[blockIndex],
        items: [...(content[blockIndex].items || []), '']
      };
      return { ...prev, content };
    });
  };

  const updateListItem = (blockIndex, itemIndex, value) => {
    setFormData(prev => {
      const content = [...prev.content];
      const items = [...(content[blockIndex].items || [])];
      items[itemIndex] = value;
      content[blockIndex] = { ...content[blockIndex], items };
      return { ...prev, content };
    });
  };

  const removeListItem = (blockIndex, itemIndex) => {
    setFormData(prev => {
      const content = [...prev.content];
      content[blockIndex] = {
        ...content[blockIndex],
        items: content[blockIndex].items.filter((_, i) => i !== itemIndex)
      };
      return { ...prev, content };
    });
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData(emptyForm);
    setActiveTab('general');
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      author: blog.author || '',
      category: blog.category || '',
      tags: (blog.tags || []).join(', '),
      image: blog.image || '',
      readTime: blog.readTime || '',
      isPublished: blog.isPublished || false,
      content: blog.content && blog.content.length > 0 ? blog.content : [{ type: 'paragraph', text: '' }],
      seo: {
        metaTitle: blog.seo?.metaTitle || '',
        metaDescription: blog.seo?.metaDescription || '',
        metaKeywords: blog.seo?.metaKeywords || '',
        ogTitle: blog.seo?.ogTitle || '',
        ogDescription: blog.seo?.ogDescription || '',
        ogImage: blog.seo?.ogImage || '',
        twitterTitle: blog.seo?.twitterTitle || '',
        twitterDescription: blog.seo?.twitterDescription || ''
      }
    });
    setActiveTab('general');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingBlog) {
        await axios.put(`${API_URL}/blogs/${editingBlog._id}`, payload);
      } else {
        await axios.post(`${API_URL}/blogs`, payload);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBlog) return;
    try {
      await axios.delete(`${API_URL}/blogs/${deletingBlog._id}`);
      setShowDeleteModal(false);
      setDeletingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog.');
    }
  };

  const togglePublish = async (blog) => {
    try {
      await axios.put(`${API_URL}/blogs/${blog._id}`, {
        ...blog,
        isPublished: !blog.isPublished
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
      (blog.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter ||
      (statusFilter === 'published' && blog.isPublished) ||
      (statusFilter === 'draft' && !blog.isPublished);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border" role="status" />
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Blog Management</h1>
        <button className="btn-admin btn-primary" onClick={openCreateModal}>+ New Blog Post</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minWidth: '200px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog List Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Title</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Category</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Author</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>SEO</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map(blog => (
              <tr key={blog._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontWeight: '500' }}>{blog.title}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{blog.category || '-'}</td>
                <td style={{ padding: '12px 16px', color: '#6b7280' }}>{blog.author || '-'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span
                    onClick={() => togglePublish(blog)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: blog.isPublished ? '#d1fae5' : '#fef3c7',
                      color: blog.isPublished ? '#065f46' : '#92400e'
                    }}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: blog.seo?.metaTitle ? '#dbeafe' : '#fee2e2',
                    color: blog.seo?.metaTitle ? '#1e40af' : '#991b1b'
                  }}>
                    {blog.seo?.metaTitle ? 'Set' : 'Missing'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                    <button
                      onClick={() => openEditModal(blog)}
                      style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setDeletingBlog(blog); setShowDeleteModal(true); }}
                      style={{ padding: '6px 12px', border: '1px solid #fecaca', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No blogs found. Click "+ New Blog Post" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', overflowY: 'auto' }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '12px', width: '100%', maxWidth: '900px', margin: '20px auto', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e5e7eb', padding: '0 24px' }}>
              {['general', 'content', 'seo'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
                    background: activeTab === tab ? '#eff6ff' : 'none',
                    color: activeTab === tab ? '#2563eb' : '#6b7280',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'seo' ? 'SEO Meta Tags' : tab}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ overflow: 'auto', flex: 1 }}>
              <div style={{ padding: '24px' }}>

                {/* General Tab */}
                {activeTab === 'general' && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Title *</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Slug</label>
                      <input type="text" name="slug" value={formData.slug} onChange={handleInputChange}
                        placeholder="auto-generated from title if left blank"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Excerpt</label>
                      <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="3"
                        placeholder="Brief summary of the blog post..."
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleInputChange}
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                          placeholder="e.g. Funeral Planning, Grief Support"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Tags (comma-separated)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                          placeholder="funeral, grief support, planning"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Read Time</label>
                        <input type="text" name="readTime" value={formData.readTime} onChange={handleInputChange}
                          placeholder="e.g. 5 min read"
                          style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Featured Image URL</label>
                      <input type="url" name="image" value={formData.image} onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      {formData.image && (
                        <img src={formData.image} alt="Preview" style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '6px' }}
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                        <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange}
                          style={{ width: '18px', height: '18px' }} />
                        Publish this blog post
                      </label>
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>Content Blocks</h3>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" onClick={() => addContentBlock('paragraph')} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>+ Paragraph</button>
                        <button type="button" onClick={() => addContentBlock('heading')} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>+ Heading</button>
                        <button type="button" onClick={() => addContentBlock('code')} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>+ Code</button>
                        <button type="button" onClick={() => addContentBlock('list')} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>+ List</button>
                        <button type="button" onClick={() => addContentBlock('image')} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px' }}>+ Image</button>
                      </div>
                    </div>

                    {formData.content.map((block, index) => (
                      <div key={index} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', background: '#e5e7eb', padding: '2px 8px', borderRadius: '4px' }}>
                            {block.type}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button type="button" onClick={() => moveContentBlock(index, -1)} disabled={index === 0}
                              style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '11px' }}>↑</button>
                            <button type="button" onClick={() => moveContentBlock(index, 1)} disabled={index === formData.content.length - 1}
                              style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '11px' }}>↓</button>
                            <button type="button" onClick={() => removeContentBlock(index)}
                              style={{ padding: '4px 8px', border: '1px solid #fecaca', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontSize: '11px' }}>×</button>
                          </div>
                        </div>

                        {block.type === 'paragraph' && (
                          <textarea value={block.text || ''} onChange={(e) => updateContentBlock(index, 'text', e.target.value)} rows="4"
                            placeholder="Write your paragraph text..."
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                        )}

                        {block.type === 'heading' && (
                          <input type="text" value={block.text || ''} onChange={(e) => updateContentBlock(index, 'text', e.target.value)}
                            placeholder="Heading text..."
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', fontWeight: '600' }} />
                        )}

                        {block.type === 'code' && (
                          <>
                            <input type="text" value={block.language || ''} onChange={(e) => updateContentBlock(index, 'language', e.target.value)}
                              placeholder="Language (e.g. javascript, html, css)"
                              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', marginBottom: '8px' }} />
                            <textarea value={block.text || ''} onChange={(e) => updateContentBlock(index, 'text', e.target.value)} rows="6"
                              placeholder="Paste your code here..."
                              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }} />
                          </>
                        )}

                        {block.type === 'list' && (
                          <div>
                            {(block.items || []).map((item, itemIndex) => (
                              <div key={itemIndex} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                <input type="text" value={item} onChange={(e) => updateListItem(index, itemIndex, e.target.value)}
                                  placeholder={`List item ${itemIndex + 1}`}
                                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                                <button type="button" onClick={() => removeListItem(index, itemIndex)}
                                  style={{ padding: '4px 10px', border: '1px solid #fecaca', borderRadius: '4px', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', fontSize: '12px' }}>×</button>
                              </div>
                            ))}
                            <button type="button" onClick={() => addListItem(index)}
                              style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer', fontSize: '12px', marginTop: '4px' }}>+ Add Item</button>
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input type="url" value={block.url || ''} onChange={(e) => updateContentBlock(index, 'url', e.target.value)}
                              placeholder="Image URL"
                              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                            <input type="text" value={block.alt || ''} onChange={(e) => updateContentBlock(index, 'alt', e.target.value)}
                              placeholder="Alt text"
                              style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                          </div>
                        )}
                      </div>
                    ))}

                    {formData.content.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        <p>No content blocks yet. Use the buttons above to add content.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Meta Tags Tab */}
                {activeTab === 'seo' && (
                  <div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1e40af' }}>
                      SEO meta tags help search engines understand and rank your blog post. Fill in these fields to improve your search visibility.
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Basic Meta Tags</h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Meta Title</label>
                      <input type="text" value={formData.seo.metaTitle} onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                        placeholder="SEO-friendly title for search engines (max 60 chars)"
                        maxLength="60"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                      <small style={{ color: '#6b7280', fontSize: '12px' }}>{formData.seo.metaTitle.length}/60 characters</small>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Meta Description</label>
                      <textarea value={formData.seo.metaDescription} onChange={(e) => handleSeoChange('metaDescription', e.target.value)} rows="3"
                        placeholder="Brief description for search results (max 160 chars)"
                        maxLength="160"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                      <small style={{ color: '#6b7280', fontSize: '12px' }}>{formData.seo.metaDescription.length}/160 characters</small>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Meta Keywords (comma-separated)</label>
                      <input type="text" value={formData.seo.metaKeywords} onChange={(e) => handleSeoChange('metaKeywords', e.target.value)}
                        placeholder="funeral planning, grief support, memorial services"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    {/* Search Preview */}
                    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>Google Search Preview</p>
                      <div>
                        <p style={{ fontSize: '18px', color: '#1a0dab', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {formData.seo.metaTitle || formData.title || 'Page Title'}
                        </p>
                        <p style={{ fontSize: '13px', color: '#006621', margin: '0 0 4px 0' }}>
                          westriverfd.com/blog/{formData.slug || 'post-slug'}
                        </p>
                        <p style={{ fontSize: '13px', color: '#545454', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {formData.seo.metaDescription || formData.excerpt || 'Meta description will appear here...'}
                        </p>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Open Graph (Facebook, LinkedIn)</h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>OG Title</label>
                      <input type="text" value={formData.seo.ogTitle} onChange={(e) => handleSeoChange('ogTitle', e.target.value)}
                        placeholder="Leave blank to use Meta Title"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>OG Description</label>
                      <textarea value={formData.seo.ogDescription} onChange={(e) => handleSeoChange('ogDescription', e.target.value)} rows="2"
                        placeholder="Leave blank to use Meta Description"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>OG Image URL</label>
                      <input type="url" value={formData.seo.ogImage} onChange={(e) => handleSeoChange('ogImage', e.target.value)}
                        placeholder="https://example.com/og-image.jpg (1200x630px recommended)"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Twitter Card</h3>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Twitter Title</label>
                      <input type="text" value={formData.seo.twitterTitle} onChange={(e) => handleSeoChange('twitterTitle', e.target.value)}
                        placeholder="Leave blank to use Meta Title"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Twitter Description</label>
                      <textarea value={formData.seo.twitterDescription} onChange={(e) => handleSeoChange('twitterDescription', e.target.value)} rows="2"
                        placeholder="Leave blank to use Meta Description"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" disabled={saving}
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: '600', opacity: saving ? 0.5 : 1 }}>
                  {saving ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowDeleteModal(false)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Delete Blog Post?</h3>
            <p style={{ color: '#6b7280' }}>Are you sure you want to delete "{deletingBlog?.title}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete}
                style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsAdmin;
