import React, { Component } from 'react';
import './Productdashboard.css';

class ProductList extends Component {
    getProductTypeBadge = (type) => {
        const badges = {
            tree: { label: '🌲 Tree', class: 'badge-tree' },
            flower: { label: '🌸 Flower', class: 'badge-flower' },
            gift: { label: '🎁 Gift', class: 'badge-gift' }
        };
        return badges[type] || { label: type, class: 'badge-default' };
    };

    getPriceRange = (variants) => {
        if (!variants || variants.length === 0) return 'N/A';
        
        const prices = variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        
        if (min === max) {
            return `$${min.toFixed(2)}`;
        }
        return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
    };

    renderLoading = () => {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    };

    renderEmptyState = () => {
        return (
            <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Products Yet</h3>
                <p>Get started by adding your first product</p>
                <button className="btn-add-large" onClick={this.props.onAdd}>
                    ➕ Add New Product
                </button>
            </div>
        );
    };

    renderTable = () => {
        const { products, onEdit, onDelete } = this.props;

        return (
            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>SKU</th>
                            <th>Price Range</th>
                            <th>Variants</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const typeBadge = this.getProductTypeBadge(product.type);
                            
                            return (
                                <tr key={product._id}>
                                    <td className="image-cell">
                                        {product.images && product.images.length > 0 ? (
                                            <img 
                                                src={product.images[0].url} 
                                                alt={product.images[0].alt || product.name}
                                                className="product-thumbnail"
                                            />
                                        ) : (
                                            <div className="no-image">No Image</div>
                                        )}
                                    </td>
                                    <td className="name-cell">
                                        <strong>{product.name}</strong>
                                        {product.brand && (
                                            <span className="brand-name">{product.brand.name}</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`type-badge ${typeBadge.class}`}>
                                            {typeBadge.label}
                                        </span>
                                    </td>
                                    <td>{product.sku || 'N/A'}</td>
                                    <td className="price-cell">
                                        {this.getPriceRange(product.variants)}
                                    </td>
                                    <td className="center">
                                        {product.variants ? product.variants.length : 0}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <button 
                                            className="btn-action btn-edit"
                                            onClick={() => onEdit(product)}
                                            title="Edit"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button 
                                            className="btn-action btn-delete"
                                            onClick={() => onDelete(product._id, product.name)}
                                            title="Delete"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    render() {
        const { products, loading, onAdd } = this.props;

        return (
            <div className="product-list-container">
                <div className="list-header">
                    <div className="header-content">
                        <h1>Product Management</h1>
                     
                    </div>
                    <button className="btn-add" onClick={onAdd}>
                        ➕ Add New Product
                    </button>
                </div>

                <div className="list-content">
                    {loading ? this.renderLoading() :
                     products.length === 0 ? this.renderEmptyState() :
                     this.renderTable()}
                </div>

                <div className="list-footer">
                    <p>Total: {products.length} products</p>
                </div>
            </div>
        );
    }
}

export default ProductList;