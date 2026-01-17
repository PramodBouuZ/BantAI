import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle2, Search, ArrowRight, Server, Phone, Database, Globe, Wifi, Shield, Star, Zap, Scale } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { optimizeImage } from '../services/imageOptimizer';

interface ProductsProps {
  isLoggedIn: boolean;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'users': return <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Server size={24} /></div>;
    case 'cloud': return <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><Phone size={24} /></div>;
    case 'wifi': return <div className="bg-green-100 p-3 rounded-xl text-green-600"><Wifi size={24} /></div>;
    case 'phone': return <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Phone size={24} /></div>;
    case 'database': return <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><Database size={24} /></div>;
    case 'shield': return <div className="bg-slate-100 p-3 rounded-xl text-slate-600"><Shield size={24} /></div>;
    default: return <div className="bg-gray-100 p-3 rounded-xl text-gray-600"><Globe size={24} /></div>;
  }
};

import { ProductGridSkeleton } from '../components/SkeletonLoader';
import SEOContentBlock from '../components/SEOContentBlock';

// Category-specific SEO content
const categorySEOContent: { [key: string]: { title: string; content: string } } = {
  'CRM': {
    title: "Choosing the Right CRM in India",
    content: "<p>A Customer Relationship Management (CRM) system is vital for managing interactions with current and potential customers. In India, businesses from startups to large enterprises use CRMs like Salesforce, Zoho, and homegrown solutions to streamline sales processes, improve customer service, and drive growth. When selecting a CRM, consider factors like business size, industry-specific needs, integration capabilities with existing software (like Tally or Busy), and scalability. A good CRM provides a centralized database for lead and contact management, sales pipeline visualization, and detailed analytics on team performance. For MSMEs, cloud-based CRMs offer an affordable and flexible solution without the need for extensive IT infrastructure.</p>"
  },
  'Cloud Telephony': {
    title: "The Power of Cloud Telephony for Indian Businesses",
    content: "<p>Cloud Telephony solutions, including IVR, Toll-Free Numbers, and SIP Trunking, have revolutionized business communication in India. Unlike traditional EPABX systems, cloud solutions are hosted on the internet, offering unparalleled flexibility, scalability, and cost-effectiveness. Key benefits include remote work enablement, professional call management with IVR, and national presence with a single Toll-Free number. Providers like Airtel, Tata, and others offer robust platforms that integrate with CRMs to provide a unified view of customer interactions. This technology is crucial for businesses in sectors like e-commerce, healthcare, and finance that rely on efficient and reliable customer communication.</p>"
  },
  'ERP': {
    title: "Understanding ERP Solutions for Manufacturing and SMEs",
    content: "<p>Enterprise Resource Planning (ERP) software integrates core business processes such as finance, HR, manufacturing, and supply chain into a single system. For SMEs and manufacturing units in India, implementing an ERP like SAP Business One, Tally.ERP 9, or custom-built solutions can lead to significant improvements in efficiency and decision-making. An ERP provides real-time data, automates repetitive tasks, and ensures regulatory compliance (e.g., GST). Choosing the right ERP involves assessing your specific modules needs, whether it's for inventory management, production planning, or financial accounting. Cloud ERPs are gaining popularity for their lower upfront costs and easier implementation.</p>"
  }
};

const Products: React.FC<ProductsProps> = ({ isLoggedIn }) => {
  const { categories, toggleCompare, compareList, fetchProducts } = useData();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const loadProducts = useCallback(async (loadPage: number, currentCategory: string, currentQuery: string) => {
    setIsLoading(true);
    try {
      const { products: newProducts, hasMore: newHasMore } = await fetchProducts({
        page: loadPage,
        pageSize: 12,
        category: currentCategory,
        searchQuery: currentQuery,
      });

      if (loadPage === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  // Effect for initial load and when filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    loadProducts(1, category, searchQuery);
  }, [category, searchQuery, loadProducts]);

  // Effect for "Load More"
  useEffect(() => {
    if (page > 1) {
      loadProducts(page, category, searchQuery);
    }
  }, [page]);

  const handleAction = (productId?: string) => {
    const target = productId ? `/enquiry?product=${productId}` : '/enquiry?type=consult';
    if (isLoggedIn) {
      navigate(target);
    } else {
      navigate('/login', { state: { from: { pathname: target } } });
    }
  };

  const seoTitle = "All IT Solutions & Business Software | Verified Vendors India";
  const seoDesc = "Explore all business solutions on BantConfirm. Browse categories like CRM, ERP, Cloud Telephony, and IT Hardware from a network of verified vendors across India.";

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords="IT solutions, business software, verified vendors India, CRM, ERP, cloud telephony, IT hardware"
      />

      <div className="bg-slate-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center animate-fade-in">
           <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">Marketplace Solutions</span>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mt-6 mb-6">IT Solutions & Business Software in India</h1>
           <p className="text-slate-600 max-w-3xl mx-auto mb-10 text-lg md:text-xl leading-relaxed">
             Find the Right Software, IT Hardware & Business Solutions in India. Search for verified vendors of Tally, Zoho, Airtel, Microsoft Licenses, and more.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => handleAction()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">
               Post Requirement for AI Matching
             </button>
             <button onClick={() => {document.getElementById('product-grid')?.scrollIntoView({behavior: 'smooth'})}} className="bg-white border-2 border-gray-200 text-slate-700 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition">
               Explore Catalog
             </button>
           </div>
        </div>
      </div>

      <div id="product-grid" className="max-w-7xl mx-auto px-4 py-16 animate-slide-up-delay-1">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Search Tally, ERP, CRM, Microsoft License..." 
              className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="w-full md:w-auto border border-gray-200 rounded-2xl px-6 py-4 bg-white text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 text-lg font-medium cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {isLoading && products.length === 0 ? (
          <ProductGridSkeleton />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const isSelected = compareList.some(p => p.id === product.id);
                return (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-100 transition duration-300 group hover:-translate-y-2 flex flex-col h-full">
                    <Link to={`/products/${product.slug || product.id}`} className="relative h-56 overflow-hidden block">
                        {product.image ? (
                            <img
                              src={optimizeImage(product.image, 400, 300, 80)}
                              alt={product.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                <Server size={56} className="text-slate-300" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            {getIcon(product.icon)}
                        </div>
                        <div className="absolute top-4 right-4 flex items-center bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                            <Star size={16} className="text-yellow-500 fill-current mr-1.5" />
                            <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                        </div>
                    </Link>

                    <div className="p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <Link to={`/products/${product.slug || product.id}`} className="block">
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition leading-tight">{product.title}</h3>
                          </Link>
                        </div>

                        <p className="text-slate-500 text-lg mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                        <div className="mb-8 bg-slate-50 p-5 rounded-2xl">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 flex items-center">
                                <Zap size={14} className="mr-1.5 text-yellow-500" /> Key Features
                            </p>
                            <ul className="space-y-2">
                                {(product.features || []).map((feature: string, idx: number) => (
                                <li key={idx} className="flex items-start text-sm text-slate-700 font-medium">
                                    <CheckCircle2 size={16} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                    {feature}
                                </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-100">
                            <p className="font-bold text-slate-900 text-2xl mb-5">{product.priceRange}</p>
                            <div className="grid grid-cols-3 gap-4">
                                  <button onClick={() => handleAction(product.id)} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-base font-bold transition shadow-md hover:shadow-lg text-center flex items-center justify-center">
                                      Get Quote
                                  </button>
                                  <button onClick={() => toggleCompare(product)} className={`rounded-xl transition shadow-md flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`} title={isSelected ? 'Remove from compare' : 'Add to compare'}>
                                    <Scale size={20} />
                                  </button>
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <div className="mt-16 text-center">
                <button
                  onClick={() => !isLoading && setPage(p => p + 1)}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
             <div className="text-6xl mb-4">🔍</div>
             <h3 className="text-2xl font-bold text-slate-900">No results found</h3>
             <p className="text-slate-500 mt-2">Try searching for CRM, ERP, Tally, or Microsoft license.</p>
          </div>
        )}
      </div>

      {/* Render SEO Content Block if a specific category is selected */}
      {category !== 'All Categories' && categorySEOContent[category] && (
        <SEOContentBlock
          title={categorySEOContent[category].title}
          content={categorySEOContent[category].content}
        />
      )}
    </div>
  );
};

export default Products;