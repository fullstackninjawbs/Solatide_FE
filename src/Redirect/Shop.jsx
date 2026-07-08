import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ShopBanner from '../pages/shop/ShopBanner';
import ProductCategories from '../pages/shop/ProductCategories';
import ShopProducts from '../pages/shop/ShopProducts';
import ShopFaq from '../pages/shop/ShopFaq';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');

    // Map query to category name
    const queryMap = {
        'Metabolic': 'Metabolic Pathway Research',
        'Tissue': 'Tissue & Cellular Research',
        'Dermal': 'Dermal & Pigmentation Research',
        'Solutions': 'Research Solutions'
    };

    const selectedCategory = queryMap[categoryQuery] || 'All Products';

    const setSelectedCategory = (category) => {
        // Find abbreviation from category name
        const revMap = {
            'Metabolic Pathway Research': 'Metabolic',
            'Tissue & Cellular Research': 'Tissue',
            'Dermal & Pigmentation Research': 'Dermal',
            'Research Solutions': 'Solutions',
            'All Products': null
        };
        const abbr = revMap[category];
        if (abbr) {
            setSearchParams({ category: abbr });
        } else {
            setSearchParams({});
        }
    };

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
