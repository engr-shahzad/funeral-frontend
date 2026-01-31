/**
 * Admin Products Management - With Image Upload
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    type: 'tree',
    taxable: false,
    isActive: true,
    highlights: [],
    variants: [{ name: '', quantity: 1, price: 0, isDefault: true }],
    images: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/product`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, { url: newImageUrl.trim(), alt: formData.name }]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', quantity: 1, price: 0, isDefault: false }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleHighlightsChange = (e) => {
    const highlights = e.target.value.split('\n').filter(h => h.trim());
    setFormData(prev => ({ ...prev, highlights }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: '',
      name: '',
      description: '',
      type: 'tree',
      taxable: false,
      isActive: true,
      highlights: [],
      variants: [{ name: '', quantity: 1, price: 0, isDefault: true }],
      images: []
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUrls([]);
    setNewImageUrl('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      description: product.description || '',
      type: product.type || 'tree',
      taxable: product.taxable || false,
      isActive: product.isActive !== false,
      highlights: product.highlights || [],
      variants: product.variants?.length ? product.variants : [{ name: '', quantity: 1, price: 0, isDefault: true }],
      images: product.images || []
    });
    setImageFile(null);
    setImagePreview(null);
    setImageUrls(product.images || []);
    setNewImageUrl('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare form data
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('type', formData.type);
      formDataToSend.append('taxable', formData.taxable);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('highlights', JSON.stringify(formData.highlights));
      formDataToSend.append('variants', JSON.stringify(formData.variants));
      
      // Add image file if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      // Add existing image URLs
      if (imageUrls.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(imageUrls));
      }

      if (editingProduct) {
        // Update product
        await axios.put(`${API_URL}/product/${editingProduct._id}`, {
          product: {
            ...formData,
            images: imageUrls
          }
        });
      } else {
        // Create product
        await axios.post(`${API_URL}/product/add`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await axios.delete(`${API_URL}/product/delete/${deletingProduct._id}`);
      setShowDeleteModal(false);
      setDeletingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const toggleActive = async (product) => {
    try {
      await axios.put(`${API_URL}/product/${product._id}/active`, {
        product: { isActive: !product.isActive }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1>Products</h1>
        <div className="header-actions">
          <button className="btn-admin btn-primary" onClick={openAddModal}>
            <i className="fa fa-plus" /> Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="tree">Trees</option>
          <option value="flower">Flowers</option>
          <option value="gift">Gifts</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty">
            <i className="icon-basket" />
            <h3>No products found</h3>
            <p>Add a new product to get started</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Variants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      {product.images?.[0]?.url ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name} 
                          className="image-preview"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      ) : (
                        <div className="image-preview" style={{ width: '50px', height: '50px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                          <i className="fa fa-image" style={{ color: '#9ca3af' }} />
                        </div>
                      )}
                    </td>
                    <td>{product.sku}</td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                          {product.description.substring(0, 50)}...
                        </p>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${product.type === 'tree' ? 'success' : product.type === 'flower' ? 'info' : 'warning'}`}>
                        {product.type || 'tree'}
                      </span>
                    </td>
                    <td>
                      {product.variants?.length || 0} variant(s)
                      {product.variants?.[0] && (
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                          From {formatCurrency(Math.min(...product.variants.map(v => v.price)))}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${product.isActive ? 'success' : 'neutral'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn-admin btn-sm btn-secondary btn-icon"
                          onClick={() => toggleActive(product)}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`fa fa-${product.isActive ? 'eye-slash' : 'eye'}`} />
                        </button>
                        <button
                          className="btn-admin btn-sm btn-primary btn-icon"
                          onClick={() => openEditModal(product)}
                          title="Edit"
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          className="btn-admin btn-sm btn-danger btn-icon"
                          onClick={() => confirmDelete(product)}
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
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>SKU *</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., TREE-001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <select name="type" value={formData.type} onChange={handleInputChange} required>
                        <option value="tree">Tree</option>
                        <option value="flower">Flower</option>
                        <option value="gift">Gift</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Product name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Product description..."
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="form-group">
                    <label>Product Images</label>
                    
                    {/* Upload Image File */}
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#6b7280' }}>
                        Upload Image File
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{ display: 'block', marginBottom: '10px' }}
                      />
                      {imagePreview && (
                        <div style={{ marginTop: '10px' }}>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Add Image URLs */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', color: '#6b7280' }}>
                        Or Add Image URLs
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn-admin btn-sm btn-secondary"
                          onClick={addImageUrl}
                        >
                          <i className="fa fa-plus" /> Add
                        </button>
                      </div>

                      {/* Display existing image URLs */}
                      {imageUrls.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                          {imageUrls.map((img, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <img 
                                src={img.url} 
                                alt={img.alt || 'Product'} 
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '2px solid #e5e7eb' }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImageUrl(index)}
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
                                  fontSize: '12px'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Highlights (one per line)</label>
                    <textarea
                      value={formData.highlights.join('\n')}
                      onChange={handleHighlightsChange}
                      placeholder="Enter highlights, one per line..."
                      rows={3}
                    />
                  </div>

                  {/* Variants Editor */}
                  <div className="form-group">
                    <label>Variants *</label>
                    <div className="variants-editor">
                      <div className="variant-header">
                        <span>Name</span>
                        <span>Qty</span>
                        <span>Price</span>
                        <span>Compare</span>
                        <span></span>
                      </div>
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="variant-item">
                          <input
                            type="text"
                            placeholder="Variant name"
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                            required
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            value={variant.quantity}
                            onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Compare at"
                            value={variant.compareAtPrice || ''}
                            onChange={(e) => handleVariantChange(index, 'compareAtPrice', parseFloat(e.target.value) || null)}
                            step="0.01"
                            min="0"
                          />
                          <button
                            type="button"
                            className="btn-admin btn-sm btn-danger btn-icon"
                            onClick={() => removeVariant(index)}
                            disabled={formData.variants.length <= 1}
                          >
                            <i className="fa fa-times" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-admin btn-sm btn-secondary add-variant-btn"
                        onClick={addVariant}
                      >
                        <i className="fa fa-plus" /> Add Variant
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        name="taxable"
                        checked={formData.taxable}
                        onChange={handleInputChange}
                      />
                      <span>Taxable</span>
                    </label>
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-admin btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
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
                <h3>Delete Product?</h3>
                <p>Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.</p>
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

export default ProductsAdmin;