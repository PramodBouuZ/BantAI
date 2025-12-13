import React from 'react';
import { CheckCircle2, Zap, Shield, Search, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Features: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="BantConfirm Features - AI BANT Verification & Lead Matching"
        description="Discover how BantConfirm uses AI to verify B2B leads. BANT framework (Budget, Authority, Need, Timing) ensures high-quality connections for vendors and buyers."
        keywords="BANT Verification, AI Lead Matching, B2B Lead Generation Features, IT Vendor Discovery, Automated Procurement"
      />

      <div className="bg-slate-50 py-20 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Platform Features</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Discover how BantConfirm is revolutionizing IT procurement for Indian businesses through AI and BANT verification.
        </p>
      </div>

      {/* Feature 1: BANT */}
      <div className="max-w-7xl mx-auto px-4 py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 inline-block">The Core Engine</span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">BANT Verification Framework</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We don't just pass leads; we verify them. Every enquiry on our platform goes through a rigorous BANT qualification process to ensure high intent and quality.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle2 className="text-green-500 mr-3 mt-1" />
                <div>
                  <strong className="text-slate-900">Budget:</strong> Is the allocated budget sufficient for the solution?
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-green-500 mr-3 mt-1" />
                <div>
                  <strong className="text-slate-900">Authority:</strong> Does the contact have decision-making power?
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-green-500 mr-3 mt-1" />
                <div>
                  <strong className="text-slate-900">Need:</strong> Is there a clear, defined business problem to solve?
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="text-green-500 mr-3 mt-1" />
                <div>
                  <strong className="text-slate-900">Timing:</strong> What is the timeline for implementation?
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 bg-blue-600 p-6 rounded-3xl hidden md:block">
               <Shield className="text-white" size={40} />
             </div>
             <div className="space-y-6">
               <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                 <span className="font-bold text-slate-700">Budget Verified</span>
                 <CheckCircle2 className="text-green-600" />
               </div>
               <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <span className="font-bold text-slate-700">Decision Maker Confirmed</span>
                 <CheckCircle2 className="text-blue-600" />
               </div>
               <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                 <span className="font-bold text-slate-700">Requirement Defined</span>
                 <CheckCircle2 className="text-purple-600" />
               </div>
               <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                 <span className="font-bold text-slate-700">Immediate Timeline</span>
                 <CheckCircle2 className="text-orange-600" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Feature 2: AI Matching */}
      <div className="max-w-7xl mx-auto px-4 py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                  <Search className="mx-auto mb-3 text-blue-500" size={32} />
                  <h4 className="font-bold">Smart Search</h4>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                  <Zap className="mx-auto mb-3 text-yellow-500" size={32} />
                  <h4 className="font-bold">Instant Match</h4>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                  <Users className="mx-auto mb-3 text-purple-500" size={32} />
                  <h4 className="font-bold">Vendor Ranking</h4>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                  <BarChart3 className="mx-auto mb-3 text-green-500" size={32} />
                  <h4 className="font-bold">Analytics</h4>
               </div>
             </div>
           </div>
           <div className="order-1 md:order-2">
            <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6 inline-block">AI Technology</span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Smart Vendor Matching</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our AI algorithms analyze your requirements and instantly match you with the top 3 verified vendors best suited for your specific industry, size, and budget.
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              No more cold calls or spam. Only relevant connections that lead to closed deals.
            </p>
            <Link to="/enquiry" className="text-blue-600 font-bold text-lg hover:underline flex items-center">
              Try it now <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

       {/* CTA */}
       <div className="py-24 bg-slate-900 text-white text-center">
         <div className="max-w-4xl mx-auto px-4">
           <h2 className="text-4xl font-bold mb-8">Ready to streamline your IT procurement?</h2>
           <Link to="/enquiry" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl inline-block transition hover:-translate-y-1">
             Get Started for Free
           </Link>
         </div>
       </div>
    </div>
  );
};

export default Features;