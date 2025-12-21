
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Zap, TrendingUp, Users, Search, Filter, Star, Server, Phone, Wifi, Database, Globe, Building2, Briefcase, Megaphone, X, Scale } from 'lucide-react';
import { useData } from '../context/DataContext';
import { TESTIMONIALS } from '../services/mockData';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import SEO from '../components/SEO';
import { Product } from '../types';

interface HomeProps {
  isLoggedIn: boolean;
}

// Mini chart data for hero
const initialChartData = [
  { name: 'Mon', value: 40000 },
  { name: 'Tue', value: 30000 },
  { name: 'Wed', value: 50000 },
  { name: 'Thu', value: 27800 },
  { name: 'Fri', value: 68900 },
  { name: 'Sat', value: 83900 },
  { name: 'Sun', value: 104900 },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <Server size={20} />;
    case 'cloud': return <Phone size={20} />;
    case 'wifi': return <Wifi size={20} />;
    case 'phone': return <Phone size={20} />;
    case 'database': return <Database size={20} />;
    case 'shield': return <Shield size={20} />;
    default: return <Globe size={20} />;
  }
};

const ProductCard: React.FC<{ 
  product: Product, 
  onAction: (id?: string) => void,
  onCompare: (product: Product) => void,
  isSelected: boolean 
}> = ({ product, onAction, onCompare, isSelected }) => (
  <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <Server size={48} className="text-slate-300" />
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-indigo-600 shadow-sm">
             {getIcon(product.icon)}
          </div>
          <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
             <Star size={14} className="text-yellow-500 fill-current mr-1" />
             <span className="text-xs font-bold text-slate-800">{product.rating}</span>
          </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{product.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mb-5 bg-slate-50 p-3 rounded-xl">
           <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center">
             <Zap size={12} className="mr-1 text-yellow-500" /> Key Features
           </p>
           <ul className="space-y-1.5">
              {product.features.slice(0, 2).map((f: string, i: number) => (
                 <li key={i} className="flex items-start text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={13} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {f}
                 </li>
              ))}
           </ul>
        </div>

        <div className="mt-auto">
           <p className="text-lg font-bold text-slate-900 mb-4">{product.priceRange}</p>
           <div className="grid grid-cols-3 gap-2">
              <button onClick={() => onAction(product.id)} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg text-center">
                Book Now
              </button>
              <button onClick={() => onCompare(product)} className={`rounded-xl transition shadow-md flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`} title={isSelected ? 'Remove from compare' : 'Add to compare'}>
                <Scale size={18} />
              </button>
           </div>
           <button onClick={() => onAction()} className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg text-center">
             Consult Expert
           </button>
        </div>
      </div>
   </article>
);

const NewsTicker = () => {
  const [index, setIndex] = useState(0);
  const messages = [
    "📢 Post your Unused Leads and get up to 10% commission on your deals!",
    "🚀 India's #1 Marketplace for MSME IT Solutions.",
    "✅ GST Compliant Billing available for all vendors.",
    "💼 Over 1,250+ Verified Vendors ready to serve your business needs."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-indigo-900 text-white py-3 overflow-hidden relative" role="alert" aria-live="polite">
      <div className="max-w-7xl mx-auto px-4 text-center">
         <p key={index} className="text-sm md:text-base font-medium flex items-center justify-center animate-fade-in">
            <Megaphone size={16} className="mr-2 text-yellow-400" />
            {messages[index]}
         </p>
      </div>
      <div key={`timer-${index}`} className="absolute bottom-0 left-0 h-1 bg-yellow-400/50 transition-all duration-[5000ms] ease-linear w-full" style={{ animation: 'width 5s linear' }}></div>
      <style>{`@keyframes width { from { width: 0%; } to { width: 100%; } }`}</style>
    </div>
  );
};

const VendorTicker = () => {
  const { vendorLogos } = useData();
  
  if (vendorLogos.length === 0) return null;

  return (
    <div className="py-12 bg-white border-b border-gray-100 overflow-hidden relative group">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Our Trusted Marketplace Partners</p>
      </div>
      
      {/* Edge Fading Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-24 items-center w-max">
           {/* Duplicate array for seamless infinite loop */}
           {[...vendorLogos, ...vendorLogos, ...vendorLogos, ...vendorLogos].map((logo, i) => (
             <div key={`${logo.id}-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 group/logo">
               <img 
                 src={logo.logoUrl} 
                 alt={`${logo.name} logo`} 
                 loading="lazy" 
                 className="h-8 md:h-12 w-auto object-contain transition-transform group-hover/logo:scale-110" 
               />
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover/logo:opacity-100 transition-opacity">{logo.name}</span>
             </div>
           ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

const SEOFooterLinks = () => {
  return (
    <section className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 text-sm text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wider">Top Cities in India</h5>
            <ul className="space-y-1.5 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Software Company in Delhi</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">IT Services in Mumbai</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Cloud Telephony in Bangalore</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">CRM Vendors in Noida</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Leased Line in Gurgaon</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Web Development in Hyderabad</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Digital Marketing in Pune</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">IT Support in Chennai</Link></li>
            </ul>
          </div>
          <div>
             <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wider">Popular Searches</h5>
             <ul className="space-y-1.5 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Zoho CRM Price India</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Tata Leased Line Plans</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Salesforce Implementation Partner</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">IVR Service Provider Near Me</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Airtel Business Internet</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Custom Software Developer</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Toll Free Number India</Link></li>
            </ul>
          </div>
          <div>
             <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wider">IT Services Near Me</h5>
             <ul className="space-y-1.5 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Software Company Near Me</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Computer Networking Services Nearby</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Cybersecurity Consultants Nearby</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Bulk SMS Service Provider</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">App Development Agency</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Cloud Hosting Providers India</Link></li>
            </ul>
          </div>
          <div className="text-xs text-slate-400">
             <h5 className="font-bold text-slate-800 mb-3 uppercase tracking-wider">About BantConfirm</h5>
             <p className="mb-2">
               BantConfirm is India's premier B2B software and IT marketplace. We help MSMEs and Enterprises find verified vendors using our proprietary BANT methodology (Budget, Authority, Need, Timing).
             </p>
             <p>
               Whether you need a CRM in Delhi, a Leased Line in Mumbai, or Cloud Telephony in Bangalore, we connect you with the best providers near you.
             </p>
          </div>
        </div>
      </div>
    </section>
  )
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const { products, siteConfig, categories, toggleCompare, compareList } = useData();
  const [chartData, setChartData] = useState(initialChartData);
  const [activeLeads, setActiveLeads] = useState(247);
  const [dealsClosed, setDealsClosed] = useState(86032); 
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastVal = newData[newData.length - 1].value;
        const change = Math.random() > 0.5 ? 5000 : -3000;
        newData[newData.length - 1] = { ...newData[newData.length - 1], value: Math.max(20000, lastVal + change) };
        return newData;
      });
      if (Math.random() > 0.7) setActiveLeads(prev => prev + 1);
      if (Math.random() > 0.8) setDealsClosed(prev => prev + Math.floor(Math.random() * 500));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAuthAction = (productId?: string) => {
    const target = productId ? `/enquiry?product=${productId}` : '/enquiry';
    if (isLoggedIn) {
      navigate(target);
    } else {
      navigate('/login', { state: { from: { pathname: target } } });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredSoftware = products.filter(p => ['Software', 'Security', 'Infrastructure'].includes(p.category)).slice(0, 4);
  const featuredTelecom = products.filter(p => ['Telecom', 'Connectivity'].includes(p.category)).slice(0, 4);

  const features = [
    {
      title: "Fast-Track Procurement",
      desc: "Reduce your IT procurement cycle from months to days with our pre-verified vendor network.",
      icon: <Zap size={32} />,
      color: "blue",
      modalTitle: "Accelerate Your IT Buying Process",
      modalDesc: "Traditional procurement takes weeks of emails and calls. BantConfirm slashes this to 24-48 hours.",
      points: [
        "One-click RFP distribution to qualified vendors",
        "AI-matched proposals based on your specific needs",
        "Automated comparison matrix for faster decision making"
      ]
    },
    {
      title: "Transparent Pricing",
      desc: "Compare quotes transparently. No hidden fees. Best market rates guaranteed for MSMEs.",
      icon: <span className="text-3xl font-bold">₹</span>,
      color: "green",
      modalTitle: "Best Market Rates, Zero Hidden Fees",
      modalDesc: "We bring transparency to the opaque IT services market ensuring you never overpay.",
      points: [
        "Direct vendor quotes with no middleman markup",
        "Standardized rate cards for cloud and telecom services",
        "Historical pricing data to help you negotiate"
      ]
    },
    {
      title: "Verified Sellers Only",
      desc: "All vendors on BantConfirm are subjected to rigorous BANT and KYC verification processes.",
      icon: <Shield size={32} />,
      color: "purple",
      modalTitle: "Trust Built on Rigorous Verification",
      modalDesc: "We take the risk out of vendor selection with our proprietary 5-step verification process.",
      points: [
        "GST and Company Registration (MCA) verification",
        "Financial stability checks & turnover verification",
        "Past client reference calls & delivery track record"
      ]
    },
    {
      title: "Dedicated Support",
      desc: "Local support team based in Bangalore to assist with your specific enterprise requirements.",
      icon: <Briefcase size={32} />,
      color: "orange",
      modalTitle: "We Are Your Extended Procurement Team",
      modalDesc: "Technology buying is complex. Our experts guide you every step of the way.",
      points: [
        "Bangalore-based support team (English, Hindi, Kannada)",
        "Assistance with requirement drafting and technical scoping",
        "Post-purchase dispute resolution and SLA monitoring"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return { bg: 'bg-blue-600', shadow: 'shadow-blue-200', text: 'text-blue-600', check: 'text-blue-500' };
      case 'green': return { bg: 'bg-green-500', shadow: 'shadow-green-200', text: 'text-green-600', check: 'text-green-500' };
      case 'purple': return { bg: 'bg-purple-500', shadow: 'shadow-purple-200', text: 'text-purple-600', check: 'text-purple-500' };
      case 'orange': return { bg: 'bg-orange-500', shadow: 'shadow-orange-200', text: 'text-orange-600', check: 'text-orange-500' };
      default: return { bg: 'bg-blue-600', shadow: 'shadow-blue-200', text: 'text-blue-600', check: 'text-blue-500' };
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BantConfirm",
    "url": "https://bantconfirm.com",
    "logo": "https://bantconfirm.com/logo.png",
    "sameAs": [
      siteConfig.socialLinks.twitter,
      siteConfig.socialLinks.linkedin,
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.instagram
    ].filter(Boolean),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9999999999",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    }
  };

  const isProductSelected = (id: string) => compareList.some(p => p.id === id);

  return (
    <div className="overflow-hidden">
      <SEO 
        title={siteConfig.bannerTitle ? `${siteConfig.bannerTitle} MSMEs & Enterprises` : "BantConfirm - B2B Marketplace for Tata, Airtel, Zoho & IT Services"}
        description="India's trusted marketplace to buy Tata/Airtel Leased Lines, Zoho/Salesforce CRM, and Cloud Telephony (IVR, MyOperator). Verified software developers and digital agencies in Noida, Delhi, Mumbai."
        keywords="BantConfirm, Tata Teleservices, Airtel Business, Jio Lease Line, Zoho CRM, Salesforce, LeadSquared, Cloud Telephony, IVR, Auto Dialer, Software Developer India, Digital Marketing Agency Delhi, IT Company near me"
        schema={organizationSchema}
      />
      
      <NewsTicker />
      
      <section className="relative pt-20 pb-40 overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 -z-10 animate-gradient-xy bg-gradient-to-br from-blue-50 via-white to-blue-100 opacity-70"></div>
        <div className="absolute inset-0 -z-10 opacity-[0.4]" style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '30px 30px'
        }}></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up relative z-10">
          <div className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-md text-yellow-800 px-6 py-2.5 rounded-full text-base font-semibold mb-10 shadow-sm border border-yellow-200/50">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
            <span>Empowering Indian Businesses</span>
          </div>
          
          <h1 id="hero-title" className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            {siteConfig.bannerTitle || "The Premier IT Marketplace for"} <br />
            <span className="text-blue-600">MSMEs & Enterprises</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
            {siteConfig.bannerSubtitle || "Discover, Compare, and Buy Enterprise-grade IT, Software, and Telecom solutions."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link to="/products" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Find IT Solutions
            </Link>
            <button onClick={() => handleAuthAction()} className="px-10 py-5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border border-white/50 hover:border-gray-200 rounded-2xl font-bold text-xl shadow-sm transition-all">
              Post Business Requirement
            </button>
          </div>

          <div className="flex justify-center items-center space-x-8 md:space-x-12 text-base font-medium text-slate-500 flex-wrap gap-y-4">
            <div className="flex items-center space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <span className="text-lg">Optimized for MSMEs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase size={20} className="text-purple-500" />
              <span className="text-lg">Enterprise-Grade Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">GST Compliant Billing</span>
            </div>
          </div>

          <div className="mt-20 relative max-w-6xl mx-auto animate-slide-up-delay-1">
            <div className="absolute -top-10 -right-10 z-10 bg-yellow-400 text-white p-6 rounded-3xl shadow-2xl transform rotate-12 hidden md:block animate-[bounce_3s_infinite]">
               <span className="text-4xl">💰</span>
            </div>
            <div className="absolute -bottom-10 -left-10 z-10 bg-blue-600 text-white p-6 rounded-3xl shadow-2xl transform -rotate-12 hidden md:block">
               <TrendingUp size={48} />
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
               <div className="flex items-center justify-between mb-10">
                 <h3 className="font-bold text-2xl text-slate-800">Your Business Growth Dashboard</h3>
                 <span className="flex items-center text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Market Data
                 </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
                   <p className="text-base text-yellow-800 font-bold uppercase tracking-wider mb-2">Verified Vendors</p>
                   <p className="text-5xl font-bold text-slate-900 transition-all duration-300">1,250+</p>
                   <p className="text-sm text-green-600 mt-3 font-bold bg-white/50 inline-block px-2 py-1 rounded">PAN India Coverage</p>
                 </div>
                 <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden">
                   <p className="text-base text-blue-800 font-bold uppercase tracking-wider mb-2">Deals Closed</p>
                   <p className="text-5xl font-bold text-slate-900 transition-all duration-300">{formatINR(dealsClosed)}</p>
                   <p className="text-sm text-green-600 mt-3 font-bold bg-white/50 inline-block px-2 py-1 rounded">↑ 23% this month</p>
                 </div>
               </div>
               
               <div className="h-64 w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex justify-between items-end mb-4 px-2">
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Software Procurement Trends</p>
                     <p className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">Last 24h</p>
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}
                        formatter={(value) => formatINR(value as number)}
                      />
                      <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" isAnimationActive={true} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      </section>

      <VendorTicker />

      <section className="py-20 bg-slate-50 border-t border-gray-100" id="marketplace">
        <div className="max-w-7xl mx-auto px-4">
           <div className="mb-12">
               <h2 className="text-4xl font-bold text-slate-900">Explore IT & Telecom Solutions</h2>
               <p className="text-slate-500 mt-2 text-lg">Curated services for the Indian business ecosystem</p>
           </div>
           
           <div className="mb-8 max-w-3xl">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={22} className="text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search for CRM, VoIP, Cloud Hosting..." 
                    className="bg-transparent border-none outline-none w-full text-lg text-slate-700 placeholder-slate-400" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search for services"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                  )}
              </div>
           </div>

           <nav className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide mb-10">
               <button 
                 onClick={() => setSelectedCategory('All')}
                 className={`px-6 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition ${selectedCategory === 'All' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}
               >
                 All
               </button>
               {categories.map((cat) => (
                 <button key={cat} 
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-6 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}
                 >
                   {cat}
                 </button>
               ))}
               <button onClick={() => navigate('/products')} className="px-4 py-2.5 rounded-full bg-white text-slate-600 border border-gray-200 hover:bg-gray-50" aria-label="More Filters">
                 <Filter size={20} />
               </button>
           </nav>

           {(searchQuery || selectedCategory !== 'All') ? (
               <div className="min-h-[400px]">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                       {filteredProducts.length} Results Found
                     </h3>
                   </div>
                   
                   {filteredProducts.length > 0 ? (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {filteredProducts.map((product) => (
                             <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAction={handleAuthAction} 
                                onCompare={toggleCompare}
                                isSelected={isProductSelected(product.id)}
                             />
                          ))}
                       </div>
                   ) : (
                       <div className="text-center py-20">
                           <div className="text-6xl mb-4">🔍</div>
                           <h3 className="text-2xl font-bold text-slate-900">No services found</h3>
                           <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
                           <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-6 text-blue-600 font-bold hover:underline">Clear Filters</button>
                       </div>
                   )}
               </div>
           ) : (
             <>
               <div className="mb-16">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                       <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3"><Server size={24} /></span>
                       Enterprise Software
                     </h3>
                     <Link to="/products" className="text-blue-600 font-bold hover:underline flex items-center">View All <ArrowRight size={18} className="ml-1" /></Link>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {featuredSoftware.map((product) => (
                         <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAction={handleAuthAction} 
                            onCompare={toggleCompare}
                            isSelected={isProductSelected(product.id)}
                         />
                      ))}
                   </div>
               </div>

               <div className="mb-12">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                       <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3"><Phone size={24} /></span>
                       Telecom & Connectivity
                     </h3>
                     <Link to="/products" className="text-blue-600 font-bold hover:underline flex items-center">View All <ArrowRight size={18} className="ml-1" /></Link>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {featuredTelecom.map((product) => (
                         <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAction={handleAuthAction} 
                            onCompare={toggleCompare}
                            isSelected={isProductSelected(product.id)}
                         />
                      ))}
                   </div>
               </div>
             </>
           )}
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center max-w-4xl mx-auto mb-20">
             <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">Why Choose Us</span>
             <h2 className="text-5xl font-bold text-slate-900 mt-6 mb-6">Built for Indian Business Needs</h2>
             <p className="text-xl text-slate-600 leading-relaxed">We understand the unique challenges of MSMEs and Enterprises in India.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {features.map((f, i) => {
                const colors = getColorClasses(f.color);
                return (
                  <div key={i} className="bg-slate-50 p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col items-start h-full">
                       <div className={`${colors.bg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg ${colors.shadow}`}>
                         {f.icon}
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                       <p className="text-lg text-slate-500 mb-8 leading-relaxed flex-grow">{f.desc}</p>
                       <button 
                         onClick={() => setActiveFeature(f)} 
                         className={`text-blue-600 font-bold hover:text-blue-700 flex items-center text-lg group bg-transparent border-none p-0 cursor-pointer`}
                       >
                         Learn more <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                       </button>
                  </div>
                );
             })}
           </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">Success Stories</span>
            <h2 className="text-5xl font-bold text-slate-900 mt-6">Loved by Indian Businesses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition hover:-translate-y-2">
                 <div className="flex text-yellow-400 mb-6 text-lg">{'★'.repeat(5)}</div>
                 <p className="text-slate-600 mb-8 italic text-lg leading-relaxed">"{t.text}"</p>
                 <div className="inline-block bg-green-100 text-green-700 text-sm font-bold px-3 py-1.5 rounded-lg mb-8">{t.earnings}</div>
                 <div className="flex items-center space-x-4">
                    <img src={t.image} alt={t.author} loading="lazy" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                    <div>
                       <h4 className="font-bold text-slate-900 text-base">{t.author}</h4>
                       <p className="text-sm text-slate-500 font-medium">{t.role}, {t.company}</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SEOFooterLinks />

      <section className="py-24">
         <div className="max-w-7xl mx-auto px-4">
           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-16 text-center text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700">
                <div className="absolute top-10 left-10 text-6xl animate-pulse">+</div>
                <div className="absolute bottom-10 right-10 text-8xl animate-pulse">+</div>
                <div className="absolute top-1/2 left-1/4 text-4xl animate-pulse">+</div>
             </div>
             
             <h2 className="text-5xl md:text-6xl font-bold mb-8 relative z-10 leading-tight">Ready to Upgrade Your Business IT?</h2>
             <p className="text-blue-100 max-w-3xl mx-auto mb-12 text-xl md:text-2xl relative z-10 leading-relaxed">Join thousands of Indian businesses already saving time and money on IT procurement. Start today.</p>
             
             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
               <Link to="/products" className="px-10 py-5 bg-white text-blue-700 font-bold text-xl rounded-2xl hover:bg-gray-50 transition shadow-xl transform hover:-translate-y-1">Browse Marketplace</Link>
               <button onClick={() => handleAuthAction()} className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition">Talk to Sales</button>
             </div>
             
             <div className="mt-12 flex justify-center space-x-8 text-sm md:text-base text-blue-200 relative z-10 font-medium">
               <span className="flex items-center"><CheckCircle2 size={18} className="mr-2" /> Verified Vendors</span>
               <span className="flex items-center"><CheckCircle2 size={18} className="mr-2" /> BANT Qualified Leads</span>
               <span className="flex items-center"><CheckCircle2 size={18} className="mr-2" /> Instant Quotes</span>
             </div>
           </div>
         </div>
      </section>

      {activeFeature && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveFeature(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-slide-up relative overflow-hidden" onClick={e => e.stopPropagation()}>
               <div className={`absolute top-0 left-0 w-full h-2 ${getColorClasses(activeFeature.color).bg}`}></div>
               <button onClick={() => setActiveFeature(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-slate-500">
                 <X size={24} />
               </button>
               
               <div className="mb-8 mt-2">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${getColorClasses(activeFeature.color).bg} ${getColorClasses(activeFeature.color).shadow}`}>
                     {activeFeature.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">{activeFeature.modalTitle}</h3>
                  <p className="text-lg text-slate-500">{activeFeature.modalDesc}</p>
               </div>
               
               <div className="bg-slate-50 rounded-2xl p-6 border border-gray-100 mb-8">
                  <h4 className="font-bold text-slate-800 mb-4 uppercase text-sm tracking-wider flex items-center">
                     <Star size={16} className="text-yellow-500 mr-2 fill-current" /> Key Benefits
                  </h4>
                  <ul className="space-y-4">
                     {activeFeature.points.map((p: string, idx: number) => (
                       <li key={idx} className="flex items-start">
                          <CheckCircle2 className={`${getColorClasses(activeFeature.color).check} mr-3 mt-1 flex-shrink-0`} size={20} />
                          <span className="text-slate-700 font-medium text-lg">{p}</span>
                       </li>
                     ))}
                  </ul>
               </div>
               
               <div className="flex justify-end gap-4">
                  <button onClick={() => setActiveFeature(null)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Close</button>
                  <button onClick={() => { setActiveFeature(null); handleAuthAction(); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center">
                    Get Started <ArrowRight size={18} className="ml-2" />
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Home;
