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
    this.state = { currentIndex: 0 };
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
      <div className="tribute-image-slider">
        <div className="tribute-slides-wrapper" style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${name} - photo ${idx + 1}`}
              className="tribute-slide-img"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          ))}
        </div>
        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="tribute-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`tribute-dot${idx === currentIndex ? ' active' : ''}`}
                onClick={() => this.goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
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
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tributes');
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
      this.setState({ tributes: formattedTributes, loading: false });
    } catch (error) {
      console.error('Error fetching tributes:', error);
      this.setState({ error: error.message, loading: false });
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
        headers: { 'Content-Type': 'application/json' }
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
      this.setState({ tributes: formattedTributes, loading: false, currentIndex: 0 });
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
        primary: 'welcome-cta-btn',
        secondary: 'tributes-action-btn',
        outline: 'hero-cta-button',
        ghost: 'hero-cta-button'
      }[sec.ctaStyle] || 'welcome-cta-btn';

      if (sec.layout === 'imageBg') {
        return (
          <div key={i} className="custom-section custom-section--imagebg" style={{ ...outerStyle, padding, position: 'relative', overflow: 'hidden', textAlign }}>
            {sec.backgroundImage && (
              <div className="custom-section-bg" style={{ backgroundImage: `url(${sec.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', inset: 0, zIndex: 0 }} />
            )}
            <div className="custom-section-overlay" style={{ position: 'absolute', inset: 0, background: sec.overlayColor || 'rgba(0,0,0,0.45)', zIndex: 1 }} />
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              {sec.label && <div className="custom-section-label" style={{ color: sec.labelColor || '#ccc' }}>{sec.label}</div>}
              {sec.heading && <HeadingTag className="custom-section-heading" style={{ color: sec.headingColor || '#fff' }}>{sec.heading}</HeadingTag>}
              {sec.text && <div className="custom-section-text" style={{ color: sec.textColor || '#eee' }} dangerouslySetInnerHTML={{ __html: sec.text }} />}
              {sec.ctaText && sec.ctaLink && (
                <Link to={sec.ctaLink} className={ctaBtnStyle}>{sec.ctaText}</Link>
              )}
            </div>
          </div>
        );
      }

      if (sec.layout === 'imageLeft' || sec.layout === 'imageRight') {
        const imgCol = (
          <Col md={6} className="custom-section-img-col">
            {sec.image && <div className="custom-section-img" style={{ backgroundImage: `url(${sec.image})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }} />}
          </Col>
        );
        const textCol = (
          <Col md={6} className="custom-section-text-col" style={{ textAlign }}>
            {sec.label && <div className="custom-section-label" style={{ color: sec.labelColor || '#888' }}>{sec.label}</div>}
            {sec.heading && <HeadingTag className="custom-section-heading" style={{ color: sec.headingColor || '#222' }}>{sec.heading}</HeadingTag>}
            {sec.text && <div className="custom-section-text" style={{ color: sec.textColor || '#555' }} dangerouslySetInnerHTML={{ __html: sec.text }} />}
            {sec.ctaText && sec.ctaLink && (
              <Link to={sec.ctaLink} className={ctaBtnStyle}>{sec.ctaText}</Link>
            )}
          </Col>
        );
        return (
          <div key={i} className="custom-section custom-section--image-side" style={{ ...outerStyle, padding, background: sec.backgroundColor || 'transparent' }}>
            <Container>
              <Row className="align-items-center">
                {sec.layout === 'imageLeft' ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
              </Row>
            </Container>
          </div>
        );
      }

      // textOnly
      return (
        <div key={i} className="custom-section custom-section--text" style={{ ...outerStyle, padding, background: sec.backgroundColor || 'transparent', textAlign }}>
          <Container>
            {sec.label && <div className="custom-section-label" style={{ color: sec.labelColor || '#888' }}>{sec.label}</div>}
            {sec.heading && <HeadingTag className="custom-section-heading" style={{ color: sec.headingColor || '#222' }}>{sec.heading}</HeadingTag>}
            {sec.text && <div className="custom-section-text" style={{ color: sec.textColor || '#555' }} dangerouslySetInnerHTML={{ __html: sec.text }} />}
            {sec.ctaText && sec.ctaLink && (
              <Link to={sec.ctaLink} className={ctaBtnStyle}>{sec.ctaText}</Link>
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

    const defaultSlides = [
      { image: 'https://s3.amazonaws.com/CFSV2/obituaries/galleries/12123/1663011/68b14f5742047.png', title: 'Celebrate Life', ctaText: 'OUR SERVICES', ctaLink: '/our-services' },
      { image: '/images/banners/banner2.jpeg?w=1600', title: 'Celebrate Life', ctaText: 'OUR SERVICES', ctaLink: '/our-services' }
    ];
    const slides = (settings?.heroBanner?.slides?.length > 0 && settings.heroBanner.slides[0].image)
      ? settings.heroBanner.slides
      : defaultSlides;

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
          {seo.twitterCard && <meta name="twitter:card" content={seo.twitterCard} />}
          {(seo.twitterTitle || seo.metaTitle) && <meta name="twitter:title" content={seo.twitterTitle || seo.metaTitle} />}
          {(seo.twitterDescription || seo.metaDescription) && <meta name="twitter:description" content={seo.twitterDescription || seo.metaDescription} />}
          {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
        </Helmet>

        {/* Hero Banner Section */}
        <div className="hero-banner-swiper">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={slides.length > 1}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="hero-slide"
                  style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="hero-slide-overlay">
                    <div className="hero-slide-content">
                      <h1 className="hero-slide-title">{slide.title || 'Celebrate Life'}</h1>
                      <Link to={slide.ctaLink || '/our-services'} className="hero-cta-button">
                        {slide.ctaText || 'OUR SERVICES'}
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
        <div className="tributes-section">
          <div className="tributes-header">
            <h2 className="tributes-title">Recent Tributes</h2>
            <div className="tributes-search">
              <Input
                type="text"
                placeholder="Search tributes..."
                value={searchQuery}
                onChange={this.handleSearchChange}
                onKeyPress={this.handleSearchKeyPress}
                className="tribute-search-input"
              />
              <Button className="tribute-search-btn" onClick={this.handleSearch}>
                <Search size={18} />
              </Button>
            </div>
          </div>

          {loading && (
            <div className="tributes-loading">
              <div className="loading-spinner" />
              <p>Loading tributes...</p>
            </div>
          )}

          {error && (
            <div className="tributes-error">
              <h3>Error</h3>
              <p>{error}</p>
              <Button onClick={this.fetchRecentTributes}>Try Again</Button>
            </div>
          )}

          {!loading && !error && tributes.length > 0 && (
            <div className="tributes-content">
              <button
                className="tributes-nav-btn prev"
                onClick={this.handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="tributes-grid">
                {visibleTributes.map((tribute) => (
                  <Link to={`/obituaries/${tribute.slug}`} key={tribute.id} className="tribute-card">
                    <div className="tribute-img-wrapper">
                      {tribute.images.length > 1 ? (
                        <TributeImageSlider images={tribute.images} name={tribute.name} />
                      ) : (
                        <img
                          src={tribute.image}
                          alt={tribute.name}
                          className="tribute-img"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                          }}
                        />
                      )}
                    </div>
                    <div className="tribute-info">
                      <h3 className="tribute-name">{tribute.name}</h3>
                      <p className="tribute-date">{tribute.date}</p>
                      <p className="tribute-location">{tribute.location}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                className="tributes-nav-btn next"
                onClick={this.handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight size={24} />
              </button>

              <div className="tributes-actions">
                <Link to="/obituaries" className="tributes-action-btn">VIEW ALL TRIBUTES</Link>
                <Link to="/obituary-alerts" className="tributes-action-btn">JOIN OBITUARY ALERTS</Link>
              </div>
            </div>
          )}

          {!loading && !error && tributes.length === 0 && (
            <div className="tributes-empty">
              <h3>No tributes found</h3>
              <p>Try adjusting your search or check back later.</p>
            </div>
          )}
        </div>

        {this.renderCustomSections('afterTributes')}

        {/* Welcome Section Alternate - Our Service */}
        <div className="welcome-section-alt">
          <Container>
            <Row>
              <Col md={12}>
                <h2>Our Service</h2>
                <h3>Funeral &amp; Cremation Services in Rapid City</h3>
                <p>
                  West River Funeral Directors offers complete funeral home services for families in Rapid City, SD.
                  Each service is planned with care, clarity, and respect for personal, cultural, and religious preferences.
                </p>
                <p>
                  Our services include traditional funerals, memorial services, graveside services, and cremation options.
                  Families receive guidance through every step, from initial arrangements to final remembrance, without pressure or confusion.
                </p>
                <Link to="/our-services" className="welcome-cta-btn">
                  {settings?.welcomeSection?.ctaText || 'LEARN MORE'}
                </Link>
              </Col>
            </Row>
          </Container>
        </div>

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
              <Row className="no-gutters">
                {services.slice(0, 2).map((svc, i) => (
                  <Col md={6} key={i}>
                    <Link to={svc.link} className="service-grid-item" style={{ backgroundImage: `url(${svc.image})` }}>
                      <div className="service-grid-overlay">
                        <h3>{svc.title}</h3>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
              <Row className="no-gutters">
                {services.slice(2, 4).map((svc, i) => (
                  <Col md={6} key={i}>
                    <Link to={svc.link} className="service-grid-item" style={{ backgroundImage: `url(${svc.image})` }}>
                      <div className="service-grid-overlay">
                        <h3>{svc.title}</h3>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })()}

        {this.renderCustomSections('afterServicesGrid')}

        {/* Testimonials Section */}
        {(settings?.testimonials?.enabled !== false) && (
          <div className="testimonials-section">
            <Container>
              <h2>{settings?.testimonials?.title || 'What Our Families are Saying...'}</h2>
              <p className="testimonials-subtitle">{settings?.testimonials?.subtitle || 'TESTIMONIALS'}</p>
              <p className="testimonials-text">{settings?.testimonials?.text || '"We are always impressed in hearing from the families that we serve. Please take a moment to let us know how we are doing by sharing your experience via our testimonials link. We very much appreciate your feedback."'}</p>
              <Link to="/testimonials" className="welcome-cta-btn">
                {settings?.testimonials?.ctaText || 'Click to enter your testimonial »'}
              </Link>
            </Container>
          </div>
        )}

        {this.renderCustomSections('afterTestimonials')}

        {/* Google Reviews Section */}
        {(settings?.googleReviews?.enabled !== false) && (
          <div className="google-reviews-section">
            <Container>
              <h2>{settings?.googleReviews?.title || 'See Our Google Reviews'}</h2>
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
              <Container>
                <Row>
                  <Col md={6}>
                    <h2>{loc.title || 'Our Location'}</h2>
                    <p><MapPin size={16} /> {businessName}</p>
                    <p>{address}</p>
                    <p>{cityStateZip}</p>
                    <p><Phone size={16} /> Tel: {phone}</p>
                    <p>Fax: {fax}</p>
                  </Col>
                  <Col md={6}>
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Location Map"
                    />
                  </Col>
                </Row>
              </Container>
            </div>
          );
        })()}

        {this.renderCustomSections('afterLocation')}

        {/* View Services CTA */}
        <div className="view-services-cta">
          <Link to="/our-services" className="view-services-btn">VIEW SERVICES</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, actions)(Homepage);
