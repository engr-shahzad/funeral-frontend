import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Bloglist.css';

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [
        {
          id: 1,
          title: 'Understanding React Class Components',
          excerpt: 'A comprehensive guide to mastering React class components, lifecycle methods, and state management in modern web applications.',
          author: 'Sarah Johnson',
          date: 'January 15, 2025',
          category: 'React',
          readTime: '8 min read',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
        },
        {
          id: 2,
          title: 'Advanced CSS Techniques for Enterprise Applications',
          excerpt: 'Explore modern CSS methodologies, design patterns, and best practices for building scalable enterprise-level applications.',
          author: 'Michael Chen',
          date: 'January 12, 2025',
          category: 'CSS',
          readTime: '12 min read',
          image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop'
        },
        {
          id: 3,
          title: 'State Management Patterns in React',
          excerpt: 'Deep dive into various state management solutions, comparing Redux, Context API, and MobX for enterprise applications.',
          author: 'Emily Rodriguez',
          date: 'January 10, 2025',
          category: 'React',
          readTime: '10 min read',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
        },
        {
          id: 4,
          title: 'Building Scalable Component Architecture',
          excerpt: 'Learn how to structure your React components for maximum reusability, maintainability, and performance optimization.',
          author: 'David Kim',
          date: 'January 8, 2025',
          category: 'Architecture',
          readTime: '15 min read',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
        },
        {
          id: 5,
          title: 'Performance Optimization in React Applications',
          excerpt: 'Comprehensive strategies for optimizing React application performance, including code splitting and lazy loading techniques.',
          author: 'Lisa Anderson',
          date: 'January 5, 2025',
          category: 'Performance',
          readTime: '11 min read',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
        },
        {
          id: 6,
          title: 'Testing Strategies for React Components',
          excerpt: 'Master unit testing, integration testing, and end-to-end testing for React applications using modern testing frameworks.',
          author: 'James Wilson',
          date: 'January 3, 2025',
          category: 'Testing',
          readTime: '9 min read',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'
        }
      ],
      selectedCategory: 'All',
      searchQuery: ''
    };
  }

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
                           blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  navigateToBlog = (blogId) => {
    // Using React Router to navigate
    this.props.history.push(`/blog/${blogId}`);
  }

  render() {
    const { selectedCategory, searchQuery } = this.state;
    const filteredBlogs = this.getFilteredBlogs();
    const categories = ['All', 'React', 'CSS', 'Architecture', 'Performance', 'Testing'];

    return (
      <div className="blog-list-container">
        <header className="blog-header">
          <div className="header-content">
            <h1 className="site-title">Enterprise Blog</h1>
            <p className="site-subtitle">Insights, Knowledge & Best Practices</p>
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
                {categories.map(category => (
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
                Welcome to our enterprise blog where we share cutting-edge insights, 
                best practices, and in-depth technical knowledge.
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

            <div className="blog-grid">
              {filteredBlogs.map(blog => (
                <article key={blog.id} className="blog-card">
                  <div className="blog-image-wrapper">
                    <img src={blog.image} alt={blog.title} className="blog-image" />
                    <span className="blog-category-badge">{blog.category}</span>
                  </div>
                  
                  <div className="blog-card-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-meta">
                      <div className="blog-author-info">
                        <span className="author-name">{blog.author}</span>
                        <span className="blog-date">{blog.date}</span>
                      </div>
                      <span className="read-time">{blog.readTime}</span>
                    </div>
                    
                    <button 
                      className="read-more-btn"
                      onClick={() => this.navigateToBlog(blog.id)}
                    >
                      Read Article
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="no-results">
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </main>
        </div>

        <footer className="blog-footer">
          <p>&copy; 2025 Enterprise Blog. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default withRouter(BlogList);