import React from 'react';
import HeroSection from "../pages/home/HeroSection";
import TrustBanner from "../pages/home/TrustBanner";
import ProductCategories from "../pages/shop/ProductCategories";
import ByTheNumbers from "../pages/home/ByTheNumbers";
import ShopPeptides from "../pages/home/ShopPeptides";
import AboutSolatide from "../pages/home/AboutSolatide";
import WhySolatide from '../pages/home/WhySolatide';
import OurCommitment from '../pages/home/OurCommitment';
import FeaturedProducts from '../pages/home/FeaturedProducts';
import QualityAssurance from '../pages/home/QualityAssurance';
import ExploreProducts from '../pages/home/ExploreProducts';
import Testimonials from '../pages/home/Testimonials';
import Faq from '../pages/home/Faq';
import NeverMissRestock from '../pages/home/NeverMissRestock';

const Home = () => {
    return (
        <>
            <HeroSection />
            <TrustBanner />
            <ShopPeptides />
            <ByTheNumbers />
            {/* <ProductCategories isHome={true} /> */}
            <FeaturedProducts />
            <WhySolatide />
            <OurCommitment />
            {/* <QualityAssurance /> */}
            {/* <ExploreProducts /> */}
            <Testimonials />
            <Faq />
            <NeverMissRestock />
        </>
    );
};

export default Home;