import React from 'react';
import { Shield, Target, Users, Globe, Award, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO 
        title="About BantConfirm - India's B2B IT Procurement Platform"
        description="Learn about BantConfirm's mission to empower Indian MSMEs with verified IT procurement. Our AI-driven BANT methodology ensures the best matches for buyers and sellers."
      />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 inline-block">About BantConfirm</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Empowering Indian Business</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We are India's first BANT-verified marketplace dedicated to connecting MSMEs and Enterprises with top-tier IT, Software, and Telecom solutions.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
              alt="Team collaboration" 
              className="rounded-3xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              At BantConfirm, we believe that technology procurement should be simple, transparent, and efficient. For too long, Indian MSMEs have struggled to find reliable vendors for their IT needs, while vendors struggle to find qualified leads.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We bridge this gap using our proprietary AI-driven BANT (Budget, Authority, Need, Timing) verification engine. This ensures that businesses get the right solutions at the right price, and vendors connect with genuinely interested buyers.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Target className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Precision Matching</h4>
                  <p className="text-sm text-slate-500">AI-based vendor discovery</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900">Verified Trust</h4>
                  <p className="text-sm text-slate-500">100% Vetted Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-slate-600 font-medium">Businesses Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">₹50Cr+</div>
              <div className="text-slate-600 font-medium">Transaction Volume</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-slate-600 font-medium">Technology Partners</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-slate-600 font-medium">Support Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Customer First</h3>
            <p className="text-slate-600">We prioritize the needs of Indian businesses, ensuring every feature we build solves a real problem for MSMEs.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform">
            <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <Award size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Quality & Trust</h3>
            <p className="text-slate-600">We maintain high standards for our vendors. Only the best service providers make it to our marketplace.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform">
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <TrendingUp size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Innovation</h3>
            <p className="text-slate-600">We leverage AI and data analytics to continuously improve the matchmaking process for IT procurement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;