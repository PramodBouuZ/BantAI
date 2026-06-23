import React, { Component, useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
export const Home = React.lazy(() => import('./pages/Home'));
export const Products = React.lazy(() => import('./pages/Products'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const BantForm = React.lazy(() => import('./components/BantForm'));
const Login = React.lazy(() => import('./pages/Login'));
export const About = React.lazy(() => import('./pages/About'));
export const Contact = React.lazy(() => import('./pages/Contact'));
const Features = React.lazy(() => import('./pages/Features'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const VendorRegister = React.lazy(() => import('./pages/VendorRegister'));
const Comparison = React.lazy(() => import('./pages/Comparison'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogDetails = React.lazy(() => import('./pages/BlogDetails'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const CategoryDetails = React.lazy(() => import('./pages/CategoryDetails'));
const LocationPage = React.lazy(() => import('./pages/LocationPage'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
import AIConsultant from './components/AIConsultant';
import { User } from './types';
import { MessageCircle, AlertTriangle, X, Check, Info, AlertCircle, Scale } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// --- Error Boundary to catch runtime crashes ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fixed: Explicitly use React.Component to ensure 'props' property is correctly inherited and typed
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL: Uncaught application error:", error);
    console.error("Error details:", errorInfo.componentStack);

    // Log to external service if available, or just keep in console for admin
    if (window.location.pathname.startsWith('/admin')) {
        console.log("Admin Dashboard Crash Detected. Check missing components or data mapping.");
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md border border-red-100">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Interrupted</h1>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">The application encountered a runtime error. This has been logged for the technical team.</p>
            <div className="flex flex-col gap-3">
                <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition shadow-xl">
                    Refresh Application
                </button>
                <button onClick={() => window.location.href = '/'} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition">
                    Return to Home
                </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Toast Notification Component ---
const ToastContainer: React.FC = () => {
    const { notifications, removeNotification } = useData();
    return (
        <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <div key={n.id} className={`pointer-events-auto bg-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-sm flex items-start transform transition-all animate-slide-left border-l-4 ${n.type === 'success' ? 'border-green-500' : n.type === 'error' ? 'border-red-500' : n.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}>
                    <div className={`mr-3 mt-0.5 ${n.type === 'success' ? 'text-green-500' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>{n.type === 'success' ? <Check size={20} /> : n.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}</div>
                    <div className="flex-1"><p className="text-sm font-bold text-slate-800">{n.type === 'success' ? 'Success' : n.type === 'error' ? 'Error' : 'Notification'}</p><p className="text-sm text-slate-600 leading-snug">{n.message}</p></div>
                    <button onClick={() => removeNotification(n.id)} className="ml-3 text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
            ))}
            <style>{`@keyframes slideLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-left { animation: slideLeft 0.3s ease-out forwards; }`}</style>
        </div>
    );
}

const CompareTray: React.FC = () => {
  const { compareList, toggleCompare, clearCompare } = useData();
  const navigate = useNavigate();
  if (compareList.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-2xl w-full mx-4 animate-slide-up flex items-center justify-between">
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
         <div className="flex items-center justify-center bg-indigo-50 w-12 h-12 rounded-xl text-indigo-600 shrink-0"><Scale size={24} /></div>
         {compareList.map(item => (<div key={item.id} className="relative group shrink-0"><div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-gray-200">{item.image ? <img src={item.image} className="w-full h-full object-cover" alt={item.title}/> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">IMG</div>}</div><button onClick={() => toggleCompare(item)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition"><X size={12} /></button></div>))}
      </div>
      <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-4"><button onClick={clearCompare} className="text-slate-500 hover:text-red-500 text-sm font-medium px-2 transition">Clear</button><button onClick={() => navigate('/compare')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition whitespace-nowrap">Compare ({compareList.length})</button></div>
    </div>
  );
};

const MainLayout = () => {
  const { siteConfig, currentUser, setCurrentUser } = useData();
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="flex-grow"><Outlet /></div>
      <CompareTray />
      <AIConsultant />
      <Footer />
      {siteConfig.whatsappNumber && (<a href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 flex items-center justify-center" title="Chat with us"><MessageCircle size={32} fill="white" /></a>)}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { siteConfig, currentUser, setCurrentUser } = useData();
  const isLoggedIn = currentUser !== null;
  
  useEffect(() => {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`App: Auth event triggered: ${event}`);
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session?.user) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, name, role, created_at')
              .eq('id', session.user.id)
              .maybeSingle();

            if (userError && userError.code !== 'PGRST116') {
              console.error("App: Auth change user fetch error:", userError);
            }

            const meta = session.user.user_metadata || {};
            // Only info.bouuz@gmail.com can be admin
            const role = session.user.email === 'info.bouuz@gmail.com' ? 'admin' : (userData?.role || meta.role || 'user');

            setCurrentUser({
              id: session.user.id,
              name: userData?.name || meta.full_name || meta.name || 'User',
              email: session.user.email || '',
              role: role as any,
              joinedDate: userData?.created_at || session.user.created_at,
              company: meta.company,
              status: meta.status,
              logoUrl: meta.logo_url,
              isFirstLogin: meta.is_first_login
            });
            console.log("App: User set after auth change:", role);
          } catch (err) {
            console.error("App: Auth state change processing failed:", err);
          }
        } else if (event === 'SIGNED_OUT') { 
          console.log("App: User signed out.");
          setCurrentUser(null); 
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [setCurrentUser]);

  return (
    <>
      <Helmet>
        <title>{`${siteConfig.siteName} – India’s AI-Powered B2B Marketplace`}</title>
        {siteConfig.faviconUrl && <link rel="icon" href={siteConfig.faviconUrl} />}
        {siteConfig.faviconUrl && <link rel="apple-touch-icon" href={siteConfig.faviconUrl} />}
      </Helmet>
      <ScrollToTop />
      <ToastContainer />
      <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/products" element={<Products isLoggedIn={isLoggedIn} />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/services/:slug" element={<ProductDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/compare" element={<Comparison />} />

          {/* New Dynamic Routes for SEO */}
          <Route path="/category/:slug" element={<CategoryDetails />} />

          {/* Role-Based Dashboard Routing */}
          <Route path="/dashboard" element={
            <ProtectedRoute currentUser={currentUser}>
              {currentUser?.role === 'admin' ?
                <Navigate to="/admin" replace /> :
                <Navigate to="/user/dashboard" replace />
              }
            </ProtectedRoute>
          } />

          <Route path="/user/dashboard" element={
            <ProtectedRoute currentUser={currentUser}>
              <UserDashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute currentUser={currentUser} requiredRole="admin">
              <Dashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute currentUser={currentUser} requiredRole="admin">
              <Dashboard currentUser={currentUser} />
            </ProtectedRoute>
          } />

          <Route path="/enquiry" element={<BantForm isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Dynamic Catch-all for Cities and States */}
          <Route path="/:slug" element={<LocationPage />} />

          <Route path="*" element={<div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"><h2 className="text-6xl font-bold text-slate-200 mb-4">404</h2><h3 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h3><button onClick={() => window.history.back()} className="text-indigo-600 font-bold hover:underline mt-4">Go Back</button></div>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      </React.Suspense>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <DataProvider>
            <Router>
              <AppContent />
            </Router>
          </DataProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default App;