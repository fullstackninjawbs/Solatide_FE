import React from 'react'
import { Link } from 'react-router-dom'

const ProductCategories = () => {
    const categories = [
        {
            id: 1,
            title: 'Metabolic Pathway Research',
            description: 'Compounds selected for metabolic pathway research and related studies',
            path: '/shop?category=Metabolic',
            icon: '/Frame (1).png'
        },
        {
            id: 2,
            title: 'Tissue & Cellular Research',
            description: 'Research compounds studied in recovery and tissue-response models',
            path: '/shop?category=Tissue',
            icon: '/Group.png'
        },
        {
            id: 3,
            title: 'Dermal & Pigmentation Research',
            description: 'Peptides used in dermal and pigmentation-focused research environments',
            path: '/shop?category=Dermal',
            icon: '/Frame.png'
        },
        {
            id: 4,
            title: 'Research Solutions',
            description: 'Supporting compounds and materials for laboratory-based research',
            path: '/shop?category=Solutions',
            icon: '/g3327 (1).png'
        }
    ];

    return (
        <section className="relative w-full bg-[#f4f7fa] py-20 lg:py-24 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-left max-w-none mb-12">
                    <span className="text-[#00bfef] text-[15px] font-extrabold tracking-widest uppercase mb-3 block">
                        Research Category
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-[#1E1E1E] tracking-tight leading-tight mb-8" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                        Browse the Full Research Catalogue
                    </h2>

                    <div className="space-y-6 text-[#6A6A6A] text-[16px] leading-[1.6] max-w-none" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                        <p>
                            This page brings together the full Solatide Biosciences research catalogue in one view, including metabolic research peptides, repair-focused compounds, dermal research peptides, and laboratory support materials. It is designed as a broad navigation page rather than a single-topic research guide.
                        </p>
                        <p>
                            This page brings together the full Solatide Biosciences research catalogue in one view, including metabolic research peptides, repair-focused compounds, dermal research peptides, and laboratory support materials. It is designed as a broad navigation page rather than a single-topic research guide.
                        </p>
                        <p>
                            Where a topic-specific page is more useful than a broad catalogue view, the site's overview pages and comparison resources provide more structured scientific context.
                        </p>
                    </div>
                </div>

                {/* Categories Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-none">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-[24px] p-8 border border-[#E8E8E8] shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left"
                        >
                            <div>
                                {/* Icon Pill Container */}
                                <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/60 flex items-center justify-center mb-6 shrink-0">
                                    <img src={category.icon} alt={category.title} className="h-6 w-6 object-contain" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-[#1E1E1E] mb-3" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                                    {category.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[15px] text-[#6A6A6A] leading-relaxed mb-6" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                                    {category.description}
                                </p>
                            </div>

                            <div>
                                {/* Horizontal Divider Line */}
                                <div className="w-full border-t border-[#E8E8E8] mb-5"></div>

                                {/* Shop Pill Button */}
                                <Link
                                    to={category.path}
                                    className="inline-flex items-center justify-center rounded-lg bg-[#e0eaf5]/85 text-[#214A9E] px-5 py-2 text-xs font-bold hover:bg-[#e0eaf5] transition-colors cursor-pointer w-auto"
                                    style={{ fontFamily: 'Poppins' }}
                                >
                                    Shop
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Guide Link */}
                <div className="text-left">
                    <p className="text-[#214A9E] font-semibold text-[16px]" style={{ fontFamily: 'Poppins' }}>
                        New to research peptides? View our <Link to="/about" className="text-[#1E1E1E] underline hover:opacity-80">Research Peptides Guide</Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ProductCategories
