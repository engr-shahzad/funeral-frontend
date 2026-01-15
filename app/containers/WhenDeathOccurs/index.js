import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function WhenDeathOccurs() {
  return (
    <div className="when-death-occurs-page">

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
                    <span className="active">When Death Occurs</span> |{' '}
                    <Link to="/grief-support">Grief Support</Link> |{' '}
                    <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
                    <Link to="/social-security-benefits">Social Security Benefits</Link> |{' '}
                    <Link to="/faq">F.A.Q.</Link>
                  </div>
                </div>

    

      
      {/* INTRO */}
      <Container className="pb-5">
        <Row>
          <Col md="7" style={{ fontWeight: '300' }}>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              The overwhelming feelings of despair, disbelief, shock, and numbness caused by the passing of a loved one cannot be conveyed by mere words. Even when the death is expected, the pain that loss brings can still be devastating.  In truth, no one is completely prepared for the death of someone close to their heart.
</p><p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300' }}>
During this difficult time, there are decisions to be made immediately, arrangements to be coordinated, and a lot of things to be considered for your loved one’s final farewell. We understand how this may feel overwhelming, especially with the grief you’re feeling over the loss. Please know that we are here to help and support you. 
</p><p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
On this page, we’ve put together helpful information to guide you through this process.
            </p>
              <hr/>
            {/* SECTION */}
            <Section
              title="NOTIFY PROPER AUTHORITIES"
              content={[
                'If your loved one passes away while under the care of a facility — such as a nursing home or a hospital — staff from the facility will contact you and notify appropriate authorities themselves.',
                'If the death occurred in the workplace or at home, you will need to get in touch with his/her physician or emergency medical personnel, as the cause of death must be identified and indicated in legal documents.',
                'In the event that no one was present at the time of death, you will need to contact the police before moving the deceased to another location.'
              ]}
            />

            <Section
              title="Call the Funeral Home"
              content={[
                'Our caring funeral director can assist you with your funeral arrangements. We will collect information from you in order to facilitate the transfer of your loved one’s remains to our facility. You would also be asked if the deceased has made pre-arrangements and whether or not you’d like for him/her to be embalmed. While of course you can ask any questions you have in your mind during this call, note that once you visit the funeral home, we can discuss the arrangements in greater detail.',
                'During this call, you’ll also be informed about the things that you need to bring with you like the clothes your deceased loved one will use for the burial. Feel free to call us whenever you feel the need to. Remember that we are here to listen to you, help you, and guide you during this difficult and trying time.',
              ]}
            />

            <Section
              title="Meet the Funeral Director / Staff"
              content={[
                'On your first meeting with us, we will discuss the arrangements for your loved one’s burial. You will be shown a list of our packages/services so you can decide what suits your family’s preferences and budget. You will be asked whether you’d prefer burial or cremation arrangements and optionally you would select a casket, schedule a time and date for the services, decide on the location of the burial, draft an obituary notice, arrange for vehicle services, and select pallbearers.',
            'We would also use this opportunity to inquire about your loved one for us to have a better understanding of the person the services will honor. It will be extremely helpful if you can bring some memorabilia — photos, videos, treasured items, letters — that would give us a clearer picture on how you envision paying tribute to your loved one.'
              ]}
            />

            <Section
              title="File for a Death Certificate"
              content={[
                'A death certificate is a legal document indicating the cause of death, including other vital statistics pertaining to the deceased, signed by the attending physician. In case your loved one died due to an accident, a coroner or the county medical examiner may prepare the form. If you feel that you need assistance in filing for this legal document with the state, we can help you. Certified copies of the death certificate can also be purchased at the same time. These certified copies are important when gaining access to bank accounts and safety deposit boxes, claiming for benefits due to the family (like the Veteran’s benefits or insurance claims), and transferring or selling ownership of properties.'
              ]}
            />
          </Col>

          {/* IMAGE COLUMN */}
          <Col md="5">
            <img
              src="	https://s3.amazonaws.com/CFSV2/stockimages/231128-stress.png"
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
    <div style={{ marginBottom: '4rem' }}>
      <h5
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800,
          textSize: '24px',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          marginTop: '1rem'
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
            marginBottom: '0.8rem', fontSize: '18px' , fontWeight: '300'
          }}
        >
          {text}
        </p>
      ))}
      <hr />
    </div>
  );
}
