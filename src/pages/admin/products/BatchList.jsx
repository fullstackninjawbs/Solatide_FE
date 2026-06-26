import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await apiService.getBatches();
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.batches);
      }
    } catch (error) {
      alert('Failed to fetch batches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch record?')) {
      try {
        const res = await apiService.deleteBatch(id);
        if (res.ok) {
          alert('Batch deleted successfully');
          fetchBatches();
        } else {
          alert('Failed to delete batch');
        }
      } catch (error) {
        alert('Error deleting batch');
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading batch records...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Batch Records</h1>
          <p className="text-sm text-slate-500 mt-1">Manage COA batches and product assignments</p>
        </div>
        <Link
          to="/admin/batches/new"
          className="bg-[#214A9E] hover:bg-[#1a3a7d] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Batch Record
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Batch ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Purity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No batch records found. Create one to get started.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {batch.batchId}
                    </td>
                    <td className="px-6 py-4">
                      {batch.productId?.name || <span className="text-red-400 italic">Unknown Product</span>}
                    </td>
                    <td className="px-6 py-4">
                      {batch.purity || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold flex w-fit items-center gap-1.5 ${
                        batch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {batch.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/batches/${batch._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-[13px]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(batch._id)}
                          className="text-red-600 hover:text-red-800 font-medium text-[13px]"
                        >
                          Delete
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

export default BatchList;
