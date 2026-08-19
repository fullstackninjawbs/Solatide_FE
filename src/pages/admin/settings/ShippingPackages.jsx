import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { Package, Mail, Briefcase, Plus, Trash2, Edit2, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../../components/admin/feedback/ConfirmProvider';
import { AdminPrimaryButton } from '../../../components/admin/AdminPrimaryButton';
import { AdminSecondaryButton } from '../../../components/admin/AdminSecondaryButton';

const ShippingPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        type: 'box',
        dimensions: { length: '', width: '', height: '' },
        weight: { value: '', unit: 'kg' },
        isDefault: false
    });

    const { confirm } = useConfirm();

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await apiService.getShippingPackages();
            const data = await res.json();
            if (data.success) {
                setPackages(data.packages);
            } else {
                toast.error(data.message || 'Failed to fetch packages');
            }
        } catch (error) {
            toast.error('Network error while fetching packages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleOpenModal = (pkg = null) => {
        if (pkg) {
            setEditingId(pkg._id);
            setForm({
                name: pkg.name,
                type: pkg.type,
                dimensions: {
                    length: pkg.dimensions?.length || '',
                    width: pkg.dimensions?.width || '',
                    height: pkg.dimensions?.height || ''
                },
                weight: {
                    value: pkg.weight?.value || '',
                    unit: pkg.weight?.unit || 'kg'
                },
                isDefault: pkg.isDefault || false
            });
        } else {
            setEditingId(null);
            setForm({
                name: '',
                type: 'box',
                dimensions: { length: '', width: '', height: '' },
                weight: { value: '', unit: 'kg' },
                isDefault: false
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'Package name is required';
        if (!form.type) return 'Package type is required';
        if (!form.weight.value || isNaN(form.weight.value) || Number(form.weight.value) <= 0) return 'Valid positive weight is required';
        
        // Dimensions required for Box and Soft package
        if (form.type !== 'envelope') {
            if (!form.dimensions.length || !form.dimensions.width || !form.dimensions.height) {
                return 'All dimensions (Length, Width, Height) are required for this package type';
            }
            if (Number(form.dimensions.length) <= 0 || Number(form.dimensions.width) <= 0 || Number(form.dimensions.height) <= 0) {
                return 'Dimensions must be valid positive numbers';
            }
        } else {
            // Envelope might not need height, but if provided, must be positive
            if (form.dimensions.length && Number(form.dimensions.length) <= 0) return 'Length must be positive';
            if (form.dimensions.width && Number(form.dimensions.width) <= 0) return 'Width must be positive';
            if (form.dimensions.height && Number(form.dimensions.height) <= 0) return 'Height must be positive';
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...form,
                dimensions: {
                    length: form.dimensions.length ? Number(form.dimensions.length) : 0,
                    width: form.dimensions.width ? Number(form.dimensions.width) : 0,
                    height: form.dimensions.height ? Number(form.dimensions.height) : 0,
                    unit: 'cm'
                },
                weight: {
                    value: Number(form.weight.value),
                    unit: form.weight.unit
                }
            };

            let res;
            if (editingId) {
                res = await apiService.updateShippingPackage(editingId, payload);
            } else {
                res = await apiService.createShippingPackage(payload);
            }

            const data = await res.json();
            if (data.success) {
                toast.success(editingId ? 'Package updated successfully.' : 'Package created successfully.');
                fetchPackages();
                setIsModalOpen(false);
            } else {
                toast.error(data.message || 'Unable to save package. Please check the details and try again.');
            }
        } catch (err) {
            toast.error('Network error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (pkg) => {
        if (pkg.isDefault) {
            toast.error('This package is currently in use as the default and cannot be deleted.');
            return;
        }

        const isConfirmed = await confirm({
            title: 'Delete package?',
            message: `This will remove '${pkg.name}' from your saved shipping packages. This cannot be undone.`,
            confirmLabel: 'Delete package',
            cancelLabel: 'Cancel',
            variant: 'danger'
        });

        if (isConfirmed) {
            try {
                const res = await apiService.deleteShippingPackage(pkg._id);
                const data = await res.json();
                if (data.success) {
                    toast.success('Package deleted successfully.');
                    setPackages(packages.filter(p => p._id !== pkg._id));
                } else {
                    toast.error(data.message || 'Failed to delete package.');
                }
            } catch (error) {
                toast.error('Network error');
            }
        }
    };

    const handleSetDefault = async (pkg) => {
        if (pkg.isDefault) return;
        
        try {
            const res = await apiService.setDefaultShippingPackage(pkg._id);
            const data = await res.json();
            if (data.success) {
                toast.success('Default shipping package updated.');
                fetchPackages();
            } else {
                toast.error(data.message || 'Unable to update the default package.');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const getPackageIcon = (type) => {
        switch (type) {
            case 'box': return <Package className="w-5 h-5 text-slate-500" />;
            case 'envelope': return <Mail className="w-5 h-5 text-slate-500" />;
            case 'soft_package': return <Briefcase className="w-5 h-5 text-slate-500" />;
            default: return <Package className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="space-y-6 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-brand-navy tracking-tight flex items-center gap-2">
                        <Package className="w-6 h-6 text-brand-navy" />
                        Shipping Packages
                    </h1>
                    <p className="text-[14px] text-slate-500 mt-1">
                        Manage physical packages used for shipping calculations and labels.
                    </p>
                </div>
                <AdminPrimaryButton onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4" />
                    Add Package
                </AdminPrimaryButton>
            </div>

            <div>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#102A5C]"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        {packages.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-[16px] font-semibold text-slate-700">No packages saved</h3>
                                <p className="text-[14px] text-slate-500 mt-1 mb-4">You haven't defined any shipping packages yet.</p>
                                <AdminSecondaryButton onClick={() => handleOpenModal()}>
                                    <Plus className="w-4 h-4" /> Add your first package
                                </AdminSecondaryButton>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Package</th>
                                        <th className="px-6 py-4 font-semibold">Dimensions</th>
                                        <th className="px-6 py-4 font-semibold">Weight</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {packages.map(pkg => (
                                        <tr key={pkg._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                                        {getPackageIcon(pkg.type)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-[15px] text-slate-800">{pkg.name}</span>
                                                            {pkg.isDefault && (
                                                                <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf7ee] px-2 py-0.5 text-[11px] font-bold tracking-wide text-[#16a34a] border border-[#16a34a]/20">
                                                                    <ShieldCheck className="w-3 h-3" /> Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[13px] text-slate-500 capitalize">{pkg.type.replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[14px] text-slate-600 font-medium">
                                                    {pkg.dimensions?.length || 0} × {pkg.dimensions?.width || 0} × {pkg.dimensions?.height || 0} cm
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[14px] text-slate-600 font-medium">
                                                    {pkg.weight?.value} {pkg.weight?.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {!pkg.isDefault && (
                                                        <button 
                                                            onClick={() => handleSetDefault(pkg)}
                                                            className="px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                                        >
                                                            Set as default
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleOpenModal(pkg)}
                                                        className="text-[14px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(pkg)}
                                                        className="text-[14px] font-semibold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                                                        disabled={pkg.isDefault}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-[20px] font-bold text-[#1E293B]">
                                {editingId ? 'Edit package' : 'Add package'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            
                            <div className="space-y-6">
                                {/* Package Type */}
                                <div>
                                    <label className="block text-[14px] font-bold text-slate-700 mb-3">Package Type</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'box', label: 'Box', icon: Package },
                                            { id: 'envelope', label: 'Envelope', icon: Mail },
                                            { id: 'soft_package', label: 'Soft package', icon: Briefcase }
                                        ].map(type => (
                                            <div 
                                                key={type.id}
                                                onClick={() => setForm({ ...form, type: type.id })}
                                                className={`flex flex-col items-center justify-center gap-2 h-24 rounded-xl cursor-pointer transition-all ${
                                                    form.type === type.id 
                                                        ? 'border-[2px] border-[#1E293B] bg-slate-50 text-[#1E293B]' 
                                                        : 'border border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                            >
                                                <type.icon className={`w-6 h-6 ${form.type === type.id ? 'text-[#1E293B]' : 'text-slate-400'}`} />
                                                <span className={`text-[13px] ${form.type === type.id ? 'font-semibold' : 'font-medium'}`}>{type.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Package Name */}
                                <div>
                                    <label className="block text-[14px] font-bold text-slate-700 mb-2">Package Name</label>
                                    <input 
                                        type="text" 
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-white border border-slate-200 text-slate-800 text-[14px] rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none px-4 py-2.5 transition-all"
                                        placeholder="Padded Mailer"
                                        maxLength={100}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Dimensions */}
                                    <div className="min-w-0">
                                        <label className="block text-[14px] font-bold text-slate-700 mb-2">Dimensions (cm)</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={form.dimensions.length}
                                                onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, length: e.target.value } })}
                                                className="w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-[14px] rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none text-center px-2 py-2.5 transition-all"
                                                min="0.1" step="0.1"
                                                required={form.type !== 'envelope'}
                                            />
                                            <span className="text-slate-400 text-[12px] font-bold font-mono">x</span>
                                            <input 
                                                type="number" 
                                                value={form.dimensions.width}
                                                onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, width: e.target.value } })}
                                                className="w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-[14px] rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none text-center px-2 py-2.5 transition-all"
                                                min="0.1" step="0.1"
                                                required={form.type !== 'envelope'}
                                            />
                                            <span className="text-slate-400 text-[12px] font-bold font-mono">x</span>
                                            <input 
                                                type="number" 
                                                value={form.dimensions.height}
                                                onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, height: e.target.value } })}
                                                className="w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-[14px] rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none text-center px-2 py-2.5 transition-all"
                                                min="0.1" step="0.1"
                                                required={form.type !== 'envelope'}
                                            />
                                        </div>
                                    </div>

                                    {/* Weight */}
                                    <div className="min-w-0">
                                        <label className="block text-[14px] font-bold text-slate-700 mb-2">Weight (empty)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" 
                                                value={form.weight.value}
                                                onChange={(e) => setForm({ ...form, weight: { ...form.weight, value: e.target.value } })}
                                                className="flex-1 min-w-0 bg-white border border-slate-200 text-slate-800 text-[14px] rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none px-4 py-2.5 transition-all"
                                                min="0.1" step="0.1"
                                                required
                                            />
                                            <select
                                                value={form.weight.unit}
                                                onChange={(e) => setForm({ ...form, weight: { ...form.weight, unit: e.target.value } })}
                                                className="w-[72px] shrink-0 bg-white border border-slate-200 text-slate-800 text-[14px] font-medium rounded-xl focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] outline-none px-2 py-2.5 cursor-pointer text-center"
                                            >
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Default Checkbox */}
                                <div className="p-4 bg-white rounded-xl border border-slate-200">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={form.isDefault}
                                            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                                            className="w-[18px] h-[18px] rounded text-[#1E293B] border-slate-300 focus:ring-[#1E293B] mt-0.5 cursor-pointer"
                                        />
                                        <div>
                                            <span className="block text-[14px] font-bold text-[#1E293B]">Use as default package for all products</span>
                                            <span className="block text-[13px] text-slate-500 mt-1">Used as the default package when calculating shipping rates and when purchasing shipping labels.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 bg-white border border-slate-200 text-[#1E293B] text-[14px] font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0ea5e9] text-white text-[14px] font-bold rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShippingPackages;
