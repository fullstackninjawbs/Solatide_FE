import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, SlidersHorizontal, AlertCircle, Layers } from 'lucide-react';
import { apiService } from '../../../services/api';

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getCollections();
      const result = await response.json();
      if (result.success && result.data) {
        setCollections(result.data);
      } else {
        setError('Failed to fetch collections.');
      }
    } catch (err) {
      setError('Could not connect to the API server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      return;
    }

    try {
      const response = await apiService.deleteCollection(id);
      if (response.ok || response.status === 204) {
        setCollections(collections.filter(c => c._id !== id));
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete collection.');
      }
    } catch (err) {
      alert('Network error deleting collection.');
    }
  };

  // Helper to construct a human readable summary of conditions
  const renderConditions = (col) => {
    if (col.type !== 'automated' || !col.rules || col.rules.length === 0) {
      return <span className="text-slate-400 italic">No conditions</span>;
    }

    const relationText = col.ruleRelation === 'any' ? 'any condition' : 'all conditions';
    
    // Show a summary of rules
    const rulesText = col.rules.map(rule => {
      let fieldLabel = rule.field;
      if (rule.field === 'title') fieldLabel = 'Product title';
      else if (rule.field === 'type') fieldLabel = 'Product category';
      else if (rule.field === 'tag') fieldLabel = 'Product tag';
      else if (rule.field === 'vendor') fieldLabel = 'Product vendor';
      else if (rule.field === 'price') fieldLabel = 'Price';
      else if (rule.field === 'compareAtPrice') fieldLabel = 'Compare at price';

      return `${fieldLabel} ${rule.operator} ${rule.value}`;
    });

    if (rulesText.length <= 2) {
      return (
        <span className="text-slate-600 text-[13px]">
          Match {relationText}: <code className="bg-slate-100 px-1 py-0.5 rounded text-[12px]">{rulesText.join(' and ')}</code>
        </span>
      );
    }

    return (
      <span className="text-slate-650 text-[13px] title={rulesText.join(', ')}">
        Match {relationText}: <code className="bg-slate-100 px-1 py-0.5 rounded text-[12px]">{rulesText[0]}</code> (+ {rulesText.length - 1} more)
      </span>
    );
  };

  // Filter collections client-side for immediate feedback
  const filteredCollections = collections.filter(col =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (col.description && col.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Collections</h2>
          <p className="text-slate-500 text-[14px]">Group your research products into manual or automated categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/collections/new"
            className="bg-cta-gradient hover:bg-cta-gradient-hover text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add collection</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-650 text-[14px] flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Table Container */}
      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections by title or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-450 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-[14px]"
            />
          </div>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
            <p className="text-[14px] font-medium">Loading collections...</p>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Layers className="h-12 w-12 text-slate-300" />
            <p className="text-[15px] font-semibold text-slate-650">No collections found</p>
            <p className="text-slate-500 text-[13px]">Create collections to group your products for easier catalog browsing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
                  </th>
                  <th className="py-4 pl-2">Title</th>
                  <th className="py-4">Type</th>
                  <th className="py-4">Products</th>
                  <th className="py-4">Product Conditions</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                {filteredCollections.map((col) => (
                  <tr key={col._id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 pl-6">
                      <input type="checkbox" className="rounded border-slate-350 cursor-pointer" />
                    </td>
                    <td className="py-4 pl-2 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0">
                          {col.bannerImage ? (
                            <img src={col.bannerImage} alt={col.name} className="h-full w-full object-cover" />
                          ) : (
                            <Layers className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col text-left">
                          <Link 
                            to={`/admin/products/collections/edit/${col._id}`}
                            className="font-bold text-slate-900 hover:text-brand-blue transition-colors text-[14px]"
                          >
                            {col.name}
                          </Link>
                          <span className="text-slate-400 text-[12px] font-normal font-mono">/{col.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      {col.type === 'automated' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Automated
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-100">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="py-4 font-semibold text-slate-800">
                      {col.productCount || 0}
                    </td>
                    <td className="py-4">
                      {renderConditions(col)}
                    </td>
                    <td className="py-4">
                      {col.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-650 border border-slate-200">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/admin/products/collections/edit/${col._id}`}
                            className="text-brand-blue hover:text-blue-800 font-semibold text-[13px]"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(col._id, col.name)}
                            className="text-red-500 hover:text-red-700 font-semibold text-[13px] cursor-pointer focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
