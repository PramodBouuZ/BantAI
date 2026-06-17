import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CheckCircle2, Star, Server, MapPin, Building2, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const LocationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { cities, states, products } = useData();
  const navigate = useNavigate();

  const city = cities.find(c => c.slug === slug);
  const state = states.find(s => s.slug === slug);
  const location = city || state;

  if (!location) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-6xl font-bold text-slate-200 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Location Not Found</h3>
        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline mt-4">Go Home</button>
      </div>
    );
  }

  const isCity = !!city;
  const locationType = isCity ? 'City' : 'State';

  // Dynamic filtering based on location name in product descriptions or titles
  // In a production app, products would have a location field
  const featuredProducts = useMemo(() => {
    const matched = products.filter(p =>
      p.description.toLowerCase().includes(location.name.toLowerCase()) ||
      p.title.toLowerCase().includes(location.name.toLowerCase())
    );
    return matched.length > 0 ? matched : products.slice(0, 6);
  }, [products, location.name]);

  const handleEnquiry = () => {
    navigate(`/enquiry?location=${location.name}`);
  };

  const localBusinessSchema = isCity ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `BantConfirm ${location.name}`,
    "image": "https://bantconfirm.com/logo.png",
    "url": `https://bantconfirm.com/${location.slug}`,
    "telephone": "+91-9999999999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location.name,
      "addressRegion": isCity && state ? state.name : location.name,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.5355",
      "longitude": "77.3910"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  } : null;

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO
        title={`IT Services & Telecom Solutions in ${location.name}`}
        description={`Find verified IT vendors and telecom service providers in ${location.name}. Compare quotes for SIP Trunk, Cloud Telephony, CRM, and ERP in ${location.name}.`}
        keywords={`IT services ${location.name}, telecom providers ${location.name}, software companies ${location.name}`}
        type={isCity ? 'business.business' : 'website'}
        schemaMarkup={location.schemaMarkup || localBusinessSchema}
        {...location}
      />

      <div className="bg-slate-900 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 animate-fade-in">
           <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-600 p-2.5 rounded-xl">
               <MapPin size={24} />
             </div>
             <span className="text-blue-400 font-black uppercase tracking-widest text-sm">{locationType} Specific Solutions</span>
           </div>
           <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 tracking-tight">
             Best IT & Telecom Services in <span className="text-blue-500">{location.name}</span>
           </h1>
           <p className="text-slate-400 max-w-3xl mb-12 text-lg md:text-xl leading-relaxed">
             Empowering businesses in {location.name} with cutting-edge technology. Connect with verified local vendors for Cloud, Software, and Connectivity solutions.
           </p>
           <button onClick={handleEnquiry} className="bg-white text-slate-900 font-black text-lg px-10 py-5 rounded-2xl shadow-2xl hover:bg-blue-50 transition transform hover:-translate-y-1 flex items-center gap-3">
             Request Quotes in {location.name} <ArrowRight size={20} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                <Building2 className="text-blue-600" size={32} />
                Services Available in {location.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredProducts.map(product => (
                  <div key={product.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition">{product.title}</h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                    <Link to={`/products/${product.slug}`} className="text-blue-600 font-bold text-sm flex items-center gap-2">
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-blue-50 rounded-[3rem] p-12 border border-blue-100">
               <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose BantConfirm in {location.name}?</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { title: 'Local Expertise', text: 'Connect with vendors who understand the local business landscape.' },
                    { title: 'Verified Vendors', text: 'All partners in our network undergo rigorous BANT qualification.' },
                    { title: 'Best Pricing', text: 'Compare multiple quotes to get the most competitive rates.' },
                    { title: 'Fast Deployment', text: 'Dedicated support for quick implementation and setup.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="bg-white p-2 rounded-lg h-fit shadow-sm"><CheckCircle2 className="text-green-500" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 sticky top-28 shadow-2xl">
               <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/50">
                 <Phone size={32} />
               </div>
               <h3 className="text-2xl font-bold mb-4 leading-tight">Need help finding a vendor in {location.name}?</h3>
               <p className="text-slate-400 mb-10 leading-relaxed">Our AI-powered consultant can match you with the perfect service provider in minutes.</p>
               <button onClick={handleEnquiry} className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-900/20">
                 Start AI Consultation
               </button>
            </div>

            {isCity && state && (
               <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4">Other Cities in {state.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cities.filter(c => c.stateId === state.id && c.id !== city.id).map(c => (
                      <Link key={c.id} to={`/${c.slug}`} className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition">
                        {c.name}
                      </Link>
                    ))}
                  </div>
               </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;