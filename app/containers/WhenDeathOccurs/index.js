import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function WhenDeathOccurs() {
  return (
    <div className="when-death-occurs-page">

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
          <h1
            style={{
              color: '#fff',
              fontFamily: "'Playfair Display', serif",
              fontSize: '3rem',
              fontWeight: 700
            }}
          >
            When Death Occurs
          </h1>
        </div>
      </div>

      {/* SUB NAV */}
      <Container className="py-4 text-center">
        <p style={{ fontFamily: 'Oswald', fontSize: '0.95rem' }}>
          <strong>When Death Occurs</strong> |{' '}
          <Link to="/grief-support">Grief Support</Link> |{' '}
          <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
          <Link to="/social-security-benefits">Social Security Benefits</Link> |{' '}
          <Link to="/faq">F.A.Q.</Link>
        </p>
      </Container>

      <hr />

      {/* INTRO */}
      <Container className="pb-5">
        <Row>
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              The overwhelming feelings of despair, disbelief, shock, and numbness
              caused by the passing of a loved one cannot be conveyed by words.
              On this page, we’ve put together helpful information to guide you
              through this process.
            </p>

            {/* SECTION */}
            <Section
              title="Notify Proper Authorities"
              content={[
                'If your loved one passes away while under the care of a facility — such as a nursing home or a hospital — staff from the facility will contact you and notify appropriate authorities themselves.',
                'If the death occurred in the workplace or at home, you will need to get in touch with his/her physician or emergency medical personnel, as the cause of death must be identified and indicated in legal documents.',
                'In the event that no one was present at the time of death, you will need to contact the police before moving the deceased to another location.'
              ]}
            />

            <Section
              title="Call the Funeral Home"
              content={[
                'Our caring funeral director can assist you with your funeral arrangements. We will collect information from you in order to facilitate the transfer of your loved one’s remains to our facility.',
                'You may be asked whether the deceased has made pre-arrangements and whether burial or cremation is preferred. We encourage you to ask any questions you may have during this call.',
                'Remember, we are here to listen, help you, and guide you during this difficult time.'
              ]}
            />

            <Section
              title="Meet the Funeral Director / Staff"
              content={[
                'On your first meeting with us, we will discuss arrangements for your loved one’s burial or cremation. You will be shown a list of our services so you can decide what suits your family’s preferences and budget.',
                'You may be asked to select a casket, schedule the service date and time, choose pallbearers, and arrange vehicle services.',
                'You are encouraged to bring photographs, videos, letters, or treasured items to help us better understand how you envision honoring your loved one.'
              ]}
            />

            <Section
              title="File for a Death Certificate"
              content={[
                'A death certificate is a legal document indicating the cause of death and other vital statistics pertaining to the deceased.',
                'Certified copies are required for insurance claims, Social Security benefits, veteran benefits, transferring property ownership, and closing bank accounts.',
                'If you need assistance filing this document, we can help you with the process.'
              ]}
            />
          </Col>

          {/* IMAGE COLUMN */}
          <Col md="5">
            <img
              src="https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Comfort"
              className="img-fluid rounded"
              style={{ marginTop: '10px' }}
            />
          </Col>
        </Row>
      </Container>

    </div>
  );
}

/* Reusable section component */
function Section({ title, content }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h5
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}
      >
        {title}
      </h5>
      {content.map((text, index) => (
        <p
          key={index}
          style={{
            fontFamily: 'Oswald',
            lineHeight: 1.8,
            marginBottom: '0.8rem'
          }}
        >
          {text}
        </p>
      ))}
      <hr />
    </div>
  );
}
