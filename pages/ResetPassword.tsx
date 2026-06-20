
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, ChevronLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Basic check to see if we have a session or if we're in recovery mode
    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // If no session, it might be an invalid or expired link
            // However, Supabase often sets the session automatically when clicking the recovery link
            console.warn("No active session found on reset password page.");
        }
    };
    checkSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (passwords.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password
      });

      if (error) throw error;

      setSuccessMsg("Password updated successfully.");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <button onClick={() => navigate('/login')} className="absolute top-6 left-4 md:top-10 md:left-10 text-slate-400 hover:text-blue-600 transition-all hover:scale-110 p-2 z-20">
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <div className="max-w-[460px] w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-500 p-4 rounded-3xl shadow-lg shadow-blue-200">
            <Zap size={32} className="text-white fill-current" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Set New Password</h2>
          <p className="text-slate-500 font-medium">Choose a strong password for your account</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl text-sm font-bold bg-red-50 text-red-600 border border-red-100 flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl text-sm font-bold bg-green-50 text-green-700 border border-green-100 flex items-start gap-2">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative group">
            <Lock size={18} className="absolute left-5 top-[1.1rem] text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input name="password" type="password" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all font-bold" placeholder="New Password" value={passwords.password} onChange={handleChange} />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-5 top-[1.1rem] text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input name="confirmPassword" type="password" required className="block w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl text-slate-700 placeholder-slate-400 outline-none transition-all font-bold" placeholder="Confirm Password" value={passwords.confirmPassword} onChange={handleChange} />
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading || !!successMsg} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl text-lg tracking-wide disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
