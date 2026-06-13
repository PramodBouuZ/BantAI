
import React from 'react';
import { Shield, ScrollText, Clock, FileCheck } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-6">
            <ScrollText size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-500 font-medium text-lg">Last updated: May 24, 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-slate prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl mb-12">
            <p className="text-blue-800 font-medium m-0">
              Welcome to BantConfirm. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              BantConfirm ("we," "us," or "our") provides an AI-powered B2B marketplace. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">2</span>
              Service Description
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              BantConfirm operates as a marketplace connecting business buyers with technology and service providers. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Listing and comparison of B2B products and services.</li>
              <li>AI-powered BANT (Budget, Authority, Need, Timing) qualification for enquiries.</li>
              <li>Lead generation and management tools for vendors.</li>
              <li>Consultation services through our AI agents.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">3</span>
              User Responsibilities
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">Users of the platform agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Provide accurate and complete information during registration and enquiry.</li>
              <li>Maintain the confidentiality of their account credentials.</li>
              <li>Use the platform for lawful business purposes only.</li>
              <li>Not engage in any activity that interferes with or disrupts the services.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">4</span>
              Vendor Obligations
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vendors registering on BantConfirm must ensure that their product listings, pricing, and service descriptions are accurate and up-to-date. Vendors are responsible for fulfilling the requirements of the leads assigned to them through the platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">5</span>
              Intellectual Property
            </h2>
            <p className="text-slate-600 leading-relaxed">
              All content on the BantConfirm platform, including text, graphics, logos, and AI algorithms, is the property of BantConfirm India Pvt Ltd or its content suppliers and is protected by international copyright and intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">6</span>
              Limitation of Liability
            </h2>
            <p className="text-slate-600 leading-relaxed">
              BantConfirm acts as a facilitator and does not guarantee the performance or quality of products/services provided by third-party vendors. We shall not be liable for any direct, indirect, or consequential damages resulting from the use of our platform or services.
            </p>
          </section>

          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileCheck size={24} />
              </div>
              <h3 className="text-xl font-bold">Need Clarification?</h3>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact our legal team at legal@bantconfirm.com.
            </p>
            <button onClick={() => window.location.href = 'mailto:legal@bantconfirm.com'} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black hover:bg-blue-50 transition shadow-lg">Contact Legal Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
