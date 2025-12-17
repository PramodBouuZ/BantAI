import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Zap, Briefcase, MapPin, Phone, Mail, Lock, User as UserIcon, ChevronLeft, Check, ArrowLeft, Inbox, RefreshCw } from 'lucide-react';
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
  
  // Account Confirmation State
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    password: ''
  });

  // Timer effect for resend cooldown
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMsg('');
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    
    if (supabase) {
        setLoading(true);
        setErrorMsg(''); 
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
                options: {
                    // Explicitly include the hash fragment for HashRouter compatibility
                    emailRedirectTo: `${window.location.origin}/#/login`
                }
            });
            
            if (error) throw error;
            
            setErrorMsg('Verification email resent! Please check Spam if not found.');
            setResendTimer(60); 
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to resend email.");
        } finally {
            setLoading(false);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isForgotPassword) {
        if (!formData.email) {
            setErrorMsg("Please enter your email address.");
            setLoading(false);
            return;
        }

        if (supabase) {
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.origin}/#/login?reset=true`,
            });
            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }
        }
        
        setLoading(false);
        setResetSent(true);
        return;
    }

    if (isSignup) {
      if (!formData.name || !formData.mobile || !formData.location) {
        setErrorMsg("All fields are required for signup.");
        setLoading(false);
        return;
      }
    }

    // Admin Backdoor
    if (!isSignup && formData.email === 'admin@bantconfirm.com' && formData.password === 'admin123') {
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
         return;
    }

    if (supabase) {
      try {
        if (isSignup) {
           const { data, error } = await supabase.auth.signUp({
             email: formData.email,
             password: formData.password,
             options: {
               // Use precise hash redirect to ensure the user lands back correctly
               emailRedirectTo: `${window.location.origin}/#/login`, 
               data: {
                 full_name: formData.name,
                 role: selectedRole,
                 mobile: formData.mobile,
                 location: formData.location
               }
             }
           });
           if (error) throw error;
           
           if (data.user && !data.session) {
             setLoading(false);
             setConfirmationSent(true);
             return; 
           }

           if (data.user) {
             setCurrentUser({
                id: data.user.id,
                name: formData.name,
                email: formData.email,
                role: selectedRole,
                joinedDate: new Date().toISOString()
             });
             navigate(from + search);
             return;
           }
        } else {
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
        setErrorMsg(err.message);
        setLoading(false);
        return;
      }
    }
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

        {confirmationSent ? (
            <div className="text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-5 rounded-full text-blue-600">
                        <Inbox size={48} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    We've sent a verification link to<br/>
                    <span className="font-bold text-slate-800">{formData.email}</span>
                </p>
                
                {errorMsg && (
                    <div className="mb-6 p-3 rounded-lg text-sm font-bold bg-green-50 text-green-700 border border-green-100 animate-fade-in">
                        {errorMsg}
                    </div>
                )}

                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-2xl text-sm mb-6 text-left border border-yellow-100">
                    <strong>Note:</strong> Verification emails are sometimes marked as <strong>Spam</strong>. Please check there if you don't see it in your Inbox.
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleResendEmail}
                        disabled={resendTimer > 0 || loading}
                        className="w-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Verification Email'}
                            </>
                        )}
                    </button>

                    <button 
                        onClick={() => { setConfirmationSent(false); setIsSignup(false); setErrorMsg(''); }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl text-lg tracking-wide"
                    >
                        Return to Sign In
                    </button>
                </div>
            </div>
        ) : resetSent ? (
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
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md text-lg tracking-wide"
                >
                    Back to Sign In
                </button>
            </div>
        ) : (
            <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Welcome Back')}
                  </h2>
                </div>

                {errorMsg && (
                  <div className={`mb-6 p-4 rounded-xl text-sm font-bold text-center border animate-fade-in ${errorMsg.includes('Account created') || errorMsg.includes('resent') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {errorMsg}
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {isSignup && !isForgotPassword && (
                    <div className="animate-fade-in space-y-5">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <UserIcon size={20} className="text-slate-300" />
                        </div>
                        <input
                          name="name"
                          type="text"
                          required
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none transition-all font-medium"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <Phone size={20} className="text-slate-300" />
                        </div>
                        <input
                          name="mobile"
                          type="tel"
                          required
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none transition-all font-medium"
                          placeholder="Mobile Number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <MapPin size={20} className="text-slate-300" />
                        </div>
                        <input
                          name="location"
                          type="text"
                          required
                          className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none transition-all font-medium"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail size={20} className="text-slate-300" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none transition-all font-medium"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {!isForgotPassword && (
                      <div className="relative group animate-fade-in">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Lock size={20} className="text-slate-300" />
                         </div>
                         <input
                            name="password"
                            type="password"
                            required
                            className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 focus:outline-none transition-all font-medium"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                      </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-sm text-lg tracking-wide"
                    >
                      {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Sign Up' : 'Sign In'))}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-8">
                  <p className="text-slate-400 text-sm font-medium">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button 
                      onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }} 
                      className="font-bold text-blue-600 hover:text-blue-700 ml-1"
                    >
                      {isSignup ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default Login;