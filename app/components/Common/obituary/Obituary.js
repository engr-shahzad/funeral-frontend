import React, { Component } from 'react';
import { Heart, Mail, Camera, Video, Flame, MessageSquare, TreePine, User, Gift, Flower, MapPin, Clock, Calendar } from 'lucide-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../../../actions';
import { API_URL } from '../../../constants';
import './ObituaryPage.css';

// Import Swiper for Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css'; 

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

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
        this.state = {
            obituaryData: null,
            condolences: [],
            condolenceStats: {
                messages: 0,
                trees: 0,
                flowers: 0,
                gifts: 0
            },
            totalCondolences: 0,
            newCondolence: '',
            loading: true,
            error: null,
            condolenceName: '',
            condolenceEmail: '',
            // ✅ NEW: Music player state
            isMusicPlaying: false,
            isMusicMuted: false,
            // YouTube modal
            showVideoModal: false,
            isMounted: false
        };

        this.handlePlantTree = this.handlePlantTree.bind(this);
        // ✅ NEW: Audio ref
        this.audioRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ isMounted: true });
        const { slug } = this.props.match.params;
        if (slug) {
            this.fetchObituaryData(slug);
        }
    }

    componentDidUpdate(prevProps) {
        const { slug } = this.props.match.params;
        if (prevProps.match.params.slug !== slug) {
            this.fetchObituaryData(slug);
        }
    }

    fetchObituaryData = (slug) => {
        this.setState({ loading: true, error: null });

        const baseURL = API_URL;

        fetch(`${baseURL}/obituaries/${slug}`)
            .then(obituaryResponse => {
                if (!obituaryResponse.ok) {
                    throw new Error(`Obituary not found (${obituaryResponse.status})`);
                }
                return obituaryResponse.json();
            })
            .then(obituaryData => {
                // Set obituary data + update share/SEO meta tags for Facebook prefill.
                this.setState({ obituaryData }, () => {
                    updateShareMetaTags(obituaryData);
                });
                return fetch(`${baseURL}/condolences/obituary/${obituaryData._id}`);
            })
            .then(condolencesResponse => {
                if (condolencesResponse.ok) {
                    return condolencesResponse.json();
                }
                throw new Error('No condolences found');
            })
            .then(condolencesData => {
                this.setState({
                    condolences: condolencesData.condolences || [],
                    totalCondolences: condolencesData.count || 0,
                    condolenceStats: condolencesData.stats || {
                        messages: 0,
                        trees: 0,
                        flowers: 0,
                        gifts: 0
                    },
                    loading: false
                }, () => {
                    // ✅ NEW: Autoplay music after data is loaded
                    this.playMusic();
                });
            })
            .catch(err => {
                console.error('Error fetching obituary:', err);
                this.setState({
                    error: err.message,
                    loading: false
                });
            });
    }

    handlePlantTree() {
        const { obituaryData } = this.state;
        if (!obituaryData || !obituaryData._id) {
            alert('Error: Obituary data not loaded. Please refresh the page.');
            return;
        }
        const obituaryId = obituaryData._id;
        this.props.fetchMemorialProducts(obituaryId, 'tree')
            .then(() => {
                window.location.href = `/shop?obituaryId=${obituaryId}&filter=tree`;
            })
            .catch(error => {
                console.error('❌ Error:', error);
                window.location.href = `/shop?obituaryId=${obituaryId}&filter=tree`;
            });
    }

    handleSubmitCondolence = () => {
        const { newCondolence, condolenceName, condolenceEmail, obituaryData } = this.state;

        if (!newCondolence.trim() || !condolenceName.trim()) {
            alert('Please enter your name and message');
            return;
        }

        fetch(`${API_URL}/condolences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                obituaryId: obituaryData._id,
                name: condolenceName,
                email: condolenceEmail,
                message: newCondolence,
                type: 'message'
            }),
        })
            .then(response => {
                if (response.ok) {
                    const { slug } = this.props.match.params;
                    this.fetchObituaryData(slug);
                    this.setState({ newCondolence: '', condolenceName: '', condolenceEmail: '' });
                    alert('Condolence posted successfully!');
                } else {
                    alert('Failed to post condolence. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error posting condolence:', error);
                alert('Error posting condolence. Please try again.');
            });
    }

    handleInputChange = (field, value) => {
        this.setState({ [field]: value });
    }

    getCondolenceIcon = (type) => {
        switch (type) {
            case 'tree': return '🌳';
            case 'flower': return '🌸';
            case 'gift': return '🎁';
            default: return '💭';
        }
    }

    getBadgeColor = (type) => {
        switch (type) {
            case 'tree': return 'badge-tree';
            case 'flower': return 'badge-flower';
            case 'gift': return 'badge-gift';
            default: return 'badge-message';
        }
    }

    getTypeLabel = (type) => {
        switch (type) {
            case 'tree': return 'Planted a Tree';
            case 'flower': return 'Sent Flowers';
            case 'gift': return 'Sent a Gift';
            default: return 'Shared a Memory';
        }
    }

    // ✅ NEW: Music control methods
    playMusic = () => {
        const { obituaryData } = this.state;
        if (obituaryData && obituaryData.music && this.audioRef.current) {
            this.audioRef.current.play()
                .then(() => {
                    this.setState({ isMusicPlaying: true });
                })
                .catch(error => {
                    // Browser might block autoplay, that's okay
                });
        }
    }

    pauseMusic = () => {
        if (this.audioRef.current) {
            this.audioRef.current.pause();
            this.setState({ isMusicPlaying: false });
        }
    }

    toggleMusic = () => {
        const { isMusicPlaying } = this.state;
        if (isMusicPlaying) {
            this.pauseMusic();
        } else {
            this.playMusic();
        }
    }

    toggleMute = () => {
        const { isMusicMuted } = this.state;
        if (this.audioRef.current) {
            this.audioRef.current.muted = !isMusicMuted;
            this.setState({ isMusicMuted: !isMusicMuted });
        }
    }

    getYoutubeVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
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
        const {
            obituaryData,
            condolences,
            condolenceStats,
            totalCondolences,
            newCondolence,
            loading,
            error,
            showVideoModal,
            isMounted,
        } = this.state;

        if (loading) return <div className="loading-container"><div className="loading-text">Loading obituary...</div></div>;
        if (error) return <div className="loading-container"><div className="error-container"><p className="error-text">{error}</p></div></div>;
        if (!obituaryData) return <div className="loading-container"><div className="loading-text">Obituary not found</div></div>;

        const approvedCondolences = condolences.filter(c => c.isApproved);
        
        // ✅ Gallery logic with proper filtering
        const galleryImages = this.getGalleryImages(obituaryData);
        const hasMultipleImages = galleryImages.length > 1;

        // YouTube video
        const youtubeVideoId = this.getYoutubeVideoId(obituaryData.videoUrl || obituaryData.externalVideo);
        const youtubeThumbnail = youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : null;
        const origin = (typeof window !== 'undefined') ? window.location.origin : '';
        const youtubeEmbedUrl = youtubeVideoId
            ? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1${origin ? `&origin=${origin}` : ''}`
            : null;


        return (
            <div className="obituary-page">
                {/* Header */}
                <header className="obituary-header">
                    <div className="header-content">
                        <h1 className="header-title">West River Funeral Directors LLC</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* ✅ NEW: Music Controls */}
                            {obituaryData.music && (
                                <div className="music-controls">
                                    <button 
                                        onClick={this.toggleMusic} 
                                        className="music-control-btn"
                                        title={this.state.isMusicPlaying ? 'Pause Music' : 'Play Music'}
                                    >
                                        <i className={`fa fa-${this.state.isMusicPlaying ? 'pause' : 'play'}`}></i>
                                    </button>
                                    <button 
                                        onClick={this.toggleMute} 
                                        className="music-control-btn"
                                        title={this.state.isMusicMuted ? 'Unmute' : 'Mute'}
                                    >
                                        <i className={`fa fa-volume-${this.state.isMusicMuted ? 'off' : 'up'}`}></i>
                                    </button>
                                </div>
                            )}
                            <button onClick={() => window.location.href = '/'} className="home-button">HOME PAGE</button>
                        </div>
                    </div>
                </header>

                {/* ✅ NEW: Hidden Audio Element */}
                {obituaryData.music && (
                    <audio 
                        ref={this.audioRef} 
                        src={obituaryData.music} 
                        loop
                        onPlay={() => this.setState({ isMusicPlaying: true })}
                        onPause={() => this.setState({ isMusicPlaying: false })}
                    />
                )}

                {/* Hero Image (Cover Photo) */}
                <div className="hero-section">
                    <img
                        src={obituaryData.backgroundImage || obituaryData.photo || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600'}
                        alt="Memorial background"
                        className="hero-image"
                    />
                    <div className="hero-overlay"></div>
                </div>

                <div className="main-container">
                    <div className="content-grid">
                        {/* Sidebar */}
                        <aside className="sidebar">
                            <div className="photo-card">
                                <div className="profile-photo-wrapper">
                                    {hasMultipleImages ? (
                                        <GallerySlider images={galleryImages} />
                                    ) : (
                                        <img
                                            src={galleryImages.length > 0 ? galleryImages[0] : (obituaryData.photo || 'https://via.placeholder.com/300x400?text=No+Photo')}
                                            alt={`${obituaryData.firstName} ${obituaryData.lastName}`}
                                            className="profile-photo"
                                        />
                                    )}
                                </div>
                                <div className="obit-sharing">
    <button 
        className="btn ob-btn-social btn-facebook" 
        onClick={() => shareOnFacebook(obituaryData, this.props.match.params.slug)}
        style={{backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'}}
    >
        <i className="fa fa-facebook"></i>
    </button>

    <button 
        className="btn ob-btn-social btn-twitter"
        style={{backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'}}
    >
        <i className="fa fa-twitter"></i>
    </button>
<a
    
        title="Share via email"
        className="btn ob-btn-social btn-email"
        href={`mailto:?subject=Obituary Listing&body=Obituary posted for ${obituaryData.firstName} ${obituaryData.lastName}. See ${window.location.href}`}
        style={{backgroundColor: '#EA4335', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}
    >
        <i className="fa fa-envelope"></i>
    </a>

    <button
        title="Print"
        className="btn ob-btn-social btn-print"
        // onClick={() => window.print()}
        style={{backgroundColor: '#5f6368', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'}}
    >
        <i className="fa fa-print"></i>
    </button>
</div>

                                <div className="button-container">
                                    <button onClick={this.handlePlantTree} className="btns btn-sympathy">Send Sympathy Gifts</button>
                                    <button onClick={this.handlePlantTree} className="btns btn-tree">Plant a Tree for {obituaryData.firstName}</button>
                                    <button onClick={() => document.getElementById('tribute-form').scrollIntoView({ behavior: 'smooth' })} className="btns btn-memory">Share a memory</button>
                                </div>

                                <div className="obituary-grief-support-section">
                                    <h3 className="obituary-grief-support-title" style={{color: '#333'}}>Coping with Grief</h3>
                                    <p className="obituary-grief-support-text" style={{color: '#333'}}>
                                        We would like to offer our sincere support to anyone coping with grief. Enter your email
                                        below to receive a daily grief support messages. Messages run for up to one year and
                                        you can stop at any time. Your email will not be used for any other purpose.
                                    </p>
                                    <input type="email" placeholder="Your Email" className="grief-email-input" />
                                </div>

                                {/* Memorial Stats */}
                                {(condolenceStats.trees > 0 || condolenceStats.flowers > 0 || condolenceStats.gifts > 0) && (
                                    <div className="stats-section">
                                        <div className="stats-card">
                                            <h4 className="stats-title">Memorial Tributes</h4>
                                            <div className="stats-list">
                                                {condolenceStats.trees > 0 && (
                                                    <div className="stat-row">
                                                        <span> Trees Planted</span>
                                                        <span className="stat-number">{condolenceStats.trees}</span>
                                                    </div>
                                                )}
                                                {condolenceStats.flowers > 0 && (
                                                    <div className="stat-row">
                                                        <span>🌸 Flowers Sent</span>
                                                        <span className="stat-number">{condolenceStats.flowers}</span>
                                                    </div>
                                                )}
                                                {condolenceStats.gifts > 0 && (
                                                    <div className="stat-row">
                                                        <span>🎁 Gifts Sent</span>
                                                        <span className="stat-number">{condolenceStats.gifts}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="main-content">
                            <div className="obituary-card">
                                <p className="official-text">Official Obituary of</p>
                                <h2 className="name-title">
                                    {obituaryData.firstName} {obituaryData.middleName} {obituaryData.lastName}
                                </h2>
                                <p className="date-text">
                                    {new Date(obituaryData.birthDate).toLocaleDateString()} - {new Date(obituaryData.deathDate).toLocaleDateString()}
                                </p>

                                {/* 2. Biography */}
                                <div className="obituary-content">
                                    <h3 className="obituary-subtitle">Obituary</h3>
                                    {obituaryData.contentImage && (
                                        <div className="content-image-wrapper">
                                            <img
                                                src={obituaryData.contentImage}
                                                alt={`${obituaryData.firstName} ${obituaryData.lastName}`}
                                                className="content-image"
                                            />
                                        </div>
                                    )}
                                    <div className="biography-text">
                                        {renderBiography(obituaryData.biography)}
                                    </div>
                                </div>

                               

                                {/* 3. Service Section (Redesigned to match image) */}
                                <div className="memorial-service-wrapper">
                                    {/* Burial Notice */}
                                    {/*
                                      Removed: "A private burial will be held with immediate family."
                                      Keep this block empty so layout doesn't show the removed notice.
                                    */}

                                    {/* Memorial Actions */}
                                    <div className="memorial-actions">
                                        <p>
                                            To <a href="#flowers" className="memorial-link">send flowers</a> to the family or{' '}
                                            <a href="#tree" onClick={this.handlePlantTree} className="memorial-link">plant a tree</a> in memory of{' '}
                                            {obituaryData.firstName} {obituaryData.lastName}, please{' '}
                                            <a href="#store" className="memorial-link">visit our floral store</a>.
                                        </p>
                                    </div>

                                    {/* Services Section */}
                                {/* Services Section */}
<div className="services-section">
    <h2 className="services-heading">Services</h2>

    {obituaryData.services && obituaryData.services.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {obituaryData.services.map((service, index) => (
                <div key={index} className="service-cards">

                    {/* Service Header */}
                    <div className="service-header">
                        <h3 className="service-title">
                            {service.type || 'Service'}
                        </h3>
                        <button className="email-details-btn">
                            <Mail size={16} className="email-icon" />
                            Email Details
                        </button>
                    </div>

                    {/* Service Details */}
                    <div className="service-details">
                        <div className="service-detail-item">
                            <Calendar className="detail-icon" size={18} />
                            <span>
                                {service.date
                                    ? new Date(service.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Date Pending'}
                            </span>
                        </div>

                        <div className="service-detail-item">
                            <Clock className="detail-icon" size={18} />
                            <span>{service.time || 'Time Pending'}</span>
                        </div>

                        <div className="service-detail-item">
                            <MapPin className="detail-icon" size={18} />
                            <span>{service.venue || 'Location Pending'}</span>
                        </div>
                    </div>

                </div>
            ))}
        </div>
    ) : (
        <div className="service-cards">
            <div className="service-header">
                <h3 className="service-title">No Services Scheduled</h3>
            </div>
            <div className="service-details">
                <p style={{ color: '#888', margin: 0 }}>
                    Service details will be announced soon.
                </p>
            </div>
        </div>
    )}
</div>
                                </div>

                                {/* 4. Tributes List (Under Services) */}
                                <div className="tribute-content" id="tribute-list">
                                    <div className="tribute-header">
                                        <h3 className="tribute-title">Tribute Wall</h3>
                                        <span className="tribute-count">{totalCondolences} posts</span>
                                    </div>

                                    {/* Tree Banner */}
                                    {condolenceStats.trees > 0 && (
                                        <div className="tree-banner">
                                            <div className="tree-banner-content">
                                                <TreePine size={24} className="tree-icon" />
                                                <span>{condolenceStats.trees} tree{condolenceStats.trees > 1 ? 's' : ''} planted in memory of {obituaryData.firstName}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Tribute Form */}
                                    <div className="add-tribute-form" id="tribute-form">
                                         <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={this.state.condolenceName}
                                            onChange={(e) => this.handleInputChange('condolenceName', e.target.value)}
                                            className="tribute-input"
                                        /> <br/>
                                        <textarea
                                            placeholder="Share your condolences or a memory..."
                                            value={newCondolence}
                                            onChange={(e) => this.handleInputChange('newCondolence', e.target.value)}
                                            className="tribute-textarea"
                                            rows="4"
                                        />
                                        <div className="tribute-actions">
                                            <button onClick={this.handleSubmitCondolence} className="btns btn-sympathy" style={{width: 'auto', padding: '8px 20px'}}>Post Message</button>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div className="condolences-list">
                                        {approvedCondolences.length === 0 ? (
                                            <p className="no-condolences">No tributes yet. Be the first to share a memory.</p>
                                        ) : (
                                            approvedCondolences.map((condolence) => (
                                                <div key={condolence._id} className="condolence-item">
                                                    <div className="condolence-avatar">
                                                        {condolence.name?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    <div className="condolence-content">
                                                        <div className="condolence-header">
                                                            <h4 className="condolence-author">{condolence.name}</h4>
                                                            <span className="condolence-date">
                                                                {new Date(condolence.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {condolence.type !== 'message' && (
                                                            <div className={`type-badge ${this.getBadgeColor(condolence.type)}`}>
                                                                {this.getCondolenceIcon(condolence.type)} {this.getTypeLabel(condolence.type)}
                                                            </div>
                                                        )}
                                                        <p className="condolence-message">{condolence.message}</p>
                                                        {condolence.type === 'tree' && (
                                                            <div className="tree-visual">
                                                                <TreePine size={30} className="tree-visual-icon" />
                                                                <div className="tree-visual-text">
                                                                    <strong>Memorial Tree Planted</strong>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Sticky Floating Video Widget — bottom right corner (client-only) */}
                {isMounted && youtubeVideoId && !showVideoModal && (
                    <div
                        className="yt-sticky-widget"
                        onClick={() => this.setState({ showVideoModal: true })}
                        title="Watch Memorial Video"
                    >
                        <img
                            src={youtubeThumbnail}
                            alt="Memorial Video"
                            className="yt-sticky-thumb"
                        />
                        <div className="yt-sticky-overlay">
                            <svg viewBox="0 0 68 48" width="38" height="27">
                                <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#ff0000"/>
                                <path d="M45 24L27 14v20" fill="#fff"/>
                            </svg>
                        </div>
                        <div className="yt-sticky-label">Memorial Video</div>
                    </div>
                )}

                {/* YouTube Video Popup Modal (client-only) */}
                {isMounted && showVideoModal && youtubeVideoId && (
                    <div className="yt-modal-overlay" onClick={() => this.setState({ showVideoModal: false })}>
                        <div className="yt-modal-box" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="yt-modal-close"
                                onClick={() => this.setState({ showVideoModal: false })}
                            >
                                ✕
                            </button>
                            <div className="yt-modal-iframe-wrap">
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                                    title="Memorial Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    className="yt-modal-iframe"
                                />
                            </div>
                            <a
                                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="yt-watch-link"
                            >
                                ▶ Watch on YouTube
                            </a>
                        </div>
                    </div>
                )}

                <style jsx>{`
                /* Add these styles to your ObituaryPage.css file */

/* Memorial Service Wrapper - Main Container */
.memorial-service-wrapper {
    max-width: 100%;
    margin: 40px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

/* Burial Notice - Gray Box at Top */
.burial-notice {
    background-color: #f5f5f5;
    padding: 20px 30px;
    margin-bottom: 20px;
    border-left: 4px solid #999;
}

.burial-notice p {
    margin: 0;
    color: #555;
    font-size: 15px;
    line-height: 1.6;
}

/* Memorial Actions - Flowers/Tree Links */
.memorial-actions {
    background-color: #f5f5f5;
    padding: 20px 30px;
    margin-bottom: 40px;
}

.memorial-actions p {
    margin: 0;
    color: #555;
    font-size: 15px;
    line-height: 1.6;
}

.memorial-link {
    color: #2c5282;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s ease;
}

.memorial-link:hover {
    color: #1a365d;
}

/* Services Section */
.services-section {
    margin-top: 50px;
}

.services-heading {
    font-size: 32px;
    font-weight: 400;
        margin-left: 2rem;
    color: #333;
    margin-bottom: 30px;
    font-family: Georgia, 'Times New Roman', serif;
}

/* Service Card - White Box with Border */
.service-cards {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Service Header - Top Section with Title and Button */
.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    background-color: #fafafa;
    border-bottom: 1px solid #e0e0e0;
}

.service-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.5px;
    margin: 0;
    text-transform: uppercase;
}

/* Email Details Button */
.email-details-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: white;
    border: 2px solid #333;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    transition: all 0.2s ease;
}

.email-details-btn:hover {
    background-color: #333;
    color: white;
}

.email-details-btn .email-icon {
    display: flex;
    align-items: center;
}

/* Service Details - Date, Time, Location */
.service-details {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.service-detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #555;
    font-size: 16px;
    line-height: 1.6;
}

.detail-icon {
    color: #666;
    flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
    .memorial-service-wrapper {
        margin: 30px 0;
    }

    .burial-notice,
    .memorial-actions {
        padding: 15px 20px;
    }

    .service-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 20px;
    }

    .email-details-btn {
        width: 100%;
        justify-content: center;
    }

    .service-details {
        padding: 20px;
    }

    .services-heading {
        font-size: 28px;
    }

    .service-detail-item {
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    .burial-notice,
    .memorial-actions {
        padding: 12px 15px;
        font-size: 14px;
    }

    .services-heading {
        font-size: 24px;
    }

    .service-title {
        font-size: 16px;
    }

    .service-details {
        padding: 15px;
        gap: 12px;
    }
}
                    /* Music Controls */
                    .music-controls {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                    }

                    .music-control-btn {
                        background: rgba(255, 255, 255, 0.95);
                        border: 2px solid #ddd;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .music-control-btn:hover {
                        background: #ffffff;
                        border-color: #4CAF50;
                        transform: scale(1.05);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }

                    .music-control-btn i {
                        font-size: 16px;
                        color: #333;
                    }

                    .music-control-btn:hover i {
                        color: #4CAF50;
                    }

                    /* Custom Gallery Slider Styles for Profile Photo Wrapper */
                    .profile-photo-wrapper .gallery-custom-slider {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        border-radius: 0;
                        background-color: #f9fafb;
                    }

                    .profile-photo-wrapper .gallery-slider-container {
                        position: relative;
                        width: 100%;
                        height: 100%;
                    }

                    .profile-photo-wrapper .gallery-slider-image {
                    border-radius: 2px;
                        border: 1px solid #e0d9d9;
                        padding: 4px;
                        box-shadow: 1px 1px 1px 1px rgba(50, 50, 50, .1) !important;
                        background: #fff;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        opacity: 0;
                        transition: opacity 0.5s ease-in-out;
                        background-color: #f9fafb;
                    }

                    .profile-photo-wrapper .gallery-slider-image.active {
                        opacity: 1;
                        z-index: 1;
                    }

                    .profile-photo-wrapper .gallery-nav-btn {
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

                    .profile-photo-wrapper .gallery-nav-btn:hover {
                        background: rgba(0, 0, 0, 0.7);
                    }

                    .profile-photo-wrapper .gallery-nav-prev {
                        left: 10px;
                    }

                    .profile-photo-wrapper .gallery-nav-next {
                        right: 10px;
                    }

                    .profile-photo-wrapper .gallery-slider-pagination {
                        position: absolute;
                        bottom: 15px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 8px;
                        z-index: 10;
                    }

                    .profile-photo-wrapper .gallery-pagination-dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        border: none;
                        padding: 0;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .profile-photo-wrapper .gallery-pagination-dot:hover {
                        background: rgba(255, 255, 255, 0.8);
                    }

                    .profile-photo-wrapper .gallery-pagination-dot.active {
                        background: white;
                        transform: scale(1.2);
                    }

                    /* ===== Sticky Floating Video Widget (Bottom Right) ===== */
                    .yt-sticky-widget {
                        position: fixed;
                        bottom: 28px;
                        right: 28px;
                        width: 200px;
                        border-radius: 12px;
                        overflow: hidden;
                        cursor: pointer;
                        z-index: 9000;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                        background: #000;
                    }

                    .yt-sticky-widget:hover {
                        transform: scale(1.04);
                        box-shadow: 0 12px 40px rgba(0,0,0,0.55);
                    }

                    .yt-sticky-thumb {
                        width: 100%;
                        height: 112px;
                        object-fit: cover;
                        display: block;
                        transition: opacity 0.25s ease;
                    }

                    .yt-sticky-widget:hover .yt-sticky-thumb {
                        opacity: 0.6;
                    }

                    .yt-sticky-overlay {
                        position: absolute;
                        top: 0; left: 0;
                        width: 100%; height: 112px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(0,0,0,0.18);
                        transition: background 0.25s ease;
                    }

                    .yt-sticky-widget:hover .yt-sticky-overlay {
                        background: rgba(0,0,0,0.38);
                    }

                    .yt-sticky-label {
                        background: rgba(0,0,0,0.75);
                        color: #fff;
                        font-size: 12px;
                        font-weight: 700;
                        text-align: center;
                        padding: 7px 10px;
                        letter-spacing: 0.4px;
                    }

                    /* ===== YouTube Modal ===== */
                    .yt-modal-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0,0,0,0.85);
                        z-index: 99999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 16px;
                    }

                    .yt-modal-box {
                        position: relative;
                        width: 100%;
                        max-width: 880px;
                        background: #000;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 24px 60px rgba(0,0,0,0.7);
                    }

                    .yt-modal-close {
                        position: absolute;
                        top: -40px;
                        right: 0;
                        background: transparent;
                        border: none;
                        color: #fff;
                        font-size: 24px;
                        font-weight: bold;
                        cursor: pointer;
                        padding: 4px 10px;
                        z-index: 10;
                        line-height: 1;
                    }

                    .yt-modal-close:hover { color: #ff4444; }

                    .yt-watch-link {
                        display: block;
                        text-align: center;
                        padding: 10px;
                        background: #ff0000;
                        color: #fff;
                        font-size: 14px;
                        font-weight: 600;
                        text-decoration: none;
                        letter-spacing: 0.3px;
                    }
                    .yt-watch-link:hover { background: #cc0000; }

                    .yt-modal-iframe-wrap {
                        position: relative;
                        padding-bottom: 56.25%;
                        height: 0;
                    }

                    .yt-modal-iframe {
                        position: absolute;
                        top: 0; left: 0;
                        width: 100%; height: 100%;
                        border: none;
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

// Convert biography text into properly paragraph-formatted markup.
// If biography contains HTML tags, we keep it as-is. Otherwise we interpret `\n\n` as paragraphs.
const renderBiography = (biography) => {
    if (!biography) return null;

    const text = String(biography);
    const looksLikeHtml = /<\/?(p|br|div|span|strong|em|b|i|u|ul|ol|li|a|img)(\s|>)/i.test(text);

    if (looksLikeHtml) {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }

    const normalized = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .trim();

    if (!normalized) return null;

    const paragraphs = normalized
        .split(/\n{2,}/g)
        .map(p => p.trim())
        .filter(Boolean);

    return (
        <>
            {paragraphs.map((p, idx) => {
                const lines = p.split('\n');
                return (
                    <p key={idx}>
                        {lines.map((line, lineIdx) => (
                            <React.Fragment key={lineIdx}>
                                {lineIdx > 0 && <br />}
                                {line}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </>
    );
};

// Update OG/Twitter meta tags so Facebook can prefill share content from the obituary URL.
const updateShareMetaTags = (obituaryData) => {
    if (!obituaryData) return;

    const first = obituaryData.firstName || '';
    const middle = obituaryData.middleName ? ` ${obituaryData.middleName}` : '';
    const last = obituaryData.lastName || '';
    const fullName = `${first}${middle} ${last}`.trim();

    const rawBio = obituaryData.biography ? String(obituaryData.biography) : '';
    const description = rawBio
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240);

    const ogImageCandidate = obituaryData.contentImage || obituaryData.primaryPhoto || obituaryData.photo || '';
    const ogImage =
        ogImageCandidate && /^https?:\/\//i.test(ogImageCandidate)
            ? ogImageCandidate
            : (ogImageCandidate ? `${window.location.origin}${ogImageCandidate}` : '');

    const pageUrl = window.location.href;

    const upsertMeta = (selector, attr, content) => {
        let tag = document.head.querySelector(selector);
        if (!tag) {
            tag = document.createElement('meta');
            if (attr) tag.setAttribute(...attr);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };

    document.title = fullName ? `${fullName} - Obituary` : 'Obituary';

    upsertMeta("meta[property='og:title']", ['property', 'og:title'], fullName ? `${fullName} - Obituary` : 'Obituary');
    upsertMeta("meta[property='og:description']", ['property', 'og:description'], description || 'Obituary');
    upsertMeta("meta[property='og:image']", ['property', 'og:image'], ogImage || '');
    upsertMeta("meta[property='og:url']", ['property', 'og:url'], pageUrl);
    upsertMeta("meta[property='og:type']", ['property', 'og:type'], 'website');

    upsertMeta("meta[name='twitter:card']", ['name', 'twitter:card'], 'summary_large_image');
    upsertMeta("meta[name='twitter:title']", ['name', 'twitter:title'], fullName ? `${fullName} - Obituary` : 'Obituary');
    upsertMeta("meta[name='twitter:description']", ['name', 'twitter:description'], description || 'Obituary');
    upsertMeta("meta[name='twitter:image']", ['name', 'twitter:image'], ogImage || '');
};

const shareOnFacebook = (obituaryData, routeSlug) => {
    const slugOrId = obituaryData?._id || obituaryData?.slug || routeSlug;
    if (!slugOrId) return;

    // Force public domain URL only (no backend URL).
    const publicObituaryUrl = `https://www.westriverfd.com/obituary/${encodeURIComponent(slugOrId)}`;
    const urlToShare = encodeURIComponent(publicObituaryUrl);

    const fmt = (dateValue) => {
        if (!dateValue) return '';
        const dt = new Date(dateValue);
        if (Number.isNaN(dt.getTime())) return '';
        return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const fullName = `${obituaryData?.firstName || ''} ${obituaryData?.middleName || ''} ${obituaryData?.lastName || ''}`
        .replace(/\s+/g, ' ')
        .trim();
    const dob = fmt(obituaryData?.birthDate);
    const dod = fmt(obituaryData?.deathDate);
    const rawBio = obituaryData?.biography ? String(obituaryData.biography) : '';
    const shortBio = rawBio
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
    const quoteText = [fullName, dob && `DOB: ${dob}`, dod && `DOD: ${dod}`, shortBio].filter(Boolean).join(' | ');
    const quote = encodeURIComponent(quoteText);

    window.open(`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}&quote=${quote}`, "_blank");
};

export default connect(mapStateToProps, actions)(withRouter(ObituaryPage));
