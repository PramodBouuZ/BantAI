import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronRight, Home, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Privacy: React.FC = () => {
  const effectiveDate = "January 1, 2025";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO
        title="Privacy Policy | BantConfirm"
        description="Read our Privacy Policy to understand how BantConfirm collects, uses, and protects your data. We are committed to maintaining your trust and privacy."
        canonicalUrl="https://bantconfirm.com/privacy"
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
            <span className="text-blue-400 font-medium">Privacy Policy</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Effective Date: {effectiveDate}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          <div className="prose prose-slate max-w-none">
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-100">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                <Shield size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">Our Commitment</h2>
                <p className="text-slate-500 m-0">Your privacy is our top priority at BantConfirm.</p>
              </div>
            </div>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="text-blue-600 mr-2" size={20} />
                1. Introduction
              </h3>
              <p className="text-slate-600 leading-relaxed">
                BantConfirm ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website bantconfirm.com and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Eye className="text-blue-600 mr-2" size={20} />
                2. Data Collection
              </h3>
              <p className="text-slate-600 mb-4">We collect information that you provide directly to us when you:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Register for an account or create a profile.</li>
                <li>Submit an enquiry through our BANT form.</li>
                <li>Register as a vendor or service provider.</li>
                <li>Sign up for our newsletter or marketing communications.</li>
                <li>Contact us via email, phone, or chat.</li>
              </ul>
              <p className="text-slate-600 mt-4">This information may include your name, email address, phone number, company name, job title, and specific business requirements.</p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Lock className="text-blue-600 mr-2" size={20} />
                3. Use of Information
              </h3>
              <p className="text-slate-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Provide, operate, and maintain our marketplace.</li>
                <li>Connect buyers with verified service providers based on BANT criteria.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Understand and analyze how you use our website.</li>
                <li>Develop new products, services, features, and functionality.</li>
                <li>Process transactions and manage accounts.</li>
                <li>Send you technical notices, updates, and support messages.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <div className="bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] mr-2">C</div>
                4. Cookies and Tracking Technologies
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Shield className="text-blue-600 mr-2" size={20} />
                5. Data Security
              </h3>
              <p className="text-slate-600 leading-relaxed">
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. We implement various security measures including encryption, firewalls, and secure socket layer (SSL) technology.
              </p>
            </section>

            <section className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Users className="text-blue-600 mr-2" size={20} />
                6. Third-Party Services
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We may employ third-party companies and individuals to facilitate our service ("Service Providers"), to provide the service on our behalf, to perform service-related services or to assist us in analyzing how our service is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. This includes services like Supabase for database management and Google Analytics for traffic analysis.
              </p>
            </section>

            <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">7. Contact Information</h3>
              <p className="text-slate-600 mb-4">
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us:
              </p>
              <div className="space-y-2 text-slate-700">
                <p><strong>Email:</strong> support@bantconfirm.com</p>
                <p><strong>Address:</strong> Noida, Uttar Pradesh, India</p>
                <p><strong>Phone:</strong> +91 (your-phone-number)</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;