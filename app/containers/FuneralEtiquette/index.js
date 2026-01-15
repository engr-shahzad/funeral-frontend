import React from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function FuneralEtiquette() {
  return (
    <div className="funeral-etiquette-page">

      {/* ================= HERO ================= */}
      <div
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          position: 'relative'
        }}
      >
        {/* Green overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(47,127,115,0.55)'
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
            Funeral Etiquette
          </h1>
        </div>
      </div>

      {/* ================= SUB NAV ================= */}
      <Container className="py-4 text-center">
        <p style={{ fontFamily: 'Oswald', fontSize: '0.95rem' }}>
          <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
          <Link to="/grief-support">Grief Support</Link> |{' '}
          <strong>Funeral Etiquette</strong> |{' '}
          <Link to="/social-security-benefits">Social Security Benefits</Link> |{' '}
          <Link to="/faq">F.A.Q.</Link>
        </p>
      </Container>

      <hr />

      {/* ================= CONTENT ================= */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              When someone you know passes away, your first instinct is to offer
              encouragement, help, and support to those affected — but you may
              not be sure what to say or do. It’s okay to feel this way.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: '#2f7f73'
                }}
              >
                What to Wear
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                When attending a memorial service or funeral, dress in dark and
                subdued colors such as black, gray, brown, or navy. Jewelry
                should be subtle and traditional.
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
                Arriving
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                Arrive on time and enter quietly. The first rows are typically
                reserved for the immediate family and close friends.
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
                Flowers
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                Flowers are a meaningful way to express sympathy and may be sent
                to the funeral home or directly to the family’s residence.
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
                Children
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
                Allowing children to attend a service can help them understand
                and say goodbye. Prepare them by explaining what they may see.
              </p>
            </div>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="5">
            <img
              src="https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Funeral Service"
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
                Our support does not end after the funeral services. Enter your
                email below to receive a daily grief support message for the
                next year. You may unsubscribe at any time.
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
