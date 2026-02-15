import React, { Component } from 'react';
import ProductList from './Productlist';
import ProductForm from './Productform';
import { API_URL } from '../../constants';

class ProductDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            showForm: false,
            editingProduct: null,
            toast: {
                show: false,
                message: '',
                type: 'success'
            }
        };

        this.API_BASE_URL = `${API_URL}/product`;
    }

    componentDidMount() {
        this.loadProducts();
    }

    // Load all products
    loadProducts = async () => {
        try {
            this.setState({ loading: true });
            const response = await fetch(this.API_BASE_URL);
            const data = await response.json();
            
            this.setState({
                products: data.products || [],
                loading: false
            });
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Failed to load products', 'error');
            this.setState({ loading: false });
        }
    };

    // Show Add Form
    handleAdd = () => {
        this.setState({
            showForm: true,
            editingProduct: null
        });
    };

    // Show Edit Form
    handleEdit = (product) => {
        this.setState({
            showForm: true,
            editingProduct: product
        });
    };

    // Delete Product
    handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            this.showToast('Product deleted successfully', 'success');
            this.loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showToast('Failed to delete product', 'error');
        }
    };

    // Close Form
    handleCloseForm = () => {
        this.setState({
            showForm: false,
            editingProduct: null
        });
    };

    // Save Product (Create or Update)
    handleSave = async (formData) => {
        try {
            const { editingProduct } = this.state;
            const url = editingProduct 
                ? `${this.API_BASE_URL}/${editingProduct._id}` 
                : this.API_BASE_URL;
            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save product');
            }

            const message = editingProduct 
                ? 'Product updated successfully!' 
                : 'Product created successfully!';
            
            this.showToast(message, 'success');
            this.handleCloseForm();
            this.loadProducts();

            return true;
        } catch (error) {
            console.error('Error saving product:', error);
            this.showToast(error.message || 'Failed to save product', 'error');
            return false;
        }
    };

    // Show Toast Notification
    showToast = (message, type = 'success') => {
        this.setState({
            toast: { show: true, message, type }
        });

        setTimeout(() => {
            this.setState({
                toast: { show: false, message: '', type: 'success' }
            });
        }, 3000);
    };

    render() {
        const { products, loading, showForm, editingProduct, toast } = this.state;

        return (
            <div className="product-dashboard">
                {!showForm ? (
                    <ProductList
                        products={products}
                        loading={loading}
                        onAdd={this.handleAdd}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
                    />
                ) : (
                    <ProductForm
                        product={editingProduct}
                        onSave={this.handleSave}
                        onCancel={this.handleCloseForm}
                    />
                )}

                {/* Toast Notification */}
                {toast.show && (
                    <div className={`toast toast-${toast.type}`}>
                        <span>{toast.message}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default ProductDashboard;