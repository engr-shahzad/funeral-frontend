import React from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function GriefSupport() {
  return (
    <div className="grief-support-page">

      {/* HERO */}
      <div
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)'
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
         <h1 className="text-5xl font-playfair font-bold text-white mb-4">
            Grief Support
          </h1>
        </div>
      </div>

      {/* SUB NAV */}
      <Container className="py-4 text-center">
        <p style={{ fontFamily: 'Oswald', fontSize: '0.95rem' }}>
          <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
          <strong>Grief Support</strong> |{' '}
          <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
          <Link to="/social-security-benefits">Social Security Benefits</Link> |{' '}
          <Link to="/faq">F.A.Q.</Link>
        </p>
      </Container>

      <hr />

      {/* CONTENT */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              In addition to the bereavement services for the families we serve,
              we have provided some helpful grief support links below:
            </p>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#2f7f73'
                }}
              >
                Grief and Loss
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                The American Association of Retired Persons (AARP) website contains
                a Grief &amp; Loss section with grief-related articles and information.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#2f7f73'
                }}
              >
                National Hospice and Palliative Care Organization
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                The National Hospice and Palliative Care Organization’s website
                provides a host of information and resources for people facing a
                life-limiting illness or injury and their caregivers.
              </p>
            </div>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="5">
            <img
              src="https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg?auto=compress&cs=tinysrgb&w=600"
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
