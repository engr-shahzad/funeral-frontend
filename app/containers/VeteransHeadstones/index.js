import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { CloudOff } from 'lucide-react';

export default function VeteransHeadstones() {
  return (
    <div className="when-death-occurs-page">

         {/* HERO */}
                  <div
                   className="why-hero"
                   style={{
                     backgroundImage:
                       "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
                     backgroundSize: '110%',
                     backgroundPosition: 'center',
                   }}
                 >
                   <h1>Veterans Headstones</h1>
                 </div>
               <div className="why-subnav">
                       <div className="subnav-inner">
                         <Link to="/veterans">Veterans Overview </Link> |{' '}
                         <span className="active"> Veterans Headstones </span> |{' '}
                         <Link to="/veterans-burial-flags">Veterans Burial Flags</Link> 
                       </div>
                     </div>
     

      {/* INTRO */}
     {/* CONTENT */}
           <Container className="pb-5">
            
                 <hr/>
             <Row>
               {/* LEFT COLUMN */}
               <Col md="7" >
                
                 <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
                 The Department of Veterans Affairs (VA) furnishes upon request, at no charge to the applicant, a Government headstone or marker for the unmarked grave of any deceased eligible veteran in any cemetery around the world, regardless of their date of death.   For eligible veterans that died on or after Nov. 1, 1990, VA may also provide a headstone or marker for graves that are already marked with a private headstone or marker. When the grave is already marked, applicants will have the option to apply for either a traditional headstone or marker, or a new device (available spring 2009).  <br/>
                 
                 Flat markers in granite, marble, and bronze and upright headstones in granite and marble are available. The style chosen must be consistent with existing monuments at the place of burial. Niche markers are also available to mark columbaria used for inurnment of cremated remains.
                <br/>
                When burial or memorialization is in a national cemetery, state veterans' cemetery, or military post/base cemetery, a headstone or marker will be ordered by the cemetery officials based on inscription information provided by the next of kin or authorized representative.
                <br/>
                Spouses and dependents are not eligible for a Government-furnished headstone or marker unless they are buried in a national cemetery, state veteran's cemetery, or military post/base cemetery.
                <br/>
                Note: There is no charge for the headstone or marker itself, however arrangements for placing it in a private cemetery are the applicant's responsibility and all setting fees are at private expense.
                <br/>
                <span style={{ color: '#379078' }}>Important Notice - New Law Concerning Eligibility for Headstones and Markers</span>
                 </p>
                 
     
           
               </Col>
     
               {/* RIGHT COLUMN */}
               <Col md="5">
                 <img
                   src="https://s3.amazonaws.com/CFSV2/stockimages/822130-veteran4.jpg"
                   alt="Grief Support"
                   className="img-fluid rounded mb-4"
                 />
     
                
               </Col>
             </Row>
           </Container>

    </div>
  );
}

/* Reusable section component */
function Section({ title, content }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h5
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}
      >
        {title}
      </h5>
      {content.map((text, index) => (
        <p
          key={index}
          style={{
            fontFamily: 'Oswald',
            lineHeight: 1.8,
            marginBottom: '0.8rem'
          }}
        >
          {text}
        </p>
      ))}
      <hr />
    </div>
  );
}
