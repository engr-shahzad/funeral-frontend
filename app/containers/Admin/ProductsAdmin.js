import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    Search,
    Package,
    Image
} from 'lucide-react';

const ProductsAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        type: 'tree',
        description: '',
        isActive: true,
        taxable: false,
        images: []
    });
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');

    const API_URL = 'http://localhost:3000/';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}api/product`);
            const data = await response.json();
            console.log('Fetched products:', data);
            // Handle both array and object responses
            setProducts(Array.isArray(data) ? data : data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_URL}api/product/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProducts(products.filter(p => p._id !== id));
                alert('Product deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}api/product/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (response.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const url = editingProduct 
                ? `${API_URL}api/product/${editingProduct._id}`
                : `${API_URL}api/product`;
            
            const method = editingProduct ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingProduct ? 'Product updated successfully' : 'Product added successfully');
                setShowModal(false);
                setEditingProduct(null);
                resetForm();
                fetchProducts();
            } else {
                const error = await response.json();
                alert(`Failed to save product: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            type: 'tree',
            description: '',
            isActive: true,
            taxable: false,
            images: []
        });
        setImageUrl('');
        setImageAlt('');
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            sku: product.sku || '',
            type: product.type || 'tree',
            description: product.description || '',
            isActive: product.isActive !== undefined ? product.isActive : true,
            taxable: product.taxable !== undefined ? product.taxable : false,
            images: product.images || []
        });
        setImageUrl('');
        setImageAlt('');
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddImage = () => {
        if (imageUrl.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { url: imageUrl, alt: imageAlt || 'Product Image' }]
            }));
            setImageUrl('');
            setImageAlt('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = 
            filterType === 'all' || product.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const getTypeColor = (type) => {
        const colors = {
            tree: 'bg-green-100 text-green-800',
            flower: 'bg-pink-100 text-pink-800',
            gift: 'bg-blue-100 text-blue-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Types</option>
                        <option value="tree">Trees</option>
                        <option value="flower">Flowers</option>
                        <option value="gift">Gifts</option>
                    </select>
                </div>

                <button 
                    onClick={() => {
                        setEditingProduct(null);
                        resetForm();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Trees</p>
                    <p className="text-2xl font-bold text-green-600">
                        {products.filter(p => p.type === 'tree').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Flowers</p>
                    <p className="text-2xl font-bold text-pink-600">
                        {products.filter(p => p.type === 'flower').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {products.filter(p => p.isActive).length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="h-48 bg-gray-200 relative">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0].url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Image className="text-gray-400" size={48} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
                                    {product.type}
                                </span>
                                <button
                                    onClick={() => toggleActive(product._id, product.isActive)}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        product.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {product.description}
                            </p>

                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                        {product.variants.length} Variant{product.variants.length > 1 ? 's' : ''}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.slice(0, 3).map((variant, idx) => (
                                            <div
                                                key={idx}
                                                className="text-xs bg-gray-100 px-2 py-1 rounded"
                                            >
                                                {variant.name}: ${variant.price}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg">
                    <Package className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No products found</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Memorial Tree"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="TREE-001"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Type *
                                    </label>
                                    <select 
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="tree">Tree</option>
                                        <option value="flower">Flower</option>
                                        <option value="gift">Gift</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter product description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Images
                                    </label>
                                    
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="Image URL"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={imageAlt}
                                                onChange={(e) => setImageAlt(e.target.value)}
                                                placeholder="Alt text (optional)"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddImage}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        {formData.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                {formData.images.map((img, idx) => (
                                                    <div key={idx} className="relative border border-gray-300 rounded-lg overflow-hidden">
                                                        <img
                                                            src={img.url}
                                                            alt={img.alt}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <div className="p-2 bg-gray-50">
                                                            <p className="text-xs text-gray-600 truncate">{img.alt}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="mr-2" 
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="taxable"
                                            checked={formData.taxable}
                                            onChange={handleInputChange}
                                            className="mr-2" 
                                        />
                                        <span className="text-sm text-gray-700">Taxable</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProduct(null);
                                            resetForm();
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsAdmin;