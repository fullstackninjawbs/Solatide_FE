import React, { useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ShopBanner from '../pages/shop/ShopBanner';
import ProductCategories from '../pages/shop/ProductCategories';
import ShopProducts from '../pages/shop/ShopProducts';
import ShopFaq from '../pages/shop/ShopFaq';

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

    const collectionPath = handle && handle !== 'all' ? `/collections/${handle}` : '/collections/all';
    const canonicalUrl = `https://solatidebiosciences.com.au${collectionPath}`;
    const collectionName = handle && handle !== 'all' 
        ? handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'All Products';

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
            ...(handle && handle !== 'all' ? [{
                "@type": "ListItem",
                "position": 3,
                "name": collectionName,
                "item": canonicalUrl
            }] : [])
        ]
    };

    return (
        <div className="w-full min-h-screen">
            <Helmet>
                <link rel="canonical" href={canonicalUrl} />
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
