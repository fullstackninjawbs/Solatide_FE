import React, { useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
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

    return (
        <div className="w-full min-h-screen">
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
