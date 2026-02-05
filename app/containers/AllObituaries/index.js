import React, { Component } from 'react';
import { Container, Row, Col, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './Allobituaries.css';

// Custom Image Slider Component
class ImageSlider extends Component {
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
    const { images, firstName, lastName } = this.props;
    const { currentIndex } = this.state;

    return (
      <div className="custom-slider">
        <div className="slider-container">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${firstName} ${lastName} ${idx + 1}`}
              className={`slider-image ${idx === currentIndex ? 'active' : ''}`}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="slider-pagination">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`pagination-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => this.goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }
}

class AllObituaries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obituaries: [],
      filteredObituaries: [],
      loading: true,
      error: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 20
    };
  }

  componentDidMount() {
    this.fetchAllObituaries();
  }

  fetchAllObituaries = async () => {
    try {
      this.setState({ loading: true, error: null });

      const response = await fetch('https://funeralbackend.onrender.com/api/obituaries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const obituariesArray = data.obituaries || data || [];

      this.setState({
        obituaries: obituariesArray,
        filteredObituaries: obituariesArray,
        loading: false,
        currentPage: 1
      });

    } catch (error) {
      console.error('Error fetching obituaries:', error);
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Date error';
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    this.setState({ searchQuery: query, currentPage: 1 });

    const filtered = this.state.obituaries.filter(obituary => {
      const firstName = (obituary.firstName || obituary.FIRST || '').toLowerCase();
      const lastName = (obituary.lastName || obituary.LAST || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const location = (obituary.location || '').toLowerCase();
      return fullName.includes(query) || location.includes(query);
    });

    this.setState({ filteredObituaries: filtered });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ Get and filter obituary images
  getObituaryImages = (obituary) => {
    let images = [];

    if (obituary.photos && Array.isArray(obituary.photos) && obituary.photos.length > 0) {
      images = obituary.photos.filter(photo => photo && typeof photo === 'string' && photo.trim() !== '');
    } else if (obituary.photo && typeof obituary.photo === 'string' && obituary.photo.trim() !== '') {
      images = [obituary.photo];
    } else if (obituary.IMAGE && typeof obituary.IMAGE === 'string' && obituary.IMAGE.trim() !== '') {
      images = [obituary.IMAGE];
    }

    return images.length > 0 ? images : ['https://via.placeholder.com/300x300?text=No+Image'];
  };

  render() {
    const { filteredObituaries, loading, error, searchQuery, currentPage, itemsPerPage } = this.state;

    const totalPages = Math.ceil(filteredObituaries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredObituaries.slice(indexOfFirstItem, indexOfLastItem);

    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
          endPage = maxPagesToShow;
        }

        if (currentPage >= totalPages - 2) {
          startPage = totalPages - maxPagesToShow + 1;
        }

        if (startPage > 1) {
          pages.push(1);
          if (startPage > 2) pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) pages.push('...');
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="all-obituaries-page">
        <div className="obituaries-header-banner">
          <Container>
            <h1 className="page-title">All Obituaries</h1>
            <p className="page-subtitle">Honoring the lives and memories of those we've lost</p>
          </Container>
        </div>

        <Container className="obituaries-content">
          <Row className="search-section mb-5">
            <Col lg={8} className="mx-auto">
              <div className="search-wrapper-large position-relative">
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  className="search-input-large rounded-pill"
                />
                <Search className="search-icon-large position-absolute" size={22} />
              </div>
            </Col>
          </Row>

          {loading && (
            <Row>
              <Col className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading obituaries...</p>
              </Col>
            </Row>
          )}

          {error && (
            <Row>
              <Col>
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Error Loading Obituaries</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={this.fetchAllObituaries}>Try Again</button>
                </div>
              </Col>
            </Row>
          )}

          {!loading && !error && filteredObituaries.length > 0 && (
            <>
              <Row className="mb-3">
                <Col>
                  <p className="results-count">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredObituaries.length)} of {filteredObituaries.length} {filteredObituaries.length === 1 ? 'obituary' : 'obituaries'}
                  </p>
                </Col>
              </Row>

              <Row className="obituaries-grid">
                {currentItems.map((obituary) => {
                  const images = this.getObituaryImages(obituary);
                  const hasMultipleImages = images.length > 1 && images[0] !== 'https://via.placeholder.com/300x300?text=No+Image';
                  
                  const firstName = obituary.firstName || obituary.FIRST || '';
                  const middleName = obituary.middleName || obituary.MIDDLE || '';
                  const lastName = obituary.lastName || obituary.LAST || '';

                  return (
                    <Col key={obituary._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <Link to={`/obituary/${obituary.slug || obituary._id}`} className="text-decoration-none">
                        <div className="obituary-card">
                          <div className="obituary-image-wrapper">
                            {hasMultipleImages ? (
                              <ImageSlider 
                                images={images} 
                                firstName={firstName} 
                                lastName={lastName} 
                              />
                            ) : (
                              <img
                                src={images[0]}
                                alt={`${firstName} ${lastName}`}
                                className="obituary-image"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                }}
                              />
                            )}
                            <div className="obituary-overlay">
                              <span className="view-obituary-text">View Obituary</span>
                            </div>
                          </div>
                          <div className="obituary-info">
                            <h3 className="obituary-name">
                              {firstName} {middleName ? middleName + ' ' : ''}{lastName}
                            </h3>
                            <p className="obituary-dates">
                              {obituary.birthDate && this.formatDate(obituary.birthDate || obituary.DOB)} - {this.formatDate(obituary.deathDate || obituary.DOD)}
                            </p>
                            {obituary.location && <p className="obituary-location">{obituary.location}</p>}
                          </div>
                        </div>
                      </Link>
                    </Col>
                  );
                })}
              </Row>

              {totalPages > 1 && (
                <Row className="mt-5">
                  <Col>
                    <div className="pagination-wrapper d-flex justify-content-center">
                      <Pagination size="lg">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink previous onClick={() => this.handlePageChange(currentPage - 1)}>
                            <ChevronLeft size={20} />
                          </PaginationLink>
                        </PaginationItem>

                        {getPageNumbers().map((page, index) => (
                          <PaginationItem key={index} active={page === currentPage} disabled={page === '...'}>
                            <PaginationLink onClick={() => { if (page !== '...') this.handlePageChange(page); }}>
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink next onClick={() => this.handlePageChange(currentPage + 1)}>
                            <ChevronRight size={20} />
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </div>

                    <div className="text-center mt-3">
                      <p className="page-info-text">Page {currentPage} of {totalPages}</p>
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}

          {!loading && !error && filteredObituaries.length === 0 && this.state.obituaries.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <h3>No Obituaries Available</h3>
                <p className="text-muted">No obituaries have been added yet.</p>
              </Col>
            </Row>
          )}

          {!loading && !error && filteredObituaries.length === 0 && this.state.obituaries.length > 0 && (
            <Row>
              <Col className="text-center py-5">
                <h3>No obituaries found matching "{searchQuery}"</h3>
                <p className="text-muted">Try adjusting your search terms.</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    this.setState({
                      searchQuery: '',
                      filteredObituaries: this.state.obituaries,
                      currentPage: 1
                    });
                  }}
                >
                  Clear Search
                </button>
              </Col>
            </Row>
          )}
        </Container>

        <style>{`
          /* Custom Slider Styles */
          .custom-slider {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #f0f0f0;
          }

          .slider-container {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 300px;
          }

          .slider-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            display: block;
          }

          .slider-image.active {
            opacity: 1;
            z-index: 1;
          }

          .slider-pagination {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 6px;
            z-index: 10;
          }

          .pagination-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            opacity: 0.7;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: opacity 0.3s ease;
          }

          .pagination-dot:hover {
            opacity: 0.9;
          }

          .pagination-dot.active {
            opacity: 1;
            background: white;
          }

          /* Image Wrapper */
          .obituary-image-wrapper {
            position: relative;
            width: 100%;
            height: 300px;
            overflow: hidden;
            border-radius: 8px 8px 0 0;
            background-color: #f0f0f0;
          }

          .obituary-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .obituary-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .obituary-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          }

          .obituary-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 5;
          }

          .obituary-card:hover .obituary-overlay {
            opacity: 1;
          }

          .view-obituary-text {
            color: white;
            font-weight: 600;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  }
}

export default AllObituaries;