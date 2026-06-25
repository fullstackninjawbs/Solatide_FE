import React from 'react'
import AboutUsPage from '../pages/about/homeSection'
import WhySolatideSection from '../pages/about/WhySolatideSection'
import ResearchUsePositioningSection from '../pages/about/ResearchUsePositioningSection'
import WhatMakesUsDifferentSection from '../pages/about/WhatMakesUsDifferentSection'
import OurStandardsSection from '../pages/about/OurStandardsSection'
import UsefulLinksSection from '../pages/about/UsefulLinksSection'

const About = () => {
    return (
        <>
            <AboutUsPage />
            <WhySolatideSection />
            <ResearchUsePositioningSection />
            <WhatMakesUsDifferentSection />
            <OurStandardsSection />
            <UsefulLinksSection />
        </>
    )
}

export default About