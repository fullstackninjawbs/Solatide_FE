import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { motion } from 'framer-motion';

const ReviewVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'invalid' | 'already_verified'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await apiService.verifyReviewEmail(token);
        const data = await res.json();
        
        if (data.success) {
          setStatus('success');
        } else {
          if (data.message && data.message.includes('already been verified')) {
            setStatus('already_verified');
          } else {
            setStatus('invalid');
            setErrorMessage(data.message || 'This verification link is invalid or has expired.');
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('invalid');
        setErrorMessage('An unexpected error occurred during verification.');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#fafafa]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#008060] animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Review</h2>
            <p className="text-slate-500">Please wait while we confirm your review...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e6f4f1] text-[#008060] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Verified Successfully</h2>
            <p className="text-slate-600 mb-8 whitespace-pre-line">
              Thank you for verifying your email.
              Your review has been successfully verified.
              It is now waiting for admin approval.
              Once approved, it will appear on our website.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button 
                onClick={() => navigate('/shop')}
                className="bg-[#008060] hover:bg-[#006e52] text-white px-6 py-2.5 rounded font-medium transition-colors"
              >
                Continue Shopping
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        )}

        {status === 'already_verified' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e6f4f1] text-[#008060] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Already Verified</h2>
            <p className="text-slate-600 mb-8">
              Review already verified.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-[#008060] hover:bg-[#006e52] text-white px-6 py-2.5 rounded font-medium transition-colors w-full sm:w-auto"
            >
              Back to Shop
            </button>
          </div>
        )}

        {status === 'invalid' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {errorMessage.includes('expired') ? 'Verification Link Expired' : 'Verification Failed'}
            </h2>
            <p className="text-slate-600 mb-8">
              {errorMessage.includes('expired') ? 'This verification link has expired.' : 'This verification link is invalid.'}
            </p>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/shop')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded font-medium transition-colors w-full"
              >
                Back to Website
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewVerification;
