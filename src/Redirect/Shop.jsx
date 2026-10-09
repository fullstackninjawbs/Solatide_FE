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

    const collectionTitles = {
        'all': 'Research Grade Peptides | Solatide Biosciences',
        'research-grade-peptides': 'Research-Grade Peptides | Solatide Biosciences',
        'dermal-pigmentation-research': 'Dermal & Pigmentation Research Peptides MT2 GHK-Cu Australia – Solatide Biosciences',
        'tissue-cellular-research-peptides': 'Tissue & Cellular Research Peptides | BPC-157 TB-500 AU – Solatide Biosciences',
        'glp-1-metabolic-peptides': 'GLP-1 & Metabolic Research Peptides Australia | Solatide – Solatide Biosciences',
        'research-solutions': 'Research Solutions | Laboratory Support Materials | Solatide – Solatide Biosciences',
        'bundles': 'Research Peptides Bundles | Solatide Biosciences'
    };

    const collectionDescs = {
        'all': 'Browse research peptides, analytical reference standards and laboratory compounds with batch documentation and COAs. For in-vitro research use only.',
        'research-grade-peptides': 'Browse Solatide Biosciences’ full catalogue of research grade peptides, analytical compounds and laboratory-use support materials. For in-vitro laboratory research use only.',
        'dermal-pigmentation-research': 'Solatide Biosciences dermal and pigmentation research peptides, including MT2 and GHK-Cu. Melanocortin receptor and copper peptide compounds with COA.',
        'tissue-cellular-research-peptides': 'Browse tissue and cellular research peptides including BPC-157, TB-500, and combined-pathway compounds for in-vitro laboratory research. COA verified.',
        'glp-1-metabolic-peptides': 'Research-grade GLP-1 receptor agonists, dual agonists, triple agonists, and metabolic research compounds. COA-verified. For in-vitro laboratory use only.',
        'research-solutions': 'Laboratory support materials and sterile solvents for peptide handling, preparation, and controlled in-vitro research workflows. For laboratory use only.',
        'bundles': 'Research peptide bundles and multi-vial combinations for comprehensive in-vitro laboratory analysis.'
    };

    const key = handle && handle !== 'all' ? handle : 'all';
    const targetTitle = collectionTitles[key] || `${collectionName} | Solatide Biosciences`;
    const targetDesc = collectionDescs[key] || `Browse ${collectionName} research peptides and laboratory compounds at Solatide Biosciences.`;

    return (
        <div className="w-full min-h-screen">
            <Helmet>
                <title>{targetTitle}</title>
                <meta name="description" content={targetDesc} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={targetTitle} />
                <meta property="og:description" content={targetDesc} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://solatidebiosciences.com.au/assets/logo.webp" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={targetTitle} />
                <meta name="twitter:description" content={targetDesc} />
                <meta name="twitter:image" content="https://solatidebiosciences.com.au/assets/logo.webp" />
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
