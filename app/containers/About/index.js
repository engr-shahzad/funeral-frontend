import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import './About.scss';

export default function AboutUs() {
  const tealColor = '#4a6b6b';

  return (
    <div className="about-us-page">
      {/* Hero Section - Matches #block-strip */}
       <div
        className="why-hero"
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>About Us</h1>
      </div>
    <div className="why-subnav">
            <div className="subnav-inner">
              <span className="active">About Us</span> |{' '}
              <Link to="/our-staff">Our Staff</Link> |{' '}
              <Link to="/contact-us">Contact Us</Link> |{' '}
              <Link to="/why-choose-us" >Why Choose Us</Link> |{' '}
              <Link to="/testimonials">Testimonials</Link>
            </div>
          </div>
        <div className="why-content">
                {/* LEFT COLUMN */}
                <div className="why-main">
                 <p>
                  The caring and experienced professionals at West River Funeral Directors LLC are here to support you through this difficult time. We offer a range of personalized services to suit your family’s wishes and requirements. You can count on us to help you plan a personal, lasting tribute to your loved one. And we’ll carefully guide you through the many decisions that must be made during this challenging time.</p>
                  <p>

You are welcome to call us at any time of the day, any day of the week, for immediate assistance. Or, visit our funeral home in person at your convenience. We also provide a wealth of information here on our web site so you can learn more from the privacy of your own home.
                 </p>
                  
                </div>
        
            <aside className="sidebar">
                           <img
                             src=" https://s3.amazonaws.com/CFSV2/stockimages/987238-Funeral-FS-600x450-26.jpg"
                             alt="Peaceful scene"
                           />
                 
                         
                          
                           
                         </aside>
              </div>

    </div>
  );
}