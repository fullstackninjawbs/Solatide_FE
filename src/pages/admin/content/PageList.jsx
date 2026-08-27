import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const queryString = statusFilter !== 'all' ? `status=${statusFilter}` : '';
      const res = await apiService.getAdminPages(queryString);
      const data = await res.json();
      setPages(data);
    } catch (err) {
      toast.error('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const isConfirmed = await confirm({
      title: 'Delete page?',
      message: `This will permanently delete '${title}' and remove it from the website. This cannot be undone.`,
      confirmText: 'Delete page',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        const res = await apiService.deleteAdminPage(id);
        if (!res.ok) throw new Error('Failed to delete page');
        toast.success('Page deleted successfully');
        fetchPages();
      } catch (err) {
        toast.error('Failed to delete page');
      }
    }
  };

  const copyUrl = (slug) => {
    const url = `${window.location.origin}/page/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Page URL copied');
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left font-sans pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pages</h2>
          <p className="text-slate-500 text-[14px]">Manage custom content pages for your storefront.</p>
        </div>
        <Link to="/admin/content/pages/new">
          <AdminPrimaryButton className="gap-2">
            <Plus className="h-4 w-4" />
            Create page
          </AdminPrimaryButton>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[16px] shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by title or URL handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy focus:border-brand-navy outline-none text-[14px]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy focus:border-brand-navy outline-none bg-white min-w-[150px] text-[14px]"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[13px] font-bold text-slate-600">
                <th className="py-4 px-6 whitespace-nowrap">Page Title</th>
                <th className="py-4 px-6 whitespace-nowrap">URL Handle</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 whitespace-nowrap">Last Updated</th>
                <th className="py-4 px-6 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0079CD]"></div>
                      Loading pages...
                    </div>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No pages found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPages.map(page => (
                  <tr key={page._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {page.title}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-[12px]">
                      /page/{page.slug}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[13px]">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/content/pages/edit/${page._id}`)}
                        className="p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Page"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      {page.status === 'published' && (
                        <>
                          <button 
                            onClick={() => copyUrl(page.slug)}
                            className="p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                            title="Copy URL"
                          >
                            <LinkIcon className="h-4 w-4" />
                          </button>
                          <a 
                            href={`/page/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-1.5 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </>
                      )}

                      <button 
                        onClick={() => handleDelete(page._id, page.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                        title="Delete Page"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

export default PageList;
