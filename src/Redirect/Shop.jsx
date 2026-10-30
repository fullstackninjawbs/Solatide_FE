import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ROBOTS_INDEX } from '../utils/seo';
import { getRouteData, sameData } from '../utils/routeData';
import { apiService } from '../services/api';
import ShopBanner from '../pages/shop/ShopBanner';
import ProductCategories from '../pages/shop/ProductCategories';
import ShopProducts from '../pages/shop/ShopProducts';
import ShopFaq from '../pages/shop/ShopFaq';
import NotFound from '../pages/NotFound';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { handle } = useParams();
    const navigate = useNavigate();
    
    const categoryQuery = searchParams.get('category');

    let selectedCategory = 'all-products';
    if (handle && handle !== 'all') {
        selectedCategory = handle;
    } else if (categoryQuery) {
        selectedCategory = categoryQuery;
    }

    const setSelectedCategory = (categorySlug) => {
        if (categorySlug && categorySlug !== 'all-products') {
            navigate(`/collections/${categorySlug}`);
        } else {
            navigate(`/collections/all`);
        }
    };

    // Scroll to top when category changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [handle, categoryQuery]);

    // Dynamic collections lookup (embedded routeData for SSR/prerender + dynamic fetch)
    const [collections, setCollections] = useState(() => {
        const body = getRouteData('/api/products/collections');
        return (body && body.success && Array.isArray(body.data)) ? body.data : [];
    });
    // True once the list of active collections is known (embedded data or a successful fetch):
    // only then can an unknown handle be declared "not found" (a failed fetch never 404s).
    const [collectionsLoaded, setCollectionsLoaded] = useState(() => {
        const body = getRouteData('/api/products/collections');
        return !!(body && body.success && Array.isArray(body.data));
    });

    useEffect(() => {
        let isMounted = true;
        const fetchCollections = async () => {
            try {
                const response = await apiService.getPublicCollections();
                const result = await response.json();
                if (result.success && Array.isArray(result.data) && isMounted) {
                    setCollections(prev => (sameData(prev, result.data) ? prev : result.data));
                    setCollectionsLoaded(true);
                }
            } catch (err) {
                console.error('Error fetching collections in Shop:', err);
            }
        };
        fetchCollections();
        return () => { isMounted = false; };
    }, []);

    const key = handle && handle !== 'all' ? handle : 'all';
    const matchedCol = collections.find(c => c.slug === key);

    // Unknown (or deactivated) collection: a real 404 — noindex, and NotFoundMarker sends the
    // visitor on if the URL has moved (renamed collection / legacy URL). Was: an empty, indexable
    // collection page for any handle.
    if (key !== 'all' && collectionsLoaded && !matchedCol) {
        return <NotFound />;
    }

    const collectionPath = key !== 'all' ? `/collections/${key}` : '/collections/all';
    const canonicalUrl = (matchedCol?.seo?.canonicalUrl && matchedCol.seo.canonicalUrl.trim()) 
        || `https://solatidebiosciences.com.au${collectionPath}`;

    const collectionDisplayName = matchedCol?.name || (
        key !== 'all'
            ? key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            : 'All Products'
    );

    const breadcrumbSchema = {
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
            ...(key !== 'all' ? [{
                "@type": "ListItem",
                "position": 3,
                "name": collectionDisplayName,
                "item": `https://solatidebiosciences.com.au${collectionPath}`
            }] : [])
        ]
    };

    // Collection SEO comes from admin (Collections → Search engine listing).
    // Only /collections/all keeps a built-in default, for when no "all" collection exists yet.
    const ALL_DEFAULT_TITLE = 'Research Grade Peptides | Solatide Biosciences';
    const ALL_DEFAULT_DESC = 'Browse research peptides, analytical reference standards and laboratory compounds with batch documentation and COAs. For in-vitro research use only.';

    const targetTitle = (matchedCol?.seo?.title && matchedCol.seo.title.trim()) 
        || (key === 'all' ? ALL_DEFAULT_TITLE : `${collectionDisplayName} | Solatide Biosciences`);

    const targetDesc = (matchedCol?.seo?.description && matchedCol.seo.description.trim()) 
        || (matchedCol?.description && matchedCol.description.trim()) 
        || (key === 'all' ? ALL_DEFAULT_DESC : null)
        || `Browse ${collectionDisplayName} research peptides and laboratory compounds at Solatide Biosciences.`;

    const ogImage = matchedCol?.bannerImage || "https://solatidebiosciences.com.au/assets/logo.webp";

    return (
        <div className="w-full min-h-screen">
            <Helmet>
                <title>{targetTitle}</title>
                <meta name="description" content={targetDesc} />
                <link rel="canonical" href={canonicalUrl} />
                <meta name="robots" content={ROBOTS_INDEX} />
                <meta property="og:title" content={targetTitle} />
                <meta property="og:description" content={targetDesc} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={targetTitle} />
                <meta name="twitter:description" content={targetDesc} />
                <meta name="twitter:image" content={ogImage} />
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Helmet>
            <ShopBanner />

            <ShopProducts
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <ProductCategories
                selectedCategory={selectedCategory}
            />
            <ShopFaq />
        </div>
    );
};

export default Shop;
