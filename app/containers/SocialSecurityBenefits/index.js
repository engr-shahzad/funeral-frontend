import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function SocialSecurityBenefits() {
  return (
    <div className="social-security-benefits-page">

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
            Social Security Benefits
          </h1>
        </div>
      </div>

      {/* ================= SUB NAV ================= */}
      <Container className="py-4 text-center">
        <p style={{ fontFamily: 'Oswald', fontSize: '0.95rem' }}>
          <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
          <Link to="/grief-support">Grief Support</Link> |{' '}
          <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
          <strong>Social Security Benefits</strong> |{' '}
          <Link to="/faq">F.A.Q.</Link>
        </p>
      </Container>

      <hr />

      {/* ================= CONTENT ================= */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="8">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Some of the deceased’s family members may be able to receive Social
              Security benefits if the deceased person worked long enough under
              Social Security to qualify for benefits. You should get in touch
              with Social Security as soon as you can to make sure you receive
              all the benefits to which you are entitled.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              Certain family members may be eligible to receive monthly
              benefits, including:
            </p>

            <ul style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              <li>
                A widow or widower age 60 or older (age 50 or older if disabled)
              </li>
              <li>
                A surviving spouse at any age who is caring for the deceased’s
                child under age 16 or disabled
              </li>
              <li>
                An unmarried child of the deceased who is younger than age 18
                (or age 18 or 19 if he or she is a full-time student in an
                elementary or secondary school), or age 18 or older with a
                disability that began before age 22
              </li>
              <li>
                Parents, age 62 or older, who were dependent on the deceased for
                at least half of their support
              </li>
              <li>
                A surviving divorced spouse, under certain circumstances
              </li>
            </ul>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              The Social Security website is a valuable resource for information
              about all of Social Security’s programs. There are a number of{' '}
              <a href="https://www.ssa.gov" target="_blank" rel="noreferrer">
                things you can do online
              </a>.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 }}>
              In addition to using the Social Security website, you can call them
              toll-free at <strong>1-800-772-1213</strong>. Staff can answer
              specific questions from 7 a.m. to 7 p.m., Monday through Friday.
              They can also provide information by automated phone service 24
              hours a day. If you are deaf or hard of hearing, you may call the
              TTY number at <strong>1-800-325-0778</strong>.
            </p>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="4" className="text-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/59/Social_Security_Administration_seal.svg"
              alt="Social Security Administration"
              style={{
                maxWidth: '240px',
                marginTop: '2rem'
              }}
            />
          </Col>
        </Row>
      </Container>

    </div>
  );
}
