
// Fixed missing Sparkles import on line 5
import React from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Scale, Star, Zap, CheckCircle2, IndianRupee, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const Comparison: React.FC = () => {
  const { compareList, toggleCompare, clearCompare } = useData();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <Scale size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No products to compare</h2>
        <p className="text-slate-500 mb-6">Select up to 3 products from the marketplace to compare them here.</p>
        <button onClick={() => navigate('/products')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition">
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO title="Compare B2B IT Services - BantConfirm" description="Side-by-side comparison of Indian B2B software and telecom services." />
      
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 font-bold transition">
            <ChevronLeft size={20} className="mr-1" /> Back to Services
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Compare Solutions</h1>
              <p className="text-slate-500 mt-2">Find the perfect fit for your business requirements.</p>
            </div>
            <button onClick={clearCompare} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-8 text-left bg-slate-50/50 w-1/4">
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Zap size={24} />
                      <span className="font-bold uppercase tracking-widest text-xs">Features Matrix</span>
                    </div>
                  </th>
                  {compareList.map(product => (
                    <th key={product.id} className="p-8 text-center border-l border-gray-100 min-w-[300px] relative group">
                      <button 
                        onClick={() => toggleCompare(product)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <div className="h-40 bg-slate-100 rounded-2xl mb-4 overflow-hidden">
                        {product.image ? (
                          <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Scale size={48} />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{product.title}</h3>
                      <p className="text-indigo-600 font-bold text-sm mb-4">{product.category}</p>
                      <button onClick={() => navigate(`/enquiry?product=${product.id}`)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-md">
                        Get Quote
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-6 bg-slate-50/50 font-bold text-slate-700">Estimated Pricing</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-6 text-center font-bold text-slate-900 border-l border-gray-100">
                      <div className="flex items-center justify-center text-green-600">
                        <IndianRupee size={16} className="mr-1" />
                        {p.priceRange}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-slate-50/50 font-bold text-slate-700">Expert Rating</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-6 text-center border-l border-gray-100">
                      <div className="flex items-center justify-center gap-1.5">
                        <Star size={18} className="text-yellow-500 fill-current" />
                        <span className="font-bold text-slate-900">{p.rating} / 5.0</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-slate-50/50 font-bold text-slate-700">Key Capabilities</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-6 border-l border-gray-100">
                      <ul className="space-y-3">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-center justify-center text-xs font-medium text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg">
                            <CheckCircle2 size={12} className="text-green-500 mr-2 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-slate-50/50 font-bold text-slate-700">Description</td>
                  {compareList.map(p => (
                    <td key={p.id} className="p-6 text-sm text-slate-500 leading-relaxed text-center border-l border-gray-100">
                      {p.description}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 bg-indigo-900 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
          </div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Need a deep technical analysis?</h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto relative z-10">Our AI Consultant can run a personalized simulation based on your 5-year growth projections. Talk to our expert today.</p>
          <button onClick={() => navigate('/contact')} className="bg-white text-indigo-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition shadow-xl relative z-10">
            Talk to AI Expert
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
