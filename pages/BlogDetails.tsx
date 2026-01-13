
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, Calendar, User, Clock, Share2, 
  Linkedin, Twitter, Facebook, ArrowRight, Sparkles 
} from 'lucide-react';
import SEO from '../components/SEO';
import NotFound from '../components/NotFound';

const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs } = useData();
  const navigate = useNavigate();

  const post = blogs.find(b => b.slug === slug);

  // If a blog post is not found, render the NotFound component for a consistent user experience
  if (!post) {
    return <NotFound />;
  }

  // Related posts (excluding current)
  const relatedPosts = blogs.filter(b => b.id !== post.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO 
        title={post.title}
        description={post.content.substring(0, 160)}
      />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <Sparkles size={80} className="text-blue-500 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-8 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Insights
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> 6 Min Read
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-8">
              {post.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center font-black text-white shadow-xl">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-black text-sm">{post.author}</p>
                  <p className="text-slate-400 text-xs font-bold">{post.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* Main Narrative */}
          <div className="flex-1">
            <div className="prose prose-slate max-w-none prose-lg prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium">
              {/* Splitting content by newlines to render as paragraphs */}
              {post.content.split('\n').map((para, i) => (
                para.trim() ? <p key={i} className="mb-6">{para}</p> : <br key={i} />
              ))}
            </div>

            {/* Social Sharing */}
            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Share this story</span>
                <div className="flex gap-3">
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all shadow-sm">
                    <Linkedin size={18} />
                  </button>
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-500 rounded-xl flex items-center justify-center transition-all shadow-sm">
                    <Twitter size={18} />
                  </button>
                  <button className="w-10 h-10 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all shadow-sm">
                    <Facebook size={18} />
                  </button>
                </div>
              </div>
              <button onClick={() => navigate('/enquiry')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Post Enquiry for your Business
              </button>
            </div>
          </div>

          {/* Sidebar (Optional Widgets) */}
          <aside className="lg:w-48 hidden lg:block">
            <div className="sticky top-28 space-y-12">
               <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Reading Hub</p>
                  <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                     <div className="bg-blue-600 h-full w-1/4"></div>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">More from Insights</h2>
              <Link to="/blog" className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group">
                View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedPosts.map(rel => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-video bg-slate-100 rounded-2xl mb-6 overflow-hidden">
                    {rel.image && <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {rel.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <Calendar size={12} /> {rel.date}
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

export default BlogDetails;
