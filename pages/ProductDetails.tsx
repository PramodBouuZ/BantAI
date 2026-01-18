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
import Breadcrumb from '../components/Breadcrumb';
import { generateProductKeywords, generateFaqs } from '../lib/seo';

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

import { Product } from '../types';

const ProductDetailSkeleton: React.FC = () => (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-lg w-1/4 mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
                <div className="h-[450px] bg-slate-200 rounded-3xl"></div>
                <div className="h-24 bg-slate-200 rounded-3xl"></div>
                <div className="h-64 bg-slate-200 rounded-3xl"></div>
            </div>
            <div className="lg:col-span-4">
                <div className="h-96 bg-slate-200 rounded-3xl"></div>
            </div>
        </div>
    </div>
);

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { fetchProductBySlug, fetchSimilarProducts } = useData();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fetchedProduct = await fetchProductBySlug(slug);
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        const related = await fetchSimilarProducts(fetchedProduct.category, fetchedProduct.id);
        setSimilarProducts(related);
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [slug, fetchProductBySlug, fetchSimilarProducts]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

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

  const seoTitle = `${product.title} Providers in India | Price & Verified Vendors – BantConfirm`;
  const seoDesc = `Compare verified ${product.title} vendors in India. Check pricing, features, and support. Post your requirement on BantConfirm.com and get matched instantly.`;
  const seoKeywords = generateProductKeywords(product.title);

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": [product.image || ''],
    "brand": {
      "@type": "Brand",
      "name": "BantConfirm"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.priceRange.split('-')[0].trim().replace(/[^0-9]/g, '') || "0",
      "availability": "https://schema.org/InStock",
      "url": `https://bantconfirm.com/products/${product.slug}`
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${product.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": product.description
        }
      },
      {
        "@type": "Question",
        "name": `What is the price of ${product.title} in India?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The price for ${product.title} typically ranges from ${product.priceRange}. For an exact quote based on your requirements, please post your requirement.`
        }
      },
      {
        "@type": "Question",
        "name": `Who is the best vendor for ${product.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "BantConfirm lists multiple verified vendors for ${product.title}. The best vendor depends on your specific needs, location, and budget. We can connect you with the top 3 most suitable partners."
        }
      }
    ]
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        schema={[productSchema, faqSchema]}
      />

      {/* Header / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Products', href: '/products' },
            { name: product.category, href: `/products?category=${product.category}` },
            { name: product.title },
          ]}
        />
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

              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">{product.title} – Verified Providers & Pricing in India</h1>
              <p className="text-xl text-slate-500 leading-relaxed mb-10">{product.description}</p>

            </div>
          </div>

          {/* What is Product Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">What is {product.title}?</h2>
            <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.longDescription || `<p>${product.description}</p>` }} />
          </div>

          {/* Top Features Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Top Features of {product.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-green-50 text-green-600 p-2 rounded-xl mr-4 shadow-sm shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <span className="font-bold text-slate-700 text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">{product.title} Pricing in India</h2>
            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">Starting From</p>
                <p className="text-4xl font-black text-slate-900 mt-2">{product.priceRange}</p>
              </div>
              <button onClick={() => handleAction('quote')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">
                Get Best Price Quote
              </button>
            </div>
          </div>

          {/* Best Use Cases Section */}
          {product.useCases && product.useCases.length > 0 && (
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">Best Use Cases for {product.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {product.useCases.map((useCase, i) => (
                   <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="font-bold text-slate-700">{useCase}</p>
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Vendors Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Verified Vendors for {product.title} on BantConfirm</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              BantConfirm connects you with a network of verified and trusted vendors for {product.title}. Each partner is vetted for quality, reliability, and customer support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Partner</p>
                <p className="font-black text-slate-800 text-lg">{vendorInfo.name}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                <p className="font-black text-slate-800 text-lg">{vendorInfo.location}</p>
              </div>
            </div>
          </div>

          {/* Compare Similar Solutions Section (Placeholder) */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Compare Similar Solutions</h2>
            {/* The existing "Related Products" logic will be used here */}
          </div>

          {/* Dynamic FAQ Section */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100" id="faq-section">
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">FAQs – {product.title}</h2>
             <div className="space-y-6">
                {generateFaqs(product).map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 pb-6">
                      <h3 className="font-black text-lg text-slate-800 mb-2">{faq.question}</h3>
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
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

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Related Solutions You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarProducts.map((p) => (
                        <Link to={`/products/${p.slug}`} key={p.id} className="bg-white border border-slate-100 rounded-3xl p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                                    {getIcon(p.icon)}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{p.priceRange}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
