import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/logo.png';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Box,
  Tag,
  BookOpen,
  BarChart2,
  UserCog
} from 'lucide-react';

import { ToastProvider } from '../components/admin/feedback/ToastProvider';
import { ConfirmProvider } from '../components/admin/feedback/ConfirmProvider';

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
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart,
      roles: ['super_admin', 'operations', 'support', 'admin'],
      subItems: [
        // { name: 'Drafts', path: '/admin/orders/drafts', roles: ['super_admin', 'operations', 'support', 'admin'] },
        { name: 'Shipping labels', path: '/admin/orders/shipping-labels', roles: ['super_admin', 'operations', 'admin'] },
        // { name: 'Abandoned checkouts', path: '/admin/orders/abandoned', roles: ['super_admin', 'operations', 'admin'] }
      ]
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
      roles: ['super_admin', 'operations', 'content_manager', 'admin'],
      subItems: [
        { name: 'Collections', path: '/admin/products/collections', roles: ['super_admin', 'operations', 'content_manager', 'admin'] },
        { name: 'Inventory', path: '/admin/products/inventory', roles: ['super_admin', 'operations', 'admin'] },
        { name: 'Import CSV', path: '/admin/products/import', roles: ['super_admin', 'operations', 'admin'] }
      ]
    },
    {
      name: 'Batch Records',
      path: '/admin/batches',
      icon: FileText,
      roles: ['super_admin', 'operations', 'admin'],
      subItems: [
        { name: 'All Batches', path: '/admin/batches', roles: ['super_admin', 'operations', 'admin'] },
        { name: 'COAs', path: '/admin/coas', roles: ['super_admin', 'operations', 'admin'] }
      ]
    },

    { name: 'Customers', path: '/admin/customers', icon: Users, roles: ['super_admin', 'operations', 'support', 'admin'] },
    { name: 'Shipping Packages', path: '/admin/settings/shipping-packages', icon: Box, roles: ['super_admin', 'admin'] },
    { name: 'Discounts', path: '/admin/discounts', icon: Tag, roles: ['super_admin', 'operations', 'admin'] },
    {
      name: 'Content',
      path: '/admin/content/faqs',
      icon: BookOpen,
      roles: ['super_admin', 'content_manager', 'admin'],
      subItems: [
        { name: 'Pages', path: '/admin/content/pages', roles: ['super_admin', 'content_manager', 'admin'] },
        { name: 'FAQs', path: '/admin/content/faqs', roles: ['super_admin', 'content_manager', 'admin'] }
      ]
    },
    { name: 'Reviews', path: '/admin/growth/reviews', icon: MessageSquare, roles: ['super_admin', 'operations', 'support', 'admin'] },
    // { name: 'Newsletter', path: '/admin/growth/newsletter-restock', icon: Mail, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2, roles: ['super_admin', 'operations', 'admin'] },
    { name: 'Admin Users', path: '/admin/settings/admin-users', icon: UserCog, roles: ['super_admin', 'admin'] },
    { name: 'Settings', path: '/admin/settings/store', icon: Settings, roles: ['super_admin', 'admin'] },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Filter items by role permission
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(adminUser.role));

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="h-screen print:h-auto bg-[#f8fafc] text-slate-800 flex font-sans overflow-hidden print:overflow-visible">
          {/* Sidebar */}
          <aside
            className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between shrink-0 relative h-screen print:hidden ${isSidebarOpen ? 'w-64' : 'w-20'
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
              <div className="h-20 flex items-center px-5 border-b border-slate-100 shrink-0 print:hidden overflow-hidden">
                <Link to="/admin" className="flex items-center gap-3 w-full">
                  {/* Cropped Logo Icon */}
                  <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-start">
                    <img
                      src={logoImg}
                      alt="Solatide Icon"
                      className="h-10 max-w-none object-contain object-left"
                    />
                  </div>

                  {/* Crisp HTML Text */}
                  {isSidebarOpen && (
                    <span className="font-sans text-[16px] flex flex-col leading-none text-left select-none">
                      <span className="text-[17px] font-extrabold tracking-wide text-[#214A9E] uppercase">Solatide</span>
                      <span className="text-[10px] text-cyan-600 tracking-widest uppercase font-bold mt-1">Biosciences</span>
                    </span>
                  )}
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1 flex-grow overflow-y-auto custom-scrollbar">
                {filteredMenuItems.map(item => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.path) ||
                      (item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.path)));

                  return (
                    <div key={item.name} className="flex flex-col">
                      <Link
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group relative ${isActive
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

                      {/* Render SubItems if active and sidebar open */}
                      {isActive && isSidebarOpen && item.subItems && (
                        <div className="flex flex-col mt-1 mb-2 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-3 before:w-px before:bg-slate-200">
                          {item.subItems.filter(sub => sub.roles.includes(adminUser.role)).map(sub => {
                            const isSubActive = location.pathname?.toLowerCase() === sub.path || location.pathname?.toLowerCase().startsWith(sub.path + '/');
                            return (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                className={`pl-11 pr-4 py-2.5 rounded-lg transition-colors text-[13.5px] relative group ${isSubActive
                                  ? 'font-semibold text-brand-navy'
                                  : 'text-slate-500 hover:text-brand-navy hover:bg-slate-50'
                                  }`}
                              >
                                <span className={`absolute left-6 top-1/2 -mt-[5px] w-2 h-[10px] border-b border-l rounded-bl ${isSubActive ? 'border-brand-navy' : 'border-slate-300 group-hover:border-brand-navy'}`}></span>
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
          <div className="flex-grow flex flex-col min-w-0 h-screen print:h-auto overflow-hidden print:overflow-visible">
            {/* Top Navbar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 z-20 shrink-0 print:hidden">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold text-brand-navy capitalize">
                  {location.pathname === '/admin'
                    ? 'Dashboard'
                    : location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center gap-5">
                {/* Notification Bell */}
                <button className="hidden text-slate-400 hover:text-brand-navy transition-colors relative cursor-pointer focus:outline-none">
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
            <main id="admin-main-content" className="flex-grow p-6 sm:p-8 overflow-y-auto print:overflow-visible bg-[#f8fafc] print:bg-white">
              <Outlet />
            </main>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
};

export default AdminLayout;
