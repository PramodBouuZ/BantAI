import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Contact BantConfirm - IT Procurement Support"
        description="Get in touch with the BantConfirm team in Noida. Support for vendors and buyers. Email us at support@bantconfirm.com."
      />

      <div className="bg-slate-900 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-slate-300">We'd love to hear from you. Our team is always here to help.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Our Office</h3>
                  <p className="text-slate-600 text-lg">
                    Noida, Uttar Pradesh, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600 text-lg">
                    support@bantconfirm.com<br />
                    sales@bantconfirm.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600 text-lg">
                    Mon-Fri from 9am to 6pm IST
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">For Vendors</h3>
              <p className="text-slate-600 mb-4">
                Interested in listing your services on BantConfirm? We are looking for top-tier IT service providers.
              </p>
              <button 
                onClick={() => navigate('/vendor-register')} 
                className="text-blue-600 font-bold hover:underline flex items-center"
              >
                Join as a Vendor &rarr;
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                  <option>General Inquiry</option>
                  <option>Support Request</option>
                  <option>Sales Inquiry</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="How can we help you today?"></textarea>
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                Send Message <Send size={20} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;