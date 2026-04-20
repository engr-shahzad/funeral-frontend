import React from 'react';
import { Link } from 'react-router-dom';
import './About.scss';

export default function AboutUs({ serverSideData }) {
  const ssrData        = serverSideData || (typeof window !== 'undefined' ? window.__SSR_DATA__ : {});
  const richText       = (ssrData && ssrData.richTextContent) || '';
  const sections       = (ssrData && ssrData.sections)        || [];

  return (
    <div className="about-us-page">
      <div
        className="why-hero"
        style={{
          backgroundImage: "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>About Us</h1>
      </div>

      <div className="why-subnav">
        <div className="subnav-inner">
          <span className="active">About Us</span> |{' '}
          <Link to="/our-staff">Our Staff</Link> |{' '}
          <Link to="/contact-us">Contact Us</Link> |{' '}
          <Link to="/why-choose-us">Why Choose Us</Link> |{' '}
          <Link to="/testimonials">Testimonials</Link>
        </div>
      </div>

      <div className="why-content">
        {/* Main content — DB overrides hardcoded text when set */}
        <div className="why-main">
          {richText
            ? <div dangerouslySetInnerHTML={{ __html: richText }} />
            : (
              <>
                <p>The caring and experienced professionals at West River Funeral Directors LLC are here to support you through this difficult time. We offer a range of personalized services to suit your family's wishes and requirements. You can count on us to help you plan a personal, lasting tribute to your loved one. And we'll carefully guide you through the many decisions that must be made during this challenging time.</p>
                <p>You are welcome to call us at any time of the day, any day of the week, for immediate assistance. Or, visit our funeral home in person at your convenience. We also provide a wealth of information here on our web site so you can learn more from the privacy of your own home.</p>
              </>
            )
          }
        </div>

        <aside className="sidebar">
          <img
            src="https://s3.amazonaws.com/CFSV2/stockimages/987238-Funeral-FS-600x450-26.jpg"
            alt="Peaceful scene"
          />
        </aside>
      </div>

      {/* Custom sections added via admin */}
      {sections.length > 0 && <PageSectionsRenderer sections={sections} />}
    </div>
  );
}

// Inline renderer so we don't need an extra import in the SSR bundle
function PageSectionsRenderer({ sections }) {
  const sorted = [...sections].filter(s => s.enabled).sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <>
      {sorted.map((s, i) => <PageSection key={i} section={s} />)}
    </>
  );
}

function PageSection({ section: s }) {
  const padding = s.paddingSize === 'large' ? '100px 0' : s.paddingSize === 'small' ? '20px 0' : '60px 0';
  const style   = {
    background:   s.layout === 'imageBg' && s.backgroundImage
      ? `linear-gradient(rgba(0,0,0,${s.overlayOpacity || 0}),rgba(0,0,0,${s.overlayOpacity || 0})), url(${s.backgroundImage}) center/cover`
      : s.backgroundColor || '#fff',
    color:        s.layout === 'imageBg' ? '#fff' : (s.textColor || '#333'),
    padding,
    marginTop:    s.marginTop   ? `${s.marginTop}px`   : undefined,
    marginBottom: s.marginBottom ? `${s.marginBottom}px` : undefined,
    textAlign:    s.contentAlignment || 'left',
  };

  const Heading = s.headingSize || 'h2';
  const content = (
    <div>
      {s.label    && <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>{s.label}</p>}
      {s.heading  && <Heading style={{ marginBottom: '16px' }}>{s.heading}</Heading>}
      {s.text     && <div dangerouslySetInnerHTML={{ __html: s.text }} />}
      {s.ctaText  && s.ctaLink && (
        <a href={s.ctaLink} style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', background: '#00a097', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          {s.ctaText}
        </a>
      )}
    </div>
  );

  if (s.layout === 'imageLeft' || s.layout === 'imageRight') {
    return (
      <div style={{ ...style, padding: undefined }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', padding, gap: '32px', alignItems: 'center', flexDirection: s.layout === 'imageLeft' ? 'row' : 'row-reverse' }}>
          {s.image && <img src={s.image} alt="" style={{ width: '40%', minWidth: '200px', borderRadius: '4px' }} />}
          <div style={{ flex: 1 }}>{content}</div>
        </div>
      </div>
    );
  }

  return <div style={style}><div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>{content}</div></div>;
}
