import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
export default function PrePlan() {
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
        <h1>Pre-Plan</h1>
      </div>
       <div className="why-subnav">
        <div className="subnav-inner">
          <span className="active">Pre-Plan</span>  |{' '}
            <Link to="/prearrangements-form" >Pre-Arrangements Form</Link> |{' '}
            <Link to="/have-the-talk-of-a-lifetime">Have The Talk of a Lifetime</Link>
        </div>
      </div>

      <Container className="py-5">
        {/* Sub navigation text */}
    

        {/* Content */}
        <Row className="align-items-center">
          <Col md="8">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              When it comes to your final arrangements, shouldn't you make the decisions?  The arrangements you make will reflect your exact wishes and desires.  Pre-arranging your own service will help to ease the burden of your loved ones.  It will also alleviate any questions, problems or differences, which can occur among family members.
            </p>

            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              Pre-payment will protect you from the rising cost of prices, and it will not be a financial burden on your loved ones. When you plan ahead you know that your wishes will be fulfilled.
            </p>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              Arrangements can be made in the comfort of your own home by clicking the button below.  Fill in as much as you are comfortable with and we'd be pleased to meet with you to discuss further.  See the form below for details.
            </p>

            <a
              href="/prearrangements-form"
              className="btn btn-outline-dark rounded-pill px-4 py-2 mt-3"
            >
              Online Pre-Arrangements Form
            </a>
          </Col>

          <Col md="4">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/949322-meetingwithdirector.jpg"
              alt="Pre Planning"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
