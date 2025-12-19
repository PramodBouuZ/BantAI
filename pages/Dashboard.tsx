
import React, { useEffect, useState, useRef } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee, Star, ExternalLink, Globe, Phone, MapPin,
  Zap, Mail, Camera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { 
    products, leads, categories, siteConfig, users, vendorLogos, vendorRegistrations,
    addProduct, updateProduct, deleteProduct, 
    updateLeadStatus, assignLead, updateLeadRemarks, deleteLead, updateSiteConfig,
    addCategory, deleteCategory,
    addUser, deleteUser, addVendorLogo, deleteVendorLogo, addNotification
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'products' | 'categories' | 'users' | 'requests' | 'settings' | 'logos'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({ title: '', description: '', category: '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5 });
  const [prodFeaturesText, setProdFeaturesText] = useState('');
  
  const [configForm, setConfigForm] = useState(siteConfig);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newLogo, setNewLogo] = useState({ name: '', url: '' });

  // Update config form state when siteConfig changes
  useEffect(() => {
    if (siteConfig) setConfigForm(siteConfig);
  }, [siteConfig]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for image upload to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        addNotification('Only PNG, JPG, or JPEG files are allowed.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
        addNotification('Image processed successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportLeads = () => {
    const headers = ["ID", "Name", "Mobile", "Email", "Company", "Location", "Service", "Budget", "Need", "Authority", "Timing", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...leads.map(l => [l.id, l.name, l.mobile, l.email, l.company, l.location, l.service, l.budget, l.requirement, l.authority || '', l.timing || '', l.status, l.date].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bantconfirm_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProduct = async () => {
      const features = prodFeaturesText.split(',').map(f => f.trim()).filter(f => f);
      if (!prodForm.title || !prodForm.priceRange) return;

      const pData: Product = {
          id: editingProduct ? editingProduct.id : Date.now().toString(),
          title: prodForm.title || '',
          description: prodForm.description || '',
          category: prodForm.category || categories[0] || 'Software',
          priceRange: prodForm.priceRange || '',
          features: features,
          icon: prodForm.icon || 'globe',
          rating: Number(prodForm.rating) || 5,
          image: prodForm.image || ''
      };

      if (editingProduct) await updateProduct(editingProduct.id, pData);
      else await addProduct(pData);

      setIsModalOpen(false);
      setEditingProduct(null);
  };

  const handleLogoUpload = async () => {
    if (!newLogo.name) {
      addNotification('Please enter the company name.', 'warning');
      return;
    }
    if (!newLogo.url) {
      addNotification('Please upload a logo image.', 'warning');
      return;
    }
    await addVendorLogo({ id: Date.now().toString(), name: newLogo.name, logoUrl: newLogo.url });
    setNewLogo({ name: '', url: '' });
  };

  const renderSidebar = () => (
      <div className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 lg:relative lg:translate-x-0`}>
          <div className="p-6 font-bold text-2xl flex items-center justify-between border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Layout className="text-blue-500" /> Admin Panel
              </span>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-6 space-y-1 px-4">
              {[
                  { id: 'overview', icon: Layout, label: 'Overview' },
                  { id: 'leads', icon: FileText, label: 'Manage Leads' },
                  { id: 'requests', icon: MessageSquare, label: 'Vendor Requests' },
                  { id: 'users', icon: Users, label: 'Users' },
                  { id: 'logos', icon: ImageIcon, label: 'Vendor Logos' },
                  { id: 'products', icon: ShoppingBag, label: 'Products' },
                  { id: 'categories', icon: Tag, label: 'Categories' },
                  { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition font-medium ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                      <item.icon size={20} className="mr-3" />
                      {item.label}
                  </button>
              ))}
          </nav>
      </div>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Users size={24} /></div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Users</div>
          <div className="text-4xl font-black text-slate-900 mt-1">{users.length || 150}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600"><FileText size={24} /></div>
            <span className="text-xs font-bold text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">Pending</span>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Leads</div>
          <div className="text-4xl font-black text-slate-900 mt-1">{leads.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><ShoppingBag size={24} /></div>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Live Products</div>
          <div className="text-4xl font-black text-slate-900 mt-1">{products.length}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-600"><IndianRupee size={24} /></div>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Revenue Earned</div>
          <div className="text-4xl font-black text-slate-900 mt-1">₹4.2L</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap className="text-yellow-500" /> Recent Enquiries
          </h3>
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">{lead.name}</div>
                  <div className="text-xs text-slate-500">{lead.service} • {lead.date}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  lead.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{lead.status}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('leads')} className="w-full mt-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition">View All Leads</button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="text-blue-500" /> New Vendor Registrations
          </h3>
          <div className="space-y-4">
            {vendorRegistrations.slice(0, 5).map(reg => (
              <div key={reg.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">{reg.companyName}</div>
                  <div className="text-xs text-slate-500">{reg.productName} • {reg.location}</div>
                </div>
                <div className="text-xs text-slate-400">{reg.date}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('requests')} className="w-full mt-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition">View All Requests</button>
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-2xl font-black text-slate-900">Enquiry Management</h3>
          <button onClick={handleExportLeads} className="flex items-center text-sm text-green-700 bg-green-100 hover:bg-green-200 px-5 py-2.5 rounded-xl transition font-bold">
              <Download size={18} className="mr-2" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-[0.1em]">
                <th className="px-8 py-5">User & Company</th>
                <th className="px-8 py-5">BANT Profile</th>
                <th className="px-8 py-5">Requirement</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 text-base">{lead.name}</div>
                      <div className="text-blue-600 text-xs font-bold">{lead.company}</div>
                      <div className="text-slate-400 text-xs mt-1">{lead.email} | {lead.mobile}</div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-2 font-bold uppercase">
                        <MapPin size={10} /> {lead.location}
                      </div>
                  </td>
                  <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2"><span className="w-16 text-[10px] font-black uppercase text-slate-400">Budget:</span> <span className="text-green-600 font-bold">{lead.budget}</span></div>
                        <div className="flex items-center gap-2"><span className="w-16 text-[10px] font-black uppercase text-slate-400">Timing:</span> <span className="text-blue-600 font-bold">{lead.timing || 'N/A'}</span></div>
                        <div className="flex items-center gap-2"><span className="w-16 text-[10px] font-black uppercase text-slate-400">Authority:</span> <span className="text-indigo-600 font-bold">{lead.authority || 'N/A'}</span></div>
                      </div>
                  </td>
                  <td className="px-8 py-6">
                      <div className="font-bold text-slate-800">{lead.service}</div>
                      <div className="text-slate-500 text-xs mt-1 line-clamp-2 max-w-xs leading-relaxed italic">"{lead.requirement}"</div>
                      <div className="text-slate-400 text-[10px] mt-2 font-bold uppercase">{lead.date}</div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase outline-none border-2 transition ${
                        lead.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-100' :
                        lead.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        lead.status === 'Sold' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Sold">Sold</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => deleteLead(lead.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                      <Trash2 size={18} />
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
        <h3 className="text-2xl font-black text-slate-900">Marketplace Products</h3>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setProdForm({ title: '', description: '', priceRange: '', features: [], category: categories[0], icon: 'globe', rating: 5 }); 
            setProdFeaturesText('');
            setIsModalOpen(true); 
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-200 transition"
        >
          <Plus size={20} className="mr-2" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="h-40 bg-slate-100 relative overflow-hidden">
               {product.image ? (
                 <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
               )}
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                 <Star size={12} className="text-yellow-500 fill-current" />
                 <span className="text-[10px] font-bold">{product.rating}</span>
               </div>
            </div>
            <div className="p-6">
              <div className="text-[10px] font-black uppercase text-blue-500 mb-1">{product.category}</div>
              <h4 className="font-bold text-slate-900 mb-2">{product.title}</h4>
              <p className="text-slate-400 text-xs line-clamp-2 mb-4">{product.description}</p>
              <div className="text-lg font-black text-slate-900 mb-6">{product.priceRange}</div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingProduct(product);
                    setProdForm(product);
                    setProdFeaturesText(product.features.join(', '));
                    setIsModalOpen(true);
                  }}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  Edit Details
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="max-w-xl animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Manage Categories</h3>
        <div className="flex gap-3 mb-8">
          <input 
            type="text" 
            placeholder="New Category Name..." 
            className="flex-1 bg-slate-50 border-none outline-none px-5 py-3 rounded-xl font-medium"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button 
            onClick={() => { if(newCategoryName) addCategory(newCategoryName); setNewCategoryName(''); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group transition-colors hover:bg-slate-100">
               <span className="font-bold text-slate-700">{cat}</span>
               <button onClick={() => deleteCategory(cat)} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition">
                 <Trash2 size={18} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLogos = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm max-w-2xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Partner Logo Management</h3>
        <p className="text-sm text-slate-500 mb-8 font-medium">Add logos of brands you represent in the marketplace ticker.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">1. Company Name</label>
            <input 
              type="text" 
              placeholder="e.g. Tata Teleservices" 
              className="w-full bg-slate-50 border-none outline-none px-5 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
              value={newLogo.name}
              onChange={(e) => setNewLogo({...newLogo, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">2. Logo Upload (PNG/JPG)</label>
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                newLogo.url ? 'border-green-400 bg-green-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {newLogo.url ? (
                <div className="text-center animate-fade-in">
                  <img src={newLogo.url} alt="Preview" className="h-24 w-auto object-contain mx-auto mb-4 drop-shadow-md" />
                  <p className="text-xs font-black text-green-600 uppercase flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Ready to Save
                  </p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setNewLogo({...newLogo, url: ''}); }}
                    className="mt-4 text-[10px] font-black uppercase text-red-500 hover:underline"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-400 mx-auto mb-4 inline-block">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-600 mb-1">Click to select image file</p>
                  <p className="text-xs text-slate-400">Supported: PNG, JPG, JPEG</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/png,image/jpeg,image/jpg" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, (base64) => setNewLogo({...newLogo, url: base64}))} 
              />
            </div>
          </div>

          <button 
            onClick={handleLogoUpload}
            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50"
            disabled={!newLogo.name || !newLogo.url}
          >
            Add Partner Logo
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Active Partner Logos ({vendorLogos.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {vendorLogos.map(logo => (
            <div key={logo.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center relative group shadow-sm hover:shadow-xl transition-all duration-300">
              <img src={logo.logoUrl} alt={logo.name} className="h-10 w-auto object-contain mb-3 grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest leading-tight">{logo.name}</div>
              <button onClick={() => deleteVendorLogo(logo.id)} className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-2xl font-black text-slate-900">Vendor Onboarding Requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-widest">
                <th className="px-8 py-5">Partner</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5">Product/Service</th>
                <th className="px-8 py-5">Message/Note</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {vendorRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900">{reg.companyName}</div>
                    <div className="text-slate-400 text-xs">{reg.name}</div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-2 font-bold uppercase">
                      <MapPin size={10} /> {reg.location}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-slate-300" /> {reg.email}</div>
                    <div className="flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {reg.mobile}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg inline-block font-bold text-xs uppercase">{reg.productName}</div>
                  </td>
                  <td className="px-8 py-6 font-medium text-slate-600">
                    <div className="text-xs leading-relaxed max-w-xs italic text-slate-500">"{reg.message}"</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-2">{reg.date}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">NEW REQUEST</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Site Branding</h3>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Site Name</label>
            <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Admin Notification Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-3.5 text-slate-300" />
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border-none outline-none" 
                value={configForm.adminNotificationEmail || ''} 
                onChange={e => setConfigForm({...configForm, adminNotificationEmail: e.target.value})} 
                placeholder="info.bouuz@gmail.com"
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase">Admin gets instant email alerts for new enquiries and vendor signups.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Logo URL</label>
              <div className="relative">
                <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.logoUrl || ''} onChange={e => setConfigForm({...configForm, logoUrl: e.target.value})} />
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e: any) => handleImageUpload(e, (base64) => setConfigForm({...configForm, logoUrl: base64}));
                    input.click();
                  }}
                  className="absolute right-2 top-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Favicon URL</label>
              <div className="relative">
                <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.faviconUrl || ''} onChange={e => setConfigForm({...configForm, faviconUrl: e.target.value})} />
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/x-icon,image/png,image/jpeg';
                    input.onchange = (e: any) => handleImageUpload(e, (base64) => setConfigForm({...configForm, faviconUrl: base64}));
                    input.click();
                  }}
                  className="absolute right-2 top-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                >
                  <Camera size={20} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">WhatsApp Number (e.g. +91...)</label>
            <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.whatsappNumber || ''} onChange={e => setConfigForm({...configForm, whatsappNumber: e.target.value})} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Social Media & Hero</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Twitter Profile</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.socialLinks.twitter || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, twitter: e.target.value}})} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">LinkedIn Profile</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.socialLinks.linkedin || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, linkedin: e.target.value}})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Facebook Profile</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.socialLinks.facebook || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, facebook: e.target.value}})} />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2">Instagram Profile</label>
              <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.socialLinks.instagram || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, instagram: e.target.value}})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-400 mb-2">Banner Title</label>
            <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border-none outline-none" value={configForm.bannerTitle || ''} onChange={e => setConfigForm({...configForm, bannerTitle: e.target.value})} />
          </div>
          <button 
            onClick={() => updateSiteConfig(configForm)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl transition transform active:scale-95"
          >
            Update Site Config
          </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">User Directory</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-widest">
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Joined Date</th>
              <th className="px-8 py-5">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50">
                <td className="px-8 py-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 uppercase">
                    {u.name.substring(0, 1)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-slate-400 text-xs">{u.email}</div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>{u.role}</span>
                </td>
                <td className="px-8 py-6 text-slate-500">{u.joinedDate.split('T')[0]}</td>
                <td className="px-8 py-6">
                  <button onClick={() => deleteUser(u.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // User Dashboard for non-admins
  if (currentUser?.role !== 'admin') {
      const myLeads = leads.filter(l => l.email === currentUser?.email);
      return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
           <div className="bg-white border-b border-gray-200 py-12 px-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900">Welcome, {currentUser?.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track your enquiries and vendor responses here.</p>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100 text-center px-8">
                       <div className="text-2xl font-black text-blue-600">{myLeads.length}</div>
                       <div className="text-[10px] font-black uppercase text-blue-400 tracking-wider">My Enquiries</div>
                    </div>
                  </div>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-4 py-12">
               <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="text-xl font-bold text-slate-800">My Posted Enquiries</h3>
                       <Link to="/products" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm">Post New Enquiry</Link>
                   </div>
                   <div className="p-8">
                     {myLeads.length > 0 ? (
                       <div className="space-y-4">
                         {myLeads.map(l => (
                           <div key={l.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100 hover:border-blue-200 transition">
                             <div>
                               <div className="font-black text-slate-900 text-lg mb-1">{l.service}</div>
                               <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                 <span>{l.date}</span>
                                 <span>{l.location}</span>
                                 <span className="text-green-600">{l.budget}</span>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
                                  l.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                  l.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {l.status}
                                </span>
                             </div>
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="text-center py-20">
                          <div className="text-6xl mb-4">📭</div>
                          <p className="text-slate-400 font-bold">You haven't posted any enquiries yet.</p>
                          <Link to="/products" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Browse Services to Start</Link>
                       </div>
                     )}
                   </div>
               </div>
           </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {renderSidebar()}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shrink-0">
             <div className="flex items-center">
                 <button className="lg:hidden mr-4 p-2 bg-slate-50 rounded-lg" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">BC</div>
                   <h1 className="font-black text-xl text-slate-900 uppercase tracking-widest">{activeTab}</h1>
                 </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-black text-slate-900 uppercase">Super Admin</div>
                  <div className="text-[10px] font-bold text-slate-400">{currentUser.email}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">A</div>
             </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 bg-slate-50/30">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'requests' && renderRequests()}
            {activeTab === 'logos' && renderLogos()}
            {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-2xl font-black text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Service'}</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={24} /></button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-black text-slate-400 uppercase mb-2">Title</label>
                     <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" value={prodForm.title} onChange={e => setProdForm({...prodForm, title: e.target.value})} />
                   </div>
                   <div>
                     <label className="block text-xs font-black text-slate-400 uppercase mb-2">Price Range</label>
                     <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" value={prodForm.priceRange} onChange={e => setProdForm({...prodForm, priceRange: e.target.value})} />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase mb-2">Description</label>
                   <textarea rows={3} className="w-full bg-slate-50 p-4 rounded-2xl outline-none" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-black text-slate-400 uppercase mb-2">Category</label>
                     <select className="w-full bg-slate-50 p-4 rounded-2xl outline-none appearance-none" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-black text-slate-400 uppercase mb-2">Rating (1-5)</label>
                     <input type="number" min="1" max="5" step="0.1" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" value={prodForm.rating} onChange={e => setProdForm({...prodForm, rating: Number(e.target.value)})} />
                   </div>
                </div>
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase mb-2">Features (comma separated)</label>
                   <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl outline-none" placeholder="Feature 1, Feature 2..." value={prodFeaturesText} onChange={e => setProdFeaturesText(e.target.value)} />
                </div>
                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase mb-2">Image</label>
                   <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                        {prodForm.image ? <img src={prodForm.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="prod-upload"
                        onChange={(e) => handleImageUpload(e, (base64) => setProdForm({...prodForm, image: base64}))} 
                      />
                      <label htmlFor="prod-upload" className="cursor-pointer bg-slate-50 text-slate-500 px-6 py-4 rounded-2xl font-bold border-2 border-dashed border-slate-200 hover:bg-slate-100 transition flex items-center gap-2">
                         <Camera size={20} /> Upload Service Image
                      </label>
                   </div>
                </div>
                <button onClick={handleSaveProduct} className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 transform active:scale-95 transition">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
