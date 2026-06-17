import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CheckCircle2, Star, Server, Scale, Zap, ArrowLeft, Search } from 'lucide-react';
import SEO from '../components/SEO';

const CategoryDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categoryObjects, products, toggleCompare, compareList } = useData();
  const navigate = useNavigate();

  const category = categoryObjects.find(c => c.slug === slug);
  const categoryProducts = products.filter(p => p.category === category?.name);

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-6xl font-bold text-slate-200 mb-4">404</h2>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Category Not Found</h3>
        <button onClick={() => navigate('/products')} className="text-indigo-600 font-bold hover:underline mt-4 flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Products
        </button>
      </div>
    );
  }

  const handleEnquiry = (productId?: string) => {
    const target = productId ? `/enquiry?product=${productId}` : `/enquiry?category=${category.name}`;
    navigate(target);
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEO
        title={`${category.name} Solutions & Services India`}
        description={category.description || `Find verified vendors for ${category.name} services. Compare prices and get quotes from top providers in India.`}
        keywords={`${category.name} india, ${category.name} vendors, best ${category.name} software`}
        {...category}
      />

      <div className="bg-slate-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 animate-fade-in">
           <Link to="/products" className="text-blue-600 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all">
             <ArrowLeft size={20} /> Back to Marketplace
           </Link>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">{category.name} Solutions</h1>
           <p className="text-slate-600 max-w-3xl mb-10 text-lg md:text-xl leading-relaxed">
             {category.description || `Explore our comprehensive range of ${category.name} solutions tailored for Indian businesses. Connect with verified vendors and find the perfect fit for your requirements.`}
           </p>

           <button onClick={() => handleEnquiry()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1">
             Get Custom Quote for {category.name}
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 animate-slide-up-delay-1">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Available {category.name} Services</h2>
          <p className="text-slate-500 font-medium">{categoryProducts.length} listings found</p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => {
              const isSelected = compareList.some(p => p.id === product.id);
              return (
                <div key={product.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-blue-100 transition duration-300 group hover:-translate-y-2 flex flex-col h-full">
                  <Link to={`/products/${product.slug || product.id}`} className="relative h-56 overflow-hidden block">
                      {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <Server size={56} className="text-slate-300" />
                          </div>
                      )}
                      <div className="absolute top-4 right-4 flex items-center bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm">
                          <Star size={16} className="text-yellow-500 fill-current mr-1.5" />
                          <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                      </div>
                  </Link>

                  <div className="p-8 flex-grow flex flex-col">
                      <Link to={`/products/${product.slug || product.id}`} className="block mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition leading-tight">{product.title}</h3>
                      </Link>
                      <p className="text-slate-500 text-lg mb-6 line-clamp-2 leading-relaxed">{product.description}</p>

                      <div className="mb-8 bg-slate-50 p-5 rounded-2xl">
                          <ul className="space-y-2">
                              {product.features.slice(0, 3).map((feature, idx) => (
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
                                <button onClick={() => handleEnquiry(product.id)} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-base font-bold transition shadow-md hover:shadow-lg">
                                    Get Quote
                                </button>
                                <button onClick={() => toggleCompare(product)} className={`rounded-xl transition shadow-md flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`}>
                                  <Scale size={20} />
                                </button>
                          </div>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
             <Search className="mx-auto text-slate-200 mb-4" size={64} />
             <h3 className="text-2xl font-bold text-slate-900">No products in this category yet</h3>
             <p className="text-slate-500 mt-2">Check back later or explore other categories.</p>
             <Link to="/products" className="inline-block mt-8 bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-slate-700 hover:bg-gray-50 transition">Explore Catalog</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;