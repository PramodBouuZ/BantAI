
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Lead, SiteConfig, User, VendorAsset, VendorRegistration, AppNotification, BlogPost, Category, City, State, SEOData } from '../types';
import { supabase } from '../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface DataContextType {
  products: Product[];
  leads: Lead[];
  categories: string[];
  categoryObjects: Category[];
  cities: City[];
  states: State[];
  users: User[];
  vendorLogos: VendorAsset[];
  vendorRegistrations: VendorRegistration[];
  blogs: BlogPost[];
  siteConfig: SiteConfig;
  notifications: AppNotification[];
  compareList: Product[];
  isLoading: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addBlog: (blog: BlogPost) => Promise<void>;
  updateBlog: (id: string, blog: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  addLead: (lead: Lead) => Promise<boolean>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  assignLead: (id: string, vendorId: string) => Promise<void>;
  updateLeadRemarks: (id: string, remarks: string) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  updateSiteConfig: (config: SiteConfig) => Promise<void>;

  addCategory: (category: string) => Promise<void>;
  updateCategory: (id: string, category: Category) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;

  addCity: (city: City) => Promise<void>;
  updateCity: (id: string, city: City) => Promise<void>;
  deleteCity: (id: string) => Promise<void>;

  addState: (state: State) => Promise<void>;
  updateState: (id: string, state: State) => Promise<void>;
  deleteState: (id: string) => Promise<void>;

  addUser: (user: User) => void;
  updateUserRole: (id: string, role: User['role']) => Promise<void>;
  updateVendorStatus: (id: string, status: User['status'], reason?: string) => Promise<void>;
  createVendorManual: (vendorData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
  addVendorLogo: (asset: VendorAsset) => Promise<void>;
  deleteVendorLogo: (id: string) => Promise<void>;
  addVendorRegistration: (reg: VendorRegistration) => Promise<void>;

  addNotification: (message: string, type: AppNotification['type']) => void;
  removeNotification: (id: string) => void;

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

export const DataContext = createContext<DataContextType | undefined>(undefined);

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const mapSEOToCamel = (item: any): SEOData => ({
  metaTitle: item.meta_title,
  metaDescription: item.meta_description,
  keywords: item.keywords,
  canonicalUrl: item.canonical_url,
  ogTitle: item.og_title,
  ogDescription: item.og_description,
  ogImage: item.og_image,
  twitterTitle: item.twitter_title,
  twitterDescription: item.twitter_description,
  twitterImage: item.twitter_image,
  focusKeywords: item.focus_keywords,
  seoScore: item.seo_score,
  schemaMarkup: item.schema_markup
});

const mapSEOToSnake = (item: SEOData) => ({
  meta_title: item.metaTitle,
  meta_description: item.metaDescription,
  keywords: item.keywords,
  canonical_url: item.canonicalUrl,
  og_title: item.ogTitle,
  og_description: item.ogDescription,
  og_image: item.ogImage,
  twitter_title: item.twitterTitle,
  twitter_description: item.twitterDescription,
  twitter_image: item.twitterImage,
  focus_keywords: item.focusKeywords,
  seo_score: item.seoScore,
  schema_markup: item.schemaMarkup
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

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

  // React Query Fetchers
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!supabase) return [];
      const start = performance.now();
      const { data, error } = await supabase.from('products').select('id, slug, title, description, category, price_range, features, icon, rating, image, vendor_name, technical_specs, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup');
      console.log(`Query: products took ${(performance.now() - start).toFixed(2)}ms`);
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        slug: p.slug || generateSlug(p.title || 'product'),
        title: p.title || 'Untitled Product',
        description: p.description || '',
        category: p.category || 'Uncategorized',
        priceRange: p.price_range || '',
        features: Array.isArray(p.features) ? p.features : [],
        icon: p.icon || 'globe',
        rating: Number(p.rating || 5),
        image: p.image || '',
        vendorName: p.vendor_name || '',
        technicalSpecs: Array.isArray(p.technical_specs) ? p.technical_specs : [],
        ...mapSEOToCamel(p)
      }));
    },
    enabled: !!supabase
  });

  const { data: configData } = useQuery({
    queryKey: ['site_config'],
    queryFn: async () => {
      if (!supabase) return defaultSiteConfig;
      const { data, error } = await supabase.from('site_config').select('site_name, banner_title, banner_subtitle, logo_url, favicon_url, whatsapp_number, admin_notification_email, social_links, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup').maybeSingle();
      if (error) throw error;
      if (!data) return defaultSiteConfig;
      return {
        siteName: data.site_name || defaultSiteConfig.siteName,
        bannerTitle: data.banner_title || defaultSiteConfig.bannerTitle,
        bannerSubtitle: data.banner_subtitle || defaultSiteConfig.bannerSubtitle,
        logoUrl: data.logo_url,
        faviconUrl: data.favicon_url,
        whatsappNumber: data.whatsapp_number,
        adminNotificationEmail: data.admin_notification_email || ADMIN_EMAIL,
        socialLinks: data.social_links || defaultSiteConfig.socialLinks,
        ...mapSEOToCamel(data)
      };
    },
    enabled: !!supabase
  });

  const { data: vLogos } = useQuery({
    queryKey: ['vendor_assets'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('vendor_assets').select('id, name, logo_url');
      if (error) throw error;
      return (data || []).map((v: any) => ({ id: v.id, name: v.name, logoUrl: v.logo_url }));
    },
    enabled: !!supabase
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('categories').select('id, name, slug, description, icon, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup');
      if (error) throw error;
      return (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || generateSlug(c.name),
        description: c.description,
        icon: c.icon,
        ...mapSEOToCamel(c)
      }));
    },
    enabled: !!supabase
  });

  const { data: leadData } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!supabase) return [];
      const start = performance.now();
      const { data, error } = await supabase.from('leads').select('id, name, email, mobile, company, location, service, budget, requirement, authority, timing, status, date, remarks, assigned_to').order('date', { ascending: false }).limit(50);
      console.log(`Query: leads took ${(performance.now() - start).toFixed(2)}ms`);
      if (error) throw error;
      return (data || []).map((l: any) => ({
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
      }));
    },
    enabled: !!supabase
  });

  const { data: blogData } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      if (!supabase) return [];
      const start = performance.now();
      const { data, error } = await supabase.from('blogs').select('id, slug, title, content, category, image, author, date, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup').order('date', { ascending: false });
      console.log(`Query: blogs took ${(performance.now() - start).toFixed(2)}ms`);
      if (error) throw error;
      return (data || []).map((b: any) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        content: b.content,
        category: b.category,
        image: b.image,
        author: b.author,
        date: b.date,
        ...mapSEOToCamel(b)
      }));
    },
    enabled: !!supabase
  });

  const { data: cityData } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('cities').select('id, name, slug, state_id, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup');
      if (error) throw error;
      return (data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug || generateSlug(c.name),
        stateId: c.state_id,
        ...mapSEOToCamel(c)
      }));
    },
    enabled: !!supabase
  });

  const { data: stateData } = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('states').select('id, name, slug, meta_title, meta_description, keywords, canonical_url, og_title, og_description, og_image, twitter_title, twitter_description, twitter_image, focus_keywords, seo_score, schema_markup');
      if (error) throw error;
      return (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug || generateSlug(s.name),
        ...mapSEOToCamel(s)
      }));
    },
    enabled: !!supabase
  });

  const { data: userData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('users').select('id, full_name, email, role, mobile, company, location, created_at, status, verification_date, verified_by, products, services, logo_url, is_first_login');
      if (error) throw error;
      return (data || []).map((u: any) => ({
        id: u.id,
        name: u.full_name || 'User',
        email: u.email,
        role: u.role,
        mobile: u.mobile,
        company: u.company,
        location: u.location,
        joinedDate: u.created_at || u.joined_date,
        status: u.status || 'Pending',
        verificationDate: u.verification_date,
        verifiedBy: u.verified_by,
        products: u.products || [],
        services: u.services || [],
        logoUrl: u.logo_url,
        isFirstLogin: u.is_first_login
      }));
    },
    enabled: !!supabase
  });

  const { data: vRegData } = useQuery({
    queryKey: ['vendor_registrations'],
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('vendor_registrations').select('id, name, company_name, email, mobile, location, product_name, message, date').order('date', { ascending: false }).limit(50);
      if (error) throw error;
      return (data || []).map((v: any) => ({
        ...v, 
        companyName: v.company_name, 
        productName: v.product_name 
      }));
    },
    enabled: !!supabase
  });

  // Derived States
  const products = prodData || [];
  const leads = leadData || [];
  const categoryObjects = catData || [];
  const categories = Array.from(new Set(categoryObjects.map((c: any) => c.name)));
  const cities = cityData || [];
  const states = stateData || [];
  const siteConfig = configData || defaultSiteConfig;
  const vendorLogos = vLogos || [];
  const vendorRegistrations = vRegData || [];
  const blogs = blogData || [];
  const users = userData || [];
  const isLoading = prodLoading || leadData === undefined || blogData === undefined;

  useEffect(() => {
    const checkUser = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('id, full_name, role, company, status, logo_url, is_first_login')
              .eq('id', session.user.id)
              .single();

            const meta = session.user.user_metadata || {};
            const role = session.user.email === 'info.bouuz@gmail.com' ? 'admin' : (userData?.role || meta.role || 'user');

            setCurrentUser({
              id: session.user.id,
              name: userData?.full_name || meta.full_name || meta.name || 'User',
              email: session.user.email || '',
              role: role as any,
              joinedDate: session.user.created_at,
              company: userData?.company || meta.company,
              status: userData?.status || meta.status,
              logoUrl: userData?.logo_url || meta.logo_url,
              isFirstLogin: userData?.is_first_login ?? meta.is_first_login
            });
          }
        } catch (err) {
          console.error("DataContext: Session check failed:", err);
        }
      }
    };
    checkUser();

    if (!supabase) {
      addNotification("Supabase is not configured. Please check your environment variables.", "error");
      return;
    }
    const channel = supabase.channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => queryClient.invalidateQueries({ queryKey: ['leads'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => queryClient.invalidateQueries({ queryKey: ['products'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => queryClient.invalidateQueries({ queryKey: ['blogs'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => queryClient.invalidateQueries({ queryKey: ['site_config'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => queryClient.invalidateQueries({ queryKey: ['categories'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cities' }, () => queryClient.invalidateQueries({ queryKey: ['cities'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'states' }, () => queryClient.invalidateQueries({ queryKey: ['states'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => queryClient.invalidateQueries({ queryKey: ['users'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_assets' }, () => queryClient.invalidateQueries({ queryKey: ['vendor_assets'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendor_registrations' }, () => queryClient.invalidateQueries({ queryKey: ['vendor_registrations'] }))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const addLead = async (lead: Lead): Promise<boolean> => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return false;
    }
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
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      addNotification('Requirement posted successfully!', 'success');
      return true;
    }
    return true;
  };

  const addProduct = async (product: Product) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { id, ...productWithoutId } = product;
      const { error } = await supabase.from('products').insert({
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
         technical_specs: product.technicalSpecs,
         ...mapSEOToSnake(product)
      });
      if (error) addNotification(error.message, 'error');
      else {
        addNotification('Product added!', 'success');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
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
         technical_specs: updatedProduct.technicalSpecs,
         ...mapSEOToSnake(updatedProduct)
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  const addBlog = async (blog: BlogPost) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { id, ...blogWithoutId } = blog;
      const { error } = await supabase.from('blogs').insert({
        slug: blog.slug || generateSlug(blog.title),
        title: blog.title,
        content: blog.content,
        category: blog.category,
        image: blog.image,
        author: blog.author,
        date: blog.date,
        ...mapSEOToSnake(blog)
      });

      if (error) addNotification(`Database Error: ${error.message}`, 'error');
      else {
        addNotification('Insight article published!', 'success');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      }
    }
  };

  const updateBlog = async (id: string, blog: BlogPost) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from('blogs').update({
        slug: blog.slug || generateSlug(blog.title),
        title: blog.title,
        content: blog.content,
        category: blog.category,
        image: blog.image,
        author: blog.author,
        date: blog.date,
        ...mapSEOToSnake(blog)
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  };

  const deleteBlog = async (id: string) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  };

  const updateSiteConfig = async (config: SiteConfig) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
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
          updated_at: new Date().toISOString(),
          ...mapSEOToSnake(config)
      });
      if (error) addNotification(error.message, 'error');
      else {
        addNotification('Global configuration synced.', 'success');
        queryClient.invalidateQueries({ queryKey: ['site_config'] });
      }
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      await supabase.from('leads').update({ status }).eq('id', id);

      // Trigger Status Change Emails
      const lead = leads.find(l => l.id === id);
      if (lead) {
        // Notify User
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            type: 'lead_status_change',
            referenceId: lead.id,
            data: {
              name: lead.name,
              newStatus: status,
              referenceId: lead.id,
              serviceName: lead.service
            }
          })
        }).catch(err => console.error('Status change user notification error:', err));

        // Notify Vendor if assigned
        if (lead.assignedTo) {
          const vendor = users.find(u => u.id === lead.assignedTo);
          if (vendor) {
            fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: vendor.email,
                type: 'lead_status_change',
                vendorId: vendor.id,
                referenceId: lead.id,
                data: {
                  name: vendor.name,
                  newStatus: status,
                  referenceId: lead.id,
                  serviceName: lead.service
                }
              })
            }).catch(err => console.error('Status change vendor notification error:', err));
          }
        }
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  };

  const assignLead = async (id: string, vendorId: string) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const vendor = users.find(u => u.id === vendorId);

      if (vendor && vendor.status !== 'Verified') {
        addNotification("Leads can only be assigned to Verified vendors.", "warning");
        return;
      }

      await supabase.from('leads').update({ assigned_to: vendorId }).eq('id', id);

      const lead = leads.find(l => l.id === id);

      if (lead && vendor) {
        // Trigger Vendor Lead Assignment Email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: vendor.email,
            type: 'vendor_lead_assignment',
            vendorId: vendor.id,
            referenceId: lead.id,
            data: {
              vendorName: vendor.name,
              referenceId: lead.id,
              serviceName: lead.service,
              customerName: lead.name,
              date: new Date().toISOString().split('T')[0]
            }
          })
        }).catch(err => console.error('Vendor assignment email error:', err));

        // Trigger User Vendor Assigned Email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            type: 'user_vendor_assigned',
            referenceId: lead.id,
            data: {
              userName: lead.name,
              referenceId: lead.id,
              serviceName: lead.service,
              vendorCompanyName: vendor.company || vendor.name
            }
          })
        }).catch(err => console.error('User vendor assigned email error:', err));
      }
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  };

  const updateLeadRemarks = async (id: string, remarks: string) => {
    if (supabase) {
      await supabase.from('leads').update({ remarks }).eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  };

  const deleteLead = async (id: string) => {
    if (supabase) {
      await supabase.from('leads').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  };

  const addVendorRegistration = async (reg: VendorRegistration) => {
    if (supabase) {
      const { error } = await supabase.from('vendor_registrations').insert({
        id: reg.id, name: reg.name, company_name: reg.companyName, email: reg.email,
        mobile: reg.mobile, location: reg.location, product_name: reg.productName,
        message: reg.message, date: reg.date
      });
      if (error) addNotification(`Registration Error: ${error.message}`, 'error');
      else {
        addNotification('Vendor registered!', 'success');
        queryClient.invalidateQueries({ queryKey: ['vendor_registrations'] });
      }
    }
  };

  const addCategory = async (category: string) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      await supabase.from('categories').insert({
        name: category,
        slug: generateSlug(category)
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  };

  const updateCategory = async (id: string, category: Category) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      const { error } = await supabase.from('categories').update({
        name: category.name,
        slug: category.slug || generateSlug(category.name),
        description: category.description,
        icon: category.icon,
        ...mapSEOToSnake(category)
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  };

  const deleteCategory = async (category: string) => {
    if (!supabase) {
      addNotification("Database connection not established.", "error");
      return;
    }
    if (supabase) {
      await supabase.from('categories').delete().eq('name', category);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  };

  const addCity = async (city: City) => {
    if (supabase) {
      const { id, ...cityWithoutId } = city;
      const { error } = await supabase.from('cities').insert({
        name: city.name,
        slug: city.slug || generateSlug(city.name),
        state_id: city.stateId,
        ...mapSEOToSnake(city)
      });
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  };

  const updateCity = async (id: string, city: City) => {
    if (supabase) {
      const { error } = await supabase.from('cities').update({
        name: city.name,
        slug: city.slug || generateSlug(city.name),
        state_id: city.stateId,
        ...mapSEOToSnake(city)
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  };

  const deleteCity = async (id: string) => {
    if (supabase) {
      await supabase.from('cities').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  };

  const addState = async (state: State) => {
    if (supabase) {
      const { id, ...stateWithoutId } = state;
      const { error } = await supabase.from('states').insert({
        name: state.name,
        slug: state.slug || generateSlug(state.name),
        ...mapSEOToSnake(state)
      });
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['states'] });
    }
  };

  const updateState = async (id: string, state: State) => {
    if (supabase) {
      const { error } = await supabase.from('states').update({
        name: state.name,
        slug: state.slug || generateSlug(state.name),
        ...mapSEOToSnake(state)
      }).eq('id', id);
      if (error) addNotification(error.message, 'error');
      else queryClient.invalidateQueries({ queryKey: ['states'] });
    }
  };

  const deleteState = async (id: string) => {
    if (supabase) {
      await supabase.from('states').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['states'] });
    }
  };

  const addUser = (user: User) => {
    queryClient.setQueryData(['users'], (old: User[] | undefined) => old ? [...old, user] : [user]);
  };

  const updateUserRole = async (id: string, role: User['role']) => {
    if (supabase) {
      await supabase.from('users').update({ role, status: role === 'vendor' ? 'Pending' : null }).eq('id', id);

      if (role === 'vendor') {
        const user = users.find(u => u.id === id);
        if (user) {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              type: 'vendor_welcome',
              vendorId: user.id,
              data: {
                vendorName: user.name,
                companyName: user.company || 'Your Company'
              }
            })
          }).catch(err => console.error('Vendor welcome email error:', err));
        }
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  };

  const updateVendorStatus = async (id: string, status: User['status'], reason?: string) => {
    if (supabase) {
      const updateData: any = { status };
      if (status === 'Verified') {
        updateData.verification_date = new Date().toISOString();
        updateData.verified_by = ADMIN_EMAIL;
      }

      await supabase.from('users').update(updateData).eq('id', id);

      const user = users.find(u => u.id === id);
      if (user) {
        if (status === 'Verified') {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              type: 'vendor_approval',
              vendorId: user.id,
              data: {
                vendorName: user.name,
                companyName: user.company || 'Your Company'
              }
            })
          }).catch(err => console.error('Vendor approval email error:', err));
        } else if (status === 'Rejected') {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              type: 'vendor_rejected',
              vendorId: user.id,
              data: {
                vendorName: user.name,
                companyName: user.company || 'Your Company',
                reason: reason
              }
            })
          }).catch(err => console.error('Vendor rejection email error:', err));
        }
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addNotification(`Vendor status updated to ${status}`, 'success');
    }
  };

  const createVendorManual = async (vendorData: Partial<User>) => {
    try {
      const res = await fetch('/api/create-vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: vendorData.name,
          email: vendorData.email,
          company: vendorData.company,
          mobile: vendorData.mobile,
          location: vendorData.location,
          products: vendorData.products,
          services: vendorData.services,
          logoUrl: vendorData.logoUrl
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create vendor');

      addNotification('Vendor account created successfully with Auth!', 'success');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err: any) {
      addNotification(`Error creating vendor: ${err.message}`, 'error');
    }
  };

  const deleteUser = (id: string) => {
     if(supabase) supabase.from('users').delete().eq('id', id).then(() => queryClient.invalidateQueries({ queryKey: ['users'] }));
  };
  
  const addVendorLogo = async (asset: VendorAsset) => {
    if (supabase) {
      await supabase.from('vendor_assets').insert({ name: asset.name, logo_url: asset.logoUrl });
      queryClient.invalidateQueries({ queryKey: ['vendor_assets'] });
    }
  };
  
  const deleteVendorLogo = async (id: string) => {
    if (supabase) {
      await supabase.from('vendor_assets').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['vendor_assets'] });
    }
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
      products, leads, categories, categoryObjects, cities, states, siteConfig, users, vendorLogos, vendorRegistrations, blogs, notifications, compareList, isLoading, currentUser, setCurrentUser,
      addProduct, updateProduct, deleteProduct,
      addBlog, updateBlog, deleteBlog,
      addLead, updateLeadStatus, assignLead, updateLeadRemarks, deleteLead,
      updateSiteConfig, addCategory, updateCategory, deleteCategory,
      addCity, updateCity, deleteCity,
      addState, updateState, deleteState,
      addUser, updateUserRole, updateVendorStatus, createVendorManual, deleteUser, addVendorLogo, deleteVendorLogo,
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
