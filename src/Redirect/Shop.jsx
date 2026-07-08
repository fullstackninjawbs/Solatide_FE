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
        'metabolic-pathway': 'Metabolic Pathway Research',
        'tissue-cellular': 'Tissue & Cellular Research',
        'dermal-pigmentation': 'Dermal & Pigmentation Research',
        'laboratory-support': 'Laboratory Support'
    };

    const selectedCategory = queryMap[categoryQuery] || 'All Products';

    const setSelectedCategory = (category) => {
        // Find abbreviation from category name
        const revMap = {
            'Metabolic Pathway Research': 'metabolic-pathway',
            'Tissue & Cellular Research': 'tissue-cellular',
            'Dermal & Pigmentation Research': 'dermal-pigmentation',
            'Laboratory Support': 'laboratory-support',
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
