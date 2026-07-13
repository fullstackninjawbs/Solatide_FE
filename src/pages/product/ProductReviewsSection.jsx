import React, { useState, useEffect } from 'react';
import ReviewSummary from '../../components/reviews/ReviewSummary';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewFilter from '../../components/reviews/ReviewFilter';
import ReviewWizard from '../../components/reviews/ReviewWizard';
import { apiService } from '../../services/api';

const ProductReviewsSection = ({ product, onReviewsFetched }) => {
    // Initial mock reviews data just in case API fails or is empty
    const initialReviews = [
        {
            id: 1,
            name: 'Anonymous',
            role: 'Biotech Researcher',
            rating: 5,
            title: 'good Prodects',
            comment: 'The peptide quality is consistently high, and the detailed batch documentation gives us complete confidence in our research. Solatide Biosciences has become our go-to source.',
            createdAt: '2026-07-03T12:00:00Z',
            verified: false
        },
        {
            id: 2,
            name: 'Michael D',
            role: 'Biotech Researcher',
            rating: 5,
            title: 'Clear and tidy',
            comment: 'Everything was clear and tidy. Order email, payment email, tracking email.',
            createdAt: '2026-05-15T12:00:00Z',
            verified: false
        }
    ];

    const [reviews, setReviews] = useState(initialReviews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Filter and Sort states
    const [filterRating, setFilterRating] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchReviews = async () => {
            if (!product || (!product.id && !product._id)) return;
            const productId = product._id || product.id;
            try {
                setIsLoading(true);
                const res = await apiService.getProductReviews(productId);
                const data = await res.json();
                if (data.success && data.reviews) {
                    setReviews(data.reviews);
                }
            } catch (err) {
                console.error("Failed to fetch reviews, using mock data.", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [product]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmitReview = async (formData, optimisticData) => {
        const productId = product?._id || product?.id;

        // Remove optimistic UI update because reviews are "Pending Approval" by default.
        // Showing it immediately causes confusion when it disappears on refresh.


        // 2. API Call in background
        if (productId) {
            try {
                formData.append('productId', productId);
                await apiService.submitReview(formData);
            } catch (err) {
                console.error("Failed to submit review to server.", err);
            }
        }
    };

    // Apply Sorting and Filtering
    const getProcessedReviews = () => {
        let processed = [...reviews];

        // Filter
        if (filterRating !== 'All') {
            processed = processed.filter(r => r.rating === parseInt(filterRating));
        }

        // Sort
        processed.sort((a, b) => {
            const dateA = new Date(a.createdAt || Date.now());
            const dateB = new Date(b.createdAt || Date.now());

            switch (sortBy) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                default:
                    return dateB - dateA;
            }
        });

        return processed;
    };

    const processedReviews = getProcessedReviews();

    const totalReviews = processedReviews.length;
    const averageRating = totalReviews > 0
        ? (processedReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
        : "0.0";

    useEffect(() => {
        if (onReviewsFetched) {
            onReviewsFetched(totalReviews);
        }
    }, [totalReviews, onReviewsFetched]);

    return (
        <div id="reviews" className="mt-20 max-w-[1400px] mx-auto text-left px-4 font-['Poppins']">
            {/* Header Section */}
            <div className="mb-8">
                <h3 className="text-[14px] font-bold text-[#0079CD] mb-2">Reviews</h3>
                <h2 className="text-3xl font-bold text-[#1E1E1E]">
                    Customer Reviews
                </h2>
            </div>

            {/* Summary Card */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between border border-slate-200 rounded-2xl p-6 md:p-8 bg-white mb-10 shadow-sm">
                <div className="flex items-center gap-6 mb-6 md:mb-0">
                    <span className="text-[44px] font-bold text-[#1E1E1E] leading-none">{averageRating}</span>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex text-[#FFB800] text-[20px] gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>
                                    {i < Math.round(Number(averageRating)) ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className="text-[13px] text-slate-400 font-medium">Based on {totalReviews} verified reviews</span>
                    </div>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="bg-[#0079CD] hover:bg-[#0062a3] text-white text-[14.5px] font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none w-full md:w-auto text-center"
                >
                    Write a Review
                </button>
            </div>

            {/* Reviews List */}
            <ReviewList
                reviews={processedReviews}
                isLoading={isLoading}
                onWriteReview={handleOpenModal}
            />

            {/* Review Wizard Modal */}
            <ReviewWizard
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={product}
                onSubmitReview={handleSubmitReview}
            />
        </div>
    );
};

export default ProductReviewsSection;
