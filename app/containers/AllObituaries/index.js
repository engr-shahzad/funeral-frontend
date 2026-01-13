import React, { Component } from 'react';
import { Container, Row, Col, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './AllObituaries.css';

class AllObituaries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      obituaries: [],
      filteredObituaries: [],
      loading: true,
      error: null,
      searchQuery: ''
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
      
      // The API returns { "obituaries": [...] }
      // Extract the obituaries array from the response
      const obituariesArray = data.obituaries || data || [];

      this.setState({
        obituaries: obituariesArray,
        filteredObituaries: obituariesArray,
        loading: false
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
      
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Date error';
    }
  };

  handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    this.setState({ searchQuery: query });

    const filtered = this.state.obituaries.filter(obituary => {
      const firstName = (obituary.firstName || '').toLowerCase();
      const lastName = (obituary.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const location = (obituary.location || '').toLowerCase();
      
      return fullName.includes(query) || location.includes(query);
    });

    this.setState({ filteredObituaries: filtered });
  };

  render() {
    const { filteredObituaries, loading, error, searchQuery } = this.state;

    return (
      <div className="all-obituaries-page">
        {/* Header Section */}
        <div className="obituaries-header-banner">
          <Container>
            <h1 className="page-title">All Obituaries</h1>
            <p className="page-subtitle">Honoring the lives and memories of those we've lost</p>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="obituaries-content">
          {/* Search Bar */}
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

          {/* Loading State */}
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

          {/* Error State */}
          {error && (
            <Row>
              <Col>
                <div className="alert alert-danger" role="alert">
                  <h4 className="alert-heading">Error Loading Obituaries</h4>
                  <p>{error}</p>
                  <button className="btn btn-primary" onClick={this.fetchAllObituaries}>
                    Try Again
                  </button>
                </div>
              </Col>
            </Row>
          )}

          {/* Obituaries Grid */}
          {!loading && !error && filteredObituaries.length > 0 && (
            <>
              <Row className="mb-3">
                <Col>
                  <p className="results-count">
                    Showing {filteredObituaries.length} {filteredObituaries.length === 1 ? 'obituary' : 'obituaries'}
                  </p>
                </Col>
              </Row>

              <Row className="obituaries-grid">
                {filteredObituaries.map((obituary) => (
                  <Col
                    key={obituary._id}
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    className="mb-4"
                  >
                    <Link
                      to={`/obituary/${obituary.slug || obituary._id}`}
                      className="text-decoration-none"
                    >
                      <div className="obituary-card">
                        <div className="obituary-image-wrapper">
                          <img
                            src={obituary.photo}
                            alt={`${obituary.firstName} ${obituary.lastName}`}
                            className="obituary-image"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                            }}
                          />
                          <div className="obituary-overlay">
                            <span className="view-obituary-text">View Obituary</span>
                          </div>
                        </div>
                        <div className="obituary-info">
                          <h3 className="obituary-name">
                            {obituary.firstName} {obituary.middleName ? obituary.middleName + ' ' : ''}{obituary.lastName}
                          </h3>
                          <p className="obituary-dates">
                            {obituary.birthDate && this.formatDate(obituary.birthDate)} - {this.formatDate(obituary.deathDate)}
                          </p>
                          {obituary.location && (
                            <p className="obituary-location">{obituary.location}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* No Results State */}
          {!loading && !error && filteredObituaries.length === 0 && this.state.obituaries.length === 0 && (
            <Row>
              <Col className="text-center py-5">
                <h3>No Obituaries Available</h3>
                <p className="text-muted">
                  No obituaries have been added yet.
                </p>
              </Col>
            </Row>
          )}

          {/* No Search Results */}
          {!loading && !error && filteredObituaries.length === 0 && this.state.obituaries.length > 0 && (
            <Row>
              <Col className="text-center py-5">
                <h3>No obituaries found matching "{searchQuery}"</h3>
                <p className="text-muted">
                  Try adjusting your search terms.
                </p>
                <button 
                  className="btn btn-primary mt-3" 
                  onClick={() => {
                    this.setState({ 
                      searchQuery: '', 
                      filteredObituaries: this.state.obituaries 
                    });
                  }}
                >
                  Clear Search
                </button>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default AllObituaries;