
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2, Search, Check, Building2, User, Phone, MapPin, Sparkles, Database, Cpu, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';
import { User as UserType } from '../types';

interface BantFormProps {
  isLoggedIn: boolean;
  currentUser: UserType | null;
}

const BantForm: React.FC<BantFormProps> = ({ isLoggedIn, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addLead } = useData();
  
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/enquiry', search: location.search } } });
    }
  }, [isLoggedIn, navigate, location.search]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newLead = {
      id: `L${Date.now()}`,
      name: formData.name || 'Anonymous User',
      email: formData.email || 'not-provided@bantconfirm.com',
      mobile: formData.mobile || 'Not Provided',
      location: formData.location || 'Not Provided',
      company: formData.company || 'Not Provided',
      service: productId ? `Product ID: ${productId}` : (type === 'consult' ? 'General Consulting' : 'Custom Requirement'),
      requirement: formData.need || 'Custom Requirement',
      budget: formData.budget || 'Not Provided',
      authority: formData.authority || 'Not Provided',
      timing: formData.timing || 'Not Provided',
      status: 'Pending' as const,
      date: new Date().toISOString().split('T')[0]
    };

    const savedSuccessfully = await addLead(newLead);
    
    if (savedSuccessfully) {
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10) + 5;
          if (progress > 100) progress = 100;
          setMatchingStatus(progress);
          
          if (progress === 100) {
              clearInterval(interval);
              setTimeout(() => {
                  navigate('/dashboard');
              }, 800);
          }
      }, 200);
    } else {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (isSubmitting) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-50"></div>
              
              <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl text-center border border-white/10 animate-fade-in relative z-10">
                  <div className="relative w-32 h-32 mx-auto mb-10">
                       <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-pulse"></div>
                       <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin duration-700"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                           <Cpu className="text-indigo-400 animate-pulse" size={48} />
                       </div>
                       <div className="absolute -top-2 -right-2">
                           <Sparkles className="text-yellow-400 animate-bounce" />
                       </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">AI Neural Matching</h3>
                  <div className="space-y-2 mb-10">
                    <p className="text-indigo-200 text-sm font-medium animate-pulse">
                        {matchingStatus < 30 ? "Analyzing BANT Parameters..." : 
                         matchingStatus < 60 ? "Searching Vendor Database..." : 
                         matchingStatus < 90 ? "Calculating Confidence Scores..." : "Optimizing Matching Matrix..."}
                    </p>
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${matchingStatus}%` }}></div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 opacity-50">
                    <div className={`h-1 rounded-full ${matchingStatus > 25 ? 'bg-indigo-400' : 'bg-white/10'}`}></div>
                    <div className={`h-1 rounded-full ${matchingStatus > 55 ? 'bg-indigo-400' : 'bg-white/10'}`}></div>
                    <div className={`h-1 rounded-full ${matchingStatus > 85 ? 'bg-indigo-400' : 'bg-white/10'}`}></div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-12 rounded-3xl shadow-xl border border-gray-100 animate-slide-up">
        <div className="text-center">
          <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100">
            <Sparkles size={14} className="mr-2" /> AI-Powered Verification
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            {productId ? 'Request Direct Quote' : 'AI-Matched Requirement'}
          </h2>
          <p className="text-lg text-slate-600">
            Our AI engine will analyze your needs and connect you with the top 3 verified partners.
          </p>
          
          <div className="flex justify-center mt-10 space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`h-2.5 w-24 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-gray-100'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-3.5 text-slate-300" />
                        <input type="text" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl outline-none transition-all font-medium" 
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Mobile</label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-4 top-3.5 text-slate-300" />
                        <input type="tel" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl outline-none transition-all font-medium" 
                          value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+91..." />
                    </div>
                 </div>
              </div>
              <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Company</label>
                  <div className="relative">
                      <Building2 size={18} className="absolute left-4 top-3.5 text-slate-300" />
                      <input type="text" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl outline-none transition-all font-medium" 
                        value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Acme Inc." />
                  </div>
              </div>
              <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Current Location</label>
                  <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-slate-300" />
                      <input type="text" required className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl outline-none transition-all font-medium" 
                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Noida, Sector 62" />
                  </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3 flex items-center">
                    <Database size={20} className="mr-2 text-indigo-500" /> What are your business requirements?
                </label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-4 text-lg bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-2xl outline-none transition-all"
                  placeholder="Tell us about the project size, users, and specific tech needs..."
                  value={formData.need}
                  onChange={(e) => setFormData({...formData, need: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Project Budget Range</label>
                    <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 outline-none"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    >
                    <option value="">Select Range</option>
                    <option value="<10k">Less than ₹10,000</option>
                    <option value="10k-50k">₹10,000 - ₹50,000</option>
                    <option value="50k-1L">₹50,000 - ₹1 Lakh</option>
                    <option value="1L-5L">₹1 Lakh - ₹5 Lakh</option>
                    <option value="5L+">More than ₹5 Lakh</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Implementation Timeline</label>
                    <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-100 outline-none"
                    value={formData.timing}
                    onChange={(e) => setFormData({...formData, timing: e.target.value})}
                    required
                    >
                    <option value="">Select Deadline</option>
                    <option value="Immediate">ASAP / Immediate</option>
                    <option value="1 Week">Within 7 Days</option>
                    <option value="1 Month">Next 30 Days</option>
                    <option value="Future">Researching for Q3/Q4</option>
                    </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start">
                  <Sparkles className="text-indigo-600 mt-1 mr-4 flex-shrink-0" size={24} />
                  <p className="text-base text-indigo-800 font-medium leading-relaxed">
                    By submitting, our AI algorithm will identify <strong>3 certified partners</strong> matching your BANT profile and invite them to bid on your project.
                  </p>
               </div>
               <div className="space-y-1">
                <label className="block text-sm font-bold text-slate-700 ml-1">Confirmation Email</label>
                <div className="relative">
                    <Mail size={18} className="absolute left-4 top-3.5 text-slate-300" />
                    <input 
                      type="email" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl outline-none transition-all font-medium"
                      placeholder="business@company.in"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-4">Are you the primary decision maker?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   {['Decision Maker', 'Influencer', 'Evaluator'].map((opt) => (
                     <label key={opt} className={`flex items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.authority === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 hover:bg-slate-50 text-slate-500'}`}>
                        <input 
                          type="radio" 
                          name="authority" 
                          value={opt} 
                          className="sr-only"
                          checked={formData.authority === opt}
                          onChange={(e) => setFormData({...formData, authority: e.target.value})}
                        />
                        <span className="text-sm">{opt}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-10 border-t border-slate-100">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="text-slate-400 font-bold text-lg hover:text-slate-700 px-6 py-2 transition"
              >
                Previous
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                disabled={step === 1 && (!formData.name || !formData.mobile || !formData.location)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 disabled:opacity-30 disabled:grayscale"
              >
                Continue <ChevronRight size={20} className="ml-2" />
              </button>
            ) : (
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center transform hover:-translate-y-1"
              >
                Analyze & Post <Sparkles size={20} className="ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BantForm;
