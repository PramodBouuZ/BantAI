import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Zap, Mail, Lock, User as UserIcon, ChevronLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  setCurrentUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const search = location.state?.from?.search || '';
  
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Admin Backdoor
    if (!isSignup && formData.email === 'admin@bantconfirm.com' && formData.password === 'admin123') {
         setCurrentUser({
             id: 'admin_1',
             name: 'Super Admin',
             email: 'admin@bantconfirm.com',
             role: 'admin',
             joinedDate: new Date().toISOString()
         });
         setLoading(false);
         navigate(from + search);
         return;
    }

    if (supabase) {
      try {
        if (isSignup) {
           const { data, error } = await supabase.auth.signUp({
             email: formData.email,
             password: formData.password,
             options: {
               data: {
                 full_name: formData.name,
                 role: 'user',
                 mobile: formData.mobile,
                 location: formData.location
               }
             }
           });
           if (error) throw error;
           if (data.user) {
             setErrorMsg("Account created! Please check your email for a verification link.");
           }
        } else {
           const { data, error } = await supabase.auth.signInWithPassword({
             email: formData.email,
             password: formData.password,
           });
           if (error) throw error;
           if (data.user) {
             const meta = data.user.user_metadata || {};
             setCurrentUser({
                id: data.user.id,
                name: meta.full_name || 'User',
                email: data.user.email || '',
                role: (data.user.email === 'admin@bantconfirm.com' ? 'admin' : (meta.role || 'user')) as any,
                joinedDate: new Date().toISOString()
             });
             navigate(from + search);
           }
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Supabase is not configured. Using local mode.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-4 md:top-10 md:left-10 text-blue-600 hover:text-blue-700 transition-transform hover:scale-110 p-2"
      >
        <ChevronLeft size={40} strokeWidth={2.5} />
      </button>

      <div className="max-w-[440px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50">
        
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-tr from-yellow-100 to-amber-50 p-4 rounded-3xl shadow-sm">
            <Zap size={32} className="text-yellow-500 fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 font-medium">India's Premier B2B Marketplace</p>
        </div>

        {errorMsg && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold border flex items-start gap-2 ${errorMsg.includes('verification') || errorMsg.includes('Account created') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="space-y-5 animate-fade-in">
              <div className="relative">
                <UserIcon size={20} className="absolute left-5 top-4 text-slate-300" />
                <input name="name" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Full Name" value={formData.name} onChange={handleInputChange} />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail size={20} className="absolute left-5 top-4 text-slate-300" />
            <input name="email" type="email" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
          </div>

          <div className="relative">
             <Lock size={20} className="absolute left-5 top-4 text-slate-300" />
             <input name="password" type="password" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Password" value={formData.password} onChange={handleInputChange} />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl text-lg tracking-wide disabled:opacity-50">
              {loading ? 'Working...' : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm font-medium">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }} className="font-bold text-blue-600 hover:text-blue-700 ml-1">
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;