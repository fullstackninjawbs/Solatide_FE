import React from 'react'
import { Link } from 'react-router-dom'

const ProductCategories = () => {
    const categories = [
        {
            id: 1,
            title: 'Metabolic Pathway Research',
            description: 'Compounds selected for metabolic pathway research and related studies',
            path: '/shop/metabolic',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.56M20 3v5h-5.586" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Tissue & Cellular Research',
            description: 'Research compounds studied in recovery and tissue-response models',
            path: '/shop/tissue',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10V21m0-11a5 5 0 015-5h2m-7 5a5 5 0 00-5-5H7" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Dermal & Pigmentation Research',
            description: 'Peptides used in dermal and pigmentation-focused research environments',
            path: '/shop/dermal',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6L12 3L20 6L12 9L4 6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 11L12 14L20 11" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16L12 19L20 16" />
                </svg>
            )
        },
        {
            id: 4,
            title: 'Research Solutions',
            description: 'Supporting compounds and materials for laboratory-based research',
            path: '/shop/solutions',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h12m-3 0v4l4 9.5a1.5 1.5 0 01-1.38 2.08H6.38A1.5 1.5 0 015 16.5L9 7V3" />
                    <path d="M9 11h3m-3 3h5" />
                </svg>
            )
        }
    ];

    return (
        <section className="relative w-full bg-[#f4f7fa] py-20 lg:py-24 overflow-hidden">
            <div className="main-container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-3 block">
                        Product Categories
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#102a5c] tracking-tight">
                        Shop by <span className="text-[#1a4494]">Research</span> Category
                    </h2>
                </div>

                {/* Categories Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-[32px] p-8 border border-slate-100/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left"
                        >
                            <div>
                                {/* Icon Pill Container */}
                                <div className="h-14 w-14 rounded-2xl bg-[#e0eaf5]/60 text-[#1a4494] flex items-center justify-center mb-6 shrink-0">
                                    {category.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-bold text-[#102a5c] mb-3">
                                    {category.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-lg mb-6">
                                    {category.description}
                                </p>
                            </div>

                            <div>
                                {/* Horizontal Divider Line */}
                                <div className="w-full border-t border-slate-100/80 mb-5"></div>

                                {/* Shop Pill Button */}
                                <Link
                                    to={category.path}
                                    className="inline-flex items-center justify-center rounded-lg bg-[#e0eaf5]/85 text-[#1a4494] px-5 py-2 text-xs font-bold hover:bg-[#e0eaf5] transition-colors cursor-pointer w-auto"
                                >
                                    Shop
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductCategories