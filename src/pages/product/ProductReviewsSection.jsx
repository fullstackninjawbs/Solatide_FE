import React, { useState } from 'react';

const ProductReviewsSection = ({ product }) => {
    // Initial mock reviews data
    const initialReviews = [
        {
            id: 1,
            name: 'Purvi Chopra',
            role: 'Biotech Researcher',
            rating: 5,
            comment: 'The peptide quality is consistently high, and the detailed batch documentation gives us complete confidence in our research. Solatide Biosciences has become our go-to source.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
        },
        {
            id: 2,
            name: 'Sam Patrick',
            role: 'Biotech Researcher',
            rating: 5,
            comment: 'Fast delivery, transparent testing reports, and reliable product consistency. It\'s rare to find this level of professionalism in the research peptide space.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
        },
        {
            id: 3,
            name: 'Thorin Aron',
            role: 'Biotech Researcher',
            rating: 5,
            comment: 'We\'ve tested multiple suppliers, but Solatide stands out in terms of quality control and transparency. Their documentation is extremely helpful.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
        }
    ];

    const [reviews, setReviews] = useState(initialReviews);
    const [filterRating, setFilterRating] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Form states
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (userRating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!reviewText.trim()) {
            alert('Please enter your review');
            return;
        }

        const newReview = {
            id: Date.now(),
            name: 'Anonymous Researcher',
            role: 'Biotech Researcher',
            rating: userRating,
            comment: reviewText,
            avatar: '' // Will fallback to initials
        };

        setReviews([newReview, ...reviews]);
        // Reset form
        setUserRating(0);
        setReviewText('');
        setSelectedFiles([]);
        setShowForm(false);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const filteredReviews = filterRating === 'All'
        ? reviews
        : reviews.filter(r => r.rating === parseInt(filterRating));

    return (
        <div id="reviews" className="mt-20 max-w-[1440px] mx-auto text-left" style={{ fontFamily: 'Poppins' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-wider uppercase block mb-1">
                        Reviews
                    </span>
                    <h2 className="text-3xl sm:text-[36px] font-semibold text-[#1E1E1E]">
                        Customer Reviews
                    </h2>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center relative">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#008fe2] hover:bg-[#007cc5] text-white text-[14px] font-bold py-2.5 px-6 rounded-lg transition-all focus:outline-none"
                    >
                        Write a Review
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="bg-white border border-[#E8E8E8] text-[#1E1E1E] text-[14px] font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 hover:border-slate-300 focus:outline-none min-w-[120px] justify-between"
                        >
                            <span>{filterRating === 'All' ? 'All Rating' : `${filterRating} Stars`}</span>
                            <svg className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-[#E8E8E8] rounded-lg shadow-lg py-1 z-10">
                                {['All', '5', '4', '3', '2', '1'].map((ratingOption) => (
                                    <button
                                        key={ratingOption}
                                        onClick={() => {
                                            setFilterRating(ratingOption);
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                                    >
                                        {ratingOption === 'All' ? 'All Rating' : `${ratingOption} Stars`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add a Review Form */}
            {showForm && (
                <form
                    onSubmit={handleFormSubmit}
                    className="border border-[#008fe2]/30 bg-[#edf4ff]/10 rounded-xl p-6 mb-8 text-left transition-all duration-300 shadow-sm"
                >
                    <h4 className="text-[15px] font-bold text-[#214A9E] mb-5">Add a Review</h4>

                    {/* Star Rating Selection */}
                    <div className="mb-5">
                        <span className="text-[13px] font-semibold text-slate-600 block mb-1.5">Your Rating</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setUserRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="text-2xl focus:outline-none transition-colors"
                                >
                                    <span className={(hoverRating || userRating) >= star ? 'text-amber-500' : 'text-slate-300'}>
                                        ★
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Textarea */}
                    <div className="mb-5">
                        <span className="text-[13px] font-semibold text-slate-600 block mb-1.5">Your Review</span>
                        <textarea
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Enter your review here"
                            className="w-full border border-[#E8E8E8] rounded-lg p-3 text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#008fe2] focus:ring-1 focus:ring-[#008fe2]/30 resize-y bg-white"
                        ></textarea>
                    </div>

                    {/* Media Uploader */}
                    <div className="mb-6">
                        <span className="text-[13px] font-semibold text-slate-600 block mb-1.5">Uplod Images, Videos</span>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[13px] font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span>Browse</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            <span className="text-[12.5px] text-[#6A6A6A] font-medium">
                                {selectedFiles.length > 0
                                    ? `${selectedFiles.length} file(s) selected`
                                    : 'No files Selected'}
                            </span>
                        </div>
                        {selectedFiles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedFiles.map((file, idx) => (
                                    <span key={idx} className="bg-slate-100 border border-slate-200 text-xs px-2.5 py-1 rounded text-slate-600 font-medium">
                                        {file.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-[#008fe2] hover:bg-[#007cc5] text-white text-[14px] font-bold py-2 px-8 rounded-lg transition-all focus:outline-none"
                    >
                        Submit
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="border border-[#E8E8E8] rounded-xl p-6 bg-white hover:shadow-sm transition-shadow"
                        >
                            {/* User Header */}
                            <div className="flex items-center gap-3.5 mb-4">
                                {review.avatar ? (
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-[48px] h-[48px] rounded-full object-cover border border-[#E8E8E8]"
                                    />
                                ) : (
                                    <div className="w-[48px] h-[48px] rounded-full bg-[#edf4ff] text-[#214A9E] font-bold text-[14px] flex items-center justify-center border border-[#214A9E]/10 uppercase">
                                        {getInitials(review.name)}
                                    </div>
                                )}
                                <div className="text-left">
                                    <h5 className="font-bold text-[#1E1E1E] text-[15px] leading-tight">
                                        {review.name}
                                    </h5>
                                    <span className="text-slate-400 text-[12px] font-medium">
                                        {review.role}
                                    </span>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex text-amber-500 text-lg mb-3">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                            </div>

                            {/* Comment */}
                            <p className="text-[#6A6A6A] text-[14px] sm:text-[14.5px] leading-[1.65] font-medium">
                                "{review.comment}"
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl text-slate-400 font-medium">
                        No reviews found for this rating.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviewsSection;
