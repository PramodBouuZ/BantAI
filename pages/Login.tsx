import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Zap, Phone, Mail, Lock, User as UserIcon, ChevronLeft, RefreshCw, Inbox, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
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
  
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole] = useState<'user' | 'vendor'>('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfigHelp, setShowConfigHelp] = useState(false);
  
  // States for verification handling
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
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

  // Countdown timer for resending email
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Handle URL parameters (e.g., coming back from a confirmation link)
  useEffect(() => {
    // Check both query params and hash params which Supabase uses
    const hash = window.location.hash;
    const hasVerified = hash.includes('type=signup') || hash.includes('verified=true') || hash.includes('access_token=');
    
    if (hasVerified) {
        setErrorMsg("Email verification detected! Please sign in with your credentials.");
        // Clear the hash after a moment to clean the URL
        setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }, 1000);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0 || !formData.email) return;
    
    setLoading(true);
    setErrorMsg(''); 
    
    if (supabase) {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
                options: {
                    // Force the redirect to the hash-route login
                    emailRedirectTo: `https://bantconfirm.com/#/login?verified=true`
                }
            });
            
            if (error) throw error;
            
            setErrorMsg('A fresh verification link has been sent! Please check your Inbox and Spam folders.');
            setResendTimer(60); 
            setConfirmationSent(true);
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to resend. Note: Supabase limits emails to 3 per hour on the free tier.");
        } finally {
            setLoading(false);
        }
    } else {
        setErrorMsg("Authentication service is currently unavailable.");
        setLoading(false);
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
                redirectTo: `https://bantconfirm.com/#/login?reset=true`,
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
               emailRedirectTo: `https://bantconfirm.com/#/login?verified=true`, 
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
      }
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

      <div className="max-w-[440px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50 overflow-hidden">
        
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    We've sent a verification link to<br/>
                    <span className="font-bold text-slate-800">{formData.email}</span>
                </p>
                
                <div className="bg-amber-50 text-amber-800 p-5 rounded-2xl text-sm mb-8 text-left border border-amber-100 space-y-3">
                    <div className="flex items-start">
                        <AlertCircle size={16} className="mr-2 mt-0.5 shrink-0" />
                        <p><strong>Check Spam/Junk:</strong> Emails from <em>noreply@supabase.co</em> are often filtered.</p>
                    </div>
                    <div className="flex items-start">
                        <HelpCircle size={16} className="mr-2 mt-0.5 shrink-0" />
                        <p><strong>Wait 2-3 Minutes:</strong> Verification emails can sometimes take a few minutes to arrive.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleResendEmail}
                        disabled={resendTimer > 0 || loading}
                        className="w-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin mr-2" /> : <RefreshCw size={18} className="mr-2" />}
                        {resendTimer > 0 ? `Resend link in ${resendTimer}s` : 'Resend Link Now'}
                    </button>

                    <button 
                        onClick={() => { setConfirmationSent(false); setIsSignup(false); setErrorMsg(''); }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-lg"
                    >
                        Return to Sign In
                    </button>
                </div>
            </div>
        ) : (
            <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {isForgotPassword ? 'Reset Password' : (isSignup ? 'Create Account' : 'Welcome Back')}
                  </h2>
                  <p className="text-slate-400 font-medium">India's Premier B2B Marketplace</p>
                </div>

                {errorMsg && (
                  <div className={`mb-6 p-5 rounded-2xl text-sm font-bold border animate-fade-in ${errorMsg.includes('verification') || errorMsg.includes('sent') || errorMsg.includes('verified') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    <div className="flex flex-col">
                        <div className="flex items-start">
                            <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
                            <p>{errorMsg}</p>
                        </div>
                        
                        {/* SPECIAL CASE: Email Not Confirmed */}
                        {errorMsg.toLowerCase().includes('email not confirmed') && (
                            <div className="mt-4 pt-4 border-t border-red-100 space-y-4">
                                <p className="text-xs text-red-500 uppercase tracking-wider font-extrabold">Next Steps for Verification</p>
                                
                                <div className="space-y-2 text-xs font-medium text-red-700/80">
                                    <p>1. Check your <strong>Spam or Junk</strong> folder.</p>
                                    <p>2. Look for an email from "Supabase" or "BantConfirm".</p>
                                </div>

                                <button 
                                    type="button"
                                    onClick={handleResendEmail}
                                    disabled={resendTimer > 0 || loading}
                                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center shadow-md disabled:bg-red-300"
                                >
                                    {loading ? <RefreshCw size={16} className="animate-spin mr-2" /> : <RefreshCw size={16} className="mr-2" />}
                                    {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Verification Link'}
                                </button>
                                
                                <button 
                                    type="button"
                                    onClick={() => setShowConfigHelp(!showConfigHelp)}
                                    className="w-full text-xs text-red-400 hover:text-red-500 font-bold flex items-center justify-center"
                                >
                                    <HelpCircle size={12} className="mr-1" /> Is this your site? Click for Config Help
                                </button>
                                
                                {showConfigHelp && (
                                    <div className="bg-white p-3 rounded-lg border border-red-100 text-[10px] text-slate-500 font-normal leading-relaxed">
                                        <p className="font-bold text-red-600 mb-1">Administrator Check:</p>
                                        <p>Ensure <strong>bantconfirm.com/#/login</strong> is in Supabase Dashboard -> Auth -> URL Config -> Redirect URLs.</p>
                                        <a href="https://supabase.com/dashboard/project/_/auth/url-configuration" target="_blank" className="text-blue-500 font-bold flex items-center mt-1">
                                            Open Dashboard <ExternalLink size={10} className="ml-1" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                  </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {isSignup && !isForgotPassword && (
                    <div className="animate-fade-in space-y-5">
                      <div className="relative">
                        <UserIcon size={20} className="absolute left-5 top-4 text-slate-300" />
                        <input name="name" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Full Name" value={formData.name} onChange={handleInputChange} />
                      </div>
                      <div className="relative">
                        <Phone size={20} className="absolute left-5 top-4 text-slate-300" />
                        <input name="mobile" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={20} className="absolute left-5 top-4 text-slate-300" />
                    <input name="email" type="email" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Email address" value={formData.email} onChange={handleInputChange} />
                  </div>

                  {!isForgotPassword && (
                      <div className="relative">
                         <Lock size={20} className="absolute left-5 top-4 text-slate-300" />
                         <input name="password" type="password" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-300 outline-none transition-all font-medium" placeholder="Password" value={formData.password} onChange={handleInputChange} />
                      </div>
                  )}

                  {!isSignup && !isForgotPassword && (
                      <div className="text-right">
                          <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot Password?</button>
                      </div>
                  )}

                  <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl text-lg tracking-wide disabled:opacity-50">
                      {loading ? 'Working...' : (isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Create Account' : 'Sign In'))}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-8">
                  <p className="text-slate-400 text-sm font-medium">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); setIsForgotPassword(false); }} className="font-bold text-blue-600 hover:text-blue-700 ml-1">
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