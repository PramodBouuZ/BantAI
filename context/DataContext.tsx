import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  compareList: Product[];
  
  // Product Actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Lead Actions
  addLead: (lead: Lead) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  assignLead: (id: string, vendor: string) => Promise<void>;
  updateLeadRemarks: (id: string, remarks: string) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Config/Category Actions
  updateSiteConfig: (config: SiteConfig) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;

  // User/Vendor Actions
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addVendorLogo: (asset: VendorAsset) => Promise<void>;
  deleteVendorLogo: (id: string) => Promise<void>;
  addVendorRegistration: (reg: VendorRegistration) => Promise<void>;

  // Notification Actions
  addNotification: (message: string, type: AppNotification['type']) => void;
  removeNotification: (id: string) => void;

  // Compare Actions
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
}

const defaultSiteConfig: SiteConfig = {
  siteName: 'BantConfirm',
  bannerTitle: 'The Premier IT Marketplace for MSMEs & Enterprises',
  bannerSubtitle: 'Discover, Compare, and Buy Enterprise-grade IT, Software, and Telecom solutions.',
  socialLinks: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [leads, setLeads] = useState<Lead[]>(RECENT_LEADS);
  const [categories, setCategories] = useState<string[]>(['Software', 'Telecom', 'Security', 'Connectivity', 'Infrastructure', 'Consulting']);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [users, setUsers] = useState<User[]>([]);
  const [vendorLogos, setVendorLogos] = useState<VendorAsset[]>([]);
  const [vendorRegistrations, setVendorRegistrations] = useState<VendorRegistration[]>([]);

  const addNotification = useCallback((message: string, type: AppNotification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    if (!supabase) return;
    try {
      const [
        { data: prodData },
        { data: configData },
        { data: vLogos },
        { data: catData },
        { data: leadData },
        { data: vRegData }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('site_config').select('*').maybeSingle(),
        supabase.from('vendor_assets').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('vendor_registrations').select('*').order('date', { ascending: false })
      ]);

      if (prodData) {
        setProducts(prodData.map((p: any) => ({
          id: p.id, title: p.title, description: p.description, category: p.category,
          priceRange: p.price_range, features: p.features || [], icon: p.icon || 'globe',
          rating: Number(p.rating), image: p.image
        })));
      }

      if (configData) {
        setSiteConfig({
          siteName: configData.site_name || defaultSiteConfig.siteName,
          bannerTitle: configData.banner_title || defaultSiteConfig.bannerTitle,
          bannerSubtitle: configData.banner_subtitle || defaultSiteConfig.bannerSubtitle,
          logoUrl: configData.logo_url,
          faviconUrl: configData.favicon_url,
          whatsappNumber: configData.whatsapp_number,
          socialLinks: configData.social_links || defaultSiteConfig.socialLinks
        });
      }

      if (vLogos) setVendorLogos(vLogos.map((v: any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url })));
      if (catData) setCategories(Array.from(new Set([...catData.map((c: any) => c.name), 'Software', 'Telecom'])));
      if (leadData) setLeads(leadData.map((l: any) => ({ ...l, priceRange: l.price_range })));
      if (vRegData) setVendorRegistrations(vRegData.map((v: any) => ({ ...v, companyName: v.company_name, productName: v.product_name })));
    } catch (err) {
      console.error("Fetch data failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!supabase) return;

    const channel = supabase.channel('global-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_assets' }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // --- ACTIONS WITH OPTIMISTIC UPDATES ---

  const addProduct = async (product: Product) => {
    // Optimistic UI Update
    setProducts(prev => [product, ...prev]);
    
    if (supabase) {
      const { error } = await supabase.from('products').insert({
         id: product.id, title: product.title, description: product.description, category: product.category,
         price_range: product.priceRange, features: product.features, icon: product.icon, rating: product.rating, image: product.image
      });
      if (error) {
        addNotification(`Failed to save: ${error.message}`, 'error');
        fetchData(); // Rollback to actual state
      } else {
        addNotification('Product added successfully', 'success');
      }
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    // Optimistic UI Update
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));

    if (supabase) {
      const { error } = await supabase.from('products').update({
         title: updatedProduct.title, description: updatedProduct.description, category: updatedProduct.category,
         price_range: updatedProduct.priceRange, features: updatedProduct.features, icon: updatedProduct.icon,
         rating: updatedProduct.rating, image: updatedProduct.image
      }).eq('id', id);
      
      if (error) {
        addNotification(`Update failed: ${error.message}`, 'error');
        fetchData(); // Rollback
      } else {
        addNotification('Product updated across all devices', 'success');
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const original = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));
    
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        addNotification(`Delete failed: ${error.message}`, 'error');
        setProducts(original);
      }
    }
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    const original = siteConfig;
    setSiteConfig(config);

    if (supabase) {
      const { error } = await supabase.from('site_config').upsert({
          id: 1, site_name: config.siteName, logo_url: config.logoUrl, favicon_url: config.faviconUrl,
          banner_title: config.bannerTitle, banner_subtitle: config.bannerSubtitle,
          whatsapp_number: config.whatsappNumber, social_links: config.socialLinks, updated_at: new Date().toISOString()
      });
      if (error) {
        addNotification(`Config update failed: ${error.message}`, 'error');
        setSiteConfig(original);
      } else {
        addNotification('Global settings updated successfully', 'success');
      }
    }
  };

  const addLead = async (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    if (supabase) {
      const { error } = await supabase.from('leads').insert({
         id: lead.id, name: lead.name, email: lead.email, mobile: lead.mobile, company: lead.company,
         location: lead.location, service: lead.service, budget: lead.budget, requirement: lead.requirement,
         status: lead.status, date: lead.date
      });
      if (error) {
        addNotification(`Failed to submit lead: ${error.message}`, 'error');
        fetchData();
      } else {
        addNotification('Enquiry Submitted!', 'success');
      }
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (supabase) await supabase.from('leads').update({ status }).eq('id', id);
  };

  const assignLead = async (id: string, vendor: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, assignedTo: vendor } : l));
    if (supabase) await supabase.from('leads').update({ assigned_to: vendor }).eq('id', id);
  };

  const updateLeadRemarks = async (id: string, remarks: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, remarks } : l));
    if (supabase) await supabase.from('leads').update({ remarks }).eq('id', id);
  };

  const deleteLead = async (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    if (supabase) await supabase.from('leads').delete().eq('id', id);
  };

  const addVendorRegistration = async (reg: VendorRegistration) => {
    setVendorRegistrations(prev => [reg, ...prev]);
    if (supabase) {
      await supabase.from('vendor_registrations').insert({
        id: reg.id, name: reg.name, company_name: reg.companyName, email: reg.email,
        mobile: reg.mobile, location: reg.location, product_name: reg.productName,
        message: reg.message, date: reg.date
      });
    }
  };

  const addCategory = async (category: string) => {
    setCategories(prev => [...prev, category]);
    if (supabase) await supabase.from('categories').insert({ name: category });
  };

  const deleteCategory = async (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    if (supabase) await supabase.from('categories').delete().eq('name', category);
  };

  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  const addVendorLogo = async (asset: VendorAsset) => {
    setVendorLogos(prev => [...prev, asset]);
    if (supabase) await supabase.from('vendor_assets').insert({ id: asset.id, name: asset.name, logo_url: asset.logoUrl });
  };

  const deleteVendorLogo = async (id: string) => {
    setVendorLogos(prev => prev.filter(v => v.id !== id));
    if (supabase) await supabase.from('vendor_assets').delete().eq('id', id);
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) {
        addNotification("Limit 3 products for comparison", "warning");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <DataContext.Provider value={{
      products, leads, categories, siteConfig, users, vendorLogos, vendorRegistrations, notifications, compareList,
      addProduct, updateProduct, deleteProduct,
      addLead, updateLeadStatus, assignLead, updateLeadRemarks, deleteLead,
      updateSiteConfig, addCategory, deleteCategory,
      addUser, deleteUser, addVendorLogo, deleteVendorLogo,
      addVendorRegistration, addNotification, removeNotification,
      toggleCompare, clearCompare
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