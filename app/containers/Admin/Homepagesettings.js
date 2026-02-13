/**
 * Homepage Settings - Admin Panel
 * Manage homepage content, images, and SEO meta tags
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';
import './HomepageSettings.css';

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
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/homepage-settings`);
      if (response.data) {
        setSettings(response.data);
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