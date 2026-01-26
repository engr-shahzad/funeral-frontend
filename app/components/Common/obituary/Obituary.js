import React, { Component } from 'react';
import { Heart, Mail, Camera, Video, Flame, MessageSquare, TreePine, User, Gift, Flower, MapPin, Clock, Calendar } from 'lucide-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../../../actions';
import './ObituaryPage.css';

// Import Swiper for Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/swiper-bundle.css'; 

// Install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

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
            condolenceEmail: ''
            // Removed activeTab state
        };

        this.handlePlantTree = this.handlePlantTree.bind(this);
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

        const baseURL = 'https://funeralbackend.onrender.com/api';

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

        fetch('https://funeralbackend.onrender.com/api/condolences', {
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
        console.log('Approved Condolences:', obituaryData);
        
        // Prepare images for slider (Mock array if only single photo exists)
        const galleryImages = obituaryData.images && obituaryData.images.length > 0 
            ? obituaryData.images 
            : [obituaryData.photo, obituaryData.backgroundImage].filter(Boolean);

        return (
            <div className="obituary-page">
                {/* Header */}
                <header className="obituary-header">
                    <div className="header-content">
                        <h1 className="header-title">West River Funeral Directors LLC</h1>
                        <button onClick={() => window.location.href = '/'} className="home-button">HOME PAGE</button>
                    </div>
                </header>

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
                                    <img
                                        src={obituaryData.photo || 'https://via.placeholder.com/300x400?text=No+Photo'}
                                        alt={`${obituaryData.firstName} ${obituaryData.lastName}`}
                                        className="profile-photo"
                                    />
                                </div>
                                <div className="obit-sharing">
                                    <button className="btn ob-btn-social btn-facebook" onClick={shareOnFacebook}><i className="fa fa-facebook"></i></button>
                                    <button className="btn ob-btn-social btn-twitter"><i className="fa fa-twitter"></i></button>
                                    <a
                                    title="Share via email"
                                    className="btn ob-btn-social btn-email"
                                    href={`mailto:?subject=Obituary Listing&body=Obituary posted for ${obituaryData.firstName} ${obituaryData.lastName}. See ${window.location.href}`}
                                    >
                                    <i className="fa fa-envelope"></i>
                                    </a>

                                    <button
                                    title="Print"
                                    className="btn ob-btn-social btn-print"
                                   // onClick={() => window.print()}
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

                                {/* 1. Image Slider */}
                                {/* {galleryImages.length > 0 && (
                                    <div className="obituary-slider-wrapper">
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            autoplay={{ delay: 3000 }}
                                            className="obituary-swiper"
                                        >
                                            {galleryImages.map((img, idx) => (
                                                <SwiperSlide key={idx}>
                                                    <img src={img} alt={`Slide ${idx}`} className="slider-image" />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )} */}

                                {/* 2. Biography */}
                                <div className="obituary-content">
                                    <h3 className="obituary-subtitle">Obituary</h3>
                                    <div className="biography-text" dangerouslySetInnerHTML={{ __html: obituaryData.biography }} />
                                </div>

                                {/* 3. Service Section (Detailed) */}
                                <div className="services-section-container">
                                    <h3 className="services-title">Service Details</h3>
                                    <div className="services-grid">
                                        <div className="service-box">
                                            <div className="service-icon"><Calendar size={20} /></div>
                                            <div className="service-info">
                                                <h4>Visitation</h4>
                                                <p>{obituaryData.visitationTime || 'Time Pending'}</p>
                                                <p className="service-location">{obituaryData.visitationLocation || 'Location Pending'}</p>
                                            </div>
                                        </div>
                                        <div className="service-box">
                                            <div className="service-icon"><Clock size={20} /></div>
                                            <div className="service-info">
                                                <h4>Funeral Service</h4>
                                                <p>{obituaryData.serviceTime || 'Time Pending'}</p>
                                                <p className="service-location">{obituaryData.serviceLocation || 'Location Pending'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="service-cta">
                                        <p>Show your support by sending flowers or planting a tree.</p>
                                        <button onClick={this.handlePlantTree} className="btns btn-tree-full">
                                            Plant a tree in memory of {obituaryData.firstName}
                                        </button>
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