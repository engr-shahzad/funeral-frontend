import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const VeteransOverview = () => {
  return (
    <div style={{ fontFamily: "Oswald, sans-serif", color: "#333" }}>
  

      {/* ================= HERO ================= */}

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
              <h1>Veterans Overview</h1>
            </div>
          <div className="why-subnav">
                  <div className="subnav-inner">
                    <span className="active">Veterans Overview </span> |{' '}
                    <Link to="/veterans-headstones"> Veterans Headstones </Link> |{' '}
                    <Link to="/veterans-burial-flags">Veterans Burial Flags</Link> 
                  </div>
                </div>

    
  

      {/* CONTENT */}
      <Container className="pb-5">
       
            <hr/>
        <Row>
          {/* LEFT COLUMN */}
          <Col md="7" >
           
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
             The basic Military Funeral Honors (MFH) ceremony consists of the folding and presentation of the United States flag to the veterans' family and the playing of Taps. The ceremony is performed by a funeral honors detail consisting of at least two members of the Armed Forces.</p>
 <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
The Funeral Honors rendered to you or your veteran will be determined by the status of the veteran.  The type of Funeral Honors may be Full Military Honors, 7 Person Detail or a Standard Honors Team Detail.
            </p>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              At least one of the funeral honors detail will be from the Armed Force in which the deceased veteran served.  Taps may be played by a bugler or, if a bugler is not available, by using a quality recorded version. Military Funeral Honor Teams may act as Pall Bearers if requested by the veteran/family.
            </p>
            

             <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "Oswald",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               Who is eligible for Military Funeral Honors?
              </h5>
              <ul  style={{  listStyleType: 'disc',
    paddingLeft: '1.5rem', fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '200' }}>
                <li>
                  Military members on active duty or in the Selected Reserve.
                </li>
                <li>
                  Former military members who served on active duty and departed under conditions other than dishonorable.
                </li>
                <li>
                  Former military members who completed at least one term of enlistment or period of initial obligated service in the Selected Reserve and departed under conditions other than dishonorable.
                </li>
                <li>
                  Former military members discharged from the Selected Reserve due to a disability incurred or aggravated in the line of duty.
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "Oswald",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               Who is not eligible for Military Funeral Honors?
              </h5>
              <ul  style={{  listStyleType: 'disc',
    paddingLeft: '1.5rem', fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '200' }}>
                <li>
                  Any person separated from the Armed Forces under dishonorable conditions or whose character of service results in a bar to veteran's benefits. 
                </li>
                <li>
                  Any person who was ordered to report to an induction station, but was not actually inducted into military service. 
                </li>
                <li>
                  Any person discharged from the Selected Reserve prior to completing one term of enlistment or period of initial obligated service for reasons other than a disability incurred or aggravated in the line of duty.
                </li>
                <li>
                  Any person convicted of a Federal or State capital crime sentenced to death or life imprisonment.
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily:  "Oswald",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               How do I establish veteran eligibility?
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                The preferred method is the DD Form 214, Certificate of Release or Discharge from Active Duty.  If the DD Form 214 is not available, any discharge document showing other than dishonorable service can be used.  The DD Form 214 may be obtained by filling out a Standard Form 180 and sending it to:
              </p>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
              National Personnel Records Center (NPRC)
                <br />
                9700 Page Blvd.
                <br />
                St. Louis, MO 63132
              </p>
              <p  style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>The Standard Form 180 may be obtained from the National Records Center or via the following web site: <a href="http://www.archives.gov/research/order/standard-form-180.pdf">http://www.archives.gov/research/order/standard-form-180.pdf</a></p>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Oswald",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               Is anyone else eligible to receive funeral honors?</h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
               Yes. Members of the Commissioned Officer Corps of the Public Health Service (PHS) and National Oceanic and Atmospheric Administration (NOAA), as members of a Uniformed Service, are also eligible to receive funeral honors. <br/>

              For NOAA personnel, eligibility is established using NOAA Form 56-16, Report of Transfer or Discharge. If the family does not have a copy of the NOAA Form 56-16, it may by obtained by contacting the Chief, Officer Services Division, NOAA Commissioned Personnel Center at (301) 713-7715. or by writing:
             <br/>
             National Oceanic and Atmospheric Administration <br/>
            Commissioned Personnel Center <br/>
            Chief, Officer Services Division (CPC1) <br/>
            1315 East-West Highway, Room 12100 <br/>
            Silver Spring, Maryland 20910<br/>

            For PHS personnel, funeral honors eligibility is established using PHS Form 1867, Statement of Service (equivalent to the DD Form 214).  If the family does not have a copy of the Statement of Service, it may be obtained by contacting the Privacy Coordinator for the Commissioned Corps at (240) 453-6041 or writing:
            <br/>
            Division of Commissioned Personnel/HRS/PSC <br/>
            Attention: Privacy Act Coordinator <br/>
            5600 Fishers Lane <br/>
            4-36 <br/>
            Rockville, Maryland 20857
             
              </p>
            </div>
            
        
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="5">
            <img
              src="https://s3.amazonaws.com/CFSV2/stockimages/960069-veteran6.jpg"
              alt="Grief Support"
              className="img-fluid rounded mb-4"
            />

           
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default VeteransOverview;