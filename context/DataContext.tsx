import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Lead, SiteConfig, User, VendorAsset, VendorRegistration, AppNotification } from '../types';
import { PRODUCTS, RECENT_LEADS } from '../services/mockData';
import { supabase } from '../lib/supabase';

interface DataContextType {
  products: Product[];
  leads: Lead[];
  categories: string[];
  users: User[];
  vendorLogos: VendorAsset[];
  vendorRegistrations: VendorRegistration[];
  siteConfig: SiteConfig;
  notifications: AppNotification[];
  
  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Lead Actions
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;
  assignLead: (id: string, vendor: string) => void;
  updateLeadRemarks: (id: string, remarks: string) => void;
  deleteLead: (id: string) => void;
  
  // Config/Category Actions
  updateSiteConfig: (config: SiteConfig) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;

  // User/Vendor Actions
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addVendorLogo: (asset: VendorAsset) => void;
  deleteVendorLogo: (id: string) => void;
  addVendorRegistration: (reg: VendorRegistration) => void;

  // Notification Actions
  addNotification: (message: string, type: AppNotification['type']) => void;
  removeNotification: (id: string) => void;
}

const defaultSiteConfig: SiteConfig = {
  siteName: 'BantConfirm',
  bannerTitle: 'The Premier IT Marketplace for MSMEs & Enterprises',
  bannerSubtitle: 'Discover, Compare, and Buy Enterprise-grade IT, Software, and Telecom solutions. We connect Indian MSMEs with verified top-tier vendors using AI-driven BANT matching.',
  socialLinks: {
    twitter: '#',
    linkedin: '#',
    facebook: '#',
    instagram: '#'
  }
};

const initialUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@bantconfirm.com', role: 'admin', joinedDate: '2023-01-01' },
  { id: 'u2', name: 'Rahul Sharma', email: 'rahul@sharmaenterprises.in', role: 'user', company: 'Sharma Enterprises', mobile: '+91 98765 43210', joinedDate: '2023-10-24' }
];

const initialVendorLogos: VendorAsset[] = [
  { id: 'v1', name: 'Microsoft', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { id: 'v2', name: 'Google Cloud', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg' },
  { id: 'v3', name: 'AWS', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { id: 'v4', name: 'Salesforce', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
  { id: 'v5', name: 'Zoho', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Zoho_Corporation_logo.png' },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('leads');
    return saved ? JSON.parse(saved) : RECENT_LEADS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : ['Software', 'Telecom', 'Security', 'Connectivity', 'Infrastructure', 'Consulting'];
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('siteConfig');
    return saved ? JSON.parse(saved) : defaultSiteConfig;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [vendorLogos, setVendorLogos] = useState<VendorAsset[]>(() => {
    const saved = localStorage.getItem('vendorLogos');
    return saved ? JSON.parse(saved) : initialVendorLogos;
  });

  const [vendorRegistrations, setVendorRegistrations] = useState<VendorRegistration[]>(() => {
    const saved = localStorage.getItem('vendorRegistrations');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ACTIONS ---
  const addNotification = (message: string, type: AppNotification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto remove after 5s
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- SUPABASE SYNC & REALTIME ---
  useEffect(() => {
    if (!supabase) return;

    // 1. Initial Data Fetch
    const fetchData = async () => {
      // Leads
      const { data: leadData } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (leadData) {
         setLeads(leadData.map((l: any) => ({
             id: l.id, name: l.name, email: l.email, mobile: l.mobile, location: l.location,
             company: l.company, service: l.service, budget: l.budget, requirement: l.requirement,
             status: l.status, assignedTo: l.assigned_to, remarks: l.remarks, date: l.date
         })));
      }

      // Vendor Registrations
      const { data: vendorRegData } = await supabase.from('vendor_registrations').select('*').order('created_at', { ascending: false });
      if (vendorRegData) {
         setVendorRegistrations(vendorRegData.map((r: any) => ({
             id: r.id, name: r.name, companyName: r.company_name, email: r.email, mobile: r.mobile,
             location: r.location, productName: r.product_name, message: r.message, date: r.date
         })));
      }

      // Products
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) {
           setProducts(prodData.map((p: any) => ({
             id: p.id, title: p.title, description: p.description, category: p.category,
             priceRange: p.price_range, features: p.features || [], icon: p.icon || 'globe',
             rating: Number(p.rating), image: p.image
           })));
      }

      // Site Config
      const { data: configData } = await supabase.from('site_config').select('*').single();
      if (configData) {
           setSiteConfig({
               siteName: configData.site_name || defaultSiteConfig.siteName,
               bannerTitle: configData.banner_title || defaultSiteConfig.bannerTitle,
               bannerSubtitle: configData.banner_subtitle || defaultSiteConfig.bannerSubtitle,
               logoUrl: configData.logo_url || undefined,
               faviconUrl: configData.favicon_url || undefined,
               whatsappNumber: configData.whatsapp_number || undefined,
               socialLinks: configData.social_links || defaultSiteConfig.socialLinks,
               bannerImage: undefined
           });
      }
      
      // Categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData && catData.length > 0) {
         const mappedCats = catData.map((c: any) => c.name);
         setCategories(Array.from(new Set([...mappedCats, 'Software', 'Telecom', 'Connectivity'])));
      }

      // Vendor Logos
      const { data: vendorData } = await supabase.from('vendor_assets').select('*');
      if (vendorData && vendorData.length > 0) {
           setVendorLogos(vendorData.map((v: any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url })));
      }
    };

    fetchData();

    // 2. Realtime Subscriptions
    const channel = supabase.channel('realtime_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
         const { eventType, new: newRecord, old: oldRecord } = payload;
         
         if (eventType === 'INSERT') {
            const mapped: Lead = {
                id: newRecord.id, name: newRecord.name, email: newRecord.email, mobile: newRecord.mobile,
                location: newRecord.location, company: newRecord.company, service: newRecord.service,
                budget: newRecord.budget, requirement: newRecord.requirement, status: newRecord.status,
                assignedTo: newRecord.assigned_to, remarks: newRecord.remarks, date: newRecord.date
            };
            setLeads(prev => {
              const updated = [mapped, ...prev.filter(l => l.id !== mapped.id)];
              localStorage.setItem('leads', JSON.stringify(updated));
              return updated;
            });
            addNotification(`New Enquiry: ${mapped.service} from ${mapped.name}`, 'info');
         } else if (eventType === 'UPDATE') {
             setLeads(prev => {
               const updated = prev.map(l => l.id === newRecord.id ? {
                ...l,
                status: newRecord.status,
                assignedTo: newRecord.assigned_to,
                remarks: newRecord.remarks
               } : l);
               localStorage.setItem('leads', JSON.stringify(updated));
               return updated;
             });
         } else if (eventType === 'DELETE') {
             setLeads(prev => {
               const updated = prev.filter(l => l.id !== oldRecord.id);
               localStorage.setItem('leads', JSON.stringify(updated));
               return updated;
             });
         }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'vendor_registrations' }, (payload) => {
         const newReg = payload.new;
         const mapped: VendorRegistration = {
             id: newReg.id, name: newReg.name, companyName: newReg.company_name, email: newReg.email,
             mobile: newReg.mobile, location: newReg.location, productName: newReg.product_name,
             message: newReg.message, date: newReg.date
         };
         setVendorRegistrations(prev => {
            const updated = [mapped, ...prev.filter(r => r.id !== mapped.id)];
            localStorage.setItem('vendorRegistrations', JSON.stringify(updated));
            return updated;
         });
         addNotification(`New Vendor Registration: ${mapped.companyName}`, 'success');
      })
      .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (product: Product) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    if (supabase) {
      await supabase.from('products').insert({
         id: product.id, title: product.title, description: product.description, category: product.category,
         price_range: product.priceRange, features: product.features, icon: product.icon, rating: product.rating, image: product.image
      });
    }
    addNotification('Product added successfully', 'success');
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    const updatedProducts = products.map(p => p.id === id ? updatedProduct : p);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    if (supabase) {
      await supabase.from('products').update({
         title: updatedProduct.title, description: updatedProduct.description, category: updatedProduct.category,
         price_range: updatedProduct.priceRange, features: updatedProduct.features, icon: updatedProduct.icon,
         rating: updatedProduct.rating, image: updatedProduct.image
      }).eq('id', id);
    }
    addNotification('Product updated', 'info');
  };

  const deleteProduct = async (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
    addNotification('Product deleted', 'warning');
  };

  const addLead = async (lead: Lead) => {
    const updatedLeads = [lead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    if (supabase) {
      try {
        const { error } = await supabase.from('leads').insert({
           id: lead.id, name: lead.name, email: lead.email, mobile: lead.mobile, company: lead.company,
           location: lead.location, service: lead.service, budget: lead.budget, requirement: lead.requirement,
           status: lead.status, date: lead.date
        });
        if (error) console.error("Supabase Lead Insert Error:", error);
      } catch (err) { console.error("Failed to sync lead", err); }
    } else {
       console.warn("Supabase not configured. Lead saved locally only.");
    }
    if (!supabase) addNotification('Enquiry Submitted!', 'success');
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    if (supabase) await supabase.from('leads').update({ status }).eq('id', id);
    addNotification('Lead status updated', 'info');
  };

  const assignLead = async (id: string, vendor: string) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, assignedTo: vendor } : l);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    if (supabase) await supabase.from('leads').update({ assigned_to: vendor }).eq('id', id);
    addNotification(`Lead assigned to ${vendor}`, 'info');
  };

  const updateLeadRemarks = async (id: string, remarks: string) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, remarks } : l);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    if (supabase) await supabase.from('leads').update({ remarks }).eq('id', id);
  };

  const deleteLead = async (id: string) => {
    const updatedLeads = leads.filter(l => l.id !== id);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));

    if (supabase) await supabase.from('leads').delete().eq('id', id);
    addNotification('Lead deleted', 'warning');
  };

  const addVendorRegistration = async (reg: VendorRegistration) => {
    const updatedRegs = [reg, ...vendorRegistrations];
    setVendorRegistrations(updatedRegs);
    localStorage.setItem('vendorRegistrations', JSON.stringify(updatedRegs));

    if (supabase) {
      const { error } = await supabase.from('vendor_registrations').insert({
        id: reg.id, name: reg.name, company_name: reg.companyName, email: reg.email,
        mobile: reg.mobile, location: reg.location, product_name: reg.productName,
        message: reg.message, date: reg.date
      });
      if (error) console.error("Supabase Vendor Reg Error:", error);
    }
    if (!supabase) addNotification('Registration Submitted!', 'success');
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
    localStorage.setItem('siteConfig', JSON.stringify(config));

    if (supabase) {
      await supabase.from('site_config').upsert({
          id: 1, site_name: config.siteName, logo_url: config.logoUrl, favicon_url: config.faviconUrl,
          banner_title: config.bannerTitle, banner_subtitle: config.bannerSubtitle,
          whatsapp_number: config.whatsappNumber, social_links: config.socialLinks, updated_at: new Date().toISOString()
      });
    }
    addNotification('Site settings updated', 'success');
  };

  const addCategory = async (category: string) => {
    if (!categories.includes(category)) {
      const updatedCats = [...categories, category];
      setCategories(updatedCats);
      localStorage.setItem('categories', JSON.stringify(updatedCats));

      if (supabase) await supabase.from('categories').insert({ name: category });
      addNotification('Category added', 'success');
    }
  };

  const deleteCategory = async (category: string) => {
    const updatedCats = categories.filter(c => c !== category);
    setCategories(updatedCats);
    localStorage.setItem('categories', JSON.stringify(updatedCats));

    if (supabase) await supabase.from('categories').delete().eq('name', category);
    addNotification('Category deleted', 'warning');
  };

  const addUser = (user: User) => {
      const updatedUsers = [...users, user];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      addNotification(`Welcome ${user.name}!`, 'success');
  }

  const deleteUser = (id: string) => {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addVendorLogo = async (asset: VendorAsset) => {
    const updatedLogos = [...vendorLogos, asset];
    setVendorLogos(updatedLogos);
    localStorage.setItem('vendorLogos', JSON.stringify(updatedLogos));

    if (supabase) {
      await supabase.from('vendor_assets').insert({ id: asset.id, name: asset.name, logo_url: asset.logoUrl });
    }
    addNotification('Vendor logo added', 'success');
  };

  const deleteVendorLogo = async (id: string) => {
    const updatedLogos = vendorLogos.filter(v => v.id !== id);
    setVendorLogos(updatedLogos);
    localStorage.setItem('vendorLogos', JSON.stringify(updatedLogos));

    if (supabase) await supabase.from('vendor_assets').delete().eq('id', id);
    addNotification('Vendor logo removed', 'warning');
  };

  return (
    <DataContext.Provider value={{
      products, leads, categories, siteConfig, users, vendorLogos, vendorRegistrations, notifications,
      addProduct, updateProduct, deleteProduct,
      addLead, updateLeadStatus, assignLead, updateLeadRemarks, deleteLead,
      updateSiteConfig, addCategory, deleteCategory,
      addUser, deleteUser, addVendorLogo, deleteVendorLogo,
      addVendorRegistration, addNotification, removeNotification
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};