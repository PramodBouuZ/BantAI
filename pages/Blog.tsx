
import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User, Tag } from 'lucide-react';
import SEO from '../components/SEO';

const Blog: React.FC = () => {
  const { blogs, siteConfig } = useData();

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <SEO 
        title="BantConfirm Blog - Insights on B2B Software, IT & Services" 
        description="Read the latest news, guides, and insights on Indian B2B IT procurement, software solutions, and telecom services."
      />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">BantConfirm Insights</span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">The Future of B2B <br /><span className="text-blue-500">Procurement</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Guides, news, and deep-dives into Indian business technology.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((post) => (
              <article key={post.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <Newspaper size={48} />
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-blue-600 tracking-widest shadow-sm">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><User size={12} /> By {post.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                    {post.content}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group/btn transition-all">
                      Read Full Article <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
              <Newspaper size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Coming Soon</h2>
            <p className="text-slate-500 font-medium">Our editorial team is busy preparing amazing content for you.</p>
            <Link to="/" className="mt-8 inline-block text-blue-600 font-bold hover:underline">Return Home</Link>
          </div>
        )}
      </div>

      {/* Featured Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Stay Updated</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 relative z-10 font-medium">Join 5,000+ business owners receiving weekly IT procurement insights.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
            <input type="email" placeholder="Enter your business email" className="flex-1 bg-white/10 border border-white/20 px-6 py-4 rounded-2xl outline-none focus:bg-white/20 transition placeholder-blue-200 text-white font-bold" />
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition shadow-xl">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
