import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Zap, Briefcase, MapPin, Phone, Mail, Lock, User as UserIcon, ChevronLeft, Check } from 'lucide-react';
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
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    location: '',
    password: ''
  });

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

    // Basic Validation
    if (isSignup) {
      if (!formData.name || !formData.mobile || !formData.location) {
        setErrorMsg("Please fill in all details including Name, Mobile, and Location.");
        setLoading(false);
        return;
      }
    }

    // --- SUPABASE AUTH (High Priority) ---
    if (supabase) {
      try {
        if (isSignup) {
           const { data, error } = await supabase.auth.signUp({
             email: formData.email,
             password: formData.password,
             options: {
               data: {
                 full_name: formData.name,
                 role: selectedRole,
                 mobile: formData.mobile,
                 location: formData.location
               }
             }
           });
           if (error) throw error;
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
             addUser(newUser); // Save to local context for UI
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
             // Fetch user metadata or look up in local context
             const meta = data.user.user_metadata || {};
             setCurrentUser({
                id: data.user.id,
                name: meta.full_name || 'User',
                email: data.user.email || '',
                role: meta.role || 'user',
                joinedDate: new Date().toISOString()
             });
             navigate(from + search);
             return;
           }
        }
      } catch (err: any) {
        console.error("Supabase Auth Error:", err);
        // Fallback to mock auth if Supabase fails or isn't configured for this specific user
        if (err.message && !err.message.includes("configured")) {
           // If it's a real auth error (wrong password), stop here
           setErrorMsg(err.message);
           setLoading(false);
           return;
        }
      }
    }

    // --- MOCK AUTH FALLBACK (If Supabase not configured or skipped) ---
    setTimeout(() => {
      // 1. Admin Login Backdoor
      if (formData.email === 'admin@bantconfirm.com' && formData.password === 'admin123') {
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

      // 2. Signup Logic
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

      // 3. Login Logic (Simulated by finding existing user or defaulting)
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
      {/* Back Arrow */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-4 md:top-10 md:left-10 text-blue-600 hover:text-blue-700 transition-transform hover:scale-110 p-2"
        aria-label="Go back"
      >
        <ChevronLeft size={40} strokeWidth={2.5} />
      </button>

      <div className="max-w-[440px] w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-fade-in border border-slate-50">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-tr from-yellow-100 to-amber-50 p-4 rounded-3xl shadow-sm">
            <Zap size={32} className="text-yellow-500 fill-current" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-300 mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-300 text-sm font-medium tracking-wide">
            {isSignup ? 'Sign up to get started' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold text-center border border-red-100 animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Role Selection Tabs - Admin Hidden */}
        <div className="flex justify-center gap-10 mb-10">
           <button 
             type="button"
             onClick={() => setSelectedRole('user')}
             className={`group flex flex-col items-center gap-2 transition-all ${selectedRole === 'user' ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
           >
             <div className={`p-4 rounded-2xl transition-all duration-300 ${selectedRole === 'user' ? 'bg-white shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] text-blue-500' : 'bg-transparent text-slate-400'}`}>
               <UserIcon size={24} />
             </div>
             <span className={`text-xs font-bold tracking-wider ${selectedRole === 'user' ? 'text-blue-500' : 'text-slate-400'}`}>User</span>
           </button>

           <button 
             type="button"
             onClick={() => setSelectedRole('vendor')}
             className={`group flex flex-col items-center gap-2 transition-all ${selectedRole === 'vendor' ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
           >
             <div className={`p-4 rounded-2xl transition-all duration-300 ${selectedRole === 'vendor' ? 'bg-white shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] text-blue-500' : 'bg-transparent text-slate-400'}`}>
               <Briefcase size={24} />
             </div>
             <span className={`text-xs font-bold tracking-wider ${selectedRole === 'vendor' ? 'text-blue-500' : 'text-slate-400'}`}>Vendor</span>
           </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {isSignup && (
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

          <div className="relative group">
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

          {!isSignup && (
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                   <input type="checkbox" className="peer sr-only" />
                   <div className="w-5 h-5 border-2 border-slate-200 rounded-md peer-checked:bg-blue-200 peer-checked:border-blue-200 transition-all group-hover:border-blue-200"></div>
                   <Check size={12} className="absolute top-1 left-1 text-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                </div>
                <span className="ml-2 text-sm text-slate-300 font-medium group-hover:text-slate-400 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-bold text-blue-200 hover:text-blue-400 transition-colors">
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
              {loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-300 text-sm font-medium">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignup(!isSignup)} 
              className="font-bold text-[#C5D9FC] hover:text-blue-400 transition-colors ml-1"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;