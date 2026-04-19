/**
 * Admin - Site Config
 * Manage robots.txt content and sitemap.xml URLs from the database.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const CHANGEFREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

const emptyUrl = () => ({ url: '', changefreq: 'weekly', priority: 0.5, lastmod: '' });

const SiteConfigAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('robots');

  const [robotsTxt, setRobotsTxt] = useState('');
  const [sitemapUrls, setSitemapUrls] = useState([emptyUrl()]);
  const [robotsPreview, setRobotsPreview] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/site-config`);
      const data = res.data || {};
      setRobotsTxt(data.robotsTxt || '');
      setSitemapUrls(data.sitemapUrls && data.sitemapUrls.length > 0
        ? data.sitemapUrls
        : [emptyUrl()]
      );
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load site config.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post(`${API_URL}/site-config`, {
        robotsTxt,
        sitemapUrls: sitemapUrls.filter(u => u.url.trim()),
      });
      setMessage({ type: 'success', text: 'Site config saved. robots.txt and sitemap.xml are now live.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save site config.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  const updateUrl = (index, field, value) => {
    setSitemapUrls(urls => urls.map((u, i) => i === index ? { ...u, [field]: value } : u));
  };

  const addUrl = () => setSitemapUrls(urls => [...urls, emptyUrl()]);

  const removeUrl = index => setSitemapUrls(urls => urls.filter((_, i) => i !== index));

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h1>Site Config</h1>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Manage <code>robots.txt</code> and <code>sitemap.xml</code> — served dynamically from the database.
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #dee2e6' }}>
        {['robots', 'sitemap'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #00a097' : '2px solid transparent',
              background: 'transparent',
              fontWeight: activeTab === tab ? '600' : '400',
              color: activeTab === tab ? '#00a097' : '#666',
              cursor: 'pointer',
              marginBottom: '-1px',
              fontSize: '15px',
            }}
          >
            {tab === 'robots' ? 'robots.txt' : 'sitemap.xml'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {activeTab === 'robots' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Edit the full content of <code>/robots.txt</code>. Served directly from the database.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '13px', color: '#00a097' }}
                  >
                    View live ↗
                  </a>
                  <button
                    onClick={() => setRobotsPreview(!robotsPreview)}
                    style={{
                      padding: '5px 12px',
                      border: '1px solid #00a097',
                      borderRadius: '4px',
                      background: 'transparent',
                      color: '#00a097',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    {robotsPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              {robotsPreview ? (
                <pre
                  style={{
                    background: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    whiteSpace: 'pre-wrap',
                    minHeight: '200px',
                  }}
                >
                  {robotsTxt}
                </pre>
              ) : (
                <textarea
                  value={robotsTxt}
                  onChange={e => setRobotsTxt(e.target.value)}
                  rows={18}
                  style={{
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    padding: '12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                  placeholder={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: https://yourdomain.com/sitemap.xml`}
                />
              )}
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  Add URLs to include in <code>/sitemap.xml</code>. The XML is generated dynamically.
                </p>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', color: '#00a097' }}
                >
                  View live ↗
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 130px 40px', gap: '8px', marginBottom: '8px' }}>
                {['URL', 'Change Freq', 'Priority', 'Last Modified', ''].map(h => (
                  <div key={h} style={{ fontSize: '12px', fontWeight: '600', color: '#666', padding: '4px 0' }}>{h}</div>
                ))}
              </div>

              {sitemapUrls.map((entry, index) => (
                <div
                  key={index}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 130px 40px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}
                >
                  <input
                    type="text"
                    value={entry.url}
                    onChange={e => updateUrl(index, 'url', e.target.value)}
                    placeholder="https://example.com/page"
                    style={{ padding: '7px 10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '13px', width: '100%' }}
                  />
                  <select
                    value={entry.changefreq}
                    onChange={e => updateUrl(index, 'changefreq', e.target.value)}
                    style={{ padding: '7px 6px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '13px', width: '100%' }}
                  >
                    {CHANGEFREQS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input
                    type="number"
                    value={entry.priority}
                    onChange={e => updateUrl(index, 'priority', parseFloat(e.target.value))}
                    min="0"
                    max="1"
                    step="0.1"
                    style={{ padding: '7px 10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '13px', width: '100%' }}
                  />
                  <input
                    type="text"
                    value={entry.lastmod}
                    onChange={e => updateUrl(index, 'lastmod', e.target.value)}
                    placeholder="2025-01-01"
                    style={{ padding: '7px 10px', border: '1px solid #ced4da', borderRadius: '4px', fontSize: '13px', width: '100%' }}
                  />
                  <button
                    onClick={() => removeUrl(index)}
                    style={{
                      padding: '6px',
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={addUrl}
                style={{
                  marginTop: '8px',
                  padding: '8px 18px',
                  background: 'transparent',
                  border: '1px dashed #00a097',
                  color: '#00a097',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                + Add URL
              </button>
            </div>
          )}

          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 28px',
                background: '#00a097',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '15px',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteConfigAdmin;
