import React from 'react';
import { Link } from 'react-router-dom';
import './SendFlowers.scss';


export default function SendFlowers() {
  
  return (
    <div className="why-choose-us">
      {/* ================= HERO ================= */}
      <div className='hero' style={{
        backgroundColor: 'white', fontColor: '#426965'}}>
        <h2>Send Flowers</h2>
        <p>Place your order with our local florists</p>
      </div>

     

      {/* ================= MAIN CONTENT ================= */}
      <div className="why-content">
        {/* LEFT COLUMN */}
        <div className="why-main">
          <p>Allow us to take care of your expression of sympathy by connecting with our local florists through our website.</p>
          <p></p>
          <ul>
            <li><span >Buy direct from our local area florist.</span><br/></li>
            <li><span >No need to enter our funeral home address, nor the service details - our order system already knows this.</span><br/></li>
            <li><span >Just pick out the flowers, add your message and pay online. Your order is immediately sent to our local flower shop.</span><br/></li>
            <li><span >We retain a copy of your order so we know that your flowers are on their way.</span><br/></li>
         </ul>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="why-sidebar">
         

          <h3>More Resources</h3>
          <ul>
            <li>
              <Link to="/our-services">Our Services</Link>
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
