
import React, { useEffect, useState, useRef } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration, SiteConfig, BlogPost } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee, Star, ExternalLink, Globe, Phone, MapPin,
  Zap, Mail, Camera, UserCheck, PlusCircle, Trash, Newspaper, Search, MoreVertical, Archive
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
}> = ({ label, value, onUpload, onClear, className = "", aspectRatio = "aspect-video" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Only PNG, JPG, or JPEG files are allowed.');
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
            <div className="bg-white p-3 rounded-xl shadow-sm text-slate-400 mx-auto mb-2 inline-block"><Upload size={24} /></div>
            <p className="text-sm font-bold text-slate-600">Click to upload</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">PNG, JPG, JPEG</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleChange} />
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { 
    products, leads, categories, siteConfig, users, vendorLogos, vendorRegistrations, blogs,
    addProduct, updateProduct, deleteProduct, addBlog, updateBlog, deleteBlog,
    updateLeadStatus, assignLead, updateLeadRemarks, deleteLead, updateSiteConfig,
    addCategory, deleteCategory, deleteUser, addVendorLogo, deleteVendorLogo, addNotification
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'products' | 'blogs' | 'categories' | 'users' | 'requests' | 'settings' | 'logos'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => { if (!currentUser) navigate('/login'); }, [currentUser, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({ title: '', description: '', category: '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5, vendorName: '', technicalSpecs: [] });
  const [prodFeaturesText, setProdFeaturesText] = useState('');

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({ title: '', content: '', category: 'Marketplace', image: '', author: 'Admin' });

  const [configForm, setConfigForm] = useState(siteConfig);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newLogo, setNewLogo] = useState({ name: '', url: '' });

  const registeredVendors = users.filter(u => u.role === 'vendor');

  useEffect(() => { if (siteConfig) setConfigForm(siteConfig); }, [siteConfig]);

  const handleSaveProduct = async () => {
      const features = prodFeaturesText.split(',').map(f => f.trim()).filter(f => f);
      if (!prodForm.title || !prodForm.priceRange) return;
      const pData: Product = {
          id: editingProduct ? editingProduct.id : Date.now().toString(),
          slug: generateSlug(prodForm.title!),
          title: prodForm.title!,
          description: prodForm.description || '',
          category: prodForm.category || categories[0] || 'Software',
          priceRange: prodForm.priceRange || '',
          features: features,
          icon: prodForm.icon || 'globe',
          rating: Number(prodForm.rating) || 5,
          image: prodForm.image || '',
          vendorName: prodForm.vendorName || '',
          technicalSpecs: prodForm.technicalSpecs || []
      };
      if (editingProduct) await updateProduct(editingProduct.id, pData);
      else await addProduct(pData);
      setIsModalOpen(false); setEditingProduct(null);
  };

  const handleSaveBlog = async () => {
    if (!blogForm.title || !blogForm.content) return;
    const bData: BlogPost = {
      id: editingBlog ? editingBlog.id : Date.now().toString(),
      slug: generateSlug(blogForm.title!),
      title: blogForm.title!,
      content: blogForm.content || '',
      category: blogForm.category as any || 'Marketplace',
      image: blogForm.image || '',
      author: blogForm.author || 'Admin',
      date: editingBlog ? editingBlog.date : new Date().toISOString().split('T')[0]
    };
    if (editingBlog) await updateBlog(editingBlog.id, bData);
    else await addBlog(bData);
    setIsBlogModalOpen(false); setEditingBlog(null);
  };

  const renderSidebar = () => (
      <div className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 lg:relative lg:translate-x-0`}>
          <div className="p-6 font-bold text-2xl flex items-center justify-between border-b border-slate-800">
              <span className="flex items-center gap-2 font-black tracking-tighter"><Zap className="text-blue-500 fill-current" /> BantConfirm</span>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-6 space-y-1 px-4">
              {[
                  { id: 'overview', icon: Layout, label: 'Overview' },
                  { id: 'leads', icon: FileText, label: 'Leads Hub' },
                  { id: 'requests', icon: MessageSquare, label: 'Vendor Onboarding' },
                  { id: 'users', icon: Users, label: 'User Directory' },
                  { id: 'logos', icon: ImageIcon, label: 'Partner Logos' },
                  { id: 'products', icon: ShoppingBag, label: 'Products' },
                  { id: 'blogs', icon: Newspaper, label: 'Blog Posts' },
                  { id: 'categories', icon: Tag, label: 'Categories' },
                  { id: 'settings', icon: Settings, label: 'Site Settings' },
              ].map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 rounded-xl transition font-bold text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                      <item.icon size={18} className="mr-3" /> {item.label}
                  </button>
              ))}
          </nav>
      </div>
  );

  const renderLeads = () => (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Leads Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Manage and assign BANT-qualified requirements</p>
          </div>
          <button className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-5 py-2.5 rounded-xl hover:bg-green-100 transition">
            <Download size={18} className="mr-2" /> Export Active Leads
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Prospect Profile</th>
                <th className="px-8 py-5">Detailed Requirement</th>
                <th className="px-8 py-5">Assignment & Status</th>
                <th className="px-8 py-5">Admin Remarks</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="font-black text-slate-900 text-base">{lead.name}</div>
                      <div className="text-blue-600 font-black text-xs uppercase tracking-tight">{lead.company || 'Individual Prospect'}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="p-1 bg-slate-100 rounded text-slate-400"><Phone size={12} /></div>
                        <span className="text-xs font-bold text-slate-600">{lead.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="p-1 bg-slate-100 rounded text-slate-400"><Mail size={12} /></div>
                        <span className="text-xs font-bold text-slate-500">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="p-1 bg-slate-100 rounded text-slate-400"><MapPin size={12} /></div>
                        <span className="text-xs font-bold text-slate-400">{lead.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-xs">
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-2">
                        <p className="text-xs font-black text-indigo-700 uppercase mb-1">Service: {lead.service}</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed line-clamp-3">"{lead.requirement}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-[10px] font-black text-slate-400">BUDGET: <span className="text-green-600">{lead.budget}</span></div>
                        <div className="text-[10px] font-black text-slate-400">TIMING: <span className="text-blue-600">{lead.timing}</span></div>
                        <div className="text-[10px] font-black text-slate-400">AUTHORITY: <span className="text-purple-600">{lead.authority}</span></div>
                        <div className="text-[10px] font-black text-slate-400">DATE: <span className="text-slate-600">{lead.date}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Assign to Vendor</label>
                        <select 
                          value={lead.assignedTo || ''} 
                          onChange={e => assignLead(lead.id, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Pending Assignment...</option>
                          {registeredVendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.company || 'Partner'})</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          value={lead.status} 
                          onChange={e => updateLeadStatus(lead.id, e.target.value as any)} 
                          className={`flex-1 text-[10px] font-black uppercase px-3 py-2 rounded-lg border outline-none ${
                            lead.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' :
                            lead.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                            lead.status === 'Sold' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
                          }`}
                        >
                          <option>Pending</option>
                          <option>Verified</option>
                          <option>Sold</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <textarea 
                      placeholder="Add internal notes for vendors..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-blue-50"
                      value={lead.remarks || ''}
                      onChange={e => updateLeadRemarks(lead.id, e.target.value)}
                    />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Service Inventory</h3>
        <button onClick={() => { setEditingProduct(null); setProdForm({ title: '', description: '', priceRange: '', features: [], category: categories[0], icon: 'globe', rating: 5, vendorName: '', technicalSpecs: [] }); setProdFeaturesText(''); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
          <Plus size={20} className="mr-2" /> Add New Service
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600">{p.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-2">{p.title}</h4>
            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4">{p.priceRange}</div>
            <div className="flex-grow space-y-2 mb-8">
               {p.features.slice(0, 3).map((f, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CheckCircle2 size={12} className="text-green-500" /> {f}
                 </div>
               ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setEditingProduct(p); setProdForm(p); setProdFeaturesText(p.features.join(', ')); setIsModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Edit Details</button>
              <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-5xl animate-fade-in space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Settings className="text-blue-600" /> Platform Configuration</h3>
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Platform Name</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 transition" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Support / Admin Email</label>
              <input type="email" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 transition" value={configForm.adminNotificationEmail || ''} onChange={e => setConfigForm({...configForm, adminNotificationEmail: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploadZone label="Marketplace Logo (Header)" value={configForm.logoUrl} onUpload={b => setConfigForm({...configForm, logoUrl: b})} onClear={() => setConfigForm({...configForm, logoUrl: ''})} aspectRatio="aspect-square max-w-[200px]" />
            <ImageUploadZone label="Browser Favicon (Google SEO)" value={configForm.faviconUrl} onUpload={b => setConfigForm({...configForm, faviconUrl: b})} onClear={() => setConfigForm({...configForm, faviconUrl: ''})} aspectRatio="aspect-square max-w-[150px]" />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
             <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Globe size={18} className="text-indigo-600" /> Social Media & Connectivity</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                   <Twitter className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-400 transition-colors" size={20} />
                   <input type="text" placeholder="Twitter Profile Link" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.twitter || ''} onChange={e => setConfigForm({...configForm.socialLinks, twitter: e.target.value}) ? null : null} />
                </div>
                <div className="relative group">
                   <Linkedin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                   <input type="text" placeholder="LinkedIn Profile Link" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.linkedin || ''} onChange={e => setConfigForm({...configForm.socialLinks, linkedin: e.target.value}) ? null : null} />
                </div>
                <div className="relative group">
                   <Facebook className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-700 transition-colors" size={20} />
                   <input type="text" placeholder="Facebook Profile Link" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.facebook || ''} onChange={e => setConfigForm({...configForm.socialLinks, facebook: e.target.value}) ? null : null} />
                </div>
                <div className="relative group">
                   <Instagram className="absolute left-4 top-4 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                   <input type="text" placeholder="Instagram Profile Link" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.instagram || ''} onChange={e => setConfigForm({...configForm.socialLinks, instagram: e.target.value}) ? null : null} />
                </div>
                <div className="relative group md:col-span-2">
                   <div className="absolute left-4 top-4 text-green-500 font-black text-xs">WA</div>
                   <input type="text" placeholder="WhatsApp Business Number (e.g. +91 9999999999)" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.whatsappNumber || ''} onChange={e => setConfigForm({...configForm, whatsappNumber: e.target.value})} />
                </div>
             </div>
          </div>

          <button onClick={() => updateSiteConfig(configForm)} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-100 transform active:scale-[0.98]">
            Push Changes to Live Website
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl text-blue-600 flex items-center justify-center mb-4"><Users size={24} /></div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Marketplace Users</div>
          <div className="text-4xl font-black text-slate-900">{users.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="bg-yellow-50 w-12 h-12 rounded-2xl text-yellow-600 flex items-center justify-center mb-4"><FileText size={24} /></div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">BANT Leads</div>
          <div className="text-4xl font-black text-slate-900">{leads.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="bg-purple-50 w-12 h-12 rounded-2xl text-purple-600 flex items-center justify-center mb-4"><ShoppingBag size={24} /></div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Live Inventory</div>
          <div className="text-4xl font-black text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="bg-green-50 w-12 h-12 rounded-2xl text-green-600 flex items-center justify-center mb-4"><IndianRupee size={24} /></div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Est. Marketplace GMV</div>
          <div className="text-4xl font-black text-slate-900">₹4.2L</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><Zap className="text-yellow-500 fill-current" /> Recent Activity</h3>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-black text-slate-900">{lead.name}</div>
                  <div className="text-xs font-bold text-slate-400">{lead.service} • {lead.date}</div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${lead.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><Briefcase className="text-blue-500" /> New Registrations</h3>
          <div className="space-y-4">
            {vendorRegistrations.slice(0, 5).map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-black text-slate-900">{reg.companyName}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reg.productName}</div>
                </div>
                <div className="text-xs font-bold text-blue-500">{reg.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Missing renderBlogs implementation to manage blog posts in the dashboard.
   */
  const renderBlogs = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Insight Articles</h3>
        <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', content: '', category: 'Marketplace', image: '', author: 'Admin' }); setIsBlogModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
          <Plus size={20} className="mr-2" /> Write New Article
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(b => (
          <div key={b.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {b.image ? <img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={b.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600">{b.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-2 line-clamp-1">{b.title}</h4>
            <div className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">By {b.author} • {b.date}</div>
            <p className="text-slate-500 text-xs line-clamp-3 mb-6 flex-grow">{b.content}</p>
            <div className="flex gap-3">
              <button onClick={() => { setEditingBlog(b); setBlogForm(b); setIsBlogModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Edit Post</button>
              <button onClick={() => deleteBlog(b.id)} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Missing renderLogos implementation to manage partner logos in the dashboard.
   */
  const renderLogos = () => (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><ImageIcon className="text-blue-600" /> Partner Network Logos</h3>
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8">
           <h4 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-wider">Add New Partner Logo</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Partner Name</label>
                 <input type="text" className="w-full bg-white p-4 rounded-xl outline-none font-bold text-sm border border-slate-200" value={newLogo.name} onChange={e => setNewLogo({...newLogo, name: e.target.value})} placeholder="e.g. Tata Teleservices" />
              </div>
              <ImageUploadZone label="Logo Image (PNG/JPG)" value={newLogo.url} onUpload={b => setNewLogo({...newLogo, url: b})} onClear={() => setNewLogo({...newLogo, url: ''})} aspectRatio="aspect-video max-h-[100px]" />
           </div>
           <button onClick={() => { if(newLogo.name && newLogo.url) { addVendorLogo({ id: Date.now().toString(), name: newLogo.name, logoUrl: newLogo.url }); setNewLogo({ name: '', url: '' }); } }} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition shadow-lg">Add Partner to Marketplace</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {vendorLogos.map(logo => (
             <div key={logo.id} className="relative group aspect-video bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all">
                <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                <button onClick={() => deleteVendorLogo(logo.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full">{logo.name}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {renderSidebar()}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-24 flex items-center justify-between px-10 shrink-0">
             <div className="flex items-center">
                 <button className="lg:hidden mr-4 p-2 bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <div className="flex flex-col">
                   <h1 className="font-black text-2xl text-slate-900 uppercase tracking-tight">{activeTab}</h1>
                   <p className="text-xs font-bold text-slate-400">Authenticated as Administrator</p>
                 </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-black text-slate-900 uppercase">Super Admin</div>
                  <div className="text-xs font-bold text-slate-400">{currentUser?.email}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200">SA</div>
             </div>
        </header>
        <main className="flex-grow overflow-y-auto p-10">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'blogs' && renderBlogs()}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center"><h3 className="text-2xl font-black text-slate-900">User Directory</h3></div>
                  <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-8 py-5">User Profile</th><th className="px-8 py-5">Identity & Role</th><th className="px-8 py-5">Joined Date</th><th className="px-8 py-5">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{users.map(u => (<tr key={u.id} className="hover:bg-slate-50/50 group"><td className="px-8 py-6"><div className="font-black text-slate-900 text-base">{u.name}</div><div className="text-xs font-bold text-slate-400">{u.email}</div></td><td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-50 text-red-600' : u.role === 'vendor' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>{u.role}</span></td><td className="px-8 py-6 font-bold text-slate-400 text-sm">{u.joinedDate?.split('T')[0]}</td><td className="px-8 py-6"><button onClick={() => deleteUser(u.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={20} /></button></td></tr>))}</tbody></table></div>
              </div>
            )}
            {activeTab === 'logos' && renderLogos()}
            {activeTab === 'categories' && (
              <div className="max-w-xl bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8">Service Categories</h3>
                <div className="flex gap-4 mb-8">
                   <input type="text" placeholder="e.g. AI Agents" className="flex-1 bg-slate-50 p-4 rounded-xl outline-none font-bold text-slate-700" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                   <button onClick={() => { if(newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-slate-900 text-white px-8 rounded-xl font-black text-sm">Add</button>
                </div>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <span className="font-bold text-slate-700 text-sm">{cat}</span>
                      <button onClick={() => deleteCategory(cat)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-8 border-b border-gray-100"><h3 className="text-2xl font-black text-slate-900">Partner Onboarding Queue</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-8 py-5">Company</th><th className="px-8 py-5">Contact Details</th><th className="px-8 py-5">Product/Niche</th><th className="px-8 py-5">Message</th><th className="px-8 py-5">Submitted</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {vendorRegistrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50/50">
                            <td className="px-8 py-6"><div className="font-black text-slate-900">{reg.companyName}</div><div className="text-xs font-bold text-slate-400">{reg.name}</div></td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-600"><div>{reg.email}</div><div>{reg.mobile}</div></td>
                            <td className="px-8 py-6"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">{reg.productName}</span></td>
                            <td className="px-8 py-6 max-w-xs text-xs font-medium text-slate-400 line-clamp-1 italic">"{reg.message}"</td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-400">{reg.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}
            {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
             <div className="flex justify-between items-center mb-10"><h3 className="text-3xl font-black text-slate-900 tracking-tighter">{editingProduct ? 'Edit Service Listing' : 'Publish New Service'}</h3><button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24} /></button></div>
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Service Title</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none" value={prodForm.title} onChange={e => setProdForm({...prodForm, title: e.target.value})} placeholder="e.g. Enterprise CRM Pro" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Pricing Range</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-blue-600 outline-none" value={prodForm.priceRange} onChange={e => setProdForm({...prodForm, priceRange: e.target.value})} placeholder="₹5,000 - ₹50,000 / mo" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Category</label><select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-none" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Vendor Brand Label</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-indigo-600 outline-none" value={prodForm.vendorName} onChange={e => setProdForm({...prodForm, vendorName: e.target.value})} placeholder="e.g. Jio Business" /></div>
                </div>
                
                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Full Description</label><textarea rows={3} className="w-full bg-slate-50 p-5 rounded-2xl font-medium leading-relaxed" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} placeholder="Explain what this service provides to the business..." /></div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Top Features (Comma Separated)</label>
                  <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={prodFeaturesText} onChange={e => setProdFeaturesText(e.target.value)} placeholder="GST Billing, Cloud IVR, API Access..." />
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Technical Specifications Hub</label>
                    <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: [...(prev.technicalSpecs || []), {label:'', value:''}]}))} className="text-xs font-black text-blue-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm"><Plus size={14} /> Add Specification</button>
                  </div>
                  <div className="space-y-3">
                    {prodForm.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="text" placeholder="Label" className="flex-1 bg-white p-3 rounded-xl border border-slate-100 font-black text-xs" value={spec.label} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].label = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <input type="text" placeholder="Value" className="flex-1 bg-white p-3 rounded-xl border border-slate-100 font-bold text-xs" value={spec.value} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].value = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: prev.technicalSpecs!.filter((_,idx) => idx !== i)}))} className="p-2 text-red-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {(!prodForm.technicalSpecs || prodForm.technicalSpecs.length === 0) && <p className="text-center text-xs font-bold text-slate-300 py-4 italic">No specific technical data added yet.</p>}
                  </div>
                </div>

                <ImageUploadZone label="Marketing Header Image" value={prodForm.image} onUpload={b => setProdForm({...prodForm, image: b})} onClear={() => setProdForm({...prodForm, image: ''})} aspectRatio="aspect-video" />
                <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-[0.98]">Save Listing & Push Live</button>
             </div>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
             <div className="flex justify-between items-center mb-10"><h3 className="text-3xl font-black text-slate-900">{editingBlog ? 'Edit Insight Article' : 'Compose New Insight'}</h3><button onClick={() => setIsBlogModalOpen(false)}><X size={24} /></button></div>
             <div className="space-y-8">
                <input type="text" className="w-full bg-slate-50 p-5 rounded-2xl font-black text-2xl outline-none" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Enter Article Title..." />
                <div className="grid grid-cols-2 gap-6">
                  <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value as any})}><option>Marketplace</option><option>Service</option><option>Product</option><option>Industry News</option></select>
                  <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} placeholder="Author Display Name" />
                </div>
                <ImageUploadZone label="Featured Banner" value={blogForm.image} onUpload={b => setBlogForm({...blogForm, image: b})} onClear={() => setBlogForm({...blogForm, image: ''})} aspectRatio="aspect-video" />
                <textarea rows={12} className="w-full bg-slate-50 p-6 rounded-2xl font-medium leading-relaxed outline-none" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Begin writing the story content..." />
                <button onClick={handleSaveBlog} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition">Publish to Blog</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
