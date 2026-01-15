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
      {/* Use Slug for URL */}
      <Link to={`/products/${product.slug || product.id}`} className="relative h-48 overflow-hidden block">
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
      </Link>
      
      <div className="p-6 flex-grow flex flex-col">
        <Link to={`/products/${product.slug || product.id}`} className="block">
          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{product.title}</h3>
        </Link>
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
      
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-24 items-center w-max">
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
      <div className="max-w-7xl mx-auto px-4 text-xs md:text-sm text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Software & Enterprise Solutions */}
          <div>
            <h5 className="font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Software Solutions</h5>
            <ul className="space-y-2 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Sales CRM & Lead Management</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">SME ERP & Manufacturing ERP</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Tally Software & Busy Accounting</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Marg ERP & Vyapar Software</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">HRMS & Payroll Solutions</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Inventory Management Software</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Billing & Invoicing Software</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Project Management Software</Link></li>
            </ul>
          </div>

          {/* Cloud, Telephony & IT Hardware */}
          <div>
            <h5 className="font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Cloud & Infrastructure</h5>
            <ul className="space-y-2 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Cloud Telephony & IVR Solutions</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">SIP Trunk & PRI Line Services</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Toll-Free Number Providers</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Internet Leased Line (ILL) India</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Networking & Firewall Security</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Servers & Storage Solutions</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Data Center Services</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">AI Voice Agents & WhatsApp API</Link></li>
            </ul>
          </div>

          {/* Location-Based SEO Cities */}
          <div>
             <h5 className="font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Availability Near You</h5>
             <ul className="space-y-2 leading-relaxed">
              <li><Link to="/products" className="hover:text-blue-600">Software Vendors in Delhi/Noida</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">IT Services in Mumbai/Pune</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">CRM Software in Bangalore</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">ERP Vendors in Chennai/Hyderabad</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Business Software in Ahmedabad</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Telecom Solutions in Gurgaon</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Microsoft License Resellers India</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">IT Support in Kolkata/Lucknow</Link></li>
            </ul>
          </div>

          {/* About & Enterprise Licensing */}
          <div>
             <h5 className="font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">Microsoft Licensing</h5>
             <ul className="space-y-2 leading-relaxed mb-6">
              <li><Link to="/products" className="hover:text-blue-600">Microsoft 365 License Reseller</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Windows Server License India</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">SQL Server License Solutions</Link></li>
              <li><Link to="/products" className="hover:text-blue-600">Enterprise Software Licensing</Link></li>
            </ul>
             <h5 className="font-bold text-slate-800 mb-2 uppercase tracking-wider">About BantConfirm</h5>
             <p className="text-[10px] leading-relaxed">
               BantConfirm is an AI-powered B2B marketplace for MSMEs. We verify requirements using BANT (Budget, Authority, Need, Timing) methodology to connect you with verified software, IT hardware, and telecom vendors across India.
             </p>
          </div>
        </div>

        {/* Hidden SEO Keywords Section */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-[10px] text-slate-300 text-center uppercase tracking-widest leading-loose">
          CRM software India, ERP software India, accounting software India, billing software India, tally software vendor, busy accounting software dealer, cloud telephony India, IVR service provider India, toll free number provider India, SIP trunk provider India, PRI line provider India, internet leased line India, Microsoft license reseller India, Windows license India, SQL server license India, IT hardware supplier India, business software vendors near me, IT solutions near me, AI voice agent India, B2B software marketplace India
        </div>
      </div>
    </section>
  )
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const { fetchProducts, siteConfig, categories, toggleCompare, compareList } = useData();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(initialChartData);
  const [activeLeads, setActiveLeads] = useState(247);
  const [dealsClosed, setDealsClosed] = useState(86032); 
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadFeatured = async () => {
      setIsLoading(true);
      const { products } = await fetchProducts({ page: 1, pageSize: 6 });
      setFeaturedProducts(products);
      setIsLoading(false);
    };
    loadFeatured();

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
  }, [fetchProducts]);

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

  const filteredProducts = featuredProducts.filter(product => {
    if (isLoading) return false;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const features = [
    {
      title: "AI-Qualified Requirements",
      desc: "Our BANT methodology ensures you connect with high-intent leads who have validated Budget, Authority, Need, and Timing.",
      icon: <Zap size={32} />,
      color: "blue",
      modalTitle: "AI-Driven BANT Methodology",
      modalDesc: "Traditional lead gen is noisy. BantConfirm uses AI to qualify every requirement.",
      points: [
        "Verified Budget & Implementation Timeline",
        "Confirmed Decision-Maker Authority",
        "Deep Analysis of specific Business Need",
        "Automated matching with the top 3 verified vendors"
      ]
    },
    {
      title: "Verified Vendor Network",
      desc: "Find verified software developers, IT hardware suppliers, and cloud telephony providers across India.",
      icon: <CheckCircle2 size={32} />,
      color: "green",
      modalTitle: "Trust and Transparency",
      modalDesc: "Every vendor on BantConfirm goes through a 5-step verification process.",
      points: [
        "GST & MCA registration verification",
        "Past client performance auditing",
        "Standardized SLAs and transparent pricing",
        "Direct connection with certified partners"
      ]
    },
    {
      title: "Enterprise Licensing",
      desc: "Get best quotes for Microsoft 365, Windows Server, SQL Server, and custom enterprise licenses.",
      icon: <Shield size={32} />,
      color: "purple",
      modalTitle: "Enterprise Software Licensing",
      modalDesc: "Save significantly on Microsoft and other enterprise license procurement.",
      points: [
        "Microsoft 365 & Office business licenses",
        "Windows & SQL Server Enterprise licenses",
        "Volume licensing discounts for MSMEs",
        "Legal compliance and license optimization"
      ]
    },
    {
      title: "IT Infrastructure Support",
      desc: "Procure Servers, Firewalls, Storage, and Internet Leased Lines from verified local providers.",
      icon: <Briefcase size={32} />,
      color: "orange",
      modalTitle: "Infrastructure & Connectivity",
      modalDesc: "High-speed internet and hardware solutions for your office.",
      points: [
        "Dedicated Internet Leased Line (ILL) solutions",
        "Server procurement and setup support",
        "Network security & Firewall deployment",
        "PAN India hardware availability"
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
      siteConfig.socialLinks?.twitter,
      siteConfig.socialLinks?.linkedin,
      siteConfig.socialLinks?.facebook,
      siteConfig.socialLinks?.instagram
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

  const seoTitle = "BantConfirm: India's #1 B2B Marketplace for IT & Software";
  const seoDesc = "Find verified vendors for CRM, Cloud Telephony, IT Hardware & more on BantConfirm, India's leading B2B marketplace. Get AI-qualified leads & transparent pricing.";

  return (
    <div className="overflow-hidden">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords="B2B marketplace India, IT solutions, business software, CRM India, cloud telephony, IT hardware procurement, verified vendors"
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
            <span>AI-Driven B2B Procurement</span>
          </div>
          
          <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            India's #1 B2B Marketplace for<br />
            <span className="text-blue-600">IT, Software & Telecom Solutions</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed">
            {siteConfig.bannerSubtitle || "Find the Right Software, IT Hardware & Business Solutions in India. Verified vendors, transparent pricing, and AI-qualified requirements."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link to="/products" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1">
              Explore Solutions
            </Link>
            <button onClick={() => handleAuthAction()} className="px-10 py-5 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border border-white/50 hover:border-gray-200 rounded-2xl font-bold text-xl shadow-sm transition-all">
              Post My Requirement
            </button>
          </div>

          <div className="flex justify-center items-center space-x-8 md:space-x-12 text-base font-medium text-slate-500 flex-wrap gap-y-4">
            <div className="flex items-center space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <span className="text-lg">Verified Vendors Only</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-purple-500" />
              <span className="text-lg">No Data Selling</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={20} className="text-green-500" />
              <span className="text-lg">GST Compliant Billing</span>
            </div>
          </div>

          <div className="mt-20 relative max-w-6xl mx-auto animate-slide-up-delay-1">
            <div className="absolute -top-10 -right-10 z-10 bg-yellow-400 text-white p-6 rounded-3xl shadow-2xl transform rotate-12 hidden md:block animate-[bounce_3s_infinite]">
               <span className="text-4xl">🤖</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 transition-all hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
               <div className="flex items-center justify-between mb-10">
                 <h2 className="font-bold text-2xl text-slate-800">Marketplace Growth Dashboard</h2>
                 <span className="flex items-center text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Market Activity
                 </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
                   <p className="text-base text-yellow-800 font-bold uppercase tracking-wider mb-2">Verified Sellers</p>
                   <p className="text-5xl font-bold text-slate-900 transition-all duration-300">1,250+</p>
                   <p className="text-sm text-green-600 mt-3 font-bold bg-white/50 inline-block px-2 py-1 rounded">PAN India Support</p>
                 </div>
                 <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden">
                   <p className="text-base text-blue-800 font-bold uppercase tracking-wider mb-2">Requirement Volume</p>
                   <p className="text-5xl font-bold text-slate-900 transition-all duration-300">{formatINR(dealsClosed)}</p>
                   <p className="text-sm text-green-600 mt-3 font-bold bg-white/50 inline-block px-2 py-1 rounded">↑ 23% this month</p>
                 </div>
               </div>
               
               <div className="h-64 w-full bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex justify-between items-end mb-4 px-2">
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">IT Procurement Trends</p>
                     <p className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">Real-time Data</p>
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
               <h2 className="text-4xl font-bold text-slate-900">Find the Right Business Solutions</h2>
               <p className="text-slate-500 mt-2 text-lg">Browse CRM, ERP, Cloud Telephony, and IT Hardware from verified vendors.</p>
           </div>
           
           <div className="mb-8 max-w-3xl">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={22} className="text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search Tally, Zoho, Airtel, Microsoft License..." 
                    className="bg-transparent border-none outline-none w-full text-lg text-slate-700 placeholder-slate-400" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search for solutions"
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
                 All Solutions
               </button>
               {categories.map((cat) => (
                 <button key={cat} 
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-6 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'}`}
                 >
                   {cat}
                 </button>
               ))}
           </nav>

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
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center max-w-4xl mx-auto mb-20">
             <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">Why BantConfirm?</span>
             <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 mb-6">India’s Smartest IT Procurement Hub</h2>
             <p className="text-xl text-slate-600 leading-relaxed">No data selling. No fake leads. Only AI-verified requirements and trusted partners.</p>
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
                         className="text-blue-600 font-bold hover:text-blue-700 flex items-center text-lg group bg-transparent border-none p-0 cursor-pointer"
                       >
                         Learn more <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                       </button>
                  </div>
                );
             })}
           </div>
        </div>
      </section>

      <SEOFooterLinks />

      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-16 text-center text-white shadow-2xl relative overflow-hidden group">
             <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10 leading-tight">Post Your Software or IT Requirement</h2>
             <p className="text-blue-100 max-w-3xl mx-auto mb-12 text-xl md:text-2xl relative z-10 leading-relaxed">Get AI-matched with verified vendors within 24 hours. Transparent, fast, and verified.</p>
             
             <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
               <Link to="/products" className="px-10 py-5 bg-white text-blue-700 font-bold text-xl rounded-2xl hover:bg-gray-50 transition shadow-xl transform hover:-translate-y-1">Browse Solutions</Link>
               <button onClick={() => handleAuthAction()} className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition">Talk to Sales</button>
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
                     <Star size={16} className="text-yellow-500 mr-2 fill-current" /> Benefits
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
                  <button onClick={() => { setActiveFeature(null); handleAuthAction(); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center">
                    Get Best Price <ArrowRight size={18} className="ml-2" />
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Home;