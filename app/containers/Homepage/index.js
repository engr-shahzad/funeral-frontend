import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, MapPin, Phone, Mail } from 'lucide-react';

import actions from '../../actions';
import { API_URL } from '../../constants';

import banners from './banners.json';
import CarouselSlider from '../../components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils';
import ImmediateNeedPopup from '../ImmediateNeedPopup';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([Autoplay, Pagination]);

import './Home.css';

// ✅ Custom Image Slider Component for Tributes
class TributeImageSlider extends Component {
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
    }, 3000);
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

  goToSlide = (index) => {
    this.setState({ currentIndex: index });
    this.stopAutoplay();
    this.startAutoplay();
  };

  render() {
    const { images, name } = this.props;
    const { currentIndex } = this.state;

    return (
      <div className="tribute-custom-slider">
        <div className="tribute-slider-container">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${name} ${idx + 1}`}
              className={`tribute-slider-image ${idx === currentIndex ? 'active' : ''}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="tribute-slider-pagination">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`tribute-pagination-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => this.goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
}

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      searchQuery: '',
      tributes: [],
      loading: true,
      error: null,
      settings: null
    };
  }

  componentDidMount() {
    this.fetchRecentTributes();
    this.fetchHomepageSettings();
  }

  fetchHomepageSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/homepage-settings`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          this.setState({ settings: data });
        }
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    }
  };

  fetchRecentTributes = async () => {
    try {
      this.setState({ loading: true, error: null });

      const response = await fetch(`${API_URL}/obituaries/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tributes');
      }

      const data = await response.json();

      const formattedTributes = data.map(obituary => {
        // ✅ Handle photos array properly with filtering
        let images = [];
        if (obituary.photos && Array.isArray(obituary.photos) && obituary.photos.length > 0) {
          images = obituary.photos.filter(photo => photo && typeof photo === 'string' && photo.trim() !== '');
        } else if (obituary.photo && typeof obituary.photo === 'string' && obituary.photo.trim() !== '') {
          images = [obituary.photo];
        } else if (obituary.IMAGE && typeof obituary.IMAGE === 'string' && obituary.IMAGE.trim() !== '') {
          images = [obituary.IMAGE];
        }

        // Default to placeholder if no images
        if (images.length === 0) {
          images = ['https://via.placeholder.com/200x200?text=No+Image'];
        }

        return {
          id: obituary._id,
          name: `${obituary.firstName || obituary.FIRST || ''} ${obituary.lastName || obituary.LAST || ''}`.toUpperCase().trim(),
          date: this.formatDate(obituary.deathDate || obituary.DOD),
          location: obituary.location || 'Unknown',
          images: images,
          image: images[0],
          slug: obituary.slug || obituary._id
        };
      });

      this.setState({
        tributes: formattedTributes,
        loading: false
      });

    } catch (error) {
      console.error('Error fetching tributes:', error);
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  handlePrevious = () => {
    this.setState(prevState => ({
      currentIndex: Math.max(0, prevState.currentIndex - 1)
    }));
  };

  handleNext = () => {
    const itemsPerPage = 6;
    const maxIndex = Math.max(0, this.state.tributes.length - itemsPerPage);
    this.setState(prevState => ({
      currentIndex: Math.min(maxIndex, prevState.currentIndex + 1)
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearch = async () => {
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) {
      this.fetchRecentTributes();
      return;
    }

    try {
      this.setState({ loading: true });

      const response = await fetch(`${API_URL}/obituaries/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      const formattedTributes = data.map(obituary => {
        let images = [];
        if (obituary.photos && Array.isArray(obituary.photos) && obituary.photos.length > 0) {
          images = obituary.photos.filter(photo => photo && typeof photo === 'string' && photo.trim() !== '');
        } else if (obituary.photo && typeof obituary.photo === 'string' && obituary.photo.trim() !== '') {
          images = [obituary.photo];
        } else if (obituary.IMAGE && typeof obituary.IMAGE === 'string' && obituary.IMAGE.trim() !== '') {
          images = [obituary.IMAGE];
        }

        if (images.length === 0) {
          images = ['https://via.placeholder.com/200x200?text=No+Image'];
        }

        return {
          id: obituary._id,
          name: `${obituary.firstName || obituary.FIRST || ''} ${obituary.lastName || obituary.LAST || ''}`.toUpperCase().trim(),
          date: this.formatDate(obituary.deathDate || obituary.DOD),
          location: obituary.location || 'Unknown',
          images: images,
          image: images[0],
          slug: obituary.slug || obituary._id
        };
      });

      this.setState({
        tributes: formattedTributes,
        loading: false,
        currentIndex: 0
      });

    } catch (error) {
      console.error('Error searching tributes:', error);
      this.setState({ loading: false });
    }
  };

  handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearch();
    }
  };

  renderCustomSections(placement) {
    const { settings } = this.state;
    const sections = (settings?.customSections || [])
      .filter(sec => sec.enabled !== false && (sec.placement || 'afterHeroSection') === placement);

    if (sections.length === 0) return null;

    return sections.map((sec, i) => {
      const paddingMap = { small: '20px 0', medium: '60px 0', large: '100px 0' };
      const padding = paddingMap[sec.paddingSize] || '60px 0';
      const textAlign = sec.contentAlignment || 'left';
      const HeadingTag = sec.headingSize || 'h2';
      const outerStyle = {
        marginTop: sec.marginTop ? `${sec.marginTop}px` : undefined,
        marginBottom: sec.marginBottom ? `${sec.marginBottom}px` : undefined
      };
      const ctaBtnStyle = {
        primary:   'welcome-cta-btn',
        secondary: 'tributes-action-btn',
        outline:   'hero-cta-button',
        ghost:     'hero-cta-button'
      }[sec.ctaStyle] || 'welcome-cta-btn';

      if (sec.layout === 'imageBg') {
        return (
          <div key={`${placement}-${i}`} style={outerStyle}>
            <div style={{
              position: 'relative',
              backgroundImage: sec.backgroundImage ? `url(${sec.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: sec.backgroundColor || '#1a1a1a',
              padding,
              color: sec.textColor || '#ffffff'
            }}>
              {sec.backgroundImage && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${sec.overlayOpacity ?? 0.4})` }} />
              )}
              <Container style={{ maxWidth: '1000px', position: 'relative', zIndex: 1, textAlign }}>
                {sec.label && <p className="welcome-label" style={{ color: sec.textColor || '#ccc' }}>{sec.label}</p>}
                {sec.heading && <HeadingTag className="welcome-title" style={{ color: sec.textColor || '#fff' }}>{sec.heading}</HeadingTag>}
                {sec.text && <div className="welcome-text" style={{ color: sec.textColor || '#eee' }} dangerouslySetInnerHTML={{ __html: sec.text }} />}
                {sec.ctaText && sec.ctaLink && (
                  <Link to={sec.ctaLink}><button className={ctaBtnStyle} style={{ marginTop: '16px' }}>{sec.ctaText}</button></Link>
                )}
              </Container>
            </div>
          </div>
        );
      }

      if (sec.layout === 'imageLeft' || sec.layout === 'imageRight') {
        const imgCol = (
          <Col lg={6} className="mb-4 mb-lg-0">
            {sec.image && <div className="welcome-image-wrapper"><img src={sec.image} alt={sec.heading || 'section'} className="img-fluid welcome-image" /></div>}
          </Col>
        );
        const textCol = (
          <Col lg={6}>
            <div className="welcome-content" style={{ textAlign, color: sec.textColor || '#333' }}>
              {sec.label && <p className="welcome-label">{sec.label}</p>}
              {sec.heading && <HeadingTag className="welcome-title">{sec.heading}</HeadingTag>}
              {sec.text && <div className="welcome-text" dangerouslySetInnerHTML={{ __html: sec.text }} />}
              {sec.ctaText && sec.ctaLink && (
                <Link to={sec.ctaLink}><button className={ctaBtnStyle} style={{ marginTop: '12px' }}>{sec.ctaText}</button></Link>
              )}
            </div>
          </Col>
        );
        return (
          <div key={`${placement}-${i}`} className="welcome-section" style={{ backgroundColor: sec.backgroundColor || '#fff', padding, ...outerStyle }}>
            <Container style={{ maxWidth: '1400px' }}>
              <Row className="align-items-center">
                {sec.layout === 'imageLeft' ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
              </Row>
            </Container>
          </div>
        );
      }

      // textOnly
      return (
        <div key={`${placement}-${i}`} style={{ backgroundColor: sec.backgroundColor || '#fff', padding, color: sec.textColor || '#333', ...outerStyle }}>
          <Container style={{ maxWidth: '1000px', textAlign }}>
            {sec.label && <p className="welcome-label">{sec.label}</p>}
            {sec.heading && <HeadingTag className="welcome-title">{sec.heading}</HeadingTag>}
            {sec.text && <div className="welcome-text" dangerouslySetInnerHTML={{ __html: sec.text }} />}
            {sec.ctaText && sec.ctaLink && (
              <Link to={sec.ctaLink}><button className={ctaBtnStyle} style={{ marginTop: '12px' }}>{sec.ctaText}</button></Link>
            )}
          </Container>
        </div>
      );
    });
  }

  render() {
    const { currentIndex, searchQuery, tributes, loading, error, settings } = this.state;
    const itemsPerPage = 6;
    const maxIndex = Math.max(0, tributes.length - itemsPerPage);
    const visibleTributes = tributes.slice(currentIndex, currentIndex + itemsPerPage);

    // Default slides fallback
    const defaultSlides = [
      {
        image: 'https://s3.amazonaws.com/CFSV2/obituaries/galleries/12123/1663011/68b14f5742047.png',
        title: 'Celebrate Life',
        ctaText: 'OUR SERVICES',
        ctaLink: '/our-services'
      },
      {
        image: '/images/banners/banner2.jpeg?w=1600',
        title: 'Celebrate Life',
        ctaText: 'OUR SERVICES',
        ctaLink: '/our-services'
      }
    ];

    const slides = (settings?.heroBanner?.slides?.length > 0 && settings.heroBanner.slides[0].image)
      ? settings.heroBanner.slides
      : defaultSlides;

    // SEO settings
    const seo = settings?.seo || {};

    return (
      <div className='homepage'>
        {/* SEO Meta Tags */}
        <Helmet>
          {seo.metaTitle && <title>{seo.metaTitle}</title>}
          {seo.metaDescription && <meta name="description" content={seo.metaDescription} />}
          {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}
          {(seo.ogTitle || seo.metaTitle) && <meta property="og:title" content={seo.ogTitle || seo.metaTitle} />}
          {(seo.ogDescription || seo.metaDescription) && <meta property="og:description" content={seo.ogDescription || seo.metaDescription} />}
          {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
          <meta property="og:type" content="website" />
          {seo.twitterCard && <meta name="twitter:card" content={seo.twitterCard} />}
          {(seo.twitterTitle || seo.metaTitle) && <meta name="twitter:title" content={seo.twitterTitle || seo.metaTitle} />}
          {(seo.twitterDescription || seo.metaDescription) && <meta name="twitter:description" content={seo.twitterDescription || seo.metaDescription} />}
          {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
        </Helmet>

        {/* Hero Banner Section */}
        <div className="hero-banner-section">
          <Swiper autoplay={{ delay: 4000 }} loop pagination={{ clickable: true }}>
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="hero-slide-bg"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '750px',
                    position: 'relative'
                  }}
                >
                  <div className="hero-overlay" />
                  <div className="hero-content">
                    <div className="hero-text-wrapper">
                      <h2 className="hero-title">{slide.title || 'Celebrate Life'}</h2>
                      <Link to={slide.ctaLink || '/our-services'}>
                        <button className="hero-cta-button">{slide.ctaText || 'OUR SERVICES'}</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {this.renderCustomSections('afterHeroBanner')}

        {/* Recent Tributes Section */}
        <Container fluid className="tributes-section-wrapper">
          <Container style={{ maxWidth: '1400px' }}>
            <Row className="tributes-header mb-4 pb-3">
              <Col lg={6} className="d-flex align-items-center mb-3 mb-lg-0">
                <h2 className="tributes-title mb-0">Recent Tributes</h2>
              </Col>
              <Col lg={6} className="d-flex justify-content-lg-end align-items-center">
                <div className="search-wrapper position-relative">
                  <Input
                    type="text"
                    placeholder="Obituary search..."
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                    onKeyPress={this.handleSearchKeyPress}
                    className="search-input rounded-pill"
                  />
                  <Search className="search-icon position-absolute" size={18} onClick={this.handleSearch} />
                </div>
              </Col>
            </Row>

            {loading && (
              <Row>
                <Col className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Loading tributes...</p>
                </Col>
              </Row>
            )}

            {error && (
              <Row>
                <Col>
                  <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error</h4>
                    <p>{error}</p>
                    <button color="primary" onClick={this.fetchRecentTributes}>Try Again</button>
                  </div>
                </Col>
              </Row>
            )}

            {!loading && !error && tributes.length > 0 && (
              <div className="tributes-carousel-wrapper">
                <div className="tributes-carousel position-relative">
                  <button className="carousel-nav-btn carousel-nav-prev" onClick={this.handlePrevious} disabled={currentIndex === 0}>
                    <ChevronLeft size={24} />
                  </button>

                  <button className="carousel-nav-btn carousel-nav-next" onClick={this.handleNext} disabled={currentIndex >= maxIndex}>
                    <ChevronRight size={24} />
                  </button>

                  <Row className="tribute-cards-row">
                    {visibleTributes.map((tribute) => (
                        <Col key={tribute.id} xs={6} sm={4} md={4} lg={2} className="mb-4 tribute-card-col">
                          <Link to={`/obituary/${tribute.slug}`} className="text-decoration-none">
                            <div className="tribute-card text-center">
                              <div className="tribute-image-wrapper mb-2">
                                <img
                                  src={tribute.image}
                                  alt={tribute.name}
                                  className="tribute-image"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                  }}
                                />
                              </div>
                              <h3 className="tribute-name">{tribute.name}</h3>
                              <p className="tribute-date">{tribute.date}</p>
                              <p className="tribute-location">{tribute.location}</p>
                            </div>
                          </Link>
                        </Col>
                    ))}
                  </Row>
                </div>

                <Row className="mt-4">
                  <Col className="d-flex justify-content-center flex-wrap">
                    <Link to="/obituaries">
                      <button className="tributes-action-btn mx-2 mb-2">VIEW ALL TRIBUTES</button>
                    </Link>
                    <Link to="/alerts">
                      <button className="tributes-action-btn mx-2 mb-2">JOIN OBITUARY ALERTS</button>
                    </Link>
                  </Col>
                </Row>
              </div>
            )}

            {!loading && !error && tributes.length === 0 && (
              <Row>
                <Col className="text-center py-5">
                  <h3>No tributes found</h3>
                  <p className="text-muted">Try adjusting your search or check back later.</p>
                </Col>
              </Row>
            )}
          </Container>
        </Container>
        {this.renderCustomSections('afterTributes')}

        {/* Welcome Section */}
        {(settings?.welcomeSection?.enabled !== false) && (
        <div className="welcome-section">
          <Container style={{ maxWidth: '1400px' }}>
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <div className="welcome-image-wrapper">
                  <img src={settings?.welcomeSection?.image || "https://s3.amazonaws.com/CFSV2/siteimages/wvr/321486-img.jpg"} alt={settings?.welcomeSection?.title || "West River Funeral Directors"} className="img-fluid welcome-image" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="welcome-content">
                  <p className="welcome-label">{settings?.welcomeSection?.label || 'WELCOME TO'}</p>
                  <h2 className="welcome-title">{settings?.welcomeSection?.title || 'West River Funeral Directors LLC'}</h2>
                  <p className="welcome-text">
                    {settings?.welcomeSection?.description || 'Welcome to our website. We provide individualized funeral services designed to meet the needs of each family. Our staff of dedicated professionals is available to assist you in making funeral service arrangements. From casket choices to funeral flowers, we will guide you through all aspects of the funeral service.'}
                  </p>
                  {!settings?.welcomeSection?.description && (
                    <p className="welcome-text">
                      We invite you to <Link to="/contact-us" className="welcome-link">contact us</Link> with your questions, 24 hours a day, 7 days a week.
                    </p>
                  )}
                  <Link to={settings?.welcomeSection?.ctaLink || '/about-us'}>
                    <button className="welcome-cta-btn">{settings?.welcomeSection?.ctaText || 'LEARN MORE'}</button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        )}
        {this.renderCustomSections('afterWelcome')}
{/* Welcome Section Alternate */}



        {this.renderCustomSections('afterHeroSection')}

        {/* Services Grid Section */}
        {(settings?.servicesGrid?.enabled !== false) && (() => {
          const defaultServices = [
            { title: 'Pre-Plan', image: 'https://s3.amazonaws.com/CFSV2/stockimages/28865-people-3120717.jpg', link: '/pre-arrangements' },
            { title: 'Send Flowers', image: 'https://s3.amazonaws.com/CFSV2/stockimages/804104-Send-Flowers-8.jpg', link: '/send-flowers' },
            { title: 'Grief Support', image: 'https://s3.amazonaws.com/CFSV2/stockimages/170757-mother-daughter-hug.jpg', link: '/grief-support' },
            { title: 'F.A.Q.', image: 'https://s3.amazonaws.com/CFSV2/stockimages/383488-Notebook-4.png', link: '/faqs' }
          ];
          const services = (settings?.servicesGrid?.services?.length > 0 && settings.servicesGrid.services[0].title)
            ? settings.servicesGrid.services
            : defaultServices;
          return (
            <div className="services-grid-section">
              <Container fluid style={{ padding: 0 }}>
                <Row className="g-0">
                  {services.slice(0, 2).map((svc, i) => (
                    <Col key={i} md={6} lg={6} className="service-grid-item">
                      <Link to={svc.link || '#'} className="service-card-link">
                        <div className="service-card" style={{ backgroundImage: `url(${svc.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="service-card-overlay"></div>
                          <div className="service-card-content">
                            <h3 className="service-card-title">{svc.title}</h3>
                          </div>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
                <Row className="g-0 mt-4">
                  {services.slice(2, 4).map((svc, i) => (
                    <Col key={i} md={6} lg={6} className="service-grid-item">
                      <Link to={svc.link || '#'} className="service-card-link">
                        <div className="service-card" style={{ backgroundImage: `url(${svc.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                          <div className="service-card-overlay"></div>
                          <div className="service-card-content">
                            <h3 className="service-card-title">{svc.title}</h3>
                          </div>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          );
        })()}
        {this.renderCustomSections('afterServicesGrid')}

        {/* Testimonials Section */}
        {(settings?.testimonials?.enabled !== false) && (
        <div className="testimonials-section">
          <Container style={{ maxWidth: '1200px' }}>
            <div className="testimonials-header text-center mb-5">
              <h2 className="testimonials-title">{settings?.testimonials?.title || 'What Our Families are Saying...'}</h2>
              <p className="testimonials-subtitle">{settings?.testimonials?.subtitle || 'TESTIMONIALS'}</p>
            </div>
            <Row>
              <Col lg={8} className="mx-auto">
                <div className="testimonial-card">
                  <p className="testimonial-text">
                    {settings?.testimonials?.text || '"We are always impressed in hearing from the families that we serve. Please take a moment to let us know how we are doing by sharing your experience via our testimonials link. We very much appreciate your feedback."'}
                  </p>
                  <div className="text-center mt-4">
                    <Link to={settings?.testimonials?.ctaLink || '/testimonials'}>
                      <button className="testimonial-btn">{settings?.testimonials?.ctaText || 'Click to enter your testimonial »'}</button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        )}
        {this.renderCustomSections('afterTestimonials')}

        {/* Google Reviews Section */}
        {(settings?.googleReviews?.enabled !== false) && (
        <div className="google-reviews-section">
          <Container style={{ maxWidth: '800px' }}>
            <div className="text-center">
              <h3 className="google-reviews-title">{settings?.googleReviews?.title || 'See Our Google Reviews'}</h3>
              <div className="qr-code-wrapper mt-4">
                <img src={settings?.googleReviews?.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"} alt="QR Code for Google Reviews" className="qr-code-image" />
              </div>
            </div>
          </Container>
        </div>
        )}
        {this.renderCustomSections('afterGoogleReviews')}

        {/* Location Section */}
        {(settings?.location?.enabled !== false) && (() => {
          const loc = settings?.location || {};
          const businessName = loc.businessName || 'West River Funeral Directors LLC';
          const address = loc.address || '420 East Saint Patrick St. Ste 106';
          const cityStateZip = `${loc.city || 'Rapid City'}, ${loc.state || 'SD'} ${loc.zip || '57701'}`;
          const phone = loc.phone || '1-605-787-3940';
          const fax = loc.fax || '1-605-854-5202';
          const mapUrl = loc.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2866.7432352779197!2d-103.2094104!3d44.0680104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x877d43ef63b356ed%3A0xae3a396c4423ff90!2sWest%20River%20Funeral%20Directors%2C%20Funeral%20Home%20%26%20Cremation%20Services!5e0!3m2!1sen!2sus!4v1768864728088!5m2!1sen!2sus';
          return (
            <div className="location-section">
              <Container fluid style={{ padding: 0 }}>
                <Row className="g-0">
                  <Col lg={6}>
                    <div className="location-info">
                      <h3 className="location-title">{loc.title || 'Our Location'}</h3>
                      <div className="location-details">
                        <div className="location-detail-item">
                          <MapPin size={20} />
                          <div>
                            <p className="mb-0"><strong>{businessName}</strong></p>
                            <p className="mb-0">{address}</p>
                            <p className="mb-0">{cityStateZip}</p>
                          </div>
                        </div>
                        <div className="location-detail-item">
                          <Phone size={20} />
                          <div>
                            <p className="mb-0">Tel: {phone}</p>
                            <p className="mb-0">Fax: {fax}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="location-map">
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title={`${businessName} Location`}
                      ></iframe>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          );
        })()}
        {this.renderCustomSections('afterLocation')}

        {/* View Services CTA */}
        <div className="view-services-cta">
          <Container>
            <div className="text-center">
              <Link to="/our-services">
                <button className="view-services-btn">VIEW SERVICES</button>
              </Link>
            </div>
          </Container>
        </div>

        <ImmediateNeedPopup />

        <style>{`
          /* Custom Tribute Slider Styles */
          .tribute-custom-slider {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
          }

          .tribute-slider-container {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .tribute-slider-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            border-radius: 8px;
          }

          .tribute-slider-image.active {
            opacity: 1;
            z-index: 1;
          }

          .tribute-slider-pagination {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 4px;
            z-index: 10;
          }

          .tribute-pagination-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            opacity: 0.7;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: opacity 0.3s ease;
          }

          .tribute-pagination-dot:hover {
            opacity: 0.9;
          }

          .tribute-pagination-dot.active {
            opacity: 1;
            background: white;
          }

          .tribute-image-wrapper {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
            border-radius: 8px;
            background-color: #f0f0f0;
          }

          .tribute-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
