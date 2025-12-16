import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2, Search, Check, Building2, User, Phone, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { User as UserType } from '../types';

interface BantFormProps {
  isLoggedIn: boolean;
  currentUser: UserType | null;
}

const BantForm: React.FC<BantFormProps> = ({ isLoggedIn, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLead, addNotification } = useData();
  
  // Get product if passed in URL
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('product');
  const type = searchParams.get('type');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState(0); 
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    location: '',
    budget: '',
    authority: '',
    need: '',
    timing: '',
  });

  // Protect the route
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/enquiry', search: location.search } } });
    }
  }, [isLoggedIn, navigate, location.search]);

  // Pre-fill form if user is logged in
  useEffect(() => {
      if (currentUser) {
          setFormData(prev => ({
              ...prev,
              name: currentUser.name,
              email: currentUser.email,
              mobile: currentUser.mobile || prev.mobile,
              company: currentUser.company || prev.company,
              location: currentUser.location || prev.location
          }));
      }
  }, [currentUser]);

  if (!isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to Context (Simulate Database Save)
    const newLead = {
      id: `L${Date.now()}`,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      location: formData.location,
      company: formData.company || 'Not Provided',
      service: productId ? `Product ID: ${productId}` : (type === 'consult' ? 'General Consulting' : 'Custom Requirement'),
      requirement: formData.need,
      budget: formData.budget,
      authority: formData.authority,
      timing: formData.timing,
      status: 'Pending' as const,
      date: new Date().toISOString().split('T')[0]
    };

    addLead(newLead);
    
    // Notify user of success/email
    // Note: For real emails, this would trigger a Supabase Edge Function
    addNotification('Requirement posted successfully! A confirmation email has been sent.', 'success');
    
    // Simulate AI Matching Automation
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;
        setMatchingStatus(progress);
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        }
    }, 300);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (isSubmitting) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
              <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-gray-100 animate-fade-in">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                       <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                           <Search className="text-blue-600" size={32} />
                       </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Matching in Progress</h3>
                  <p className="text-slate-500 mb-8 text-lg">Saving your requirement and notifying vendors...</p>
                  
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                      <div className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out" style={{ width: `${matchingStatus}%` }}></div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-12 rounded-3xl shadow-xl border border-gray-100 animate-slide-up">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            {productId ? 'Request Quote' : 'Post Business Requirement'}
          </h2>
          <p className="text-lg text-slate-600">
            Fill in your details to connect with verified vendors.
          </p>
          
          <div className="flex justify-center mt-8 space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2.5 w-20 rounded-full transition-colors duration-300 ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><User size={16} className="mr-2"/> Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Phone size={16} className="mr-2"/> Mobile</label>
                    <input type="tel" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
                      value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91 99999 99999" />
                 </div>
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><Building2 size={16} className="mr-2"/> Company Name <span className="text-slate-400 font-normal ml-1">(Optional)</span></label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Your Company Ltd" />
              </div>
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center"><MapPin size={16} className="mr-2"/> Location</label>
                  <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City, State" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">What are you looking for?</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                  placeholder="Describe your specific requirement, quantity, and preferences..."
                  value={formData.need}
                  onChange={(e) => setFormData({...formData, need: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">Budget Estimate</label>
                    <select 
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 bg-white"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    >
                    <option value="">Select Budget</option>
                    <option value="<10k">Less than ₹10,000</option>
                    <option value="10k-50k">₹10,000 - ₹50,000</option>
                    <option value="50k-1L">₹50,000 - ₹1 Lakh</option>
                    <option value="1L+">More than ₹1 Lakh</option>
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">Timeline</label>
                    <select 
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 bg-white"
                    value={formData.timing}
                    onChange={(e) => setFormData({...formData, timing: e.target.value})}
                    required
                    >
                    <option value="">When?</option>
                    <option value="Immediate">Immediate</option>
                    <option value="1 Week">Within 1 Week</option>
                    <option value="1 Month">Within 1 Month</option>
                    </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start">
                  <AlertCircle className="text-blue-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <p className="text-base text-blue-800 font-medium leading-relaxed">
                    By submitting, you agree to receive quotes from verified vendors. Your details will be visible to matched partners.
                  </p>
               </div>
               <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">Confirm Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">Authority Level</label>
                <div className="flex gap-4 flex-wrap">
                   {['Decision Maker', 'Influencer', 'Researcher'].map((opt) => (
                     <label key={opt} className={`flex-1 min-w-[150px] flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${formData.authority === opt ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 hover:bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name="authority" 
                          value={opt} 
                          className="sr-only"
                          checked={formData.authority === opt}
                          onChange={(e) => setFormData({...formData, authority: e.target.value})}
                        />
                        <span>{opt}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="text-slate-500 font-bold text-lg hover:text-slate-800 px-4 py-2"
              >
                Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                // Simple validation check: Removed company from required check
                disabled={step === 1 && (!formData.name || !formData.mobile || !formData.location)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg flex items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ChevronRight size={20} className="ml-2" />
              </button>
            ) : (
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center transform hover:-translate-y-1"
              >
                Submit Enquiry <CheckCircle2 size={24} className="ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BantForm;