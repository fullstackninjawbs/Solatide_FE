import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await apiService.adminLogin({ email, password });

      const result = await response.json();

      if (result.success && result.token) {
        const user = result.data?.user;
        const role = user?.role;

        // Exclude standard users
        if (role === 'user') {
          setError('Access denied. You do not have admin permissions.');
          setLoading(false);
          return;
        }

        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection to auth server failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo/Icon */}
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-brand-navy to-brand-cyan flex items-center justify-center font-bold text-white text-[24px] tracking-wide shadow-sm mx-auto mb-6">
          S
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-[14px] mb-8">Sign in to manage your Solatide Biosciences store</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm flex items-center gap-3 text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@solatide.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[15px]"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs text-brand-blue hover:underline font-semibold">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[15px]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button using theme gradients */}
          <AdminPrimaryButton
            type="submit"
            disabled={loading}
            className="w-full mt-6 !py-3.5"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </AdminPrimaryButton>
        </form>


      </div>
    </div>
  );
};

export default AdminLogin;
