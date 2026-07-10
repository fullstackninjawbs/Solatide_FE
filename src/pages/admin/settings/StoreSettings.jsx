import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { Store, MapPin, ChevronRight, X } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { Country, State } from 'country-state-city';
import toast from 'react-hot-toast';

const countryOptions = Country.getAllCountries().map(country => ({
    value: country.name,
    label: country.name
}));

const StoreSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Forms
    const [contactForm, setContactForm] = useState({ storeName: '', contactEmail: '', contactPhone: '' });
    const [addressForm, setAddressForm] = useState({
        name: '', company: '', street1: '', street2: '', city: '', state: '', zip: '', country: '', phone: ''
    });



    const fetchSettings = async () => {
        try {
            const res = await apiService.getStoreSettings();
            const data = await res.json();
            if (data.success && data.data.settings) {
                setSettings(data.data.settings);
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            toast.error('Failed to load store settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const openContactModal = () => {
        setContactForm({
            storeName: settings?.storeName || '',
            contactEmail: settings?.contactEmail || '',
            contactPhone: settings?.contactPhone || ''
        });
        setIsContactModalOpen(true);
    };

    const openAddressModal = () => {
        const addr = settings?.shippingOrigin || {};
        setAddressForm({
            name: addr.name || '',
            company: addr.company || '',
            street1: addr.street1 || '',
            street2: addr.street2 || '',
            city: addr.city || '',
            state: addr.state || '',
            zip: addr.zip || '',
            country: addr.country || '',
            phone: addr.phone || ''
        });
        setIsAddressModalOpen(true);
    };

    const handleSaveContact = async () => {
        setSaving(true);
        try {
            const res = await apiService.updateStoreSettings(contactForm);
            const data = await res.json();
            if (data.success) {
                setSettings(data.data.settings);
                toast.success('Contact details updated');
                setIsContactModalOpen(false);
            } else {
                toast.error(data.message || 'Failed to update');
            }
        } catch (err) {
            toast.error('Network error');
        } finally {
            setSaving(false);
            setIsContactModalOpen(false);
            setIsAddressModalOpen(false);

        }
    };

    const handleSaveAddress = async () => {
        setSaving(true);
        try {
            const res = await apiService.updateStoreSettings({ shippingOrigin: addressForm });
            const data = await res.json();
            if (data.success) {
                setSettings(data.data.settings);
                toast.success('Address updated');
                setIsAddressModalOpen(false);
            } else {
                toast.error(data.message || 'Failed to update');
            }
        } catch (err) {
            toast.error('Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto animate-pulse">
                <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
                <div className="h-32 bg-white rounded-xl border border-slate-200" />
            </div>
        );
    }

    const formatAddress = (addr) => {
        if (!addr || (!addr.street1 && !addr.city)) return 'No address configured';
        const parts = [
            addr.company,
            addr.street1,
            addr.street2,
            [addr.city, addr.state, addr.zip].filter(Boolean).join(' '),
            addr.country
        ];
        return parts.filter(Boolean).join(', ');
    };

    return (
        <div className="p-8 mx-auto font-sans text-slate-800">
            <h1 className="text-2xl font-bold text-brand-navy mb-8">Settings</h1>

            <div className="mb-8">
                <h2 className="text-[15px] font-bold text-slate-800 mb-3 ml-1">Store contact details</h2>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Contact Row */}
                    <button
                        onClick={openContactModal}
                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-slate-500 group-hover:text-slate-700 transition-colors">
                                <Store size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-[14.5px] font-semibold text-slate-800">
                                    {settings?.storeName || 'Store Name'}
                                </h3>
                                <p className="text-[14px] text-slate-500 mt-0.5">
                                    {settings?.contactEmail || 'No email'} · {settings?.contactPhone || 'No phone number'}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>

                    {/* Address Row */}
                    <button
                        onClick={openAddressModal}
                        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 text-slate-500 group-hover:text-slate-700 transition-colors">
                                <MapPin size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-[14.5px] font-semibold text-slate-800">
                                    Store address
                                </h3>
                                <p className="text-[14px] text-slate-500 mt-0.5">
                                    {formatAddress(settings?.shippingOrigin)}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Contact Modal */}
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Store contact details</h2>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Store name</label>
                                <input
                                    type="text"
                                    value={contactForm.storeName}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, storeName: e.target.value }))}
                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Contact email</label>
                                <input
                                    type="email"
                                    value={contactForm.contactEmail}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">Contact phone</label>
                                <input
                                    type="text"
                                    value={contactForm.contactPhone}
                                    onChange={(e) => setContactForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsContactModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveContact}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-brand-navy hover:bg-brand-navy/90 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-gray-900">Edit store address</h2>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto px-1">
                            {(() => {
                                const selectedCountryIso = Country.getAllCountries().find(c => c.name === addressForm.country)?.isoCode || 'AU';
                                const stateOptions = State.getStatesOfCountry(selectedCountryIso).map(state => ({
                                    value: state.name,
                                    label: state.name
                                }));

                                return (
                                    <>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Company (optional)</label>
                                            <input
                                                type="text"
                                                value={addressForm.company}
                                                onChange={(e) => setAddressForm(prev => ({ ...prev, company: e.target.value }))}
                                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Address / Street 1</label>
                                            <input
                                                type="text"
                                                value={addressForm.street1}
                                                onChange={(e) => setAddressForm(prev => ({ ...prev, street1: e.target.value }))}
                                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Apartment, suite, etc. / Street 2</label>
                                            <input
                                                type="text"
                                                value={addressForm.street2}
                                                onChange={(e) => setAddressForm(prev => ({ ...prev, street2: e.target.value }))}
                                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Country</label>
                                            <CustomDropdown
                                                value={addressForm.country}
                                                onChange={(val) => setAddressForm(prev => ({
                                                    ...prev,
                                                    country: val,
                                                    state: '' // reset state when country changes
                                                }))}
                                                placeholder="Select a country"
                                                options={countryOptions}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">State / Province</label>
                                                <CustomDropdown
                                                    value={addressForm.state}
                                                    onChange={(val) => setAddressForm(prev => ({ ...prev, state: val }))}
                                                    placeholder="Select a state/territory"
                                                    options={stateOptions}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-semibold text-gray-700 mb-1">ZIP / Postal code</label>
                                                <input
                                                    type="text"
                                                    value={addressForm.zip}
                                                    onChange={(e) => setAddressForm(prev => ({ ...prev, zip: e.target.value }))}
                                                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                                />
                                            </div>

                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-700 mb-1">Phone (optional)</label>
                                            <input
                                                type="text"
                                                value={addressForm.phone}
                                                onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-[14px] focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                                            />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsAddressModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAddress}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-brand-navy hover:bg-brand-navy/90 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreSettings;
