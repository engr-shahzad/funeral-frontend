import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function Services({ serverSideData }) {
  const ssrData  = serverSideData || (typeof window !== 'undefined' ? window.__SSR_DATA__ : {});
  const richText = (ssrData && ssrData.richTextContent) || '';
  const sections = (ssrData && ssrData.sections)        || [];

  return (
    <>
      <div
        className="why-hero"
        style={{
          backgroundImage: "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>Our Services</h1>
      </div>

      <div className="why-subnav">
        <div className="subnav-inner">
          <h3 className="text-center text-teal mb-4" style={{ fontFamily: 'Oswald', color: '#00a097', fontSize: '1.2em' }}>Our Services</h3>
        </div>
      </div>

      {/* Main content — DB richText overrides hardcoded when set */}
      {richText
        ? (
          <Container className="py-5">
            <div dangerouslySetInnerHTML={{ __html: richText }} />
          </Container>
        )
        : (
          <Container className="py-5">
            <Row className="mb-5">
              <Col>
                <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                  When planning a service, you have many options available to you and we will do all that we can to provide a beautiful and respectful ceremony. No matter your choice, we can offer you a space to join with family and friends in grief, comfort and love. And above all, we will do our utmost to honor your loved one. We will be happy to go over all your options and answer any questions that you may have.
                </p>
              </Col>
            </Row>
            <hr />
            <Row className="align-items-center py-4">
              <Col md="8">
                <h4 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#426965', fontWeight: '400' }}>FUNERAL SERVICE</h4>
                <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                  A funeral service is a special time for family and friends to comfort one another, begin to find healing and celebrate a life well lived. Whether you choose burial or cremation, you can hold a funeral service to honor your loved one. We are happy to provide a traditional funeral or something completely unique.
                </p>
              </Col>
              <Col md="4"><img src="https://s3.amazonaws.com/CFSV2/stockimages/190258-general10.jpg" alt="Funeral Service" className="img-fluid" /></Col>
            </Row>
            <hr />
            <Row className="align-items-center py-4">
              <Col md="8">
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#426965', fontWeight: '400' }}>MEMORIAL SERVICE</h4>
                <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                  Just like a funeral service, a memorial service is a time to remember your loved one. This can be held shortly after death or weeks later, with or without an urn present. We can hold a memorial service at our funeral home, the final resting place or at your home.
                </p>
              </Col>
              <Col md="4"><img src="https://s3.amazonaws.com/CFSV2/stockimages/398048-general6.jpg" alt="Memorial Service" className="img-fluid" /></Col>
            </Row>
            <hr />
            <Row className="align-items-center py-4">
              <Col md="8">
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#426965', fontWeight: '400' }}>BURIAL</h4>
                <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                  A casket burial is a traditional service and there are many options you can choose from. We can provide an immediate burial without a public service; a visitation, viewing or wake; a funeral service at our funeral home, church or private home and a graveside service at a cemetery.
                </p>
              </Col>
              <Col md="4"><img src="https://s3.amazonaws.com/CFSV2/stockimages/493250-CasketSprayHalfPurple.jpg" alt="Burial" className="img-fluid" /></Col>
            </Row>
            <Row className="align-items-center py-4">
              <Col md="8">
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#426965', fontWeight: '400' }}>CREMATION</h4>
                <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                  Cremation has become a popular option for many people because it can be more flexible as to where and when you hold a service. Whether you choose burial or cremation, we're here to offer you a meaningful ceremony.
                </p>
              </Col>
              <Col md="4"><img src="https://s3.amazonaws.com/CFSV2/stockimages/743880-UrnWreath.jpg" alt="Cremation" className="img-fluid" /></Col>
            </Row>
          </Container>
        )
      }

      {/* Custom sections added via admin */}
      {sections.length > 0 && sections.filter(s => s.enabled).map((s, i) => <PageSection key={i} section={s} />)}
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
    marginTop:    s.marginTop    ? `${s.marginTop}px`    : undefined,
    marginBottom: s.marginBottom ? `${s.marginBottom}px` : undefined,
    textAlign:    s.contentAlignment || 'left',
  };
  const Heading = s.headingSize || 'h2';
  const content = (
    <div>
      {s.label   && <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>{s.label}</p>}
      {s.heading && <Heading style={{ marginBottom: '16px' }}>{s.heading}</Heading>}
      {s.text    && <div dangerouslySetInnerHTML={{ __html: s.text }} />}
      {s.ctaText && s.ctaLink && (
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
