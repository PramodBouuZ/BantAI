import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  CheckCircle2, ArrowRight, Zap, Star, Server, Phone, Wifi, Database, 
  Shield, Globe, ChevronLeft, Calendar, Building2, Clock, MapPin, 
  UserCheck, Award, CreditCard, Info
} from 'lucide-react';
import SEO from '../components/SEO';
import NotFound from '../components/NotFound';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <Server size={32} className="text-blue-500" />;
    case 'cloud': return <Phone size={32} className="text-purple-500" />;
    case 'wifi': return <Wifi size={32} className="text-green-500" />;
    case 'phone': return <Phone size={32} className="text-orange-500" />;
    case 'database': return <Database size={32} className="text-indigo-500" />;
    case 'shield': return <Shield size={32} className="text-slate-500" />;
    default: return <Globe size={32} className="text-gray-500" />;
  }
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // The param in URL is still named 'id' in App.tsx
  const { products } = useData();
  const navigate = useNavigate();

  // Find product by slug OR by ID for backward compatibility
  const product = products.find(p => p.slug === id || p.id === id);

  // If a product is not found, render the NotFound component for a consistent user experience
  if (!product) {
    return <NotFound />;
  }

  // Fallback Vendor Data (Used if admin hasn't specified one)
  const vendorInfo = {
    name: product.vendorName || (product.category === 'Telecom' ? 'Airtel Business Solutions' : 'TechIndia Systems Pvt Ltd'),
    verifiedSince: '2021',
    responseTime: '< 2 hours',
    rating: product.rating || 4.9,
    location: 'Noida, Uttar Pradesh',
    badge: product.vendorName ? 'Certified Partner' : 'Gold Partner'
  };

  const seoTitle = `${product.title} Pricing, Features & Reviews | BantConfirm India`;
  const seoDesc = `Explore ${product.title} on BantConfirm. Pricing starts at ${product.priceRange}. Compare features, view vendor details, and book a free demo today.`;

  const handleAction = (intent: string) => {
    navigate(`/enquiry?product=${product.id}&intent=${intent}`);
  };

  // Use dynamic technical specs if provided, else show defaults
  const specs = (product.technicalSpecs && product.technicalSpecs.length > 0) 
    ? product.technicalSpecs 
    : [
      { label: 'Deployment', value: 'Cloud, On-Premise, or Hybrid' },
      { label: 'Support', value: '24/7 Dedicated Account Manager' },
      { label: 'Compliance', value: 'ISO 27001, GDPR, SOC2 Ready' },
      { label: 'Integrations', value: 'REST API, Zapier, Webhooks' },
      { label: 'User Access', value: 'Multi-level Role Based Control (RBAC)' }
    ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={`${product.title}, ${product.category} vendor, IT hardware Noida, ${product.title} price India`}
      />

      {/* Header / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-slate-400 hover:text-blue-600 font-bold transition-all mb-8"
        >
          <div className="bg-white p-2 rounded-xl shadow-sm mr-3 group-hover:bg-blue-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Back to Marketplace
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Pane */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Visuals & Intro */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="relative h-80 md:h-[450px] overflow-hidden group">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  {getIcon(product.icon)}
                </div>
              )}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                <div className="bg-blue-600 w-2 h-2 rounded-full animate-pulse"></div>
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Currently Available</span>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                  <Star size={18} className="text-yellow-500 fill-current mr-2" />
                  <span className="text-sm font-black text-slate-800">{product.rating} / 5.0</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">{product.title}</h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-10">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Benefits</h3>
                  <ul className="space-y-4">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="bg-white p-1 rounded-lg mr-4 shadow-sm text-green-500 shrink-0">
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="font-bold text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pricing Packages</h3>
                  <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
                    <div className="text-sm font-bold opacity-80 mb-2">Estimated Starting At</div>
                    <div className="text-3xl font-black mb-6">{product.priceRange}</div>
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-2 rounded-xl backdrop-blur-sm">
                      <CreditCard size={14} /> GST Compliant Billing Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor Information Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-1">
                  <Building2 className="text-blue-600" /> Vendor Information
                </h2>
                <p className="text-slate-400 font-medium">Connect directly with certified technology providers</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl border border-green-100 font-black text-xs uppercase tracking-wider">
                <Award size={18} /> {vendorInfo.badge}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</p>
                <p className="font-black text-slate-800 text-lg">{vendorInfo.name}</p>
                <div className="flex items-center gap-1.5 mt-2 text-blue-600 font-bold text-xs">
                  <UserCheck size={14} /> Verified Since {vendorInfo.verifiedSince}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Location</p>
                <p className="font-black text-slate-800 text-lg">{vendorInfo.location}</p>
                <div className="flex items-center gap-1.5 mt-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                  <MapPin size={14} /> Serviceable Area: PAN India
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Response Time</p>
                <p className="font-black text-slate-800 text-lg">{vendorInfo.responseTime}</p>
                <div className="flex items-center gap-1.5 mt-2 text-yellow-600 font-bold text-xs uppercase tracking-tighter">
                  <Clock size={14} /> High Response Priority
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
             <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <Info className="text-indigo-600" /> Technical Specifications
             </h2>
             <div className="overflow-hidden rounded-2xl border border-slate-100">
                <table className="w-full text-left text-sm">
                   <tbody className="divide-y divide-slate-100">
                      {specs.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="bg-slate-50 p-4 font-black text-slate-500 uppercase tracking-widest w-1/3">{spec.label}</td>
                          <td className="p-4 font-bold text-slate-700">{spec.value}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 h-fit sticky top-28 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
             
             <h3 className="text-2xl font-black mb-2 relative z-10">Start Your Journey</h3>
             <p className="text-slate-400 font-medium mb-8 relative z-10">Select your preferred next step for {product.title}</p>
             
             <div className="space-y-4 relative z-10">
                <button 
                  onClick={() => handleAction('book')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-lg transition-all transform hover:-translate-y-1 shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                >
                  <CreditCard size={22} /> Book Now
                </button>
                <button 
                  onClick={() => handleAction('demo')}
                  className="w-full bg-white text-slate-900 hover:bg-slate-50 py-5 rounded-[1.5rem] font-black text-lg transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3"
                >
                  <Calendar size={22} /> Schedule Demo
                </button>
                <button 
                  onClick={() => handleAction('consult')}
                  className="w-full bg-slate-800 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-700 transition flex items-center justify-center gap-3"
                >
                  <Globe size={22} /> Talk to Expert
                </button>
             </div>

             <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified BANT Analysis</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
               <Zap size={18} className="text-yellow-500" /> Why use BantConfirm?
             </h4>
             <ul className="space-y-4">
                {[
                  'AI-qualified technical matching',
                  '100% verified legal documentation',
                  'Escrow protected payments',
                  'Direct vendor negotiation'
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-500">
                    <div className="bg-green-50 text-green-600 p-1 rounded-lg">
                      <CheckCircle2 size={14} />
                    </div>
                    {text}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;