import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Spinner, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { API_URL } from '../../constants';
import './SendFlowers.css';

class SendFlowers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      filteredServices: [],
      loading: true,
      error: null,
      searchQuery: '',
      currentPage: 1,
      servicesPerPage: 10
    };
    this._isMounted = false;
    this.abortController = null;
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetchCurrentServices();
  }

  componentWillUnmount() {
    this._isMounted = false;
    // Cancel any ongoing fetch requests
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchCurrentServices = async () => {
    // Cancel any previous request
    if (this.abortController) {
      this.abortController.abort();
    }
    
    // Create new abort controller for this request
    this.abortController = new AbortController();
    
    try {
      if (this._isMounted) {
        this.setState({ loading: true, error: null });
      }
      
      // Use your actual API endpoint - adjust the URL as needed
      const response = await fetch(`${API_URL}/obituaries`, {
        signal: this.abortController.signal
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if API endpoint exists.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both {obituaries: [...]} and direct array responses
      const obituaries = data.obituaries || data;
      
      // Transform the data to match our component's needs
      const services = this.transformObituariesToServices(obituaries);
      
      // Only update state if component is still mounted
      if (this._isMounted) {
        this.setState({
          services: services,
          filteredServices: services,
          loading: false
        });
      }
    } catch (error) {
      // Ignore abort errors (happens when component unmounts)
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Error fetching services:', error);
      
      // Only update state if component is still mounted
      if (this._isMounted) {
        this.setState({
          error: error.message,
          loading: false
        });
      }
    }
  };

  // Transform your obituary data structure to service format
  transformObituariesToServices = (obituaries) => {
    return obituaries.map(obit => {
      // Format the service date if it exists
      let formattedDate = null;
      if (obit.serviceDate) {
        const date = new Date(obit.serviceDate);
        formattedDate = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric',
          year: 'numeric'
        });
      }

      // Get the primary photo or first photo
      const image = obit.primaryPhoto || obit.photo || obit.photos?.[0] || 'https://via.placeholder.com/200x200?text=No+Image';

      return {
        id: obit._id,
        name: `${obit.firstName} ${obit.middleName || ''} ${obit.lastName}`.trim(),
        slug: `${obit.firstName}-${obit.lastName}`.toLowerCase().replace(/\s+/g, '-'),
        image: image,
        serviceType: obit.serviceType || null,
        serviceDate: formattedDate,
        serviceTime: null, // Your data doesn't have separate time field
        location: obit.location || obit.serviceLocation || 'Location not specified',
        serviceAvailable: obit.serviceType ? true : false,
        originalData: obit // Keep original data for reference
      };
    });
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ searchQuery: query }, this.filterServices);
  };

  filterServices = () => {
    const { services, searchQuery } = this.state;
    
    if (!searchQuery.trim()) {
      this.setState({ filteredServices: services, currentPage: 1 });
      return;
    }

    const filtered = services.filter(service => {
      const name = service.name?.toLowerCase() || '';
      const location = service.location?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      return name.includes(query) || location.includes(query);
    });

    this.setState({ filteredServices: filtered, currentPage: 1 });
  };

  handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.filterServices();
    }
  };

  handleSendFlowers = (service) => {
    // Redirect to shop page with obituaryId and flower filter
    const obituaryId = service.id || service.originalData?._id;
    
    if (!obituaryId) {
      alert('Error: Unable to process request. Please try again.');
      return;
    }

    // Navigate to shop with flower filter (same pattern as plant tree)
    window.location.href = `/shop?obituaryId=${obituaryId}&filter=tree`;
  };

  renderServiceCard = (service) => {
    const hasImage = service.image && service.image !== 'https://via.placeholder.com/200x200?text=No+Image';
    const imageUrl = hasImage ? service.image : 'https://via.placeholder.com/200x200?text=No+Image';
    const serviceAvailable = service.serviceAvailable !== false;

    return (
      <div key={service.id} className="service-card">
        <Row className="align-items-center g-0">
          <Col xs={4} sm={3} md={2} lg={1}>
            <div className="service-image-wrapper">
              <img
                src={imageUrl}
                alt={service.name}
                className="service-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                }}
              />
            </div>
          </Col>
          
          <Col xs={8} sm={6} md={7} lg={8}>
            <div className="service-details">
              <h3 className="service-name">{service.name}</h3>
              
              {service.serviceType && (
                <p className="service-type">{service.serviceType}</p>
              )}
              
              {service.serviceDate && (
                <p className="service-date">{service.serviceDate}</p>
              )}
              
              {service.serviceTime && (
                <p className="service-time">{service.serviceTime}</p>
              )}
              
              {!serviceAvailable && (
                <p className="service-unavailable">A service summary is not available</p>
              )}
            </div>
          </Col>
          
          <Col xs={12} sm={3} md={3} lg={3} className="d-flex justify-content-end align-items-center">
            <div className="service-actions">
              {service.location && (
                <span className="service-location">{service.location}</span>
              )}
              
              <Button
                color="primary"
                className="send-flowers-btn"
                onClick={() => this.handleSendFlowers(service)}
              >
                Send Flowers
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  renderPagination = () => {
    const { filteredServices, currentPage, servicesPerPage } = this.state;
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    if (totalPages <= 1) return null;

    return (
      <div className="pagination-wrapper">
        <Button
          color="link"
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => this.setState({ currentPage: currentPage - 1 })}
        >
          « Previous
        </Button>
        
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          color="link"
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => this.setState({ currentPage: currentPage + 1 })}
        >
          Next »
        </Button>
      </div>
    );
  };

  render() {
    const { loading, error, filteredServices, searchQuery, currentPage, servicesPerPage } = this.state;

    // Pagination calculation
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    return (
      <div className="send-flowers-page">
        {/* Hero Section */}
        <div className="hero-section">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <h1 className="hero-title">Send Flowers</h1>
                <p className="hero-subtitle">
                  Place your order with our local florist
                </p>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Instructions Section */}
        <Container className="instructions-section">
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="instructions-box">
                <p className="instructions-intro">
                  Allow us to take care of your expression of sympathy by connecting with our local 
                  friends through our website.
                </p>
                
                <ul className="instructions-list">
                  <li>Your florist is local and licensed</li>
                  <li>We send to color our friend's funeral address, per the services details - our order system already knows this</li>
                  <li>Text picks out the flowers, add your message and pay online. Your order is immediately sent to your local florist shop</li>
                  <li>We obtain a copy of your order so we know that your flowers are on their way</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Search and Services Section */}
        <Container className="services-section">
          <Row className="mb-4">
            <Col lg={12}>
              <h2 className="section-title">Current Services:</h2>
              <p className="section-subtitle">
                Refer to the listings below or optionally use the search box
              </p>
            </Col>
          </Row>

          {/* Search Box */}
          <Row className="mb-4">
            <Col lg={6}>
              <div className="search-wrapper position-relative">
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  onKeyPress={this.handleSearchKeyPress}
                  className="search-input"
                />
                <Search 
                  className="search-icon position-absolute" 
                  size={20}
                  onClick={this.filterServices}
                />
              </div>
            </Col>
          </Row>

          {/* Loading State */}
          {loading && (
            <Row>
              <Col className="text-center py-5">
                <Spinner color="primary" />
                <p className="mt-3">Loading services...</p>
              </Col>
            </Row>
          )}

          {/* Error State */}
          {error && (
            <Row>
              <Col>
                <Alert color="danger">
                  <h4 className="alert-heading">Error</h4>
                  <p>{error}</p>
                  <Button color="primary" onClick={this.fetchCurrentServices}>
                    Try Again
                  </Button>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Services List */}
          {!loading && !error && currentServices.length > 0 && (
            <>
              <Row>
                <Col>
                  <div className="services-list">
                    {currentServices.map(service => this.renderServiceCard(service))}
                  </div>
                </Col>
              </Row>

              {/* Pagination */}
              <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                  {this.renderPagination()}
                </Col>
              </Row>
            </>
          )}

          {/* No Results */}
          {!loading && !error && filteredServices.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <h3>No services found</h3>
                <p className="text-muted">
                  {searchQuery 
                    ? 'Try adjusting your search or check back later.'
                    : 'There are currently no services available.'}
                </p>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default SendFlowers;