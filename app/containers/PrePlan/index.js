import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function PrePlan() {
  return (
    <>
      {/* Hero */}
       <div
            className="relative h-80 bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/6192405/pexels-photo-6192405.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            }}
            >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-playfair font-bold text-white mb-4">
          Pre Plan
        </h1>
      </div>
    </div>

      <Container className="py-5">
        {/* Sub navigation text */}
        <Row className="mb-4">
          <Col className="text-center">
            <p className="text-teal font-weight-semibold">
              <span className="font-weight-bold">Pre-Plan</span> |{' '}
              <a href="/pre-arrangements" className="text-teal">
                Pre-Arrangements Form
              </a>{' '}
              |{' '}
              <a href="/have-the-talk" className="text-teal">
                Have The Talk of a Lifetime
              </a>
            </p>
          </Col>
        </Row>

        {/* Content */}
        <Row className="align-items-center">
          <Col md="8">
            <p className="text-muted">
              When it comes to your final arrangements, shouldn't you make the
              decisions? The arrangements you make will reflect your exact wishes
              and desires. Pre-arranging your own service will help to ease the
              burden of your loved ones.
            </p>

            <p className="text-muted">
              It will also alleviate any confusion or disagreements that may arise
              among family members. Making your arrangements in advance gives you
              time to make informed decisions and ensures peace of mind.
            </p>

            <a
              href="/pre-arrangements-form"
              className="btn btn-outline-dark rounded-pill px-4 py-2 mt-3"
            >
              Online Pre-Arrangements Form
            </a>
          </Col>

          <Col md="4">
            <img
              src="/images/preplan-meeting.jpg"
              alt="Pre Planning"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
