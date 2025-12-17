import React, { useEffect, useState } from 'react';
import { Product, Lead, User, VendorAsset, VendorRegistration } from '../types';
import { useData } from '../context/DataContext';
import { 
  Download, Plus, Trash2, Edit2, Save, X, Settings, Layout, Users, ShoppingBag, Menu, Image as ImageIcon, Briefcase, FileText, Upload,
  Twitter, Linkedin, Facebook, Instagram, Tag, MessageSquare, CheckCircle2, IndianRupee
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

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({ title: '', description: '', category: '', priceRange: '', image: '', features: [], icon: 'globe', rating: 5 });
  const [prodFeaturesText, setProdFeaturesText] = useState('');
  const [configForm, setConfigForm] = useState(siteConfig);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [remarkingId, setRemarkingId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newLogoName, setNewLogoName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

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
      if (!prodForm.title || !prodForm.priceRange) return;

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
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl' | 'bannerImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfigForm(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
            <h3 className="text-xl font-bold text-slate-800">All Enquiries</h3>
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{lead.name}</div>
                        <div className="text-slate-500 text-xs">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium">{lead.service}</div>
                        <div className="text-slate-500 text-xs">{lead.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          lead.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          lead.status === 'Sold' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {lead.status}
                      </span>
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

  if (currentUser?.role !== 'admin') {
      const myLeads = leads.filter(l => l.email === currentUser?.email);
      return (
        <div className="min-h-screen bg-slate-50 pb-20">
           <div className="bg-white border-b border-gray-200 py-8 px-4">
              <div className="max-w-7xl mx-auto">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentUser?.name}</h1>
                  <p className="text-slate-500 mt-2">Track your enquiries here.</p>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-4 py-12">
               <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-100">
                       <h3 className="text-xl font-bold text-slate-800">My Posted Enquiries</h3>
                   </div>
                   <div className="p-8">
                     {myLeads.length > 0 ? (
                       <ul className="space-y-4">
                         {myLeads.map(l => (
                           <li key={l.id} className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                             <div>
                               <div className="font-bold">{l.service}</div>
                               <div className="text-sm text-slate-500">{l.date}</div>
                             </div>
                             <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">{l.status}</span>
                           </li>
                         ))}
                       </ul>
                     ) : <p className="text-slate-400">No enquiries found.</p>}
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
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
             <div className="flex items-center">
                 <button className="lg:hidden mr-4" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
                 <h1 className="font-bold text-xl text-slate-800 uppercase tracking-wider">{activeTab}</h1>
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
                    <div className="col-span-full mt-6">
                        {renderAdminLeads()}
                    </div>
                </div>
            )}
            {activeTab === 'leads' && renderAdminLeads()}
            {activeTab === 'users' && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100">
                <h2 className="text-xl font-bold mb-6">User Management</h2>
                <div className="space-y-4">
                  {users.map(u => (
                    <div key={u.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className="text-sm text-slate-500">{u.email}</div>
                      </div>
                      <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-200 rounded">{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Site Configuration</h2>
                <div className="space-y-4">
                  <input type="text" className="w-full border p-3 rounded-xl" placeholder="Site Name" value={configForm.siteName} onChange={e => setConfigForm({...configForm, siteName: e.target.value})} />
                  <button onClick={() => updateSiteConfig(configForm)} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">Save Changes</button>
                </div>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;