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
            isMusicMuted: false
        };

        this.handlePlantTree = this.handlePlantTree.bind(this);
        // ✅ NEW: Audio ref
        this.audioRef = React.createRef();
    }

    componentDidMount() {
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
                this.setState({ obituaryData });
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
        } = this.state;

        if (loading) return <div className="loading-container"><div className="loading-text">Loading obituary...</div></div>;
        if (error) return <div className="loading-container"><div className="error-container"><p className="error-text">{error}</p></div></div>;
        if (!obituaryData) return <div className="loading-container"><div className="loading-text">Obituary not found</div></div>;

        const approvedCondolences = condolences.filter(c => c.isApproved);
        
        // ✅ Gallery logic with proper filtering
        const galleryImages = this.getGalleryImages(obituaryData);
        const hasMultipleImages = galleryImages.length > 1;


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
        onClick={shareOnFacebook}
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
                                    <div className="biography-text" dangerouslySetInnerHTML={{ __html: obituaryData.biography }} />
                                </div>

                               

                                {/* 3. Service Section (Redesigned to match image) */}
                                <div className="memorial-service-wrapper">
                                    {/* Burial Notice */}
                                    <div className="burial-notice">
                                        <p>A private burial will be held with immediate family.</p>
                                    </div>

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
                                    <div className="services-section">
                                        <h2 className="services-heading">Services</h2>
                                        
                                        <div className="service-cards">
                                            <div className="service-header">
                                                <h3 className="service-title">{obituaryData.serviceType || 'CELEBRATION OF LIFE'}</h3>
                                                <button className="email-details-btn">
                                                    <Mail size={16} className="email-icon" />
                                                    Email Details
                                                </button>
                                            </div>
                                            
                                            <div className="service-details">
                                                <div className="service-detail-item">
                                                    <Calendar className="detail-icon" size={18} />
                                                    <span>
                                                        {obituaryData.serviceDate
                                                            ? new Date(obituaryData.serviceDate).toLocaleDateString('en-US', {
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
                                                    <span>{obituaryData.serviceTime || 'Time Pending'}</span>
                                                </div>
                                                
                                                <div className="service-detail-item">
                                                    <MapPin className="detail-icon" size={18} />
                                                    <span>{obituaryData.serviceLocation || 'Location Pending'}</span>
                                                </div>
                                            </div>
                                        </div>
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
                `}</style>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    storeProducts: state.product.storeProducts,
    isLoading: state.product.isLoading
});

const shareOnFacebook = () => {
    const urlToShare = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`, "_blank");
};

export default connect(mapStateToProps, actions)(withRouter(ObituaryPage));
