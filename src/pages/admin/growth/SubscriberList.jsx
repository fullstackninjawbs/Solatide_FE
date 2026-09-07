import { useState, useEffect } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { apiService } from '../../../services/api';
import Pagination from '../../../components/Pagination';
import { useToast } from '../../../components/admin/feedback/ToastProvider';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';

const SubscriberList = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [total, setTotal] = useState(0);

    const toast = useToast();
    const confirm = useConfirm();

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));

            const res = await apiService.getAdminSubscribers(params.toString());
            const data = await res.json();
            if (res.ok && data.success) {
                setSubscribers(data.data);
                setTotal(data.meta?.total || 0);
            } else {
                toast.error(data.message || 'Failed to fetch subscribers');
            }
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            toast.error('An error occurred while fetching subscribers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [page, limit]);

    const handlePageChange = (newPage, newLimit) => {
        setPage(newPage);
        setLimit(newLimit);
    };

    const handleDelete = async (id) => {
        const confirmed = await confirm({
            title: 'Delete Subscriber',
            description: 'Are you sure you want to delete this subscriber? This action cannot be undone.',
            confirmLabel: 'Delete',
            variant: 'danger'
        });

        if (confirmed) {
            try {
                const res = await apiService.deleteAdminSubscriber(id);
                const data = await res.json();
                if (res.ok && data.success) {
                    toast.success('Subscriber deleted successfully');
                    fetchSubscribers();
                } else {
                    toast.error(data.message || 'Failed to delete subscriber');
                }
            } catch (error) {
                console.error('Error deleting subscriber:', error);
                toast.error('An error occurred while deleting subscriber');
            }
        }
    };

    return (
        <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Mail className="w-6 h-6 text-[#00ADEE]" />
                        Newsletter Subscribers
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your newsletter subscribers
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscribed On</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">Loading subscribers...</td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">No subscribers found.</td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            {sub.email}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 capitalize">
                                            {sub.source}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(sub.subscribedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleDelete(sub._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                title="Delete Subscriber"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && subscribers.length > 0 && (
                    <Pagination
                        page={page}
                        limit={limit}
                        total={total}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default SubscriberList;
