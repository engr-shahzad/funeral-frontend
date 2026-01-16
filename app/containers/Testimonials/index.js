import { Link } from 'react-router-dom';
import React from 'react';
import './Testimonials.scss';
export default function Testimonials() {
const testimonials = [
  {
    name: 'Lonney and Stacey Brown',
    text: 'Dean was incredibly helpful and compassionate during the loss of our loved one, Vickie Jean. He was so accommodating, answering all our questions, and was a blessing to us during this difficult time. \n\nMrs. Lonney Brown\nDecember 6, 2025',
    date: 'December 12, 2025',
  },
  {
    name: 'Kris Adams & Family',
    text: 'We are incredibly grateful to Dean for his compassion, professionalism and attention to detail during such a difficult time. From the moment we contacted him he was kind, respectful and accommodating to all of our needs. He guided us through every step of the process with care and patience, making sure everything was handled. Thank you Dean for making a hard situation a little easier to bear. \n\nI would highly recommend Dean at West River Funeral Directors.',
    date: 'July 22, 2025',
  },
  {
    name: 'Jessie Clifton',
    text: 'Dean was very kind and compassionate with my sisters passing . He was available 24/7 and kept us informed of the steps to take in the process . Dean made us feel like we were working with a friend rather than a funeral director.\nI would highly recommend Dean at West River to anyone looking for a funeral director.',
    date: 'June 30, 2025',
  },
  {
    name: 'Cheryl Gray and Family',
    text: 'Dean was very knowledgeable and available to help from the first time we spoke. He did a wonderful job taking care of our loved one and making arrangements. The whole family appreciates him.\n\nJo Beth was very easy to work with and did a wonderful job on the slide show and the Trifold Memorial Pamphlet.\n\nThank you to West River Funeral Directors. We highly recommend them if you need assistance with the loss of a loved one.',
    date: 'May 31, 2025',
  },
  {
    name: 'Lonnie Giedd',
    text: "I was treated more like A friend than customer. Dean handled all details with compassion and professionalism. After our first meeting I knew I had made the right choice to handle the affairs of my wife's passing. They get my highest recomendation.",
    date: 'March 19, 2025',
  },
  {
    name: 'Alicia Thompson',
    text: 'My loved one had passed away young and u expected. I was so lost and had never dealt with this type of situation before. Dean was so patient, compassionate and very helpful through the whole process. He went above and beyond in leading and assisting me. I would not go anywhere else and would 100 percent recommend them to anyone.',
    date: 'January 28, 2025',
  },
  {
    name: 'Dennis and Lori Berg',
    text: "What a great help Dean was to us from the moment we spoke. He is kind and sincere and understood everything we were looking for when Mom passed. We won't need to look any further for any other future services. He is top notch and we are very grateful for his help and guidance. Thank you Dean.",
    date: 'November 19, 2024',
  },
  {
    name: 'Robert Henry',
    text: "Dean was the best ! He was on top of everything. He made a difficilt time a little bit better. He did everthing he said he would.. Dean is very professional and I don't think you would find a better funeral director anywhere..",
    date: 'November 19, 2024',
  },
  {
    name: 'Michelle Morrin',
    text: 'Dean did a great job. No matter how many times I called he was always patient and kind. He is very professional and went above and beyond what I expected. I live out of state and expected that to be a problem, but he made this difficult time easier. I would recommend using West River Funeral Directors.',
    date: 'November 19, 2024',
  },
  {
    name: 'Robert Munyon',
    text: 'Dean was very compassionate and provided wonderful support during this difficult time. I was fortunate to work with Dean while being out of state.',
    date: 'November 8, 2024',
  },
  {
    name: 'DeAnna Paulson',
    text: "Dean was very professional during my time of need. I couldn't find a better funeral home than west river funeral director's . My husband Dave passed away and he wanted to be cremated and most of the funeral home's l spoke too would not work with me. But Dean was very understanding and helped me through it all. I would highly recommend this funeral home to anyone in their time of need. Thank You for the good service's you provided",
    date: 'August 30, 2024',
  },
  {
    name: 'Dawn Smart',
    text: 'Dean took the time to walk me through everything that needed to be done. He was very caring & understanding! A request of cremating dad’s cowboy hat with him was no issue at all. Dean went above & beyond to file for a spousal support from the military, that I didn’t know existed, for my mom. It was a very comforting experience.',
    date: 'August 7, 2024',
  },
  {
    name: 'Cinnamon Greenberg',
    text: 'Dean was wonderful. I started with a different funeral home and they were giving me the run around. They did not do anything electrically so we were having issues with paperwork. I called Dean and it was a totally different experience. He helped me with every step and was more than willing to answer any questions I had. We were able to get all the paper work done in less then 2 days where with the other place we had been struggling for over a week. I cannot recommend West River Funeral Directors enough.',
    date: 'August 5, 2024',
  },
  {
    name: 'Michael Colleran',
    text: 'Dean was straightforward and compassionate in his care of my sister There were no surprises He delivered everything as he promised \nI do not hesitate using his servicesc',
    date: 'June 18, 2024',
  },
  {
    name: 'Audrey Lorius',
    text: 'Dean at the West River Funeral Directors was just awesome. He helped us with every aspect of the cremation, walking us through the process of purchasing urns. He was very kind and caring and we felt so comfortable working with him. Very professional, yet understanding. We were totally satisfied with his help. The prices for cremation were reasonable and he worked to help us with them. We would rate West River Funeral Directors with a 10 and suggest to all who are in need to go with them. Thank you Dean.',
    date: 'May 9, 2024',
  },
  {
    name: 'Audrey Lorius',
    text: "We couldn't have been happier with West River Funeral Directors. We received prompt and professional care with our loved one who passed. Dean was quick to answer the phone and always answered our many questions we had for him. He helped us with all of our cremation concerns and the urns which we ordered. We were allowed to see our loved one and he did everything possible to make that happen. He went above and beyond in helping us with everything. I highly recommend West River Funeral Directors in your time of need.",
    date: 'May 8, 2024',
  },
  {
    name: 'Linda Nelsen',
    text: 'When my brother died unexpectedly, a friend recommended West River Funeral Directors and I’m so glad she did. Dean took care of my brother with compassion. He answered all of our questions quickly & with professionalism. We are very satisfied & would definitely recommend him.',
    date: 'March 19, 2024',
  },
  {
    name: 'Leslie & tom Newell',
    text: "We live in central Illinois, when we received word that my brother had passed in his apartment in Rapid City SD. we weren't sure what to do we had a funeral director in Illinois get us info about West River Funeral Directors. Dean Moncur was so nice and easy to talk to, He helped us that Friday evening with all the paperwork to get things moving. When it came to cleaning out the apartment, he made arrangements to get it cleaned out and videoed while they were doing it so we could see what was there and say keep or dispose of it. He helped make a difficult situation much easier to Handle. Thank you Dean so much.",
    date: 'September 17, 2023',
  },
  {
    name: 'Kim Hofer',
    text: 'Dean was phenomenal to work with in setting arrangements up when my Dad Len Hofer passed away. He is intuitive to the person he is working with, caring and on top of things. He knew my Dad from rodeoing, so when I told him what Dad had said he wanted, he was quick to guide our family in the choices we had to make. My Dad wanted two funerals, one where they lived currently and up at the ranch where we all grew up. He was on top of everything and made this happen flawlessly. Thank You Dean. You are a great person.',
    date: 'June 2, 2023',
  },
  {
    name: 'Dana “Cavemom” Nordquist',
    text: 'Dean was so caring and down to earth. My husband passed unexpectedly in an accident. Our family was in need of a gentle caring individual. My husband was alumni of SDSU, a redhead agronomist. Just like Dean. Dean is a caretaker of land, animals, and people alike. Just what we needed. And he would be fit for even a Coyote 😉😂🧡💜',
    date: 'June 1, 2023',
  },
  {
    name: 'Karen Massee',
    text: 'Dean made such a tragic event livable by answering questions, editing obituaries, and making great suggestions. Thank you for taking care of our beautiful boy.',
    date: 'January 27, 2023',
  },
  {
    name: 'Anita Roberts',
    text: 'West River Funeral Directors made a daunting week so much easier. From start to finish Dean was compassionate and professional. He took care of my brother with care and dignity. He knew just what to do and handled it all flawlessly. I most certainly would recommend this company to take care of final needs.',
    date: 'January 7, 2023',
  },
  {
    name: 'Lori Stahl',
    text: "West River Funeral Directors definitely deserves a 10 star review. From the moment I called Dean at 6:30AM on the day my son unexpectedly passed away to after the funeral and burial, Dean went above and beyond to make sure everything was perfect. Dean handled every question and challenges we faced with such professionalism. He left no stone unturned and I am grateful I chose him to take care of my son and all the arrangements. His staff truly went above and beyond as well. My son's funeral was absolutely perfect and I give all the credit to West River Funeral Directors.",
    date: 'August 29, 2022',
  },
];
  return (
    <div>
      {/* Hero Section - Matches #block-strip */}
       <div
        className="why-hero"
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>Testimonials</h1>
      </div>
    <div className="why-subnav">
            <div className="subnav-inner">
              <Link to="/about-us">About Us</Link> |{' '}
              <Link to="/our-staff">Our Staff</Link> |{' '}
              <Link to="/contact-us">Contact Us</Link> |{' '}
              <Link to="/why-choose-us" >Why Choose Us</Link> |{' '}
              <span className="active">Testimonials</span>
            </div>
          </div>
      <div className="why-content">
        {/* LEFT COLUMN */}
        <div className="why-main">
          <h2 className="contact">Your Feedback</h2>
          <p>We are always interested in hearing from the families that we serve.  Please take a moment to let us know how well we served you in your time of need. We very much appreciate your feedback.</p>
          <button>Click to enter your testimonials</button>
         
        </div>

        {/* SIDEBAR */}
         <aside className="sidebar">
                          <h3>See Our Google Reviews</h3>
          <img src='	https://s3.amazonaws.com/CFSV2/siteimages/wvr/794341-WestRiver-Reviews.png'/>
          </aside>
    
      </div>
      <div className='testimonials'> 
        {testimonials.map((t, i) => (
            <div
            className='main-block'
              key={i}
              style={{
               
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Stars */}
              <div style={{ color: '#f4b400', marginBottom: '.5rem' }}>
                ★★★★★
              </div>

              {/* Review Text */}
              <p style={{ whiteSpace: 'pre-line' }}>{t.text}</p>

              {/* Footer */}
              <div
                style={{
                  borderTop: '1px solid #e5e7eb',
                  marginTop: '1rem',
                  paddingTop: '.75rem',
                }}
              >
                <strong>{t.name}</strong>
                <div>{t.date}</div>
              </div>
            </div>
          ))}
          </div>
    </div>
  );
}