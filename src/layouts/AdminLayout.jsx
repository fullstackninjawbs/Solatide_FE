import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Users,
  MessageSquare,
  FileCode2,
  Percent,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Layers,
  Box,
  Upload,
  Tag,
  BookOpen,
  Database,
  Edit3,
  Mail,
  BarChart2,
  CreditCard,
  Shield,
  DollarSign,
  UserCog
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Active admin user from auth context or localStorage
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('adminUser');
      return stored ? JSON.parse(stored) : { name: 'Super Admin', email: 'admin@solatide.com', role: 'super_admin' };
    } catch {
      return { name: 'Super Admin', email: 'admin@solatide.com', role: 'super_admin' };
    }
  });

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['super_admin', 'operations', 'content_manager', 'support', 'admin'] },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, roles: ['super_admin', 'operations', 'support', 'admin'] },
    { name: 'Products', path: '/admin/products', icon: Package, roles: ['super_admin', 'operations', 'content_manager', 'admin'] },
    { name: 'Collections', path: '/admin/products/collections', icon: Layers, roles: ['super_admin', 'operations', 'content_manager', 'admin'] },
    { name: 'Inventory', path: '/admin/products/inventory', icon: Box, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Import CSV', path: '/admin/products/import', icon: Upload, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'COAs & Batches', path: '/admin/coas', icon: FileText, roles: ['super_admin', 'operations', 'content_manager', 'admin'] },
    { name: 'Customers', path: '/admin/customers', icon: Users, roles: ['super_admin', 'operations', 'support', 'admin'] },
    { name: 'Discounts', path: '/admin/discounts', icon: Tag, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Pages', path: '/admin/content/pages', icon: FileText, roles: ['super_admin', 'content_manager', 'admin'] },
    { name: 'Research Library', path: '/admin/content/research-library', icon: BookOpen, roles: ['super_admin', 'content_manager', 'admin'] },
    { name: 'Compound Database', path: '/admin/content/compound-database', icon: Database, roles: ['super_admin', 'content_manager', 'admin'] },
    { name: 'Blog', path: '/admin/content/blog', icon: Edit3, roles: ['super_admin', 'content_manager', 'admin'] },
    { name: 'Reviews', path: '/admin/growth/reviews', icon: MessageSquare, roles: ['super_admin', 'operations', 'support', 'admin'] },
    { name: 'Newsletter', path: '/admin/growth/newsletter-restock', icon: Mail, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Affiliates', path: '/admin/growth/affiliates', icon: Percent, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Settings', path: '/admin/settings/store', icon: Settings, roles: ['super_admin', 'admin'] },
    { name: 'Admin Users', path: '/admin/settings/admin-users', icon: UserCog, roles: ['super_admin', 'admin'] }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Filter items by role permission
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(adminUser.role));

  return (
    <div className="h-screen bg-[#f8fafc] text-slate-800 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between shrink-0 relative h-screen ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-5 bg-white border border-slate-200 text-brand-navy hover:text-brand-cyan rounded-full p-1.5 shadow-sm cursor-pointer z-50 focus:outline-none"
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="flex flex-col flex-grow overflow-hidden">
          {/* Header/Logo mimicking the website's top-left branding */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100 gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-brand-navy flex items-center justify-center font-bold text-white tracking-wider shadow-sm shrink-0">
              S
            </div>
            {isSidebarOpen && (
              <span className="font-sans text-[16px] flex flex-col leading-none text-left select-none">
                <span className="text-[17px] font-extrabold tracking-wide text-brand-navy uppercase">Solatide</span>
                <span className="text-[10px] text-brand-cyan tracking-widest uppercase font-bold mt-1">Biosciences</span>
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-grow overflow-y-auto custom-scrollbar">
            {filteredMenuItems.map(item => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-brand-navy text-white font-semibold shadow-sm'
                      : 'text-slate-550 hover:bg-slate-50 hover:text-brand-navy'
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-navy'}`} />
                  {isSidebarOpen ? (
                    <span className="text-[14px]">{item.name}</span>
                  ) : (
                    <div className="absolute left-16 bg-white text-slate-800 text-[12px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md border border-slate-200">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-650 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            <LogOut className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-500" />
            {isSidebarOpen && <span className="text-[14px] font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-brand-navy capitalize">
              {location.pathname === '/admin'
                ? 'Dashboard'
                : location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="text-slate-400 hover:text-brand-navy transition-colors relative cursor-pointer focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-brand-cyan ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
              <div className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 text-sm font-semibold">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[14px] font-semibold leading-none text-slate-800">{adminUser.name}</p>
                <p className="text-[11px] text-brand-cyan mt-1 font-bold tracking-wider uppercase">
                  {adminUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
