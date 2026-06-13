import React from 'react';
import { Scale, FileText, ShieldAlert, Gavel, CreditCard, ChevronRight, Home, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Terms: React.FC = () => {
  const effectiveDate = "January 1, 2025";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO
        title="Terms & Conditions | BantConfirm"
        description="Review the Terms & Conditions for using BantConfirm. Understand user and vendor responsibilities, lead usage policies, and our limitation of liability."
        canonicalUrl="https://bantconfirm.com/terms"
      />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-white flex items-center transition-colors">
              <Home size={14} className="mr-1" />
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-blue-400 font-medium">Terms & Conditions</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-slate-400">Effective Date: {effectiveDate}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="prose prose-slate max-w-none">
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-100">
              <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                <Scale size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">Platform Agreement</h2>
                <p className="text-slate-500 m-0">Please read these terms carefully before using our marketplace.</p>
              </div>
            </div>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="text-indigo-600 mr-2" size={20} />
                1. Acceptance of Terms
              </h3>
              <p className="text-slate-600 leading-relaxed">
                By accessing or using the BantConfirm platform, you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
              </p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Users className="text-indigo-600 mr-2" size={20} />
                2. User Responsibilities
              </h3>
              <p className="text-slate-600 mb-4">As a user of the platform, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Provide accurate, current, and complete information during registration and enquiry submission.</li>
                <li>Maintain the security of your password and identification.</li>
                <li>Be fully responsible for all use of your account and for any actions that take place using your account.</li>
                <li>Use the platform only for lawful purposes and in accordance with these Terms.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <ShieldAlert className="text-indigo-600 mr-2" size={20} />
                3. Vendor Responsibilities
              </h3>
              <p className="text-slate-600 mb-4">Vendors listed on BantConfirm agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Provide genuine and high-quality services to buyers connected through the platform.</li>
                <li>Honor the quotes and commitments made to prospective clients.</li>
                <li>Maintain necessary licenses and certifications for the services offered.</li>
                <li>Respond to enquiries in a timely and professional manner.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Gavel className="text-indigo-600 mr-2" size={20} />
                4. Lead Usage Policy
              </h3>
              <p className="text-slate-600 leading-relaxed text-slate-600 mb-4">
                Our platform facilitates the connection between buyers and sellers based on BANT (Budget, Authority, Need, Timing) verification.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Leads provided to vendors are for their exclusive use and must not be resold or shared with third parties.</li>
                <li>Vendors must respect the privacy of the buyers and only contact them for the purpose of the specific enquiry.</li>
                <li>BantConfirm does not guarantee the conversion of any lead into a sale.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <div className="bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] mr-2">!</div>
                5. Prohibited Activities
              </h3>
              <p className="text-slate-600 mb-4">You may not access or use the platform for any purpose other than that for which we make it available. Prohibited activity includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Systematically retrieving data or other content from the platform to create or compile a collection, database, or directory without written permission.</li>
                <li>Trick, defraud, or mislead us and other users.</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the platform.</li>
                <li>Engage in unauthorized framing of or linking to the platform.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CreditCard className="text-indigo-600 mr-2" size={20} />
                6. Payment Terms
              </h3>
              <p className="text-slate-600 leading-relaxed text-slate-600">
                Certain aspects of the platform may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to change our prices at any time. By providing a payment method, you authorize us to charge the applicable fees to that payment method.
              </p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <ShieldAlert className="text-indigo-600 mr-2" size={20} />
                7. Limitation of Liability
              </h3>
              <p className="text-slate-600 leading-relaxed text-slate-600">
                In no event shall BantConfirm, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
              </p>
            </section>

            <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">8. Contact Information</h3>
              <p className="text-slate-600 mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> support@bantconfirm.com</p>
                <p><strong>Address:</strong> Noida, Uttar Pradesh, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;