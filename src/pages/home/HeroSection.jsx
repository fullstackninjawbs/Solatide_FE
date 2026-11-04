import { Link } from 'react-router-dom'
import { ArrowRight, FileText, FlaskConical } from 'lucide-react'
import heroImageWebp from '../../assets/images/homePageFirstSection.webp'
import mobileHeroImageWebp from '../../assets/images/mobile_products_img.webp'
import { Fragment, useEffect, useState } from 'react'
import useHomepageContent, { cloudinarySized } from '../../hooks/useHomepageContent'

// Desktop (lg+) sizes scale with the screen height so the whole hero, down to the feature cards,
// fills the first screen without being cut off: "(100vh - 200px)" is the room below the header.
// Each value is clamped (never smaller / bigger than on the design), the headline also by width.
// Phones and tablets use the fixed sizes.

// The entrance fade (0.8 s) plays once per visit; coming back to the homepage from another page
// shows the hero straight away (images are already cached, the fade made it feel slow).
let heroShownOnce = false

// Entrance: the elements fade up one after another (60 ms apart, 0.6 s each: done in ~1.1 s).
// motion-safe: people who turned on "reduce motion" see everything at once.
const REVEAL_START_MS = 60
const REVEAL_STEP_MS = 50
const reveal = (animate, step) => (animate
    ? {
        className: 'motion-safe:opacity-0 motion-safe:animate-fade-in-up',
        style: { animationDelay: `${REVEAL_START_MS + step * REVEAL_STEP_MS}ms`, animationDuration: '0.5s' },
    }
    : { className: '', style: undefined })

// Each hero image is in a <picture> whose <source> only matches at its own breakpoint; the <img>
// fallback is this 1×1 GIF. So phones never download the desktop image and desktops never
// download the mobile one (images inside display:none containers are still downloaded).
const BLANK_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
// Intrinsic sizes: width/height let the browser reserve the space before the image arrives
// (without them the mobile hero pushed the text down ~450px: CLS 0.62 on mobile).
const MOBILE_HERO_W = 644
const MOBILE_HERO_H = 803
const DESKTOP_HERO_W = 1672
const DESKTOP_HERO_H = 941

// PepFinder badge: their official embed, unchanged (their terms: don't copy or edit the image).
// rel without "noreferrer" so PepFinder can count visits from the site.
const PEPFINDER_URL = 'https://pepfinder.com/suppliers/solatide-biosciences'
const PEPFINDER_BADGE = 'https://pepfinder.com/badge/solatide-biosciences.svg'
const PEPFINDER_ALT = 'Solatide Biosciences on PepFinder, PepFinder rating 9.0 out of 10, pepfinder verified'

// Feature icons drawn to match the mock-up (lucide has no chromatogram / moving box)
const ChromatogramIcon = (props) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 27h28" />
        <path d="M3 26h3.5c1.2 0 1.6-1.5 2.2-5L10.5 7l1.8 14c.5 3.5 1 5 2.2 5h1c1 0 1.4-1.4 1.9-4.5l1.1-7 1.1 7c.5 3.1.9 4.5 1.9 4.5h1c1 0 1.3-1 1.7-3l.8-4 .8 4c.4 2 .7 3 1.7 3H30" />
    </svg>
)
const ShippingBoxIcon = (props) => (
    <svg viewBox="0 0 36 32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M1.5 12h7M3.5 16.5h5M1.5 21h7" />
        <path d="M13 9.5 23 4l10 5.5v12L23 27l-10-5.5z" />
        <path d="M13 9.5 23 15l10-5.5M23 15v12" />
        <path d="m18 6.8 10 5.5v4" />
    </svg>
)

const FEATURES = [
    { icon: FlaskConical, title: 'Batch-Specific COAs', text: 'Matched to current vial lots' },
    { icon: ChromatogramIcon, title: 'Independent HPLC + LC-MS', text: 'Purity + identity testing' },
    { icon: ShippingBoxIcon, title: 'Worldwide Tracked Shipping', text: 'Dispatched from Australia' },
]

// Hyphenated words never break at the hyphen ("Batch-/Verified", "LC-/MS")
const KeepHyphenated = ({ text }) => String(text).split(/(\s+)/).map((part, i) => (
    part.includes('-') ? <span key={i} className="whitespace-nowrap">{part}</span> : part
))

// Headline from the Hub: each line break becomes <br />; with 2+ lines the last one is blue
const Headline = ({ text }) => {
    const lines = String(text).split('\n')
    return lines.map((line, i) => (
        <Fragment key={i}>
            {i > 0 && <br />}
            {lines.length > 1 && i === lines.length - 1
                ? <span className="text-[#1a4494]"><KeepHyphenated text={line} /></span>
                : <KeepHyphenated text={line} />}
        </Fragment>
    ))
}

// "#1" (any #number) in the badge title is blue, as in the mock-up
const BadgeTitle = ({ text }) => String(text).split(/(#\d+)/).map((part, i) => (
    /^#\d+$/.test(part) ? <span key={i} className="text-[#1a4494]">{part}</span> : part
))

// PepFinder card: one clean white card (the badge already has its own frame, so no inner panel),
// badge on the left, title / subtitle / link on the right. Phones: stacked and centred.
const PepFinderCard = ({ title, subtitle, linkText, revealProps }) => (
    <div style={revealProps.style} className={`mt-6 lg:mt-[clamp(12px,2.2vh,24px)] w-full sm:w-fit max-w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-5 lg:gap-4 bg-white rounded-[20px] lg:rounded-[16px] border border-[#cfe9f4] shadow-[0_10px_30px_rgba(11,60,120,0.08)] p-3 sm:pr-7 lg:p-2.5 lg:pr-6 text-center sm:text-left ${revealProps.className}`}>
        {/* Badge scaled up (SVG, stays sharp, aspect 220:64) to fill the card height with an even small padding */}
        <a href={PEPFINDER_URL} target="_blank" rel="noopener" className="block shrink-0 hover:scale-[101%] transition-all duration-200">
            <img src={PEPFINDER_BADGE} width={220} height={64} alt={PEPFINDER_ALT} loading="eager" className="block w-[280px] lg:w-[clamp(190px,min(calc((100vh_-_200px)*0.44),19vw),270px)] h-auto aspect-[220/64]" />
        </a>
        <span className="hidden sm:block w-px self-stretch my-2 bg-slate-200" aria-hidden="true" />
        <div className="flex flex-col items-center sm:items-start min-w-0 pb-2 sm:py-1 lg:py-0">
            <p className="text-[18px] lg:text-[clamp(16px,calc((100vh_-_200px)*0.034),21px)] font-bold text-[#0b1f4b] leading-tight"><BadgeTitle text={title} /></p>
            <p className="text-[14px] lg:text-[clamp(13px,1.9vh,15px)] text-slate-500 mt-1 lg:mt-0.5">{subtitle}</p>
            <a
                href={PEPFINDER_URL}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-1.5 mt-2 lg:mt-1 text-[14.5px] lg:text-[clamp(13.5px,1.9vh,15.5px)] font-semibold text-[#1a4494] hover:text-[#0650b3] whitespace-nowrap"
            >
                <span className="group-hover:underline underline-offset-4">{linkText}</span>
                <ArrowRight size={16} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
        </div>
    </div>
)

// Phones: one card with three rows. sm+: three cards side by side.
// Each card reveals on its own step, starting at firstStep.
const Features = ({ animate, firstStep }) => (
    <ul className="mt-6 lg:mt-[clamp(12px,2.2vh,24px)] grid grid-cols-1 sm:grid-cols-3 sm:gap-3 bg-white sm:bg-transparent rounded-[16px] sm:rounded-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:shadow-none divide-y divide-slate-100 sm:divide-y-0">
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <li key={title} style={reveal(animate, firstStep + i).style} className={`flex items-center gap-3 sm:gap-2.5 px-4 py-3 sm:px-3 sm:py-3.5 lg:py-[clamp(8px,1.5vh,14px)] sm:bg-white sm:rounded-[14px] sm:shadow-[0_4px_16px_rgba(15,40,90,0.08)] ${reveal(animate, firstStep + i).className}`}>
                <Icon className="w-9 h-9 sm:w-8 sm:h-8 shrink-0 text-[#1a73e8]" strokeWidth={1.6} aria-hidden="true" />
                <span className="flex flex-col text-left min-w-0">
                    <span className="text-[14px] lg:text-[clamp(13px,1.85vh,15px)] font-bold text-[#0b1f4b] leading-tight"><KeepHyphenated text={title} /></span>
                    <span className="text-[12.5px] lg:text-[clamp(12px,1.65vh,13.5px)] text-slate-600 leading-snug mt-0.5">{text}</span>
                </span>
            </li>
        ))}
    </ul>
)

const HeroSection = () => {
    // ready=false: content not known yet (no prerendered data) — keep the image slots and text empty
    // (space reserved) rather than flashing the built-in image/text before the saved ones
    const { hero, ready } = useHomepageContent()
    const [animate] = useState(() => !heroShownOnce)
    useEffect(() => {
        if (ready) heroShownOnce = true
    }, [ready])

    // Images uploaded in the Hub replace the built-in ones (same slots, same sizing behaviour)
    const desktop = hero.desktopImage
        ? { src: cloudinarySized(hero.desktopImage.url, 2000), w: hero.desktopImage.width, h: hero.desktopImage.height }
        : { src: heroImageWebp, w: DESKTOP_HERO_W, h: DESKTOP_HERO_H }
    const mobile = hero.mobileImage
        ? { src: cloudinarySized(hero.mobileImage.url, 900), w: hero.mobileImage.width, h: hero.mobileImage.height }
        : { src: mobileHeroImageWebp, w: MOBILE_HERO_W, h: MOBILE_HERO_H }
    const alt = hero.imageAlt
    // Reveal order: headline, line, paragraph, buttons, PepFinder card (when shown), feature cards, disclaimer
    const featuresStep = hero.showBadge ? 5 : 4

    return (
        <section className="relative w-full overflow-hidden bg-[#e4dbf8] lg:bg-white flex flex-col lg:flex-row lg:items-center lg:min-h-[min(100svh,860px)] lg:pt-[160px] lg:pb-8">
            {/* Desktop: full-width background photo, text on its calm left side */}
            <div className="absolute inset-0 z-0 hidden lg:block">
                <picture className="block w-full h-full">
                    {ready && <source media="(min-width: 1024px)" srcSet={desktop.src} width={desktop.w} height={desktop.h} />}
                    <img
                        src={BLANK_GIF}
                        className="w-full h-full object-cover object-[40%_center] xl:object-[35%_center] select-none pointer-events-none"
                        alt={alt}
                        width={desktop.w}
                        height={desktop.h}
                        draggable={false}
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                    />
                </picture>
            </div>

            {/* Phones & tablets: the portrait product image on top (unchanged), content below on the same lilac */}
            <div className="lg:hidden w-full relative z-10">
                <picture className="block w-full">
                    {ready && <source media="(max-width: 1023px)" srcSet={mobile.src} width={mobile.w} height={mobile.h} />}
                    <img
                        src={BLANK_GIF}
                        className="w-full h-auto object-contain select-none pointer-events-none"
                        alt={alt}
                        width={mobile.w}
                        height={mobile.h}
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                    />
                </picture>
            </div>

            <div className="relative z-20 w-full">
                <div className="main-container w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
                        {/* key: remount when content arrives so the fade-in plays then, not while hidden */}
                        <div
                            key={String(ready)}
                            className={`lg:col-span-7 flex flex-col text-left -mt-2 pt-6 pb-8 sm:pb-10 lg:mt-0 lg:pt-0 lg:pb-0 md:max-w-[680px] md:mx-auto md:w-full lg:max-w-none lg:mx-0 ${ready ? '' : 'invisible'}`}
                        >
                            <h1 style={reveal(animate, 0).style} className={`text-[28px] min-[380px]:text-[31px] sm:text-[42px] lg:text-[clamp(32px,min(calc((100vh_-_200px)*0.087),3.5vw),52px)] font-extrabold tracking-[-0.02em] text-[#0b1f4b] leading-[1.08] lg:leading-[1.06] ${reveal(animate, 0).className}`}>
                                <Headline text={hero.headline} />
                            </h1>

                            <span style={reveal(animate, 1).style} className={`block w-16 lg:w-20 h-[4px] rounded-full bg-[#10b9dc] mt-4 mb-4 lg:my-[clamp(10px,2vh,20px)] ${reveal(animate, 1).className}`} aria-hidden="true" />

                            <p style={reveal(animate, 2).style} className={`text-[15px] lg:text-[clamp(14.5px,calc((100vh_-_200px)*0.031),19px)] text-[#1e2a44] leading-[1.5] max-w-[680px] lg:max-w-[620px] min-[1680px]:max-w-[700px] ${reveal(animate, 2).className}`}>
                                <KeepHyphenated text={hero.subtext} />
                            </p>

                            <div style={reveal(animate, 3).style} className={`mt-6 lg:mt-[clamp(14px,2.6vh,28px)] flex flex-col sm:flex-row gap-3 sm:gap-5 lg:gap-4 ${reveal(animate, 3).className}`}>
                                <Link
                                    to="/collections/all"
                                    className="inline-flex items-center justify-center gap-2.5 h-[52px] lg:h-[clamp(44px,calc((100vh_-_200px)*0.1),58px)] px-8 lg:px-7 rounded-full bg-gradient-to-r from-[#1a4494] to-[#0650b3] text-white font-semibold text-[16px] lg:text-[clamp(15px,2vh,17px)] whitespace-nowrap shadow-[0_8px_22px_rgba(11,102,214,0.28)] hover:brightness-95 transition-[filter] duration-200"
                                >
                                    {hero.primaryButtonText} <ArrowRight size={20} strokeWidth={2.25} />
                                </Link>
                                <Link
                                    to="/pages/coa"
                                    className="inline-flex items-center justify-center gap-2.5 h-[52px] lg:h-[clamp(44px,calc((100vh_-_200px)*0.1),58px)] px-8 lg:px-7 rounded-full border-[1.5px] border-[#0b4fa8] bg-white/80 text-[#0b2a66] font-semibold text-[16px] lg:text-[clamp(15px,2vh,17px)] whitespace-nowrap hover:bg-white transition-colors duration-200"
                                >
                                    <FileText size={20} strokeWidth={1.9} /> {hero.secondaryButtonText}
                                </Link>
                            </div>

                            {hero.showBadge && (
                                <PepFinderCard title={hero.badgeTitle} subtitle={hero.badgeSubtitle} linkText={hero.badgeLinkText} revealProps={reveal(animate, 4)} />
                            )}

                            <Features animate={animate} firstStep={featuresStep} />

                            <p style={reveal(animate, featuresStep + FEATURES.length).style} className={`mt-5 lg:mt-[clamp(8px,1.4vh,16px)] text-[12.5px] lg:text-[clamp(12.5px,1.7vh,14px)] text-slate-600 ${reveal(animate, featuresStep + FEATURES.length).className}`}>{hero.disclaimer}</p>
                        </div>

                        <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
