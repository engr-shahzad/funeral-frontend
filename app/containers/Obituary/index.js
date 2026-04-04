import React, { Component } from 'react';
import { Heart, Mail, TreePine, User, Calendar, Gift, Flower, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../../actions';
import { API_URL } from '../../constants';

// ✅ Custom Gallery Slider Component
class GallerySlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        };
        this.autoplayInterval = null;
    }

    componentDidMount() {
        this.startAutoplay();
    }

    componentWillUnmount() {
        this.stopAutoplay();
    }

    startAutoplay = () => {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    };

    stopAutoplay = () => {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    };

    nextSlide = () => {
        const { images } = this.props;
        this.setState(prevState => ({
            currentIndex: (prevState.currentIndex + 1) % images.length
        }));
    };

    prevSlide = () => {
        const { images } = this.props;
        this.setState(prevState => ({
            currentIndex: prevState.currentIndex === 0 ? images.length - 1 : prevState.currentIndex - 1
        }));
    };

    goToSlide = (index) => {
        this.setState({ currentIndex: index });
        this.stopAutoplay();
        this.startAutoplay();
    };

    render() {
        const { images } = this.props;
        const { currentIndex } = this.state;

        return (
            <div className="gallery-custom-slider">
                <div className="gallery-slider-container">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Memory ${idx + 1}`}
                            className={`gallery-slider-image ${idx === currentIndex ? 'active' : ''}`}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                            }}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button 
                    className="gallery-nav-btn gallery-nav-prev" 
                    onClick={this.prevSlide}
                    aria-label="Previous slide"
                >
                    ‹
                </button>
                <button 
                    className="gallery-nav-btn gallery-nav-next" 
                    onClick={this.nextSlide}
                    aria-label="Next slide"
                >
                    ›
                </button>

                {/* Pagination Dots */}
                <div className="gallery-slider-pagination">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`gallery-pagination-dot ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => this.goToSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

class ObituaryPage extends Component {
    constructor(props) {
        super(props);
        const { serverSideData } = props;
        this.state = {
            obituaryData: serverSideData ? serverSideData.obituaryData || null : null,
            condolences: serverSideData ? serverSideData.condolences || [] : [],
            condolenceStats: serverSideData ? serverSideData.condolenceStats || { messages: 0, trees: 0, flowers: 0, gifts: 0 } : { messages: 0, trees: 0, flowers: 0, gifts: 0 },
            totalCondolences: serverSideData ? serverSideData.totalCondolences || 0 : 0,
            newCondolence: '',
            loading: !serverSideData,
            error: null,
            condolenceName: '',
            condolenceEmail: '',
            griefEmail: ''
        };
        this.handlePlantTree = this.handlePlantTree.bind(this);
    }

    componentDidMount() {
        // Skip client fetching when SSR already provided the initial data.
        if (!this.props.serverSideData) {
            const slug = this.getSlugFromUrl();
            if (slug) {
                this.fetchObituaryData(slug);
            }
        }
    }

    getSlugFromUrl = () => {
        // Prefer React Router match props (works server-side and client-side).
        if (this.props.match && this.props.match.params && this.props.match.params.slug) {
            return this.props.match.params.slug;
        }
        // Fallback: read from the URL (browser only).
        if (typeof window !== 'undefined') {
            const parts = window.location.pathname.split('/');
            return parts[parts.length - 1];
        }
        return null;
    }

    fetchObituaryData = async (slug) => {
        try {
            this.setState({ loading: true, error: null });
            
            // Fetch Obituary
            const obituaryResponse = await fetch(`${API_URL}/obituaries/${slug}`);
            if (!obituaryResponse.ok) throw new Error('Obituary not found');
            const obituaryData = await obituaryResponse.json();
            
            // Fetch Condolences
            const condolencesResponse = await fetch(`${API_URL}/condolences/obituary/${obituaryData._id}`);
            let condolencesData = { condolences: [], count: 0, stats: {} };
            if (condolencesResponse.ok) {
                condolencesData = await condolencesResponse.json();
            }

            this.setState({
                obituaryData,
                condolences: condolencesData.condolences || [],
                totalCondolences: condolencesData.count || 0,
                condolenceStats: condolencesData.stats || {},
                loading: false
            });
        } catch (err) {
            console.error('Error fetching obituary:', err);
            this.setState({ error: err.message, loading: false });
        }
    }

    handleInputChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    }

    async handlePlantTree() {
        const { obituaryData } = this.state;
        if (!obituaryData || !obituaryData._id) return;
        const obituaryId = obituaryData._id;
        try {
            await this.props.fetchMemorialProducts(obituaryId, 'tree');
        } catch (error) {
            console.error('Error:', error);
        }
        window.location.href = `/shop?obituaryId=${obituaryId}&filter=tree`;
    }

    handleSubmitCondolence = async () => {
        const { newCondolence, condolenceName, condolenceEmail, obituaryData } = this.state;

        if (!newCondolence.trim() || !condolenceName.trim()) {
            alert('Please enter your name and message');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/condolences`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    obituaryId: obituaryData._id,
                    name: condolenceName,
                    email: condolenceEmail,
                    message: newCondolence,
                    type: 'message'
                }),
            });
            if (response.ok) {
                this.fetchObituaryData(this.getSlugFromUrl());
                this.setState({ newCondolence: '', condolenceName: '', condolenceEmail: '' });
                alert('Condolence posted successfully! It will be visible after approval.');
            } else {
                alert('Failed to post condolence. Please try again.');
            }
        } catch (error) {
            console.error('Error posting condolence:', error);
            alert('Error posting condolence. Please try again.');
        }
    }

    getBadgeColor = (type) => {
        switch (type) {
            case 'tree': return 'bg-green-100 text-green-800 border-green-200';
            case 'flower': return 'bg-pink-100 text-pink-800 border-pink-200';
            case 'gift': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    }

    formatDate = (date) => {
        if(!date) return "";
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // ✅ Get gallery images with filtering
    getGalleryImages = (obituaryData) => {
        let images = [];

        // Check photos array first
        if (obituaryData.photos && Array.isArray(obituaryData.photos) && obituaryData.photos.length > 0) {
            images = obituaryData.photos.filter(photo => photo && typeof photo === 'string' && photo.trim() !== '');
        }
        // Fallback to images array
        else if (obituaryData.images && Array.isArray(obituaryData.images) && obituaryData.images.length > 0) {
            images = obituaryData.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        }
        // Fallback to individual photo fields
        else {
            const photoFields = [obituaryData.photo, obituaryData.backgroundImage].filter(img => img && typeof img === 'string' && img.trim() !== '');
            if (photoFields.length > 0) {
                images = photoFields;
            }
        }

        return images;
    }

    render() {
        const { obituaryData, condolences, condolenceStats, totalCondolences, loading, error, newCondolence, condolenceName, condolenceEmail } = this.state;

        if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading obituary...</div>;
        if (error || !obituaryData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading obituary.</div>;

        const approvedCondolences = condolences.filter(c => c.isApproved);
        
        // Dynamic Cover Image logic
        const coverImage = obituaryData.backgroundImage || obituaryData.photo || 'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?w=1200';
        
        // ✅ Gallery logic with proper filtering
        const galleryImages = this.getGalleryImages(obituaryData);
        const hasMultipleImages = galleryImages.length > 1;


        return (
            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Header */}
                <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-800 tracking-wide">West River Funeral Directors</h1>
                        <Link to="/" className="text-teal-700 hover:text-teal-900 font-medium text-sm uppercase tracking-wider">Home Page</Link>
                    </div>
                </header>

                {/* 1. Cover Photo (Unique per obituary) */}
                <div className="relative h-96 w-full group">
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity group-hover:bg-opacity-30"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-5xl text-white font-serif font-bold shadow-sm mb-2">
                                {obituaryData.firstName} {obituaryData.lastName}
                            </h1>
                            <p className="text-white text-xl opacity-90 font-light">
                                {this.formatDate(obituaryData.birthDate)} – {this.formatDate(obituaryData.deathDate)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative -mt-24 z-10 border border-gray-100">
                            <img src={obituaryData.photo} alt="Profile" className="w-full h-auto object-cover" />
                            <div className="p-6">
                                <button onClick={this.handlePlantTree} className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md font-semibold mb-3 transition shadow-md flex items-center justify-center gap-2">
                                    <TreePine size={20} /> Plant a Tree
                                </button>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-semibold transition border border-gray-200 flex items-center justify-center gap-2">
                                    <Flower size={20} /> Send Flowers
                                </button>
                            </div>
                        </div>

                        {/* Grief Support Widget */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-100">
                            <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">Grief Support</h3>
                            <p className="text-sm text-gray-600 mb-4">Subscribe to our daily grief support messages.</p>
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                className="w-full border border-gray-300 rounded p-2 text-sm mb-2"
                            />
                            <button className="w-full bg-teal-600 text-white py-2 rounded text-sm font-bold hover:bg-teal-700 transition">
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        
                        {/* 2. Gallery Slider or Single Image */}
                        {galleryImages.length > 0 && (
                            <div className="bg-white p-2 rounded-lg shadow-sm mb-8">
                                {hasMultipleImages ? (
                                    <GallerySlider images={galleryImages} />
                                ) : (
                                    <div className="gallery-single-image-wrapper">
                                        <img 
                                            src={galleryImages[0]} 
                                            alt="Memory" 
                                            className="w-full h-full object-contain bg-gray-50 rounded-lg"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Obituary Text */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-t-4 border-teal-600">
                            <h2 className="text-3xl font-serif text-gray-800 mb-6 pb-2 border-b">Obituary</h2>
                            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {obituaryData.biography}
                            </div>
                        </div>

                        {/* 3. Service Section */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border-l-4 border-teal-600">
                            <h2 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                                <Calendar className="text-teal-600" /> Service Details
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide text-teal-700">Visitation</h4>
                                    <p className="text-gray-700 flex items-center gap-2 font-medium">
                                        <Clock size={16} className="text-gray-500" /> 
                                        {obituaryData.visitationTime || "Time Pending"}
                                    </p>
                                    <p className="text-gray-600 flex items-start gap-2 mt-2 text-sm">
                                        <MapPin size={16} className="text-gray-500 mt-1 shrink-0" />
                                        {obituaryData.visitationLocation || "Location Pending"}
                                    </p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide text-teal-700">Funeral Service</h4>
                                    <p className="text-gray-700 flex items-center gap-2 font-medium">
                                        <Clock size={16} className="text-gray-500" />
                                        {obituaryData.serviceTime || "Time Pending"}
                                    </p>
                                    <p className="text-gray-600 flex items-start gap-2 mt-2 text-sm">
                                        <MapPin size={16} className="text-gray-500 mt-1 shrink-0" />
                                        {obituaryData.serviceLocation || "Location Pending"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4. List of Trees & Condolences (Under Service Section) */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="flex flex-wrap justify-between items-center mb-8 border-b pb-4">
                                <h2 className="text-2xl font-serif text-gray-800">Tributes & Condolences</h2>
                                <span className="bg-teal-50 text-teal-800 py-1 px-4 rounded-full text-sm font-bold border border-teal-100">
                                    {totalCondolences} Memories Shared
                                </span>
                            </div>

                            {/* Tree Summary */}
                            {condolenceStats.trees > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4 shadow-sm">
                                    <div className="bg-white p-3 rounded-full shadow-sm border border-green-100">
                                        <TreePine className="text-green-600" size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-green-900 text-xl">{condolenceStats.trees} Memorial Trees Planted</p>
                                        <p className="text-green-700">A living tribute has been planted in memory of {obituaryData.firstName}.</p>
                                        <button onClick={this.handlePlantTree} className="text-sm font-bold text-green-800 underline mt-1 hover:text-green-900">Plant another tree</button>
                                    </div>
                                </div>
                            )}

                            {/* Add Condolence Form */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-4">Share a Memory</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="Your Name" 
                                        className="border rounded p-3 w-full"
                                        value={condolenceName}
                                        onChange={this.handleInputChange('condolenceName')}
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Your Email (Hidden)" 
                                        className="border rounded p-3 w-full"
                                        value={condolenceEmail}
                                        onChange={this.handleInputChange('condolenceEmail')}
                                    />
                                </div>
                                <textarea 
                                    placeholder="Share your condolences or a memory..." 
                                    className="border rounded p-3 w-full h-32 mb-4"
                                    value={newCondolence}
                                    onChange={this.handleInputChange('newCondolence')}
                                ></textarea>
                                <button 
                                    onClick={this.handleSubmitCondolence}
                                    className="bg-teal-700 text-white px-6 py-2 rounded font-bold hover:bg-teal-800 transition"
                                >
                                    Post Tribute
                                </button>
                            </div>

                            {/* List */}
                            <div className="space-y-8">
                                {approvedCondolences.length === 0 ? (
                                    <p className="text-gray-500 italic text-center py-8">No tributes have been shared yet. Be the first to light a candle or share a memory.</p>
                                ) : (
                                    approvedCondolences.map((condolence) => (
                                        <div key={condolence._id} className="relative pl-8 border-l-2 border-gray-200 pb-8 last:pb-0">
                                            <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>
                                            
                                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                                                            {condolence.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900">{condolence.name}</h4>
                                                            <p className="text-xs text-gray-500">{this.formatDate(condolence.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {condolence.type !== 'message' && (
                                                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${this.getBadgeColor(condolence.type)}`}>
                                                            {condolence.type === 'tree' ? 'Planted a Tree' : 'Sent a Gift'}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-700 leading-relaxed">
                                                    {condolence.message}
                                                </p>
                                                
                                                {condolence.type === 'tree' && (
                                                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 p-2 rounded inline-block">
                                                        <TreePine size={16} /> Planted a tree in memory of {obituaryData.firstName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    /* Custom Gallery Slider Styles */
                    .gallery-custom-slider {
                        position: relative;
                        width: 100%;
                        height: 400px;
                        overflow: hidden;
                        border-radius: 8px;
                        background-color: #f9fafb;
                    }

                    .gallery-slider-container {
                        position: relative;
                        width: 100%;
                        height: 100%;
                    }

                    .gallery-slider-image {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        opacity: 0;
                        transition: opacity 0.5s ease-in-out;
                        background-color: #f9fafb;
                    }

                    .gallery-slider-image.active {
                        opacity: 1;
                        z-index: 1;
                    }

                    .gallery-nav-btn {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.5);
                        color: white;
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        font-size: 24px;
                        cursor: pointer;
                        z-index: 10;
                        transition: background 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .gallery-nav-btn:hover {
                        background: rgba(0, 0, 0, 0.7);
                    }

                    .gallery-nav-prev {
                        left: 10px;
                    }

                    .gallery-nav-next {
                        right: 10px;
                    }

                    .gallery-slider-pagination {
                        position: absolute;
                        bottom: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 8px;
                        z-index: 10;
                    }

                    .gallery-pagination-dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        border: none;
                        padding: 0;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .gallery-pagination-dot:hover {
                        background: rgba(255, 255, 255, 0.8);
                    }

                    .gallery-pagination-dot.active {
                        background: white;
                        transform: scale(1.2);
                    }

                    .gallery-single-image-wrapper {
                        width: 100%;
                        height: 400px;
                        border-radius: 8px;
                        overflow: hidden;
                        background-color: #f9fafb;
                    }

                    .gallery-single-image-wrapper img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    storeProducts: state.product.storeProducts,
    isLoading: state.product.isLoading
});

export default connect(mapStateToProps, actions)(ObituaryPage);