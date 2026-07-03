import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepRating from './StepRating';
import StepReview from './StepReview';
import StepAbout from './StepAbout';
import StepUpload from './StepUpload';
import StepSuccess from './StepSuccess';
import toast from 'react-hot-toast';

const ReviewWizard = ({ isOpen, onClose, product, onSubmitReview }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [files, setFiles] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRating(0);
      setTitle('');
      setComment('');
      setName('');
      setEmail('');
      setIsAnonymous(false);
      setFiles([]);
      setVideoUrl('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('title', title);
      formData.append('review', comment);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('anonymous', isAnonymous);
      if (videoUrl) formData.append('youtubeUrl', videoUrl);
      
      files.forEach((file) => {
        formData.append('images', file);
      });

      await onSubmitReview(formData, {
        rating,
        title,
        comment,
        name: isAnonymous ? 'Anonymous' : name,
        email,
        images: files.map(f => URL.createObjectURL(f))
      });
      
      setStep(5); // Success step
    } catch (error) {
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative my-auto overflow-hidden min-h-[400px]"
      >
        {/* Close Button (hide on success step) */}
        {step !== 5 && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 bg-white/80 rounded-full p-1.5 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Wizard Content */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepRating key="step1" product={product} rating={rating} setRating={setRating} onNext={handleNext} />
            )}
            {step === 2 && (
              <StepReview key="step2" product={product} rating={rating} title={title} setTitle={setTitle} comment={comment} setComment={setComment} onNext={handleNext} onBack={handleBack} />
            )}
            {step === 3 && (
              <StepAbout key="step3" name={name} setName={setName} email={email} setEmail={setEmail} isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} onNext={handleNext} onBack={handleBack} />
            )}
            {step === 4 && (
              <StepUpload key="step4" files={files} setFiles={setFiles} videoUrl={videoUrl} setVideoUrl={setVideoUrl} onBack={handleBack} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
            {step === 5 && (
              <StepSuccess key="step5" onClose={onClose} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewWizard;
