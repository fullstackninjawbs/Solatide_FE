import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import {
  Search,
  UserPlus,
  Shield,
  Mail,
  X,
  Edit2,
  Trash2,
  Users,
  ChevronDown,
  Check
} from 'lucide-react';

const AdminUsers = () => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxAllowed, setMaxAllowed] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminUsers();
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.data.users);
        setMaxAllowed(data.data.maxAllowed || 3);
      } else {
        toast.error(data.message || 'Failed to fetch admin users');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error fetching admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Blank for edit
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'admin'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRoleDropdownOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      return toast.error("Please fill in all required fields.");
    }
    if (!editingUser && !formData.password) {
      return toast.error("Password is required for new users.");
    }

    setSubmitting(true);
    try {
      let res;
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        res = await apiService.updateAdminUser(editingUser._id, payload);
      } else {
        res = await apiService.createAdminUser(formData);
      }

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editingUser ? 'Admin updated successfully' : 'Admin created successfully');
        handleCloseModal();
        fetchUsers();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (id === adminUser?._id) {
      return toast.error("You cannot delete your own account.");
    }
    if (!window.confirm("Are you sure you want to remove this admin? This action cannot be undone.")) return;

    try {
      const res = await apiService.deleteAdminUser(id);
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Admin removed successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to remove admin");
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canAddMore = users.length < maxAllowed;

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy tracking-tight">Admin Users</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage dashboard access and user permissions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <Users size={16} className="text-brand-cyan" />
            {users.length} / {maxAllowed} Users
          </div>
          <button
            onClick={() => handleOpenModal()}
            disabled={!canAddMore}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all shadow-sm ${canAddMore
                ? 'bg-brand-navy text-white hover:bg-brand-navy/90 hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            title={!canAddMore ? `Maximum of ${maxAllowed} admins reached` : 'Add new admin'}
          >
            <UserPlus size={16} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Added On</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-navy to-[#1e293b] flex items-center justify-center text-white font-bold shadow-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[14px]">
                            {user.name}
                            {adminUser?._id === user._id && (
                              <span className="ml-2 text-[10px] bg-brand-cyan/10 text-brand-cyan px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">You</span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[13px] flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} className="text-slate-400" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider border border-slate-200">
                        <Shield size={12} className={user.role === 'super_admin' ? 'text-amber-500' : 'text-brand-cyan'} />
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-slate-400 hover:text-brand-cyan hover:bg-brand-cyan/10 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={adminUser?._id === user._id}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={adminUser?._id === user._id ? "You cannot delete yourself" : "Remove User"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingUser ? 'Edit Admin User' : 'Add New Admin'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
                  placeholder="john@solatide.com"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Password
                  {editingUser && <span className="text-slate-400 font-normal ml-2">(Leave blank to keep current)</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div className="relative">
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Role Permission</label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <div className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm flex items-center justify-between transition-all ${isRoleDropdownOpen ? 'border-brand-cyan ring-2 ring-brand-cyan/20' : 'border-slate-200'
                    }`}>
                    <span className="font-medium text-slate-700">
                      {formData.role === 'super_admin' ? 'Super Admin (Full Access)' : 'Admin'}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isRoleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden z-50 py-1">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 flex items-center justify-between text-sm text-left hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, role: 'super_admin' });
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium text-slate-700">Super Admin (Full Access)</span>
                      {formData.role === 'super_admin' && <Check size={16} className="text-brand-cyan" />}
                    </button>
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 flex items-center justify-between text-sm text-left hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        setFormData({ ...formData, role: 'admin' });
                        setIsRoleDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium text-slate-700">Admin</span>
                      {formData.role === 'admin' && <Check size={16} className="text-brand-cyan" />}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy/90 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  {editingUser ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
