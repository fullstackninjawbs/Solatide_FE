import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Search, Users, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import Pagination from '../../components/Pagination';

const CustomerList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const urlQ = searchParams.get('q') || '';

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState(urlQ);
    const debounceRef = useRef(null);

    // Sync input box when browser back/forward changes URL query
    useEffect(() => {
        setSearchQuery(urlQ);
    }, [urlQ]);

    // Debounce search query and update URL query parameters
    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (searchQuery === currentQ) return;

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            const nextParams = new URLSearchParams(searchParams);
            if (searchQuery.trim()) {
                nextParams.set('q', searchQuery.trim());
            } else {
                nextParams.delete('q');
            }
            nextParams.set('page', '1');
            setSearchParams(nextParams);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [searchQuery, searchParams, setSearchParams]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            if (urlQ) params.set('search', urlQ);

            const res = await apiService.getAdminCustomers(params.toString());
            const data = await res.json();
            if (res.ok && data.success) {
                setCustomers(data.data.customers);
                setTotal(data.total ?? data.data.pagination?.total ?? 0);
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page, limit, urlQ]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger immediate sync
        const nextParams = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            nextParams.set('q', searchQuery.trim());
        } else {
            nextParams.delete('q');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const handlePageChange = (newPage, newLimit) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(newPage));
        nextParams.set('limit', String(newLimit));
        setSearchParams(nextParams);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-6 h-6 text-blue-600" />
                        Customers
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your customer database and view their purchase history.</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Search
                    </button>
                </form>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Orders</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Spent</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">Loading customers...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">No customers found.</td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{customer.country || '-'}</td>
                                        <td className="py-4 px-6 text-right font-medium text-gray-900">{customer.orderCount}</td>
                                        <td className="py-4 px-6 text-right font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</td>
                                        <td className="py-4 px-6 text-center">
                                            {customer.banned ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    <Ban className="w-3 h-3" /> Banned
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle className="w-3 h-3" /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link
                                                to={`/admin/customers/${customer._id}`}
                                                className="inline-flex items-center justify-center px-4 py-1.5 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {!loading && customers.length > 0 && (
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

export default CustomerList;
