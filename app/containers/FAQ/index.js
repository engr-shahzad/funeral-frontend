import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What do I do when a death occurs?',
    answer: `When a death occurs, contact us immediately. We are available 24 hours a day to assist you and guide you through the next steps.`
  },
  {
    question: 'When I call, will someone come right away?',
    answer: `Yes. Our staff is available at all times and will respond promptly to assist you.`
  },
  {
    question: 'Should I choose Burial or Cremation?',
    answer: `The choice between burial and cremation is a personal decision based on your beliefs, traditions, and preferences.`
  },
  {
    question: 'Why have a public viewing?',
    answer: `A public viewing allows family and friends to pay their respects and begin the healing process.`
  },
  {
    question: 'What is the purpose of embalming?',
    answer: `Embalming helps preserve the body for viewing and funeral services.`
  },
  {
    question: 'Does a body have to be embalmed according to law?',
    answer: `In most cases, embalming is not required by law unless specific circumstances apply.`
  },
  {
    question: 'Why are funerals so expensive?',
    answer: `Funeral costs reflect professional services, facilities, transportation, and merchandise.`
  },
  {
    question: 'Do I need different arrangements for cremation?',
    answer: `Cremation allows for many flexible service options depending on family wishes.`
  },
  {
    question: 'What can be done with cremated remains?',
    answer: `Cremated remains may be buried, scattered, or kept in an urn according to your preferences.`
  },
  {
    question: 'Is financial help available?',
    answer: `There may be assistance available through veterans benefits, Social Security, or community programs.`
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {/* Hero Section */}
        <div
          className="relative h-80 bg-cover flex items-center justify-center"
          style={{
              backgroundImage: `url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')`,
              backgroundPosition: 'center 60%',
              backgroundSize: '110%'
            }}
        >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(74, 107, 107, 0.55)'
          }}
        />


        <div className="relative z-10 text-center">
          <h1 className="font-playfair text-[50px] leading-[39.6px] font-normal text-white mb-4">
          FAQs
        </h1>
      </div>
    </div>

      {/* Sub Navigation */}
      <div className="text-center py-6">
        <p className="font-oswald text-sm text-teal-600">
          <Link to="/faq" className="font-semibold">When Death Occurs</Link>
          {' | '}
          <Link to="/grief-support">Grief Support</Link>
          {' | '}
          <Link to="/funeral-etiquette">Funeral Etiquette</Link>
          {' | '}
          <Link to="/social-security">Social Security Benefits</Link>
          {' | '}
          <span className="font-bold">F.A.Q.</span>
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FAQ Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <p className="font-oswald text-gray-700 mb-4">
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
            src="https://images.pexels.com/photos/4057756/pexels-photo-4057756.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Documents"
            className="rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}
