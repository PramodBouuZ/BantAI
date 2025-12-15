import React, { useEffect, useState } from 'react';
import { UserRole, Product, Lead, User, VendorAsset } from '../types';
import { useData } from '../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Download, Search, Filter, Star, CheckCircle2, Server, Phone, Wifi, Database, Shield, Globe, Zap, IndianRupee,
  Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, UserPlus, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare
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
    addUser, deleteUser, addVendorLogo, deleteVendorLogo
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'products' | 'categories' | 'users' | 'requests' | 'settings' | 'logos'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  // --- ADMIN: Product Form State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({ title: '', description: '', category: '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5 });
  const [prodFeaturesText, setProdFeaturesText] = useState('');

  // --- ADMIN: Config Form State ---
  const [configForm, setConfigForm] = useState(siteConfig);

  // --- ADMIN: Assignment/Remark State ---
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [remarkingId, setRemarkingId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');

  // --- ADMIN: Vendor Logo State ---
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newLogoName, setNewLogoName] = useState('');

  // --- ADMIN: Category State ---
  const [newCategoryName, setNewCategoryName] = useState('');

  // --- HELPER FUNCTIONS ---
  const handleExportLeads = () => {
    const headers = ["ID", "Name", "Mobile", "Email", "Company", "Location", "Service", "Budget", "Status", "Assigned To", "Remarks", "Date"];
    const csvContent = [
      headers.join(","),
      ...leads.map(l => [l.id, l.name, l.mobile, l.email, l.company, l.location, l.service, l.budget, l.status, l.assignedTo || 'Unassigned', l.remarks || '', l.date].map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bantconfirm_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdForm(product);
      setProdFeaturesText(product.features.join(', '));
    } else {
      setEditingProduct(null);
      setProdForm({ title: '', description: '', category: categories[0] || '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5 });
      setProdFeaturesText('');
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
      const features = prodFeaturesText.split(',').map(f => f.trim()).filter(f => f);
      
      if (!prodForm.title || !prodForm.priceRange) {
        alert("Title and Price Range are required.");
        return;
      }

      const newProd: Product = {
          id: editingProduct ? editingProduct.id : Date.now().toString(),
          title: prodForm.title || 'New Product',
          description: prodForm.description || '',
          category: prodForm.category || categories[0] || 'Software',
          priceRange: prodForm.priceRange || 'Contact for Price',
          features: features,
          icon: prodForm.icon || 'globe',
          rating: Number(prodForm.rating) || 5,
          image: prodForm.image || ''
      };

      if (editingProduct) updateProduct(editingProduct.id, newProd);
      else addProduct(newProd);

      setIsProductModalOpen(false);
      setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl' | 'bannerImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setConfigForm(prev => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVendorLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ADMIN RENDERERS ---

  const renderSidebar = () => (
      <div className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 z-50 lg:relative lg:translate-x-0`}>
          <div className="p-6 font-bold text-2xl flex items-center justify-between">
              <span>Admin Panel</span>
              <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
          </div>
          <nav className="mt-6 space-y-2 px-4">
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
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                      <item.icon size={20} className="mr-3" />
                      {item.label}
                  </button>
              ))}
          </nav>
      </div>
  );

  const renderAdminLeads = () => (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-800">All Enquiries</h3>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100" title="Updates will appear here instantly">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                Real-time Active
              </span>
            </div>
            <button onClick={handleExportLeads} className="flex items-center text-sm text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg transition font-bold">
                <Download size={16} className="mr-2" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Requirement</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-slate-500 text-xs">{lead.mobile}</div>
                        <div className="text-slate-500 text-xs">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                        <div className="font-medium">{lead.service}</div>
                        <div className="text-slate-500 text-xs">{lead.budget}</div>
                    </td>
                    {/* Assigned To Column */}
                    <td className="px-6 py-4">
                        {assigningId === lead.id ? (
                          <div className="flex items-center space-x-2">
                             <input type="text" className="w-24 p-1 border rounded text-xs" placeholder="Vendor" value={inputVal} onChange={(e) => setInputVal(e.target.value)} autoFocus />
                             <button onClick={() => { assignLead(lead.id, inputVal); setAssigningId(null); setInputVal(''); }} className="text-green-600"><CheckCircle2 size={16} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                             <span className={`text-xs font-medium ${lead.assignedTo ? 'text-blue-600' : 'text-slate-400'}`}>{lead.assignedTo || 'Unassigned'}</span>
                             <button onClick={() => { setAssigningId(lead.id); setInputVal(lead.assignedTo || ''); }} className="text-slate-400 hover:text-blue-600 ml-2"><Edit2 size={12} /></button>
                          </div>
                        )}
                    </td>
                    {/* Remarks Column */}
                    <td className="px-6 py-4">
                        {remarkingId === lead.id ? (
                          <div className="flex items-center space-x-2">
                             <input type="text" className="w-24 p-1 border rounded text-xs" placeholder="Note..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} autoFocus />
                             <button onClick={() => { updateLeadRemarks(lead.id, inputVal); setRemarkingId(null); setInputVal(''); }} className="text-green-600"><CheckCircle2 size={16} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                             <span className="text-xs text-slate-500 italic truncate max-w-[100px]">{lead.remarks || 'No remarks'}</span>
                             <button onClick={() => { setRemarkingId(lead.id); setInputVal(lead.remarks || ''); }} className="text-slate-400 hover:text-blue-600 ml-2 opacity-0 group-hover:opacity-100"><Edit2 size={12} /></button>
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className={`px-2 py-1 rounded text-xs font-bold uppercase border-none outline-none cursor-pointer ${
                          lead.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          lead.status === 'Sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Sold">Sold</option>
                          <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteLead(lead.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
  );

  const renderVendorRequests = () => (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Vendor Registration Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-gray-100 text-sm font-bold text-slate-500">
                    <th className="pb-4">Vendor</th>
                    <th className="pb-4">Contact Info</th>
                    <th className="pb-4">Product/Service</th>
                    <th className="pb-4">Message</th>
                    <th className="pb-4">Date</th>
                 </tr>
               </thead>
               <tbody>
                  {vendorRegistrations.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-slate-500">No pending vendor requests.</td></tr>
                  ) : vendorRegistrations.map(reg => (
                      <tr key={reg.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50">
                          <td className="py-4">
                              <div className="font-bold">{reg.companyName}</div>
                              <div className="text-xs text-slate-500">{reg.name}</div>
                              <div className="text-xs text-slate-400">{reg.location}</div>
                          </td>
                          <td className="py-4">
                              <div className="text-sm">{reg.email}</div>
                              <div className="text-xs text-slate-500">{reg.mobile}</div>
                          </td>
                          <td className="py-4 font-medium text-blue-600">{reg.productName}</td>
                          <td className="py-4 text-sm text-slate-500 max-w-xs truncate" title={reg.message}>{reg.message}</td>
                          <td className="py-4 text-sm text-slate-400">{reg.date}</td>
                      </tr>
                  ))}
               </tbody>
            </table>
          </div>
      </div>
  );

  const renderAdminUsers = () => (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-gray-100 text-sm font-bold text-slate-500">
                    <th className="pb-4">Name</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Company</th>
                    <th className="pb-4">Joined</th>
                    <th className="pb-4">Action</th>
                 </tr>
               </thead>
               <tbody>
                  {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50">
                          <td className="py-4">
                              <div className="font-bold">{u.name}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'vendor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                          <td className="py-4 text-sm">{u.company || '-'}</td>
                          <td className="py-4 text-sm text-slate-500">{u.joinedDate}</td>
                          <td className="py-4">
                             {u.role !== 'admin' && <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
                          </td>
                      </tr>
                  ))}
               </tbody>
            </table>
          </div>
      </div>
  );

  const renderAdminLogos = () => (
      <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-800">Manage Vendor Logos</h2>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
              <h3 className="font-bold mb-4">Add New Vendor Logo</h3>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                 <input 
                   className="flex-grow w-full border rounded-xl p-3" 
                   placeholder="Vendor Name" 
                   value={newLogoName} 
                   onChange={e => setNewLogoName(e.target.value)} 
                 />
                 
                 <div className="flex-grow w-full">
                    <label className="flex items-center justify-center w-full border border-dashed border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition relative">
                        {newLogoUrl ? (
                            <img src={newLogoUrl} alt="Preview" className="h-6 w-auto object-contain absolute left-4" />
                        ) : <Upload size={20} className="mr-2 text-slate-400" />}
                        <span className={`text-sm ${newLogoUrl ? 'text-blue-600 pl-8' : 'text-slate-500'}`}>
                            {newLogoUrl ? 'Change Logo' : 'Upload Logo (PNG/JPG)'}
                        </span>
                        <input type="file" accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={handleVendorLogoUpload} />
                    </label>
                 </div>

                 <button 
                   onClick={() => { 
                     if(newLogoName && newLogoUrl) { 
                       addVendorLogo({ id: Date.now().toString(), name: newLogoName, logoUrl: newLogoUrl }); 
                       setNewLogoName(''); 
                       setNewLogoUrl(''); 
                     }
                   }} 
                   className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto hover:bg-blue-700 transition"
                 >
                   Add
                 </button>
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {vendorLogos.map(logo => (
                  <div key={logo.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group flex flex-col items-center justify-center h-32">
                      <button onClick={() => deleteVendorLogo(logo.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={14}/></button>
                      <img src={logo.logoUrl} alt={logo.name} className="h-12 max-w-full object-contain mb-2" />
                      <p className="text-center text-xs font-bold text-slate-700">{logo.name}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderAdminCategories = () => (
    <div className="max-w-4xl">
       <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Categories</h2>
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
           <h3 className="font-bold mb-4">Add New Category</h3>
           <div className="flex gap-4">
             <input 
               value={newCategoryName}
               onChange={(e) => setNewCategoryName(e.target.value)}
               className="flex-grow border rounded-xl p-3" 
               placeholder="Category Name (e.g., Software, Hardware)" 
             />
             <button 
                onClick={()=>{ 
                  if(newCategoryName.trim()) { 
                    addCategory(newCategoryName.trim()); 
                    setNewCategoryName(''); 
                  }
                }} 
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Add Category
             </button>
           </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {categories.map(c => (
           <div key={c} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
             <span className="font-bold text-slate-700">{c}</span>
             <button onClick={() => deleteCategory(c)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition">
               <Trash2 size={16} />
             </button>
           </div>
         ))}
       </div>
    </div>
  );

  const renderAdminProducts = () => (
    <div>
       <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Products & Services</h2>
          <button onClick={() => openProductModal()} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center shadow-lg transform hover:-translate-y-1">
            <Plus size={20} className="mr-2" /> Add Product
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                   {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.title}/> : <div className="flex items-center justify-center h-full"><ShoppingBag className="text-slate-300" size={40} /></div>}
                   <div className="absolute top-2 right-2 flex space-x-1">
                      <button onClick={() => openProductModal(p)} className="bg-white/90 p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-white shadow-sm transition"><Edit2 size={14} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="bg-white/90 p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-white shadow-sm transition"><Trash2 size={14} /></button>
                   </div>
                   <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">{p.category}</div>
                </div>
                <div className="p-4">
                   <h3 className="font-bold text-slate-900 mb-1 truncate">{p.title}</h3>
                   <p className="text-sm text-slate-500 mb-3 font-medium">{p.priceRange}</p>
                   <div className="flex flex-wrap gap-1">
                     {p.features.slice(0, 2).map((f, i) => <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-gray-100">{f}</span>)}
                   </div>
                </div>
            </div>
          ))}
       </div>

       {isProductModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-2xl text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="md:col-span-2">
                          <label className="block text-sm font-bold mb-2">Product Image (PNG/JPG)</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                              {prodForm.image ? (
                                <img src={prodForm.image} alt="Preview" className="h-32 object-contain mb-2" />
                              ) : <ImageIcon className="text-slate-300 mb-2" size={32} />}
                              <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition">
                                 Upload Image
                                 <input type="file" accept="image/*" className="hidden" onChange={handleProductImageUpload} />
                              </label>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold mb-2">Product Name</label>
                          <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. CRM Software" value={prodForm.title} onChange={e=>setProdForm({...prodForm, title: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Category</label>
                          <select className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white" value={prodForm.category} onChange={e=>setProdForm({...prodForm, category: e.target.value})}>
                             {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Price Range</label>
                          <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. ₹5,000/month" value={prodForm.priceRange} onChange={e=>setProdForm({...prodForm, priceRange: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2">Rating (1-5)</label>
                          <input type="number" max="5" min="1" step="0.1" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" value={prodForm.rating} onChange={e=>setProdForm({...prodForm, rating: Number(e.target.value)})} />
                      </div>
                      <div className="md:col-span-2">
                          <label className="block text-sm font-bold mb-2">Description</label>
                          <textarea rows={3} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Product details..." value={prodForm.description} onChange={e=>setProdForm({...prodForm, description: e.target.value})} />
                      </div>
                      <div className="md:col-span-2">
                          <label className="block text-sm font-bold mb-2">Features (Comma separated)</label>
                          <textarea rows={2} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Cloud based, 24/7 Support, Free Trial..." value={prodFeaturesText} onChange={e=>setProdFeaturesText(e.target.value)} />
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button onClick={()=>setIsProductModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition">Cancel</button>
                      <button onClick={handleSaveProduct} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Save Product</button>
                  </div>
              </div>
          </div>
       )}
    </div>
  );

  const renderSettingsTab = () => (
     <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Portal Configuration</h2>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            {/* Website Name */}
            <div>
                <label className="block text-sm font-bold mb-2">Website Name</label>
                <input type="text" className="w-full border rounded-xl p-3" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
            </div>

            {/* Logo Upload */}
            <div>
                <label className="block text-sm font-bold mb-2">Logo</label>
                <div className="flex items-center space-x-4">
                    {configForm.logoUrl && (
                        <div className="p-2 border rounded-lg bg-gray-50">
                            <img src={configForm.logoUrl} alt="Logo Preview" className="h-10 w-auto object-contain" />
                        </div>
                    )}
                    <label className="flex-grow">
                         <div className="w-full border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-500 transition-colors">
                            <Upload size={20} className="mr-2" />
                            <span className="text-sm">Upload Logo (PNG/JPG)</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoUrl')} />
                         </div>
                    </label>
                </div>
            </div>

            {/* Favicon Upload */}
            <div>
                <label className="block text-sm font-bold mb-2">Favicon</label>
                 <div className="flex items-center space-x-4">
                    {configForm.faviconUrl && (
                        <div className="p-2 border rounded-lg bg-gray-50">
                            <img src={configForm.faviconUrl} alt="Favicon Preview" className="h-8 w-8 object-contain" />
                        </div>
                    )}
                    <label className="flex-grow">
                         <div className="w-full border border-dashed border-gray-300 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-500 transition-colors">
                            <Upload size={20} className="mr-2" />
                            <span className="text-sm">Upload Favicon (ICO/PNG)</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'faviconUrl')} />
                         </div>
                    </label>
                </div>
            </div>

            {/* WhatsApp */}
            <div>
                  <label className="block text-sm font-bold mb-2">WhatsApp Notification Number</label>
                  <input type="text" className="w-full border rounded-xl p-3" value={configForm.whatsappNumber || ''} onChange={e => setConfigForm({...configForm, whatsappNumber: e.target.value})} placeholder="+91..." />
            </div>

            {/* Social Media */}
            <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold mb-4">Social Media Links</h4>
                <div className="grid grid-cols-1 gap-4">
                     <div className="flex items-center">
                        <Twitter className="text-blue-400 mr-3" size={20} />
                        <input type="text" className="flex-grow border rounded-xl p-3" placeholder="Twitter URL" value={configForm.socialLinks.twitter || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, twitter: e.target.value}})} />
                     </div>
                     <div className="flex items-center">
                        <Linkedin className="text-blue-700 mr-3" size={20} />
                        <input type="text" className="flex-grow border rounded-xl p-3" placeholder="LinkedIn URL" value={configForm.socialLinks.linkedin || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, linkedin: e.target.value}})} />
                     </div>
                     <div className="flex items-center">
                        <Facebook className="text-blue-600 mr-3" size={20} />
                        <input type="text" className="flex-grow border rounded-xl p-3" placeholder="Facebook URL" value={configForm.socialLinks.facebook || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, facebook: e.target.value}})} />
                     </div>
                     <div className="flex items-center">
                        <Instagram className="text-pink-600 mr-3" size={20} />
                        <input type="text" className="flex-grow border rounded-xl p-3" placeholder="Instagram URL" value={configForm.socialLinks.instagram || ''} onChange={e => setConfigForm({...configForm, socialLinks: {...configForm.socialLinks, instagram: e.target.value}})} />
                     </div>
                </div>
            </div>

            <div className="pt-6">
                <button onClick={() => updateSiteConfig(configForm)} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 flex items-center w-full justify-center shadow-lg transform hover:-translate-y-1 transition">
                    <Save size={20} className="mr-2" /> Save & Publish
                </button>
            </div>
        </div>
    </div>
  );

  // --- USER DASHBOARD RENDER ---

  if (currentUser?.role !== 'admin') {
      const myLeads = leads.filter(l => l.email === currentUser?.email);
      const soldLeads = myLeads.filter(l => l.status === 'Sold').length;
      // Mock earning logic: 1000 INR per sold lead for vendors, or simplified view for users
      const totalEarnings = currentUser?.role === 'vendor' ? soldLeads * 1000 : 0; 

      return (
        <div className="min-h-screen bg-slate-50 pb-20">
           <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentUser?.name}</h1>
                  <p className="text-slate-500 mt-2">Track your enquiries and account status here.</p>
              </div>
           </div>

           <div className="max-w-7xl mx-auto px-4 py-12">
               {/* Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                       <div className="flex items-center justify-between mb-4">
                           <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><FileText size={24} /></div>
                           <span className="text-sm font-bold text-slate-400 uppercase">Total Enquiries</span>
                       </div>
                       <div className="text-4xl font-bold text-slate-900">{myLeads.length}</div>
                   </div>
                   <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                       <div className="flex items-center justify-between mb-4">
                           <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600"><CheckCircle2 size={24} /></div>
                           <span className="text-sm font-bold text-slate-400 uppercase">Verified / Sold</span>
                       </div>
                       <div className="text-4xl font-bold text-slate-900">{soldLeads}</div>
                   </div>
                   {currentUser?.role === 'vendor' && (
                     <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                         <div className="flex items-center justify-between mb-4">
                             <div className="bg-green-100 p-3 rounded-xl text-green-600"><IndianRupee size={24} /></div>
                             <span className="text-sm font-bold text-slate-400 uppercase">Total Earnings</span>
                         </div>
                         <div className="text-4xl font-bold text-slate-900">₹{totalEarnings}</div>
                     </div>
                   )}
               </div>

               {/* My Enquiries Table */}
               <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-100">
                       <h3 className="text-xl font-bold text-slate-800">My Posted Enquiries</h3>
                   </div>
                   {myLeads.length > 0 ? (
                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                               <thead>
                                   <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                                       <th className="px-6 py-4">Date</th>
                                       <th className="px-6 py-4">Requirement</th>
                                       <th className="px-6 py-4">Admin Remarks</th>
                                       <th className="px-6 py-4">Status</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100 text-sm">
                                   {myLeads.map(lead => (
                                       <tr key={lead.id} className="hover:bg-slate-50">
                                           <td className="px-6 py-4 font-medium text-slate-500">{lead.date}</td>
                                           <td className="px-6 py-4">
                                               <div className="font-bold text-slate-900">{lead.service}</div>
                                               <div className="text-xs text-slate-500 truncate max-w-xs">{lead.requirement}</div>
                                           </td>
                                           <td className="px-6 py-4 text-slate-500 italic">{lead.remarks || '-'}</td>
                                           <td className="px-6 py-4">
                                               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                   lead.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                                   lead.status === 'Sold' ? 'bg-blue-100 text-blue-700' :
                                                   lead.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                   'bg-yellow-100 text-yellow-700'
                                               }`}>
                                                   {lead.status}
                                               </span>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   ) : (
                       <div className="p-12 text-center">
                           <p className="text-slate-400 mb-6">You haven't posted any enquiries yet.</p>
                           <Link to="/enquiry" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">Post Now</Link>
                       </div>
                   )}
               </div>
           </div>
        </div>
      );
  }

  // --- ADMIN DASHBOARD RENDER ---

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {renderSidebar()}
      
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
             <div className="flex items-center">
                 <button className="lg:hidden mr-4" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <h1 className="font-bold text-xl text-slate-800 uppercase tracking-wider">{activeTab}</h1>
             </div>
             <div className="flex items-center space-x-4">
                 <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">A</div>
             </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-slate-500 text-sm mb-1">Total Users</div>
                        <div className="text-3xl font-bold">{users.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-slate-500 text-sm mb-1">Total Leads</div>
                        <div className="text-3xl font-bold">{leads.length}</div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-slate-500 text-sm mb-1">Pending Vendors</div>
                        <div className="text-3xl font-bold">{vendorRegistrations.length}</div>
                    </div>
                    <div className="col-span-full mt-6">
                        {renderAdminLeads()}
                    </div>
                </div>
            )}
            {activeTab === 'leads' && renderAdminLeads()}
            {activeTab === 'requests' && renderVendorRequests()}
            {activeTab === 'users' && renderAdminUsers()}
            {activeTab === 'logos' && renderAdminLogos()}
            {activeTab === 'products' && renderAdminProducts()}
            {activeTab === 'categories' && renderAdminCategories()}
            {activeTab === 'settings' && renderSettingsTab()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;