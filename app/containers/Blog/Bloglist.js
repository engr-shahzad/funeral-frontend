import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { API_URL } from '../../constants';
import './Bloglist.css';

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      categories: [],
      loading: true,
      selectedCategory: 'All',
      searchQuery: ''
    };
  }

  componentDidMount() {
    this.fetchBlogs();
    this.fetchCategories();
  }

  fetchBlogs = async () => {
    try {
      this.setState({ loading: true });
      const response = await fetch(`${API_URL}/blogs?published=true`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ blogs: data, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      this.setState({ loading: false });
    }
  };

  fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/categories`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ categories: data });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  handleCategoryChange = (category) => {
    this.setState({ selectedCategory: category });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  getFilteredBlogs = () => {
    const { blogs, selectedCategory, searchQuery } = this.state;

    return blogs.filter(blog => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (blog.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  navigateToBlog = (blog) => {
    this.props.history.push(`/blog/${blog.slug || blog._id}`);
  }

  formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  render() {
    const { selectedCategory, searchQuery, categories, loading } = this.state;
    const filteredBlogs = this.getFilteredBlogs();
    const allCategories = ['All', ...categories];

    return (
      <div className="blog-list-container">
        <Helmet>
          <title>Blog - West River Funeral Directors</title>
          <meta name="description" content="Read our latest articles on funeral planning, grief support, memorial services, and more." />
          <meta name="keywords" content="funeral blog, grief support, memorial planning, funeral services" />
        </Helmet>

        <header className="blog-header">
          <div className="header-content">
            <h1 className="site-title">Our Blog</h1>
            <p className="site-subtitle">Insights, Guidance & Resources</p>
          </div>
        </header>

        <div className="blog-content">
          <aside className="sidebar">
            <div className="search-section">
              <h3 className="sidebar-title">Search</h3>
              <input
                type="text"
                className="search-input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
            </div>

            <div className="categories-section">
              <h3 className="sidebar-title">Categories</h3>
              <ul className="categories-list">
                {allCategories.map(category => (
                  <li
                    key={category}
                    className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => this.handleCategoryChange(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-section">
              <h3 className="sidebar-title">About</h3>
              <p className="about-text">
                Welcome to our blog where we share guidance, resources,
                and support for families during difficult times.
              </p>
            </div>
          </aside>

          <main className="main-content">
            <div className="results-header">
              <h2 className="results-title">
                {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
              </h2>
              <span className="results-count">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner-border text-primary" role="status" />
                <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading articles...</p>
              </div>
            )}

            {!loading && (
              <div className="blog-grid">
                {filteredBlogs.map(blog => (
                  <article key={blog._id} className="blog-card">
                    <div className="blog-image-wrapper">
                      <img src={blog.image || 'https://via.placeholder.com/800x400?text=Blog'} alt={blog.title} className="blog-image"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Blog'; }} />
                      {blog.category && <span className="blog-category-badge">{blog.category}</span>}
                    </div>

                    <div className="blog-card-content">
                      <h3 className="blog-title">{blog.title}</h3>
                      <p className="blog-excerpt">{blog.excerpt}</p>

                      <div className="blog-meta">
                        <div className="blog-author-info">
                          {blog.author && <span className="author-name">{blog.author}</span>}
                          <span className="blog-date">{this.formatDate(blog.createdAt)}</span>
                        </div>
                        {blog.readTime && <span className="read-time">{blog.readTime}</span>}
                      </div>

                      <button
                        className="read-more-btn"
                        onClick={() => this.navigateToBlog(blog)}
                      >
                        Read Article
                        <span className="arrow">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading && filteredBlogs.length === 0 && (
              <div className="no-results">
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </main>
        </div>

        <footer className="blog-footer">
          <p>&copy; {new Date().getFullYear()} West River Funeral Directors. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default withRouter(BlogList);
