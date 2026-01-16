import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function SocialSecurityBenefits() {
  return (
    <div className="social-security-benefits-page">

      {/* ================= HERO ================= */}
              <div
               className="why-hero"
               style={{
                 backgroundImage:
                   "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
                 backgroundSize: '110%',
                 backgroundPosition: 'center',
               }}
             >
               <h1>Social Security Benefits</h1>
             </div>
           <div className="why-subnav">
                   <div className="subnav-inner">
                     <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
                     <Link to="/grief-support">Grief Support</Link> |{' '}
                     <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
                     <span className="active">Social Security Benefits</span> |{' '}
                     <Link to="/faqs">F.A.Q.</Link>
                   </div>
                 </div>
 
     

      {/* ================= CONTENT ================= */}
      <Container className="pb-5">
        <Row>
          {/* LEFT COLUMN */}
          <Col md="8">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              Some of the deceased's family members may be able to receive Social Security benefits if the deceased person worked long enough under Social Security to quality for benefits.  You should get in touch with Social Security as soon as you can to make sure the family receives all of the benefits to which it may be entitled.  Please read the following information carefully to learn what benefits may be available.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
             A one-time payment of $255 can be paid to the surviving spouse if he or she was living with the deceased; or, if living apart, was receiving certain Social Security benefits on the deceased's record.  If there is no surviving spouse, the payment is made to a child who is eligible for benefits on the deceased's record in the month of death.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
             Certain family members may be eligible to receive monthly benefits, including:
            </p>

            <ul  style={{listStyleType: 'disc', paddingLeft: '1.5rem', fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '200' }}>
              <li>
                A widow or widower age 60 or older (age 50 or older if disabled)
              </li>
              <li >
                A surviving spouse at any age who is caring for the deceased's child under age 16 or disabled;
              </li>
              <li>
                An unmarried child of the deceased who is younger than age 18 (or age 18 or 19 if he or she is a full-time student in an elementary or secondary school); or age 18 or older with a disability that began before age 22;
              </li>
              <li>
                Parents, age 62 or older, who were dependent on the deceased for at least half of their support; and
              </li>
              <li>
                A surviving divorced spouse, under certain circumstances.
              </li>
            </ul>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              The Social Security website is a valuable resource for information
              about all of Social Security’s programs. There are a number of{' '}
              <a href="https://www.ssa.gov" target="_blank" rel="noreferrer">
                things you can do online
              </a>.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
             In addition to using the Social Security website, you can call them toll-free at 1-800-772-1213.  Staff can answer specific questions from 7 a.m. to 7 p.m., Monday through Friday.  They can also provide information by automated phone service 24 hours a day.  If you are deaf or hard of hearing, you may call the TTY number at 1-800-325-0778.
            </p>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="4" className="text-center">
            <img
              src="	https://s3.amazonaws.com/CFSV2/stockimages/893286-socsec.png"
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
