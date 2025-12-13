import React from 'react';
import { Zap, Twitter, Linkedin, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              {siteConfig.logoUrl ? (
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.siteName} 
                  className="h-10 w-auto object-contain" 
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-500 text-white p-1.5 rounded-md">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="text-xl font-bold">{siteConfig.siteName}</span>
                </div>
              )}
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              India's #1 B2B AI Marketplace. Transform your unused leads into revenue and find verified service providers.
            </p>
            
            <div className="space-y-3 text-sm text-slate-400 mb-6">
                <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-yellow-500" />
                    <span>support@bantconfirm.com</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-yellow-500" />
                    <span>Noida, Uttar Pradesh, India</span>
                </div>
            </div>

            <div className="flex space-x-4">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-slate-300 hover:text-white">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/features" className="hover:text-yellow-400 transition">Features</Link></li>
              <li><Link to="/products" className="hover:text-yellow-400 transition">Marketplace</Link></li>
              <li><Link to="/enquiry" className="hover:text-yellow-400 transition">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-yellow-400 transition">Security (ISO 27001)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-yellow-400 transition">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-yellow-400 transition">Blog</Link></li>
              <li><Link to="/press" className="hover:text-yellow-400 transition">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact Us</Link></li>
              <li><Link to="/help" className="hover:text-yellow-400 transition">Help Center</Link></li>
              <li><Link to="/api" className="hover:text-yellow-400 transition">API Reference</Link></li>
              <li><Link to="/community" className="hover:text-yellow-400 transition">Vendor Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 BantConfirm India Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;