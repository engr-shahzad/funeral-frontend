import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Location() {
  const tealColor = '#4a6b6b';
  
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    email: '',
    comments: '',
    security: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verification for the security question (13 - 2 = 11)
    if (formData.security !== '11') {
      alert('Please answer the security question correctly.');
      return;
    }
    alert('Thank you. Your information has been received.');
    setFormData({
      name: '',
      telephone: '',
      email: '',
      comments: '',
      security: '',
    });
  };

  return (
    <div className="contact-us-page">
   <div
        className="why-hero"
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>Location</h1>
      </div>



      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs/Navigation Strip */}
       
       <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-16">
          {/* Left Column: Form */}
          <div style={{  padding: '20px', borderRadius: '8px' }}>
           
              <div className="h-96 rounded shadow-md overflow-hidden border border-gray-200">
               <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2843.8!2d-103.2!3d44.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDA0JzQ4LjAiTiAxMDPCsDEyJzAwLjAiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="West River Funeral Directors Location"
              />
              </div>
          </div>

          {/* Right Column: Map and Send Flowers */}
          <div className="space-y-10">
            <div>
              <div className="border rounded shadow-sm bg-white ">
                {/* Panel Heading */}
                <div
                    style={{
                    backgroundColor: '#426965 ', // panel-success feel
                    padding: '10px 15px',
                    borderBottom: '1px solid #d6e9c6',
                    marginTop: '15px'
                    }}
                >
                    <h3
                    style={{
                        margin: 0,
                        fontFamily: 'Oswald, sans-serif',
                        fontSize: '20px',
                        fontWeight: 600,
                    color: 'white',
                    }}
                    >
                    Address
                    </h3>
                </div>

                {/* Panel Body */}
                <div
                    style={{
                    padding: '20px',
                    textAlign: 'center',
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '16px',
                    fontWeight: 300,
                    color: 'black',
                    }}
                >
                    <strong>West River Funeral Directors LLC</strong>
                    <br />
              

                    420 East Saint Patrick St, Ste 106
                    <br />
                    

                    Rapid City, SD 57701
                    <br />
                  

                    <span>Tel: </span>
                    <a href="tel:+16057873940" style={{color:'#379078'}}>1-605-787-3940</a>

                    <hr style={{ margin: '20px 0' }} />

                    <p style={{ margin: 0 }}>
                    <Link to="/contact-us" style={{color:'#379078'}}>
                        <i
                        className="fa fa-envelope"
                        aria-hidden="true"
                        style={{ paddingRight: '5px',
                        color: '#379078'
                         }}
                        />
                        CONTACT US
                    </Link>
                    </p>
                     <hr style={{ margin: '20px 0' }} />
                </div>
                </div>

            </div>

            {/* Send Flowers Tile - Matches #smart3826246200927 */}
            <Link to="/send-flowers" style={{marginTop:'10px'}} className="block relative h-40 rounded shadow-lg overflow-hidden group hover:no-underline">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('https://s3.amazonaws.com/CFSV2/stockimages/66025-floral-13.jpg')` }}
              />
               <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
          }}
        />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 
                  className="text-white text-4xl font-bold italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Send Flowers
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}