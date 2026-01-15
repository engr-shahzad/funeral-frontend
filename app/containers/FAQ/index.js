import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Why have a Funeral?',
    answer: `Funerals fill an important role for those mourning the loss of a loved one. By providing surviving family and friends with an atmosphere of care and support in which to share thoughts and feelings about death, funerals are the first step in the healing process. It is the traditional way to recognize the finality of death. Funerals are recognized rituals for the living to show their respect for the dead and to help survivors begin the grieving process.

You can have a full funeral service even for those choosing cremation. Planning a personalized ceremony or service will help begin the healing process. Overcoming the pain is never easy, but a meaningful funeral or tribute will help.`
  },
  {
    question: 'What does a Funeral Director do?',
    answer: `• Pick up the deceased and transport the body to the funeral home (anytime day or night)
• Notify proper authorities, family and/or relatives
• Arrange and prepare death certificates
• Provide certified copies of death certificates for insurance and benefit processing
• Work with the insurance agent, Social Security or Veterans Administration to ensure that necessary paperwork is filed for receipt of benefits
• Prepare and submit obituary to the newspapers of your choice
• Bathe and embalm the deceased body, if necessary
• Prepare the body for viewing including dressing and cosmetizing
• Assist the family with funeral arrangements and purchase of casket, urn, burial vault and cemetery plot
• Schedule the opening and closing of the grave with cemetery personnel, if a burial is to be performed
• Coordinate with clergy if a funeral or memorial service is to be held
• Arrange a police escort and transportation to the funeral and/or cemetery for the family
• Order funeral sprays and other flower arrangements as the family wishes
• Provide Aftercare, or grief assistance, to the bereaved`
  },
  {
    question: 'What do I do when a death occurs?',
    answer: `The funeral home will help coordinate arrangements with the cemetery.

• Bring the following information to complete the State vital statistic requirements: Birth Date, Birthplace, Father's Name, Mother's Name, Social Security Number, Veteran's Discharge or Claim Number, Education, Marital Status.
• Contact your clergy. Decide on time and place of funeral or memorial service. This can be done at the funeral home.
• The funeral home will assist you in determining the number of copies of the death certificates you will be needing and can order them for you.
• Make a list of immediate family, close friends and employer or business colleagues. Notify each by phone.
• Decide on appropriate memorial to which gifts may be made (church, hospice, library, charity or school).
• Gather obituary information you want to include such as age, place of birth, cause of death, occupation, college degrees, memberships held, military service, outstanding work, list of survivors in immediate family. Include time and place of services. The funeral home will normally write article and submit to newspapers (newspaper will accept picture and they will be returned intact).
• Arrange for members of family or close friends to take turns answering door or phone, keeping careful record of calls. If Social Security checks are automatic deposit, notify the bank of the death.`
  },
  {
    question: 'When I call, will someone come right away?',
    answer: `If you request immediate assistance, yes. If the family wishes to spend a short time with the deceased to say good-bye, that’s perfectly acceptable. Your funeral director will come when your time is right.`
  },
  {
    question: 'Should I choose Burial or Cremation?',
    answer: `Burial in a casket is the most common method of disposing of remains in the United States, although entombment also occurs. Cremation is increasingly selected because it can be less expensive and allows for the memorial service to be held at a more convenient time in the future when relatives and friends can come together.

A funeral service followed by cremation need not be any different from a funeral service followed by a burial. Usually, cremated remains are placed in urn before being committed to a final resting place. The urn may be buried, placed in an indoor or outdoor mausoleum or columbarium, or interred in a special urn garden that many cemeteries provide for cremated remains. The remains may also be scattered, according to state law.`
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
    question: 'Does a dead body have to be embalmed, according to law?',
    answer: `The Federal Trade Commission says, "Except in certain special cases, embalming is not required by law. Embalming may be necessary, however, if you select certain funeral arrangements, such as a funeral with viewing. If you do not want embalming, you usually have the right to choose an arrangement that does not require you to pay for it, such as direct cremation or immediate burial."`
  },
  {
    question: 'Why are funerals so expensive?',
    answer: `When compared to other major life events like births and weddings, funerals are not expensive. A wedding costs at least three times as much; but because it is a happy event, wedding costs are rarely criticized. A funeral home is a 24-hour, labor-intensive business, with extensive facilities (viewing rooms, chapels, limousines, hearses, etc.), these expenses must be factored into the cost of a funeral.

Additionally, the cost of a funeral includes not only merchandise, like caskets, but the services of a funeral director in making arrangements; filing appropriate forms; dealing with doctors, ministers, florists, newspapers and others; and seeing to all the necessary details. Funeral directors look upon their profession as a service, but it is also a business. Like any business, funeral homes must make a profit to exist.`
  },
  {
    question: 'Do I have to make different funeral arrangements if I choose cremation?',
    answer: `It really depends entirely on how you wish to commemorate a life. One of the advantages of cremation is that it provides you with increased flexibility when you make your funeral and cemetery arrangements. You might, for example, choose to have a funeral service before the cremation; a memorial service at the time of cremation or after the cremation with the urn present; or a committal service at the final disposition of cremated remains. Funeral or memorial services can be held in a place of worship, a funeral home or in a crematory chapel.`
  },
  {
    question: 'What can be done with the cremated remains?',
    answer: `With cremation, your options are numerous. The cremains can be interred in a cemetery plot, i.e., earth burial, retained by a family member, usually in an urn, scattered on private property, or at a place that was significant to the deceased. (It would always be advisable to check for local regulations regarding scattering in a public place-your funeral director can help you with this.)

Today, there are many different types of memorial options from which to choose. Memorialization is a time-honored tradition that has been practiced for centuries. A memorial serves as a tribute to a life lived and provides a focal point for remembrance, as well as a record for future generations. The type of memorial you choose is a personal decision.`
  },
  {
    question: 'What is memorialization for a cremation?',
    answer: `You might choose ground burial of the urn. If so, you may usually choose either a bronze memorial or monument. Cremation niches in columbariums are also available at many cemeteries. They offer the beauty of a mausoleum setting with the benefits of above ground placement of remains. Many cemeteries also offer scattering gardens. This area of a cemetery offers the peacefulness of a serene garden where family and friends can come and reflect.`
  },
  {
    question: 'Can we scatter the cremated remains?',
    answer: `If you wish to have your ashes scattered somewhere, it is important to discuss your wishes to be scattered ahead of time with the person or persons who will actually have to do the cremation ashes scattering ceremony, as they might want to let your funeral professional assist in the scattering ceremony. Funeral directors can also be very helpful in creating a meaningful and personal ash scattering ceremony that they will customize to fit your families specific desires. The services can be as formal or informal as you like. Scattering services can also be public or private. Again, it is advisable to check for local regulations regarding scattering in a public place-your funeral director can help you with this.`
  },
  {
    question: 'If I am cremated, can I be buried with my spouse even if he or she was in a casket?',
    answer: `Yes — Depending upon the cemetery's policy, you may be able to save a grave space by having the cremains buried on top of the casketed remains of your spouse, or utilize the space provided next to him/her. Many cemeteries allow for multiple cremated remains to be interred in a single grave space.`
  },
  {
    question: 'What do I need to know about income tax when I lose a spouse?',
    answer: `Uncertainty about income tax issues can add to the stress experienced from the death of a spouse. You should meet with your family attorney and/or tax advisor as soon as possible to review your particular tax and estate circumstances. Bring a detailed list of your questions to the meeting. If you do not have an attorney or tax advisor, call the IRS toll-free at 800-829-1040 for answers to specific tax questions.`
  },
  {
    question: 'Is there financial help if I need it?',
    answer: `There are a number of options available, including:

• Determine if the deceased person qualifies for any entitlements. Check with the Social Security Administration, the Department of Veterans Affairs, and with your State Fund. Many people are entitled to get financial assistance with their funeral costs from these agencies if they qualify.
• Review all insurance policies the deceased person has, including life insurance. Some life insurance policies have coverage clauses for funeral related costs.
• Find local charities providing financial help for funeral expenses. Search for non profit organizations and for churches in your area.
• Talk to your funeral director about cremation options - these can be much less expensive depending on your choices.`
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
  <div
                className="why-hero"
                style={{
                  backgroundImage:
                    "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FAQ Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <p  style={{ fontFamily: 'Oswald', lineHeight: 1.8, fontSize: '18px', fontWeight: '300' }}>
            Click on the questions below to reveal each respective answer.
          </p>

          {faqs.map((item, index) => (
            <div key={index} className="border rounded">
              <button
                className="w-full text-left px-4 py-3 bg-teal-600 text-white font-oswald font-semibold flex justify-between items-center"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                {item.question}
                <span>{openIndex === index ? '-' : '+'}</span>
              </button>

              {openIndex === index && (
                <div className="px-4 py-4 bg-white text-gray-700 font-oswald leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Side Image */}
        <div className="hidden lg:block">
          <img
            src="	https://s3.amazonaws.com/CFSV2/stockimages/444478-general8.jpg"
            alt="Documents"
            className="rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}
