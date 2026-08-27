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
import TelegramPopup from '../components/TelegramPopup';
import Reveal from '../components/storefront/ui/Reveal';

const Home = () => {
    return (
        <>
            <HeroSection />
            <TrustBanner />
            <Reveal><ShopPeptides /></Reveal>
            <Reveal><ByTheNumbers /></Reveal>
            {/* <Reveal><ProductCategories isHome={true} /></Reveal> */}
            <Reveal><FeaturedProducts /></Reveal>
            <Reveal><WhySolatide /></Reveal>
            <Reveal><OurCommitment /></Reveal>
            {/* <Reveal><QualityAssurance /></Reveal> */}
            {/* <Reveal><ExploreProducts /></Reveal> */}
            <Reveal><Testimonials /></Reveal>
            <Reveal><Faq /></Reveal>
            <Reveal><NeverMissRestock /></Reveal>
            <TelegramPopup />
        </>
    );
};

export default Home;