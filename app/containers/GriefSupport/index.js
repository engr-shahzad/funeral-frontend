import React from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function GriefSupport() {
  return (
    <div className="grief-support-page">

      {/* HERO */}
             <div
              className="why-hero"
              style={{
                backgroundImage:
                  "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
                backgroundSize: '110%',
                backgroundPosition: 'center',
              }}
            >
              <h1>When Death Occurs</h1>
            </div>
          <div className="why-subnav">
                  <div className="subnav-inner">
                    <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
                    <span className="active">Grief Support</span> |{' '}
                    <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
                    <Link to="/social-security">Social Security Benefits</Link> |{' '}
                    <Link to="/faqs">F.A.Q.</Link>
                  </div>
                </div>

    
  

      {/* CONTENT */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              In addition to the bereavement services for the families we serve,  we have provided some helpful grief support links below: 
            </p>

             <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#379078',
                  fontSize: '18px'
                }}
              >
                Crisis, Grief and Healing 
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              Webhealing.com, the first interactive grief website on the internet, offers discussion boards, articles, book suggestions, and advice for men and women working through every aspect of grief. The site’s founder, Tom Golden LCSW, has provided book excerpts and contact information to help those healing from loss.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#379078',
                  fontSize: '18px'
                }}
              >
                Grief and Loss
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 , fontSize: '18px', fontWeight: '300'  }}>
             The American Association of Retired Persons (AARP) website contains a Grief & Loss section with grief-related articles and information.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#379078',
                  fontSize: '18px'
                }}
              >
                National Hospice and Palliative Care Organization
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                The National Hospice and Palliative Care Organization’s website provides a host of information and resources for people facing a life-limiting illness or injury and their caregivers.
              </p>
            </div>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="5">
            <img
              src="	https://s3.amazonaws.com/CFSV2/stockimages/394057-Funeral-FS-600x450-27.jpg"
              alt="Grief Support"
              className="img-fluid rounded mb-4"
            />

            {/* SIGNUP CARD */}
            <div
              style={{
                backgroundColor: '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                A year of daily grief support
              </h5>

              <p style={{ fontFamily: 'Oswald', lineHeight: 1.6 }}>
                Our support in your time of need does not end after the funeral
                services. Enter your email below to receive a grief support
                message from us each day for the next year. You can unsubscribe
                at any time.
              </p>

              <label
                style={{
                  fontFamily: 'Oswald',
                  fontWeight: 600,
                  marginTop: '1rem'
                }}
              >
                Your Email Address
              </label>

              <Input
                type="email"
                placeholder="Required"
                className="mb-3"
              />

              <Button
                outline
                color="dark"
                style={{
                  borderRadius: '30px',
                  padding: '0.4rem 1.5rem'
                }}
              >
                Sign Up
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
