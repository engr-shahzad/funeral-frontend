import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Hardcoded fallback — used only when DB has no faqItems
const DEFAULT_FAQS = [
  {
    question: 'Why have a Funeral?',
    answer: `Funerals fill an important role for those mourning the loss of a loved one. By providing surviving family and friends with an atmosphere of care and support in which to share thoughts and feelings about death, funerals are the first step in the healing process. It is the traditional way to recognize the finality of death. Funerals are recognized rituals for the living to show their respect for the dead and to help survivors begin the grieving process.\n\nYou can have a full funeral service even for those choosing cremation. Planning a personalized ceremony or service will help begin the healing process. Overcoming the pain is never easy, but a meaningful funeral or tribute will help.`
  },
  {
    question: 'What does a Funeral Director do?',
    answer: `• Pick up the deceased and transport the body to the funeral home (anytime day or night)\n• Notify proper authorities, family and/or relatives\n• Arrange and prepare death certificates\n• Provide certified copies of death certificates for insurance and benefit processing\n• Work with the insurance agent, Social Security or Veterans Administration to ensure that necessary paperwork is filed for receipt of benefits\n• Prepare and submit obituary to the newspapers of your choice\n• Bathe and embalm the deceased body, if necessary\n• Prepare the body for viewing including dressing and cosmetizing\n• Assist the family with funeral arrangements and purchase of casket, urn, burial vault and cemetery plot\n• Schedule the opening and closing of the grave with cemetery personnel, if a burial is to be performed\n• Coordinate with clergy if a funeral or memorial service is to be held\n• Arrange a police escort and transportation to the funeral and/or cemetery for the family\n• Order funeral sprays and other flower arrangements as the family wishes\n• Provide Aftercare, or grief assistance, to the bereaved`
  },
  {
    question: 'What do I do when a death occurs?',
    answer: `The funeral home will help coordinate arrangements with the cemetery.\n\n• Bring the following information: Birth Date, Birthplace, Father's Name, Mother's Name, Social Security Number, Veteran's Discharge Number, Education, Marital Status.\n• Contact your clergy. Decide on time and place of funeral or memorial service.\n• Gather obituary information and notify immediate family and close friends.`
  },
  {
    question: 'When I call, will someone come right away?',
    answer: `If you request immediate assistance, yes. If the family wishes to spend a short time with the deceased to say good-bye, that's perfectly acceptable. Your funeral director will come when your time is right.`
  },
  {
    question: 'Should I choose Burial or Cremation?',
    answer: `Burial in a casket is the most common method of disposing of remains in the United States, although entombment also occurs. Cremation is increasingly selected because it can be less expensive and allows for the memorial service to be held at a more convenient time in the future when relatives and friends can come together.`
  },
  {
    question: 'Why have a public viewing?',
    answer: `Viewing is a part of many cultural and ethnic traditions. Many grief specialists believe that viewing aids the grief process by helping the bereaved recognize the reality of death. Viewing is encouraged for children, as long as the process is explained and the activity is voluntary.`
  },
  {
    question: 'What is the purpose of embalming?',
    answer: `Embalming sanitizes and preserves the body. Embalming makes it possible to lengthen the time between death and the final disposition, allowing family members time to arrange and participate in the type of service most comforting to them.`
  },
  {
    question: 'Why are funerals so expensive?',
    answer: `When compared to other major life events like births and weddings, funerals are not expensive. A funeral home is a 24-hour, labor-intensive business with extensive facilities (viewing rooms, chapels, limousines, hearses, etc.). The cost of a funeral includes not only merchandise but the services of a funeral director in making arrangements, filing appropriate forms, and seeing to all the necessary details.`
  },
  {
    question: 'Is there financial help if I need it?',
    answer: `There are a number of options available:\n\n• Determine if the deceased qualifies for any entitlements from Social Security Administration, Department of Veterans Affairs, or State Fund.\n• Review all insurance policies including life insurance.\n• Find local charities providing financial help for funeral expenses.\n• Talk to your funeral director about cremation options — these can be much less expensive depending on your choices.`
  }
];

export default function FAQ({ serverSideData }) {
  const [openIndex, setOpenIndex] = useState(null);

  const ssrData  = serverSideData || (typeof window !== 'undefined' ? window.__SSR_DATA__ : {});
  // Use DB faqItems when available, fall back to hardcoded defaults
  const faqItems = (ssrData && ssrData.faqItems && ssrData.faqItems.length > 0)
    ? ssrData.faqItems
    : DEFAULT_FAQS;
  const sections = (ssrData && ssrData.sections) || [];

  return (
    <div>
      <div
        className="why-hero"
        style={{
          backgroundImage: "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>F.A.Q.</h1>
      </div>

      <div className="why-subnav">
        <div className="subnav-inner">
          <Link to="/when-death-occurs">When Death Occurs</Link> |{' '}
          <Link to="/grief-support">Grief Support</Link> |{' '}
          <Link to="/funeral-etiquette">Funeral Etiquette</Link> |{' '}
          <Link to="/social-security">Social Security Benefits</Link> |{' '}
          <span className="active">F.A.Q.</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FAQ Accordion — DB-driven */}
        <div className="lg:col-span-2 space-y-4">
          <p style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
            Click on the questions below to reveal each respective answer.
          </p>

          {faqItems.map((item, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <div style={{ background: '#379078' }}>
                <button
                  className="w-full text-left px-4 py-3 text-white font-oswald font-semibold flex justify-between items-center"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  {item.question}
                  <span>{openIndex === index ? '-' : '+'}</span>
                </button>
              </div>
              {openIndex === index && (
                <div className="px-4 py-4 bg-white text-gray-700 font-oswald leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side Image */}
        <div className="hidden lg:block">
          <img
            src="https://s3.amazonaws.com/CFSV2/stockimages/444478-general8.jpg"
            alt="Documents"
            className="rounded shadow"
          />
        </div>
      </div>

      {/* Custom sections added via admin */}
      {sections.length > 0 && sections.filter(s => s.enabled).map((s, i) => <PageSection key={i} section={s} />)}
    </div>
  );
}

function PageSection({ section: s }) {
  const padding = s.paddingSize === 'large' ? '100px 0' : s.paddingSize === 'small' ? '20px 0' : '60px 0';
  const style = {
    background: s.layout === 'imageBg' && s.backgroundImage
      ? `linear-gradient(rgba(0,0,0,${s.overlayOpacity || 0}),rgba(0,0,0,${s.overlayOpacity || 0})), url(${s.backgroundImage}) center/cover`
      : s.backgroundColor || '#fff',
    color: s.layout === 'imageBg' ? '#fff' : (s.textColor || '#333'),
    padding,
    marginTop:    s.marginTop    ? `${s.marginTop}px`    : undefined,
    marginBottom: s.marginBottom ? `${s.marginBottom}px` : undefined,
    textAlign:    s.contentAlignment || 'left',
  };
  const Heading = s.headingSize || 'h2';
  const content = (
    <div>
      {s.label   && <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>{s.label}</p>}
      {s.heading && <Heading style={{ marginBottom: '16px' }}>{s.heading}</Heading>}
      {s.text    && <div dangerouslySetInnerHTML={{ __html: s.text }} />}
      {s.ctaText && s.ctaLink && (
        <a href={s.ctaLink} style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', background: '#00a097', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          {s.ctaText}
        </a>
      )}
    </div>
  );
  if (s.layout === 'imageLeft' || s.layout === 'imageRight') {
    return (
      <div style={{ ...style, padding: undefined }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', padding, gap: '32px', alignItems: 'center', flexDirection: s.layout === 'imageLeft' ? 'row' : 'row-reverse' }}>
          {s.image && <img src={s.image} alt="" style={{ width: '40%', minWidth: '200px', borderRadius: '4px' }} />}
          <div style={{ flex: 1 }}>{content}</div>
        </div>
      </div>
    );
  }
  return <div style={style}><div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>{content}</div></div>;
}
