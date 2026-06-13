
import React from 'react';
import { User } from '../types';
import {
  User as UserIcon,
  Settings,
  ShoppingBag,
  FileText,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

interface UserDashboardProps {
  currentUser: User | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { leads } = useData();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Please login to view your dashboard</h3>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 mt-4">Login</button>
      </div>
    );
  }

  // Filter leads for this user
  const myLeads = leads.filter(l => l.email === currentUser.email);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100">
                <UserIcon size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {currentUser.name}</h1>
                <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                  <ShieldCheck size={16} className="text-green-500" /> Verified {currentUser.role} Account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/products" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition shadow-lg">Browse Services</Link>
              <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 transition shadow-sm">
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Quick Stats */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Zap size={20} className="text-yellow-500 fill-current" /> Overview
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={18} /></div>
                    <span className="text-sm font-bold text-slate-600">My Enquiries</span>
                  </div>
                  <span className="text-xl font-black text-slate-900">{myLeads.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShoppingBag size={18} /></div>
                    <span className="text-sm font-bold text-slate-600">Saved Items</span>
                  </div>
                  <span className="text-xl font-black text-slate-900">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Clock size={18} /></div>
                    <span className="text-sm font-bold text-slate-600">Member Since</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase">{currentUser.joinedDate?.split('T')[0] || 'Recently'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
              <h3 className="text-xl font-black mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm font-medium mb-6 leading-relaxed">Our AI consultant is ready to help you find the best B2B solutions for your business.</p>
              <button onClick={() => navigate('/enquiry')} className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition shadow-lg">Start New Enquiry</button>
            </div>
          </div>

          {/* Right Column: Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Clock size={24} className="text-blue-600" /> Recent Enquiries
                </h3>
                <Link to="/enquiry" className="text-sm font-bold text-blue-600 hover:underline">New Enquiry &rarr;</Link>
              </div>

              {myLeads.length > 0 ? (
                <div className="space-y-4">
                  {myLeads.map((lead) => (
                    <div key={lead.id} className="p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${lead.status === 'Verified' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                          <Zap size={20} fill="white" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition">{lead.service}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{lead.date} • {lead.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          lead.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lead.status}
                        </span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <FileText size={40} />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">No enquiries yet</h4>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Post your first requirement to see it here and start receiving quotes from verified vendors.</p>
                  <button onClick={() => navigate('/enquiry')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition shadow-lg">Post Your First Enquiry</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
