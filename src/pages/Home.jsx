import HeroSection from "../components/home/HeroSection";
import TrustBanner from "../components/home/TrustBanner";
import ProductCategories from "../components/home/ProductCategories";
import ByTheNumbers from "../components/home/ByTheNumbers";
import ShopPeptides from "../components/home/ShopPeptides";
import AboutSolatide from "../components/home/AboutSolatide";


const Home = () => {
    return (
        <>
            <HeroSection />
            <TrustBanner />
            <ByTheNumbers />
            <ShopPeptides />
            <ProductCategories />
            <AboutSolatide/>
        </>
    );
};

export default Home;