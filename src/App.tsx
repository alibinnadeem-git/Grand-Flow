import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ShieldCheck, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  ChevronRight, 
  Send, 
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  MessageSquare,
  LogOut,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Case, Remark, WORKFLOW_STAGES, User } from './types';
import { WorkflowStepper } from './components/WorkflowStepper';
import { MinuteSheet } from './components/MinuteSheet';
import { CaseInfoCards } from './components/CaseInfoCards';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'case_detail'>('case_detail');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loginEmail, setLoginEmail] = useState('head@grandcity.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Auth Check
  React.useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        setUser(userData);
        if (userData) fetchCase();
        else setLoading(false);
      });
  }, []);

  const fetchCase = () => {
    setLoading(true);
    fetch('/api/cases/case_1')
      .then(res => res.json())
      .then(data => {
        setActiveCase(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch case:", err);
        setLoading(false);
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        fetchCase();
      } else {
        alert("Invalid credentials");
        setLoading(false);
      }
    } catch (err) {
      alert("Login failed");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setActiveCase(null);
  };

  const currentStage = useMemo(() => 
    activeCase ? WORKFLOW_STAGES.find(s => s.id === activeCase.currentStageId) : null, 
    [activeCase?.currentStageId]
  );

  const handleAddRemark = async (text: string) => {
    if (!activeCase || !user) return;

    try {
      const res = await fetch(`/api/cases/${activeCase.id}/remarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action: 'COMMENTED' })
      });
      
      if (res.ok) {
        const newRemark = await res.json();
        setActiveCase(prev => prev ? ({
          ...prev,
          remarks: [newRemark, ...(prev.remarks || [])]
        }) : null);
      }
    } catch (err) {
      console.error("Failed to add remark:", err);
    }
  };

  const handleForward = async () => {
    if (!activeCase) return;

    try {
      const res = await fetch(`/api/cases/${activeCase.id}/move`, {
        method: 'PATCH'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setActiveCase(data);
      } else {
        alert(data.error || "Failed to move case");
      }
    } catch (err) {
      console.error("Failed to forward case:", err);
    }
  };

  const toggleCompliance = async () => {
    if (!activeCase) return;

    const newValue = !activeCase.complianceConfirmed;
    try {
      const res = await fetch(`/api/cases/${activeCase.id}/compliance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed: newValue })
      });
      
      if (res.ok) {
        setActiveCase(prev => prev ? ({ ...prev, complianceConfirmed: newValue }) : null);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error("Failed to toggle compliance:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Initializing Grand Flow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 bg-blue-600 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">GRAND FLOW</h1>
            <p className="text-blue-100 text-sm font-medium">CSD Workflow Digitization</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              Sign In to Portal
            </button>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase text-center mb-3">Quick Login (Demo)</p>
              <div className="grid grid-cols-3 gap-2">
                {['head', 'compliance', 'ceo'].map(r => (
                  <button 
                    key={r}
                    type="button"
                    onClick={() => setLoginEmail(`${r}@grandcity.com`)}
                    className="text-[10px] font-bold py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 uppercase"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!activeCase) return <div>Error loading case.</div>;

  const canForward = () => {
    const roleMapping: Record<number, string[]> = {
      1: ['CSD_SITE', 'ADMIN'],
      2: ['ACCOUNTS', 'ADMIN'],
      3: ['COMPLIANCE', 'ADMIN'],
      4: ['CSD_HEAD', 'ADMIN'],
      5: ['COMPLIANCE', 'ADMIN'],
      6: ['DIR_OPS', 'ADMIN'],
      7: ['CEO', 'ADMIN'],
    };
    return roleMapping[activeCase.currentStageId]?.includes(user.role);
  };

  const canToggleCompliance = user.role === 'COMPLIANCE' || user.role === 'ADMIN';

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-gray-900 text-white transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          {sidebarOpen && <span className="font-black text-lg tracking-tighter">GRAND FLOW</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} collapsed={!sidebarOpen} />
          <SidebarItem icon={<FileText size={20} />} label="My Cases" active={view === 'case_detail'} onClick={() => setView('case_detail')} collapsed={!sidebarOpen} />
          <SidebarItem icon={<Users size={20} />} label="Departments" collapsed={!sidebarOpen} />
          <SidebarItem icon={<ShieldCheck size={20} />} label="Compliance" badge="3" collapsed={!sidebarOpen} />
          <div className="pt-4 mt-4 border-t border-gray-800">
            <SidebarItem icon={<Settings size={20} />} label="Settings" collapsed={!sidebarOpen} />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
                {(user.name || '').split(' ').map(n => n[0]).join('')}
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.dept}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search cases, customers, or plots..." 
                className="w-full bg-gray-50 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <Lock size={14} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{user.role}</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={18} /> New Case
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {view === 'case_detail' ? (
              <motion.div 
                key="case-detail"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto"
              >
                {/* Case Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase tracking-widest">
                        {activeCase.type}
                      </span>
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-black rounded uppercase tracking-widest",
                        activeCase.priority === 'URGENT' ? "bg-red-100 text-red-700" :
                        activeCase.priority === 'HIGH' ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {activeCase.priority} PRIORITY
                      </span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                      {activeCase.caseNo}
                    </h1>
                    <p className="text-gray-500 font-medium">{activeCase.subject}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                      <ArrowRightLeft size={16} /> Return
                    </button>
                    <button 
                      onClick={handleForward}
                      disabled={!canForward()}
                      className={cn(
                        "px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2",
                        canForward() 
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100" 
                          : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      )}
                    >
                      {canForward() ? "Forward to Next Stage" : "Awaiting Dept Action"} <Send size={16} />
                    </button>
                  </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Minute Sheet */}
                  <div className="lg:col-span-8 space-y-8">
                    <MinuteSheet remarks={activeCase.remarks} onAddRemark={handleAddRemark} />
                  </div>

                  {/* Right Column: Sidebar Info */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Workflow Progress */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <WorkflowStepper currentStageId={activeCase.currentStageId} />
                    </div>

                    {/* Compliance Gate UI */}
                    {activeCase.currentStageId === 5 && (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <ShieldAlert className="w-6 h-6 text-amber-600" />
                          <h3 className="font-black text-amber-900 text-sm uppercase">Compliance Gate</h3>
                        </div>
                        <p className="text-xs text-amber-800 mb-6 leading-relaxed font-medium">
                          This case requires a mandatory compliance completion check before it can be routed to the 
                          <strong> Director of Operations</strong>.
                        </p>
                        <label className={cn(
                          "flex items-center gap-3 p-4 bg-white rounded-lg border border-amber-200 transition-colors",
                          canToggleCompliance ? "cursor-pointer hover:bg-amber-50" : "cursor-not-allowed opacity-60"
                        )}>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-amber-300 text-blue-600 focus:ring-blue-500"
                            checked={activeCase.complianceConfirmed}
                            onChange={toggleCompliance}
                            disabled={!canToggleCompliance}
                          />
                          <span className="text-sm font-bold text-amber-900">Confirm Compliance Completion</span>
                        </label>
                        {!canToggleCompliance && (
                          <p className="mt-2 text-[10px] text-amber-600 font-bold uppercase text-center">
                            Awaiting Compliance Officer Signature
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Info Cards */}
                    <CaseInfoCards caseData={activeCase} />

                    {/* Quick Actions */}
                    <div className="bg-gray-900 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <ActionButton icon={<MessageSquare size={16} />} label="Intimate" />
                        <ActionButton 
                          icon={<CheckCircle2 size={16} />} 
                          label="Approve" 
                          disabled={user.role !== 'CEO' && user.role !== 'ADMIN'} 
                        />
                        <ActionButton 
                          icon={<XCircle size={16} />} 
                          label="Reject" 
                          disabled={user.role !== 'CEO' && user.role !== 'ADMIN'} 
                        />
                        <ActionButton icon={<FileText size={16} />} label="Print" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <LayoutDashboard size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Dashboard View Coming Soon</p>
                <button onClick={() => setView('case_detail')} className="mt-4 text-blue-600 font-bold hover:underline">
                  Go to Active Case Detail
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, badge, onClick, collapsed }: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  badge?: string,
  onClick?: () => void,
  collapsed: boolean
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
        active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
      )}
    >
      <div className="shrink-0">{icon}</div>
      {!collapsed && <span className="text-sm font-bold flex-1 text-left">{label}</span>}
      {!collapsed && badge && (
        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );
}

function ActionButton({ icon, label, disabled = false }: { icon: React.ReactNode, label: string, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-colors",
        disabled ? "bg-gray-800/50 text-gray-600 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700"
      )}
    >
      <div className={cn(disabled ? "text-gray-700" : "text-blue-400")}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}

