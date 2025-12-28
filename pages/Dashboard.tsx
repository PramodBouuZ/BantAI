import React, { useEffect, useState, useRef } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration, SiteConfig, BlogPost } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee, Star, ExternalLink, Globe, Phone, MapPin,
  Zap, Mail, Camera, UserCheck, PlusCircle, Trash, Newspaper, Search, MoreVertical, Archive, ArrowRight
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
      if (!prodForm.title || !prodForm.priceRange) {
        addNotification("Title and Pricing are required", "warning");
        return;
      }
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
    if (!blogForm.title || !blogForm.content) {
      addNotification("Title and Content are required", "warning");
      return;
    }
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
              <span className="flex items-center gap-2 font-black tracking-tighter text-xl"><Zap className="text-blue-500 fill-current" size={24} /> BantConfirm</span>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-6 space-y-1 px-4 overflow-y-auto max-h-[calc(100vh-100px)]">
              {[
                  { id: 'overview', icon: Layout, label: 'Overview' },
                  { id: 'leads', icon: FileText, label: 'Leads Hub' },
                  { id: 'requests', icon: MessageSquare, label: 'Vendor Queue' },
                  { id: 'users', icon: Users, label: 'Users' },
                  { id: 'logos', icon: ImageIcon, label: 'Partners' },
                  { id: 'products', icon: ShoppingBag, label: 'Services' },
                  { id: 'blogs', icon: Newspaper, label: 'Insights' },
                  { id: 'categories', icon: Tag, label: 'Categories' },
                  { id: 'settings', icon: Settings, label: 'Settings' },
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
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Leads Hub</h3>
            <p className="text-sm text-slate-500 font-medium">Verified BANT requirements waiting for assignment</p>
          </div>
          <button className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-5 py-2.5 rounded-xl hover:bg-green-100 transition shadow-sm">
            <Download size={18} className="mr-2" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Prospect Profile</th>
                <th className="px-8 py-5">Requirement Detail</th>
                <th className="px-8 py-5">Status & Assigned Vendor</th>
                <th className="px-8 py-5">Admin Notes</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <div className="font-black text-slate-900 text-base">{lead.name}</div>
                      <div className="text-blue-600 font-black text-xs uppercase tracking-tight">{lead.company || 'Individual Prosp.'}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Phone size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-600">{lead.mobile}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{lead.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-xs">
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 mb-2">
                        <p className="text-[10px] font-black text-indigo-700 uppercase mb-1">REQ: {lead.service}</p>
                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic line-clamp-2">"{lead.requirement}"</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="text-[9px] font-black px-1.5 py-0.5 bg-green-50 text-green-600 rounded uppercase">Budget: {lead.budget}</div>
                        <div className="text-[9px] font-black px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">Time: {lead.timing}</div>
                        <div className="text-[9px] font-black px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded uppercase">Auth: {lead.authority}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-3">
                      <select 
                        value={lead.status} 
                        onChange={e => updateLeadStatus(lead.id, e.target.value as any)} 
                        className={`w-full text-[10px] font-black uppercase px-3 py-2 rounded-lg border outline-none ${
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
                      <div>
                        <label className="text-[8px] font-black uppercase text-slate-300 block mb-1">Assigned Vendor</label>
                        <select 
                          value={lead.assignedTo || ''} 
                          onChange={e => assignLead(lead.id, e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-[11px] font-bold outline-none"
                        >
                          <option value="">Pending...</option>
                          {registeredVendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.company || 'Partner'})</option>)}
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <textarea 
                      placeholder="Add internal remarks..."
                      className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-medium text-slate-600 outline-none focus:bg-white transition-all"
                      value={lead.remarks || ''}
                      onChange={e => updateLeadRemarks(lead.id, e.target.value)}
                    />
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => { if(window.confirm('Delete this lead?')) deleteLead(lead.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
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
          <Plus size={20} className="mr-2" /> Add New Listing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 tracking-widest">{p.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-1 line-clamp-1">{p.title}</h4>
            <div className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4">{p.priceRange}</div>
            <div className="flex-grow space-y-2 mb-8 border-t border-slate-50 pt-4">
               {p.features.slice(0, 3).map((f, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <CheckCircle2 size={12} className="text-green-500" /> {f}
                 </div>
               ))}
               {p.technicalSpecs && p.technicalSpecs.length > 0 && (
                 <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400">
                   <Tag size={10} /> {p.technicalSpecs.length} Specs Defined
                 </div>
               )}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <button onClick={() => { setEditingProduct(p); setProdForm(p); setProdFeaturesText(p.features.join(', ')); setIsModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Edit Details</button>
              <button onClick={() => { if(window.confirm('Delete product?')) deleteProduct(p.id); }} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Marketplace Insights</h3>
        <button onClick={() => { setEditingBlog(null); setBlogForm({ title: '', content: '', category: 'Marketplace', image: '', author: 'Admin' }); setIsBlogModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm flex items-center shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
          <Plus size={20} className="mr-2" /> Write New Article
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(b => (
          <div key={b.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all p-8 flex flex-col h-full group">
            <div className="h-44 bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
              {b.image ? <img src={b.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={b.title} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-600 tracking-widest">{b.category}</div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-1 line-clamp-1">{b.title}</h4>
            <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4">By {b.author} • {b.date}</div>
            <p className="text-slate-500 text-xs line-clamp-3 mb-6 flex-grow leading-relaxed font-medium">{b.content}</p>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <button onClick={() => { setEditingBlog(b); setBlogForm(b); setIsBlogModalOpen(true); }} className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl text-xs font-black hover:bg-slate-800 transition shadow-lg">Edit Post</button>
              <button onClick={() => { if(window.confirm('Delete blog?')) deleteBlog(b.id); }} className="bg-red-50 text-red-500 p-3.5 rounded-2xl hover:bg-red-100 transition"><Trash2 size={18} /></button>
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
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Platform Display Name</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 transition" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Support Email Contact</label>
              <input type="email" className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold text-slate-700 border-2 border-transparent focus:border-blue-100 transition" value={configForm.adminNotificationEmail || ''} onChange={e => setConfigForm({...configForm, adminNotificationEmail: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ImageUploadZone label="Header Logo (Transparent PNG)" value={configForm.logoUrl} onUpload={b => setConfigForm({...configForm, logoUrl: b})} onClear={() => setConfigForm({...configForm, logoUrl: ''})} aspectRatio="aspect-square max-w-[220px]" />
            <ImageUploadZone label="Google Search Favicon (192x192)" value={configForm.faviconUrl} onUpload={b => setConfigForm({...configForm, faviconUrl: b})} onClear={() => setConfigForm({...configForm, faviconUrl: ''})} aspectRatio="aspect-square max-w-[150px]" />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
             <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2"><Globe size={18} className="text-indigo-600" /> Social Links & Connectivity</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                   <Twitter className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-400 transition-colors" size={20} />
                   <input type="text" placeholder="Twitter Profile URL" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.twitter || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, twitter: e.target.value}})} />
                </div>
                <div className="relative group">
                   <Linkedin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                   <input type="text" placeholder="LinkedIn Profile URL" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.linkedin || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, linkedin: e.target.value}})} />
                </div>
                <div className="relative group">
                   <Facebook className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-700 transition-colors" size={20} />
                   <input type="text" placeholder="Facebook Profile URL" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.facebook || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, facebook: e.target.value}})} />
                </div>
                <div className="relative group">
                   <Instagram className="absolute left-4 top-4 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={20} />
                   <input type="text" placeholder="Instagram Profile URL" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.socialLinks.instagram || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, instagram: e.target.value}})} />
                </div>
                <div className="relative group md:col-span-2">
                   <div className="absolute left-4 top-4 text-green-500 font-black text-xs">WA</div>
                   <input type="text" placeholder="WhatsApp Number (+91...)" className="w-full bg-white pl-12 pr-4 py-4 rounded-xl outline-none border border-slate-200 font-bold text-sm" value={configForm.whatsappNumber || ''} onChange={e => setConfigForm({...configForm, whatsappNumber: e.target.value})} />
                </div>
             </div>
          </div>

          <button onClick={() => updateSiteConfig(configForm)} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition shadow-2xl shadow-blue-100 transform active:scale-[0.98]">
            Push Changes to Live Production
          </button>
        </div>
      </div>
    </div>
  );

  const renderLogos = () => (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><ImageIcon className="text-blue-600" /> Partner Network</h3>
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10">
           <h4 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-wider">Add New Vendor Partner</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Partner Brand Name</label>
                 <input type="text" className="w-full bg-white p-4 rounded-xl outline-none font-bold text-sm border border-slate-200" value={newLogo.name} onChange={e => setNewLogo({...newLogo, name: e.target.value})} placeholder="e.g. Jio Business Solutions" />
              </div>
              <ImageUploadZone label="Logo Image (PNG/JPG)" value={newLogo.url} onUpload={b => setNewLogo({...newLogo, url: b})} onClear={() => setNewLogo({...newLogo, url: ''})} aspectRatio="aspect-video max-h-[120px]" />
           </div>
           <button onClick={() => { if(newLogo.name && newLogo.url) { addVendorLogo({ id: Date.now().toString(), name: newLogo.name, logoUrl: newLogo.url }); setNewLogo({ name: '', url: '' }); } }} className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition shadow-lg">Register Partner Logo</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {vendorLogos.map(logo => (
             <div key={logo.id} className="relative group aspect-video bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all">
                <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                <button onClick={() => deleteVendorLogo(logo.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full">{logo.name}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl text-blue-600 flex items-center justify-center mb-4"><Users size={24} /></div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Users</div>
          <div className="text-4xl font-black text-slate-900">{users.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="bg-yellow-50 w-12 h-12 rounded-2xl text-yellow-600 flex items-center justify-center mb-4"><FileText size={24} /></div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Leads</div>
          <div className="text-4xl font-black text-slate-900">{leads.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="bg-purple-50 w-12 h-12 rounded-2xl text-purple-600 flex items-center justify-center mb-4"><ShoppingBag size={24} /></div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Services</div>
          <div className="text-4xl font-black text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition">
          <div className="bg-green-50 w-12 h-12 rounded-2xl text-green-600 flex items-center justify-center mb-4"><Newspaper size={24} /></div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Insights Published</div>
          <div className="text-4xl font-black text-slate-900">{blogs.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><Zap size={20} className="text-yellow-500 fill-current" /> Recent Active Leads</h3>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-100 transition group cursor-pointer">
                <div>
                  <div className="font-black text-slate-900 group-hover:text-blue-600 transition">{lead.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{lead.service} • {lead.date}</div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${lead.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{lead.status}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('leads')} className="w-full mt-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition">View All Leads Database</button>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2"><Briefcase size={20} className="text-blue-500" /> Vendor Applications</h3>
          <div className="space-y-4">
            {vendorRegistrations.slice(0, 5).map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-100 transition group">
                <div>
                  <div className="font-black text-slate-900 group-hover:text-blue-600 transition">{reg.companyName}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{reg.productName}</div>
                </div>
                <div className="text-[11px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">{reg.date}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('requests')} className="w-full mt-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition">Manage Partner Queue</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {renderSidebar()}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-24 flex items-center justify-between px-10 shrink-0">
             <div className="flex items-center">
                 <button className="lg:hidden mr-4 p-2 bg-slate-50 rounded-xl" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <div className="flex flex-col">
                   <h1 className="font-black text-2xl text-slate-900 uppercase tracking-tight">{activeTab.replace('-', ' ')}</h1>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Platform Administration</p>
                 </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-tight">Super Admin Workspace</div>
                  <div className="text-[10px] font-bold text-slate-400">{currentUser?.email}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-200">SA</div>
             </div>
        </header>
        <main className="flex-grow overflow-y-auto p-10 bg-slate-50/50">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'blogs' && renderBlogs()}
            {activeTab === 'logos' && renderLogos()}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/30"><h3 className="text-2xl font-black text-slate-900">User Directory</h3></div>
                  <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-8 py-5">User Account</th><th className="px-8 py-5">Role Identity</th><th className="px-8 py-5">Registered On</th><th className="px-8 py-5">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{users.map(u => (<tr key={u.id} className="hover:bg-slate-50/50 group"><td className="px-8 py-6"><div className="font-black text-slate-900 text-base">{u.name}</div><div className="text-xs font-bold text-slate-400">{u.email}</div></td><td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-red-50 text-red-600' : u.role === 'vendor' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>{u.role}</span></td><td className="px-8 py-6 font-bold text-slate-400 text-sm">{u.joinedDate?.split('T')[0]}</td><td className="px-8 py-6"><button onClick={() => { if(window.confirm('Delete user?')) deleteUser(u.id); }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={20} /></button></td></tr>))}</tbody></table></div>
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="max-w-xl bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8">Service Categories</h3>
                <div className="flex gap-4 mb-8">
                   <input type="text" placeholder="e.g. AI Voice Agents" className="flex-1 bg-slate-50 p-4 rounded-xl outline-none font-bold text-slate-700 text-sm" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                   <button onClick={() => { if(newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-slate-900 text-white px-8 rounded-xl font-black text-sm hover:bg-slate-800 transition">Add</button>
                </div>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-100 transition">
                      <span className="font-bold text-slate-700 text-sm">{cat}</span>
                      <button onClick={() => { if(window.confirm('Delete category?')) deleteCategory(cat); }} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-8 border-b border-gray-100 bg-slate-50/30"><h3 className="text-2xl font-black text-slate-900">Partner Onboarding Queue</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-8 py-5">Company Entity</th><th className="px-8 py-5">Contact Details</th><th className="px-8 py-5">Niche Service</th><th className="px-8 py-5">Application Text</th><th className="px-8 py-5">Submission</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {vendorRegistrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50/50">
                            <td className="px-8 py-6"><div className="font-black text-slate-900">{reg.companyName}</div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{reg.name}</div></td>
                            <td className="px-8 py-6 text-xs font-bold text-slate-600"><div>{reg.email}</div><div>{reg.mobile}</div></td>
                            <td className="px-8 py-6"><span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">{reg.productName}</span></td>
                            <td className="px-8 py-6 max-w-xs text-[11px] font-medium text-slate-400 line-clamp-1 italic">"{reg.message}"</td>
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
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Service Headline</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none" value={prodForm.title} onChange={e => setProdForm({...prodForm, title: e.target.value})} placeholder="e.g. Cloud ERP Professional" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Pricing Estimation</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-blue-600 outline-none" value={prodForm.priceRange} onChange={e => setProdForm({...prodForm, priceRange: e.target.value})} placeholder="₹10,000 - ₹1.5L / year" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Vertical Category</label><select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-none text-sm" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Marketplace Brand Label</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-indigo-600 outline-none text-sm" value={prodForm.vendorName} onChange={e => setProdForm({...prodForm, vendorName: e.target.value})} placeholder="e.g. Airtel Business" /></div>
                </div>
                
                <div><label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Main Service Summary</label><textarea rows={3} className="w-full bg-slate-50 p-5 rounded-2xl font-medium leading-relaxed text-sm" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} placeholder="Summary of the technical offering..." /></div>
                
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Top Selling Features (Comma Split)</label>
                  <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm" value={prodFeaturesText} onChange={e => setProdFeaturesText(e.target.value)} placeholder="GST Ready, Cloud Backup, API Access..." />
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Technical Specifications (Specs)</label>
                    <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: [...(prev.technicalSpecs || []), {label:'', value:''}]}))} className="text-[10px] font-black text-blue-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"><Plus size={12} /> Add Spec Row</button>
                  </div>
                  <div className="space-y-3">
                    {prodForm.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex gap-2 items-center animate-fade-in">
                        <input type="text" placeholder="Spec Name (e.g. Uptime)" className="flex-1 bg-white p-3 rounded-xl border border-slate-100 font-black text-[11px] outline-none focus:border-blue-200" value={spec.label} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].label = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <input type="text" placeholder="Spec Value (e.g. 99.9%)" className="flex-1 bg-white p-3 rounded-xl border border-slate-100 font-bold text-[11px] outline-none focus:border-blue-200" value={spec.value} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].value = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: prev.technicalSpecs!.filter((_,idx) => idx !== i)}))} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {(!prodForm.technicalSpecs || prodForm.technicalSpecs.length === 0) && <p className="text-center text-[10px] font-black text-slate-300 py-4 italic tracking-widest">No technical specifications added.</p>}
                  </div>
                </div>

                <ImageUploadZone label="Listing Cover Image" value={prodForm.image} onUpload={b => setProdForm({...prodForm, image: b})} onClear={() => setProdForm({...prodForm, image: ''})} aspectRatio="aspect-video" />
                <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-[0.98]">Push Listing to Live Catalog</button>
             </div>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
             <div className="flex justify-between items-center mb-10"><h3 className="text-3xl font-black text-slate-900 tracking-tighter">{editingBlog ? 'Update Insight Article' : 'Compose New Insight'}</h3><button onClick={() => setIsBlogModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24} /></button></div>
             <div className="space-y-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Article Headline</label>
                   <input type="text" className="w-full bg-slate-50 p-5 rounded-2xl font-black text-2xl outline-none border-none focus:bg-white focus:ring-2 focus:ring-indigo-50 transition" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="The Future of B2B Software in India..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Category</label>
                    <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-none text-sm" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value as any})}><option>Marketplace</option><option>Service</option><option>Product</option><option>Industry News</option></select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Author Display Name</label>
                    <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-none" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} placeholder="Admin" />
                  </div>
                </div>
                <ImageUploadZone label="Featured Banner Visual" value={blogForm.image} onUpload={b => setBlogForm({...blogForm, image: b})} onClear={() => setBlogForm({...blogForm, image: ''})} aspectRatio="aspect-video" />
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Article Body Content</label>
                   <textarea rows={12} className="w-full bg-slate-50 p-6 rounded-2xl font-medium leading-relaxed outline-none border-none focus:bg-white focus:ring-2 focus:ring-indigo-50 transition text-sm" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Begin your industry insight story..." />
                </div>
                <button onClick={handleSaveBlog} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-indigo-700 transition transform active:scale-[0.98]">Publish Article to Blog Hub</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;