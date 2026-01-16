import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function VeteransHeadstones() {
  return (
    <div className="when-death-occurs-page">

       <div
                   className="why-hero"
                   style={{
                     backgroundImage:
                       "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
                     backgroundSize: '110%',
                     backgroundPosition: 'center',
                   }}
                 >
                   <h1>Veterans Burial Flags</h1>
                 </div>
               <div className="why-subnav">
                       <div className="subnav-inner">
                        <Link to="/veterans">Veterans Overview </Link> |{' '}
                         <Link to="/veterans-headstones"> Veterans Headstones </Link> |{' '}
                          <span className="active">Veterans Burial Flags</span>
                       </div>
                     </div>

  <Container className="pb-5">
        
           
         <Row>
           {/* LEFT COLUMN */}
           <Col md="7" >
            
             <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              A United States flag is provided, at no cost, to drape the casket or accompany the urn of a deceased veteran who served honorably in the U. S. Armed Forces.  It is furnished to honor the memory of a veteran's military service to his or her country. VA will furnish a burial flag for memorialization for: </p>
               <ul  style={{  listStyleType: 'disc',
     paddingLeft: '1.5rem', fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '200' }}>
                 <li>
                   A veteran who served during wartime
                 </li>
                 <li>
                   A veteran who died on active duty after May 27, 1941
                 </li>
                 <li>
                  A veteran who served after January 31, 1955
                    </li>
                 <li>
                   A peacetime veteran who was discharged or released before June 27, 1950   </li>
                   <li>
                  Certain persons who served in the organized military forces of the Commonwealth of the Philippines while in service of the U.S. Armed Forces and who died on or after April 25, 1951
                    </li>
                 <li>
                   Certain former members of the Selected Reserves </li>
               </ul>
             
 
            
 
             <div style={{ marginTop: '2rem' }}>
               <h5
                 style={{
                   fontFamily: "Oswald",
                   fontWeight: 700,
                   fontSize: '18px'
                 }}
               >
                Who Is Eligible to Receive the Burial Flag?
               </h5>
               <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                Generally, the flag is given to the next-of-kin, as a keepsake, after its use during the funeral service. When there is no next-of-kin, VA will furnish the flag to a friend making request for it. For those VA national cemeteries with an Avenue of Flags, families of veterans buried in these national cemeteries may donate the burial flags of their loved ones to be flown on patriotic holidays.
 
  </p>
             </div>
 
             <div style={{ marginTop: '2rem' }}>
               <h5
                 style={{
                   fontFamily:  "Oswald",
                   fontWeight: 700,
                   fontSize: '18px'
                 }}
               >
               How Can You Apply?
               </h5>
               <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                You may apply for the flag by completing VA Form 27-2008, Application for United States Flag for Burial Purposes. You may get a flag at any VA regional office or U.S. Post Office. Generally, the funeral director will help you obtain the flag. </p>
                </div>
             
             <div style={{ marginTop: '2rem' }}>
               <h5
                 style={{
                   fontFamily: "'Oswald",
                   fontWeight: 700,
                   fontSize: '18px'
                 }}
               >
               Can a Burial Flag Be Replaced?</h5>
               <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
               The law allows us to issue one flag for a veteran's funeral. We cannot replace it if it is lost, destroyed, or stolen. However, some veterans' organizations or other community groups may be able to help you get another flag.
              
               </p>
             </div>
               <div style={{ marginTop: '2rem' }}>
               <h5
                 style={{
                   fontFamily: "'Oswald",
                   fontWeight: 700,
                   fontSize: '18px'
                 }}
               >
              How Should the Burial Flag Be Displayed?</h5>
               <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
               The proper way to display the flag depends upon whether the casket is open or closed. VA Form 27-2008 provides the correct method for displaying and folding the flag. The burial flag is not suitable for outside display because of its size and fabric. It is made of cotton and can easily be damaged by weather.
               </p>
             </div>
             <div style={{ marginTop: '2rem' }}>
               <h5
                 style={{
                   fontFamily: "'Oswald",
                   fontWeight: 700,
                   fontSize: '18px'
                 }}
               >
             For More Information Call Toll-Free at 1-800-827-1000</h5>
             </div>
       
           </Col>
 
           {/* RIGHT COLUMN */}
           <Col md="5">
             <img
               src="https://s3.amazonaws.com/CFSV2/stockimages/821717-military-659893640.jpg"
               alt="Grief Support"
               className="img-fluid rounded mb-4"
             />
 
            
           </Col>
         </Row>
       </Container>
      

    </div>
  );
}

