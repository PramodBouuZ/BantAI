import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CheckCircle2, ArrowRight, Zap, Star, Server, Phone, Wifi, Database, Shield, Globe, ChevronLeft } from 'lucide-react';
import SEO from '../components/SEO';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <Server size={48} className="text-blue-500" />;
    case 'cloud': return <Phone size={48} className="text-purple-500" />;
    case 'wifi': return <Wifi size={48} className="text-green-500" />;
    case 'phone': return <Phone size={48} className="text-orange-500" />;
    case 'database': return <Database size={48} className="text-indigo-500" />;
    case 'shield': return <Shield size={48} className="text-slate-500" />;
    default: return <Globe size={48} className="text-gray-500" />;
  }
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useData();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Product Not Found</h2>
        <Link to="/products" className="text-blue-600 hover:underline">Browse all products</Link>
      </div>
    );
  }

  // Dynamic SEO Generator based on product data including price range
  const seoTitle = `${product.title} Pricing & Reviews - Starts ${product.priceRange} | BantConfirm`;
  const seoDesc = `Get best quotes for ${product.title}. Pricing starts from ${product.priceRange}. ${product.description}. Compare top ${product.category} vendors in India.`;
  const seoKeywords = `${product.title}, ${product.title} Price, ${product.title} Cost, ${product.category}, Buy ${product.title} India, ${product.priceRange}, BantConfirm, Verified Vendors`;

  // Product Schema for Google Rich Snippets
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image || "https://bantconfirm.com/logo.png",
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "BantConfirm"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "bestRating": "5",
      "ratingCount": "120" // Mock count for SEO example
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": "1000", // Needs to be numeric, extracted from range ideally
      "offerCount": "5"
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        schema={productSchema}
      />

      {/* Header */}
      <div className="bg-slate-50 py-12 border-b border-gray-100">
         <div className="max-w-7xl mx-auto px-4">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition">
               <ChevronLeft size={20} className="mr-1" /> Back to Marketplace
            </button>

            <div className="flex flex-col md:flex-row items-start gap-8">
               <div className="w-full md:w-1/3">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex items-center justify-center aspect-square relative overflow-hidden">
                     {product.image ? (
                        <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
                     ) : (
                        <div className="bg-slate-50 rounded-2xl p-8">
                           {getIcon(product.icon)}
                        </div>
                     )}
                  </div>
               </div>
               
               <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{product.category}</span>
                     <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1 text-slate-700 font-bold">{product.rating}</span>
                     </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{product.title}</h1>
                  <p className="text-xl text-slate-600 mb-8 leading-relaxed">{product.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                     <div className="bg-green-50 px-6 py-4 rounded-xl border border-green-100">
                        <p className="text-xs font-bold text-green-800 uppercase mb-1">Estimated Price</p>
                        <p className="text-2xl font-bold text-green-700">{product.priceRange}</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                     <button onClick={() => navigate(`/enquiry?product=${product.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                        Get Best Quote
                     </button>
                     <button onClick={() => navigate('/enquiry?type=consult')} className="bg-white border-2 border-gray-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition">
                        Talk to Expert
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                     <Zap className="text-yellow-500 mr-2" /> Key Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {product.features.map((feature, i) => (
                        <div key={i} className="flex items-start p-4 rounded-xl bg-slate-50 border border-gray-100">
                           <CheckCircle2 className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                           <span className="font-medium text-slate-700">{feature}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Why buy {product.title} on BantConfirm?</h2>
                  <div className="prose prose-lg text-slate-600">
                     <p>
                        Searching for the best <strong>{product.title}</strong> in India? BantConfirm connects you with verified vendors offering 
                        {product.category} solutions tailored to your business needs. 
                     </p>
                     <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li><strong>Verified Vendors:</strong> We check GST, MCA, and past performance.</li>
                        <li><strong>Best Price Guarantee:</strong> Compare quotes from top providers like Tata, Airtel, Zoho, and more.</li>
                        <li><strong>Fast Deployment:</strong> Get solutions implemented in Noida, Mumbai, Bangalore, and PAN India.</li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-28">
               <h3 className="text-xl font-bold text-slate-900 mb-4">Need help choosing?</h3>
               <p className="text-slate-600 mb-6">Our experts can help you define your requirements and find the perfect match.</p>
               
               <div className="space-y-4 mb-8">
                  <div className="flex items-center text-sm text-slate-500">
                     <CheckCircle2 size={16} className="text-blue-500 mr-2" /> Free Requirement Analysis
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <CheckCircle2 size={16} className="text-blue-500 mr-2" /> Vendor Comparison Matrix
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <CheckCircle2 size={16} className="text-blue-500 mr-2" /> Negotiation Support
                  </div>
               </div>

               <button onClick={() => navigate('/contact')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition">
                  Contact Support
               </button>
            </aside>
         </div>
      </div>
    </div>
  );
};

export default ProductDetails;