/**
 * Placeholder row for the home product sliders while their list is loading (e.g. arriving on the
 * home page through in-site navigation, when there is no prerendered list to start from).
 * Same card shape and height as the real cards; 1 card on phones, 2 from 640px, 4 from 1024px —
 * like the sliders' slidesPerView — so nothing moves when the real cards replace it.
 */
const SkeletonCard = ({ className = '' }) => (
    <div className={`flex flex-col h-full bg-white border border-slate-100 rounded-[28px] p-2.5 sm:p-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] ${className}`}>
        <div className="w-full h-[240px] sm:h-[260px] rounded-[20px] bg-slate-200"></div>
        <div className="flex flex-col flex-grow mt-4 px-1.5 pb-2">
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-slate-200 rounded w-1/2"></div>
            <div className="flex items-center justify-between mt-3.5">
                <div className="h-[18px] bg-slate-200 rounded w-20"></div>
                <div className="h-11 w-11 rounded-full bg-slate-200"></div>
            </div>
        </div>
    </div>
);

const ProductCardSkeletonRow = ({ label = 'Loading products' }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 animate-pulse" role="status" aria-label={label}>
        <SkeletonCard />
        <SkeletonCard className="hidden sm:flex" />
        <SkeletonCard className="hidden lg:flex" />
        <SkeletonCard className="hidden lg:flex" />
        <span className="sr-only">{label}…</span>
    </div>
);

export default ProductCardSkeletonRow;
