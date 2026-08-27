import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, Globe, EyeOff, LayoutTemplate } from 'lucide-react';
import JoditEditor from 'jodit-react';
import { apiService } from '../../../services/api';
import { useToast } from '../../../components/admin/feedback/ToastProvider';

const RESERVED_HANDLES = [
  'admin', 'product', 'products', 'cart', 'checkout', 'login',
  'register', 'account', 'search', 'collections', 'page', 'api'
];

const PageForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState({
    title: '',
    slug: '',
    content: { html: '', json: null },
    seoTitle: '',
    metaDescription: '',
    status: 'draft'
  });

  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchPage();
    }
  }, [id]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminPageById(id);
      const data = await res.json();
      setPage(data);
      setSlugDirty(true); // Don't auto-generate slug if editing
    } catch (err) {
      toast.error('Failed to load page');
      navigate('/admin/content/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setPage(prev => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug if it hasn't been manually edited
      slug: !slugDirty && !isEditing
        ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug
    }));
  };

  const handleSlugChange = (e) => {
    setSlugDirty(true);
    let newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setPage(prev => ({ ...prev, slug: newSlug }));
  };

  const validate = () => {
    if (!page.title.trim()) {
      toast.error('Please enter a page title.');
      return false;
    }
    if (!page.slug.trim()) {
      toast.error('Please enter a valid URL handle.');
      return false;
    }
    if (RESERVED_HANDLES.includes(page.slug.toLowerCase())) {
      toast.error('This URL handle is reserved and cannot be used.');
      return false;
    }
    if (page.status === 'published' && (!page.content.html || page.content.html === '<p><br></p>')) {
      toast.error('Please add content before publishing.');
      return false;
    }
    return true;
  };

  const handleSave = async (statusOverride) => {
    if (!validate()) return;
    
    const finalStatus = statusOverride || page.status;
    const payload = {
      ...page,
      status: finalStatus,
      // Sanitize slug (remove leading/trailing hyphens)
      slug: page.slug.replace(/(^-|-$)+/g, '')
    };

    setSaving(true);
    try {
      let res;
      if (isEditing) {
        res = await apiService.updateAdminPage(id, payload);
      } else {
        res = await apiService.createAdminPage(payload);
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.message || 'Failed to save');
        err.response = { data: errorData };
        throw err;
      }
      
      if (finalStatus === 'published') {
        toast.success('Page published successfully.');
      } else {
        toast.success('Page saved as draft.');
      }
      
      navigate('/admin/content/pages');
    } catch (err) {
      if (err.response?.data?.message?.includes('already in use')) {
        toast.error('This URL handle is already in use.');
      } else {
        toast.error(err.response?.data?.message || 'Unable to save the page. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const memoizedEditor = useMemo(() => {
    return (
      <JoditEditor
        ref={editorRef}
        value={page.content.html}
        config={{
          readonly: false,
          toolbarButtonSize: 'middle',
          buttons: [
            'source', '|',
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'table', 'link', 'image', '|',
            'hr', 'eraser', 'copyformat', '|',
            'undo', 'redo'
          ],
          height: 600,
          width: '100%',
          placeholder: 'Start writing your page content...',
          style: { background: '#fff', color: '#333', width: '100%' }
        }}
        onBlur={(newContent) => setPage(prev => ({
          ...prev,
          content: { ...prev.content, html: newContent }
        }))}
      />
    );
  }, [page.content?.html]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
      </div>
    );
  }

  return (
    <div className="w-full text-left font-sans space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/content/pages" 
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white text-slate-500 hover:text-brand-navy"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Edit Page' : 'Create Page'}
            </h2>
            {isEditing && (
              <a 
                href={`/page/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="text-[13px] text-[#0079CD] hover:underline mt-1 inline-flex items-center gap-1 font-semibold"
              >
                /page/{page.slug}
              </a>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-[14px] font-bold"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#001b3b] text-white rounded-lg hover:bg-[#001b3b]/90 transition-colors text-[14px] font-bold shadow-sm"
          >
            <Globe className="h-4 w-4" />
            {page.status === 'published' ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          
          <div className="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="e.g. Shipping Information"
                maxLength={120}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy outline-none transition-all text-[14px]"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-1">
                Content
              </label>
              <p className="text-[12px] text-slate-500 mb-3">
                Use the "Source" button to safely embed raw HTML or code snippets.
              </p>
              <div className="prose-editor-container border border-slate-200 rounded-lg overflow-hidden">
                {memoizedEditor}
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[16px] font-bold text-slate-800 pb-2 border-b border-slate-100">Search engine listing</h3>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={page.seoTitle}
                onChange={(e) => setPage({...page, seoTitle: e.target.value})}
                placeholder={page.title || 'Defaults to page title'}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy outline-none text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                Meta Description
              </label>
              <textarea
                value={page.metaDescription}
                onChange={(e) => setPage({...page, metaDescription: e.target.value})}
                placeholder="Brief description for search results"
                rows={3}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-brand-navy outline-none resize-none text-[14px]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[16px] font-bold text-slate-800 pb-2 border-b border-slate-100">Settings</h3>
            
            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                Status
              </label>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                page.status === 'published' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                {page.status === 'published' ? <Globe className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span className="font-bold text-[13px] capitalize">{page.status}</span>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-800 mb-2">
                URL Handle (Slug) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 text-[14px]">
                  /page/
                </span>
                <input
                  type="text"
                  value={page.slug}
                  onChange={handleSlugChange}
                  placeholder="e.g. shipping-information"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-r-lg focus:ring-1 focus:ring-brand-navy outline-none text-[14px]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PageForm;
