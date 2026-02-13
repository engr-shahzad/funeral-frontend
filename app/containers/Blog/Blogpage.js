import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { API_URL } from '../../constants';
import './Blogpage.css';

class BlogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: null,
      loading: true,
      error: null,
      showTableOfContents: true
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchBlog();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      window.scrollTo(0, 0);
      this.fetchBlog();
    }
  }

  fetchBlog = async () => {
    try {
      this.setState({ loading: true, error: null });
      const { id } = this.props.match.params;
      const response = await fetch(`${API_URL}/blogs/${id}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ blog: data, loading: false });
      } else {
        this.setState({ error: 'Blog post not found', loading: false });
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      this.setState({ error: 'Failed to load blog post', loading: false });
    }
  };

  navigateToHome = () => {
    this.props.history.push('/blogs');
  }

  navigateToBlog = (blogId) => {
    this.props.history.push(`/blog/${blogId}`);
  }

  toggleTableOfContents = () => {
    this.setState(prevState => ({
      showTableOfContents: !prevState.showTableOfContents
    }));
  }

  scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  renderContent = (item, index) => {
    switch (item.type) {
      case 'paragraph':
        return (
          <p key={index} className="content-paragraph">
            {item.text}
          </p>
        );

      case 'heading':
        return (
          <h2 key={index} id={`section-${index}`} className="content-heading">
            {item.text}
          </h2>
        );

      case 'code':
        return (
          <div key={index} className="code-block">
            <div className="code-header">
              <span className="code-language">{item.language}</span>
            </div>
            <pre><code>{item.text}</code></pre>
          </div>
        );

      case 'list':
        return (
          <ul key={index} className="content-list">
            {(item.items || []).map((listItem, i) => (
              <li key={i}>{listItem}</li>
            ))}
          </ul>
        );

      case 'image':
        return (
          <div key={index} className="content-image">
            <img src={item.url} alt={item.alt || ''} style={{ maxWidth: '100%', borderRadius: '8px' }} />
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const { blog, loading, error, showTableOfContents } = this.state;

    if (loading) {
      return (
        <div className="blog-page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div className="spinner-border text-primary" role="status" />
          <p style={{ marginTop: '12px', color: '#6b7280' }}>Loading article...</p>
        </div>
      );
    }

    if (error || !blog) {
      return (
        <div className="blog-page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2>{error || 'Blog post not found'}</h2>
          <button onClick={this.navigateToHome} style={{ marginTop: '16px', padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
            Back to Blog
          </button>
        </div>
      );
    }

    const headings = (blog.content || []).filter(item => item.type === 'heading');
    const seo = blog.seo || {};

    return (
      <div className="blog-page-container">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{seo.metaTitle || blog.title}</title>
          {(seo.metaDescription || blog.excerpt) && <meta name="description" content={seo.metaDescription || blog.excerpt} />}
          {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}
          <meta property="og:title" content={seo.ogTitle || seo.metaTitle || blog.title} />
          <meta property="og:description" content={seo.ogDescription || seo.metaDescription || blog.excerpt} />
          {(seo.ogImage || blog.image) && <meta property="og:image" content={seo.ogImage || blog.image} />}
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.twitterTitle || seo.metaTitle || blog.title} />
          {(seo.twitterDescription || seo.metaDescription || blog.excerpt) && <meta name="twitter:description" content={seo.twitterDescription || seo.metaDescription || blog.excerpt} />}
        </Helmet>

        <nav className="blog-nav">
          <div className="nav-content">
            <button className="back-btn" onClick={this.navigateToHome}>
              <span className="arrow-left">←</span>
              Back to Articles
            </button>
            <h3 className="nav-title">Blog</h3>
          </div>
        </nav>

        <article className="blog-article">
          <header className="article-header">
            <div className="article-header-content">
              <div className="breadcrumb">
                <span onClick={this.navigateToHome} className="breadcrumb-link">Home</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{blog.category || 'Blog'}</span>
              </div>

              <h1 className="article-title">{blog.title}</h1>

              <div className="article-meta">
                <div className="author-section">
                  {blog.author && (
                    <>
                      <div className="author-avatar">{blog.author.charAt(0)}</div>
                      <div className="author-details">
                        <span className="author-name">{blog.author}</span>
                        <div className="meta-info">
                          <span className="publish-date">{this.formatDate(blog.createdAt)}</span>
                          {blog.readTime && (
                            <>
                              <span className="meta-separator">•</span>
                              <span className="read-time">{blog.readTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {!blog.author && (
                    <div className="meta-info">
                      <span className="publish-date">{this.formatDate(blog.createdAt)}</span>
                      {blog.readTime && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="read-time">{blog.readTime}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {blog.category && <span className="category-badge">{blog.category}</span>}
              </div>
            </div>

            {blog.image && (
              <div className="featured-image-wrapper">
                <img src={blog.image} alt={blog.title} className="featured-image" />
              </div>
            )}
          </header>

          <div className="article-body">
            {headings.length > 0 && (
              <aside className={`table-of-contents ${showTableOfContents ? 'visible' : 'hidden'}`}>
                <div className="toc-header">
                  <h3>Table of Contents</h3>
                  <button className="toc-toggle" onClick={this.toggleTableOfContents}>
                    {showTableOfContents ? '−' : '+'}
                  </button>
                </div>
                {showTableOfContents && (
                  <ul className="toc-list">
                    {headings.map((heading, index) => (
                      <li
                        key={index}
                        className="toc-item"
                        onClick={() => this.scrollToSection(blog.content.indexOf(heading))}
                      >
                        {heading.text}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            )}

            <div className="article-content">
              {(blog.content || []).map((item, index) => this.renderContent(item, index))}

              {blog.tags && blog.tags.length > 0 && (
                <div className="tags-section">
                  <h4 className="tags-title">Tags:</h4>
                  <div className="tags-container">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        <footer className="article-footer">
          <p>&copy; {new Date().getFullYear()} West River Funeral Directors. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default withRouter(BlogPage);
