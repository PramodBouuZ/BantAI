import React, { useEffect, useState, useRef } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration, SiteConfig, BlogPost, SEOData, Category, City, State } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee, Star, ExternalLink, Globe, Phone, MapPin,
  Building2,
  Zap, Mail, Camera, UserCheck, PlusCircle, Trash, Newspaper, Search, MoreVertical, Archive, ArrowRight, Calendar, User as UserIcon,
  BarChart, Activity, Link as LinkIcon, Eye, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadBase64Image } from '../lib/storage';

interface DashboardProps {
  currentUser: User | null;
}

const generateSlug = (text: string) => {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
};

const ImageUploadZone: React.FC<{
  label: string;
  value?: string;
  onUpload: (base64: string) => void;
  onClear: () => void;
  className?: string;
  aspectRatio?: string;
    loading?: boolean;
  }> = ({ label, value, onUpload, onClear, className = "", aspectRatio = "aspect-video", loading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
          alert('Only PNG, JPG, JPEG, or WEBP files are allowed.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => onUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <div onClick={() => !value && fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center overflow-hidden group ${value ? 'border-indigo-100 bg-white' : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer'} ${aspectRatio}`}>
        {value ? (
          <div className="relative w-full h-full animate-fade-in">
            <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-2 bg-white text-blue-600 rounded-xl hover:scale-110 transition shadow-lg"><Edit2 size={20} /></button>
              <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="p-2 bg-white text-red-600 rounded-xl hover:scale-110 transition shadow-lg"><Trash2 size={20} /></button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            {loading ? (
               <div className="animate-spin text-blue-600"><Zap size={24} /></div>
            ) : (
               <>
                 <div className="bg-white p-3 rounded-xl shadow-sm text-slate-400 mx-auto mb-2 inline-block"><Upload size={24} /></div>
                 <p className="text-sm font-bold text-slate-600">Click to upload</p>
                 <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">PNG, JPG, JPEG, WEBP</p>
               </>
            )}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleChange} />
      </div>
    </div>
  );
};

const GooglePreview: React.FC<{ title: string; slug: string; description: string }> = ({ title, slug, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">B</div>
      <div className="flex flex-col">
        <span className="text-[12px] text-slate-900 leading-tight">BantConfirm</span>
        <span className="text-[10px] text-slate-500 leading-tight">https://bantconfirm.com › {slug || '...'}</span>
      </div>
    </div>
    <h3 className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer mb-1 line-clamp-1">
      {title || 'Page Title - BantConfirm'}
    </h3>
    <p className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
      {description || 'Provide a meta description to see how your page will appear in Google search results. A good description is between 150-160 characters.'}
    </p>
  </div>
);

const SEOFieldGroup: React.FC<{
  data: SEOData;
  onChange: (data: SEOData) => void;
  defaultTitle?: string;
  defaultSlug?: string;
}> = ({ data, onChange, defaultTitle, defaultSlug }) => {
  const handleChange = (field: keyof SEOData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="text-blue-600" size={24} />
        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">SEO & Meta Management</h4>
      </div>

      <div className="mb-10">
        <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-widest">Google Search Snippet Preview</label>
        <GooglePreview
          title={data.metaTitle || defaultTitle || ''}
          slug={data.canonicalUrl || defaultSlug || ''}
          description={data.metaDescription || ''}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Meta Title</label>
          <input type="text" className="w-full bg-white p-4.5 rounded-2xl font-bold text-slate-800 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" value={data.metaTitle || ''} onChange={e => handleChange('metaTitle', e.target.value)} placeholder="Recommended: 50-60 characters" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">URL Slug</label>
          <input type="text" className="w-full bg-white p-4.5 rounded-2xl font-bold text-blue-600 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" value={data.canonicalUrl || ''} onChange={e => handleChange('canonicalUrl', e.target.value)} placeholder="/custom-url-slug" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Meta Description</label>
        <textarea rows={3} className="w-full bg-white p-4.5 rounded-2xl font-medium text-slate-700 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm resize-none" value={data.metaDescription || ''} onChange={e => handleChange('metaDescription', e.target.value)} placeholder="Recommended: 150-160 characters" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Focus Keywords (CSV)</label>
          <input type="text" className="w-full bg-white p-4.5 rounded-2xl font-bold text-slate-800 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" value={data.focusKeywords || ''} onChange={e => handleChange('focusKeywords', e.target.value)} placeholder="keyword1, keyword2..." />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">SEO Score (0-100)</label>
          <input type="number" min="0" max="100" className="w-full bg-white p-4.5 rounded-2xl font-bold text-slate-800 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" value={data.seoScore || 0} onChange={e => handleChange('seoScore', parseInt(e.target.value))} />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8 mt-4">
        <h5 className="text-[11px] font-black uppercase text-slate-500 tracking-widest mb-6">Open Graph & Social Media</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">OG Title</label>
              <input type="text" className="w-full bg-white p-4.5 rounded-2xl font-bold text-sm border border-slate-200" value={data.ogTitle || ''} onChange={e => handleChange('ogTitle', e.target.value)} />
           </div>
           <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Twitter Title</label>
              <input type="text" className="w-full bg-white p-4.5 rounded-2xl font-bold text-sm border border-slate-200" value={data.twitterTitle || ''} onChange={e => handleChange('twitterTitle', e.target.value)} />
           </div>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Schema.org JSON-LD</label>
        <textarea rows={5} className="w-full bg-white p-4.5 rounded-2xl font-mono text-xs text-blue-600 outline-none border border-slate-200 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm resize-none" value={typeof data.schemaMarkup === 'string' ? data.schemaMarkup : JSON.stringify(data.schemaMarkup, null, 2)} onChange={e => {
          try {
            handleChange('schemaMarkup', JSON.parse(e.target.value));
          } catch {
            handleChange('schemaMarkup', e.target.value);
          }
        }} placeholder='{ "@context": "https://schema.org", ... }' />
      </div>
    </div>
  );
};

const EmailAnalytics: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { supabase } = useData() as any;

    useEffect(() => {
        const fetchLogs = async () => {
            if (supabase) {
                const { data, error } = await supabase.from('email_logs').select('*').order('created_at', { ascending: false });
                if (!error) setLogs(data || []);
            }
            setLoading(false);
        };
        fetchLogs();
    }, [supabase]);

    const stats = {
        total: logs.length,
        sent: logs.filter(l => l.status === 'sent').length,
        failed: logs.filter(l => l.status === 'failed').length,
        welcome: logs.filter(l => l.email_type === 'user_welcome' || l.email_type === 'vendor_welcome').length,
        enquiry: logs.filter(l => l.email_type === 'enquiry_confirmation' || l.email_type === 'admin_new_lead').length,
        vendor: logs.filter(l => l.email_type?.includes('vendor')).length
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading Email Analytics...</div>;

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[
                    { label: 'Total Sent', value: stats.total, color: 'blue', icon: Mail },
                    { label: 'Delivery %', value: stats.total ? Math.round((stats.sent / stats.total) * 100) + '%' : '0%', color: 'green', icon: CheckCircle2 },
                    { label: 'Failed', value: stats.failed, color: 'red', icon: AlertCircle },
                    { label: 'Welcome', value: stats.welcome, color: 'indigo', icon: Zap },
                    { label: 'Enquiries', value: stats.enquiry, color: 'purple', icon: MessageSquare },
                    { label: 'Vendor', value: stats.vendor, color: 'orange', icon: Building2 },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl bg-${s.color === 'orange' ? 'yellow' : s.color}-50 flex items-center justify-center text-${s.color === 'orange' ? 'yellow' : s.color}-600 mb-4`}><s.icon size={20} /></div>
                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</div>
                        <div className="text-2xl font-black text-slate-900">{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h4 className="font-black text-slate-900 uppercase tracking-tight">Recent Delivery Logs</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Recipient</th>
                                <th className="px-8 py-5">Email Type</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Reference</th>
                                <th className="px-8 py-5">Sent At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 font-bold text-slate-700 text-sm">{log.email}</td>
                                    <td className="px-8 py-5"><span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-500">{log.email_type}</span></td>
                                    <td className="px-8 py-5">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${log.status === 'sent' ? 'text-green-600' : 'text-red-500'}`}>
                                            {log.status === 'sent' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {log.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-medium text-slate-400">{log.reference_id || 'N/A'}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && <tr><td colSpan={5} className="p-10 text-center font-bold text-slate-300">No email logs found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  // Secondary security check for admin email
  const ADMIN_EMAIL = 'info.bouuz@gmail.com';

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.email !== ADMIN_EMAIL) {
      console.error("Unauthorized access attempt by:", currentUser.email);
      navigate('/user/dashboard');
    }
  }, [currentUser, navigate]);

  const { 
    products, leads, categories, categoryObjects, cities, states, siteConfig, users, vendorLogos, vendorRegistrations, blogs,
    isLoading, addProduct, updateProduct, deleteProduct, addBlog, updateBlog, deleteBlog,
    updateLeadStatus, assignLead, updateLeadRemarks, deleteLead, updateSiteConfig,
    addCategory, updateCategory, deleteCategory,
    addCity, updateCity, deleteCity,
    addState, updateState, deleteState,
    deleteUser, addVendorLogo, deleteVendorLogo, addNotification,
    updateVendorStatus, createVendorManual, updateUserRole
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'vendors' | 'products' | 'blogs' | 'categories' | 'users' | 'requests' | 'settings' | 'logos' | 'seo' | 'locations' | 'emails'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedVendorForLeads, setSelectedVendorForLeads] = useState<User | null>(null);
  const [selectedVendorForEmails, setSelectedVendorForEmails] = useState<User | null>(null);
  const [vendorEmailLogs, setVendorEmailLogs] = useState<any[]>([]);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({ title: '', description: '', category: '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5, vendorName: '', technicalSpecs: [] });
  const [prodFeaturesText, setProdFeaturesText] = useState('');

  const [isLogoSubmitting, setIsLogoSubmitting] = useState(false);

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({ title: '', content: '', category: 'Marketplace', image: '', author: 'Admin' });

  // Vendor Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState<Partial<User>>({ name: '', company: '', email: '', mobile: '', location: '', products: [], services: [], logoUrl: '' });
  const [isSubmittingVendor, setIsSubmittingVendor] = useState(false);

  // Location Modal State
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [locType, setLocType] = useState<'city' | 'state'>('city');
  const [editingLoc, setEditingLoc] = useState<City | State | null>(null);
  const [locForm, setLocForm] = useState<Partial<City & State>>({ name: '', slug: '', stateId: '' });

  const [configForm, setConfigForm] = useState(siteConfig);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newLogo, setNewLogo] = useState({ name: '', url: '' });

  const registeredVendors = users.filter(u => u.role === 'vendor');

  useEffect(() => { if (siteConfig) setConfigForm(siteConfig); }, [siteConfig]);

  useEffect(() => {
    const fetchVendorEmails = async () => {
      if (selectedVendorForEmails && (useData() as any).supabase) {
        const { data } = await (useData() as any).supabase
          .from('email_logs')
          .select('*')
          .eq('vendor_id', selectedVendorForEmails.id)
          .order('created_at', { ascending: false });
        setVendorEmailLogs(data || []);
      }
    };
    fetchVendorEmails();
  }, [selectedVendorForEmails]);

  const handleSaveProduct = async () => {
      const features = prodFeaturesText.split(',').map(f => f.trim()).filter(f => f);
      if (!prodForm.title || !prodForm.priceRange) {
        addNotification("Title and Pricing are required", "warning");
        return;
      }
      const pData: Product = {
          id: editingProduct ? editingProduct.id : Date.now().toString(),
          slug: prodForm.slug || generateSlug(prodForm.title!),
          title: prodForm.title!,
          description: prodForm.description || '',
          category: prodForm.category || categories[0] || 'Software',
          priceRange: prodForm.priceRange || '',
          features: features,
          icon: prodForm.icon || 'globe',
          rating: Number(prodForm.rating) || 5,
          image: prodForm.image || '',
          vendorName: prodForm.vendorName || '',
          technicalSpecs: prodForm.technicalSpecs || [],
          ...prodForm
      };
      if (editingProduct) await updateProduct(editingProduct.id, pData);
      else await addProduct(pData);
      setIsModalOpen(false); setEditingProduct(null);
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.content) {
      addNotification("Title and Content are required", "warning");
      return;
    }
    const bData: BlogPost = {
      id: editingBlog ? editingBlog.id : Date.now().toString(),
      slug: blogForm.slug || generateSlug(blogForm.title!),
      title: blogForm.title!,
      content: blogForm.content || '',
      category: blogForm.category as any || 'Marketplace',
      image: blogForm.image || '',
      author: blogForm.author || 'Admin',
      date: editingBlog ? editingBlog.date : new Date().toISOString().split('T')[0],
      ...blogForm
    };
    if (editingBlog) await updateBlog(editingBlog.id, bData);
    else await addBlog(bData);
    setIsBlogModalOpen(false); setEditingBlog(null);
  };

  const handleSaveLocation = async () => {
    if (!locForm.name) return;
    const lData = {
      id: editingLoc ? editingLoc.id : Date.now().toString(),
      name: locForm.name!,
      slug: locForm.slug || generateSlug(locForm.name!),
      ...locForm
    };
    if (locType === 'city') {
      if (editingLoc) await updateCity(editingLoc.id, lData as City);
      else await addCity(lData as City);
    } else {
      if (editingLoc) await updateState(editingLoc.id, lData as State);
      else await addState(lData as State);
    }
    setIsLocModalOpen(false); setEditingLoc(null);
  };

  const renderSidebar = () => (
      <div className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 lg:relative lg:translate-x-0`}>
          <div className="p-6 font-bold text-2xl flex items-center justify-between border-b border-slate-800">
              <span className="flex items-center gap-2 font-black tracking-tighter text-xl"><Zap className="text-blue-500 fill-current" size={24} /> BantConfirm</span>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-6 space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-100px)]">
              {[
                  { id: 'overview', icon: Layout, label: 'Overview' },
                  { id: 'leads', icon: FileText, label: 'Leads Hub' },
          { id: 'vendors', icon: ShieldCheck, label: 'Vendor Manager' },
                  { id: 'requests', icon: MessageSquare, label: 'Vendor Queue' },
                  { id: 'users', icon: Users, label: 'Users' },
                  { id: 'emails', icon: Mail, label: 'Email Analytics' },
                  { id: 'seo', icon: BarChart, label: 'SEO Manager' },
                  { id: 'products', icon: ShoppingBag, label: 'Services' },
                  { id: 'blogs', icon: Newspaper, label: 'Insights' },
                  { id: 'categories', icon: Tag, label: 'Categories' },
                  { id: 'locations', icon: MapPin, label: 'Cities & States' },
                  { id: 'logos', icon: ImageIcon, label: 'Partners' },
                  { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl transition font-bold text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                      <item.icon size={18} className="mr-3" /> {item.label}
                  </button>
              ))}
          </nav>
      </div>
  );

  const renderOverview = () => {
    const stats = [
      { title: 'Total Leads', value: leads.length.toString(), change: leads.filter(l => l.assignedTo).length + ' Assigned', isPositive: true, color: 'blue' as const, icon: FileText },
      { title: 'Total Vendors', value: users.filter(u => u.role === 'vendor').length.toString(), change: users.filter(u => u.role === 'vendor' && u.status === 'Pending').length + ' Pending', isPositive: false, color: 'indigo', icon: Building2 },
      { title: 'Verified Partners', value: users.filter(u => u.role === 'vendor' && u.status === 'Verified').length.toString(), change: 'Verified', isPositive: true, color: 'green', icon: ShieldCheck },
      { title: 'Vendor Requests', value: vendorRegistrations.length.toString(), change: 'Queue', isPositive: false, color: 'purple', icon: MessageSquare },
    ];

    return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'indigo' ? 'blue' : stat.color}-50 flex items-center justify-center text-${stat.color === 'indigo' ? 'blue' : stat.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.title}</h4>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Recent Lead Flow</h3>
              <button onClick={() => setActiveTab('leads')} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">View All &rarr;</button>
           </div>
           <div className="space-y-4">
              {leads.slice(0, 5).map(lead => (
                 <div key={lead.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm font-black text-xs">
                          {lead.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-slate-900 text-sm">{lead.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{lead.service}</div>
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                       lead.status === 'Verified' ? 'bg-green-100 text-green-600' : lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>{lead.status}</div>
                 </div>
              ))}
              {leads.length === 0 && <p className="text-center py-8 text-slate-400 font-bold">No leads recorded yet.</p>}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Partner Applications</h3>
              <button onClick={() => setActiveTab('requests')} className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Queue &rarr;</button>
           </div>
           <div className="space-y-4">
              {vendorRegistrations.slice(0, 5).map(reg => (
                 <div key={reg.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm font-black text-xs">
                          {reg.companyName.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-slate-900 text-sm">{reg.companyName}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{reg.productName}</div>
                       </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">{reg.date}</div>
                 </div>
              ))}
              {vendorRegistrations.length === 0 && <p className="text-center py-8 text-slate-400 font-bold">No applications pending.</p>}
           </div>
        </div>
      </div>
    </div>
  ); };

  const renderLeads = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Leads Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Manage BANT requirements and assign to vendors</p>
          </div>
          <button className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-5 py-2.5 rounded-xl hover:bg-green-100 transition shadow-sm">
            <Download size={18} className="mr-2" /> Export Leads
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Prospect Profile</th>
                <th className="px-8 py-5">Specific Requirement</th>
                <th className="px-8 py-5">BANT Analysis</th>
                <th className="px-8 py-5">Assignment & Status</th>
                <th className="px-8 py-5">Internal Remarks</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="font-black text-slate-900 text-base">{lead.name}</div>
                      <div className="text-blue-600 font-black text-[10px] uppercase tracking-wider">{lead.company || 'Private Prospect'}</div>
                      <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs font-bold">
                        <Phone size={12} className="text-slate-300" /> {lead.mobile}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-bold">
                        <Mail size={12} className="text-slate-300" /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-slate-400 text-[10px] font-black uppercase tracking-tighter">
                        <MapPin size={12} className="text-slate-300" /> {lead.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                      <p className="text-[10px] font-black text-indigo-700 uppercase mb-2 tracking-widest">{lead.service}</p>
                      <p className="text-xs font-bold text-slate-600 leading-relaxed line-clamp-4">"{lead.requirement}"</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between text-[10px] font-black px-2 py-1 bg-green-50 text-green-700 rounded-lg">
                         <span>BUDGET</span>
                         <span>{lead.budget}</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-black px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                         <span>TIMING</span>
                         <span>{lead.timing}</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-black px-2 py-1 bg-purple-50 text-purple-700 rounded-lg">
                         <span>AUTHORITY</span>
                         <span>{lead.authority}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-4">
                      <select 
                        value={lead.status} 
                        onChange={e => updateLeadStatus(lead.id, e.target.value as any)} 
                        className={`w-full text-[10px] font-black uppercase px-3 py-2 rounded-xl border outline-none ${
                          lead.status === 'Verified' ? 'bg-green-100 text-green-700 border-green-200' :
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          lead.status === 'Sold' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        <option>Pending</option>
                        <option>Verified</option>
                        <option>Sold</option>
                        <option>Rejected</option>
                      </select>
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-300 block mb-1.5 ml-1">Assign to Partner</label>
                        <select 
                          value={lead.assignedTo || ''} 
                          onChange={e => assignLead(lead.id, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] font-bold outline-none shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                          <option value="">Unassigned...</option>
                          {registeredVendors.map(v => (
                            <option key={v.id} value={v.id} disabled={v.status !== 'Verified'}>
                              {v.name} ({v.company || 'Partner'}) {v.status !== 'Verified' ? `[${v.status}]` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <textarea 
                      placeholder="Add admin notes or instructions for vendors..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-medium text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all resize-none"
                      value={lead.remarks || ''}
                      onChange={e => updateLeadRemarks(lead.id, e.target.value)}
                    />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => { if(window.confirm('Permanent removal?')) deleteLead(lead.id); }} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Service Inventory</h3>
          <p className="text-sm font-medium text-slate-400">Total {products.length} products listed in marketplace</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setProdForm({ title: '', description: '', priceRange: '', features: [], category: categories[0], icon: 'globe', rating: 5, vendorName: '', technicalSpecs: [] }); setProdFeaturesText(''); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform hover:-translate-y-1">
          <Plus size={20} className="mr-2" /> Add New Listing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-blue-600 tracking-widest shadow-sm">{p.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{p.title}</h4>
            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5"><IndianRupee size={12}/> {p.priceRange}</div>
            <div className="flex-grow space-y-2.5 mb-8 border-t border-slate-50 pt-6">
               {p.features.slice(0, 3).map((f, i) => (
                 <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> {f}
                 </div>
               ))}
            </div>
            <div className="flex gap-3 pt-6 border-t border-slate-50">
              <button onClick={() => { setEditingProduct(p); setProdForm(p); setProdFeaturesText(p.features.join(', ')); setIsModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Manage Listing</button>
              <button onClick={() => { if(window.confirm('Remove from marketplace?')) deleteProduct(p.id); }} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
           <h3 className="text-2xl font-black text-slate-900">BantConfirm Insights</h3>
           <p className="text-sm font-medium text-slate-400">Published articles and industry guides</p>
        </div>
        <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', content: '', category: 'Marketplace', image: '', author: 'Admin' }); setIsBlogModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1">
          <Plus size={20} className="mr-2" /> Write New Article
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(b => (
          <div key={b.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {b.image ? <img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={b.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-indigo-600 tracking-widest shadow-sm">{b.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{b.title}</h4>
            <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
               <UserIcon size={12}/> {b.author} <span className="w-1 h-1 rounded-full bg-slate-200"></span> <Calendar size={12}/> {b.date}
            </div>
            <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed font-medium">{b.content}</p>
            <div className="flex gap-3 pt-6 border-t border-slate-50">
              <button onClick={() => { setEditingBlog(b); setBlogForm(b); setIsBlogModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Edit Post</button>
              <button onClick={() => { if(window.confirm('Delete article?')) deleteBlog(b.id); }} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSEOManger = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-3xl font-black text-slate-900">SEO Management Surface</h3>
                <p className="text-sm font-medium text-slate-400">Analyze and optimize search visibility across all content</p>
             </div>
             <div className="flex gap-4">
                <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100 text-center">
                   <div className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Sitemap Status</div>
                   <div className="text-sm font-black text-green-600 flex items-center gap-2"><CheckCircle2 size={16}/> GENERATED</div>
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 text-center">
                   <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Index Coverage</div>
                   <div className="text-sm font-black text-blue-600 flex items-center gap-2"><Globe size={16}/> 100% READY</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
                { label: 'Products', count: products.length, missing: products.filter(p => !p.metaTitle).length, icon: ShoppingBag, color: 'blue' },
                { label: 'Blogs', count: blogs.length, missing: blogs.filter(b => !b.metaTitle).length, icon: Newspaper, color: 'indigo' },
                { label: 'Categories', count: categoryObjects.length, missing: categoryObjects.filter(c => !c.metaTitle).length, icon: Tag, color: 'purple' },
                { label: 'Cities', count: cities.length, missing: cities.filter(c => !c.metaTitle).length, icon: MapPin, color: 'red' },
                { label: 'States', count: states.length, missing: states.filter(s => !s.metaTitle).length, icon: Globe, color: 'green' },
             ].map(stat => (
                <div key={stat.label} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 group hover:border-blue-200 transition-all">
                   <div className={`bg-${stat.color}-100 w-12 h-12 rounded-xl flex items-center justify-center text-${stat.color}-600 mb-6 group-hover:scale-110 transition-transform`}><stat.icon size={24}/></div>
                   <h4 className="font-black text-slate-900 text-xl mb-1">{stat.label}</h4>
                   <div className="flex items-center gap-4 mt-4">
                      <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Items</div>
                         <div className="text-xl font-black text-slate-700">{stat.count}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Missing SEO</div>
                         <div className={`text-xl font-black ${stat.missing > 0 ? 'text-red-500' : 'text-green-500'}`}>{stat.missing}</div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h4 className="font-black text-slate-900 uppercase tracking-tight">Recent Content Performance</h4>
             <button className="text-xs font-black text-blue-600 hover:underline">View Google Search Console &rarr;</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
                      <th className="px-10 py-5">Content Page</th>
                      <th className="px-10 py-5">SEO Score</th>
                      <th className="px-10 py-5">Keywords</th>
                      <th className="px-10 py-5">Index Status</th>
                      <th className="px-10 py-5">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {products.slice(0, 5).map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/30 group">
                         <td className="px-10 py-6">
                            <div className="font-black text-slate-900">{p.title}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.slug}</div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-3">
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                                  <div className={`h-full ${p.seoScore && p.seoScore > 80 ? 'bg-green-500' : p.seoScore && p.seoScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${p.seoScore || 0}%` }}></div>
                               </div>
                               <span className="font-black text-sm text-slate-600">{p.seoScore || 0}%</span>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <div className="flex flex-wrap gap-1">
                               {p.focusKeywords?.split(',').slice(0, 2).map(k => (
                                  <span key={k} className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-black uppercase text-slate-500">{k.trim()}</span>
                               ))}
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase"><CheckCircle2 size={12}/> Indexed</span>
                         </td>
                         <td className="px-10 py-6">
                            <button onClick={() => { setEditingProduct(p); setProdForm(p); setProdFeaturesText(p.features.join(', ')); setIsModalOpen(true); }} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"><Edit2 size={18}/></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-10 animate-fade-in">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">Cities</h3>
                <button onClick={() => { setLocType('city'); setEditingLoc(null); setLocForm({ name: '', slug: '', stateId: states[0]?.id }); setIsLocModalOpen(true); }} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {cities.map(city => (
                   <div key={city.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-blue-100">
                      <div>
                         <div className="font-black text-slate-900">{city.name}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{states.find(s => s.id === city.stateId)?.name || 'Unknown State'}</div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setLocType('city'); setEditingLoc(city); setLocForm(city as any); setIsLocModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                         <button onClick={() => deleteCity(city.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">States</h3>
                <button onClick={() => { setLocType('state'); setEditingLoc(null); setLocForm({ name: '', slug: '' }); setIsLocModalOpen(true); }} className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition shadow-lg"><Plus size={20}/></button>
             </div>
             <div className="space-y-4">
                {states.map(state => (
                   <div key={state.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-green-100">
                      <div>
                         <div className="font-black text-slate-900">{state.name}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cities.filter(c => c.stateId === state.id).length} Cities Linked</div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setLocType('state'); setEditingLoc(state); setLocForm(state as any); setIsLocModalOpen(true); }} className="p-2 text-slate-400 hover:text-green-600"><Edit2 size={16}/></button>
                         <button onClick={() => deleteState(state.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-5xl animate-fade-in space-y-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4"><Settings className="text-blue-600" size={32} /> Platform Identity</h3>
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2.5 tracking-widest ml-1">Platform Global Name</label>
              <input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2.5 tracking-widest ml-1">Admin Notification Hub</label>
              <input type="email" className="w-full bg-slate-50 p-4.5 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={configForm.adminNotificationEmail || ''} onChange={e => setConfigForm({...configForm, adminNotificationEmail: e.target.value})} />
            </div>
          </div>

          <SEOFieldGroup data={configForm} onChange={d => setConfigForm({...configForm, ...d})} defaultTitle={configForm.siteName} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageUploadZone
              label="Marketplace Identity Logo"
              value={configForm.logoUrl}
              loading={isLogoSubmitting}
              onUpload={async (b) => {
                setIsLogoSubmitting(true);
                const url = await uploadBase64Image(b, 'site-assets');
                if (url) setConfigForm({...configForm, logoUrl: url});
                setIsLogoSubmitting(false);
              }}
              onClear={() => setConfigForm({...configForm, logoUrl: ''})}
              aspectRatio="aspect-video max-w-[280px]"
            />
            <ImageUploadZone
              label="Browser App Favicon (192px)"
              value={configForm.faviconUrl}
              loading={isLogoSubmitting}
              onUpload={async (b) => {
                setIsLogoSubmitting(true);
                const url = await uploadBase64Image(b, 'site-assets');
                if (url) setConfigForm({...configForm, faviconUrl: url});
                setIsLogoSubmitting(false);
              }}
              onClear={() => setConfigForm({...configForm, faviconUrl: ''})}
              aspectRatio="aspect-square max-w-[140px]"
            />
          </div>

          <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
             <h4 className="font-black text-slate-900 mb-8 flex items-center gap-3 text-lg"><Globe size={22} className="text-indigo-600" /> Digital Channels & Social Links</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                   <div className="absolute left-4 top-4.5 text-slate-300 group-focus-within:text-blue-400 transition-colors">
                      <Twitter size={22} />
                   </div>
                   <input type="text" placeholder="Twitter URL" className="w-full bg-white pl-14 pr-5 py-4.5 rounded-2xl outline-none border border-slate-200 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all" value={configForm.socialLinks?.twitter || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, twitter: e.target.value}})} />
                </div>
                <div className="relative group">
                   <div className="absolute left-4 top-4.5 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                      <Linkedin size={22} />
                   </div>
                   <input type="text" placeholder="LinkedIn URL" className="w-full bg-white pl-14 pr-5 py-4.5 rounded-2xl outline-none border border-slate-200 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all" value={configForm.socialLinks?.linkedin || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, linkedin: e.target.value}})} />
                </div>
                <div className="relative group">
                   <div className="absolute left-4 top-4.5 text-slate-300 group-focus-within:text-blue-700 transition-colors">
                      <Facebook size={22} />
                   </div>
                   <input type="text" placeholder="Facebook URL" className="w-full bg-white pl-14 pr-5 py-4.5 rounded-2xl outline-none border border-slate-200 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all" value={configForm.socialLinks?.facebook || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, facebook: e.target.value}})} />
                </div>
                <div className="relative group">
                   <div className="absolute left-4 top-4.5 text-slate-300 group-focus-within:text-pink-500 transition-colors">
                      <Instagram size={22} />
                   </div>
                   <input type="text" placeholder="Instagram URL" className="w-full bg-white pl-14 pr-5 py-4.5 rounded-2xl outline-none border border-slate-200 font-bold text-sm shadow-sm focus:ring-2 focus:ring-blue-50 transition-all" value={configForm.socialLinks?.instagram || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, instagram: e.target.value}})} />
                </div>
                <div className="relative group md:col-span-2">
                   <div className="absolute left-4 top-4.5 text-green-500 font-black text-xs bg-green-50 w-7 h-7 flex items-center justify-center rounded-lg">WA</div>
                   <input type="text" placeholder="WhatsApp Business Number (e.g. +91 98765 43210)" className="w-full bg-white pl-14 pr-5 py-4.5 rounded-2xl outline-none border border-slate-200 font-bold text-sm shadow-sm focus:ring-2 focus:ring-green-50 transition-all" value={configForm.whatsappNumber || ''} onChange={e => setConfigForm({...configForm, whatsappNumber: e.target.value})} />
                </div>
             </div>
          </div>

          <button onClick={() => updateSiteConfig(configForm)} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 transform active:scale-[0.98]">
            Commit Changes to Production
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full animate-pulse">
           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
              <Zap size={32} className="animate-bounce" />
           </div>
           <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Initializing Control Surface</h2>
           <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Securing Connection to Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {renderSidebar()}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-24 flex items-center justify-between px-12 shrink-0">
             <div className="flex items-center">
                 <button className="lg:hidden mr-6 p-3 bg-slate-100 rounded-2xl text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <div className="flex flex-col">
                   <h1 className="font-black text-2xl text-slate-900 uppercase tracking-tight">{activeTab.replace('-', ' ')}</h1>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Administrator Control Surface</p>
                 </div>
             </div>
             <div className="flex items-center gap-8">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-tighter">Global Super Admin</div>
                  <div className="text-[10px] font-bold text-slate-400">{currentUser?.email}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-base shadow-2xl shadow-slate-200">SA</div>
             </div>
        </header>
        <main className="flex-grow overflow-y-auto p-12 bg-slate-50/50 scrollbar-hide">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'blogs' && renderBlogs()}
            {activeTab === 'seo' && renderSEOManger()}
            {activeTab === 'locations' && renderLocations()}
            {activeTab === 'vendors' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Vendor Management</h3>
                    <p className="text-sm font-medium text-slate-400">Verify partners, manage status and manual onboarding</p>
                  </div>
                  <button onClick={() => { setVendorForm({ name: '', company: '', email: '', mobile: '', location: '', products: [], services: [] }); setIsVendorModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center shadow-xl hover:bg-indigo-700 transition transform hover:-translate-y-1">
                    <PlusCircle size={20} className="mr-2" /> Manual Onboarding
                  </button>
                </div>

                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100">
                          <th className="px-10 py-6">Vendor Identity</th>
                          <th className="px-10 py-6">Company & Assets</th>
                          <th className="px-10 py-6">Verification Status</th>
                          <th className="px-10 py-6">Lead Capacity</th>
                          <th className="px-10 py-6">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.filter(u => u.role === 'vendor').map(v => (
                          <tr key={v.id} className="hover:bg-slate-50/50 group transition-colors">
                            <td className="px-10 py-7">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                  {v.logoUrl ? <img src={v.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <Building2 size={24} className="text-slate-300" />}
                                </div>
                                <div>
                                  <div className="font-black text-slate-900 text-lg flex items-center gap-2">
                                    {v.name} {v.status === 'Verified' && <CheckCircle2 size={16} className="text-blue-500" />}
                                  </div>
                                  <div className="text-xs font-bold text-slate-400">{v.email}</div>
                                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-1">Joined: {v.joinedDate?.split('T')[0]}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-7">
                               <div className="text-sm font-black text-slate-700">{v.company || 'Not Specified'}</div>
                               <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-1"><MapPin size={12}/> {v.location || 'Pan India'}</div>
                               <div className="flex flex-wrap gap-1 mt-3">
                                  {v.products?.slice(0, 2).map(p => <span key={p} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">{p}</span>)}
                               </div>
                            </td>
                            <td className="px-10 py-7">
                               <div className="space-y-2">
                                 <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                   v.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' :
                                   v.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                   v.status === 'Suspended' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                   'bg-red-50 text-red-700 border-red-100'
                                 }`}>
                                   {v.status || 'Pending'}
                                 </span>
                                 {v.verificationDate && (
                                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                     Verified: {new Date(v.verificationDate).toLocaleDateString()}
                                   </div>
                                 )}
                               </div>
                            </td>
                            <td className="px-10 py-7">
                               <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                                    {leads.filter(l => l.assignedTo === v.id).length}
                                  </div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads Assigned</div>
                               </div>
                            </td>
                            <td className="px-10 py-7">
                               <div className="flex gap-2">
                                  {v.status === 'Pending' && (
                                    <>
                                      <button onClick={() => updateVendorStatus(v.id, 'Verified')} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all shadow-sm" title="Verify Vendor"><CheckCircle2 size={18}/></button>
                                      <button onClick={() => { const reason = prompt('Reason for rejection:'); if(reason) updateVendorStatus(v.id, 'Rejected', reason); }} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all shadow-sm" title="Reject Vendor"><X size={18}/></button>
                                    </>
                                  )}
                                  {v.status === 'Verified' && (
                                    <button onClick={() => updateVendorStatus(v.id, 'Suspended')} className="p-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl transition-all shadow-sm" title="Suspend Vendor"><Archive size={18}/></button>
                                  )}
                                  {v.status === 'Suspended' && (
                                    <button onClick={() => updateVendorStatus(v.id, 'Verified')} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all shadow-sm" title="Reactivate Vendor"><Zap size={18}/></button>
                                  )}
                                  <button onClick={() => setSelectedVendorForLeads(v)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm" title="View Assigned Leads"><FileText size={18}/></button>
                                  <button onClick={() => setSelectedVendorForEmails(v)} className="p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all shadow-sm" title="View Email Logs"><Mail size={18}/></button>
                                  <button onClick={() => { if(window.confirm('Delete vendor account permanently?')) deleteUser(v.id); }} className="p-2.5 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => u.role === 'vendor').length === 0 && (
                          <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-300">No vendors registered yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-slate-50/30"><h3 className="text-3xl font-black text-slate-900">User Identity Directory</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100">
                          <th className="px-10 py-6">User Account Profile</th>
                          <th className="px-10 py-6">Global Identity & Role</th>
                          <th className="px-10 py-6">Registration Date</th>
                          <th className="px-10 py-6">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/50 group">
                            <td className="px-10 py-7">
                              <div className="font-black text-slate-900 text-lg">{u.name}</div>
                              <div className="text-xs font-bold text-slate-400 mt-0.5">{u.email}</div>
                            </td>
                            <td className="px-10 py-7">
                              <select
                                value={u.role || 'user'}
                                onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border outline-none ${
                                  u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                                  u.role === 'vendor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                  'bg-blue-50 text-blue-600 border-blue-100'
                                }`}
                              >
                                <option value="user">User</option>
                                <option value="vendor">Vendor</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-10 py-7 font-bold text-slate-400 text-sm tracking-tight">{u.joinedDate?.split('T')[0]}</td>
                            <td className="px-10 py-7">
                              <button onClick={() => { if(window.confirm('Revoke access?')) deleteUser(u.id); }} className="p-3 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={22} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="max-w-4xl animate-fade-in space-y-10">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
                   <h3 className="text-3xl font-black text-slate-900 mb-10">Vertical Taxonomy</h3>
                   <div className="flex gap-5 mb-12">
                      <input type="text" placeholder="e.g. AI Workflow Agents" className="flex-1 bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 text-base shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all border border-transparent focus:border-blue-100" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                      <button onClick={() => { if(newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-slate-900 text-white px-10 rounded-2xl font-black text-base hover:bg-slate-800 transition-all shadow-xl">Define New</button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {categoryObjects.map(cat => (
                       <div key={cat.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all hover:bg-white shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                            <span className="font-black text-slate-700 text-sm uppercase tracking-wide">{cat.name}</span>
                            <div className="flex gap-2">
                               <button onClick={() => { /* Open edit modal for category */ }} className="p-2 text-slate-300 hover:text-blue-500"><Edit2 size={16} /></button>
                               <button onClick={() => { if(window.confirm('Delete category?')) deleteCategory(cat.name); }} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash size={16} /></button>
                            </div>
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{products.filter(p => p.category === cat.name).length} Listings Linked</div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900">Partner Application Manager</h3>
                      <p className="text-sm font-medium text-slate-400">Review new registrations and convert to vendors</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-10 py-6">Applicant Brand</th><th className="px-10 py-6">Connection Details</th><th className="px-10 py-6">Category Intent</th><th className="px-10 py-6">Pitch Message</th><th className="px-10 py-6">Submission</th><th className="px-10 py-6">Action</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {vendorRegistrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50/50 group">
                            <td className="px-10 py-7"><div className="font-black text-slate-900 text-lg">{reg.companyName}</div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{reg.name}</div></td>
                            <td className="px-10 py-7 text-xs font-bold text-slate-600"><div>{reg.email}</div><div className="mt-1 text-slate-400">{reg.mobile}</div></td>
                            <td className="px-10 py-7"><span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-indigo-100 shadow-sm">{reg.productName}</span></td>
                            <td className="px-10 py-7 max-w-sm text-[12px] font-medium text-slate-500 leading-relaxed italic">"{reg.message}"</td>
                            <td className="px-10 py-7 text-xs font-bold text-slate-400 tracking-tight">{reg.date}</td>
                            <td className="px-10 py-7">
                               <button onClick={() => {
                                 setVendorForm({ name: reg.name, company: reg.companyName, email: reg.email, mobile: reg.mobile, location: reg.location, products: [reg.productName] });
                                 setIsVendorModalOpen(true);
                               }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg">Process</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}
            {activeTab === 'logos' && (
              <div className="space-y-8 animate-fade-in">
                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                       <div>
                          <h3 className="text-3xl font-black text-slate-900">Brand Partners</h3>
                          <p className="text-sm font-medium text-slate-400">Manage logos displayed on the homepage trust section</p>
                       </div>
                       <div className="flex gap-4">
                          <input type="text" placeholder="Partner Name" className="bg-slate-50 px-5 py-3 rounded-xl outline-none font-bold text-sm border border-transparent focus:border-blue-100" value={newLogo.name} onChange={e => setNewLogo({...newLogo, name: e.target.value})} />
                          <button onClick={() => { if(newLogo.name && newLogo.url) { addVendorLogo({id: Date.now().toString(), ...newLogo}); setNewLogo({name: '', url: ''}); } }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition">Add Partner</button>
                       </div>
                    </div>
                    <div className="mb-10">
                       <ImageUploadZone
                        label="Upload Partner Logo"
                        value={newLogo.url}
                        loading={isLogoSubmitting}
                        onUpload={async (b) => {
                          setIsLogoSubmitting(true);
                          const url = await uploadBase64Image(b, 'partner-logos');
                          if (url) setNewLogo({...newLogo, url: url});
                          setIsLogoSubmitting(false);
                        }}
                        onClear={() => setNewLogo({...newLogo, url: ''})}
                        aspectRatio="aspect-video max-w-[300px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                       {vendorLogos.map(logo => (
                          <div key={logo.id} className="relative group bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-center h-32 hover:bg-white hover:shadow-xl transition-all">
                             <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                             <button onClick={() => deleteVendorLogo(logo.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{logo.name}</div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'emails' && <EmailAnalytics />}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
             <div className="mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{editingProduct ? 'Update Service Matrix' : 'Draft New Offering'}</h3>
                <p className="text-slate-400 font-medium">Configure all technical and marketing parameters for the listing</p>
             </div>
             <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Service Core Title</label><input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={prodForm.title} onChange={e => setProdForm({...prodForm, title: e.target.value})} placeholder="e.g. Enterprise Cloud IVR 2.0" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Market Pricing Estimate</label><input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-black text-blue-600 outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={prodForm.priceRange} onChange={e => setProdForm({...prodForm, priceRange: e.target.value})} placeholder="₹12,500 - ₹2.5L / year" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Vertical Marketplace Category</label><select className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm cursor-pointer" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Vendor Network Brand Label</label><input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold text-indigo-600 outline-none border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all shadow-sm text-sm" value={prodForm.vendorName} onChange={e => setProdForm({...prodForm, vendorName: e.target.value})} placeholder="e.g. Jio Business" /></div>
                </div>
                
                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Main Marketing Pitch Summary</label><textarea rows={3} className="w-full bg-slate-50 p-6 rounded-[2rem] font-medium leading-relaxed text-sm border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm resize-none" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} placeholder="Summarize the core technical value proposition..." /></div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">High-Impact Features (CSV)</label>
                  <input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold text-sm border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={prodFeaturesText} onChange={e => setProdFeaturesText(e.target.value)} placeholder="99.9% Uptime, Cloud Storage, API Hooks..." />
                </div>

                <SEOFieldGroup data={prodForm} onChange={d => setProdForm({...prodForm, ...d})} defaultTitle={prodForm.title} defaultSlug={prodForm.slug} />

                <ImageUploadZone
                  label="Marketing Banner Visual"
                  value={prodForm.image}
                  loading={isLogoSubmitting}
                  onUpload={async (b) => {
                    setIsLogoSubmitting(true);
                    const url = await uploadBase64Image(b, 'products');
                    if (url) setProdForm({...prodForm, image: url});
                    setIsLogoSubmitting(false);
                  }}
                  onClear={() => setProdForm({...prodForm, image: ''})}
                  aspectRatio="aspect-video"
                />
                <button onClick={handleSaveProduct} disabled={isLogoSubmitting} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-[0.98] disabled:opacity-50">Commit Listing to Production</button>
             </div>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
             <button onClick={() => setIsBlogModalOpen(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
             <div className="mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{editingBlog ? 'Update Insight Article' : 'Draft New Industry Story'}</h3>
                <p className="text-slate-400 font-medium">Create engaging content for the Indian B2B technology hub</p>
             </div>
             <div className="space-y-10">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Article Catchy Headline</label>
                   <input type="text" className="w-full bg-slate-50 p-6 rounded-[1.75rem] font-black text-3xl outline-none border-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner tracking-tight placeholder-slate-300" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="The Evolution of AI in India's MSME Sector..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Editorial Vertical</label>
                    <select className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm cursor-pointer" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value as any})}><option>Marketplace</option><option>Service</option><option>Product</option><option>Industry News</option></select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Editorial By-line (Author)</label>
                    <input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold text-sm outline-none border-none shadow-sm focus:bg-white focus:ring-2 focus:ring-indigo-50 transition-all" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} placeholder="Editorial Team" />
                  </div>
                </div>

                <SEOFieldGroup data={blogForm} onChange={d => setBlogForm({...blogForm, ...d})} defaultTitle={blogForm.title} defaultSlug={blogForm.slug} />

                <ImageUploadZone
                  label="Article Hero Banner"
                  value={blogForm.image}
                  loading={isLogoSubmitting}
                  onUpload={async (b) => {
                    setIsLogoSubmitting(true);
                    const url = await uploadBase64Image(b, 'blogs');
                    if (url) setBlogForm({...blogForm, image: url});
                    setIsLogoSubmitting(false);
                  }}
                  onClear={() => setBlogForm({...blogForm, image: ''})}
                  aspectRatio="aspect-video"
                />
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Full Article Narrative</label>
                   <textarea rows={15} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-medium leading-relaxed outline-none border-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-base shadow-inner resize-none placeholder-slate-300" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Craft your technical or business narrative here..." />
                </div>
                <button onClick={handleSaveBlog} disabled={isLogoSubmitting} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-[0.98] disabled:opacity-50">Publish to Insights Hub</button>
             </div>
          </div>
        </div>
      )}

      {selectedVendorForEmails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
             <button onClick={() => setSelectedVendorForEmails(null)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
             <div className="mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Email History: {selectedVendorForEmails.company || selectedVendorForEmails.name}</h3>
                <p className="text-slate-400 font-medium">Tracking all communications sent to this vendor</p>
             </div>

             <div className="overflow-x-auto rounded-3xl border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-100">
                      <th className="px-8 py-5">Email Type</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendorEmailLogs.map(log => (
                      <tr key={log.id}>
                        <td className="px-8 py-5 font-bold text-slate-700">{log.email_type}</td>
                        <td className="px-8 py-5">
                          <span className={`text-[10px] font-black uppercase ${log.status === 'sent' ? 'text-green-600' : 'text-red-500'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {vendorEmailLogs.length === 0 && <tr><td colSpan={3} className="p-10 text-center font-bold text-slate-300">No email logs found.</td></tr>}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {selectedVendorForLeads && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
             <button onClick={() => setSelectedVendorForLeads(null)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
             <div className="mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Leads Assigned to {selectedVendorForLeads.company || selectedVendorForLeads.name}</h3>
                <p className="text-slate-400 font-medium">Tracking performance and enquiry status for this partner</p>
             </div>

             <div className="space-y-6">
                {leads.filter(l => l.assignedTo === selectedVendorForLeads.id).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {leads.filter(l => l.assignedTo === selectedVendorForLeads.id).map(lead => (
                       <div key={lead.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="font-black text-slate-900">{lead.service}</div>
                            <div className="text-xs font-bold text-slate-400">{lead.name} • {lead.date}</div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            lead.status === 'Verified' ? 'bg-green-100 text-green-700' :
                            lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {lead.status}
                          </div>
                       </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center text-slate-300 font-bold">No leads assigned to this vendor yet.</div>
                )}
             </div>
          </div>
        </div>
      )}

      {isVendorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
             <button onClick={() => setIsVendorModalOpen(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
             <div className="mb-12">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Vendor Onboarding</h3>
                <p className="text-slate-400 font-medium">Create and verify a new vendor account on the platform</p>
             </div>
             <form onSubmit={async (e) => {
               e.preventDefault();
               setIsSubmittingVendor(true);
               await createVendorManual(vendorForm);
               setIsSubmittingVendor(false);
               setIsVendorModalOpen(false);
             }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Contact Person</label><input required type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="John Doe" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Company Name</label><input required type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-100 focus:bg-white transition-all shadow-sm" value={vendorForm.company} onChange={e => setVendorForm({...vendorForm, company: e.target.value})} placeholder="Acme Solutions" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Professional Email</label><input required type="email" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} placeholder="vendor@company.com" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Mobile Number</label><input required type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm" value={vendorForm.mobile} onChange={e => setVendorForm({...vendorForm, mobile: e.target.value})} placeholder="+91 98765 43210" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Products (CSV)</label><input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm" value={vendorForm.products?.join(', ')} onChange={e => setVendorForm({...vendorForm, products: e.target.value.split(',').map(s => s.trim())})} placeholder="CRM, ERP, Cloud..." /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Location</label><input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none text-sm shadow-sm" value={vendorForm.location} onChange={e => setVendorForm({...vendorForm, location: e.target.value})} placeholder="Mumbai, MH" /></div>
                </div>

                <ImageUploadZone
                  label="Company Brand Logo"
                  value={vendorForm.logoUrl}
                  loading={isLogoSubmitting}
                  onUpload={async (b) => {
                    setIsLogoSubmitting(true);
                    const url = await uploadBase64Image(b, 'vendor-logos');
                    if (url) setVendorForm({...vendorForm, logoUrl: url});
                    setIsLogoSubmitting(false);
                  }}
                  onClear={() => setVendorForm({...vendorForm, logoUrl: ''})}
                  aspectRatio="aspect-video max-w-[280px]"
                />

                <button type="submit" disabled={isSubmittingVendor || isLogoSubmitting} className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all transform active:scale-[0.98] disabled:opacity-50">
                  {isSubmittingVendor ? 'Onboarding Vendor...' : 'Create & Verify Vendor Account'}
                </button>
             </form>
          </div>
        </div>
      )}

      {isLocModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl animate-fade-in">
           <div className="bg-white rounded-[3.5rem] w-full max-w-3xl p-12 shadow-2xl relative">
              <button onClick={() => setIsLocModalOpen(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={28} /></button>
              <h3 className="text-3xl font-black text-slate-900 mb-10 uppercase tracking-tight">{editingLoc ? 'Update' : 'Add'} {locType}</h3>
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">{locType} Name</label>
                       <input type="text" className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none shadow-inner" value={locForm.name} onChange={e => setLocForm({...locForm, name: e.target.value})} />
                    </div>
                    {locType === 'city' && (
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Linked State</label>
                          <select className="w-full bg-slate-50 p-4.5 rounded-2xl font-bold outline-none border-none shadow-inner" value={locForm.stateId} onChange={e => setLocForm({...locForm, stateId: e.target.value})}>
                             <option value="">Select State...</option>
                             {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                       </div>
                    )}
                 </div>

                 <SEOFieldGroup data={locForm} onChange={d => setLocForm({...locForm, ...d})} defaultTitle={locForm.name} defaultSlug={locForm.slug} />

                 <button onClick={handleSaveLocation} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl">Save {locType} Profile</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;