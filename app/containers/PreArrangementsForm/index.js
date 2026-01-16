import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';

import { Link } from 'react-router-dom';

export default function PreArrangementsForm() {
  const [formData, setFormData] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Pre-Arrangement form submitted');
  };

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
        <h1>Pre-Arrangements Form</h1>
      </div>
       <div className="why-subnav">
        <div className="subnav-inner">
          <Link to="/prearrangements" >Pre-Plan</Link>  |{' '}
            <span className="active">Pre-Arrangements Form</span> |{' '}
            <Link to="/have-the-talk-of-a-lifetime">Have The Talk of a Lifetime</Link>
        </div>
      </div>
      <div>
        <Container className="py-5">
          <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>Use this form to provide us with as much or as little detail as you wish.  At a minimum, provide us with your name and telephone number and tell us how you'd like us to work with you on the remaining information using the options at the base of the form.</p>
        </Container>
      </div>

      <div style={{ background: '#e9f5f4', margin:'10px' }} className="py-5">
        <Container>
    

          <Form onSubmit={handleSubmit}>
            {/* Personal Info */}
            <h5 className="mb-3">Personal Information</h5>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label>Street</Label>
                  <Input name="street" onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md="4">
                <Label>City</Label>
                <Input name="city" onChange={handleChange} />
              </Col>
              <Col md="4">
                <Label>State / Province</Label>
                <Input name="state" onChange={handleChange} />
              </Col>
              <Col md="4">
                <Label>ZIP / Postcode</Label>
                <Input name="zip" onChange={handleChange} />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Label>Telephone</Label>
                <Input name="telephone" />
              </Col>
              <Col md="6">
                <Label>Email Address</Label>
                <Input name="email" type="email" />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Label>Date of Birth</Label>
                <Input type="date" name="dob" />
              </Col>
              <Col md="6">
                <Label>Place of Birth</Label>
                <Input name="birthPlace" />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Label>SSN #</Label>
                <Input name="ssn" />
              </Col>
            </Row>

            {/* Parents */}
            <h5 className="mt-4 mb-3">Parents</h5>
            <Row>
              <Col md="6">
                <Label>Father's Name</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Father's Place of Birth</Label>
                <Input />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <Label>Mother's Name</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Mother's Place of Birth</Label>
                <Input />
              </Col>
            </Row>

            {/* Marriage */}
            <h5 className="mt-4 mb-3">Marriage</h5>
            <Row>
              <Col md="6">
                <Label>Spouse's Name</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Spouse's Maiden Name</Label>
                <Input />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <Label>Place of Marriage</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Date of Marriage</Label>
                <Input type="date" />
              </Col>
            </Row>

            {/* Work / Education */}
            <h5 className="mt-4 mb-3">Work / Education History</h5>
            <Row>
              <Col md="6">
                <Label>Occupation</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Company Name</Label>
                <Input />
              </Col>
            </Row>

            {/* Military */}
            <h5 className="mt-4 mb-3">Military Record</h5>
            <Row>
              <Col md="6">
                <Label>Branch of Service</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Serial Number</Label>
                <Input />
              </Col>
            </Row>

            {/* Funeral Service */}
            <h5 className="mt-4 mb-3">Funeral Service Request</h5>
            <Row>
              <Col md="6">
                <Label>Place of Service</Label>
                <Input />
              </Col>
              <Col md="6">
                <Label>Place of Visitation</Label>
                <Input />
              </Col>
            </Row>

            {/* Disposition */}
            <h5 className="mt-4 mb-3">Disposition Request</h5>
            <Row>
              <Col md="6">
                <Label>I Prefer</Label>
                <Input type="select">
                  <option>Earth Burial</option>
                  <option>Cremation</option>
                </Input>
              </Col>
              <Col md="6">
                <Label>Cemetery</Label>
                <Input />
              </Col>
            </Row>

            {/* Summary */}
            <h5 className="mt-4 mb-3">Summary Details</h5>
            <FormGroup>
              <Label>Additional Instructions</Label>
              <Input type="textarea" rows="4" />
            </FormGroup>

            {/* Anti spam */}
            <FormGroup>
              <Label>Anti-Spam Security Question</Label>
              <p className="small text-muted">
                What is seven minus four?
              </p>
              <Input />
            </FormGroup>

            <div className="text-right">
              <button className="btn btn-success rounded-pill px-4">
                Submit Information
              </button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}
