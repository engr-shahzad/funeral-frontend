import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default function Services() {
  return (
    <>
       <div
            className="relative h-80 bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/6192405/pexels-photo-6192405.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            }}
            >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-playfair font-bold text-white mb-4">
          Our Services
        </h1>
      </div>
    </div>


      <Container className="py-5">
        {/* Intro */}
        <Row className="mb-5">
          <Col>
            <h3 className="text-center text-teal mb-4">Our Services</h3>
            <p className="text-muted">
              When planning a service, you have many options available to you and we
              will do all that we can to provide a beautiful and respectful ceremony.
              No matter your choice, we can offer you a space to join with family and
              friends in grief, comfort and love. And above all, we will do our utmost
              to honor your loved one. We will be happy to go over all your options and
              answer any questions that you may have.
            </p>
            <p className="text-muted">
              Funeral or something completely unique. Many cultures and religions have
              special funeral traditions and we will do our best to accommodate your
              requests. This is a moment for you and your family and we are honored to
              help you in any way that we can.
            </p>
          </Col>
        </Row>

        <hr />

        {/* Memorial Service */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 className="mb-3">MEMORIAL SERVICE</h4>
            <p className="text-muted">
              Just like a funeral service, a memorial service is a time to remember
              your loved one. This can be held shortly after death or weeks later, with
              or without an urn present. What's important is that it creates a time
              and a place for family and friends to gather together and support one
              another, share memories and pay their respects.
            </p>
          </Col>
          <Col md="4">
            <img
              src="/images/memorial.jpg"
              alt="Memorial Service"
              className="img-fluid"
            />
          </Col>
        </Row>

        <hr />

        {/* Burial */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 className="mb-3">BURIAL</h4>
            <p className="text-muted">
              A casket burial is a traditional service and there are many options you
              can choose from. We can provide an immediate burial without a public
              service; visitation, viewing or wake with a closed or open casket; a
              funeral service at our funeral home, church or private home and a
              graveside service at a cemetery.
            </p>
          </Col>
          <Col md="4">
            <img
              src="/images/burial.jpg"
              alt="Burial"
              className="img-fluid"
            />
          </Col>
        </Row>

        <hr />

        {/* Cremation */}
        <Row className="align-items-center py-4">
          <Col md="8">
            <h4 className="mb-3">CREMATION</h4>
            <p className="text-muted">
              Cremation has become a popular option for many people because it can be
              more flexible as to where and when you hold a service. You can have a
              traditional funeral service before a cremation or a memorial service at
              any time with or without the urn present.
            </p>
          </Col>
          <Col md="4">
            <img
              src="/images/cremation.jpg"
              alt="Cremation"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
