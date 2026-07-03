import React, { useState, useEffect } from 'react';
import ReviewSummary from '../../components/reviews/ReviewSummary';
import ReviewList from '../../components/reviews/ReviewList';
import ReviewFilter from '../../components/reviews/ReviewFilter';
import ReviewWizard from '../../components/reviews/ReviewWizard';
import { apiService } from '../../services/api';

const ProductReviewsSection = ({ product }) => {
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
        : '0.0';

    return (
        <div id="reviews" className="mt-16 max-w-[1440px] mx-auto text-left px-4" style={{ fontFamily: 'Poppins' }}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[15px] font-medium text-slate-800">
                        Customer Reviews
                    </h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[15px] font-bold text-slate-900">{averageRating}</span>
                        <span className="text-[11px] text-slate-500">{totalReviews} reviews</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                        onClick={handleOpenModal}
                        className="bg-[#2B7868] hover:bg-[#006e52] text-white text-[13px] font-medium py-1.5 px-6 rounded transition-colors focus:outline-none"
                    >
                        Write a review
                    </button>
                    <ReviewFilter
                        filterRating={filterRating}
                        setFilterRating={setFilterRating}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>
            </div>

            {/* Summary Section */}
            <ReviewSummary reviews={reviews} />

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
