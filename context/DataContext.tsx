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
  // If Supabase is connected, try to fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('leads').select('*');
        if (data && !error) {
          // Merge Supabase leads with local ones (simplified strategy)
          setLeads(prev => {
             const existingIds = new Set(prev.map(l => l.id));
             const newLeads = data.filter((l: any) => !existingIds.has(l.id)) as Lead[];
             return [...newLeads, ...prev];
          });
        }
      } catch (err) {
        console.warn("Supabase fetch error (likely table doesn't exist yet):", err);
      }
    };
    fetchLeads();
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('siteConfig', JSON.stringify(siteConfig)); }, [siteConfig]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('vendorLogos', JSON.stringify(vendorLogos)); }, [vendorLogos]);

  // --- ACTIONS ---
  const addProduct = (product: Product) => setProducts([...products, product]);
  const updateProduct = (id: string, updatedProduct: Product) => setProducts(products.map(p => p.id === id ? updatedProduct : p));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addLead = async (lead: Lead) => {
    // 1. Optimistic Update (Local)
    setLeads([lead, ...leads]);
    
    // 2. Supabase Insert (if configured)
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
      } catch (err) {
        console.error("Failed to sync lead to Supabase:", err);
      }
    }
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  const assignLead = (id: string, vendor: string) => setLeads(leads.map(l => l.id === id ? { ...l, assignedTo: vendor } : l));
  const updateLeadRemarks = (id: string, remarks: string) => setLeads(leads.map(l => l.id === id ? { ...l, remarks } : l));
  const deleteLead = (id: string) => setLeads(leads.filter(l => l.id !== id));

  const updateSiteConfig = (config: SiteConfig) => setSiteConfig(config);
  const addCategory = (category: string) => {
    if (!categories.includes(category)) setCategories([...categories, category]);
  };
  const deleteCategory = (category: string) => setCategories(categories.filter(c => c !== category));

  const addUser = (user: User) => setUsers([...users, user]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addVendorLogo = (asset: VendorAsset) => setVendorLogos([...vendorLogos, asset]);
  const deleteVendorLogo = (id: string) => setVendorLogos(vendorLogos.filter(v => v.id !== id));

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