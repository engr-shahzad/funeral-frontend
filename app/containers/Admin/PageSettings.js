/**
 * Admin — Page Settings
 * Edit existing content, add custom sections, and manage head tags for every live page.
 * The "Page Content" tab replaces the page's hardcoded main content when saved.
 * The "Sections" tab adds extra sections (same builder as homepage custom sections).
 * The "FAQ Items" tab is shown only for /faqs and drives the accordion.
 */

import React, { useState, useEffect, useRef } from 'react';
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

const PLACEMENT_OPTIONS = [
  { value: 'afterContent',      label: 'After Page Content' },
  { value: 'afterHeroBanner',   label: 'After Hero Banner' },
  { value: 'afterTributes',     label: 'After Recent Tributes' },
  { value: 'afterWelcome',      label: 'After Welcome Section' },
  { value: 'afterServicesGrid', label: 'After Services Grid' },
  { value: 'afterTestimonials', label: 'After Testimonials' },
  { value: 'afterLocation',     label: 'After Location / Before Footer' },
];

const defaultSection = (order = 0) => ({
  enabled: true, order,
  placement: 'afterContent', layout: 'textOnly',
  label: '', heading: '', headingSize: 'h2', text: '',
  contentAlignment: 'left', backgroundColor: '#ffffff', textColor: '#333333',
  paddingSize: 'medium', marginTop: 0, marginBottom: 0,
  image: '', backgroundImage: '', overlayOpacity: 0.4,
  ctaText: '', ctaLink: '', ctaStyle: 'primary'
});

const defaultFaqItem = () => ({ question: '', answer: '' });

const emptyForm = () => ({
  customHeadHtml: '', richTextContent: '', sections: [], faqItems: []
});

export default function PageSettingsAdmin() {
  const [pages, setPages]               = useState([]);
  const [selectedPath, setSelectedPath] = useState(PAGES[0].path);
  const [formData, setFormData]         = useState(emptyForm());
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [message, setMessage]           = useState({ type: '', text: '' });
  const [activeTab, setActiveTab]       = useState('content');
  const [preview, setPreview]           = useState(false);
  const richTextRef = useRef(null);

  useEffect(() => { fetchPages(); }, []);

  useEffect(() => {
    const page = pages.find(p => p.path === selectedPath);
    if (page) {
      setFormData({
        customHeadHtml:  page.customHeadHtml  || '',
        richTextContent: page.richTextContent || '',
        sections:        Array.isArray(page.sections)  ? page.sections  : [],
        faqItems:        Array.isArray(page.faqItems)  ? page.faqItems  : []
      });
    } else {
      setFormData(emptyForm());
    }
    setPreview(false);
    setActiveTab('content');
  }, [selectedPath, pages]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/page-settings`);
      setPages(res.data || []);
    } catch {
      showMsg('error', 'Failed to load page settings.');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Capture latest contentEditable content from DOM (in case user didn't blur first)
      const latestRichText = richTextRef.current
        ? richTextRef.current.innerHTML
        : formData.richTextContent;
      const selectedLabel = PAGES.find(p => p.path === selectedPath)?.label || selectedPath;
      await axios.post(`${API_URL}/page-settings`, {
        path:            selectedPath,
        label:           selectedLabel,
        customHeadHtml:  formData.customHeadHtml,
        richTextContent: latestRichText,
        sections:        formData.sections,
        faqItems:        formData.faqItems
      });
      showMsg('success', 'Saved successfully.');
      await fetchPages();
    } catch {
      showMsg('error', 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  // ── Sections helpers ──────────────────────────────────────────────────────────
  const addSection = () =>
    setFormData(f => ({ ...f, sections: [...f.sections, defaultSection(f.sections.length)] }));

  const removeSection = i =>
    setFormData(f => ({ ...f, sections: f.sections.filter((_, idx) => idx !== i) }));

  const moveSection = (i, dir) =>
    setFormData(f => {
      const arr    = [...f.sections];
      const target = i + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[i], arr[target]] = [arr[target], arr[i]];
      return { ...f, sections: arr };
    });

  const updateSection = (i, field, val) =>
    setFormData(f => {
      const arr = [...f.sections];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, sections: arr };
    });

  // ── FAQ helpers ───────────────────────────────────────────────────────────────
  const addFaq = () =>
    setFormData(f => ({ ...f, faqItems: [...f.faqItems, defaultFaqItem()] }));

  const removeFaq = i =>
    setFormData(f => ({ ...f, faqItems: f.faqItems.filter((_, idx) => idx !== i) }));

  const moveFaq = (i, dir) =>
    setFormData(f => {
      const arr    = [...f.faqItems];
      const target = i + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[i], arr[target]] = [arr[target], arr[i]];
      return { ...f, faqItems: arr };
    });

  const updateFaq = (i, field, val) =>
    setFormData(f => {
      const arr = [...f.faqItems];
      arr[i] = { ...arr[i], [field]: val };
      return { ...f, faqItems: arr };
    });

  // ── Rich-text toolbar (execCommand) ──────────────────────────────────────────
  const execFmt = (cmd, val = null) => document.execCommand(cmd, false, val);
  const insertLink = () => {
    const url = window.prompt('Enter URL (e.g. /about-us or https://example.com):');
    if (url) document.execCommand('createLink', false, url);
  };

  const tabs = [
    { id: 'content',  label: 'Page Content' },
    { id: 'sections', label: 'Custom Sections' },
    ...(selectedPath === '/faqs' ? [{ id: 'faq', label: 'FAQ Items' }] : []),
    { id: 'head',     label: 'Head Tags' },
  ];

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-section">
      <div className="admin-page-header">
        <h1>Page Settings</h1>
        <button className="btn-admin btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── Page selector sidebar ─────────────────────────────────────────── */}
        <div style={{ width: '190px', flexShrink: 0 }}>
          <div className="admin-card" style={{ padding: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #dee2e6', fontWeight: 600, fontSize: '13px', color: '#666' }}>PAGES</div>
            {PAGES.map(p => (
              <button
                key={p.path}
                onClick={() => setSelectedPath(p.path)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 16px', border: 'none',
                  background:  selectedPath === p.path ? '#e8f4f0' : 'transparent',
                  color:       selectedPath === p.path ? '#00a097' : '#333',
                  fontWeight:  selectedPath === p.path ? 600 : 400,
                  cursor: 'pointer',
                  borderLeft: selectedPath === p.path ? '3px solid #00a097' : '3px solid transparent',
                  fontSize: '14px'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main editor ───────────────────────────────────────────────────── */}
        <div style={{ flex: 1 }}>
          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #dee2e6', marginBottom: '20px' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setPreview(false); }}
                style={{
                  padding: '9px 20px', border: 'none',
                  borderBottom: activeTab === t.id ? '2px solid #00a097' : '2px solid transparent',
                  background: 'transparent', cursor: 'pointer', fontSize: '14px',
                  fontWeight: activeTab === t.id ? 600 : 400,
                  color:      activeTab === t.id ? '#00a097' : '#555',
                  marginBottom: '-2px'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Page Content tab ────────────────────────────────────────────── */}
          {activeTab === 'content' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Page Content</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginTop: 4 }}>
                    This HTML replaces the page's main content area. The existing text is pre-loaded — edit and save to publish.
                  </p>
                </div>
                <button
                  onClick={() => setPreview(p => !p)}
                  className="btn-admin btn-secondary btn-sm"
                >
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>

              {/* Rich-text toolbar */}
              {!preview && (
                <div className="rich-text-toolbar" style={{ marginBottom: 8 }}>
                  <button type="button" className="rte-btn" onClick={() => execFmt('bold')}><b>B</b></button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('italic')}><i>I</i></button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('underline')}><u>U</u></button>
                  <span className="rte-divider" />
                  <button type="button" className="rte-btn" onClick={() => execFmt('justifyLeft')}>≡L</button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('justifyCenter')}>≡C</button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('justifyRight')}>≡R</button>
                  <span className="rte-divider" />
                  <button type="button" className="rte-btn" onClick={() => execFmt('insertUnorderedList')}>• List</button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('insertOrderedList')}>1. List</button>
                  <span className="rte-divider" />
                  <button type="button" className="rte-btn" onClick={insertLink}>🔗 Link</button>
                  <button type="button" className="rte-btn" onClick={() => execFmt('unlink')}>✂ Unlink</button>
                  <span className="rte-divider" />
                  <select className="rte-select" onChange={e => execFmt('formatBlock', e.target.value)} defaultValue="">
                    <option value="" disabled>Style</option>
                    <option value="p">Paragraph</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="blockquote">Blockquote</option>
                  </select>
                </div>
              )}

              {preview
                ? <div style={{ minHeight: 300, padding: 16, border: '1px solid #dee2e6', borderRadius: 4, background: '#fafafa' }} dangerouslySetInnerHTML={{ __html: formData.richTextContent }} />
                : (
                  <div
                    key={loading ? 'loading' : selectedPath}
                    ref={richTextRef}
                    className="rich-text-body"
                    contentEditable
                    suppressContentEditableWarning
                    style={{ minHeight: 300, padding: 12, border: '1px solid #dee2e6', borderRadius: 4, outline: 'none', fontFamily: 'inherit', fontSize: '15px', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: formData.richTextContent }}
                    onBlur={e => setFormData(f => ({ ...f, richTextContent: e.target.innerHTML }))}
                    data-placeholder="Start typing your page content here..."
                  />
                )
              }
            </div>
          )}

          {/* ── Custom Sections tab ─────────────────────────────────────────── */}
          {activeTab === 'sections' && (
            <div className="admin-card">
              <div className="section-header">
                <div>
                  <h3 style={{ margin: 0 }}>Custom Sections</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginTop: 4 }}>
                    Add content sections rendered after the page content. Same builder as the Homepage.
                  </p>
                </div>
                <button className="btn-admin btn-secondary" onClick={addSection}>+ Add Section</button>
              </div>

              {formData.sections.length === 0 && (
                <div className="empty-state" style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>
                  No sections yet. Click "+ Add Section" to create one.
                </div>
              )}

              {formData.sections.map((section, index) => (
                <SectionEditor
                  key={index}
                  section={section}
                  index={index}
                  total={formData.sections.length}
                  onChange={(field, val) => updateSection(index, field, val)}
                  onRemove={() => removeSection(index)}
                  onMove={dir => moveSection(index, dir)}
                />
              ))}

              {formData.sections.length > 0 && (
                <button className="btn-admin btn-secondary" onClick={addSection} style={{ marginTop: 12 }}>+ Add Another Section</button>
              )}
            </div>
          )}

          {/* ── FAQ Items tab (only for /faqs) ──────────────────────────────── */}
          {activeTab === 'faq' && (
            <div className="admin-card">
              <div className="section-header">
                <div>
                  <h3 style={{ margin: 0 }}>FAQ Items</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginTop: 4 }}>
                    These questions and answers drive the accordion on the FAQ page. Drag to reorder using ↑↓.
                  </p>
                </div>
                <button className="btn-admin btn-secondary" onClick={addFaq}>+ Add Question</button>
              </div>

              {formData.faqItems.length === 0 && (
                <div className="empty-state" style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>
                  No FAQ items. Click "+ Add Question" to start.
                </div>
              )}

              {formData.faqItems.map((item, i) => (
                <div key={i} style={{ border: '1px solid #dee2e6', borderRadius: 6, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, color: '#555', fontSize: '13px' }}>Question {i + 1}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-admin btn-icon" onClick={() => moveFaq(i, -1)} disabled={i === 0} title="Move up">↑</button>
                      <button className="btn-admin btn-icon" onClick={() => moveFaq(i, 1)}  disabled={i === formData.faqItems.length - 1} title="Move down">↓</button>
                      <button className="btn-admin btn-danger btn-sm" onClick={() => removeFaq(i)}>Remove</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      className="form-control"
                      value={item.question}
                      onChange={e => updateFaq(i, 'question', e.target.value)}
                      placeholder="e.g. Why have a Funeral?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={item.answer}
                      onChange={e => updateFaq(i, 'answer', e.target.value)}
                      placeholder="Type the answer here..."
                    />
                  </div>
                </div>
              ))}

              {formData.faqItems.length > 0 && (
                <button className="btn-admin btn-secondary" onClick={addFaq}>+ Add Another Question</button>
              )}
            </div>
          )}

          {/* ── Head Tags tab ───────────────────────────────────────────────── */}
          {activeTab === 'head' && (
            <div className="admin-card">
              <h3 style={{ marginTop: 0 }}>Custom Head HTML</h3>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: 12 }}>
                Raw HTML injected into <code>&lt;head&gt;</code> for this page only. Use for meta tags, Open Graph tags, JSON-LD structured data, canonical links, etc.
              </p>
              <textarea
                value={formData.customHeadHtml}
                onChange={e => setFormData(f => ({ ...f, customHeadHtml: e.target.value }))}
                rows={16}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px', padding: 12, border: '1px solid #ced4da', borderRadius: 4, resize: 'vertical' }}
                placeholder={`<meta name="description" content="...">\n<meta property="og:title" content="...">\n<script type="application/ld+json">\n  { "@context": "https://schema.org", ... }\n</script>`}
              />
            </div>
          )}

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <button className="btn-admin btn-primary btn-lg" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SectionEditor sub-component (same as homepage custom sections) ────────────
function SectionEditor({ section: s, index, total, onChange, onRemove, onMove }) {
  const execFmt = (cmd, val = null) => document.execCommand(cmd, false, val);
  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) document.execCommand('createLink', false, url);
  };

  return (
    <div className={`custom-section-editor ${!s.enabled ? 'section-disabled' : ''}`}>
      <div className="custom-section-header">
        <div className="custom-section-title">
          <span className="section-badge">Section {index + 1}</span>
          <span className="section-layout-badge">{s.layout}</span>
          <span className={`section-status-badge ${s.enabled ? 'active' : 'inactive'}`}>{s.enabled ? 'Visible' : 'Hidden'}</span>
        </div>
        <div className="custom-section-actions">
          <button className="btn-admin btn-icon" onClick={() => onMove(-1)} disabled={index === 0} title="Move Up">↑</button>
          <button className="btn-admin btn-icon" onClick={() => onMove(1)} disabled={index === total - 1} title="Move Down">↓</button>
          <button className="btn-admin btn-danger btn-sm" onClick={onRemove}>Remove</button>
        </div>
      </div>

      <div className="form-group-toggle">
        <label>
          <input type="checkbox" checked={s.enabled} onChange={e => onChange('enabled', e.target.checked)} />
          Show this section on the page
        </label>
      </div>

      <div className="form-group">
        <label>Placement</label>
        <select className="form-control" value={s.placement || 'afterContent'} onChange={e => onChange('placement', e.target.value)}>
          {PLACEMENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Layout</label>
        <div className="layout-selector">
          {[
            { value: 'textOnly',  label: 'Text Only',         desc: 'Full-width text block' },
            { value: 'imageLeft', label: 'Image Left',        desc: 'Image on left, text on right' },
            { value: 'imageRight',label: 'Image Right',       desc: 'Text on left, image on right' },
            { value: 'imageBg',   label: 'Background Image',  desc: 'Full-width background with text overlay' }
          ].map(opt => (
            <button key={opt.value} type="button"
              className={`layout-option ${s.layout === opt.value ? 'selected' : ''}`}
              onClick={() => onChange('layout', opt.value)}
            >
              <span className="layout-option-label">{opt.label}</span>
              <span className="layout-option-desc">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-row two-col">
        <div className="form-group">
          <label>Content Alignment</label>
          <div className="alignment-buttons">
            {['left', 'center', 'right'].map(a => (
              <button key={a} type="button"
                className={`align-btn ${s.contentAlignment === a ? 'selected' : ''}`}
                onClick={() => onChange('contentAlignment', a)}
              >
                ≡ {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Section Padding</label>
          <select className="form-control" value={s.paddingSize} onChange={e => onChange('paddingSize', e.target.value)}>
            <option value="small">Small (20px)</option>
            <option value="medium">Medium (60px)</option>
            <option value="large">Large (100px)</option>
          </select>
        </div>
      </div>

      <div className="form-section-divider">Content</div>

      <div className="form-group">
        <label>Label (small text above heading)</label>
        <input type="text" className="form-control" value={s.label} onChange={e => onChange('label', e.target.value)} placeholder="e.g. OUR SERVICES" />
      </div>

      <div className="form-row two-col">
        <div className="form-group">
          <label>Heading</label>
          <input type="text" className="form-control" value={s.heading} onChange={e => onChange('heading', e.target.value)} placeholder="Section heading" />
        </div>
        <div className="form-group">
          <label>Heading Tag</label>
          <select className="form-control" value={s.headingSize} onChange={e => onChange('headingSize', e.target.value)}>
            <option value="h1">H1</option><option value="h2">H2</option>
            <option value="h3">H3</option><option value="h4">H4</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Text Content</label>
        <div className="rich-text-editor">
          <div className="rich-text-toolbar">
            <button type="button" className="rte-btn" onClick={() => execFmt('bold')}><b>B</b></button>
            <button type="button" className="rte-btn" onClick={() => execFmt('italic')}><i>I</i></button>
            <button type="button" className="rte-btn" onClick={() => execFmt('underline')}><u>U</u></button>
            <span className="rte-divider" />
            <button type="button" className="rte-btn" onClick={() => execFmt('justifyLeft')}>≡L</button>
            <button type="button" className="rte-btn" onClick={() => execFmt('justifyCenter')}>≡C</button>
            <button type="button" className="rte-btn" onClick={() => execFmt('justifyRight')}>≡R</button>
            <span className="rte-divider" />
            <button type="button" className="rte-btn" onClick={() => execFmt('insertUnorderedList')}>• List</button>
            <button type="button" className="rte-btn" onClick={() => execFmt('insertOrderedList')}>1. List</button>
            <span className="rte-divider" />
            <button type="button" className="rte-btn" onClick={insertLink}>🔗 Link</button>
            <button type="button" className="rte-btn" onClick={() => execFmt('unlink')}>✂ Unlink</button>
            <span className="rte-divider" />
            <select className="rte-select" onChange={e => execFmt('formatBlock', e.target.value)} defaultValue="">
              <option value="" disabled>Style</option>
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="blockquote">Blockquote</option>
            </select>
          </div>
          <div
            key={`${index}-text`}
            className="rich-text-body"
            contentEditable suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: s.text }}
            onBlur={e => onChange('text', e.target.innerHTML)}
            data-placeholder="Type your section content here..."
          />
        </div>
      </div>

      {(s.layout === 'imageLeft' || s.layout === 'imageRight') && (
        <>
          <div className="form-section-divider">Side Image</div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="url" className="form-control" value={s.image} onChange={e => onChange('image', e.target.value)} placeholder="https://..." />
            {s.image && <div className="img-preview-sm"><img src={s.image} alt="preview" /></div>}
          </div>
        </>
      )}

      {s.layout === 'imageBg' && (
        <>
          <div className="form-section-divider">Background Image</div>
          <div className="form-group">
            <label>Background Image URL</label>
            <input type="url" className="form-control" value={s.backgroundImage} onChange={e => onChange('backgroundImage', e.target.value)} placeholder="https://..." />
            {s.backgroundImage && <div className="img-preview-sm"><img src={s.backgroundImage} alt="bg preview" /></div>}
          </div>
          <div className="form-group">
            <label>Overlay Opacity: {s.overlayOpacity}</label>
            <input type="range" className="form-range" min="0" max="1" step="0.05"
              value={s.overlayOpacity} onChange={e => onChange('overlayOpacity', parseFloat(e.target.value))} />
          </div>
        </>
      )}

      <div className="form-section-divider">Style</div>
      <div className="form-row two-col">
        <div className="form-group">
          <label>Background Color</label>
          <div className="color-input-wrapper">
            <input type="color" className="form-control-color" value={s.backgroundColor} onChange={e => onChange('backgroundColor', e.target.value)} />
            <input type="text"  className="form-control color-hex" value={s.backgroundColor} onChange={e => onChange('backgroundColor', e.target.value)} placeholder="#ffffff" />
          </div>
        </div>
        <div className="form-group">
          <label>Text Color</label>
          <div className="color-input-wrapper">
            <input type="color" className="form-control-color" value={s.textColor} onChange={e => onChange('textColor', e.target.value)} />
            <input type="text"  className="form-control color-hex" value={s.textColor} onChange={e => onChange('textColor', e.target.value)} placeholder="#333333" />
          </div>
        </div>
      </div>

      <div className="form-section-divider">CTA Button (Optional)</div>
      <div className="form-row three-col">
        <div className="form-group">
          <label>Button Text</label>
          <input type="text" className="form-control" value={s.ctaText} onChange={e => onChange('ctaText', e.target.value)} placeholder="LEARN MORE" />
        </div>
        <div className="form-group">
          <label>Button Link</label>
          <input type="text" className="form-control" value={s.ctaLink} onChange={e => onChange('ctaLink', e.target.value)} placeholder="/about-us" />
        </div>
        <div className="form-group">
          <label>Button Style</label>
          <select className="form-control" value={s.ctaStyle} onChange={e => onChange('ctaStyle', e.target.value)}>
            <option value="primary">Primary (Filled)</option>
            <option value="secondary">Secondary (Grey)</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>
        </div>
      </div>
    </div>
  );
}
