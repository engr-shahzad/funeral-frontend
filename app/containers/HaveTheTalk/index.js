import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function HaveTheTalk() {
  return (
    <div className="have-the-talk-page">

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
             <h1>Pre-Plan</h1>
           </div>
            <div className="why-subnav">
             <div className="subnav-inner">
               <Link to="/pre-arrangements">Pre-Plan</Link>  |{' '}
                 <Link to="/prearrangements-form" >Pre-Arrangements Form</Link> |{' '}
                <span className="active">Have The Talk of a Lifetime</span>
             </div>
           </div>

    

      {/* INTRO + VIDEO */}
      <Container className="pb-5">
        <Row>
          <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>Meaningful memorialization of a loved one’s passing can transform, heal, and comfort us. It highlights our loved ones’ sacrifices, reminds us of the things that they value, and inspires us with their life stories.</p>
        </Row>
        <Row style={{ marginTop: '2rem', marginRight: '1rem' }}>
          <Col md="7">
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              Meaningful memorialization of a loved one’s passing can transform,
              heal, and comfort us. It highlights our loved ones’ sacrifices,
              reminds us of the things that they value, and inspires us with their
              life stories.
            </p>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
             Have the Talk of a Lifetime, a program created by The Funeral and Memorial Information Council, was designed to help families have meaningful conversations about the things that matter most in their lives. These discussions can give important insights to the people they left behind — insights that can be used to honor and remember the lives of their loved ones.
            </p>
          </Col>

          <Col md="5">
            <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/-9_Ef7Cx-OE"
              title="Have the Talk of a Lifetime"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          </Col>
        </Row>
      </Container>

      <hr />

      {/* FAQ SECTION */}
      <Container className="py-5">
        <Row>
          <Col md="6">
            <h4 style={{ fontFamily: "Oswald"  }}>
              Why is having the talk of a lifetime important?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
             Although we might have daily conversations with our loved ones, the most meaningful and deep ones don’t always happen. Having this kind of conversation can make a huge difference — it can help us see our loved ones in a different and more positive light, it can teach us valuable lessons, it can give us a clearer picture of the things they love, it can bring us closer together, and it can help us reaffirm to them how much we love them.
            </p>

            <h4
              style={{
                fontFamily: "Oswald" ,
                marginTop: '2rem'
              }}
            >
              Who should have the talk?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
              We shouldn’t really wait for a special moment to start having these kinds of talks. We can do it anytime and anywhere, when we and our loved ones are comfortable — at home while we’re having meals together,out for a walk, gathered as a family, or playing games.

We could also sometimes start with visual prompts, like a photo or an entire photo album, a memento, or a souvenir. We can open up about past experiences while we’re at memorable place, such as  a church, a favorite restaurant, or an old park. These can be great ways to start a story.
            </p>
          </Col>

          <Col md="6">
            <h4 style={{ fontFamily: "Oswald" }}>
              How do we start the talk?
            </h4>
            <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300'}}>
             We could have the talk of a lifetime with anyone we value, cherish, and love. It could be our grandparents, our parents, our siblings, our uncles and aunts, our cousins, our spouse, our children, our grandparents, or our friends. It also doesn’t have to be done only when we feel we are or someone we love is at the end of their life. We’ll never really know what the future holds, so let us take the opportunities we still have with them while we still can.
            </p>
           

            <p
              style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px' , fontWeight: '300', marginTop: '3rem' }}
            >
              May we always treasure every moment of our lives and have meaningful conversations with the ones we love. 
            </p>

            <Button color="success" className="mt-3">
              Download Brochure
            </Button>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
