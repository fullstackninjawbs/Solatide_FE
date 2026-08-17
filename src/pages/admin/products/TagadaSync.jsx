import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../../../services/api';

const TagadaSync = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('status');

  useEffect(() => {
    fetchHistory();
  }, []);

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
    if (!window.confirm('Are you sure you want to run a full sync? This will update local products with Tagada data.')) {
      return;
    }
    
    try {
      setSyncing(true);
      setError(null);
      const res = await apiService.runTagadaSync();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Sync failed.');
      await fetchHistory();
      setActiveTab('history');
      setPreview(null);
      alert('Sync completed successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tagada Product Sync</h1>
          <p className="text-gray-600">Synchronize products and variants from Tagada to your local database.</p>
        </div>
        <div className="flex space-x-3">
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

      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('status')}
              className={`${
                activeTab === 'status'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Status & Overview
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`${
                activeTab === 'preview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Preview ({preview ? preview.length : 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Sync History
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'status' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Sync Information</h3>
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
                  Tagada is the source of truth for commerce data (names, descriptions, pricing, inventory). 
                  Syncing will update local products without overwriting local-only fields like Batches, COAs, 
                  Purity results, or SEO settings. Run a preview first to see what will change.
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tagada Variant ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.tagadaProductId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.action === 'created' ? 'bg-green-100 text-green-800' : 
                                item.action === 'updated' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {item.action.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.startedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.syncType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.initiatedBy?.name || 'System'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.createdCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.updatedCount}</td>
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
