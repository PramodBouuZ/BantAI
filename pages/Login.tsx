import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Zap, Briefcase, MapPin, Phone, Mail, Lock, User as UserIcon, ChevronLeft, Check, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';

interface LoginProps {
  setCurrentUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const search = location.state?.from?.search || '';
  const { addUser, users } = useData();

  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'vendor'>('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    password: ''
  });

  // PRODUCTION URL: Hardcoded to ensure email links open the live site, not localhost
  const SITE_URL = 'https://bantconfirm.com';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // --- FORGOT PASSWORD FLOW ---
    if (isForgotPassword) {
        if (!formData.email) {
            setErrorMsg("Please enter your email address.");
            setLoading(false);
            return;
        }

        // Supabase Reset
        if (supabase) {
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                // Force redirect to live site
                redirectTo: `${SITE_URL}/#/login?reset=true`,
            });
            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }
        }
        
        // Mock Success
        setTimeout(() => {
            setLoading(false);
            setResetSent(true);
        }, 1500);
        return;
    }

    // --- EXISTING AUTH FLOW ---

    // Basic Validation
    if (isSignup) {
      if (!formData.name || !formData.mobile || !formData.location) {
        setErrorMsg("Please fill in all details including Name, Mobile, and Location.");
        setLoading(false);
        return;
      }
    }

    // --- 1. ADMIN BACKDOOR (Always Check First) ---
    if (!isSignup && formData.email === 'admin@bantconfirm.com' && formData.password === 'admin123') {
       setTimeout(() => {
         const adminUser: User = {
             id: 'admin_1',
             name: 'Super Admin',
             email: 'admin@bantconfirm.com',
             role: 'admin',
             joinedDate: new Date().toISOString()
         };
         setCurrentUser(adminUser);
         setLoading(false);
         navigate(from + search);
       }, 500);
       return;
    }

    // --- 2. SUPABASE AUTH ---
    if (supabase) {
      try {
        if (isSignup) {
           const { data, error } = await supabase.auth.signUp({
             email: formData.email,
             password: formData.password,
             options: {
               // CRITICAL: Force redirect to the live domain. 
               // Even if you are testing on localhost, the email link will open the live site.
               emailRedirectTo: SITE_URL, 
               data: {
                 full_name: formData.name,
                 role: selectedRole,
                 mobile: formData.mobile,
                 location: formData.location
               }
             }
           });
           if (error) throw error;
           
           // If email confirmation is required, Supabase returns user but session might be null
           if (data.user && !data.session) {
             setLoading(false);
             // Show a specific message about checking email
             setErrorMsg("Account created! Please check your email to confirm your account.");
             return; 
           }

           if (data.user) {
             const newUser: User = {
                id: data.user.id,
                name: formData.name,
                email: formData.email,
                role: selectedRole,
                mobile: formData.mobile,
                location: formData.location,
                joinedDate: new Date().toISOString().split('T')[0]
             };
             addUser(newUser);
             setCurrentUser(newUser);
             navigate(from + search);
             return;
           }
        } else {
           // Login
           const { data, error } = await supabase.auth.signInWithPassword({
             email: formData.email,
             password: formData.password,
           });
           if (error) throw error;
           if (data.user) {
             const meta = data.user.user_metadata || {};
             const role = (data.user.email === 'admin@bantconfirm.com') ? 'admin' : (meta.role || 'user');

             setCurrentUser({
                id: data.user.id,
                name: meta.full_name || 'User',
                email: data.user.email || '',
                role: role as any,
                joinedDate: new Date().toISOString()
             });
             navigate(from + search);
             return;
           }
        }
      } catch (err: any) {
        console.error("Supabase Auth Error:", err);
        if (err.message && !err.message.includes("configured")) {
           setErrorMsg(err.message === "Invalid login credentials" ? "Invalid login credentials. If you are the admin, use the default password." : err.message);
           setLoading(false);
           return;
        }
      }
    }

    // --- 3. MOCK AUTH FALLBACK ---
    setTimeout(() => {
      // Signup Logic
      if (isSignup) {
          const newUser: User = {
              id: `u_${Date.now()}`,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              location: formData.location,
              role: selectedRole,
              joinedDate: new Date().toISOString().split('T')[0]
          };
          addUser(newUser);
          setCurrentUser(newUser);
          setLoading(false);
          navigate(from + search);
          return;
      }

      // Login Logic
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
          setCurrentUser(existingUser);
      } else {
          const tempUser: User = {
              id: `u_temp_${Date.now()}`,
              name: 'Demo User',
              email: formData.email,
              role: selectedRole,
              mobile: '+91 99999 00000',
              location: 'India',
              joinedDate: new Date().toISOString().split('T')[0]
          };
          setCurrentUser(tempUser);
      }

      setLoading(false);
      navigate(from + search);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-4 md:top-10 md:left-10 text-blue-600 hover:text-blue-700 transition-transform hover:scale-110 p-2"
        aria-label="Go back"
      >
        <ChevronLeft size={40} strokeWidth={2.5} />
      </button>

      <div className="max-w-[440px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50">
        
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-tr from-yellow-100 to-amber-50 p-4 rounded-3xl shadow-sm">
            <Zap size={32} className="text-yellow-500 fill-current" />
          </div>
        </div>

        {resetSent ? (
            <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full text-green-600">
                        <Mail size={48} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your mail</h2>
                <p className="text-slate-500 mb-8">We have sent password recovery instructions to your email.</p>
                <button 
                    onClick={() => { setResetSent(false); setIsForgotPassword(false); setIsSignup(false); }}
                    className="w-full bg-[#C5D9FC] hover:bg-[#AEC9FA] text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md text-lg tracking-wide"
                >
                    Back to Sign In
                </button>
            </div>
        ) : (
            <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-300 mb-2">
                    {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Welcome Back')}
                  </h2>
                  <p className="text-slate-300 text-sm font-medium tracking-wide">
                    {isForgotPassword 
                        ? 'Enter your email to receive instructions' 
                        : (isSignup ? 'Sign up to get started' : 'Sign in to access your dashboard')}
                  </p>
                </div>

                {errorMsg && (
                  <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center border animate-fade-in ${errorMsg.includes('Account created') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {errorMsg}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  
                  {isSignup && !isForgotPassword && (
                    <div className="animate-fade-in space-y-5">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <UserIcon size={20} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                          name="name"
                          type="text"
                          required={isSignup}
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Phone size={20} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                          name="mobile"
                          type="tel"
                          required={isSignup}
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"
                          placeholder="Mobile Number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <MapPin size={20} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                          name="location"
                          type="text"
                          required={isSignup}
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail size={20} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {!isForgotPassword && (
                      <div className="relative group animate-fade-in">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Lock size={20} className="text-slate-300 group-focus-within:text-blue-400 transition-colors" />
                         </div>
                         <input
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all font-medium"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                      </div>
                  )}

                  {!isSignup && !isForgotPassword && (
                    <div className="flex items-center justify-between px-1 animate-fade-in">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                           <input type="checkbox" className="peer sr-only" />
                           <div className="w-5 h-5 border-2 border-slate-200 rounded-md peer-checked:bg-blue-200 peer-checked:border-blue-200 transition-all group-hover:border-blue-200"></div>
                           <Check size={12} className="absolute top-1 left-1 text-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                        </div>
                        <span className="ml-2 text-sm text-slate-300 font-medium group-hover:text-slate-400 transition-colors">Remember me</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }}
                        className="text-sm font-bold text-blue-200 hover:text-blue-400 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#C5D9FC] hover:bg-[#AEC9FA] text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg tracking-wide"
                    >
                      {loading 
                        ? (isForgotPassword ? 'Sending...' : (isSignup ? 'Creating...' : 'Signing in...')) 
                        : (isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Sign Up' : 'Sign In'))}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-8">
                  {isForgotPassword ? (
                      <button 
                        onClick={() => { setIsForgotPassword(false); setErrorMsg(''); }}
                        className="text-slate-300 text-sm font-medium hover:text-blue-400 transition-colors flex items-center justify-center w-full"
                      >
                         <ArrowLeft size={16} className="mr-1" /> Back to Sign In
                      </button>
                  ) : (
                      <p className="text-slate-300 text-sm font-medium">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button 
                          onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }} 
                          className="font-bold text-[#C5D9FC] hover:text-blue-400 transition-colors ml-1"
                        >
                          {isSignup ? "Sign In" : "Sign Up"}
                        </button>
                      </p>
                  )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Login;