import React, { Component } from 'react';
import './Productform.css';

class ProductForm extends Component {
    constructor(props) {
        super(props);
        
        const { product } = props;
        this.state = {
            formData: {
                name: product?.name || '',
                sku: product?.sku || '',
                type: product?.type || 'tree',
                description: product?.description || '',
                taxable: product?.taxable || false,
                isActive: product?.isActive !== undefined ? product.isActive : true
            },
            highlights: product?.highlights || [''],
            variants: product?.variants || [this.getEmptyVariant()],
            existingImages: product?.images || [],
            newImages: [],
            deleteImages: [],
            submitting: false
        };
    }

    getEmptyVariant() {
        return {
            name: '',
            quantity: 1,
            price: 0,
            compareAtPrice: 0,
            sku: '',
            isDefault: false,
            isActive: true
        };
    }

    handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    // Highlight handlers
    handleHighlightChange = (index, value) => {
        const highlights = [...this.state.highlights];
        highlights[index] = value;
        this.setState({ highlights });
    };

    addHighlight = () => {
        this.setState({
            highlights: [...this.state.highlights, '']
        });
    };

    removeHighlight = (index) => {
        const highlights = this.state.highlights.filter((_, i) => i !== index);
        this.setState({ highlights });
    };

    // Variant handlers
    handleVariantChange = (index, field, value) => {
        const variants = [...this.state.variants];
        variants[index][field] = value;
        this.setState({ variants });
    };

    addVariant = () => {
        this.setState({
            variants: [...this.state.variants, this.getEmptyVariant()]
        });
    };

    removeVariant = (index) => {
        if (this.state.variants.length <= 1) {
            alert('At least one variant is required');
            return;
        }
        const variants = this.state.variants.filter((_, i) => i !== index);
        this.setState({ variants });
    };

    setDefaultVariant = (index) => {
        const variants = this.state.variants.map((v, i) => ({
            ...v,
            isDefault: i === index
        }));
        this.setState({ variants });
    };

    // Image handlers
    handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        this.setState({ newImages: files });
    };

    removeExistingImage = (publicId) => {
        this.setState({
            deleteImages: [...this.state.deleteImages, publicId],
            existingImages: this.state.existingImages.filter(img => img.publicId !== publicId)
        });
    };

    removeNewImage = (index) => {
        const newImages = this.state.newImages.filter((_, i) => i !== index);
        this.setState({ newImages });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!this.state.formData.name) {
            alert('Product name is required!');
            return;
        }

        if (this.state.variants.length === 0) {
            alert('At least one variant is required!');
            return;
        }

        this.setState({ submitting: true });

        const formData = new FormData();
        
        // Add text fields
        Object.keys(this.state.formData).forEach(key => {
            formData.append(key, this.state.formData[key]);
        });

        // Add highlights as JSON
        formData.append('highlights', JSON.stringify(
            this.state.highlights.filter(h => h.trim() !== '')
        ));

        // Add variants as JSON
        formData.append('variants', JSON.stringify(this.state.variants));

        // Add new images
        this.state.newImages.forEach(image => {
            formData.append('images', image);
        });

        // Add delete images list
        if (this.state.deleteImages.length > 0) {
            formData.append('deleteImages', JSON.stringify(this.state.deleteImages));
        }

        const success = await this.props.onSave(formData);
        
        this.setState({ submitting: false });
    };

    render() {
        const { formData, highlights, variants, existingImages, newImages, submitting } = this.state;
        const { product, onCancel } = this.props;

        return (
            <div className="product-form-container">
                <div className="form-header">
                    <h1>{product ? 'Edit Product' : 'Add Product'}</h1>
                </div>

                <form onSubmit={this.handleSubmit} className="product-form">
                    {/* Basic Information */}
                    <div className="form-section">
                        <h3 className="section-title">Basic Information</h3>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-field">
                                <label>SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={this.handleChange}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="form-field">
                                <label>Product Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={this.handleChange}
                                >
                                    <option value="tree">Tree</option>
                                    <option value="flower">Flower</option>
                                    <option value="gift">Gift</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={this.handleChange}
                                    rows="4"
                                    placeholder="Product description..."
                                />
                            </div>
                        </div>

                        <div className="form-row checkbox-row">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="taxable"
                                    checked={formData.taxable}
                                    onChange={this.handleChange}
                                />
                                Taxable
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={this.handleChange}
                                />
                                Active
                            </label>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3 className="section-title">Highlights (Bullet Points)</h3>
                            <button type="button" className="btn-add-small" onClick={this.addHighlight}>
                                + Add Highlight
                            </button>
                        </div>

                        {highlights.map((highlight, index) => (
                            <div key={index} className="highlight-row">
                                <input
                                    type="text"
                                    value={highlight}
                                    onChange={(e) => this.handleHighlightChange(index, e.target.value)}
                                    placeholder={`Highlight ${index + 1}`}
                                />
                                <button 
                                    type="button" 
                                    className="btn-remove"
                                    onClick={() => this.removeHighlight(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Variants */}
                    <div className="form-section">
                        <div className="section-header">
                            <h3 className="section-title">Variants *</h3>
                            <button type="button" className="btn-add-small" onClick={this.addVariant}>
                                + Add Variant
                            </button>
                        </div>

                        {variants.map((variant, index) => (
                            <div key={index} className="variant-card">
                                <div className="variant-header">
                                    <h4>Variant {index + 1}</h4>
                                    <div className="variant-actions">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={variant.isDefault}
                                                onChange={() => this.setDefaultVariant(index)}
                                            />
                                            Default
                                        </label>
                                        <button 
                                            type="button" 
                                            className="btn-remove"
                                            onClick={() => this.removeVariant(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="variant-fields">
                                    <div className="form-field">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            value={variant.name}
                                            onChange={(e) => this.handleVariantChange(index, 'name', e.target.value)}
                                            placeholder="e.g., Single Tree"
                                            required
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Quantity *</label>
                                        <input
                                            type="number"
                                            value={variant.quantity}
                                            onChange={(e) => this.handleVariantChange(index, 'quantity', parseInt(e.target.value))}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Price *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => this.handleVariantChange(index, 'price', parseFloat(e.target.value))}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Compare At Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={variant.compareAtPrice}
                                            onChange={(e) => this.handleVariantChange(index, 'compareAtPrice', parseFloat(e.target.value))}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label>Variant SKU</label>
                                        <input
                                            type="text"
                                            value={variant.sku}
                                            onChange={(e) => this.handleVariantChange(index, 'sku', e.target.value)}
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={variant.isActive}
                                                onChange={(e) => this.handleVariantChange(index, 'isActive', e.target.checked)}
                                            />
                                            Active
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <div className="form-section">
                        <h3 className="section-title">Product Images</h3>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="existing-images">
                                <h4>Current Images:</h4>
                                <div className="image-grid">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="image-item">
                                            <img src={img.url} alt={img.alt || 'Product'} />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => this.removeExistingImage(img.publicId)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        <div className="form-field">
                            <label>Add New Images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={this.handleImageSelect}
                            />
                            {newImages.length > 0 && (
                                <div className="new-images-preview">
                                    <p>{newImages.length} new image(s) selected</p>
                                    <div className="image-grid">
                                        {newImages.map((file, index) => (
                                            <div key={index} className="image-item">
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt={`New ${index + 1}`} 
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-remove-image"
                                                    onClick={() => this.removeNewImage(index)}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-save"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default ProductForm;