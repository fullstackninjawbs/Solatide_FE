import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  User,
  Plus,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard,
  FileText,
  DollarSign,
  X,
  ChevronDown
} from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import CustomDropdown from '../../components/CustomDropdown';
import { Country, State } from 'country-state-city';
import CustomAddressAutocomplete from '../../components/admin/CustomAddressAutocomplete';

const CreateOrder = () => {
  const navigate = useNavigate();

  // ── 1. Customer State ────────────────────────────────────────────────────────
  const [customerMode, setCustomerMode] = useState('search'); // 'search' | 'create'
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // ── 2. Line Items State ──────────────────────────────────────────────────────
  const [lineItems, setLineItems] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // ── 3. Shipping & Address State ──────────────────────────────────────────────
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'AU'
  });
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: 'AU'
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('Standard - $11.00');
  const [customShippingMethod, setCustomShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState('11.00');

  // ── 4. Payment & Order Metadata State ─────────────────────────────────────────
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'paid'
  const [discountTotal, setDiscountTotal] = useState('0.00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const customerDebounceRef = useRef(null);

  // ── Live Customer Search Autocomplete ────────────────────────────────────────
  useEffect(() => {
    if (customerMode !== 'search' || !customerSearch.trim()) {
      setCustomerResults([]);
      return;
    }

    clearTimeout(customerDebounceRef.current);
    customerDebounceRef.current = setTimeout(async () => {
      try {
        setSearchingCustomer(true);
        const res = await apiService.getAdminCustomers?.(`search=${encodeURIComponent(customerSearch.trim())}&limit=6`);
        if (res && res.ok) {
          const json = await res.json();
          if (json.success) {
            setCustomerResults(json.data?.customers || json.customers || []);
          }
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      } finally {
        setSearchingCustomer(false);
      }
    }, 350);

    return () => clearTimeout(customerDebounceRef.current);
  }, [customerSearch, customerMode]);

  // Select existing customer
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    const names = (customer.name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    setCustomerForm({
      firstName,
      lastName,
      email: customer.email || '',
      phone: customer.phone || ''
    });

    // Populate saved address if available
    if (customer.defaultAddress) {
      setShippingAddress({
        name: customer.defaultAddress.name || customer.name || '',
        street1: customer.defaultAddress.street1 || '',
        street2: customer.defaultAddress.street2 || '',
        city: customer.defaultAddress.city || '',
        state: customer.defaultAddress.state || 'VIC',
        zip: customer.defaultAddress.zip || '',
        country: customer.defaultAddress.country || 'AU'
      });
    } else {
      setShippingAddress(prev => ({ ...prev, name: customer.name || '' }));
    }

    setCustomerResults([]);
    setCustomerSearch('');
  };

  // Clear selected customer
  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setCustomerForm({ firstName: '', lastName: '', email: '', phone: '' });
  };

  // ── Fetch Products for Modal Picker ──────────────────────────────────────────
  const fetchProducts = async (query = '') => {
    try {
      setLoadingProducts(true);
      const queryStr = query ? `search=${encodeURIComponent(query)}&limit=100` : `limit=100`;
      const res = await apiService.getProducts?.(queryStr) ||
        await fetch(`/api/products?${queryStr}`);
      const json = await res.json();
      if (json.success || json.data) {
        const prods = json.data?.products || json.data || json.products || [];
        setAvailableProducts(prods);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleOpenProductModal = () => {
    setProductModalOpen(true);
    fetchProducts(productSearch);
  };

  // Add Product / Variant to Line Items
  const handleAddProductToOrder = (product, variant = null) => {
    const defaultPrice = variant ? (typeof variant.price === 'number' ? variant.price : parseFloat(String(variant.price).replace(/[^0-9.]/g, '') || '0'))
      : (typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '') || '0'));

    const newItem = {
      productId: product._id,
      variantId: variant ? variant._id || variant.sku : undefined,
      title: product.name,
      variantTitle: variant ? (variant.name || variant.title || '') : '',
      sku: variant ? (variant.sku || product.sku) : product.sku,
      quantity: 1,
      unitPrice: defaultPrice || 0,
      originalPrice: defaultPrice || 0,
      discountAmount: 0,
      productImageUrl: product.images?.[0]?.url || product.imageUrl || product.image || '',
      stockQty: variant ? (variant.stockQty ?? product.stockQuantity) : product.stockQuantity
    };

    setLineItems(prev => [...prev, newItem]);
    setProductModalOpen(false);
    toast.success(`Added ${product.name} to order`);
  };

  // Line item handlers
  const handleUpdateQuantity = (index, delta) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i === index) {
        const nextQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: nextQty };
      }
      return item;
    }));
  };

  const handleUpdatePrice = (index, val) => {
    const num = parseFloat(val) || 0;
    setLineItems(prev => prev.map((item, i) => i === index ? { ...item, unitPrice: num } : item));
  };

  const handleUpdateDiscount = (index, val) => {
    const num = parseFloat(val) || 0;
    setLineItems(prev => prev.map((item, i) => i === index ? { ...item, discountAmount: num } : item));
  };

  const handleRemoveLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  // ── Financial Math ──────────────────────────────────────────────────────────
  const subtotal = lineItems.reduce((sum, item) => {
    const lineVal = Math.max(0, (item.unitPrice * item.quantity) - (item.discountAmount || 0));
    return sum + lineVal;
  }, 0);

  const parsedShipping = parseFloat(shippingCost) || 0;
  const parsedDiscountTotal = parseFloat(discountTotal) || 0;
  const grandTotal = Math.max(0, subtotal - parsedDiscountTotal + parsedShipping);

  // ── Form Submission ──────────────────────────────────────────────────────────
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (lineItems.length === 0) {
      setError('Please add at least one product to the order.');
      return;
    }

    if (!customerForm.email.trim()) {
      setError('Customer email is required.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        customerId: selectedCustomer?._id,
        customer: {
          firstName: customerForm.firstName.trim(),
          lastName: customerForm.lastName.trim(),
          email: customerForm.email.trim().toLowerCase(),
          phone: customerForm.phone.trim()
        },
        shippingAddressObj: {
          name: shippingAddress.name.trim() || `${customerForm.firstName} ${customerForm.lastName}`.trim(),
          street1: shippingAddress.street1.trim(),
          street2: shippingAddress.street2.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state,
          zip: shippingAddress.zip.trim(),
          country: shippingAddress.country
        },
        billingAddressObj: billingSameAsShipping ? {
          name: shippingAddress.name.trim() || `${customerForm.firstName} ${customerForm.lastName}`.trim(),
          street1: shippingAddress.street1.trim(),
          street2: shippingAddress.street2.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state,
          zip: shippingAddress.zip.trim(),
          country: shippingAddress.country
        } : {
          name: billingAddress.name.trim() || `${customerForm.firstName} ${customerForm.lastName}`.trim(),
          street1: billingAddress.street1.trim(),
          street2: billingAddress.street2.trim(),
          city: billingAddress.city.trim(),
          state: billingAddress.state,
          zip: billingAddress.zip.trim(),
          country: billingAddress.country
        },
        lineItems: lineItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.title,
          variantTitle: item.variantTitle,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountAmount: item.discountAmount || 0,
          productImageUrl: item.productImageUrl
        })),
        shippingMethod: shippingMethod === 'Custom' ? (customShippingMethod.trim() || 'Custom Shipping') : shippingMethod,
        shippingCost: parsedShipping,
        discountTotal: parsedDiscountTotal,
        notes: notes.trim(),
        paymentStatus
      };

      const res = await apiService.createAdminOrder(payload);
      const json = await res.json();

      if (json.success && json.data?.order) {
        toast.success(`Order #${json.data.order.orderNumber} created successfully!`);
        navigate(`/admin/orders/${json.data.order._id}`);
      } else {
        setError(json.message || 'Failed to create order. Please check inputs.');
      }
    } catch (err) {
      console.error('Error creating manual order:', err);
      setError('Connection error creating order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-16">
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create Order</h1>
            <p className="text-xs text-slate-500 font-medium">Create a manual or phone order directly in your store</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmitOrder}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-blue text-white hover:bg-blue-600 font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{submitting ? 'Creating Order...' : 'Save Order'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Main Form Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Customer, Line Items, Addresses */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Customer Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-navy" />
                <h3 className="text-base font-bold text-slate-900">Customer</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setCustomerMode('search'); handleClearCustomer(); }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${customerMode === 'search' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Search Existing
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomerMode('create'); handleClearCustomer(); }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${customerMode === 'create' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  New Customer
                </button>
              </div>
            </div>

            {/* Customer Search Autocomplete Mode */}
            {customerMode === 'search' && !selectedCustomer && (
              <div className="relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search existing customer by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                  />
                  {searchingCustomer && (
                    <span className="absolute right-3.5 top-3 inline-block animate-spin rounded-full h-4 w-4 border-2 border-brand-blue border-t-transparent"></span>
                  )}
                </div>

                {/* Dropdown Results */}
                {customerResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {customerResults.map(c => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="w-full text-left p-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{c.name || 'Unnamed Customer'}</div>
                          <div className="text-xs text-slate-500">{c.email}</div>
                        </div>
                        <div className="text-right text-[11px] text-slate-400">
                          {c.orderCount || 0} orders
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Customer Banner */}
            {selectedCustomer && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Selected Customer</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedCustomer.name}</div>
                  <div className="text-xs text-slate-600">{selectedCustomer.email} {selectedCustomer.phone ? `• ${selectedCustomer.phone}` : ''}</div>
                </div>
                <button
                  type="button"
                  onClick={handleClearCustomer}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 bg-white rounded-lg border border-red-100 cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}

            {/* Customer Inputs Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={customerForm.firstName}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={customerForm.lastName}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+61 412 345 678"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Products & Line Items */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-navy" />
                <h3 className="text-base font-bold text-slate-900">Products</h3>
              </div>
              <button
                type="button"
                onClick={handleOpenProductModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Products</span>
              </button>
            </div>

            {/* Line items list */}
            {lineItems.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2">
                <Package className="w-8 h-8 text-slate-300" />
                <p className="text-sm font-medium">No products added yet</p>
                <button
                  type="button"
                  onClick={handleOpenProductModal}
                  className="text-xs font-bold text-brand-blue hover:underline mt-1 cursor-pointer"
                >
                  Browse catalog & add item
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Discount</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 pr-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lineItems.map((item, idx) => {
                      const lineTotal = Math.max(0, (item.unitPrice * item.quantity) - (item.discountAmount || 0));
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {item.productImageUrl ? (
                                <img src={item.productImageUrl} alt={item.title} className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                  <Package className="w-4 h-4 text-slate-400" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-900">{item.title}</div>
                                {item.variantTitle && <div className="text-[11px] text-slate-500">{item.variantTitle}</div>}
                                {item.sku && <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 border border-slate-200 rounded-lg bg-white w-20 mx-auto py-0.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(idx, -1)}
                                className="px-1.5 text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-slate-800 text-xs px-1">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(idx, 1)}
                                className="px-1.5 text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-slate-400">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => handleUpdatePrice(idx, e.target.value)}
                                className="w-20 px-2 py-1 rounded border border-slate-200 text-right text-xs font-medium focus:border-brand-blue"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-slate-400">-$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={item.discountAmount || 0}
                                onChange={(e) => handleUpdateDiscount(idx, e.target.value)}
                                className="w-16 px-2 py-1 rounded border border-slate-200 text-right text-xs font-medium focus:border-brand-blue"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            A${lineTotal.toFixed(2)}
                          </td>
                          <td className="py-3 pr-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Card 3: Shipping & Delivery Address */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-navy" />
              <h3 className="text-base font-bold text-slate-900">Shipping & Delivery</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                <CustomAddressAutocomplete
                  value={shippingAddress.street1}
                  onChange={(val) => setShippingAddress(prev => ({ ...prev, street1: val }))}
                  onSelect={(place) => {
                    const addr = place.address || {};
                    let streetNumber = addr.house_number || '';
                    let route = addr.road || '';
                    let city = addr.suburb || addr.city || addr.town || addr.village || addr.municipality || addr.state_district || '';
                    let stateName = addr.state || addr.province || addr.region || '';
                    let zip = addr.postcode || '';
                    let countryCode = addr.country_code ? addr.country_code.toUpperCase() : shippingAddress.country;

                    let streetStr = `${streetNumber} ${route}`.trim();
                    if (!streetStr) {
                      streetStr = place.name || (place.display_name ? place.display_name.split(',')[0] : '');
                    }

                    const countryStates = State.getStatesOfCountry(countryCode);
                    const matchedState = countryStates.find(s =>
                      s.name.toLowerCase() === stateName.toLowerCase() ||
                      s.isoCode.toLowerCase() === stateName.toLowerCase()
                    );
                    const finalStateCode = matchedState ? matchedState.isoCode : stateName;

                    setShippingAddress(prev => ({
                      ...prev,
                      street1: streetStr,
                      city: city || prev.city,
                      state: finalStateCode || prev.state,
                      zip: zip || prev.zip,
                      country: countryCode || prev.country
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country *</label>
                  <CustomDropdown
                    value={shippingAddress.country}
                    onChange={(val) => {
                      setShippingAddress(prev => ({ ...prev, country: val, state: '' }));
                    }}
                    options={Country.getAllCountries().map(c => ({
                      label: c.name,
                      value: c.isoCode
                    }))}
                    placeholder="Select Country"
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  {State.getStatesOfCountry(shippingAddress.country).length > 0 ? (
                    <CustomDropdown
                      value={shippingAddress.state}
                      onChange={(val) => setShippingAddress(prev => ({ ...prev, state: val }))}
                      options={State.getStatesOfCountry(shippingAddress.country).map(s => ({
                        label: `${s.isoCode} - ${s.name}`,
                        value: s.isoCode
                      }))}
                      placeholder="Select State"
                      fullWidth
                    />
                  ) : (
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State / Province"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Suburb / City *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="Postcode"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Method</label>
                    <select
                      value={shippingMethod}
                      onChange={(e) => {
                        const val = e.target.value;
                        setShippingMethod(val);
                        if (val === 'Standard - $11.00') setShippingCost('11.00');
                        else if (val === 'Express - $15.00') setShippingCost('15.00');
                        else setShippingCost('');
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-brand-blue font-medium text-slate-800"
                    >
                      <option value="Standard - $11.00">Standard - $11.00</option>
                      <option value="Express - $15.00">Express - $15.00</option>
                      <option value="Custom">Custom Method...</option>
                    </select>
                  </div>
                  {shippingMethod === 'Custom' && (
                    <input
                      type="text"
                      value={customShippingMethod}
                      onChange={(e) => setCustomShippingMethod(e.target.value)}
                      placeholder="Enter custom shipping name"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Cost (A$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Payment Status */}
        <div className="space-y-6">

          {/* Payment Status & Admin Notes Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-navy" />
              <h3 className="text-base font-bold text-slate-900">Payment & Notes</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Payment Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('pending')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${paymentStatus === 'pending'
                    ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-400/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span>Pending Payment</span>
                  <span className="text-[10px] font-normal text-amber-600">Offline / Pay Later</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${paymentStatus === 'paid'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span>Mark as Paid</span>
                  <span className="text-[10px] font-normal text-emerald-600">Collected Manually</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Order Discount (A$)</label>
              <input
                type="number"
                step="0.01"
                value={discountTotal}
                onChange={(e) => setDiscountTotal(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Notes (Optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes e.g., Phone order created from admin panel..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>
          </div>

          {/* Order Financial Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>A${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span>A${parsedShipping.toFixed(2)}</span>
              </div>
              {parsedDiscountTotal > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Order Discount</span>
                  <span>-A${parsedDiscountTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Amount</div>
                <div className="text-2xl font-extrabold text-white">A${grandTotal.toFixed(2)}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                {paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={submitting}
              className="w-full bg-cta-gradient hover:bg-cta-gradient-hover text-white py-3 rounded-xl text-[14px] font-bold shadow-cta hover:shadow-cta-hover flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{submitting ? 'Saving Order...' : 'Save Order'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ── Product Picker Modal ──────────────────────────────────────────────── */}
      {productModalOpen && createPortal(
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Select Product to Add</h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    fetchProducts(e.target.value);
                  }}
                  placeholder="Search products by name or SKU..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {loadingProducts ? (
                <div className="py-12 flex justify-center items-center text-slate-400">
                  <span className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-brand-blue border-t-transparent"></span>
                </div>
              ) : availableProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">No products found</div>
              ) : (
                availableProducts.map((p) => (
                  <div key={p._id} className="py-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {p.images?.[0]?.url || p.imageUrl || p.image ? (
                          <img src={p.images?.[0]?.url || p.imageUrl || p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium">A${p.price} • Stock: {p.stockQuantity ?? '—'}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProductToOrder(p)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CreateOrder;
