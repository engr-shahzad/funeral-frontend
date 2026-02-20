/**
 * Homepage Settings - Admin Panel
 * Manage homepage content, images, and SEO meta tags
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';
import './Homepagesettings.css';

const HomepageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('seo');

  const [settings, setSettings] = useState({
    // SEO Settings
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: ''
    },
    
    // Hero Banner Section
    heroBanner: {
      slides: [
        {
          image: '',
          title: '',
          ctaText: '',
          ctaLink: ''
        }
      ]
    },

    // Welcome Section
    welcomeSection: {
      enabled: true,
      label: '',
      title: '',
      description: '',
      image: '',
      ctaText: '',
      ctaLink: ''
    },

    // Services Grid
    servicesGrid: {
      enabled: true,
      services: [
        { title: '', image: '', link: '' },
        { title: '', image: '', link: '' },
        { title: '', image: '', link: '' },
        { title: '', image: '', link: '' }
      ]
    },

    // Testimonials Section
    testimonials: {
      enabled: true,
      title: '',
      subtitle: '',
      text: '',
      ctaText: '',
      ctaLink: ''
    },

    // Location Section
    location: {
      enabled: true,
      title: '',
      businessName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      fax: '',
      mapEmbedUrl: ''
    },

    // Google Reviews
    googleReviews: {
      enabled: true,
      title: '',
      qrCodeUrl: '',
      reviewLink: ''
    },

    // Custom Sections
    customSections: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/homepage-settings`);
      if (response.data) {
        // Merge with defaults so new fields (like customSections) always exist
        setSettings(prev => ({
          ...prev,
          ...response.data,
          customSections: Array.isArray(response.data.customSections) ? response.data.customSections : []
        }));
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post(`${API_URL}/homepage-settings`, settings);
      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, index, field, value) => {
    setSettings(prev => {
      const updatedArray = [...prev[section][Object.keys(prev[section])[0]]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [Object.keys(prev[section])[0]]: updatedArray
        }
      };
    });
  };

  const addSlide = () => {
    setSettings(prev => ({
      ...prev,
      heroBanner: {
        slides: [...prev.heroBanner.slides, { image: '', title: '', ctaText: '', ctaLink: '' }]
      }
    }));
  };

  const removeSlide = (index) => {
    setSettings(prev => ({
      ...prev,
      heroBanner: {
        slides: prev.heroBanner.slides.filter((_, i) => i !== index)
      }
    }));
  };

  // ---- Custom Sections helpers ----
  const defaultCustomSection = () => ({
    enabled: true,
    order: (settings.customSections || []).length,
    placement: 'afterHeroSection',
    layout: 'textOnly',
    label: '',
    heading: '',
    headingSize: 'h2',
    text: '',
    contentAlignment: 'left',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    paddingSize: 'medium',
    marginTop: 0,
    marginBottom: 0,
    image: '',
    backgroundImage: '',
    overlayOpacity: 0.4,
    ctaText: '',
    ctaLink: '',
    ctaStyle: 'primary'
  });

  const PLACEMENT_OPTIONS = [
    { value: 'afterHeroBanner',    label: 'After Hero Banner (Slider)' },
    { value: 'afterTributes',      label: 'After Recent Tributes' },
    { value: 'afterWelcome',       label: 'After Welcome Section' },
    { value: 'afterHeroSection',   label: 'After Hero Info Section' },
    { value: 'afterServicesGrid',  label: 'After Services Grid' },
    { value: 'afterTestimonials',  label: 'After Testimonials' },
    { value: 'afterGoogleReviews', label: 'After Google Reviews' },
    { value: 'afterLocation',      label: 'After Location / Before Footer' },
  ];

  const addCustomSection = () => {
    setSettings(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), defaultCustomSection()]
    }));
  };

  const removeCustomSection = (index) => {
    setSettings(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const moveCustomSection = (index, direction) => {
    setSettings(prev => {
      const arr = [...prev.customSections];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...prev, customSections: arr };
    });
  };

  const handleCustomSectionChange = (index, field, value) => {
    setSettings(prev => {
      const updated = [...prev.customSections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customSections: updated };
    });
  };

  // Rich text formatting via execCommand
  const execFormat = (sectionIndex, command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertLink = (index) => {
    const url = window.prompt('Enter URL (e.g. /about-us or https://example.com):');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const removeLink = () => {
    document.execCommand('unlink', false, null);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Loading homepage settings...</p>
      </div>
    );
  }

  return (
    <div className="homepage-settings">
      <div className="admin-page-header">
        <h1>Homepage Settings</h1>
        <button 
          className="btn-admin btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO & Meta Tags
        </button>
        <button 
          className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Hero Banner
        </button>
        <button 
          className={`tab-btn ${activeTab === 'welcome' ? 'active' : ''}`}
          onClick={() => setActiveTab('welcome')}
        >
          Welcome Section
        </button>
        <button 
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services Grid
        </button>
        <button 
          className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials
        </button>
        <button
          className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          Location
        </button>
        <button
          className={`tab-btn ${activeTab === 'customSections' ? 'active' : ''}`}
          onClick={() => setActiveTab('customSections')}
        >
          Custom Sections
        </button>
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        
        {/* SEO & Meta Tags Tab */}
        {activeTab === 'seo' && (
          <div className="admin-card">
            <h2>SEO & Meta Tags</h2>
            
            <div className="form-section">
              <h3>Basic Meta Tags</h3>
              <div className="form-group">
                <label>Meta Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.seo.metaTitle}
                  onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                  placeholder="West River Funeral Directors - Compassionate Funeral Services"
                  maxLength="60"
                />
                <small>{settings.seo.metaTitle.length}/60 characters</small>
              </div>

              <div className="form-group">
                <label>Meta Description *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={settings.seo.metaDescription}
                  onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                  placeholder="Providing compassionate funeral services in Rapid City, SD. Pre-planning, cremation, and memorial services available 24/7."
                  maxLength="160"
                />
                <small>{settings.seo.metaDescription.length}/160 characters</small>
              </div>

              <div className="form-group">
                <label>Meta Keywords (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.seo.metaKeywords}
                  onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
                  placeholder="funeral home, cremation services, memorial services, Rapid City SD"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Open Graph (Facebook, LinkedIn)</h3>
              <div className="form-group">
                <label>OG Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.seo.ogTitle}
                  onChange={(e) => handleInputChange('seo', 'ogTitle', e.target.value)}
                  placeholder="Leave blank to use Meta Title"
                />
              </div>

              <div className="form-group">
                <label>OG Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={settings.seo.ogDescription}
                  onChange={(e) => handleInputChange('seo', 'ogDescription', e.target.value)}
                  placeholder="Leave blank to use Meta Description"
                />
              </div>

              <div className="form-group">
                <label>OG Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={settings.seo.ogImage}
                  onChange={(e) => handleInputChange('seo', 'ogImage', e.target.value)}
                  placeholder="https://example.com/og-image.jpg (1200x630px recommended)"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Twitter Card</h3>
              <div className="form-group">
                <label>Twitter Card Type</label>
                <select
                  className="form-control"
                  value={settings.seo.twitterCard}
                  onChange={(e) => handleInputChange('seo', 'twitterCard', e.target.value)}
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>

              <div className="form-group">
                <label>Twitter Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.seo.twitterTitle}
                  onChange={(e) => handleInputChange('seo', 'twitterTitle', e.target.value)}
                  placeholder="Leave blank to use Meta Title"
                />
              </div>

              <div className="form-group">
                <label>Twitter Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={settings.seo.twitterDescription}
                  onChange={(e) => handleInputChange('seo', 'twitterDescription', e.target.value)}
                  placeholder="Leave blank to use Meta Description"
                />
              </div>

              <div className="form-group">
                <label>Twitter Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={settings.seo.twitterImage}
                  onChange={(e) => handleInputChange('seo', 'twitterImage', e.target.value)}
                  placeholder="https://example.com/twitter-image.jpg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner Tab */}
        {activeTab === 'hero' && (
          <div className="admin-card">
            <div className="section-header">
              <h2>Hero Banner Slides</h2>
              <button className="btn-admin btn-secondary" onClick={addSlide}>
                + Add Slide
              </button>
            </div>

            {settings.heroBanner.slides.map((slide, index) => (
              <div key={index} className="slide-editor">
                <div className="slide-header">
                  <h3>Slide {index + 1}</h3>
                  {settings.heroBanner.slides.length > 1 && (
                    <button 
                      className="btn-admin btn-danger btn-sm"
                      onClick={() => removeSlide(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    className="form-control"
                    value={slide.image}
                    onChange={(e) => handleNestedInputChange('heroBanner', index, 'image', e.target.value)}
                    placeholder="https://example.com/banner-image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slide.title}
                    onChange={(e) => handleNestedInputChange('heroBanner', index, 'title', e.target.value)}
                    placeholder="Celebrate Life"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slide.ctaText}
                      onChange={(e) => handleNestedInputChange('heroBanner', index, 'ctaText', e.target.value)}
                      placeholder="OUR SERVICES"
                    />
                  </div>

                  <div className="form-group">
                    <label>CTA Button Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slide.ctaLink}
                      onChange={(e) => handleNestedInputChange('heroBanner', index, 'ctaLink', e.target.value)}
                      placeholder="/our-services"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Welcome Section Tab */}
        {activeTab === 'welcome' && (
          <div className="admin-card">
            <div className="form-group-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={settings.welcomeSection.enabled}
                  onChange={(e) => handleInputChange('welcomeSection', 'enabled', e.target.checked)}
                />
                Enable Welcome Section
              </label>
            </div>

            {settings.welcomeSection.enabled && (
              <>
                <div className="form-group">
                  <label>Label (Small Text Above Title)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.welcomeSection.label}
                    onChange={(e) => handleInputChange('welcomeSection', 'label', e.target.value)}
                    placeholder="WELCOME TO"
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.welcomeSection.title}
                    onChange={(e) => handleInputChange('welcomeSection', 'title', e.target.value)}
                    placeholder="West River Funeral Directors LLC"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={settings.welcomeSection.description}
                    onChange={(e) => handleInputChange('welcomeSection', 'description', e.target.value)}
                    placeholder="Welcome to our website. We provide individualized funeral services..."
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={settings.welcomeSection.image}
                    onChange={(e) => handleInputChange('welcomeSection', 'image', e.target.value)}
                    placeholder="https://example.com/welcome-image.jpg"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.welcomeSection.ctaText}
                      onChange={(e) => handleInputChange('welcomeSection', 'ctaText', e.target.value)}
                      placeholder="LEARN MORE"
                    />
                  </div>

                  <div className="form-group">
                    <label>CTA Button Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.welcomeSection.ctaLink}
                      onChange={(e) => handleInputChange('welcomeSection', 'ctaLink', e.target.value)}
                      placeholder="/about-us"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Services Grid Tab */}
        {activeTab === 'services' && (
          <div className="admin-card">
            <div className="form-group-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={settings.servicesGrid.enabled}
                  onChange={(e) => handleInputChange('servicesGrid', 'enabled', e.target.checked)}
                />
                Enable Services Grid
              </label>
            </div>

            {settings.servicesGrid.enabled && settings.servicesGrid.services.map((service, index) => (
              <div key={index} className="service-editor">
                <h3>Service {index + 1}</h3>
                
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.title}
                    onChange={(e) => handleNestedInputChange('servicesGrid', index, 'title', e.target.value)}
                    placeholder="Pre-Plan"
                  />
                </div>

                <div className="form-group">
                  <label>Background Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={service.image}
                    onChange={(e) => handleNestedInputChange('servicesGrid', index, 'image', e.target.value)}
                    placeholder="https://example.com/service-image.jpg"
                  />
                </div>

                <div className="form-group">
                  <label>Link</label>
                  <input
                    type="text"
                    className="form-control"
                    value={service.link}
                    onChange={(e) => handleNestedInputChange('servicesGrid', index, 'link', e.target.value)}
                    placeholder="/pre-arrangements"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="admin-card">
            <div className="form-group-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={settings.testimonials.enabled}
                  onChange={(e) => handleInputChange('testimonials', 'enabled', e.target.checked)}
                />
                Enable Testimonials Section
              </label>
            </div>

            {settings.testimonials.enabled && (
              <>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.testimonials.title}
                    onChange={(e) => handleInputChange('testimonials', 'title', e.target.value)}
                    placeholder="What Our Families are Saying..."
                  />
                </div>

                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.testimonials.subtitle}
                    onChange={(e) => handleInputChange('testimonials', 'subtitle', e.target.value)}
                    placeholder="TESTIMONIALS"
                  />
                </div>

                <div className="form-group">
                  <label>Text Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={settings.testimonials.text}
                    onChange={(e) => handleInputChange('testimonials', 'text', e.target.value)}
                    placeholder="We are always impressed..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CTA Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.testimonials.ctaText}
                      onChange={(e) => handleInputChange('testimonials', 'ctaText', e.target.value)}
                      placeholder="Click to enter your testimonial »"
                    />
                  </div>

                  <div className="form-group">
                    <label>CTA Button Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.testimonials.ctaLink}
                      onChange={(e) => handleInputChange('testimonials', 'ctaLink', e.target.value)}
                      placeholder="/testimonials"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="admin-card">
            <div className="form-group-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={settings.location.enabled}
                  onChange={(e) => handleInputChange('location', 'enabled', e.target.checked)}
                />
                Enable Location Section
              </label>
            </div>

            {settings.location.enabled && (
              <>
                <div className="form-group">
                  <label>Section Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.location.title}
                    onChange={(e) => handleInputChange('location', 'title', e.target.value)}
                    placeholder="Our Location"
                  />
                </div>

                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.location.businessName}
                    onChange={(e) => handleInputChange('location', 'businessName', e.target.value)}
                    placeholder="West River Funeral Directors LLC"
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.location.address}
                    onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                    placeholder="420 East Saint Patrick St. Ste 106"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.location.city}
                      onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                      placeholder="Rapid City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.location.state}
                      onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                      placeholder="SD"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.location.zip}
                      onChange={(e) => handleInputChange('location', 'zip', e.target.value)}
                      placeholder="57701"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={settings.location.phone}
                      onChange={(e) => handleInputChange('location', 'phone', e.target.value)}
                      placeholder="1-605-787-3940"
                    />
                  </div>

                  <div className="form-group">
                    <label>Fax</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={settings.location.fax}
                      onChange={(e) => handleInputChange('location', 'fax', e.target.value)}
                      placeholder="1-605-854-5202"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Google Maps Embed URL</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={settings.location.mapEmbedUrl}
                    onChange={(e) => handleInputChange('location', 'mapEmbedUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                  />
                  <small>Get this from Google Maps → Share → Embed a map</small>
                </div>
              </>
            )}
          </div>
        )}

        {/* Custom Sections Tab */}
        {activeTab === 'customSections' && (
          <div className="admin-card">
            <div className="section-header">
              <div>
                <h2>Custom Sections</h2>
                <p className="section-desc">Add custom content sections to your homepage. Each section can have a background image, side image layout, and rich text content with alignment controls.</p>
              </div>
              <button className="btn-admin btn-secondary" onClick={addCustomSection}>
                + Add Section
              </button>
            </div>

            {(!settings.customSections || settings.customSections.length === 0) && (
              <div className="empty-state">
                <p>No custom sections yet. Click "+ Add Section" to create your first section.</p>
              </div>
            )}

            {(settings.customSections || []).map((section, index) => (
              <div key={index} className={`custom-section-editor ${!section.enabled ? 'section-disabled' : ''}`}>
                {/* Section Header */}
                <div className="custom-section-header">
                  <div className="custom-section-title">
                    <span className="section-badge">Section {index + 1}</span>
                    <span className="section-layout-badge">{section.layout}</span>
                    <span className={`section-status-badge ${section.enabled ? 'active' : 'inactive'}`}>
                      {section.enabled ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <div className="custom-section-actions">
                    <button
                      className="btn-admin btn-icon"
                      onClick={() => moveCustomSection(index, -1)}
                      disabled={index === 0}
                      title="Move Up"
                    >↑</button>
                    <button
                      className="btn-admin btn-icon"
                      onClick={() => moveCustomSection(index, 1)}
                      disabled={index === (settings.customSections.length - 1)}
                      title="Move Down"
                    >↓</button>
                    <button
                      className="btn-admin btn-danger btn-sm"
                      onClick={() => removeCustomSection(index)}
                    >Remove</button>
                  </div>
                </div>

                {/* Enable/Disable toggle */}
                <div className="form-group-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) => handleCustomSectionChange(index, 'enabled', e.target.checked)}
                    />
                    Show this section on homepage
                  </label>
                </div>

                {/* Placement */}
                <div className="form-group">
                  <label>Placement — where should this section appear?</label>
                  <select
                    className="form-control"
                    value={section.placement || 'afterHeroSection'}
                    onChange={(e) => handleCustomSectionChange(index, 'placement', e.target.value)}
                  >
                    {PLACEMENT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Layout Selector */}
                <div className="form-group">
                  <label>Layout</label>
                  <div className="layout-selector">
                    {[
                      { value: 'textOnly', label: 'Text Only', desc: 'Full width text block' },
                      { value: 'imageLeft', label: 'Image Left', desc: 'Image on left, text on right' },
                      { value: 'imageRight', label: 'Image Right', desc: 'Text on left, image on right' },
                      { value: 'imageBg', label: 'Background Image', desc: 'Full-width background image with text overlay' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`layout-option ${section.layout === opt.value ? 'selected' : ''}`}
                        onClick={() => handleCustomSectionChange(index, 'layout', opt.value)}
                      >
                        <span className="layout-option-label">{opt.label}</span>
                        <span className="layout-option-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row two-col">
                  {/* Content Alignment */}
                  <div className="form-group">
                    <label>Content Alignment</label>
                    <div className="alignment-buttons">
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          type="button"
                          className={`align-btn ${section.contentAlignment === align ? 'selected' : ''}`}
                          onClick={() => handleCustomSectionChange(index, 'contentAlignment', align)}
                          title={align.charAt(0).toUpperCase() + align.slice(1)}
                        >
                          {align === 'left' && '≡ Left'}
                          {align === 'center' && '≡ Center'}
                          {align === 'right' && '≡ Right'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding Size */}
                  <div className="form-group">
                    <label>Section Padding (top &amp; bottom inside)</label>
                    <select
                      className="form-control"
                      value={section.paddingSize}
                      onChange={(e) => handleCustomSectionChange(index, 'paddingSize', e.target.value)}
                    >
                      <option value="small">Small (20px)</option>
                      <option value="medium">Medium (60px)</option>
                      <option value="large">Large (100px)</option>
                    </select>
                  </div>
                </div>

                {/* Margin */}
                <div className="form-row two-col">
                  <div className="form-group">
                    <label>Margin Top (px) — space above section: {section.marginTop || 0}px</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0" max="200" step="4"
                      value={section.marginTop || 0}
                      onChange={(e) => handleCustomSectionChange(index, 'marginTop', parseInt(e.target.value))}
                    />
                    <div className="range-value-display">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={section.marginTop || 0}
                        min="0" max="200"
                        onChange={(e) => handleCustomSectionChange(index, 'marginTop', parseInt(e.target.value) || 0)}
                        style={{ width: '80px' }}
                      />
                      <span>px</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Margin Bottom (px) — space below section: {section.marginBottom || 0}px</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0" max="200" step="4"
                      value={section.marginBottom || 0}
                      onChange={(e) => handleCustomSectionChange(index, 'marginBottom', parseInt(e.target.value))}
                    />
                    <div className="range-value-display">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={section.marginBottom || 0}
                        min="0" max="200"
                        onChange={(e) => handleCustomSectionChange(index, 'marginBottom', parseInt(e.target.value) || 0)}
                        style={{ width: '80px' }}
                      />
                      <span>px</span>
                    </div>
                  </div>
                </div>

                {/* ---- Content Fields ---- */}
                <div className="form-section-divider">Content</div>

                <div className="form-group">
                  <label>Label (small text above heading)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={section.label}
                    onChange={(e) => handleCustomSectionChange(index, 'label', e.target.value)}
                    placeholder="e.g. OUR SERVICES"
                  />
                </div>

                <div className="form-row two-col">
                  <div className="form-group">
                    <label>Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={section.heading}
                      onChange={(e) => handleCustomSectionChange(index, 'heading', e.target.value)}
                      placeholder="Section heading text"
                    />
                  </div>
                  <div className="form-group">
                    <label>Heading Tag</label>
                    <select
                      className="form-control"
                      value={section.headingSize}
                      onChange={(e) => handleCustomSectionChange(index, 'headingSize', e.target.value)}
                    >
                      <option value="h1">H1 — Page Title</option>
                      <option value="h2">H2 — Section Title</option>
                      <option value="h3">H3 — Subsection</option>
                      <option value="h4">H4 — Small heading</option>
                    </select>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="form-group">
                  <label>Text Content</label>
                  <div className="rich-text-editor">
                    <div className="rich-text-toolbar">
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'bold')} title="Bold"><b>B</b></button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'italic')} title="Italic"><i>I</i></button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'underline')} title="Underline"><u>U</u></button>
                      <span className="rte-divider" />
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'justifyLeft')} title="Align Left">L</button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'justifyCenter')} title="Align Center">C</button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'justifyRight')} title="Align Right">R</button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'justifyFull')} title="Justify">J</button>
                      <span className="rte-divider" />
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'insertUnorderedList')} title="Bullet list">• List</button>
                      <button type="button" className="rte-btn" onClick={() => execFormat(index, 'insertOrderedList')} title="Numbered list">1. List</button>
                      <span className="rte-divider" />
                      <button type="button" className="rte-btn rte-btn-link" onClick={() => insertLink(index)} title="Insert Link">🔗 Link</button>
                      <button type="button" className="rte-btn" onClick={() => removeLink()} title="Remove Link">✂ Unlink</button>
                      <span className="rte-divider" />
                      <select
                        className="rte-select"
                        onChange={(e) => execFormat(index, 'formatBlock', e.target.value)}
                        defaultValue=""
                        title="Paragraph style"
                      >
                        <option value="" disabled>Style</option>
                        <option value="p">Paragraph</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="blockquote">Blockquote</option>
                      </select>
                    </div>
                    <div
                      className="rich-text-body"
                      contentEditable
                      suppressContentEditableWarning
                      dangerouslySetInnerHTML={{ __html: section.text }}
                      onBlur={(e) => handleCustomSectionChange(index, 'text', e.target.innerHTML)}
                      data-placeholder="Type your content here..."
                    />
                  </div>
                </div>

                {/* ---- Image Fields ---- */}
                {(section.layout === 'imageLeft' || section.layout === 'imageRight') && (
                  <>
                    <div className="form-section-divider">Side Image</div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={section.image}
                        onChange={(e) => handleCustomSectionChange(index, 'image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {section.image && (
                        <div className="img-preview-sm">
                          <img src={section.image} alt="preview" />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {section.layout === 'imageBg' && (
                  <>
                    <div className="form-section-divider">Background Image</div>
                    <div className="form-group">
                      <label>Background Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={section.backgroundImage}
                        onChange={(e) => handleCustomSectionChange(index, 'backgroundImage', e.target.value)}
                        placeholder="https://example.com/bg-image.jpg"
                      />
                      {section.backgroundImage && (
                        <div className="img-preview-sm">
                          <img src={section.backgroundImage} alt="bg preview" />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Overlay Opacity (0 = none, 1 = full dark): {section.overlayOpacity}</label>
                      <input
                        type="range"
                        className="form-range"
                        min="0" max="1" step="0.05"
                        value={section.overlayOpacity}
                        onChange={(e) => handleCustomSectionChange(index, 'overlayOpacity', parseFloat(e.target.value))}
                      />
                    </div>
                  </>
                )}

                {/* ---- Style Settings ---- */}
                <div className="form-section-divider">Style</div>
                <div className="form-row three-col">
                  <div className="form-group">
                    <label>Background Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        className="form-control-color"
                        value={section.backgroundColor}
                        onChange={(e) => handleCustomSectionChange(index, 'backgroundColor', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control color-hex"
                        value={section.backgroundColor}
                        onChange={(e) => handleCustomSectionChange(index, 'backgroundColor', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Text Color</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        className="form-control-color"
                        value={section.textColor}
                        onChange={(e) => handleCustomSectionChange(index, 'textColor', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control color-hex"
                        value={section.textColor}
                        onChange={(e) => handleCustomSectionChange(index, 'textColor', e.target.value)}
                        placeholder="#333333"
                      />
                    </div>
                  </div>
                </div>

                {/* ---- CTA Button ---- */}
                <div className="form-section-divider">CTA Button (Optional)</div>
                <div className="form-row three-col">
                  <div className="form-group">
                    <label>Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={section.ctaText}
                      onChange={(e) => handleCustomSectionChange(index, 'ctaText', e.target.value)}
                      placeholder="LEARN MORE"
                    />
                  </div>
                  <div className="form-group">
                    <label>Button Link</label>
                    <input
                      type="text"
                      className="form-control"
                      value={section.ctaLink}
                      onChange={(e) => handleCustomSectionChange(index, 'ctaLink', e.target.value)}
                      placeholder="/about-us"
                    />
                  </div>
                  <div className="form-group">
                    <label>Button Style</label>
                    <select
                      className="form-control"
                      value={section.ctaStyle}
                      onChange={(e) => handleCustomSectionChange(index, 'ctaStyle', e.target.value)}
                    >
                      <option value="primary">Primary (Filled)</option>
                      <option value="secondary">Secondary (Grey)</option>
                      <option value="outline">Outline (Border only)</option>
                      <option value="ghost">Ghost (Light on dark)</option>
                    </select>
                  </div>
                </div>

              </div>
            ))}

            {(settings.customSections || []).length > 0 && (
              <div className="add-section-bottom">
                <button className="btn-admin btn-secondary" onClick={addCustomSection}>
                  + Add Another Section
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Save Button at Bottom */}
      <div className="settings-footer">
        <button 
          className="btn-admin btn-primary btn-lg" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default HomepageSettings;