import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Play, Search, AlertTriangle, ArrowLeft } from 'lucide-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';
import { getUserFriendlyErrorMessage } from '../../../utils/getUserFriendlyErrorMessage';

const TagadaSync = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const toast = useToast();
  const confirm = useConfirm();



  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await apiService.getTagadaSyncHistory();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch sync history.');
      setLogs(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch sync history.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getTagadaSyncPreview();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate preview.');
      setPreview(data.data);
      setActiveTab('preview');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate preview.');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    const isConfirmed = await confirm({
      title: 'Run Tagada Sync?',
      description: 'Are you sure you want to run a full sync? This will update local products with Tagada data.',
      confirmLabel: 'Run Sync',
      variant: 'primary'
    });

    if (!isConfirmed) return;

    try {
      setSyncing(true);
      setError(null);
      const res = await apiService.runTagadaSync();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sync failed.');
      await fetchHistory();
      setActiveTab('history');
      setPreview(null);
      toast.success('Sync completed successfully!');
    } catch (err) {
      console.error(err);
      setError(getUserFriendlyErrorMessage(err, 'tagadaSync'));
      toast.error(getUserFriendlyErrorMessage(err, 'tagadaSync'));
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-navy">Tagada Product Sync</h2>
          <p className="text-slate-500 text-[14px]">Synchronize products and variants from Tagada to your local database.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/admin/products"
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Products
          </Link>
          <button
            onClick={handlePreview}
            disabled={loading || syncing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="w-4 h-4 mr-2" />
            Preview Changes
          </button>
          <button
            onClick={handleSync}
            disabled={loading || syncing}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Sync All Products
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] mb-6">
        <div className="border-b border-slate-100">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('status')}
              className={`${activeTab === 'status'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Status & Overview
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`${activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Preview ({preview ? preview.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Sync History
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'status' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Latest Sync Information</h3>
              {logs && logs.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                  <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Sync</dt>
                    <dd className="mt-1 text-md font-semibold text-gray-900">
                      {new Date(logs[0].startedAt).toLocaleString()}
                    </dd>
                  </div>
                  <div className="bg-green-50 overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-green-500 truncate">Created</dt>
                    <dd className="mt-1 text-3xl font-semibold text-green-600">{logs[0].createdCount}</dd>
                  </div>
                  <div className="bg-blue-50 overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-blue-500 truncate">Updated</dt>
                    <dd className="mt-1 text-3xl font-semibold text-blue-600">{logs[0].updatedCount}</dd>
                  </div>
                  <div className="bg-red-50 overflow-hidden shadow rounded-lg p-5">
                    <dt className="text-sm font-medium text-red-500 truncate">Failed</dt>
                    <dd className="mt-1 text-3xl font-semibold text-red-600">{logs[0].failedCount}</dd>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No sync history available.</p>
              )}

              <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
                <h4 className="text-blue-800 font-medium">Important Information</h4>
                <p className="mt-2 text-blue-700 text-sm">
                  Tagada is the source of truth for commerce data (names, descriptions, pricing, tagada variant id).
                  Syncing will update local products without overwriting local-only fields like Batches, COAs,
                  Purity results. Run a preview first to see what will change.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              {!preview ? (
                <div className="text-center py-12 text-gray-500">
                  Click "Preview Changes" to see what would happen if you synced right now.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                        <th className="py-4 pl-6 text-left">Product</th>
                        <th className="py-4 text-left">Tagada Variant ID</th>
                        <th className="py-4 text-left">Action</th>
                        <th className="py-4 text-left pr-6">Changes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                      {preview.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="py-4 pl-6 font-medium text-slate-900">{item.productName}</td>
                          <td className="py-4 text-slate-500">{item.tagadaProductId}</td>
                          <td className="py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.action === 'created' ? 'bg-green-100 text-green-800' :
                                item.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                              {item.action.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 pr-6 text-slate-500">
                            {item.changedFields?.join(', ') || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-450 text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-4 pl-6 text-left">Date</th>
                    <th className="py-4 text-left">Status</th>
                    <th className="py-4 text-left">Type</th>
                    <th className="py-4 text-left">Initiator</th>
                    <th className="py-4 text-left">Created</th>
                    <th className="py-4 text-left pr-6">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px] text-slate-700">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="py-4 pl-6 font-medium text-slate-900">
                        {new Date(log.startedAt).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.status === 'completed' ? 'bg-green-100 text-green-800' :
                            log.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{log.syncType}</td>
                      <td className="py-4 text-slate-500">{log.initiatedBy?.name || 'System'}</td>
                      <td className="py-4 text-slate-500 font-semibold">{log.createdCount}</td>
                      <td className="py-4 text-slate-500 font-semibold pr-6">{log.updatedCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagadaSync;
