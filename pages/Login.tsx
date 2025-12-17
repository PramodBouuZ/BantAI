import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Zap, Phone, Mail, Lock, User as UserIcon, ChevronLeft, RefreshCw, Inbox, AlertCircle } from 'lucide-react';
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
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    if (params.get('type') === 'signup' || params.get('verified') === 'true') {
        setErrorMsg("Email verified successfully! You can now sign in.");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0 || !formData.email) return;
    
    if (supabase) {
        setLoading(true);
        setErrorMsg(''); 
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: formData.email,
                options: {
                    // Critical: Redirect back to the production login page
                    emailRedirectTo: `${window.location.origin}/#/login?verified=true`
                }
            });
            
            if (error) throw error;
            
            setErrorMsg('A new verification email has been sent. Please check your Inbox and Spam folders.');
            setResendTimer(60); // 60s cooldown
            setConfirmationSent(true);
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to resend email. Please try again later.");
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
               emailRedirectTo: `${window.location.origin}/#/login?verified=true`, 
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
        // Detect "Email not confirmed" specifically to show the resend button
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
                
                <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl text-sm mb-6 text-left border border-amber-100">
                    <strong>Missing the email?</strong> Please check your <strong>Spam</strong> or <strong>Junk</strong> folder. Sometimes filters block automated verification emails.
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleResendEmail}
                        disabled={resendTimer > 0 || loading}
                        className="w-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <RefreshCw size={18} className="animate-spin mr-2" /> : <RefreshCw size={18} className="mr-2" />}
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Email'}
                    </button>

                    <button 
                        onClick={() => { setConfirmationSent(false); setIsSignup(false); setErrorMsg(''); }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-lg"
                    >
                        Back to Sign In
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
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-sm text-lg"
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
                  <div className={`mb-6 p-4 rounded-2xl text-sm font-bold border animate-fade-in ${errorMsg.includes('verified') || errorMsg.includes('sent') ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    <div className="flex items-start">
                        <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
                        <div>
                            <p>{errorMsg}</p>
                            {/* Special case: If email not confirmed, show resend button here */}
                            {errorMsg.toLowerCase().includes('email not confirmed') && (
                                <button 
                                    type="button"
                                    onClick={handleResendEmail}
                                    disabled={resendTimer > 0 || loading}
                                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center w-full"
                                >
                                    {loading ? 'Sending...' : (resendTimer > 0 ? `Wait ${resendTimer}s` : 'Resend Verification Email')}
                                </button>
                            )}
                        </div>
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
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-sm text-lg tracking-wide">
                      {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isSignup ? 'Create Account' : 'Sign In'))}
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