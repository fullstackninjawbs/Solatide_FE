import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import retatrutideVial from '../../assets/images/retatrutide_vial.webp';
import NotFoundMarker from '../../components/NotFoundMarker';
import ProductInfoSection from './ProductInfoSection';
import ProductReviewsSection from './ProductReviewsSection';
import ProductFaqSection from './ProductFaqSection';
import ProductSuggestionsSection from './ProductSuggestionsSection';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
import { useTagadaCheckout } from '../../hooks/useTagadaCheckout';
import CurrentBatchCard from './CurrentBatchCard';
import { optimizeCloudinaryUrl } from '../../utils/imageOptimization';
import { trackEvent } from '../../utils/analytics';
import { getProductImageAltText } from '../../utils/imageHelpers';
import { getRouteData, sameData, stripInternal, reviewsKeyFor } from '../../utils/routeData';
import { sanitizedMarkup } from '../../utils/sanitize';
import { ROBOTS_INDEX, ROBOTS_NOINDEX } from '../../utils/seo';
import { Helmet } from 'react-helmet-async';

// Known research article slugs (/pages/what-is-<slug>) used for "Learn more about X here" links.
const RESEARCH_ARTICLE_SLUGS = new Set([
    'retatrutide', 'cjc-1295', 'nad-plus', 'tb500', 'ss-31', 'semax', 'ipamorelin', 'bpc-157',
    'ghk-cu', 'mots-c', 'selank', 'tesamorelin', 'kpv',
]);
const researchHrefFor = (compoundName) => {
    let slug = compoundName.toLowerCase().replace(/\+/g, '-plus').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slug === 'tb-500') slug = 'tb500';
    return RESEARCH_ARTICLE_SLUGS.has(slug) ? `/pages/what-is-${slug}` : '/pages/research-library';
};

// Product payload embedded by prerender.js for this exact slug (same response the prerender used).
const getEmbeddedProduct = (id) => {
    if (!id) return null;
    const body = getRouteData(`/api/products/${id}`);
    return body && body.success && body.data && body.data.product ? body.data.product : null;
};

// Reviews payload embedded by prerender.js (ProductReviewsSection reads the same key).
const getEmbeddedReviewCount = (product) => {
    const productId = product?._id || product?.id;
    if (!productId) return null;
    const body = getRouteData(reviewsKeyFor(productId));
    if (!body) return null;
    return body.success && Array.isArray(body.reviews) ? body.reviews.length : 0;
};

// Deterministic (data-derived) Offer validity: end of the year after the product was last updated.
const priceValidUntilFor = (product) => {
    const ts = product?.updatedAt ? Date.parse(product.updatedAt) : NaN;
    if (Number.isNaN(ts)) return undefined;
    return `${new Date(ts).getUTCFullYear() + 1}-12-31`;
};

/**
 * Variant shown first (and described to Google in the Product schema): the first one that can be
 * bought — in stock, or continue-selling — else the first. Opening on a sold-out first variant
 * showed "Sold out" + OutOfStock although another variant was available.
 */
const defaultVariant = (p) => {
    const vs = p?.variants;
    if (!Array.isArray(vs) || vs.length === 0) return null;
    const productContinues = p.inventoryPolicy === 'continue' || p.continueSellingWhenOutOfStock === true;
    const purchasable = (v) =>
        Number(v?.stockQty ?? 0) > 0 || v?.inventoryPolicy === 'continue' || v?.continueSellingWhenOutOfStock === true || productContinues;
    return vs.find(purchasable) || vs[0];
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(() => getEmbeddedProduct(id));
    const [loading, setLoading] = useState(() => !getEmbeddedProduct(id));
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    // Initialised synchronously so the first client render matches the prerendered DOM.
    const [selectedVariant, setSelectedVariant] = useState(() => defaultVariant(getEmbeddedProduct(id)));
    const { checkoutError } = useTagadaCheckout();
    const [fetchedReviewCount, setFetchedReviewCount] = useState(() => getEmbeddedReviewCount(getEmbeddedProduct(id)));
    const [notFound, setNotFound] = useState(false);
    // API unreachable and nothing prerendered: show a retry state — never a static/sample catalogue.
    const [loadFailed, setLoadFailed] = useState(false);

    // Scroll to top when navigating between products (not on the initial mount, so hydration doesn't jump).
    const mountedIdRef = useRef(id);
    useEffect(() => {
        if (mountedIdRef.current === id) return;
        mountedIdRef.current = id;
        window.scrollTo(0, 0);
    }, [id]);

    // Reset the variant/gallery selection when the product data actually changes (adjust-state-
    // during-render pattern; product only changes identity when its data differs).
    const [variantSource, setVariantSource] = useState(product);
    if (variantSource !== product) {
        setVariantSource(product);
        setSelectedVariant(defaultVariant(product));
        setActiveTab(0);
    }

    // When the route id changes (client navigation), adopt embedded data or show the loader.
    const [stateForId, setStateForId] = useState(id);
    if (stateForId !== id) {
        setStateForId(id);
        const embedded = getEmbeddedProduct(id);
        const matches = !!product && (product.slug === id || String(product._id) === String(id) || String(product.id) === String(id));
        if (embedded) {
            setProduct(prev => (sameData(prev, embedded) ? prev : embedded));
            setLoading(false);
        } else if (!matches) {
            setLoading(true);
        }
        setNotFound(false);
        setLoadFailed(false);
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const saveToRecentlyViewed = (prod) => {
            if (!prod) return;
            try {
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
            } catch { /* storage unavailable */ }
        };

        const embedded = getEmbeddedProduct(id);

        const fetchProduct = async () => {
            try {
                const response = await apiService.getProductById(id, { signal });
                const result = await response.json();
                if (signal.aborted) return;
                if (response.ok && result.success && result.data && result.data.product) {
                    const fetchedProduct = stripInternal(result.data.product);

                    // SEO Redirect: If product has a URL handle (slug) and current URL doesn't use it, redirect
                    if (fetchedProduct.slug && id !== fetchedProduct.slug) {
                        navigate(`/products/${fetchedProduct.slug}`, { replace: true });
                        return;
                    }

                    // Background refresh: only update state when the data actually changed.
                    setProduct(prev => (sameData(prev, fetchedProduct) ? prev : fetchedProduct));
                    setNotFound(false);
                    saveToRecentlyViewed(fetchedProduct);
                    trackEvent('product_view', {
                        productId: fetchedProduct._id,
                        productName: fetchedProduct.name,
                        path: window.location.pathname
                    });
                } else if (!embedded) {
                    // API returned success:false / 404 — this slug doesn't exist
                    setNotFound(true);
                }
            } catch (err) {
                if (err.name === 'AbortError' || signal.aborted) return;
                if (embedded) return; // keep the prerendered data on a transient network failure
                // Backend unreachable and nothing prerendered: no static/sample fallback (it showed stale
                // or placeholder prices/stock). Show a retry state instead.
                console.warn('Backend unreachable for product:', id);
                setLoadFailed(true);
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
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#214A9E]"></div>
            </div>
        );
    }

    if (loadFailed && !product) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
                <Helmet>
                    <title>Product temporarily unavailable | Solatide Biosciences</title>
                    <meta name="robots" content={ROBOTS_NOINDEX} />
                </Helmet>
                <div className="max-w-md w-full text-center">
                    <h1 className="text-[28px] font-bold text-[#150F3A] mb-3">We couldn't load this product</h1>
                    <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
                        Please check your connection and try again.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="bg-[#214A9E] text-white px-6 py-3 rounded-full text-[13.5px] font-semibold hover:bg-[#163678] transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4">
                <Helmet>
                    <title>Product Not Found | Solatide Biosciences</title>
                    <meta name="robots" content={ROBOTS_NOINDEX} />
                </Helmet>
                <NotFoundMarker />
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F0F5FB] flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#214A9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-[28px] font-bold text-[#150F3A] mb-3">Product Not Found</h1>
                    <p className="text-[14px] text-slate-500 mb-8 leading-relaxed">
                        We couldn't find the product you're looking for. It may have been removed, renamed, or never existed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/collections/all"
                            className="bg-[#214A9E] text-white px-6 py-3 rounded-full text-[13.5px] font-semibold hover:bg-[#163678] transition-colors"
                        >
                            Browse All Products
                        </Link>
                        <Link
                            to="/"
                            className="border border-[#214A9E] text-[#214A9E] px-6 py-3 rounded-full text-[13.5px] font-semibold hover:bg-[#F0F5FB] transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                    <p className="mt-8 text-[12px] text-slate-400">
                        Looking for something specific?{' '}
                        <Link to="/pages/contact-us" className="text-[#3390ec] hover:underline">Contact us</Link>{' '}
                        and we'll help you find it.
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full min-h-screen bg-white flex items-center justify-center py-20 text-slate-500 font-medium">
                <Helmet>
                    <title>Product Not Found | Solatide Biosciences</title>
                    <meta name="robots" content={ROBOTS_NOINDEX} />
                </Helmet>
                <p>Product not found</p>
                <Link to="/collections/all" className="mt-4 text-[#214A9E] hover:underline font-semibold">Back to Shop</Link>
            </div>
        );
    }

    const dbImages = product.images && product.images.length > 0
        ? product.images.map(img => {
            const isString = typeof img === 'string';
            const url = optimizeCloudinaryUrl(isString ? img : img.url);
            return url ? (isString ? { url } : { ...img, url }) : null;
        }).filter(Boolean)
        : [{ url: optimizeCloudinaryUrl(product.imageUrl || product.image) || retatrutideVial }].filter(img => img.url);

    const coaImages = [
        optimizeCloudinaryUrl(product.coaImage1),
        optimizeCloudinaryUrl(product.coaImage2)
    ].filter(Boolean).map(url => ({ url, isCoa: true }));

    const images = [
        ...dbImages,
        ...coaImages
    ];

    const activeBatch = selectedVariant?.currentBatch || product.currentBatch;

    const badges = [];

    // 1. Purity Verified — only from batch
    if (activeBatch?.purity) {
        badges.push(`${activeBatch.purity} Purity Verified`);
    }

    // 2. Testing Method — only from batch data
    if (activeBatch?.method) {
        badges.push(activeBatch.method);
    }

    // 3. Endotoxin Tested (dynamic from active batch)
    if (activeBatch?.hasEndotoxinTest || activeBatch?.includesEndotoxin || activeBatch?.endotoxinIncludedInCoa) {
        badges.push('Endotoxin Tested');
    }

    // 4. Sterility Tested (dynamic from active batch)
    if (activeBatch?.hasSterilityTest || activeBatch?.includesSterility || activeBatch?.sterilityIncludedInCoa) {
        badges.push('Sterility Tested');
    }

    // 5. In-Vitro Use Only (always shown on all products)
    badges.push('In-Vitro Use Only');

    const incrementQty = () => setQuantity(prev => prev + 1);
    const decrementQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

    const displayPrice = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.price);

    // Reconciled stock availability for both the purchase UI and Schema.org
    const isAvailable = (() => {
        if (!product) return false;
        if (product.publishStatus && product.publishStatus !== 'active') return false;
        if (product.published === false) return false;

        if (selectedVariant) {
            const vStock = Number(selectedVariant.stockQty ?? 0);
            const vCanContinue = 
                selectedVariant.inventoryPolicy === 'continue' || 
                selectedVariant.continueSellingWhenOutOfStock === true ||
                product.inventoryPolicy === 'continue' || 
                product.continueSellingWhenOutOfStock === true;
            return vCanContinue || vStock > 0;
        }

        const canContinue = product.inventoryPolicy === 'continue' || product.continueSellingWhenOutOfStock === true;
        if (canContinue) return true;

        const rootStock = Number(product.stockQuantity ?? product.stockQty ?? 0);
        if (rootStock > 0) return true;

        if (Array.isArray(product.variants) && product.variants.length > 0) {
            return product.variants.some((v) => {
                const s = Number(v.stockQty ?? 0);
                const c = v.inventoryPolicy === 'continue' || v.continueSellingWhenOutOfStock === true;
                return c || s > 0;
            });
        }

        // Secondary fallback for missing/null stock counts
        if (product.stockQuantity === undefined && product.stockQty === undefined) {
            if (product.status === 'In Stock' || product.status === 'Sale' || product.inStock === true) return true;
        }

        return false;
    })();

    const isOutOfStock = !isAvailable;

    const normalizedPath = location.pathname.length > 1 && location.pathname.endsWith('/')
        ? location.pathname.slice(0, -1)
        : location.pathname;

    let targetDesc = product?.seo?.description || product?.summaryHtml || '';
    targetDesc = targetDesc.replace(/<[^>]*>/g, '').trim();
    if (!targetDesc && product) {
        targetDesc = `Buy high-purity ${product.name} online from Solatide Biosciences. Verified third-party testing.`;
    }

    const canonicalUrl = `https://solatidebiosciences.com.au${normalizedPath}`;

    const rawDescription = product?.description || product?.summaryHtml || '';
    const hasDescriptionContent = rawDescription.replace(/&nbsp;/g, '').replace(/<[^>]*>/g, '').trim().length > 0 || /<(img|iframe|video|audio)/i.test(rawDescription);

    // Format numeric price cleanly for Google Search Console & Schema.org compliance (e.g. "199.95")
    const formatNumericPrice = (rawPrice) => {
        if (rawPrice === null || rawPrice === undefined) return null;
        let val = typeof rawPrice === 'object' ? (rawPrice.amount || rawPrice.value || 0) : rawPrice;
        let str = String(val).replace(/[^0-9.]/g, '');
        const parts = str.split('.');
        if (parts.length > 2) {
            str = parts[0] + '.' + parts.slice(1).join('');
        }
        const num = parseFloat(str);
        if (isNaN(num) || num <= 0) return null;
        return num.toFixed(2);
    };

    const price = selectedVariant?.price || product?.price || 0;

    const imageUrl = product?.images && product.images.length > 0 ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) : 'https://solatidebiosciences.com.au/assets/logo.webp';

    // Schema.org Availability (InStock, BackOrder, OutOfStock) — derived from the SAME isAvailable
    // result as the Add to cart / Sold Out button, so schema and UI can never disagree.
    // (Previously a zero-stock, no-backorder product was still marked InStock via its status label.)
    const schemaAvailability = (() => {
        if (!product || !isAvailable) return "https://schema.org/OutOfStock";
        const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
        const stock = selectedVariant
            ? Number(selectedVariant.stockQty ?? 0)
            : hasVariants
                ? product.variants.reduce((sum, v) => sum + Number(v.stockQty ?? 0), 0)
                : Number(product.stockQuantity ?? product.stockQty ?? 0);
        if (stock > 0) return "https://schema.org/InStock";
        // Available with no units on hand → selling via backorder ("continue" policy)
        const canBackorder =
            product.inventoryPolicy === 'continue' || product.continueSellingWhenOutOfStock === true ||
            (selectedVariant ? (selectedVariant.inventoryPolicy === 'continue' || selectedVariant.continueSellingWhenOutOfStock === true)
                : hasVariants && product.variants.some(v => v.inventoryPolicy === 'continue' || v.continueSellingWhenOutOfStock === true));
        if (canBackorder) return "https://schema.org/BackOrder";
        // Available only because stock is untracked (no stock fields at all)
        return "https://schema.org/InStock";
    })();

    const schemaPrice = formatNumericPrice(price);
    const priceValidUntil = priceValidUntilFor(product);
    const productSchema = product ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": imageUrl,
        "description": targetDesc,
        "sku": selectedVariant?.sku || product.sku || product._id || product.id,
        "brand": {
            "@type": "Brand",
            "name": "Solatide Biosciences"
        },
        ...(schemaPrice ? {
            "offers": {
                "@type": "Offer",
                "url": canonicalUrl,
                "priceCurrency": "AUD",
                "price": schemaPrice,
                ...(priceValidUntil ? { "priceValidUntil": priceValidUntil } : {}),
                "itemCondition": "https://schema.org/NewCondition",
                "availability": schemaAvailability,
                "seller": {
                    "@type": "Organization",
                    "name": "Solatide Biosciences"
                },
                // Derived from /pages/refund-policy ("No Returns Policy": all sales final; remedies
                // only for damaged/incorrect orders). No shippingDetails: the shipping policy page
                // does not publish rates, so they cannot be stated accurately.
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "AU",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    "merchantReturnLink": "https://solatidebiosciences.com.au/pages/refund-policy"
                }
            }
        } : {})
    } : null;

    // Compute real approved review rating and review count (no default 5.0 fake fallback)
    const ratingVal = product?.stats?.averageRating || product?.averageRating || product?.rating || null;
    const reviewCnt = fetchedReviewCount !== null ? fetchedReviewCount : (product?.stats?.totalReviews || product?.totalReviews || product?.reviewCount || 0);

    if (productSchema && reviewCnt > 0 && ratingVal) {
        productSchema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": Number(ratingVal).toFixed(1),
            "reviewCount": reviewCnt.toString(),
            "bestRating": "5",
            "worstRating": "1"
        };
    }

    const breadcrumbSchema = product ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://solatidebiosciences.com.au"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://solatidebiosciences.com.au/collections/all"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.name,
                "item": canonicalUrl
            }
        ]
    } : null;

    return (
        <div className="w-full bg-white py-12">
            {product && (
                <Helmet>
                    <title>{product.seo?.title || `${product.name} | Solatide Biosciences`}</title>
                    <meta name="description" content={targetDesc} />
                    <link rel="canonical" href={canonicalUrl} />
                    <meta name="robots" content={ROBOTS_INDEX} />
                    <meta property="og:title" content={product.seo?.title || `${product.name} | Solatide Biosciences`} />
                    <meta property="og:description" content={targetDesc} />
                    <meta property="og:url" content={canonicalUrl} />
                    <meta property="og:type" content="product" />
                    <meta property="og:image" content={imageUrl} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={product.seo?.title || `${product.name} | Solatide Biosciences`} />
                    <meta name="twitter:description" content={targetDesc} />
                    <meta name="twitter:image" content={imageUrl} />
                    {productSchema && (
                        <script type="application/ld+json">
                            {JSON.stringify(productSchema)}
                        </script>
                    )}
                    {breadcrumbSchema && (
                        <script type="application/ld+json">
                            {JSON.stringify(breadcrumbSchema)}
                        </script>
                    )}
                </Helmet>
            )}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[14px] text-slate-500 mb-10 text-left font-medium" style={{ fontFamily: 'Poppins' }}>
                    <Link to="/" className="text-[#214A9E] hover:underline">Home</Link>
                    <span>/</span>
                    <Link to="/collections/all" className="text-[#214A9E] hover:underline">Shop</Link>
                    <span>/</span>
                    <span className="text-slate-700">{product.name}</span>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
                    {/* Left Column: Image Galleries */}
                    <div className="lg:col-span-6 flex flex-col gap-4 w-full lg:sticky lg:top-28">

                        {/* Main Preview Image */}
                        <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/60 p-6 flex items-center justify-center overflow-hidden h-[340px] sm:h-[450px] md:h-[550px] w-full relative group">
                            {images[activeTab] ? (
                                <img
                                    src={images[activeTab].url}
                                    alt={images[activeTab].isCoa ? "COA Report" : getProductImageAltText(images[activeTab], product.name, activeTab)}
                                    fetchPriority="high"
                                    decoding="sync"
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

                        {/* Thumbnails list */}
                        <div className="flex flex-row gap-3 overflow-x-auto w-full pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-xl overflow-hidden border-2 flex items-center justify-center p-1.5 transition-all bg-white shrink-0 ${activeTab === idx ? 'border-[#214A9E] shadow-sm' : 'border-slate-200 hover:border-[#214A9E]/40'
                                        }`}
                                >
                                    {idx < dbImages.length ? (
                                        img ? (
                                            <img src={img.url} alt={getProductImageAltText(img, product.name, idx)} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="w-full h-full bg-[#f8fafc] rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">
                                                No Img
                                            </div>
                                        )
                                    ) : (
                                        img ? (
                                            <img src={img.url} alt="Report Thumbnail" loading="lazy" decoding="async" className="w-full h-full object-contain" />
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

                        {/* Illustration Note */}
                        <div className="text-left w-full pl-2">
                            <p className="text-[12px] text-[#214A9E] font-medium">Images are for illustration purpose only</p>
                        </div>
                    </div>

                    {/* Right Column: Product Specs */}
                    <div className="lg:col-span-6 text-left flex flex-col gap-4" style={{ fontFamily: 'Poppins' }}>
                        <div>

                            {/* Product Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#214A9E] leading-normal mb-4" style={{ fontWeight: 600, lineHeight: 1.3 }}>
                                {product.name}
                            </h1>

                            {/* Ratings */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex text-[#FFB800] text-[16px] gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const displayCount = fetchedReviewCount !== null ? fetchedReviewCount : (product.ratingCount || product.reviewsCount || 0);
                                        const hasReviews = displayCount > 0;
                                        const actualRating = hasReviews ? Math.round(product.rating || 5) : 0;
                                        return (
                                            <span key={i}>
                                                {i < actualRating ? '★' : '☆'}
                                            </span>
                                        );
                                    })}
                                </div>
                                <a href="#reviews" className="text-[13px] text-[#1E1E1E] font-bold hover:text-[#214A9E]">
                                    {fetchedReviewCount !== null ? fetchedReviewCount : (product.ratingCount || product.reviewsCount || 0)} Reviews
                                </a>
                            </div>
                            {/* Price */}
                            {/* Price is moved down next to Add to Cart in the new design, but we'll leave it here if variants exist or handle it below */}

                            {/* Product Summary */}
                            {hasDescriptionContent && (
                                <div
                                    className="text-[#6A6A6A] text-[15px] leading-relaxed mb-6 product-description-content font-sans [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_p]:mb-3"
                                    style={{ fontWeight: 400 }}
                                    dangerouslySetInnerHTML={sanitizedMarkup(rawDescription.replace(
                                            // Match "Learn more about <Something> here" or typo "her" - handles &nbsp; and variable whitespace
                                            /Learn\s+more\s+abou?o?t\s+([^<\|]+?)\s*(?:&nbsp;|\s)\s*here?/gi,
                                            (match, compoundName) => {
                                                // clean name from any weird spaces
                                                const cleanName = compoundName.replace(/&nbsp;/g, ' ').trim();
                                                // Real link to the matching research article (or the research library)
                                                return `<a class="text-[#214A9E] cursor-pointer font-medium hover:underline research-link-dynamic" href="${researchHrefFor(cleanName)}">Learn more about ${cleanName} here</a>`;
                                            }
                                    ))}
                                    onClick={(e) => {
                                        const link = e.target.closest && e.target.closest('a.research-link-dynamic');
                                        if (link) {
                                            // Client-side navigation for our generated internal links
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const href = link.getAttribute('href');
                                            if (href) navigate(href);
                                        }
                                    }}
                                />
                            )}
                        </div>

                        {/* Current Batch Info (moved inline above selector and quantity!) */}
                        <CurrentBatchCard batch={selectedVariant?.currentBatch || product.currentBatch} product={product} />


                        {/* Actions area (Price, Qty & Cart) */}
                        <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02)] mt-6 flex flex-row flex-wrap items-center justify-between gap-5 w-full">
                            {/* Price (Moved to row) */}
                            <div className="flex items-baseline gap-3 shrink-0">
                                <span className="text-2xl sm:text-[28px] font-bold text-[#214A9E]">
                                    {displayPrice}
                                </span>

                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:flex-1">
                                <div className="flex items-center gap-4 justify-between w-full sm:w-auto shrink-0">
                                    <span className="text-[14px] sm:text-[13px] font-semibold text-slate-700">Quantity</span>
                                    {/* Quantity Selector - Pill style */}
                                    <div className="flex items-center bg-[#EBF4FA] rounded-full h-[46px] px-2 w-max border border-transparent shrink-0">
                                        <button
                                            onClick={decrementQty}
                                            className="text-[20px] font-medium text-[#214A9E] hover:bg-[#d6eaf8] w-8 h-8 rounded-full flex items-center justify-center focus:outline-none transition-colors"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-bold text-[15px] text-[#214A9E]">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQty}
                                            className="text-[20px] font-medium text-[#214A9E] hover:bg-[#d6eaf8] w-8 h-8 rounded-full flex items-center justify-center focus:outline-none transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-1 w-full sm:flex-1 sm:min-w-[200px] mt-2 sm:mt-0">
                                    <button
                                        onClick={() => addToCart(product, quantity, selectedVariant)}
                                        disabled={isOutOfStock}
                                        className={`w-full text-white text-[15px] font-bold h-[48px] rounded-xl transition-all shadow-sm focus:outline-none flex items-center justify-center gap-2.5 ${isOutOfStock
                                            ? 'bg-slate-200/80 text-slate-500 cursor-not-allowed'
                                            : 'bg-[#0079CD] hover:bg-[#0062a3]'
                                            }`}
                                    >
                                        {isOutOfStock ? 'Sold Out' : 'Add to cart'}
                                    </button>
                                    {checkoutError && <p className="text-[12px] text-red-550 font-medium text-center">{checkoutError}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Information Section (Full Width Background) */}
            <div className="w-full">
                <ProductInfoSection product={product} activeBatch={activeBatch} />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Product Reviews Section */}
                <ProductReviewsSection product={product} onReviewsFetched={setFetchedReviewCount} />

                {/* FAQ Section */}
                <ProductFaqSection />

                {/* Suggestions Section */}
                <ProductSuggestionsSection currentProduct={product} />
            </div>
        </div>
    );
};

export default ProductDetail;
