import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopBanner from '../pages/shop/ShopBanner';
import ProductCategories from '../pages/shop/ProductCategories';
import ShopProducts from '../pages/shop/ShopProducts';
import ShopFaq from '../pages/shop/ShopFaq';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const selectedCategory = categoryQuery || 'all-products';

    const setSelectedCategory = (categorySlug) => {
        if (categorySlug && categorySlug !== 'all-products') {
            setSearchParams({ category: categorySlug });
        } else {
            setSearchParams({});
        }
    };

    // Scroll to top when category changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [categoryQuery]);

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
