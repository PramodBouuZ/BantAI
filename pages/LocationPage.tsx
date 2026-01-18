
import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { MapPin } from 'lucide-react';

const LocationPage: React.FC = () => {
  const { city, state } = useParams<{ city?: string; state?: string }>();

  const locationName = city ? city.charAt(0).toUpperCase() + city.slice(1) : state.charAt(0).toUpperCase() + state.slice(1);
  const isCity = !!city;

  const seoTitle = isCity
    ? `IT & Software Solutions in ${locationName} | Verified Vendors – BantConfirm`
    : `Best IT Services in ${locationName} | Verified Vendors – BantConfirm`;

  const seoDesc = isCity
    ? `Find verified software, telecom, and IT service providers in ${locationName}. Compare solutions and get best price quotes on BantConfirm.`
    : `Explore verified software and IT vendors across ${locationName}. Post your requirement and get matched with trusted providers on BantConfirm.`;

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO
        title={seoTitle}
        description={seoDesc}
      />

      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <MapPin size={40} className="text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {isCity ? `IT & Software Solutions in ${locationName}` : `IT Services in ${locationName}`}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {seoDesc}
          </p>
        </div>
      </div>

      {/* TODO: Add a component to list featured products or vendors for this location */}
      <div className="max-w-7xl mx-auto px-4 py-16">
         <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <h3 className="text-2xl font-bold text-slate-900">Content Coming Soon</h3>
            <p className="text-slate-500 mt-2">We are compiling the best IT solutions and vendors in {locationName}.</p>
         </div>
      </div>
    </div>
  );
};

export default LocationPage;
