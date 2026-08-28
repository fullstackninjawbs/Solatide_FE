import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import logoImg from '../../assets/images/logo.webp';

const AdminLogin = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
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

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const response = await apiService.adminForgotPassword(email);
      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage('We have emailed you a password reset link. Please check your inbox.');
        setEmail('');
      } else {
        setError(result.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Connection to auth server failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Gradient Mesh */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-[32px] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 sm:p-10 relative z-10 transition-all duration-300">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src={logoImg}
            alt="Solatide Biosciences"
            className="h-[70px] w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {view === 'login' ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
              <p className="text-slate-500 text-[13.5px] mt-1.5 font-medium">Sign in to manage your Solatide Biosciences store</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-[13.5px] flex items-start gap-3 text-left">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <span className="font-semibold leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6 text-left">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#214A9E] transition-colors">
                    <Mail className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@solatide.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50/55 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#214A9E] focus:ring-4 focus:ring-blue-100 transition-all text-[14.5px]"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); }}
                    className="text-[12px] text-[#214A9E] hover:text-[#1a4494] font-bold transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#214A9E] transition-colors">
                    <Lock className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50/55 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#214A9E] focus:ring-4 focus:ring-blue-100 transition-all text-[14.5px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <AdminPrimaryButton
                type="submit"
                disabled={loading}
                className="w-full mt-8 !py-4 rounded-2xl bg-[#214A9E] hover:bg-[#1a4494] text-white font-bold transition-all shadow-[0_4px_12px_rgba(33,74,158,0.15)] hover:shadow-[0_6px_20px_rgba(33,74,158,0.25)] flex justify-center items-center text-[14.5px] tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </AdminPrimaryButton>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password</h2>
              <p className="text-slate-500 text-[13.5px] mt-1.5 font-medium">Enter your admin email to request a reset link</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-[13.5px] flex items-start gap-3 text-left">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <span className="font-semibold leading-snug">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[13.5px] flex items-start gap-3 text-left">
                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold leading-snug">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-6 text-left">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#214A9E] transition-colors">
                    <Mail className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@solatide.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50/55 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#214A9E] focus:ring-4 focus:ring-blue-100 transition-all text-[14.5px]"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <AdminPrimaryButton
                type="submit"
                disabled={loading}
                className="w-full mt-8 !py-4 rounded-2xl bg-[#214A9E] hover:bg-[#1a4494] text-white font-bold transition-all shadow-[0_4px_12px_rgba(33,74,158,0.15)] hover:shadow-[0_6px_20px_rgba(33,74,158,0.25)] flex justify-center items-center text-[14.5px] tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </AdminPrimaryButton>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => { setView('login'); setError(''); setSuccessMessage(''); }}
                  className="text-[13px] text-slate-500 hover:text-slate-800 font-bold transition-colors focus:outline-none"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
