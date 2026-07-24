import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Copy, Tag, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import CustomDropdown from '../../components/CustomDropdown';
import { AdminPrimaryButton } from '../../components/admin/AdminPrimaryButton';

const DiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Local UI state for toggles that don't directly map to single values
  const [minReqType, setMinReqType] = useState('none'); // 'none', 'amount', 'quantity'
  const [limitTotalUses, setLimitTotalUses] = useState(false);
  const [limitPerCustomer, setLimitPerCustomer] = useState(false);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    value: '',
    appliesTo: 'all',
    minPurchase: 0,
    minQuantity: 0,
    maxUses: 0,
    usesSoFar: 0,
    perCustomerLimit: 0,
    activeFrom: '',
    activeTo: '',
    status: 'active',
    combinations: {
      product: false,
      order: false,
      shipping: false
    },
    tags: [],
    salesChannelAccess: true
  });

  useEffect(() => {
    if (isEditing) {
      const fetchDiscount = async () => {
        try {
          const res = await apiService.getAdminDiscountById(id);
          const data = await res.json();
          if (data.success && data.data.discount) {
            const d = data.data.discount;
            setFormData({
              code: d.code || '',
              type: d.type || 'percent',
              value: d.value || '',
              appliesTo: d.appliesTo || 'all',
              minPurchase: d.minPurchase || 0,
              minQuantity: d.minQuantity || 0,
              maxUses: d.maxUses || 0,
              usesSoFar: d.usesSoFar || 0,
              perCustomerLimit: d.perCustomerLimit || 0,
              activeFrom: d.activeFrom ? new Date(d.activeFrom).toISOString().slice(0, 16) : '',
              activeTo: d.activeTo ? new Date(d.activeTo).toISOString().slice(0, 16) : '',
              status: d.status || 'active',
              combinations: d.combinations || { product: false, order: false, shipping: false },
              tags: d.tags || [],
              salesChannelAccess: d.salesChannelAccess !== undefined ? d.salesChannelAccess : true
            });

            // Sync UI toggles
            if (d.minPurchase > 0) setMinReqType('amount');
            else if (d.minQuantity > 0) setMinReqType('quantity');
            else setMinReqType('none');

            if (d.maxUses > 0) setLimitTotalUses(true);
            if (d.perCustomerLimit > 0) setLimitPerCustomer(true);
            if (d.activeTo) setHasEndDate(true);

          } else {
            setError('Failed to fetch discount details.');
          }
        } catch (err) {
          setError('Error connecting to server.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDiscount();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('combinations.')) {
      const comboKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        combinations: { ...prev.combinations, [comboKey]: checked }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        minPurchase: minReqType === 'amount' ? Number(formData.minPurchase) : 0,
        minQuantity: minReqType === 'quantity' ? Number(formData.minQuantity) : 0,
        maxUses: limitTotalUses ? Number(formData.maxUses) : 0,
        perCustomerLimit: limitPerCustomer ? 1 : 0,
        activeTo: hasEndDate ? formData.activeTo : null
      };

      const res = await apiService.saveAdminDiscount(isEditing ? id : null, payload);
      const data = await res.json();

      if (data.success) {
        navigate('/admin/discounts');
      } else {
        setError(data.message || 'Failed to save discount.');
      }
    } catch (err) {
      setError('Error saving discount.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/discounts" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              {isEditing ? formData.code : 'Create Discount'}
            </h2>
            <p className="text-slate-500 text-[14px]">
              {isEditing ? 'Amount off order' : 'Create a new discount code'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CustomDropdown
            value={formData.status}
            onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'expired', label: 'Expired' }
            ]}
          />
          <AdminPrimaryButton
            onClick={handleSubmit}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </AdminPrimaryButton>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Main Configuration */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card: Amount off order */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Amount off order</h3>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[13px] font-medium text-slate-700">Discount code</label>
                <button type="button" onClick={handleGenerateCode} className="text-[13px] text-brand-blue hover:underline font-medium">
                  Generate random code
                </button>
              </div>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all uppercase"
              />
              <p className="text-[12.5px] text-slate-500 mt-2">Customers must enter this code at checkout.</p>
            </div>
          </div>

          {/* Card: Discount Value */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Discount value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  value={formData.type}
                  onChange={(val) => setFormData(prev => ({ ...prev, type: val }))}
                  options={[
                    { value: 'percent', label: 'Percentage' },
                    { value: 'fixed', label: 'Fixed Amount' }
                  ]}
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  step={formData.type === 'percent' ? '1' : '0.01'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] text-slate-800 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all pr-8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[14px]">
                  {formData.type === 'percent' ? '%' : '$'}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Eligibility */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Eligibility</h3>
            <CustomDropdown
              value={formData.appliesTo}
              onChange={(val) => setFormData(prev => ({ ...prev, appliesTo: val }))}
              options={[
                { value: 'all', label: 'All customers' },
              ]}
            />
          </div>

          {/* Card: Minimum Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Minimum purchase requirements</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={minReqType === 'none'} onChange={() => setMinReqType('none')} className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-slate-300" />
                <span className="text-[14px] text-slate-700">No minimum requirements</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={minReqType === 'amount'} onChange={() => setMinReqType('amount')} className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-slate-300" />
                <span className="text-[14px] text-slate-700">Minimum purchase amount ($)</span>
              </label>
              {minReqType === 'amount' && (
                <div className="pl-7 pr-4">
                  <input type="number" name="minPurchase" value={formData.minPurchase} onChange={handleChange} className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-slate-200 text-[14px]" placeholder="0.00" />
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={minReqType === 'quantity'} onChange={() => setMinReqType('quantity')} className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-slate-300" />
                <span className="text-[14px] text-slate-700">Minimum quantity of items</span>
              </label>
              {minReqType === 'quantity' && (
                <div className="pl-7 pr-4">
                  <input type="number" name="minQuantity" value={formData.minQuantity} onChange={handleChange} className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-slate-200 text-[14px]" placeholder="0" />
                </div>
              )}
            </div>
          </div>

          {/* Card: Maximum Uses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Maximum discount uses</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={limitTotalUses} onChange={(e) => setLimitTotalUses(e.target.checked)} className="w-4 h-4 mt-0.5 text-brand-blue rounded border-slate-300" />
                <div className="flex-1">
                  <span className="text-[14px] text-slate-700">Limit number of times this discount can be used in total</span>
                  {limitTotalUses && (
                    <div className="mt-3">
                      <input type="number" name="maxUses" value={formData.maxUses} onChange={handleChange} className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-slate-200 text-[14px]" />
                    </div>
                  )}
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={limitPerCustomer} onChange={(e) => setLimitPerCustomer(e.target.checked)} className="w-4 h-4 text-brand-blue rounded border-slate-300" />
                <span className="text-[14px] text-slate-700">Limit to one use per customer</span>
              </label>
            </div>
          </div>

          {/* Card: Combinations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Combinations</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="combinations.product" checked={formData.combinations.product} onChange={handleChange} className="w-4 h-4 text-brand-blue rounded border-slate-300" />
                <span className="text-[14px] text-slate-700">Product discounts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="combinations.order" checked={formData.combinations.order} onChange={handleChange} className="w-4 h-4 text-brand-blue rounded border-slate-300" />
                <span className="text-[14px] text-slate-700">Order discounts</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="combinations.shipping" checked={formData.combinations.shipping} onChange={handleChange} className="w-4 h-4 text-brand-blue rounded border-slate-300" />
                <span className="text-[14px] text-slate-700">Shipping discounts</span>
              </label>
            </div>
          </div>

          {/* Card: Active dates */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="font-semibold text-slate-800 text-[16px]">Active dates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] text-slate-700 mb-1.5">Start date</label>
                <input type="datetime-local" name="activeFrom" value={formData.activeFrom} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] text-slate-800 focus:outline-none focus:border-brand-blue" />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={hasEndDate} onChange={(e) => setHasEndDate(e.target.checked)} className="w-4 h-4 text-brand-blue rounded border-slate-300" />
              <span className="text-[14px] text-slate-700">Set end date</span>
            </label>

            {hasEndDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-slate-700 mb-1.5">End date</label>
                  <input type="datetime-local" name="activeTo" value={formData.activeTo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] text-slate-800 focus:outline-none focus:border-brand-blue" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="space-y-6">

          {/* Summary Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800 text-[16px] mb-1">{formData.code || 'No code yet'}</h3>
              <p className="text-[13px] text-slate-500">Amount off order</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 text-[14px] mb-3">Details</h4>
              <ul className="space-y-2.5 text-[13.5px] text-slate-600 list-disc pl-4 marker:text-slate-300">
                <li>All customers</li>
                <li>For Online Store</li>
                {formData.value ? (
                  <li>{formData.value}{formData.type === 'percent' ? '%' : '$'} off {formData.appliesTo === 'all' ? 'entire order' : formData.appliesTo}</li>
                ) : null}

                {minReqType === 'none' && <li>No minimum purchase requirement</li>}
                {minReqType === 'amount' && formData.minPurchase > 0 && <li>Minimum purchase of ${formData.minPurchase}</li>}
                {minReqType === 'quantity' && formData.minQuantity > 0 && <li>Minimum quantity of {formData.minQuantity} items</li>}

                {limitTotalUses && formData.maxUses > 0 && <li>Limit of {formData.maxUses} uses in total</li>}
                {limitPerCustomer && <li>Limit of 1 use per customer</li>}

                {(formData.combinations.product || formData.combinations.order || formData.combinations.shipping) ? (
                  <li>Combines with: {
                    [formData.combinations.product && 'product', formData.combinations.order && 'order', formData.combinations.shipping && 'shipping'].filter(Boolean).join(', ')
                  } discounts</li>
                ) : (
                  <li>Can't combine with other discounts</li>
                )}

                <li>{formData.activeFrom ? `Active from ${new Date(formData.activeFrom).toLocaleDateString()}` : 'No start date set'}</li>
              </ul>
            </div>

            {isEditing && (
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-slate-800 text-[14px] mb-2">Performance</h4>
                <div className="text-[13.5px] text-slate-600 mb-3">• {formData.usesSoFar || 0} used</div>
                <button type="button" className="text-[13.5px] text-brand-blue hover:underline font-medium">View the sales by discount report</button>
              </div>
            )}
          </div>

          {/* Sales channel access */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Sales channel access</h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="salesChannelAccess" checked={formData.salesChannelAccess} onChange={handleChange} className="w-4 h-4 mt-0.5 text-brand-blue rounded border-slate-300" />
              <span className="text-[14px] text-slate-700">Allow discount to be featured on selected channels</span>
            </label>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 text-[16px]">Tags</h3>
            <div className="border border-slate-200 rounded-xl p-1.5 bg-slate-50 focus-within:bg-white focus-within:border-brand-blue transition-colors flex flex-wrap gap-1.5">
              {formData.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-[13px] px-2.5 py-1 rounded-md">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-600">&times;</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags"
                className="flex-1 bg-transparent border-none outline-none text-[14px] p-1.5 min-w-[100px]"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiscountForm;
