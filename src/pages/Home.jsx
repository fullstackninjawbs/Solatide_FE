import HeroSection from "../components/home/HeroSection";
import ProductCategories from "../components/home/ProductCategories";
import ByTheNumbers from "../components/home/ByTheNumbers";
import ShopPeptides from "../components/home/ShopPeptides";
import AboutSolatide from "../components/home/AboutSolatide";


const Home = () => {
    return (
        <>
            <HeroSection />
            <ByTheNumbers />
            <ShopPeptides />
            <ProductCategories />
            <AboutSolatide/>
        </>
    );
};

export default Home;