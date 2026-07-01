import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import retatrutideVial from '../../assets/images/retatrutide_vial.png';
import { products } from '../../data/products';
import ProductInfoSection from './ProductInfoSection';
import ProductReviewsSection from './ProductReviewsSection';
import ProductFaqSection from './ProductFaqSection';
import ProductSuggestionsSection from './ProductSuggestionsSection';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import { useTagadaCheckout } from '../../hooks/useTagadaCheckout';
import CurrentBatchCard from './CurrentBatchCard';





const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { initiateCheckout, isCheckingOut, checkoutError } = useTagadaCheckout();

    // Scroll to top on ID change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Dynamic SEO / Head tags update
    useEffect(() => {
        if (product) {
            const originalTitle = document.title;
            const metaDescEl = document.querySelector('meta[name="description"]');
            const originalMetaDesc = metaDescEl ? metaDescEl.getAttribute('content') : '';

            // Set Title
            document.title = product.seo?.title || `${product.name} | Solatide Biosciences`;

            // Set Description
            let targetDesc = product.seo?.description || product.summaryHtml || '';
            // Strip HTML tags if any
            targetDesc = targetDesc.replace(/<[^>]*>/g, '').trim();
            if (!targetDesc) {
                targetDesc = `Buy high-purity ${product.name} online from Solatide Biosciences. Verified third-party testing.`;
            }

            if (metaDescEl) {
                metaDescEl.setAttribute('content', targetDesc);
            } else {
                const newMeta = document.createElement('meta');
                newMeta.setAttribute('name', 'description');
                newMeta.setAttribute('content', targetDesc);
                document.head.appendChild(newMeta);
            }

            return () => {
                document.title = originalTitle;
                if (metaDescEl && originalMetaDesc) {
                    metaDescEl.setAttribute('content', originalMetaDesc);
                }
            };
        }
    }, [product]);

    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        } else {
            setSelectedVariant(null);
        }
        setActiveTab(0);
    }, [product]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const saveToRecentlyViewed = (prod) => {
            if (!prod) return;
            const stored = localStorage.getItem('recentlyViewed');
            let list = [];
            if (stored) {
                try {
                    list = JSON.parse(stored);
                } catch (e) {
                    console.error(e);
                }
            }
            list = list.filter(item => (item._id || item.id) !== (prod._id || prod.id));
            list.unshift(prod);
            list = list.slice(0, 4);
            localStorage.setItem('recentlyViewed', JSON.stringify(list));
        };

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiService.getProductById(id, { signal });
                const result = await response.json();
                if (!signal.aborted) {
                    if (result.success && result.data && result.data.product) {
                        setProduct(result.data.product);
                        saveToRecentlyViewed(result.data.product);
                    } else {
                        const fallback = products.find(p => p.id === parseInt(id)) || products.find(p => p.id === 2) || products[0];
                        setProduct(fallback);
                        saveToRecentlyViewed(fallback);
                    }
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.warn('Backend product details API unreachable. Using static fallback.');
                    const fallback = products.find(p => p.id === parseInt(id)) || products.find(p => p.id === 2) || products[0];
                    setProduct(fallback);
                    saveToRecentlyViewed(fallback);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };
        fetchProduct();

        return () => {
            controller.abort();
        };
    }, [id]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#214A9E]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 text-slate-500 font-medium">
                <p>Product not found</p>
                <Link to="/shop" className="mt-4 text-[#214A9E] hover:underline font-semibold">Back to Shop</Link>
            </div>
        );
    }

    const dbImages = product.images && product.images.length > 0
        ? product.images.map(img => img.url)
        : [product.imageUrl || product.image || retatrutideVial].filter(Boolean);

    const coaImages = [
        product.coaImage1 || null,
        product.coaImage2 || null
    ];

    const images = [
        ...dbImages,
        ...coaImages
    ];

    const activeBatch = selectedVariant?.currentBatch || product.currentBatch;

    const badges = [];

    // 1. Purity Verified
    if (activeBatch) {
        if (activeBatch.purity) {
            badges.push(`${activeBatch.purity} Purity Verified`);
        }
    } else if (product.chemicalPurity) {
        badges.push(`${product.chemicalPurity} Purity Verified`);
    } else {
        badges.push('≥99% Purity Verified');
    }

    // 2. Testing Method
    if (activeBatch) {
        if (activeBatch.method) {
            badges.push(activeBatch.method);
        }
    } else {
        badges.push('HPLC-UV & LC-MS Tested');
    }

    // 3. Endotoxin Tested (dynamic from active batch)
    if (activeBatch?.hasEndotoxinTest || activeBatch?.includesEndotoxin || activeBatch?.endotoxinIncludedInCoa) {
        badges.push('Endotoxin Tested');
    }

    // 4. Sterility Tested (dynamic from active batch)
    if (activeBatch?.hasSterilityTest || activeBatch?.includesSterility || activeBatch?.sterilityIncludedInCoa) {
        badges.push('Sterility Tested');
    }

    // 5. In-Vitro Use Only (static)
    badges.push('In-Vitro Use Only');

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const displayPrice = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.price);
    const displayCompareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
    const displaySku = selectedVariant ? selectedVariant.sku : product.sku;
    const isOutOfStock = selectedVariant
        ? selectedVariant.stockQty <= 0
        : product.inStock === false || product.stockQuantity <= 0;

    const hasVariantsToSelect = product.variants && product.variants.length > 0 && !(product.variants.length === 1 && product.variants[0].title === 'Default Title');

    return (
        <div className="w-full bg-white py-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[14px] text-slate-500 mb-10 text-left font-medium" style={{ fontFamily: 'Poppins' }}>
                    <Link to="/" className="text-[#214A9E] hover:underline">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="text-[#214A9E] hover:underline">Shop</Link>
                    <span>/</span>
                    <span className="text-slate-700">{product.name}</span>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
                    {/* Left Column: Image Galleries */}
                    <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 lg:gap-5 items-start w-full lg:sticky lg:top-28">
                        {/* Thumbnails list */}
                        <div className="flex flex-row md:flex-col gap-3 shrink-0 overflow-x-auto w-full md:w-[85px] pb-2 md:pb-0 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl overflow-hidden border-2 flex items-center justify-center p-1.5 transition-all bg-white shrink-0 ${activeTab === idx ? 'border-[#214A9E] shadow-sm' : 'border-slate-200 hover:border-[#214A9E]/40'
                                        }`}
                                >
                                    {idx < dbImages.length ? (
                                        img ? (
                                            <img src={img} alt="Product Thumbnail" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-[#f8fafc] rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">
                                                No Img
                                            </div>
                                        )
                                    ) : (
                                        img ? (
                                            <img src={img} alt="Report Thumbnail" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-[#f8fafc] flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-lg text-slate-400 text-[8px] font-bold p-1 text-center">
                                                <span>COA REPORT</span>
                                                <span className="text-[10px] text-[#214A9E]">✓</span>
                                            </div>
                                        )
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Main Preview Image */}
                        <div className="flex-grow bg-[#f8fafc] rounded-3xl border border-slate-200/60 p-6 flex items-center justify-center overflow-hidden h-[340px] sm:h-[450px] md:h-[550px] w-full relative group">
                            {images[activeTab] ? (
                                <img
                                    src={images[activeTab]}
                                    alt="Product Preview"
                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    No Image Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Specs */}
                    <div className="lg:col-span-6 text-left flex flex-col gap-6" style={{ fontFamily: 'Poppins' }}>
                        <div>
                            {/* Category Tag */}

                            <span className="text-[#00E5FF] text-[14px] sm:text-[15px] font-regular font-weight-400 tracking-wide block mb-3 uppercase">
                                {product.tag || 'Dual GLP-1/GIP Receptor Agonist'}
                            </span>

                            {/* Product Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#214A9E] leading-tight mb-4" style={{ fontWeight: 600 }}>
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-[#0F8A5F] text-[15px] gap-0.5">
                                    {'★★★★★'.split('').map((char, i) => (
                                        <span key={i}>{char}</span>
                                    ))}
                                </div>
                                <a href="#reviews" className="text-[14px] text-[#1E1E1E] font-medium underline ml-1 hover:text-[#214A9E]">
                                    {product.reviewsCount || 4} reviews
                                </a>
                            </div>

                            {/* {displaySku && (
                                <div className="text-[13px] text-slate-500 mb-4 uppercase tracking-wider">
                                    SKU: <span className="font-semibold text-slate-800">{displaySku}</span>
                                </div>
                            )} */}

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-3xl sm:text-[36px] font-bold text-[#214A9E]">
                                    {displayPrice}
                                </span>
                                {displayCompareAtPrice && (
                                    <span className="text-xl text-slate-400 line-through">
                                        {formatPrice(displayCompareAtPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Product Summary */}
                            <div
                                className="text-[#6A6A6A] text-[15px] leading-relaxed mb-6 product-description-content font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_p]:mb-3"
                                style={{ fontWeight: 400 }}
                                dangerouslySetInnerHTML={{ __html: product.summaryHtml || product.description }}
                            />

                            {/* Badges list */}
                            <div className="flex flex-wrap gap-2.5 mb-6">
                                {badges.map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-[#edf4ff]/50 text-[#214A9E] border border-[#214A9E]/10 rounded-full px-4 py-1.5 text-xs font-semibold"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Current Batch Info (moved inline above selector and quantity!) */}
                        <CurrentBatchCard batch={selectedVariant?.currentBatch || product.currentBatch} />

                        {/* Variant Selector */}
                        {hasVariantsToSelect && (
                            <div className="mb-8 border-t border-slate-100 pt-8">
                                <span className="text-[14px] font-bold text-slate-800 block mb-3 uppercase tracking-wide">
                                    Select Option
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v, index) => (
                                        <button
                                            key={v.sku || index}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-5 py-2.5 rounded-xl text-[14px] font-semibold border-2 transition-all focus:outline-none ${selectedVariant?.sku === v.sku
                                                ? 'border-[#214A9E] bg-[#214A9E] text-white shadow-md'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {v.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions area (Qty & Cart) */}
                        <div className={`flex flex-col gap-5 w-full ${!hasVariantsToSelect ? 'border-t border-slate-100 pt-8' : ''}`}>
                            <div className="flex sm:flex-col flex-row items-stretch gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 h-[56px] w-max">
                                    <button
                                        onClick={decrementQty}
                                        className="text-[20px] font-medium text-slate-500 hover:text-[#214A9E] hover:bg-slate-100 w-14 h-full flex items-center justify-center focus:outline-none rounded-l-xl transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-bold text-[16px] text-slate-800">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQty}
                                        className="text-[20px] font-medium text-slate-500 hover:text-[#214A9E] hover:bg-slate-100 w-14 h-full flex items-center justify-center focus:outline-none rounded-r-xl transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-3.5 w-full mt-4">
                                    <button
                                        onClick={() => addToCart(product, quantity, selectedVariant)}
                                        disabled={isOutOfStock}
                                        className={`w-full text-white text-[15px] font-bold py-4 rounded-xl transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2.5 ${isOutOfStock
                                            ? 'bg-slate-200/80 text-slate-500 cursor-not-allowed'
                                            : 'bg-[#0079CD] hover:bg-[#0062a3]'
                                            }`}
                                    >
                                        {!isOutOfStock && (
                                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        )}
                                        {isOutOfStock ? 'Sold Out' : 'Add to cart'}
                                    </button>
                                    <button
                                        onClick={() => initiateCheckout([{ ...product, quantity, selectedVariant }])}
                                        disabled={isOutOfStock || isCheckingOut}
                                        className={`w-full py-4 rounded-xl border font-bold text-[15px] transition-all focus:outline-none flex items-center justify-center gap-2 ${isOutOfStock || isCheckingOut
                                            ? 'border-slate-200 bg-white text-slate-400 cursor-not-allowed'
                                            : 'border-[#1E1E1E] bg-white hover:bg-slate-50 text-[#1E1E1E]'
                                            }`}
                                    >
                                        {isCheckingOut ? (
                                            <><div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" /> Redirecting...</>
                                        ) : (
                                            'Buy it now'
                                        )}
                                    </button>
                                    {checkoutError && <p className="text-[12px] text-red-550 font-medium text-center">{checkoutError}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Information Accordions Section */}
                <ProductInfoSection product={product} />

                {/* Product Reviews Section */}
                <ProductReviewsSection product={product} />

                {/* FAQ Section */}
                <ProductFaqSection />

                {/* Suggestions Section */}
                <ProductSuggestionsSection currentProduct={product} />
            </div>
        </div>
    );
};

export default ProductDetail;
