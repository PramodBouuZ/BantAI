
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Lead, SiteConfig, User, VendorAsset, VendorRegistration, AppNotification } from '../types';
import { PRODUCTS, RECENT_LEADS, MOCK_VENDOR_LOGOS } from '../services/mockData';
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
  addLead: (lead: Lead) => Promise<boolean>;
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

const ADMIN_EMAIL = 'info.bouuz@gmail.com';

const defaultSiteConfig: SiteConfig = {
  siteName: 'BantConfirm',
  bannerTitle: 'The Premier IT Marketplace for MSMEs & Enterprises',
  bannerSubtitle: 'Discover, Compare, and Buy Enterprise-grade IT, Software, and Telecom solutions.',
  adminNotificationEmail: ADMIN_EMAIL,
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
  const [vendorLogos, setVendorLogos] = useState<VendorAsset[]>(MOCK_VENDOR_LOGOS);
  const [vendorRegistrations, setVendorRegistrations] = useState<VendorRegistration[]>([]);

  const addNotification = useCallback((message: string, type: AppNotification['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const triggerAdminNotification = async (subject: string, payload: any) => {
    const target = siteConfig.adminNotificationEmail || ADMIN_EMAIL;
    console.log(`[ADMIN NOTIFICATION SENT] To: ${target} | Subject: ${subject}`);
    // Mocking email notification for UI feedback
    addNotification(`Admin Alert sent to ${target}`, 'info');
  };

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
        supabase.from('leads').select('*').order('date', { ascending: false }),
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
          adminNotificationEmail: configData.admin_notification_email || ADMIN_EMAIL,
          socialLinks: configData.social_links || defaultSiteConfig.socialLinks
        });
      }

      if (vLogos && vLogos.length > 0) {
        // FIXED: Corrected property mapping from logo_url (DB) to logoUrl (State/Type)
        setVendorLogos(vLogos.map((v: any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url })));
      }
      
      if (catData) setCategories(Array.from(new Set([...catData.map((c: any) => c.name), 'Software', 'Telecom'])));
      
      if (leadData) {
        setLeads(leadData.map((l: any) => ({
          id: l.id,
          name: l.name,
          email: l.email,
          mobile: l.mobile,
          company: l.company,
          location: l.location,
          service: l.service,
          budget: l.budget || 'Not Provided',
          requirement: l.requirement || '',
          authority: l.authority || 'Not Provided',
          timing: l.timing || 'Not Provided',
          status: l.status,
          date: l.date,
          remarks: l.remarks,
          assignedTo: l.assigned_to
        })));
      }

      if (vRegData) setVendorRegistrations(vRegData.map((v: any) => ({ ...v, companyName: v.company_name, productName: v.product_name })));
    } catch (err) {
      console.error("Fetch data failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!supabase) return;

    const channel = supabase.channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_assets' }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  const addLead = async (lead: Lead): Promise<boolean> => {
    if (supabase) {
      const { error } = await supabase.from('leads').insert({
         id: lead.id, 
         name: lead.name, 
         email: lead.email, 
         mobile: lead.mobile, 
         company: lead.company,
         location: lead.location, 
         service: lead.service, 
         budget: lead.budget || 'Not Provided', 
         requirement: lead.requirement || 'BANT Qualified Lead',
         authority: lead.authority || 'Not Provided', 
         timing: lead.timing || 'Not Provided',
         status: 'Pending', 
         date: new Date().toISOString().split('T')[0]
      });
      
      if (error) {
        console.error("Supabase Error:", error);
        addNotification(`Database Error: ${error.message}`, 'error');
        return false;
      } else {
        setLeads(prev => [lead, ...prev]);
        addNotification('Requirement posted successfully!', 'success');
        triggerAdminNotification('New Lead Received', { name: lead.name, company: lead.company, service: lead.service });
        return true;
      }
    }
    return false;
  };

  const addProduct = async (product: Product) => {
    if (supabase) {
      const { error } = await supabase.from('products').insert({
         id: product.id, title: product.title, description: product.description, category: product.category,
         price_range: product.priceRange, features: product.features, icon: product.icon, rating: product.rating, image: product.image
      });
      if (error) addNotification(error.message, 'error');
      fetchData();
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    if (supabase) {
      const { error } = await supabase.from('products').update({
         title: updatedProduct.title, description: updatedProduct.description, category: updatedProduct.category,
         price_range: updatedProduct.priceRange, features: updatedProduct.features, icon: updatedProduct.icon,
         rating: updatedProduct.rating, image: updatedProduct.image
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      fetchData();
    }
  };

  const deleteProduct = async (id: string) => {
    if (supabase) await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    if (supabase) {
      const { error } = await supabase.from('site_config').upsert({
          id: 1, 
          site_name: config.siteName, 
          logo_url: config.logoUrl, 
          favicon_url: config.faviconUrl,
          banner_title: config.bannerTitle, 
          banner_subtitle: config.bannerSubtitle,
          whatsapp_number: config.whatsappNumber, 
          admin_notification_email: config.adminNotificationEmail,
          social_links: config.socialLinks, 
          updated_at: new Date().toISOString()
      });
      if (error) addNotification(error.message, 'error');
      fetchData();
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    if (supabase) await supabase.from('leads').update({ status }).eq('id', id);
    fetchData();
  };

  const assignLead = async (id: string, vendor: string) => {
    if (supabase) await supabase.from('leads').update({ assigned_to: vendor }).eq('id', id);
    fetchData();
  };

  const updateLeadRemarks = async (id: string, remarks: string) => {
    if (supabase) await supabase.from('leads').update({ remarks }).eq('id', id);
    fetchData();
  };

  const deleteLead = async (id: string) => {
    if (supabase) await supabase.from('leads').delete().eq('id', id);
    fetchData();
  };

  const addVendorRegistration = async (reg: VendorRegistration) => {
    if (supabase) {
      const { error } = await supabase.from('vendor_registrations').insert({
        id: reg.id, name: reg.name, company_name: reg.companyName, email: reg.email,
        mobile: reg.mobile, location: reg.location, product_name: reg.productName,
        message: reg.message, date: reg.date
      });
      if (!error) {
        addNotification('Vendor application received!', 'success');
        triggerAdminNotification('New Vendor Signup', { company: reg.companyName, contact: reg.name });
      } else {
        addNotification(`Signup failed: ${error.message}`, 'error');
      }
    }
  };

  const addCategory = async (category: string) => {
    if (supabase) await supabase.from('categories').insert({ name: category });
    fetchData();
  };

  const deleteCategory = async (category: string) => {
    if (supabase) await supabase.from('categories').delete().eq('name', category);
    fetchData();
  };

  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  
  const addVendorLogo = async (asset: VendorAsset) => {
    if (supabase) {
      const { error } = await supabase.from('vendor_assets').insert({ id: asset.id, name: asset.name, logo_url: asset.logoUrl });
      if (error) addNotification(error.message, 'error');
      fetchData();
    }
  };
  
  const deleteVendorLogo = async (id: string) => {
    if (supabase) await supabase.from('vendor_assets').delete().eq('id', id);
    fetchData();
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
