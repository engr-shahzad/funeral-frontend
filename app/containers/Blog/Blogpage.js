import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Blogpage.css';

class BlogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: {
        id: 1,
        title: 'Understanding React Class Components',
        author: 'Sarah Johnson',
        date: 'January 15, 2025',
        readTime: '8 min read',
        category: 'React',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
        content: [
          {
            type: 'paragraph',
            text: 'React class components have been a cornerstone of React development for years. While function components with hooks have become increasingly popular, understanding class components remains essential for maintaining legacy codebases and grasping React\'s fundamental concepts.'
          },
          {
            type: 'heading',
            text: 'What Are Class Components?'
          },
          {
            type: 'paragraph',
            text: 'Class components are ES6 classes that extend React.Component. They provide a way to create components with more features than simple function components, including state management and lifecycle methods.'
          },
          {
            type: 'code',
            language: 'javascript',
            text: `class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}`
          },
          {
            type: 'heading',
            text: 'Key Features of Class Components'
          },
          {
            type: 'paragraph',
            text: 'Class components offer several powerful features that make them suitable for complex application logic:'
          },
          {
            type: 'list',
            items: [
              'State Management: Built-in state handling through this.state and this.setState()',
              'Lifecycle Methods: Access to componentDidMount, componentDidUpdate, and componentWillUnmount',
              'Error Boundaries: Ability to catch JavaScript errors in child component tree',
              'Context API: Full support for React Context for prop drilling solutions'
            ]
          },
          {
            type: 'heading',
            text: 'Lifecycle Methods Explained'
          },
          {
            type: 'paragraph',
            text: 'Lifecycle methods allow you to run code at specific points in a component\'s life. The mounting phase includes constructor(), render(), and componentDidMount(). The updating phase includes shouldComponentUpdate(), render(), and componentDidUpdate(). Finally, the unmounting phase includes componentWillUnmount().'
          },
          {
            type: 'heading',
            text: 'State Management Best Practices'
          },
          {
            type: 'paragraph',
            text: 'When working with state in class components, always use this.setState() to update state. Never modify this.state directly. Remember that setState() is asynchronous, so use the callback form when you need to update state based on previous state values.'
          },
          {
            type: 'code',
            language: 'javascript',
            text: `// Correct way to update state based on previous state
this.setState((prevState) => ({
  count: prevState.count + 1
}));`
          },
          {
            type: 'heading',
            text: 'Conclusion'
          },
          {
            type: 'paragraph',
            text: 'While React continues to evolve with hooks and function components, class components remain a fundamental part of React. Understanding them provides valuable insights into React\'s architecture and helps you maintain existing applications effectively. Whether you\'re working with legacy code or building new features, mastering class components is a valuable skill in your React toolkit.'
          }
        ],
        tags: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Programming'],
        relatedPosts: [
          {
            id: 2,
            title: 'Advanced CSS Techniques',
            category: 'CSS',
            image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop'
          },
          {
            id: 3,
            title: 'State Management Patterns',
            category: 'React',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
          },
          {
            id: 4,
            title: 'Component Architecture',
            category: 'Architecture',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'
          }
        ]
      },
      showTableOfContents: true
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // Get blog ID from URL params
    const { id } = this.props.match.params;
    // Here you can fetch blog data based on ID
    // For now, using static data
  }

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
            {item.items.map((listItem, i) => (
              <li key={i}>{listItem}</li>
            ))}
          </ul>
        );
      
      default:
        return null;
    }
  }

  render() {
    const { blog, showTableOfContents } = this.state;
    const headings = blog.content.filter(item => item.type === 'heading');

    return (
      <div className="blog-page-container">
        <nav className="blog-nav">
          <div className="nav-content">
            <button className="back-btn" onClick={this.navigateToHome}>
              <span className="arrow-left">←</span>
              Back to Articles
            </button>
            <h3 className="nav-title">Enterprise Blog</h3>
          </div>
        </nav>

        <article className="blog-article">
          <header className="article-header">
            <div className="article-header-content">
              <div className="breadcrumb">
                <span onClick={this.navigateToHome} className="breadcrumb-link">Home</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{blog.category}</span>
              </div>

              <h1 className="article-title">{blog.title}</h1>

              <div className="article-meta">
                <div className="author-section">
                  <div className="author-avatar">{blog.author.charAt(0)}</div>
                  <div className="author-details">
                    <span className="author-name">{blog.author}</span>
                    <div className="meta-info">
                      <span className="publish-date">{blog.date}</span>
                      <span className="meta-separator">•</span>
                      <span className="read-time">{blog.readTime}</span>
                    </div>
                  </div>
                </div>
                <span className="category-badge">{blog.category}</span>
              </div>
            </div>

            <div className="featured-image-wrapper">
              <img src={blog.image} alt={blog.title} className="featured-image" />
            </div>
          </header>

          <div className="article-body">
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

            <div className="article-content">
              {blog.content.map((item, index) => this.renderContent(item, index))}

              <div className="tags-section">
                <h4 className="tags-title">Tags:</h4>
                <div className="tags-container">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="related-posts">
          <h2 className="related-title">Related Articles</h2>
          <div className="related-grid">
            {blog.relatedPosts.map(post => (
              <div 
                key={post.id} 
                className="related-card"
                onClick={() => this.navigateToBlog(post.id)}
              >
                <img src={post.image} alt={post.title} className="related-image" />
                <div className="related-content">
                  <span className="related-category">{post.category}</span>
                  <h3 className="related-post-title">{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="article-footer">
          <p>&copy; 2025 Enterprise Blog. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default withRouter(BlogPage);