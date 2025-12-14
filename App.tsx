import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { User } from './types';
import { Construction, Briefcase, FileText, Newspaper, MessageCircle } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import { HelmetProvider } from 'react-helmet-async';

const PlaceholderPage = ({ title, type }: { title: string, type: 'careers' | 'blog' | 'legal' | 'press' }) => {
  const getContent = () => {
    switch(type) {
      case 'careers':
        return {
          icon: <Briefcase size={64} className="text-blue-500 mb-6" />,
          subtitle: "Join our mission to transform B2B procurement.",
          text: "We are always looking for talented individuals to join our team in Bangalore. Check back soon for open positions in Engineering, Sales, and Customer Success."
        };
      case 'blog':
        return {
          icon: <FileText size={64} className="text-green-500 mb-6" />,
          subtitle: "Insights on IT Procurement and B2B Trends.",
          text: "Our editorial team is curating the best articles on navigating the Indian IT landscape. The blog will launch next month with guides on Cloud Migration, VoIP regulations, and more."
        };
      case 'press':
        return {
          icon: <Newspaper size={64} className="text-purple-500 mb-6" />,
          subtitle: "Media Resources & Company News.",
          text: "Find our latest press releases, brand assets, and media contact information here soon. For immediate media inquiries, please contact press@bantconfirm.com."
        };
      default:
        return {
          icon: <Construction size={64} className="text-yellow-500 mb-6" />,
          subtitle: "This page is under construction.",
          text: "We are working hard to bring you this content. Please check back shortly."
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-20">
      <div className="max-w-2xl text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-center">{content.icon}</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
        <h2 className="text-xl text-blue-600 font-semibold mb-6">{content.subtitle}</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-8">{content.text}</p>
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 inline-block">
          <strong>Note:</strong> We are currently building this section to better serve our MSME and Enterprise clients.
        </div>
      </div>
    </div>
  );
};

// Main Layout Component
const AppLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isLoggedIn = currentUser !== null;
  const { siteConfig } = useData();

  // Apply Site Config (Title & Favicon)
  useEffect(() => {
    if (siteConfig.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = siteConfig.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteConfig.faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [siteConfig]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 relative">
        <ScrollToTop />
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/products" element={<Products isLoggedIn={isLoggedIn} />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/enquiry" element={<BantForm isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
            <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
            <Route path="/vendor-register" element={<VendorRegister />} />
            
            {/* Rich Content Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            
            {/* Placeholder Routes */}
            <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" type="legal" />} />
            <Route path="/terms" element={<PlaceholderPage title="Terms of Service" type="legal" />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog" type="blog" />} />
            <Route path="/careers" element={<PlaceholderPage title="Careers" type="careers" />} />
            <Route path="/press" element={<PlaceholderPage title="Press Kit" type="press" />} />
            <Route path="/help" element={<PlaceholderPage title="Help Center" type="legal" />} />
            <Route path="/api" element={<PlaceholderPage title="API Reference" type="legal" />} />
            <Route path="/community" element={<PlaceholderPage title="Vendor Community" type="blog" />} />
            <Route path="/security" element={<PlaceholderPage title="Security (ISO 27001)" type="legal" />} />
            <Route path="/cookies" element={<PlaceholderPage title="Cookie Settings" type="legal" />} />
            
            <Route path="*" element={<div className="p-20 text-center"><h2 className="text-2xl font-bold">404 - Page Not Found</h2></div>} />
          </Routes>
        </div>
        
        <Footer />

        {/* WhatsApp Notification Floating Button */}
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
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <DataProvider>
        <AppLayout />
      </DataProvider>
    </HelmetProvider>
  );
};

// Helper component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default App;