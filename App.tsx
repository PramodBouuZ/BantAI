// Fixed missing Component import and ErrorBoundary property errors
import React, { useState, useEffect, ErrorInfo, ReactNode, Component } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import BantForm from './components/BantForm';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import ProductDetails from './pages/ProductDetails';
import VendorRegister from './pages/VendorRegister';
import Comparison from './pages/Comparison';
import AIConsultant from './components/AIConsultant';
import { User } from './types';
import { Construction, Briefcase, FileText, Newspaper, MessageCircle, AlertTriangle, X, Check, Info, AlertCircle, Scale } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import { HelmetProvider } from 'react-helmet-async';

// --- Error Boundary to catch runtime crashes ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fix: Extending Component directly and using property initializers ensures that state and props are correctly typed and accessible on the instance.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Use property initializer for state to define it explicitly on the instance type
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Accessing state via this.state is now correctly typed
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong.</h1>
            <p className="text-slate-600 mb-4">The application encountered an error. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Refresh Page</button>
          </div>
        </div>
      );
    }
    
    // Accessing props via this.props is now correctly typed
    return this.props.children;
  }
}

// --- Toast Notification Component ---
const ToastContainer: React.FC = () => {
    const { notifications, removeNotification } = useData();

    return (
        <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <div 
                    key={n.id} 
                    className={`
                        pointer-events-auto bg-white rounded-xl shadow-2xl p-4 min-w-[300px] max-w-sm flex items-start transform transition-all animate-slide-left border-l-4
                        ${n.type === 'success' ? 'border-green-500' : n.type === 'error' ? 'border-red-500' : n.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}
                    `}
                >
                    <div className={`mr-3 mt-0.5 ${n.type === 'success' ? 'text-green-500' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                        {n.type === 'success' ? <Check size={20} /> : n.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{n.type === 'success' ? 'Success' : n.type === 'error' ? 'Error' : 'Notification'}</p>
                        <p className="text-sm text-slate-600 leading-snug">{n.message}</p>
                    </div>
                    <button onClick={() => removeNotification(n.id)} className="ml-3 text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
            ))}
            <style>{`
                @keyframes slideLeft {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-left {
                    animation: slideLeft 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

// --- Compare Tray Component ---
const CompareTray: React.FC = () => {
  const { compareList, toggleCompare, clearCompare } = useData();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-2xl w-full mx-4 animate-slide-up flex items-center justify-between">
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
         <div className="flex items-center justify-center bg-indigo-50 w-12 h-12 rounded-xl text-indigo-600 shrink-0">
            <Scale size={24} />
         </div>
         {compareList.map(item => (
           <div key={item.id} className="relative group shrink-0">
              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-gray-200">
                 {item.image ? <img src={item.image} className="w-full h-full object-cover" alt={item.title}/> : <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">IMG</div>}
              </div>
              <button onClick={() => toggleCompare(item)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition">
                <X size={12} />
              </button>
           </div>
         ))}
         {Array.from({ length: 3 - compareList.length }).map((_, i) => (
            <div key={i} className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-300 font-bold shrink-0">
               +
            </div>
         ))}
      </div>

      <div className="flex items-center gap-3 pl-4 border-l border-gray-100 ml-4">
         <button onClick={clearCompare} className="text-slate-500 hover:text-red-500 text-sm font-medium px-2 transition">Clear</button>
         <button onClick={() => navigate('/compare')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition whitespace-nowrap">
           Compare ({compareList.length})
         </button>
      </div>
    </div>
  );
};

// --- Layout Component ---
const MainLayout = ({ currentUser, setCurrentUser }: { currentUser: User | null, setCurrentUser: (u: User | null) => void }) => {
  const { siteConfig } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="flex-grow">
        <Outlet />
      </div>
      <CompareTray />
      <AIConsultant />
      <Footer />
      
      {siteConfig.whatsappNumber && (
        <a 
          href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-50 transition-transform hover:scale-110 flex items-center justify-center"
          title="Chat with us"
        >
          <MessageCircle size={32} fill="white" />
        </a>
      )}
    </div>
  );
};

// --- Main App Component ---
const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isLoggedIn = currentUser !== null;
  const { siteConfig } = useData();

  useEffect(() => {
    if (siteConfig?.faviconUrl) {
      const relTypes = ['icon', 'shortcut icon', 'apple-touch-icon'];
      relTypes.forEach(rel => {
        let link = document.querySelector(`link[rel~="${rel}"]`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = siteConfig.faviconUrl || '/favicon.ico';
      });
      if (siteConfig.siteName) {
        document.title = siteConfig.siteName + " - India's #1 B2B Marketplace";
      }
    }
  }, [siteConfig]);

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route element={<MainLayout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/products" element={<Products isLoggedIn={isLoggedIn} />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/compare" element={<Comparison />} />
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
          <Route path="/enquiry" element={<BantForm isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="*" element={
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-6xl font-bold text-slate-200 mb-4">404</h2>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h3>
              <button onClick={() => window.history.back()} className="text-indigo-600 font-bold hover:underline mt-4">Go Back</button>
            </div>
          } />
        </Route>
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default App;