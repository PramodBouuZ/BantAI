import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Lead, SiteConfig, User, VendorAsset } from '../types';
import { PRODUCTS, RECENT_LEADS } from '../services/mockData';
import { supabase } from '../lib/supabase';

interface DataContextType {
  products: Product[];
  leads: Lead[];
  categories: string[];
  users: User[];
  vendorLogos: VendorAsset[];
  siteConfig: SiteConfig;
  
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

  // --- SUPABASE SYNC ---
  useEffect(() => {
    const syncData = async () => {
      if (!supabase) return;

      // 1. Fetch Leads
      try {
        const { data, error } = await supabase.from('leads').select('*');
        if (data && !error) {
          setLeads(prev => {
             const existingIds = new Set(prev.map(l => l.id));
             const newLeads = data.filter((l: any) => !existingIds.has(l.id)) as Lead[];
             return [...newLeads, ...prev];
          });
        }
      } catch (err) { /* silent */ }

      // 2. Fetch Site Config
      try {
        const { data: configData, error: configError } = await supabase.from('site_config').select('*').single();
        if (configData && !configError) {
           const newConfig: SiteConfig = {
               siteName: configData.site_name || defaultSiteConfig.siteName,
               bannerTitle: configData.banner_title || defaultSiteConfig.bannerTitle,
               bannerSubtitle: configData.banner_subtitle || defaultSiteConfig.bannerSubtitle,
               logoUrl: configData.logo_url || undefined,
               faviconUrl: configData.favicon_url || undefined,
               whatsappNumber: configData.whatsapp_number || undefined,
               socialLinks: configData.social_links || defaultSiteConfig.socialLinks,
               bannerImage: undefined
           };
           setSiteConfig(newConfig);
           localStorage.setItem('siteConfig', JSON.stringify(newConfig));
        }
      } catch (err) { /* silent */ }

      // 3. Fetch Products
      try {
        const { data: prodData, error: prodError } = await supabase.from('products').select('*');
        if (prodData && !prodError && prodData.length > 0) {
           const mappedProducts: Product[] = prodData.map((p: any) => ({
             id: p.id,
             title: p.title,
             description: p.description,
             category: p.category,
             priceRange: p.price_range,
             features: p.features || [],
             icon: p.icon || 'globe',
             rating: Number(p.rating),
             image: p.image
           }));
           setProducts(mappedProducts);
           localStorage.setItem('products', JSON.stringify(mappedProducts));
        }
      } catch (err) { console.error("Error fetching products", err); }

      // 4. Fetch Categories
      try {
        const { data: catData, error: catError } = await supabase.from('categories').select('*');
        if (catData && !catError && catData.length > 0) {
           const mappedCats = catData.map((c: any) => c.name);
           // Merge with defaults to ensure we always have base categories
           const uniqueCats = Array.from(new Set([...mappedCats, 'Software', 'Telecom', 'Connectivity']));
           setCategories(uniqueCats);
           localStorage.setItem('categories', JSON.stringify(uniqueCats));
        }
      } catch (err) { /* silent */ }

      // 5. Fetch Vendor Assets
      try {
        const { data: vendorData, error: vendorError } = await supabase.from('vendor_assets').select('*');
        if (vendorData && !vendorError && vendorData.length > 0) {
           const mappedVendors: VendorAsset[] = vendorData.map((v: any) => ({
             id: v.id,
             name: v.name,
             logoUrl: v.logo_url
           }));
           setVendorLogos(mappedVendors);
           localStorage.setItem('vendorLogos', JSON.stringify(mappedVendors));
        }
      } catch (err) { /* silent */ }
    };
    
    syncData();
  }, []);

  // --- ACTIONS (With Supabase Write) ---

  const addProduct = async (product: Product) => {
    setProducts([...products, product]);
    localStorage.setItem('products', JSON.stringify([...products, product]));
    
    if (supabase) {
      await supabase.from('products').insert({
         id: product.id,
         title: product.title,
         description: product.description,
         category: product.category,
         price_range: product.priceRange,
         features: product.features,
         icon: product.icon,
         rating: product.rating,
         image: product.image
      });
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === id ? updatedProduct : p);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));

    if (supabase) {
      await supabase.from('products').update({
         title: updatedProduct.title,
         description: updatedProduct.description,
         category: updatedProduct.category,
         price_range: updatedProduct.priceRange,
         features: updatedProduct.features,
         icon: updatedProduct.icon,
         rating: updatedProduct.rating,
         image: updatedProduct.image
      }).eq('id', id);
    }
  };

  const deleteProduct = async (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));

    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const addLead = async (lead: Lead) => {
    setLeads([lead, ...leads]);
    if (supabase) {
      try {
        await supabase.from('leads').insert({
           id: lead.id,
           name: lead.name,
           email: lead.email,
           mobile: lead.mobile,
           company: lead.company,
           service: lead.service,
           budget: lead.budget,
           status: lead.status,
           date: lead.date
        });
      } catch (err) { console.error("Failed to sync lead", err); }
    }
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  const assignLead = (id: string, vendor: string) => setLeads(leads.map(l => l.id === id ? { ...l, assignedTo: vendor } : l));
  const updateLeadRemarks = (id: string, remarks: string) => setLeads(leads.map(l => l.id === id ? { ...l, remarks } : l));
  const deleteLead = (id: string) => setLeads(leads.filter(l => l.id !== id));

  const updateSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
    localStorage.setItem('siteConfig', JSON.stringify(config));
    if (supabase) {
      await supabase.from('site_config').upsert({
          id: 1,
          site_name: config.siteName,
          logo_url: config.logoUrl,
          favicon_url: config.faviconUrl,
          banner_title: config.bannerTitle,
          banner_subtitle: config.bannerSubtitle,
          whatsapp_number: config.whatsappNumber,
          social_links: config.socialLinks,
          updated_at: new Date().toISOString()
      });
    }
  };

  const addCategory = async (category: string) => {
    if (!categories.includes(category)) {
      const newCats = [...categories, category];
      setCategories(newCats);
      localStorage.setItem('categories', JSON.stringify(newCats));
      if (supabase) {
        await supabase.from('categories').insert({ name: category });
      }
    }
  };

  const deleteCategory = async (category: string) => {
    const newCats = categories.filter(c => c !== category);
    setCategories(newCats);
    localStorage.setItem('categories', JSON.stringify(newCats));
    if (supabase) {
      await supabase.from('categories').delete().eq('name', category);
    }
  };

  const addUser = (user: User) => setUsers([...users, user]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addVendorLogo = async (asset: VendorAsset) => {
    const newLogos = [...vendorLogos, asset];
    setVendorLogos(newLogos);
    localStorage.setItem('vendorLogos', JSON.stringify(newLogos));
    if (supabase) {
      await supabase.from('vendor_assets').insert({
        id: asset.id,
        name: asset.name,
        logo_url: asset.logoUrl
      });
    }
  };

  const deleteVendorLogo = async (id: string) => {
    const newLogos = vendorLogos.filter(v => v.id !== id);
    setVendorLogos(newLogos);
    localStorage.setItem('vendorLogos', JSON.stringify(newLogos));
    if (supabase) {
      await supabase.from('vendor_assets').delete().eq('id', id);
    }
  };

  return (
    <DataContext.Provider value={{
      products, leads, categories, siteConfig, users, vendorLogos,
      addProduct, updateProduct, deleteProduct,
      addLead, updateLeadStatus, assignLead, updateLeadRemarks, deleteLead,
      updateSiteConfig, addCategory, deleteCategory,
      addUser, deleteUser, addVendorLogo, deleteVendorLogo
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