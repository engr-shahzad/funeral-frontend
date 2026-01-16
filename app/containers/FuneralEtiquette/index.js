import React from 'react';
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function FuneralEtiquette() {
  return (
    <div className="funeral-etiquette-page">

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
              <h1>Funeral Etiquette</h1>
            </div>
          <div className="why-subnav">
                  <div className="subnav-inner">
                    <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
                    <Link to="/grief-support">Grief Support</Link> |{' '}
                    <span className="active">Funeral Etiquette</span> |{' '}
                    <Link to="/social-security">Social Security Benefits</Link> |{' '}
                    <Link to="/faqs">F.A.Q.</Link>
                  </div>
                </div>

    
  

      {/* CONTENT */}
      <Container className="pb-5">
        <Row>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              When someone you know passes away, your first instinct is to offer encouragement, help, and support to those affected — but you may not be sure what to say or do. It's okay to feel this way.</p>
 <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
Does it matter what I wear? Can I bring the children? What should I say to the family of the deceased? When should I visit? West River Funeral Directors LLC offers guidance on the proper etiquette of visitations and funerals, so you'll feel more comfortable and prepared for attending services.
            </p>
            </Row>
            <hr/>
        <Row>
          {/* LEFT COLUMN */}
          <Col md="7" >
          

             <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                WHAT TO SAY
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
              It can be difficult to know what to say to the family of the deceased to express your sympathy. To begin, offer your condolences to the family. If you are comfortable, share a memory of the deceased. In this difficult time, sharing the joy of the deceased’s life can help comfort the bereaved. For example, “I was so sorry to hear of Mary’s passing.  She was always such a wonderful friend to me."
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                WHAT TO WEAR
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 , fontSize: '18px', fontWeight: '300'  }}>
             When attending a memorial service or funeral, dress in dark and subdued colors, such as dark blues, grays, browns, and black. Be sure to dress simply and conservatively. Men are encouraged to wear a jacket and tie paired with dress shoes, while women should choose either a dress or a suit. Any jewelry should be subtle and traditional. 
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                ARRIVING
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                When attending a funeral or a service, do your best to be on time. Try to enter the facility as quietly as possible. If there are no ushers present, remember that the first few rows of seats are usually for the immediate family and close friends. Acquaintances should appropriately seat themselves in the middle or towards the rear.


              </p>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                WHEN TO VISIT</h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                Immediately upon learning of a death, it is appropriate for family and close friends to go to the home of the bereaved to offer sympathy and support. This can be a very overwhelming time for a family. Offering to assist with child care, food preparation, receiving visitors, or service preparations can provide immense comfort during this difficult process.

The funeral home is the best place to visit the family to offer your condolences, as they are prepared for visitors at these services.

              </p>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               FLOWERS
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                Sending flowers is a wonderful way to express your sympathy to the family of the deceased, and can bring comfort in a difficult time. Flowers are a meaningful gift that can be enjoyed during and after the funeral service.

Floral arrangements and plants can be sent to the funeral home to be present at services, or sent to the home of the family directly.

              </p>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
                WHAT NOT TO SAY
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8 , fontSize: '18px', fontWeight: '300'  }}>
            Try not to give comments that minimize the loss, such as "It's probably for the best, because he was suffering too much," or "I've been in your shoes myself."  These will not provide comfort to the bereaved

Wait for the family to discuss the cause of death. Do not bring it up yourself.
              </p>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               KEEP THE LINE MOVING
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
               Visitations can be very emotional, especially when speaking with the family of the deceased. If there is a line to speak with the bereaved and view the casket, be conscious of keeping the line moving. After passing through the line, be sure to stand to the side to continue conversation, or allow the family member to continue to greet guests. The family will often be more available to speak following the conclusion of the service.

              </p>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               MOBILE PHONE USE</h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                Smart phones should be turned off or silenced completely during the service. Checking your phone is noticeable and is a distraction to those who are trying to pay their respects. If you must return a message or receive a call, exit the service quietly.
              </p>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               CHILDREN
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
                Allowing a child to attend a memorial or funeral service can help them say goodbye to a friend or loved one. It is important to not force a child to go, but instead encourage them to share in this tribute with the rest of the family. Before attending, help prepare them by explaining what they might see at the service.
              </p>
            </div>
             <div style={{ marginTop: '2rem' }}>
              <h5
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: '18px'
                }}
              >
               GIFTS
              </h5>
              <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300'  }}>
               This can be a very draining time for a family. The gift of food is a kind gesture that the family will deeply appreciate and help alleviate the stress of funeral planning and mourning.

Remembering children in the family is a thoughtful gesture, as this is often a difficult time for them as well. A small gift like a stuffed animal or a book is best.

Time is precious. Helping with household tasks ease the family's burden. Caring for pets, driving children to school, running errands, or helping around the house are wonderful ways to help the family.
              </p>
            </div>
          </Col>

          {/* RIGHT COLUMN */}
          <Col md="5">
            <img
              src="		https://s3.amazonaws.com/CFSV2/stockimages/513338-GatheredPeople.jpg"
              alt="Grief Support"
              className="img-fluid rounded mb-4"
            />

           
          </Col>
        </Row>
      </Container>

    </div>
  );
}
