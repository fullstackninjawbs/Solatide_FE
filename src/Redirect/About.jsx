import React from 'react'
import AboutUsPage from '../pages/about/homeSection'
import WhySolatideSection from '../pages/about/WhySolatideSection'
import OurStandardsSection from '../pages/about/OurStandardsSection'
import HowOrdersHandledSection from '../pages/about/HowOrdersHandledSection'
import WhatMakesUsDifferentSection from '../pages/about/WhatMakesUsDifferentSection'
import ResearchUsePositioningSection from '../pages/about/ResearchUsePositioningSection'
import UsefulLinksSection from '../pages/about/UsefulLinksSection'

const About = () => {
    return (
        <>
            <AboutUsPage />
            <WhySolatideSection />
            <HowOrdersHandledSection />
            <OurStandardsSection />
            <WhatMakesUsDifferentSection />
            <ResearchUsePositioningSection />
            <UsefulLinksSection />
        </>
    )
}

export default About
