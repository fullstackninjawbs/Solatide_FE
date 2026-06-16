import React from 'react';
import HeroSection from "../pages/home/HeroSection";
import TrustBanner from "../pages/home/TrustBanner";
import ProductCategories from "../pages/home/ProductCategories";
import ByTheNumbers from "../pages/home/ByTheNumbers";
import ShopPeptides from "../pages/home/ShopPeptides";
import AboutSolatide from "../pages/home/AboutSolatide";

const Home = () => {
    return (
        <>
            <HeroSection />
            <TrustBanner />
            <ByTheNumbers />
            <ShopPeptides />
            <ProductCategories />
            <AboutSolatide />
        </>
    );
};

export default Home;
