import React, { useEffect, useState, useRef } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration, SiteConfig, BlogPost } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee, Star, ExternalLink, Globe, Phone, MapPin,
  Zap, Mail, Camera, UserCheck, PlusCircle, Trash, Newspaper, Search, MoreVertical, Archive, ArrowRight, Calendar, User as UserIcon
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
                          {registeredVendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.company || 'Partner'})</option>)}
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
               {p.technicalSpecs && p.technicalSpecs.length > 0 && (
                 <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg w-fit mt-2">
                   <Tag size={10} /> {p.technicalSpecs.length} Tech Specs
                 </div>
               )}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ImageUploadZone label="Marketplace Identity Logo" value={configForm.logoUrl} onUpload={b => setConfigForm({...configForm, logoUrl: b})} onClear={() => setConfigForm({...configForm, logoUrl: ''})} aspectRatio="aspect-video max-w-[280px]" />
            <ImageUploadZone label="Browser App Favicon (192px)" value={configForm.faviconUrl} onUpload={b => setConfigForm({...configForm, faviconUrl: b})} onClear={() => setConfigForm({...configForm, faviconUrl: ''})} aspectRatio="aspect-square max-w-[140px]" />
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

  const renderLogos = () => (
    <div className="max-w-4xl animate-fade-in space-y-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
        <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4"><ImageIcon className="text-blue-600" size={32} /> Vendor Network Logos</h3>
        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-12 shadow-inner">
           <h4 className="font-black text-slate-900 mb-8 text-sm uppercase tracking-widest ml-1">Onboard New Partner Brand</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div>
                 <label className="block text-[10px] font-black uppercase text-slate-400 mb-2.5 tracking-widest ml-1">Brand Legal Name</label>
                 <input type="text" className="w-full bg-white p-4.5 rounded-2xl outline-none font-bold text-sm border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-100" value={newLogo.name} onChange={e => setNewLogo({...newLogo, name: e.target.value})} placeholder="e.g. Tata Communications" />
              </div>
              <ImageUploadZone label="Logo Asset (Transparent PNG)" value={newLogo.url} onUpload={b => setNewLogo({...newLogo, url: b})} onClear={() => setNewLogo({...newLogo, url: ''})} aspectRatio="aspect-video max-h-[140px]" />
           </div>
           <button onClick={() => { if(newLogo.name && newLogo.url) { addVendorLogo({ id: Date.now().toString(), name: newLogo.name, logoUrl: newLogo.url }); setNewLogo({ name: '', url: '' }); } }} className="w-full mt-10 bg-slate-900 text-white py-4.5 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl">Register Partner Asset</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {vendorLogos.map(logo => (
             <div key={logo.id} className="relative group aspect-video bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-help">
                <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                <button onClick={() => deleteVendorLogo(logo.id)} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 hover:bg-red-600"><X size={16} /></button>
                <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                   <span className="text-[10px] font-black text-slate-500 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{logo.name}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="bg-blue-50 w-16 h-16 rounded-[1.5rem] text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm"><Users size={28} /></div>
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Total Users</div>
          <div className="text-5xl font-black text-slate-900 tracking-tighter">{users.length}</div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="bg-yellow-50 w-16 h-16 rounded-[1.5rem] text-yellow-600 flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors shadow-sm"><FileText size={28} /></div>
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Total Leads</div>
          <div className="text-5xl font-black text-slate-900 tracking-tighter">{leads.length}</div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="bg-purple-50 w-16 h-16 rounded-[1.5rem] text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm"><ShoppingBag size={28} /></div>
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Active Services</div>
          <div className="text-5xl font-black text-slate-900 tracking-tighter">{products.length}</div>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="bg-green-50 w-16 h-16 rounded-[1.5rem] text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm"><Newspaper size={28} /></div>
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-1">Insights Hub</div>
          <div className="text-5xl font-black text-slate-900 tracking-tighter">{blogs.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3"><Zap size={24} className="text-yellow-500 fill-current" /> Recent Marketplace Leads</h3>
          <div className="space-y-5">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:bg-white hover:border-blue-100 transition-all group cursor-pointer shadow-sm hover:shadow-md">
                <div>
                  <div className="font-black text-slate-900 group-hover:text-blue-600 transition text-base">{lead.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{lead.service} <span className="mx-1.5 opacity-30">•</span> {lead.date}</div>
                </div>
                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${lead.status === 'Verified' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>{lead.status}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('leads')} className="w-full mt-10 py-5 bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-dashed border-slate-200">Database View &rarr;</button>
        </div>
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3"><Briefcase size={24} className="text-blue-500" /> New Partner Queue</h3>
          <div className="space-y-5">
            {vendorRegistrations.slice(0, 5).map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:bg-white hover:border-blue-100 transition-all group shadow-sm hover:shadow-md">
                <div>
                  <div className="font-black text-slate-900 group-hover:text-blue-600 transition text-base">{reg.companyName}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{reg.productName}</div>
                </div>
                <div className="text-[11px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">{reg.date}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('requests')} className="w-full mt-10 py-5 bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-dashed border-slate-200">Onboarding Manager &rarr;</button>
        </div>
      </div>
    </div>
  );

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
            {activeTab === 'logos' && renderLogos()}
            {activeTab === 'users' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-slate-50/30"><h3 className="text-3xl font-black text-slate-900">User Identity Directory</h3></div>
                  <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-10 py-6">User Account Profile</th><th className="px-10 py-6">Global Identity & Role</th><th className="px-10 py-6">Registration Date</th><th className="px-10 py-6">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{users.map(u => (<tr key={u.id} className="hover:bg-slate-50/50 group"><td className="px-10 py-7"><div className="font-black text-slate-900 text-lg">{u.name}</div><div className="text-xs font-bold text-slate-400 mt-0.5">{u.email}</div></td><td className="px-10 py-7"><span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : u.role === 'vendor' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{u.role}</span></td><td className="px-10 py-7 font-bold text-slate-400 text-sm tracking-tight">{u.joinedDate?.split('T')[0]}</td><td className="px-10 py-7"><button onClick={() => { if(window.confirm('Revoke access?')) deleteUser(u.id); }} className="p-3 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={22} /></button></td></tr>))}</tbody></table></div>
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
                <h3 className="text-3xl font-black text-slate-900 mb-10">Vertical Taxonomy</h3>
                <div className="flex gap-5 mb-12">
                   <input type="text" placeholder="e.g. AI Workflow Agents" className="flex-1 bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-700 text-base shadow-inner focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all border border-transparent focus:border-blue-100" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                   <button onClick={() => { if(newCategoryName) { addCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-slate-900 text-white px-10 rounded-2xl font-black text-base hover:bg-slate-800 transition-all shadow-xl">Define New</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all hover:bg-white shadow-sm hover:shadow-md">
                      <span className="font-black text-slate-700 text-sm uppercase tracking-wide">{cat}</span>
                      <button onClick={() => { if(window.confirm('Delete category?')) deleteCategory(cat); }} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-10 border-b border-gray-100 bg-slate-50/30"><h3 className="text-3xl font-black text-slate-900">Partner Application Manager</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-gray-100"><th className="px-10 py-6">Applicant Brand</th><th className="px-10 py-6">Connection Details</th><th className="px-10 py-6">Category Intent</th><th className="px-10 py-6">Pitch Message</th><th className="px-10 py-6">Submission</th></tr></thead>
                      <tbody className="divide-y divide-gray-100">
                        {vendorRegistrations.map(reg => (
                          <tr key={reg.id} className="hover:bg-slate-50/50">
                            <td className="px-10 py-7"><div className="font-black text-slate-900 text-lg">{reg.companyName}</div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{reg.name}</div></td>
                            <td className="px-10 py-7 text-xs font-bold text-slate-600"><div>{reg.email}</div><div className="mt-1 text-slate-400">{reg.mobile}</div></td>
                            <td className="px-10 py-7"><span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border border-indigo-100 shadow-sm">{reg.productName}</span></td>
                            <td className="px-10 py-7 max-w-sm text-[12px] font-medium text-slate-500 leading-relaxed italic">"{reg.message}"</td>
                            <td className="px-10 py-7 text-xs font-bold text-slate-400 tracking-tight">{reg.date}</td>
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

                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Technical Architecture Specifications</label>
                    <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: [...(prev.technicalSpecs || []), {label:'', value:''}]}))} className="text-[10px] font-black text-blue-600 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50 transition-colors uppercase tracking-widest"><Plus size={14} /> New Specification</button>
                  </div>
                  <div className="space-y-4">
                    {prodForm.technicalSpecs?.map((spec, i) => (
                      <div key={i} className="flex gap-4 items-center animate-fade-in group/spec">
                        <input type="text" placeholder="Parameter (e.g. Latency)" className="flex-1 bg-white p-4 rounded-xl border border-slate-100 font-black text-[11px] outline-none focus:ring-2 focus:ring-blue-50 transition-all uppercase tracking-widest shadow-sm placeholder-slate-300" value={spec.label} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].label = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <input type="text" placeholder="Value (e.g. <50ms)" className="flex-1 bg-white p-4 rounded-xl border border-slate-100 font-bold text-[12px] outline-none focus:ring-2 focus:ring-blue-50 transition-all shadow-sm placeholder-slate-300" value={spec.value} onChange={e => {const newS = [...prodForm.technicalSpecs!]; newS[i].value = e.target.value; setProdForm({...prodForm, technicalSpecs: newS})}} />
                        <button onClick={() => setProdForm(prev => ({...prev, technicalSpecs: prev.technicalSpecs!.filter((_,idx) => idx !== i)}))} className="p-3.5 bg-slate-100 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover/spec:opacity-100"><Trash2 size={18} /></button>
                      </div>
                    ))}
                    {(!prodForm.technicalSpecs || prodForm.technicalSpecs.length === 0) && <p className="text-center text-[11px] font-black text-slate-300 py-6 italic tracking-[0.2em] border-2 border-dashed border-slate-200 rounded-3xl">No technical parameters defined yet.</p>}
                  </div>
                </div>

                <ImageUploadZone label="Marketing Banner Visual" value={prodForm.image} onUpload={b => setProdForm({...prodForm, image: b})} onClear={() => setProdForm({...prodForm, image: ''})} aspectRatio="aspect-video" />
                <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-[0.98]">Commit Listing to Production</button>
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
                <ImageUploadZone label="Article Hero Banner" value={blogForm.image} onUpload={b => setBlogForm({...blogForm, image: b})} onClear={() => setBlogForm({...blogForm, image: ''})} aspectRatio="aspect-video" />
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest ml-1">Full Article Narrative</label>
                   <textarea rows={15} className="w-full bg-slate-50 p-8 rounded-[2.5rem] font-medium leading-relaxed outline-none border-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-base shadow-inner resize-none placeholder-slate-300" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Craft your technical or business narrative here..." />
                </div>
                <button onClick={handleSaveBlog} className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-[0.98]">Publish to Insights Hub</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;