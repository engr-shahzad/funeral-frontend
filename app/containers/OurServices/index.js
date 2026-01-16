import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function Services() {
  return (
    <>
     <div
        className="why-hero"
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>Our Services</h1>
      </div>
         <div className="why-subnav">
        <div className="subnav-inner">
           <h3 className="text-center text-teal mb-4" style={{fontFamily:'Oswald', color:'#00a097',  fontSize: '1.2em'}}>Our Services</h3>
        </div>
      </div>

      <Container className="py-5">
        {/* Intro */}
        <Row className="mb-5">
          <Col>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
            When planning a service, you have many options available to you and we will do all that we can to provide a beautiful and respectful ceremony. No matter your choice, we can offer you a space to join with family and friends in grief, comfort and love. And above all, we will do our utmost to honor your loved one. We will be happy to go over all your options and answer any questions that you may have.  
            </p>
          </Col>
        </Row>

        <hr />

        {/* Memorial Service */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 className="mb-3" style={{fontFamily:"'Playfair Display', serif", fontSize: '24px', color:'#426965', fontWeight:'400'}}>FUNERAL SERVICE</h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              A funeral service is a special time for family and friends to comfort one another, begin to find healing and celebrate a life well lived. Whether you choose burial or cremation, you can hold a funeral service to honor your loved one. We are happy to provide a traditional funeral or something completely unique. Many cultures and religions have special funeral traditions and we will do our best to accommodate your requests. This is a moment for you and your family and we are honored to help you in any way that we can.
            </p>
          </Col>
          <Col md="4">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/190258-general10.jpg"
              alt="Memorial Service"
              className="img-fluid"
            />
          </Col>
        </Row>

        <hr />

        {/* Burial */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 style={{fontFamily:"'Playfair Display', serif", fontSize: '24px', color:'#426965', fontWeight:'400'}}>MEMORIAL SERVICE</h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
             Just like a funeral service, a memorial service is a time to remember your loved one. This can be held shortly after death or weeks later, with or without an urn present. What’s important is that it creates a time and a place for family and friends to gather together and support one another, share memories and pay their respects. We can hold a memorial service at our funeral home, the final resting place or at your home. 
            </p>
          </Col>
          <Col md="4">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/398048-general6.jpg"
              alt="Burial"
              className="img-fluid"
            />
          </Col>
        </Row>

        <hr />

        {/* Cremation */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 style={{fontFamily:"'Playfair Display', serif", fontSize: '24px', color:'#426965', fontWeight:'400'}}>BURIAL</h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              A casket burial is a traditional service and there are many options you can choose from. We can provide an immediate burial without a public service; a visitation, viewing or wake with a closed or open casket; a funeral service at our funeral home, church or private home and a graveside service at a cemetery. You can choose whether you’d like a public or private service or a combination. It is entirely up to you how you wish to pay your respects. 
            </p>
          </Col>
          <Col md="4">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/493250-CasketSprayHalfPurple.jpg"
              alt="Cremation"
              className="img-fluid"
            />
          </Col>
        </Row>
         <Row className="align-items-center py-4">
          <Col md="8">
            <h4 style={{fontFamily:"'Playfair Display', serif", fontSize: '24px', color:'#426965', fontWeight:'400'}}>CREMATION</h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              Cremation has become a popular option for many people because it can be more flexible as to where and when you hold a service. You can have a traditional funeral service before a cremation or a memorial service at any time with or without the urn present. You can keep the urn, scatter the ashes or have the urn buried in a grave or columbarium where we can hold a service. Whether you choose burial or cremation, we’re here to offer you a meaningful ceremony.
            </p>
          </Col>
          <Col md="4">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/743880-UrnWreath.jpg"
              alt="Cremation"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
