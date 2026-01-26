import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    Search,
    Filter,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Heart,
    Gift,
    TreePine,
    Flower
} from 'lucide-react';

const CondolencesAdmin = () => {
    const [condolences, setCondolences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedCondolence, setSelectedCondolence] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/';

    useEffect(() => {
        fetchCondolences();
        
        // Cleanup function to prevent state updates on unmounted component
        return () => {
            setCondolences([]);
            setLoading(false);
        };
    }, []);

    const fetchCondolences = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}api/condolences`);
            const data = await response.json();
            console.log('Fetched condolences:', data);
            
            // Handle both array and object responses
            if (Array.isArray(data)) {
                setCondolences(data);
            } else if (data.condolences && Array.isArray(data.condolences)) {
                setCondolences(data.condolences);
            } else {
                console.error('Unexpected data format:', data);
                setCondolences([]);
            }
        } catch (error) {
            console.error('Error fetching condolences:', error);
            alert('Failed to fetch condolences. Check console for details.');
            setCondolences([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this condolence?')) return;

        try {
            const response = await fetch(`${API_URL}api/condolences/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCondolences(condolences.filter(c => c._id !== id));
                alert('Condolence deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting condolence:', error);
            alert('Failed to delete condolence');
        }
    };

    const toggleApproval = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}api/condolences/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: !currentStatus })
            });

            if (response.ok) {
                fetchCondolences();
            }
        } catch (error) {
            console.error('Error updating condolence:', error);
        }
    };

    const viewDetails = (condolence) => {
        setSelectedCondolence(condolence);
        setShowModal(true);
    };

    const filteredCondolences = condolences.filter(condolence => {
        const matchesSearch = 
            condolence.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            condolence.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            condolence.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = 
            filterType === 'all' || condolence.type === filterType;

        const matchesStatus = 
            filterStatus === 'all' ||
            (filterStatus === 'approved' && condolence.isApproved) ||
            (filterStatus === 'pending' && !condolence.isApproved);

        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeIcon = (type) => {
        const icons = {
            message: MessageSquare,
            tree: TreePine,
            flower: Flower,
            gift: Gift
        };
        return icons[type] || MessageSquare;
    };

    const getTypeColor = (type) => {
        const colors = {
            message: 'bg-blue-100 text-blue-800',
            tree: 'bg-green-100 text-green-800',
            flower: 'bg-pink-100 text-pink-800',
            gift: 'bg-purple-100 text-purple-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search condolences..."
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
                        <option value="message">Messages</option>
                        <option value="tree">Trees</option>
                        <option value="flower">Flowers</option>
                        <option value="gift">Gifts</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{condolences.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {condolences.filter(c => c.type === 'message').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Trees</p>
                    <p className="text-2xl font-bold text-green-600">
                        {condolences.filter(c => c.type === 'tree').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Flowers</p>
                    <p className="text-2xl font-bold text-pink-600">
                        {condolences.filter(c => c.type === 'flower').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {condolences.filter(c => !c.isApproved).length}
                    </p>
                </div>
            </div>

            {/* Condolences List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    From
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Obituary
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCondolences.map((condolence) => {
                                const TypeIcon = getTypeIcon(condolence.type);
                                return (
                                    <tr key={condolence._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {condolence.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {condolence.email || 'No email'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {condolence.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(condolence.type)}`}>
                                                <TypeIcon size={14} className="mr-1" />
                                                {condolence.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {condolence.obituaryId?.firstName} {condolence.obituaryId?.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => toggleApproval(condolence._id, condolence.isApproved)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    condolence.isApproved
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {condolence.isApproved ? (
                                                    <>
                                                        <CheckCircle size={14} className="mr-1" />
                                                        Approved
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} className="mr-1" />
                                                        Pending
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(condolence.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => viewDetails(condolence)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(condolence._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredCondolences.length === 0 && (
                    <div className="text-center py-12">
                        <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No condolences found</p>
                    </div>
                )}
            </div>

            {/* Condolence Details Modal */}
            {showModal && selectedCondolence && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Condolence Details</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Sender Info */}
                            <div>
                                <h4 className="font-semibold mb-2">From</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">Name:</span> {selectedCondolence.name}</p>
                                    <p><span className="font-medium">Email:</span> {selectedCondolence.email || 'Not provided'}</p>
                                    <p><span className="font-medium">Type:</span> {selectedCondolence.type}</p>
                                </div>
                            </div>

                            {/* Obituary Info */}
                            <div>
                                <h4 className="font-semibold mb-2">Obituary</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">Name:</span> {selectedCondolence.obituaryId?.firstName} {selectedCondolence.obituaryId?.lastName}</p>
                                    <p><span className="font-medium">Obituary ID:</span> {selectedCondolence.obituaryId?._id || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h4 className="font-semibold mb-2">Message</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedCondolence.message}
                                    </p>
                                </div>
                            </div>

                            {/* Product Details (if applicable) */}
                            {selectedCondolence.productDetails && (
                                <div>
                                    <h4 className="font-semibold mb-2">Purchase Details</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <p><span className="font-medium">Product:</span> {selectedCondolence.productDetails.productName}</p>
                                        <p><span className="font-medium">Variant:</span> {selectedCondolence.productDetails.variantName}</p>
                                        <p><span className="font-medium">Quantity:</span> {selectedCondolence.productDetails.quantity}</p>
                                        <p><span className="font-medium">Total:</span> ${selectedCondolence.productDetails.totalPrice?.toFixed(2)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div>
                                <h4 className="font-semibold mb-2">Additional Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">Date:</span> {formatDate(selectedCondolence.createdAt)}</p>
                                    <p><span className="font-medium">Private:</span> {selectedCondolence.isPrivate ? 'Yes' : 'No'}</p>
                                    <p><span className="font-medium">Has Candle:</span> {selectedCondolence.hasCandle ? 'Yes' : 'No'}</p>
                                    <p><span className="font-medium">Status:</span> {selectedCondolence.isApproved ? 'Approved' : 'Pending'}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button
                                    onClick={() => toggleApproval(selectedCondolence._id, selectedCondolence.isApproved)}
                                    className={`px-6 py-2 rounded-lg ${
                                        selectedCondolence.isApproved
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                    } text-white`}
                                >
                                    {selectedCondolence.isApproved ? 'Unapprove' : 'Approve'}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedCondolence._id);
                                        setShowModal(false);
                                    }}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CondolencesAdmin;