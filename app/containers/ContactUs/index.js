import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
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
        <h1>Contact Us</h1>
      </div>
    <div className="why-subnav">
            <div className="subnav-inner">
              <Link to="/about-us">About Us</Link> |{' '}
              <Link to="/our-staff">Our Staff</Link> |{' '}
              <span className="active">Contact Us</span> |{' '}
              <Link to="/why-choose-us" >Why Choose Us</Link> |{' '}
              <Link to="/testimonials">Testimonials</Link>
            </div>
          </div>


      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs/Navigation Strip */}
       

        {/* Intro Text */}
        <p className="text-gray-700 text-center mb-10 mt-10 mx-auto text-lg leading-relaxed" style={{ fontFamily: 'Oswald, sans-serif', marginBottom: '10px', marginTop: '10px' }}>
          You are welcome to call us any time of the day, any day of the week, for immediate assistance. 
          Or, visit our funeral home in person at your convenience. If you prefer, you can also use 
          the form below to send us a message.
        </p>
         <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" , marginTop:'4px' , marginBottom: '4px'}} />

        {/* Address Block - Matches #smart266209908194 */}
        <div className="text-center mb-12 py-6 border-y border-gray-200" style={{ fontFamily: "'Oswald', sans-serif" }}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
            <h2
              className="text-xl font-bold uppercase"
              style={{ color: tealColor }}
            >
              West River Funeral Directors LLC
            </h2>

            <span className="text-gray-600 uppercase">
              420 East Saint Patrick St, Ste 106 | Rapid City, SD 57701
            </span>

            <span>
              <strong>Tel:</strong>{" "}
              <a href="tel:+16057873940" className="text-teal hover:underline">
                1-605-787-3940
              </a>
            </span>

            <span>
              <strong>Fax:</strong> 1-605-854-5202
            </span>

            <span>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:sdfuneralhome@gmail.com"
                className="text-teal hover:underline"
              >
                sdfuneralhome@gmail.com
              </a>
            </span>
          </div>

        </div>
         <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc", marginTop:'4px' , marginBottom: '10px' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column: Form */}
          <div style={{ background: 'rgba(0, 160, 151, 0.1)', padding: '20px', borderRadius: '8px' }}>
            <form onSubmit={handleSubmit} className="space-y-6 p-8  mt-10" style={{padding:'4px'}}>
            
              
              <div >
                <label className="block text-sm font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                  style={   { border: '1px solid #609892', borderRadius: '0px',
    background: 'rgba(255, 255, 255, 0.5)',marginTop: '.35em',
    marginBottom: '.35em'}}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>Telephone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                 style={   { border: '1px solid #609892', borderRadius: '0px',
    background: 'rgba(255, 255, 255, 0.5)',marginTop: '.35em',
    marginBottom: '.35em'}}
    />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                
                 style={   { border: '1px solid #609892', borderRadius: '0px',
    background: 'rgba(255, 255, 255, 0.5)',marginTop: '.35em',
    marginBottom: '.35em'}}
    />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>Comments or Questions *</label>
                <textarea
                  name="comments"
                  required
                  rows={5}
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                 style={   { border: '1px solid #609892', borderRadius: '0px',
    background: 'rgba(255, 255, 255, 0.5)',marginTop: '.35em',
    marginBottom: '.35em'}}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>Anti-Spam Security Question</label>
                <p className="text-sm italic mb-2 text-gray-600">
                  What is thirteen minus two?
                </p>
                <input
                  type="text"
                  name="security"
                  required
                  placeholder="(Enter numbers/digits, not words)"
                  value={formData.security}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 outline-none"
                 style={   { border: '1px solid #609892', borderRadius: '0px',
    background: 'rgba(255, 255, 255, 0.5)',marginTop: '.35em',
    marginBottom: '.35em'}}
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold uppercase transition-colors duration-200 rounded"
                  style={{ fontFamily: "'Oswald', sans-serif" ,
                        color: '#fff', backgroundColor: '#5cb85c', border: '2px solid',
    lineHeight: '1.2',    marginLeft: '10',    marginRight: '10', borderRadius: '25px',
                  }}
                >
                  Submit Information
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Map and Send Flowers */}
          <div className="space-y-10">
            <div>
              <h4 className="text-center text-lg font-bold uppercase mb-4 tracking-widest" style={{ color: tealColor, fontFamily: "'Oswald', sans-serif" }}>
                Our Location:
              </h4>
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