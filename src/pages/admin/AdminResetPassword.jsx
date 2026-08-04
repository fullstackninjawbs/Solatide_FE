import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';
import logoImg from '../../assets/icons/logo.webp';

const AdminResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const response = await apiService.adminResetPassword(token, password);
      const result = await response.json();

      if (response.ok && result.success) {
        setSuccessMessage('Password reset successful! Redirecting you to login...');
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(result.message || 'Failed to reset password. The link may have expired.');
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

      <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-[32px] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 sm:p-10 relative z-10">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img 
            src={logoImg} 
            alt="Solatide Biosciences" 
            className="h-[70px] w-auto object-contain" 
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
          <p className="text-slate-500 text-[13.5px] mt-1.5 font-medium">Please enter your new password below</p>
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

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* New Password field */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              New Password
            </label>
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

          {/* Confirm Password field */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Confirm Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-[#214A9E] transition-colors">
                <Lock className="h-[18px] w-[18px]" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50/55 border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#214A9E] focus:ring-4 focus:ring-blue-100 transition-all text-[14.5px]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <AdminPrimaryButton
            type="submit"
            disabled={loading || successMessage !== ''}
            className="w-full mt-8 !py-4 rounded-2xl bg-[#214A9E] hover:bg-[#1a4494] text-white font-bold transition-all shadow-[0_4px_12px_rgba(33,74,158,0.15)] hover:shadow-[0_6px_20px_rgba(33,74,158,0.25)] flex justify-center items-center text-[14.5px] tracking-wide"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </AdminPrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
