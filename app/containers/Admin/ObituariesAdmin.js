import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Eye, 
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Calendar
} from 'lucide-react';

const ObituariesAdmin = () => {
    const [obituaries, setObituaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedObituary, setSelectedObituary] = useState(null);

    const API_URL = 'https://funeralbackend.onrender.com/';

    useEffect(() => {
        let isMounted = true;

        const fetchObituaries = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}api/obituaries`);
                const data = await response.json();
                console.log('Fetched obituaries:', data);
                
                // Only update state if component is still mounted
                if (isMounted) {
                    // Handle both array and object with obituaries property
                    const obituariesData = data.obituaries || data;
                    setObituaries(Array.isArray(obituariesData) ? obituariesData : []);
                }
            } catch (error) {
                console.error('Error fetching obituaries:', error);
                if (isMounted) {
                    alert('Failed to fetch obituaries. Check console for details.');
                    setObituaries([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchObituaries();

        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        };
    }, [API_URL]);

    const fetchObituaries = async () => {
        try {
            const response = await fetch(`${API_URL}api/obituaries`);
            const data = await response.json();
            console.log('Fetched obituaries:', data);
            // Handle both array and object with obituaries property
            const obituariesData = data.obituaries || data;
            setObituaries(Array.isArray(obituariesData) ? obituariesData : []);
        } catch (error) {
            console.error('Error fetching obituaries:', error);
            setObituaries([]);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this obituary?')) return;

        try {
            const response = await fetch(`${API_URL}api/obituaries/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setObituaries(obituaries.filter(obit => obit._id !== id));
                alert('Obituary deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting obituary:', error);
            alert('Failed to delete obituary');
        }
    };

    const togglePublish = async (id, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}api/obituaries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            if (response.ok) {
                fetchObituaries();
            }
        } catch (error) {
            console.error('Error updating obituary:', error);
        }
    };

    const filteredObituaries = Array.isArray(obituaries) ? obituaries.filter(obit => {
        const matchesSearch = 
            obit.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obit.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            obit.location?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = 
            filterStatus === 'all' ||
            (filterStatus === 'published' && obit.isPublished) ||
            (filterStatus === 'draft' && !obit.isPublished);

        return matchesSearch && matchesFilter;
    }) : [];

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
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
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search obituaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={20} />
                    Add Obituary
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Obituaries</p>
                    <p className="text-2xl font-bold text-gray-900">{obituaries.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">
                        {obituaries.filter(o => o.isPublished).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {obituaries.filter(o => !o.isPublished).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {obituaries.filter(o => {
                            const created = new Date(o.createdAt);
                            const now = new Date();
                            return created.getMonth() === now.getMonth() && 
                                   created.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredObituaries.map((obituary) => (
                                <tr key={obituary._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {obituary.photo ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={obituary.photo}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-500 font-medium">
                                                            {obituary.firstName?.[0]}{obituary.lastName?.[0]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {obituary.firstName} {obituary.middleName} {obituary.lastName}
                                                </div>
                                                {obituary.age && (
                                                    <div className="text-sm text-gray-500">
                                                        Age {obituary.age}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(obituary.birthDate)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {formatDate(obituary.deathDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {obituary.location || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => togglePublish(obituary._id, obituary.isPublished)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                obituary.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {obituary.isPublished ? (
                                                <>
                                                    <CheckCircle size={14} className="mr-1" />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} className="mr-1" />
                                                    Draft
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(obituary.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(obituary._id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredObituaries.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No obituaries found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObituariesAdmin;