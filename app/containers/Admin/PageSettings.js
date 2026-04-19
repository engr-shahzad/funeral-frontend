/**
 * Admin - Page Settings
 * Per-page custom <head> HTML and rich text body content for all SSR pages.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const PAGES = [
  { path: '/',              label: 'Homepage' },
  { path: '/about-us',     label: 'About Us' },
  { path: '/our-services', label: 'Our Services' },
  { path: '/faqs',         label: 'FAQs' },
  { path: '/blogs',        label: 'Blog List' },
  { path: '/obituaries',   label: 'All Obituaries' },
];

const PageSettingsAdmin = () => {
  const [pages, setPages] = useState([]);
  const [selectedPath, setSelectedPath] = useState(PAGES[0].path);
  const [formData, setFormData] = useState({ customHeadHtml: '', richTextContent: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('head');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    const page = pages.find(p => p.path === selectedPath);
    if (page) {
      setFormData({
        customHeadHtml: page.customHeadHtml || '',
        richTextContent: page.richTextContent || '',
      });
    } else {
      setFormData({ customHeadHtml: '', richTextContent: '' });
    }
  }, [selectedPath, pages]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/page-settings`);
      setPages(res.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load page settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const selectedLabel = PAGES.find(p => p.path === selectedPath)?.label || selectedPath;
      await axios.post(`${API_URL}/page-settings`, {
        path: selectedPath,
        label: selectedLabel,
        customHeadHtml: formData.customHeadHtml,
        richTextContent: formData.richTextContent,
      });
      setMessage({ type: 'success', text: 'Page settings saved successfully.' });
      await fetchPages();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save page settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-header">
        <h1>Page Settings</h1>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Add custom meta/head tags and rich text content for each live page.
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Page selector */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          <div className="card">
            <div className="card-header"><strong>Pages</strong></div>
            <div style={{ padding: '8px 0' }}>
              {PAGES.map(p => (
                <button
                  key={p.path}
                  onClick={() => setSelectedPath(p.path)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none',
                    background: selectedPath === p.path ? '#e8f4f0' : 'transparent',
                    color: selectedPath === p.path ? '#00a097' : '#333',
                    fontWeight: selectedPath === p.path ? '600' : '400',
                    cursor: 'pointer',
                    borderLeft: selectedPath === p.path ? '3px solid #00a097' : '3px solid transparent',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1 }}>
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{PAGES.find(p => p.path === selectedPath)?.label || selectedPath}</strong>
              <code style={{ fontSize: '12px', color: '#888' }}>{selectedPath}</code>
            </div>
            <div className="card-body">
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #dee2e6' }}>
                {['head', 'content'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setPreview(false); }}
                    style={{
                      padding: '8px 20px',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid #00a097' : '2px solid transparent',
                      background: 'transparent',
                      fontWeight: activeTab === tab ? '600' : '400',
                      color: activeTab === tab ? '#00a097' : '#666',
                      cursor: 'pointer',
                      marginBottom: '-1px',
                    }}
                  >
                    {tab === 'head' ? 'Custom Head HTML' : 'Rich Text Content'}
                  </button>
                ))}
              </div>

              {activeTab === 'head' && (
                <div>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    Raw HTML injected into <code>&lt;head&gt;</code> for this page. Use this for any
                    meta tags, Open Graph tags, canonical links, structured data (JSON-LD), etc.
                  </p>
                  <textarea
                    value={formData.customHeadHtml}
                    onChange={e => setFormData(f => ({ ...f, customHeadHtml: e.target.value }))}
                    rows={16}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      padding: '12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      resize: 'vertical',
                    }}
                    placeholder={`<meta name="description" content="...">\n<meta property="og:title" content="...">\n<meta property="og:description" content="...">\n<meta name="robots" content="index, follow">\n<script type="application/ld+json">\n  { "@context": "https://schema.org", ... }\n</script>`}
                  />
                </div>
              )}

              {activeTab === 'content' && (
                <div>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                    HTML content displayed on this page. You can write raw HTML including headings,
                    paragraphs, lists, images, and inline styles.
                  </p>
                  <div style={{ marginBottom: '10px' }}>
                    <button
                      onClick={() => setPreview(!preview)}
                      style={{
                        padding: '6px 14px',
                        border: '1px solid #00a097',
                        borderRadius: '4px',
                        background: preview ? '#00a097' : 'transparent',
                        color: preview ? '#fff' : '#00a097',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      {preview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                  {preview ? (
                    <div
                      style={{
                        minHeight: '300px',
                        padding: '16px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        background: '#fafafa',
                      }}
                      dangerouslySetInnerHTML={{ __html: formData.richTextContent }}
                    />
                  ) : (
                    <textarea
                      value={formData.richTextContent}
                      onChange={e => setFormData(f => ({ ...f, richTextContent: e.target.value }))}
                      rows={20}
                      style={{
                        width: '100%',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        padding: '12px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        resize: 'vertical',
                      }}
                      placeholder={`<h2>Section Title</h2>\n<p>Your content here...</p>`}
                    />
                  )}
                </div>
              )}

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
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
      </div>
    </div>
  );
};

export default PageSettingsAdmin;
