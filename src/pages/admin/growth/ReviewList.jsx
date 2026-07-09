import React, { useState, useEffect } from 'react';
import { apiService, API_URL } from '../../../services/api';
import CustomDropdown from '../../../components/CustomDropdown';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.set('status', filterStatus);
      }
      // Also might want to paginate, but we'll fetch limit=100 for now
      params.set('limit', '100');

      const res = await apiService.getAdminReviews(params.toString());
      const data = await res.json();
      if (data.success) {
        setReviews(data.data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await apiService.updateAdminReviewStatus(id, status);
      const data = await res.json();
      if (data.success) {
        // Update local state to reflect the change
        setReviews(reviews.map(r => r._id === id ? { ...r, status } : r));
      } else {
        alert(data.message || 'Failed to update review status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('An error occurred while updating the status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    
    try {
      const res = await apiService.deleteAdminReview(id);
      if (res.ok || res.status === 204 || res.status === 200) {
        setReviews(reviews.filter(r => r._id !== id));
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[12px] font-medium">Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[12px] font-medium">Rejected</span>;
      case 'pending':
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[12px] font-medium">Pending Approval</span>;
    }
  };

  const handleResendVerification = async (id) => {
    try {
      const res = await apiService.resendVerificationEmail(id);
      const data = await res.json();
      if (data.success) {
        alert('Verification email resent successfully.');
      } else {
        alert(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      alert('An error occurred while resending the email.');
    }
  };

  const getProductImageUrl = (imageObj) => {
    if (!imageObj) return '';
    const url = typeof imageObj === 'string' ? imageObj : imageObj.url;
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Product Reviews</h2>
          <p className="text-slate-500 text-[14px]">Manage and moderate customer product reviews.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          <CustomDropdown
            value={filterStatus}
            options={statusOptions}
            onChange={setFilterStatus}
            align="right"
            className="w-full sm:w-[180px] flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[14px] font-medium focus:outline-none focus:ring-1 focus:ring-brand-blue/30 focus:border-brand-blue hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          />
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.015)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">No reviews found matching your criteria.</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {review.product ? (
                        <div className="flex items-center gap-3">
                          {review.product.images?.[0] && (
                            <img src={getProductImageUrl(review.product.images[0])} alt={review.product.name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium text-slate-800 line-clamp-1">{review.product.name}</p>
                            <p className="text-[12px] text-slate-400">SKU: {review.product.sku}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unknown Product</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{review.displayName}</p>
                      {review.email && <p className="text-[12px] text-slate-500">{review.email}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-400 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-slate-800 text-[13px] line-clamp-1">{review.title}</p>
                      <p className="text-[12px] line-clamp-2 mt-1">{review.content}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {review.images.map((img, i) => (
                            <img key={i} src={img} alt="Review attachment" className="w-8 h-8 object-cover rounded border border-slate-200" />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {getStatusBadge(review.status)}
                        {review.emailVerified ? (
                          <span className="bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">Verified</span>
                        ) : (
                          <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">Not Verified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {!review.emailVerified && (
                          <button 
                            onClick={() => handleResendVerification(review._id)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Resend Verification Email"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </button>
                        )}
                        {(review.status === 'pending' || review.status === 'rejected') && (
                          <button 
                            onClick={() => {
                              if (!review.emailVerified) {
                                alert('This review must be verified by the customer before approval.');
                                return;
                              }
                              handleUpdateStatus(review._id, 'approved');
                            }}
                            className={`p-1.5 rounded transition-colors ${review.emailVerified ? 'text-green-600 hover:bg-green-50' : 'text-slate-300 cursor-not-allowed'}`}
                            title={review.emailVerified ? "Approve Review" : "This review must be verified by the customer before approval."}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        {(review.status === 'pending' || review.status === 'approved') && (
                          <button 
                            onClick={() => handleUpdateStatus(review._id, 'rejected')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Reject Review"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Review"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
    </div>
  );
};

export default ReviewList;
