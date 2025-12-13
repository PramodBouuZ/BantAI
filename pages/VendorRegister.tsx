import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Phone, Mail, MapPin, Package, MessageSquare, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const VendorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    mobile: '',
    email: '',
    location: '',
    productName: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  if (isSuccess) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
              <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted!</h2>
                  <p className="text-slate-600 mb-8">Thank you for your interest. Our vendor onboarding team will verify your details and contact you shortly.</p>
                  <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                      Return Home
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO title="Vendor Registration - BantConfirm" description="Join BantConfirm as a verified vendor." />
      <div className="bg-slate-900 text-white py-16 text-center">
         <h1 className="text-4xl font-bold mb-4">Join as a Vendor</h1>
         <p className="text-slate-300">Expand your business reach with high-intent leads.</p>
      </div>
      
      <div className="max-w-3xl mx-auto px-4 py-16">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                      <div className="relative">
                          <User className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required name="name" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Full Name" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                      <div className="relative">
                          <Building2 className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required name="companyName" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Company Pvt Ltd" />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                      <div className="relative">
                          <Phone className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required name="mobile" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="+91 98765 43210" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                          <Mail className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required type="email" name="email" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="you@company.com" />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                      <div className="relative">
                          <MapPin className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required name="location" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="City, State" />
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Primary Product/Service</label>
                      <div className="relative">
                          <Package className="absolute top-3.5 left-4 text-slate-400" size={20} />
                          <input required name="productName" onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. CRM, Leased Line" />
                      </div>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Additional Details</label>
                  <div className="relative">
                      <MessageSquare className="absolute top-3.5 left-4 text-slate-400" size={20} />
                      <textarea name="message" onChange={handleChange} rows={4} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Tell us more about your services..."></textarea>
                  </div>
              </div>

              <button disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-70">
                  {isSubmitting ? 'Submitting...' : 'Register as Vendor'}
              </button>
          </form>
      </div>
    </div>
  );
};

export default VendorRegister;