
import React from 'react';
import { Zap, Twitter, Linkedin, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { siteConfig } = useData();

  const socialLinks = [
    { icon: Twitter, url: siteConfig.socialLinks.twitter, label: 'Twitter' },
    { icon: Linkedin, url: siteConfig.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Facebook, url: siteConfig.socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, url: siteConfig.socialLinks.instagram, label: 'Instagram' },
  ].filter(link => link.url && link.url !== '#');

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
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors text-slate-300 hover:text-white"
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg uppercase tracking-wider text-sm">Popular Categories</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/products?category=CRM" className="hover:text-yellow-400 transition">CRM Software</Link></li>
              <li><Link to="/products?category=Cloud%20Telephony" className="hover:text-yellow-400 transition">Cloud Telephony</Link></li>
              <li><Link to="/products?category=ERP" className="hover:text-yellow-400 transition">ERP Solutions</Link></li>
              <li><Link to="/products?category=IT%20Hardware" className="hover:text-yellow-400 transition">IT Hardware</Link></li>
              <li><Link to="/products?category=Telecom" className="hover:text-yellow-400 transition">Telecom Services</Link></li>
              <li><Link to="/products?category=Accounting" className="hover:text-yellow-400 transition">Accounting Software</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg uppercase tracking-wider text-sm">Solutions by City</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/products?city=Delhi" className="hover:text-yellow-400 transition">IT Solutions in Delhi</Link></li>
              <li><Link to="/products?city=Mumbai" className="hover:text-yellow-400 transition">IT Solutions in Mumbai</Link></li>
              <li><Link to="/products?city=Bangalore" className="hover:text-yellow-400 transition">IT Solutions in Bangalore</Link></li>
              <li><Link to="/products?city=Pune" className="hover:text-yellow-400 transition">IT Solutions in Pune</Link></li>
              <li><Link to="/products?city=Hyderabad" className="hover:text-yellow-400 transition">IT Solutions in Hyderabad</Link></li>
              <li><Link to="/products?city=Noida" className="hover:text-yellow-400 transition">IT Solutions in Noida</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-lg uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-yellow-400 transition">Blog & Insights</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact Us</Link></li>
              <li><Link to="/vendor-register" className="hover:text-yellow-400 transition">Partner Onboarding</Link></li>
              <li><Link to="/features" className="hover:text-yellow-400 transition">Features</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2025 BantConfirm India Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
