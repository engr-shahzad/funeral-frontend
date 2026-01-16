import { Link } from 'react-router-dom';
import React from 'react';

export default function OurStaff() {
  const staffMembers = [
    {
      name: 'Dean Moncur',
      title: 'Owner/Licensed Funeral Director',
      image: 'https://d1rjyex4ui0ya6.cloudfront.net/staff/wvr/51222-Dean.jpg',
      bio: "Dean has deep family roots in western South Dakota. He grew up on his family's ranch in Harding County, and attended school in Belle Fourche, graduating from high school in 1984. He graduated from South Dakota State University in 1990, with Bachelor of Science degrees in Agronomy and Range Science. In 1991 Dean graduated from National American University with a degree in Business Administration. After working in the world of banking, Dean realized his true calling. His experience helping his mother at the assisted living center she operated, Prairie Hills Assisted Living, instilled in him a strong connection to helping those in need. This led him to acquire a degree in Mortuary Science from Arapahoe Community College in 2007. Dean started his apprenticeship at Osheim Catron Funeral Home in 2004 and began full time employment in 2008 to 2011. From 2011 to 2021 he managed a funeral home in Sturgis, SD. Dean had a vision, and started West River Funeral Directors in 2022, bringing with him over 18 years of experience as a funeral director. His strong western South Dakota values is the foundation for his vision of offering funeral services with honesty, compassion, and integrity; offering a complete funeral service in a time of need at consumer-friendly prices.",
      phone: '1-605-787-3940',
      email: 'dean@westriverfuneral.com',
      mission: "Our home owned, home grown approach is dedicated to honoring, sharing, and preserving the amazing and inspirational stories that are life. When we honor a loved one, we realize it is not a day in our lives, but it's their life in a day."
    },
    {
      name: 'Jo Beth Eisenbraun',
      title: 'Assistant',
      image: 'https://d1rjyex4ui0ya6.cloudfront.net/staff/wvr/64032-IMG3317.jpeg',
      bio: "Jo Beth was born and raised in western South Dakota. She grew up and attended school in Kadoka; graduating from high school in 1999. Attending college in Minnesota she missed South Dakota and returned graduating from National American University with a bachelors degree in accounting. After meeting Dean in 2016 she soon realized what it meant to help families in one of the most difficult times of their lives. Jo Beth has been Dean’s assistant since opening the doors to West River Funeral Directors in 2022. Coming from a small family herself being a part of a family funeral home was the perfect fit. With each family served her hopes are that she can brighten their darkest days. Jo Beth stays busy with her full time job as a school administrator, assisting at the funeral home and volunteering at numerous events. Most importantly she and Dean can be found hauling Lilly to rodeos. They also love being able to watch Hunter, Hudson and Wyatt rodeoing.",
      phone: '1-605-787-3940',
      email: '',
      mission: "Our family helping your family."
    },
  ];

  return (
    <div>
      {/* Hero Section using matching site background */}
    <div
        className="why-hero"
        style={{
          backgroundImage:
            "url('https://s3.amazonaws.com/CFSV2/stockimages/981952-floral-03.jpg')",
          backgroundSize: '110%',
          backgroundPosition: 'center',
        }}
      >
        <h1>Why Choose Us</h1>
      </div>
      <div className="why-subnav">
        <div className="subnav-inner">
          <Link to="/about-us" >About Us</Link> |{' '}
          <span className="active">Our Staff</span> |{' '}
          <Link to="/contact-us">Contact Us</Link> |{' '}
          <Link to="/why-choose-us">Why Choose Us</Link>|{' '}
          <Link to="/testimonials">Testimonials</Link>
        </div>
      </div>
      <div className="main-content">
              {/* LEFT COLUMN */}
              <div className="why-main">
                <p className="intro" style={{ fontFamily: 'Oswald, sans-serif', margin:'10px' }}>
                     Our staff is comprised of dedicated and licensed professionals with the experience to answer all your questions regarding our services. Please feel free to contact any of our staff members at any time.
                </p>
                 <div className="space-y-16" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {staffMembers.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-4">
                      <div className="md:col-span-1">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-auto object-cover rounded shadow-md border-4 border-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-1">
                          {member.name}
                        </h2>
                        <p className="text-md font-oswald font-semibold text-gray-600 mb-4 italic">
                          {member.title}
                        </p>
                        <p className="text-gray-700 font-oswald leading-relaxed mb-6 whitespace-pre-line">
                          {member.bio}
                        </p>
                        {member.mission && (
                          <div className="p-5 bg-gray-50 border-l-4 border-teal rounded">
                            <h3 className="font-playfair font-bold text-gray-900 mb-2 uppercase text-sm tracking-widest">
                              {index === 0 ? "Mission Statement" : "Values"}
                            </h3>
                            <p className="text-gray-700 font-oswald italic text-md leading-relaxed">
                              {member.mission}
                            </p>
                          </div>
                        )}
                        <div className="text-sm font-oswald mb-6">
                          <p className="text-gray-700">
                            <span className="font-semibold">Telephone:</span> <a href={`tel:${member.phone}`} className="text-teal hover:underline">{member.phone}</a>
                          </p>
                          {member.email && (
                            <p className="text-gray-700">
                              <span className="font-semibold">Email:</span> <a href={`mailto:${member.email}`} className="text-teal hover:underline">{member.email}</a>
                            </p>
                          )}
                        </div>

                        
                      </div>
                    </div>
                  ))}
                  </div>
              </div>
      
            
             
            </div>
    
    </div>
  );
}