import React, { Component } from 'react';
import { Container, Row, Col, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './Allobituaries.css';

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
      
      // The API returns { "obituaries": [...] }
      const obituariesArray = data.obituaries || data || [];

      this.setState({
        obituaries: obituariesArray,
        filteredObituaries: obituariesArray,
        loading: false,
        currentPage: 1 // Reset to first page when data loads
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
    this.setState({ searchQuery: query, currentPage: 1 }); // Reset to page 1 when searching

    const filtered = this.state.obituaries.filter(obituary => {
      const firstName = (obituary.firstName || '').toLowerCase();
      const lastName = (obituary.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const location = (obituary.location || '').toLowerCase();
      
      return fullName.includes(query) || location.includes(query);
    });

    this.setState({ filteredObituaries: filtered });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    const { filteredObituaries, loading, error, searchQuery, currentPage, itemsPerPage } = this.state;

    // Calculate pagination
    const totalPages = Math.ceil(filteredObituaries.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredObituaries.slice(indexOfFirstItem, indexOfLastItem);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        // Show all pages if total pages are less than max
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 pages before and after
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Adjust if we're near the start
        if (currentPage <= 3) {
          endPage = maxPagesToShow;
        }

        // Adjust if we're near the end
        if (currentPage >= totalPages - 2) {
          startPage = totalPages - maxPagesToShow + 1;
        }

        // Add first page and ellipsis
        if (startPage > 1) {
          pages.push(1);
          if (startPage > 2) {
            pages.push('...');
          }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        // Add last page and ellipsis
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pages.push('...');
          }
          pages.push(totalPages);
        }
      }

      return pages;
    };

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
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredObituaries.length)} of {filteredObituaries.length} {filteredObituaries.length === 1 ? 'obituary' : 'obituaries'}
                  </p>
                </Col>
              </Row>

              <Row className="obituaries-grid">
                {currentItems.map((obituary) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Row className="mt-5">
                  <Col>
                    <div className="pagination-wrapper d-flex justify-content-center">
                      <Pagination size="lg">
                        {/* Previous Button */}
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() => this.handlePageChange(currentPage - 1)}
                          >
                            <ChevronLeft size={20} />
                          </PaginationLink>
                        </PaginationItem>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                          <PaginationItem
                            key={index}
                            active={page === currentPage}
                            disabled={page === '...'}
                          >
                            <PaginationLink
                              onClick={() => {
                                if (page !== '...') {
                                  this.handlePageChange(page);
                                }
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {/* Next Button */}
                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink
                            next
                            onClick={() => this.handlePageChange(currentPage + 1)}
                          >
                            <ChevronRight size={20} />
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </div>
                    
                    {/* Page Info */}
                    <div className="text-center mt-3">
                      <p className="page-info-text">
                        Page {currentPage} of {totalPages}
                      </p>
                    </div>
                  </Col>
                </Row>
              )}
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
      </div>
    );
  }
}

export default AllObituaries;