import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { Zap, Mail, Lock, User as UserIcon, ChevronLeft, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  setCurrentUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const search = location.state?.from?.search || '';
  
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
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
    setSuccessMsg('');
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setErrorMsg("Authentication service not available.");
      return;
    }
    setLoading(true);
    try {
      // Corrected redirect for OAuth to ensure it returns to the root where the listener is active
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: window.location.origin + window.location.pathname + '#/login',
      });
      if (error) throw error;
      setSuccessMsg("Password reset link sent to your email!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Admin Backdoor
    if (view === 'login' && formData.email === 'admin@bantconfirm.com' && formData.password === 'admin123') {
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
        if (view === 'signup') {
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
             const meta = data.user.user_metadata || {};
             setCurrentUser({
                id: data.user.id,
                name: meta.full_name || formData.name || 'User',
                email: data.user.email || formData.email,
                role: 'user',
                joinedDate: new Date().toISOString()
             });
             setSuccessMsg("Welcome to BantConfirm! Your account is ready.");
             setTimeout(() => navigate(from + search), 1500);
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
      setErrorMsg("Supabase is not configured. Local mode only.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-4 md:top-10 md:left-10 text-slate-400 hover:text-blue-600 transition-all hover:scale-110 p-2"
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <div className="max-w-[460px] w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50">
        
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-500 p-4 rounded-3xl shadow-lg shadow-blue-200">
            <Zap size={32} className="text-white fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {view === 'signup' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 font-medium">Empowering India's B2B Ecosystem</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl text-sm font-bold bg-red-50 text-red-600 border border-red-100 flex items-start gap-2 animate-shake">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl text-sm font-bold bg-green-50 text-green-700 border border-green-100 flex items-start gap-2 animate-bounce-subtle">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

        {view !== 'forgot' && (
          <div className="space-y-4 mb-8">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {view !== 'forgot' && (
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-black tracking-widest">or email & password</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={view === 'forgot' ? handleForgotPassword : handleSubmit}>
          {view === 'signup' && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative group">
                <UserIcon size={18} className="absolute left-5 top-[1.1rem] text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  name="name" 
                  required 
                  className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all font-bold" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          )}

          <div className="relative group">
            <Mail size={18} className="absolute left-5 top-[1.1rem] text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              name="email" 
              type="email" 
              required 
              className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all font-bold" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleInputChange} 
            />
          </div>

          {view !== 'forgot' && (
            <div className="relative group">
               <Lock size={18} className="absolute left-5 top-[1.1rem] text-slate-300 group-focus-within:text-blue-500 transition-colors" />
               <input 
                name="password" 
                type="password" 
                required 
                className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all font-bold" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleInputChange} 
              />
            </div>
          )}

          {view === 'login' && (
            <div className="flex justify-end mt-2">
              <button 
                type="button"
                onClick={() => setView('forgot')}
                className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl text-lg tracking-wide disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Processing...' : (view === 'signup' ? 'Create Account' : view === 'forgot' ? 'Send Reset Link' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center mt-8 space-y-3">
          {view === 'forgot' ? (
             <button 
                onClick={() => setView('login')}
                className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-blue-600 font-bold transition-colors"
             >
                <ArrowLeft size={16} /> Back to Sign In
             </button>
          ) : (
            <p className="text-slate-500 text-sm font-bold">
              {view === 'signup' ? "Already have an account?" : "New to BantConfirm?"}{" "}
              <button 
                onClick={() => { setView(view === 'signup' ? 'login' : 'signup'); setErrorMsg(''); setSuccessMsg(''); }} 
                className="text-blue-600 hover:text-blue-700 ml-1 font-black underline decoration-2 underline-offset-4"
              >
                {view === 'signup' ? "Sign In" : "Sign Up"}
              </button>
            </p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        .animate-bounce-subtle {
          animation: bounce 1s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default Login;