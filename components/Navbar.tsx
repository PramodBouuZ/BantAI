import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, ChevronDown, LogIn, User } from 'lucide-react';
import { User as UserType } from '../types';
import { useData } from '../context/DataContext';

interface NavbarProps {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentUser }) => {
  const { siteConfig } = useData();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-blue-600 font-medium';

  // Don't show navbar on login page
  if (location.pathname === '/login') return null;

  const handlePostEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUser) {
      navigate('/enquiry');
    } else {
      navigate('/login', { state: { from: { pathname: '/enquiry' } } });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {siteConfig.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.siteName} 
                className="h-12 w-auto object-contain transition-transform transform group-hover:scale-105" 
              />
            ) : (
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                {siteConfig.siteName}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className={`text-lg transition-colors ${isActive('/products')}`}>Services</Link>
            <Link to="/features" className={`text-lg transition-colors ${isActive('/features')}`}>Features</Link>
            
            {currentUser && (
              <Link to="/dashboard" className={`text-lg transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
            )}
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {!currentUser ? (
              <Link 
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-bold text-lg flex items-center transition-colors"
              >
                <LogIn size={20} className="mr-2" /> Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-slate-500 hidden xl:block">Hi, {currentUser.name.split(' ')[0]}</span>
                 <button 
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 font-bold text-lg flex items-center transition-colors"
                >
                  <User size={20} className="mr-2" /> Logout
                </button>
              </div>
            )}

            <button
              onClick={handlePostEnquiry}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              Post Enquiry
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full pb-6 shadow-xl animate-fade-in">
          <div className="px-6 pt-4 pb-6 space-y-2">
            <Link to="/products" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium">Services</Link>
            <Link to="/features" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium">Features</Link>
            
            {currentUser && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium">Dashboard</Link>
            )}
            
            {!currentUser ? (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium">Login</Link>
            ) : (
               <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 text-xl text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium">Logout ({currentUser.name})</button>
            )}
            
            <button onClick={(e) => { handlePostEnquiry(e); setIsOpen(false); }} className="block w-full text-center mt-6 bg-yellow-500 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg">
              Post Enquiry
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;