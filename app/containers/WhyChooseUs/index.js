import React from 'react';
import { Link } from 'react-router-dom';
import './WhyChooseUs.scss';

export default function WhyChooseUs() {
  const services = [
     {
      title: 'Online Memorials',
      description:
        'We can create a customized, online memorial for you to share with family and friends. The memorial includes the obituary and any photographs you wish to provide. It will serve as a place for visitors to post condolences, share memories, upload photos, and light candles in honor of your loved one.',
    },
    {
      title: 'Tribute Videos',
      description:
        'We can produce a personal tribute video that can be played at the service and online. Simply provide us with the photographs you want to include and we will transform them into a video celebration of your treasured memories. DVDs or digital files of the video are also available.',
    },
    {
      title: 'Funeral Fund Donations',
      description:
        'We realize the expense of a funeral can be a burden. We provide the option for friends and family to make monetary donations to help cover funeral costs. These gifts can be made easily and securely online through our website, and are paid directly to the funeral home on behalf of the donor.',
    },
    {
      title: 'Ordering Flowers',
      description:
        'We make it easy for friends and family to send flowers to your home or service to honor your loved one. We have partnered with local florists to offer the convenience of ordering directly from the obituary page of our website. You can also use this feature to select the flowers you would like at the service. This is a secure way to choose beautiful arrangements from the privacy and comfort of your home.',
    },
    {
      title: 'Sharing Service Details',
      description:
        'We reduce the stress of contacting those who need the details of the service for your loved one. We post the dates and times of the service as part of the online memorial on our website. You can then either share the memorial on your Facebook or Twitter page or copy the details from the site into an email or text. Both options give you the peace of mind that you have provided the necessary information to those who need it.',
    },
    {
      title: 'Daily Grief Support Emails',
      description:
        'We offer one year of free daily grief support emails to the families we serve. It is important to us that we continue to comfort our families through the difficult days that the first year of grieving can bring.',
    },
  ];

  return (
    <div className="why-choose-us">
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
        <h1>Why Choose Us</h1>
      </div>

      {/* ================= SUB NAV ================= */}
      <div className="why-subnav">
        <div className="subnav-inner">
          <Link to="/about-us" >About Us</Link> |{' '}
          <Link to="/our-staff">Our Staff</Link> |{' '}
          <Link to="/contact-us">Contact Us</Link> |{' '}
          <span className="active">Why Choose Us</span> |{' '}
          <Link to="/testimonials">Testimonials</Link>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="why-content">
        {/* LEFT COLUMN */}
        <div className="why-main">
          <p className="intro">
            At West River Funeral Directors LLC, we take great pride in caring for our families, and will work tirelessly to provide you with a beautiful, lasting tribute to your loved one. In addition to the services we offer, you will receive an online memorial that you can share with family and friends. While honoring your loved one is our top priority, we also want to help you through this difficult time. We have a wide range of resources to support you not only today, but in the weeks and months to come.
          </p>
          <p className='contact'>A sampling of our offerings is listed below. Please call us at <span>1-605-787-3940 </span> so we can help you through this process.</p>

          {services.map((service, index) => (
            <div className="service" key={index}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="why-sidebar">
          <img
            src="https://s3.amazonaws.com/CFSV2/stockimages/282230-soaring.png"
            alt="Peaceful scene"
          />

          <h3>More Resources</h3>
          <ul>
            <li>
              <Link to="/services">Our Services</Link>
            </li>
            <li>
              <Link to="/grief-support">Grief Support</Link>
            </li>
            <li>
              <Link to="/prearrangements-form">Pre-Planning Information</Link>
            </li>
            <li>
              <Link to="/send-flowers">Send Flowers</Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
