import React from 'react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';

const StepRating = ({ product, rating, setRating, onNext }) => {
  const handleRatingChange = (val) => {
    setRating(val);
    setTimeout(() => {
      onNext();
    }, 400); // Small delay for the user to see the star click animation
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center text-center py-8 px-4"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-1">How would you rate this product?</h3>
      <p className="text-[13px] text-slate-500 mb-8">We would love it if you would share a bit about your experience.</p>
      
      {product?.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="w-32 h-32 object-contain mb-6 drop-shadow-sm" />
      )}
      
      <h4 className="font-bold text-slate-800 text-sm mb-6 max-w-[80%] mx-auto leading-snug">
        {product?.name}
      </h4>
      
      <div className="scale-125 mb-4">
        <RatingStars 
          rating={rating} 
          interactive={true} 
          onRatingChange={handleRatingChange} 
          size={36}
        />
      </div>
      
      <div className="flex justify-between w-full max-w-[240px] text-xs font-medium text-slate-400 mt-2">
        <span>Poor</span>
        <span>Great</span>
      </div>
    </motion.div>
  );
};

export default StepRating;
