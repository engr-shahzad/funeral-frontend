import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function HaveTheTalk() {
  return (
    <div className="have-the-talk-page">

      {/* HERO */}
      <div
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '320px',
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
          <h1
            style={{
              color: '#fff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '3rem',
              fontWeight: 700
            }}
          >
            Have The Talk of a Lifetime
          </h1>
        </div>
      </div>

      {/* BREADCRUMB */}
      <Container className="py-4 text-center">
        <p style={{ fontFamily: 'Oswald', fontSize: '0.95rem' }}>
          <Link to="/pre-plan">Pre-Plan</Link> |{' '}
          <Link to="/pre-arrangements">Pre-Arrangements Form</Link> |{' '}
          <strong>Have The Talk of a Lifetime</strong>
        </p>
      </Container>

      {/* INTRO + VIDEO */}
      <Container className="pb-5">
        <Row>
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Meaningful memorialization of a loved one’s passing can transform,
              heal, and comfort us. It highlights our loved ones’ sacrifices,
              reminds us of the things that they value, and inspires us with their
              life stories.
            </p>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Having important conversations in advance helps families honor and
              remember the lives of their loved ones.
            </p>
          </Col>

          <Col md="5">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/9gZ1d3fD1Dg"
                title="Have the Talk of a Lifetime"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </Col>
        </Row>
      </Container>

      <hr />

      {/* FAQ SECTION */}
      <Container className="py-5">
        <Row>
          <Col md="6">
            <h4 style={{ fontFamily: "'Playfair Display', serif" }}>
              Why is having the talk of a lifetime important?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Although we might have daily conversations with our loved ones, the
              most meaningful and deep ones don’t always happen. Having this kind
              of conversation can make a huge difference — it can help us see our
              loved ones in a different and more positive light, teach us valuable
              lessons, bring us closer together, and help reaffirm how much we
              love them.
            </p>

            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                marginTop: '2rem'
              }}
            >
              Who should have the talk?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              We could have the talk of a lifetime with anyone we value and love —
              parents, grandparents, siblings, spouses, children, or close
              friends. It doesn’t have to happen only at the end of life. The best
              time is while we still have the opportunity.
            </p>
          </Col>

          <Col md="6">
            <h4 style={{ fontFamily: "'Playfair Display', serif" }}>
              How do we start the talk?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              We don’t need to wait for a special moment. These conversations can
              happen anytime — at home, during a walk, while sharing a meal, or
              gathered as a family.
            </p>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Visual prompts like photographs, albums, mementos, or familiar
              places can help start the conversation and open up meaningful
              memories and stories.
            </p>

            <p
              style={{
                fontFamily: 'Oswald',
                fontStyle: 'italic',
                marginTop: '1.5rem'
              }}
            >
              May we always treasure every moment of our lives and have meaningful
              conversations with the ones we love.
            </p>

            <Button color="success" className="mt-3">
              Download Brochure
            </Button>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
