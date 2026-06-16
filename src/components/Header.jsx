import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const VisaSVG = () => (
    <span className="bg-white border border-slate-200/60 rounded px-1.5 py-0.5 flex items-center justify-center h-[18px] shrink-0">
        <svg className="h-[7px] w-auto text-[#1a4494]" viewBox="0 0 24 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.7 0.2L2.5 7.8H0.1L1.3 0.2H3.7ZM9.5 0.2L8.1 4.7L7.6 1.7C7.4 0.8 6.7 0.3 5.9 0.2H3.2L3.1 0.5C3.7 0.6 4.7 1.0 5.4 1.5C5.8 1.8 5.9 2.1 5.7 3.0L4.5 7.8H7.1L11.2 0.2H9.5ZM16.3 5.2C16.3 3.4 13.8 3.3 13.8 2.4C13.8 2.1 14.1 1.8 14.7 1.8C15.0 1.8 15.8 1.8 16.5 2.1L16.8 0.5C16.3 0.3 15.6 0.2 14.8 0.2C13.0 0.2 11.7 1.1 11.7 2.6C11.7 4.5 14.2 4.6 14.2 5.5C14.2 5.8 13.9 6.1 13.3 6.1C12.7 6.1 12.0 5.8 11.4 5.5L11.1 7.1C11.7 7.4 12.6 7.6 13.4 7.6C15.3 7.6 16.3 6.6 16.3 5.2ZM23.9 0.2H21.7C21.0 0.2 20.5 0.6 20.2 1.2L16.8 7.8H19.3L19.8 6.2H22.9L23.2 7.8H25.5L23.9 0.2ZM20.4 4.6L21.7 1.6L22.4 4.6H20.4Z" />
        </svg>
    </span>
)

const MastercardSVG = () => (
    <span className="bg-white border border-slate-200/60 rounded px-1.5 py-0.5 flex items-center justify-center h-[18px] shrink-0">
        <svg className="h-[9px] w-auto" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" />
            <circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" fillOpacity="0.85" />
        </svg>
    </span>
)

const ApplePaySVG = () => (
    <span className="bg-white border border-slate-200/60 rounded px-1.5 py-0.5 flex items-center justify-center h-[18px] shrink-0">
        <div className="flex items-center gap-0.5 text-black text-[7px] font-extrabold leading-none">
            <svg className="h-[7px] w-auto fill-black" viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.37.13-9.13-1.9-14.27-6.08-3.6-2.95-7.46-7.75-11.59-14.42-7.85-12.86-13.19-26.64-16.02-41.34-2.83-14.7-4.25-28.71-4.25-42.02 0-16.07 3.82-29.5 11.45-40.29 7.64-10.79 17.52-16.29 29.62-16.49 5.14 0 10.44 1.41 15.9 4.22 5.46 2.81 9.15 4.22 11.06 4.22 1.65 0 5.44-1.52 11.38-4.57 5.94-3.05 11.34-4.57 16.18-4.57 10.99 0 20.48 3.51 28.47 10.53 7.99 7.02 13.44 16.02 16.35 27-13.38 5.56-20.07 14.97-20.07 28.21 0 10.7 3.86 19.67 11.59 26.93 7.73 7.26 17.29 11.11 28.67 11.55-2.52 7.72-5.79 14.88-9.81 21.46zM119.22 26.24c0-7.72 2.76-14.88 8.27-21.49 5.52-6.61 12.42-10.45 20.71-11.53.15 8.13-2.61 15.54-8.27 22.21-5.67 6.67-12.76 10.63-20.71 11.89-.15-1.08-.25-2.08-.25-3.08z" />
            </svg>
            <span>Pay</span>
        </div>
    </span>
)



const countriesList = [
    { name: 'Australia', code: 'AUD', flag: '🇦🇺' },
    { name: 'United States', code: 'USD', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GBP', flag: '🇬🇧' },
    { name: 'Canada', code: 'CAD', flag: '🇨🇦' },
    { name: 'Euro Zone', code: 'EUR', flag: '🇪🇺' },
    { name: 'New Zealand', code: 'NZD', flag: '🇳🇿' },
    { name: 'Afghanistan', code: 'AFN', flag: '🇦🇫' },
    { name: 'Åland Islands', code: 'EUR', flag: '🇦🇽' },
    { name: 'Albania', code: 'ALL', flag: '🇦🇱' },
    { name: 'Algeria', code: 'DZD', flag: '🇩🇿' },
    { name: 'Andorra', code: 'EUR', flag: '🇦🇩' },
    { name: 'Angola', code: 'AOA', flag: '🇦🇴' },
    { name: 'Anguilla', code: 'XCD', flag: '🇦🇮' },
    { name: 'Antigua & Barbuda', code: 'XCD', flag: '🇦🇬' },
    { name: 'Argentina', code: 'ARS', flag: '🇦🇷' },
    { name: 'Armenia', code: 'AMD', flag: '🇦🇲' },
    { name: 'Austria', code: 'EUR', flag: '🇦🇹' },
    { name: 'Bahamas', code: 'BSD', flag: '🇧🇸' },
    { name: 'Bahrain', code: 'BHD', flag: '🇧🇭' },
    { name: 'Bangladesh', code: 'BDT', flag: '🇧🇩' },
    { name: 'Belgium', code: 'EUR', flag: '🇧🇪' },
    { name: 'Brazil', code: 'BRL', flag: '🇧🇷' },
    { name: 'China', code: 'CNY', flag: '🇨🇳' },
    { name: 'Denmark', code: 'DKK', flag: '🇩🇰' },
    { name: 'Egypt', code: 'EGP', flag: '🇪🇬' },
    { name: 'Fiji', code: 'FJD', flag: '🇫🇯' },
    { name: 'Finland', code: 'EUR', flag: '🇫🇮' },
    { name: 'France', code: 'EUR', flag: '🇫🇷' },
    { name: 'Germany', code: 'EUR', flag: '🇩🇪' },
    { name: 'India', code: 'INR', flag: '🇮🇳' },
    { name: 'Japan', code: 'JPY', flag: '🇯🇵' },
    { name: 'Singapore', code: 'SGD', flag: '🇸🇬' },
    { name: 'South Africa', code: 'ZAR', flag: '🇿🇦' },
    { name: 'Switzerland', code: 'CHF', flag: '🇨🇭' }
]

const Header = () => {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countriesList[0])
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = React.useRef(null)
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current) {

                if (currentScrollY > 50) {
                    setIsScrollingUp(true);
                } else {
                    setIsScrollingUp(false);
                }
            } else {
                setIsScrollingUp(false);
            }


            if (currentScrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
                setIsScrollingUp(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isHome = location.pathname === '/'

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'COA & Testing', path: '/coa' },
        { name: 'Calculator', path: '/calculator' },
        { name: "FAQ's", path: '/faq' },
        { name: 'More', path: '/more' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <header
            className={`top-0 left-0 w-full z-50 transition-all duration-300 ${isHome
                ? `fixed ${isScrollingUp || !isScrolled
                    ? 'bg-transparent border-b border-transparent'
                    : 'bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm'
                }`
                : `sticky ${isScrollingUp || !isScrolled
                    ? 'bg-transparent border-b border-transparent'
                    : 'bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm'
                }`
                }`}
        >

            <div className="w-full flex justify-center items-center py-[5px] px-4 gap-2 text-[12px] font-semibold text-[#214A9E]">
                <span className="tracking-wide">Card Payments Available</span>
                <div className="flex items-center gap-1">
                    <VisaSVG />
                    <MastercardSVG />
                    <ApplePaySVG />
                </div>
            </div>

            <div className="main-container py-0">
                <div className="flex h-[64px] items-center justify-between gap-6">

                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                                <svg className="h-9 w-9" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="8" r="2" fill="#0ea5e9" />
                                    <circle cx="34" cy="14" r="3" fill="#1a4494" />
                                    <circle cx="38" cy="24" r="2.5" fill="#0ea5e9" />
                                    <circle cx="34" cy="34" r="2" fill="#1a4494" />
                                    <circle cx="26" cy="40" r="3" fill="#0ea5e9" />
                                    <circle cx="16" cy="14" r="1.5" fill="#1a4494" />
                                    <circle cx="12" cy="24" r="2.5" fill="#0ea5e9" />
                                    <circle cx="16" cy="34" r="1.5" fill="#1a4494" />
                                    <circle cx="24" cy="22" r="2.5" fill="#0ea5e9" />
                                    <circle cx="26" cy="30" r="1.5" fill="#1a4494" />
                                    <line x1="24" y1="8" x2="34" y2="14" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="34" y1="14" x2="38" y2="24" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="38" y1="24" x2="34" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="34" y1="34" x2="26" y2="40" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="8" x2="16" y2="14" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="16" y1="14" x2="12" y2="24" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="12" y1="24" x2="16" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="16" y1="34" x2="26" y2="40" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="16" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="24" y2="8" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="34" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="38" y2="24" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="26" y2="30" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="26" y1="30" x2="34" y2="34" stroke="#1a4494" strokeWidth="0.75" />
                                    <line x1="26" y1="30" x2="16" y2="34" stroke="#0ea5e9" strokeWidth="0.75" />
                                </svg>
                            </div>
                            <div className="flex flex-col text-left leading-none">
                                <span className="text-[16px] font-extrabold tracking-widest text-[#1a4494] leading-none">SOLATIDE</span>
                                <span className="text-[8px] font-bold tracking-[0.20em] text-[#0ea5e9] leading-none mt-[3px]">BIOSCIENCES</span>
                            </div>
                        </Link>
                    </div>


                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-[7px] text-[13.5px] font-semibold transition-all duration-200 whitespace-nowrap ${isActive(link.path)
                                    ? 'bg-[#e0eaf5] text-[#1a4494] rounded-full shadow-sm'
                                    : 'text-[#374151] hover:text-[#1a4494] hover:bg-slate-100/80 rounded-full'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>


                    <div className="hidden lg:flex items-center gap-2.5">

                        <div className="relative flex items-center bg-[#e0eaf5] rounded-full px-4 py-[7px] w-52 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#1a4494]/20">
                            <svg className="h-[14px] w-[14px] text-[#1a4494]/70 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-transparent border-0 p-0 text-[13px] text-[#1a4494] placeholder-[#1a4494]/60 font-medium focus:ring-0 focus:outline-none"
                            />
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                className="inline-flex items-center gap-1.5 bg-[#102a5c] text-white px-3 py-[7px] rounded-full text-[12px] font-bold cursor-pointer hover:bg-[#1a4494] transition-colors shrink-0 select-none"
                            >
                                <span className="text-sm leading-none">{selectedCountry.flag}</span>
                                <span>{selectedCountry.code}</span>
                                <svg className={`h-[11px] w-[11px] fill-white ml-0.5 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5H7z" />
                                </svg>
                            </div>

                            {isCountryDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2.5 w-72 bg-[#f4f7fc] border border-slate-200/80 rounded-2xl shadow-xl z-50 p-3 flex flex-col text-[#102a5c]">
                                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mb-2">
                                        <svg className="h-4 w-4 text-[#102a5c]/60 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-[13px] text-[#102a5c] placeholder-[#102a5c]/50 font-medium focus:ring-0 focus:outline-none"
                                        />
                                    </div>

                                    <div className="max-h-[240px] overflow-y-auto flex flex-col gap-0.5 pr-1">
                                        {countriesList
                                            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((country) => (
                                                <button
                                                    key={country.name}
                                                    onClick={() => {
                                                        setSelectedCountry(country)
                                                        setIsCountryDropdownOpen(false)
                                                        setSearchQuery('')
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold rounded-xl text-left transition-colors ${selectedCountry.name === country.name
                                                        ? 'bg-[#e0eaf5] text-[#1a4494]'
                                                        : 'hover:bg-white/70 text-[#102a5c]'
                                                        }`}
                                                >
                                                    <span className="text-base shrink-0 leading-none">{country.flag}</span>
                                                    <span className="truncate flex-1">{country.name}</span>
                                                    <span className="text-[11px] font-bold opacity-60 shrink-0">{country.code}</span>
                                                </button>
                                            ))}
                                        {countriesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                            <div className="text-center py-4 text-xs font-semibold text-slate-400">
                                                No countries found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center rounded-full bg-[#1a4494] px-5 py-[7px] text-[13px] font-bold text-white hover:bg-[#153a7a] transition-colors whitespace-nowrap shrink-0"
                        >
                            Contact Us
                        </Link>

                        <button className="relative h-9 w-9 rounded-full bg-[#e0eaf5] flex items-center justify-center text-[#1a4494] hover:bg-[#d0dfef] transition-colors shrink-0">
                            <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>

                    </div>

                    <div className="flex lg:hidden items-center gap-2.5">
                        <button className="relative h-9 w-9 rounded-full bg-[#e0eaf5] flex items-center justify-center text-[#1a4494] shrink-0">
                            <svg className="h-[17px] w-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 py-4 space-y-1 shadow-lg rounded-b-xl absolute left-0 w-full z-40">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-4 py-2.5 text-sm font-semibold rounded-[12px] transition-colors ${isActive(link.path)
                                    ? 'bg-[#EBF3FF] text-[#1a4494] border border-[#C7DDF7]'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-slate-100 mt-2 flex flex-col gap-3">
                            <div className="relative">
                                <div
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="inline-flex self-start items-center gap-1.5 bg-[#102a5c] text-white px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer select-none"
                                >
                                    <span className="text-sm leading-none">{selectedCountry.flag}</span>
                                    <span>{selectedCountry.code}</span>
                                    <svg className={`h-[11px] w-[11px] fill-white ml-0.5 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24">
                                        <path d="M7 10l5 5 5-5H7z" />
                                    </svg>
                                </div>

                                {isCountryDropdownOpen && (
                                    <div className="mt-2 w-full bg-[#f4f7fc] border border-slate-200/80 rounded-2xl shadow-xl z-50 p-3 flex flex-col text-[#102a5c]">
                                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mb-2">
                                            <svg className="h-4 w-4 text-[#102a5c]/60 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-transparent border-0 p-0 text-[13px] text-[#102a5c] placeholder-[#102a5c]/50 font-medium focus:ring-0 focus:outline-none"
                                            />
                                        </div>

                                        <div className="max-h-[180px] overflow-y-auto flex flex-col gap-0.5 pr-1">
                                            {countriesList
                                                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((country) => (
                                                    <button
                                                        key={country.name}
                                                        onClick={() => {
                                                            setSelectedCountry(country)
                                                            setIsCountryDropdownOpen(false)
                                                            setSearchQuery('')
                                                            setIsMobileMenuOpen(false)
                                                        }}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold rounded-xl text-left transition-colors ${selectedCountry.name === country.name
                                                            ? 'bg-[#e0eaf5] text-[#1a4494]'
                                                            : 'hover:bg-white/70 text-[#102a5c]'
                                                            }`}
                                                    >
                                                        <span className="text-base shrink-0 leading-none">{country.flag}</span>
                                                        <span className="truncate flex-1">{country.name}</span>
                                                        <span className="text-[11px] font-bold opacity-60 shrink-0">{country.code}</span>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link
                                to="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex w-full items-center justify-center rounded-xl bg-[#1a4494] py-3 text-sm font-bold text-white hover:bg-[#153a7a] transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header