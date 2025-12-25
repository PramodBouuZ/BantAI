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
  assignLead: (id: string, vendorId: string) => Promise<void>;
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
  bannerTitle: 'BantConfirm – India’s AI-Powered B2B Marketplace for',
  bannerSubtitle: 'Find the Right Software, IT Hardware & Business Solutions in India. Verified vendors, transparent pricing, and AI-qualified requirements.',
  adminNotificationEmail: ADMIN_EMAIL,
  socialLinks: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to generate a slug from a title
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  // Initialize with MOCK data first so site isn't empty during initial load
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
    console.log(`[ADMIN NOTIFICATION SENT] To: ${target} | Subject: ${subject} | Details:`, payload);
  };

  const triggerVendorNotification = async (vendor: User, lead: Lead) => {
    console.log(`[VENDOR NOTIFICATION] To: ${vendor.email} | Channel: Email & WhatsApp (${vendor.mobile})`);
    addNotification(`Notification sent to Vendor ${vendor.name}`, 'success');
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
        { data: vRegData },
        { data: userData }
      ] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('site_config').select('*').maybeSingle(),
        supabase.from('vendor_assets').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('leads').select('*').order('date', { ascending: false }),
        supabase.from('vendor_registrations').select('*').order('date', { ascending: false }),
        supabase.from('users').select('*')
      ]);

      if (prodData) {
        // If the database has data, we replace the mock data. 
        // If the database is empty but initialized, we show an empty marketplace.
        const dbProducts = prodData.map((p: any) => ({
          id: p.id, 
          slug: p.slug || generateSlug(p.title),
          title: p.title, 
          description: p.description, 
          category: p.category,
          priceRange: p.price_range, 
          features: p.features || [], 
          icon: p.icon || 'globe',
          rating: Number(p.rating), 
          image: p.image,
          vendorName: p.vendor_name, 
          technicalSpecs: p.technical_specs || []
        }));
        
        // Only override mock data if there are actual items in the DB, 
        // otherwise stay on mock data for first-time setup experience.
        if (dbProducts.length > 0) {
          setProducts(dbProducts);
        }
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
        setVendorLogos(vLogos.map((v: any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url })));
      }
      
      if (catData && catData.length > 0) {
        setCategories(Array.from(new Set([...catData.map((c: any) => c.name)])));
      }
      
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
      
      if (userData) {
        setUsers(userData.map((u: any) => ({
          id: u.id,
          name: u.name || u.full_name,
          email: u.email,
          role: u.role,
          mobile: u.mobile,
          company: u.company,
          location: u.location,
          joinedDate: u.created_at || u.joined_date
        })));
      }
    } catch (err) {
      console.error("Fetch data failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (!supabase) return;

    const channel = supabase.channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_assets' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchData)
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
        addNotification(`Database Error: ${error.message}`, 'error');
        return false;
      } else {
        setLeads(prev => [lead, ...prev]);
        addNotification('Requirement posted successfully!', 'success');
        triggerAdminNotification('New Inquiry Received', lead);
        return true;
      }
    }
    // Mock successful addition if no supabase
    setLeads(prev => [lead, ...prev]);
    return true;
  };

  const addProduct = async (product: Product) => {
    // Optimistic Update: Add to local state immediately
    setProducts(prev => [product, ...prev]);
    
    if (supabase) {
      const { error } = await supabase.from('products').insert({
         id: product.id, 
         slug: product.slug || generateSlug(product.title),
         title: product.title, 
         description: product.description, 
         category: product.category,
         price_range: product.priceRange, 
         features: product.features, 
         icon: product.icon, 
         rating: product.rating, 
         image: product.image,
         vendor_name: product.vendorName, 
         technical_specs: product.technicalSpecs
      });
      if (error) {
        addNotification(error.message, 'error');
        fetchData(); // Rollback/Refetch
      } else {
        addNotification('Product added to marketplace!', 'success');
        fetchData(); // Confirm with DB data
      }
    } else {
      addNotification('Product added locally (Database not connected)', 'info');
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));

    if (supabase) {
      const { error } = await supabase.from('products').update({
         slug: updatedProduct.slug || generateSlug(updatedProduct.title),
         title: updatedProduct.title, 
         description: updatedProduct.description, 
         category: updatedProduct.category,
         price_range: updatedProduct.priceRange, 
         features: updatedProduct.features, 
         icon: updatedProduct.icon,
         rating: updatedProduct.rating, 
         image: updatedProduct.image,
         vendor_name: updatedProduct.vendorName, 
         technical_specs: updatedProduct.technicalSpecs
      }).eq('id', id);
      if (error) {
        addNotification(error.message, 'error');
        fetchData();
      } else {
        addNotification('Product updated successfully!', 'success');
        fetchData();
      }
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistic Update
    setProducts(prev => prev.filter(p => p.id !== id));

    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        addNotification(error.message, 'error');
        fetchData();
      } else {
        addNotification('Product removed.', 'info');
        fetchData();
      }
    }
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    setSiteConfig(config);
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
      else addNotification('Site configuration saved.', 'success');
      fetchData();
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (supabase) await supabase.from('leads').update({ status }).eq('id', id);
  };

  const assignLead = async (id: string, vendorId: string) => {
    if (supabase) {
        const { error } = await supabase.from('leads').update({ assigned_to: vendorId }).eq('id', id);
        if (!error) {
            const vendor = users.find(u => u.id === vendorId);
            const lead = leads.find(l => l.id === id);
            if (vendor && lead) {
                triggerVendorNotification(vendor, lead);
            }
        }
    }
    fetchData();
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
      const { error } = await supabase.from('vendor_registrations').insert({
        id: reg.id, name: reg.name, company_name: reg.companyName, email: reg.email,
        mobile: reg.mobile, location: reg.location, product_name: reg.productName,
        message: reg.message, date: reg.date
      });
      if (!error) {
        addNotification('Vendor application received!', 'success');
        triggerAdminNotification('New Vendor Registration', reg);
      } else {
        addNotification(`Signup failed: ${error.message}`, 'error');
        fetchData();
      }
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
    if (supabase) {
      const { error } = await supabase.from('vendor_assets').insert({ id: asset.id, name: asset.name, logo_url: asset.logoUrl });
      if (error) {
        addNotification(error.message, 'error');
        fetchData();
      }
    }
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