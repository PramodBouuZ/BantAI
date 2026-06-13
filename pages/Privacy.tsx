
import React from 'react';
import { Shield, Lock, Eye, Database, Bell } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-2xl mb-6">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium text-lg">Last updated: May 24, 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate prose-lg max-w-none">
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl mb-12">
            <p className="text-green-800 font-medium m-0">
              At BantConfirm, your privacy is our top priority. We are committed to protecting your personal and business data through transparent practices and robust security.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <Eye className="text-blue-600" size={24} />
              Information We Collect
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To provide our AI-powered marketplace services, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Account Information:</strong> Name, email, mobile number, and company details.</li>
              <li><strong>Requirement Data:</strong> Information provided in enquiries (budget, needs, timing).</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and platform usage statistics.</li>
              <li><strong>Vendor Data:</strong> Professional information, product catalogs, and performance metrics.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <Database className="text-blue-600" size={24} />
              How We Use Your Data
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Facilitate connections between buyers and verified vendors.</li>
              <li>Train our AI models for better BANT qualification (anonymized data).</li>
              <li>Send critical service updates and marketplace notifications.</li>
              <li>Improve platform performance and user experience.</li>
              <li>Prevent fraudulent activities and ensure platform security.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <Lock className="text-blue-600" size={24} />
              Data Security & Sharing
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We implement industry-standard encryption and security protocols. Your data is only shared with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Selected Vendors:</strong> When you post an enquiry for specific services.</li>
              <li><strong>Service Providers:</strong> Partners that help us operate our infrastructure (e.g., Supabase, Vercel).</li>
              <li><strong>Legal Authorities:</strong> When required by Indian law or to protect our legal rights.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
              <Bell className="text-blue-600" size={24} />
              Your Privacy Rights
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">As a user, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Access and download your personal data.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Delete your account and associated data ("Right to be Forgotten").</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
          </section>

          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-green-500 rounded-lg">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold">Data Privacy Inquiries</h3>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              If you have any concerns regarding your data privacy or wish to exercise your rights, please reach out to our Data Protection Officer.
            </p>
            <button onClick={() => window.location.href = 'mailto:privacy@bantconfirm.com'} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black hover:bg-green-50 transition shadow-lg">Email Privacy Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
