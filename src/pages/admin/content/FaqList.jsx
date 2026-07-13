import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import toast from 'react-hot-toast';

const FaqList = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for new section
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // States for questions
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingQuestions, setEditingQuestions] = useState([]);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAdminFaqs();
      const data = await res.json();
      setSections(data.data.faqSections);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) return toast.error('Section name is required');
    try {
      const res = await apiService.createAdminFaqSection({
        name: newSectionName,
        sortOrder: sections.length,
        questions: []
      });
      const data = await res.json();
      setSections([...sections, data.data.faqSection]);
      setNewSectionName('');
      setIsAddingSection(false);
      toast.success('Section created');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create section');
    }
  };

  const handleDeleteSection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await apiService.deleteAdminFaqSection(id);
      setSections(sections.filter(s => s._id !== id));
      toast.success('Section deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete section');
    }
  };

  const openSectionForEditing = (section) => {
    setEditingSectionId(section._id);
    setEditingQuestions([...section.questions]);
  };

  const handleAddQuestion = () => {
    setEditingQuestions([
      ...editingQuestions,
      { question: '', answer: '', isVisible: true, sortOrder: editingQuestions.length }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...editingQuestions];
    updated[index][field] = value;
    setEditingQuestions(updated);
  };

  const handleRemoveQuestion = (index) => {
    const updated = [...editingQuestions];
    updated.splice(index, 1);
    setEditingQuestions(updated);
  };

  const handleSaveQuestions = async (section) => {
    try {
      const res = await apiService.updateAdminFaqSection(section._id, {
        name: section.name,
        sortOrder: section.sortOrder,
        questions: editingQuestions
      });
      const data = await res.json();
      setSections(sections.map(s => s._id === section._id ? data.data.faqSection : s));
      setEditingSectionId(null);
      toast.success('Questions saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save questions');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">FAQs</h2>
          <p className="text-slate-500 text-[14px]">Manage your frequently asked questions.</p>
        </div>
        <button
          onClick={() => setIsAddingSection(true)}
          className="bg-brand-navy text-white px-4 py-2 rounded-lg text-[14px] font-medium hover:bg-opacity-90"
          style={{ backgroundColor: '#1E1E1E' }}
        >
          Add New Section
        </button>
      </div>

      {isAddingSection && (
        <div className="bg-white border border-slate-200 rounded-[16px] p-6 shadow-sm flex items-center gap-4">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="e.g. Shipping & Returns"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-[14px] focus:ring-1 focus:ring-brand-navy outline-none"
          />
          <button onClick={handleCreateSection} className="bg-[#0079CD] text-white px-4 py-2 rounded-lg text-[14px] font-medium hover:bg-[#0062a3]">
            Save Section
          </button>
          <button onClick={() => setIsAddingSection(false)} className="text-slate-500 hover:text-slate-700 text-[14px] font-medium">
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading FAQs...</p>
      ) : (
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section._id} className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-[16px]">{section.name}</h3>
                <div className="flex items-center gap-3">
                  {editingSectionId === section._id ? (
                    <>
                      <button onClick={() => handleSaveQuestions(section)} className="text-[#0079CD] text-[13px] font-bold hover:underline">Save Changes</button>
                      <button onClick={() => setEditingSectionId(null)} className="text-slate-500 text-[13px] font-bold hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => openSectionForEditing(section)} className="text-[#0079CD] text-[13px] font-bold hover:underline">Edit Questions</button>
                      <button onClick={() => handleDeleteSection(section._id)} className="text-red-500 text-[13px] font-bold hover:underline">Delete Section</button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editingSectionId === section._id ? (
                  <div className="space-y-4">
                    {editingQuestions.map((q, idx) => (
                      <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50 relative">
                        <button onClick={() => handleRemoveQuestion(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="grid grid-cols-1 gap-4 pr-8">
                          <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-1">Question</label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#0079CD]"
                            />
                          </div>
                          <div>
                            <label className="block text-[12px] font-semibold text-slate-700 mb-1">Answer</label>
                            <textarea
                              value={q.answer}
                              onChange={(e) => handleQuestionChange(idx, 'answer', e.target.value)}
                              rows="3"
                              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#0079CD]"
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="checkbox"
                              id={`visible-${section._id}-${idx}`}
                              checked={q.isVisible !== false}
                              onChange={(e) => handleQuestionChange(idx, 'isVisible', e.target.checked)}
                              className="w-4 h-4 text-[#0079CD] rounded border-slate-300 focus:ring-[#0079CD]"
                            />
                            <label htmlFor={`visible-${section._id}-${idx}`} className="text-[13px] text-slate-700 font-medium cursor-pointer">
                              Visible on Storefront
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={handleAddQuestion} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#0079CD] hover:text-[#0079CD] transition-colors">
                      + Add Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.questions.length === 0 ? (
                      <p className="text-slate-500 text-[14px]">No questions in this section yet.</p>
                    ) : (
                      section.questions.map((q, idx) => (
                        <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start gap-4">
                            <p className="font-bold text-slate-800 text-[14px]">{q.question}</p>
                            <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded ${q.isVisible !== false ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {q.isVisible !== false ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[13.5px] mt-1 whitespace-pre-wrap">{q.answer}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {sections.length === 0 && !loading && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-[16px]">
              <p className="text-slate-500">No FAQ sections found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaqList;
