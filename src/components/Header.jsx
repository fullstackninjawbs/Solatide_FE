import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search } from 'lucide-react'
import ReactCountryFlag from "react-country-flag"
import { useCart } from '../context/CartContext'
import { useCurrency, countriesList } from '../context/CurrencyContext'
import SearchModal from './SearchModal'
import logo from '../assets/icons/logo.png'




const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { setIsCartOpen, cartTotalCount } = useCart()
    const { selectedCountry, changeCountry } = useCurrency()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
    const [isMobileCountryDropdownOpen, setIsMobileCountryDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false)
    const dropdownRef = React.useRef(null)
    const mobileCountryDropdownRef = React.useRef(null)
    const moreDropdownRef = React.useRef(null)
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
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

                    // Hysteresis: Collapse at 50px, Expand at 10px to prevent infinite loop
                    if (currentScrollY > 50) {
                        setIsScrolled(true);
                    } else if (currentScrollY <= 10) {
                        setIsScrolled(false);
                        setIsScrollingUp(false);
                    }

                    lastScrollY.current = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false)
            }
            if (mobileCountryDropdownRef.current && !mobileCountryDropdownRef.current.contains(event.target)) {
                setIsMobileCountryDropdownOpen(false)
            }
            if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
                setIsMoreOpen(false)
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
        { name: 'Affiliate Program', path: '/affiliate-pro' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <header
            className={`top-0 left-0 w-full z-[999] transform-gpu transition-[background-color,border-color,box-shadow] duration-300 ease-in-out ${isHome ? 'fixed' : 'sticky'
                } ${(!isScrolled && !isMobileMenuOpen)
                    ? 'bg-transparent border-none shadow-none'
                    : 'bg-white/95 border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md'
                }`}
        >

            <div className={`w-full overflow-hidden transition-[height,opacity] duration-300 ease-in-out flex justify-center items-center gap-2 text-[13.5px] lg:text-[14.5px] font-bold text-[#1a4494] ${(!isScrolled && !isMobileMenuOpen) ? 'h-[36px] opacity-100' : 'h-0 opacity-0 pointer-events-none'
                }`}>
                <span className="tracking-wide">Australian owned & operated</span>
                <span className="flex items-center justify-center overflow-hidden rounded-[2px]" style={{ width: '20px', height: '14px' }}>
                    <ReactCountryFlag countryCode="AU" svg style={{ width: '20px', height: '15px', objectFit: 'cover' }} />
                </span>
            </div>

            <div className="main-container py-0">
                <div className="flex h-[72px] lg:h-[88px] items-center justify-between gap-6">

                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Solatide Biosciences" className="h-[52px] lg:h-[70px] w-auto object-contain" />
                        </Link>
                    </div>


                    <nav className="hidden xl:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-[7px] text-[13.5px] font-semibold transition-all duration-200 whitespace-nowrap rounded-full ${isActive(link.path)
                                    ? 'bg-[#e0eaf5] text-[#1a4494] shadow-sm'
                                    : 'text-[#374151] hover:text-[#1a4494] hover:bg-slate-100/80'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>


                    <div className="hidden xl:flex items-center gap-2.5">

                        <div
                            onClick={() => setIsSearchOpen(true)}
                            className="relative flex items-center bg-[#e0eaf5] rounded-full px-4 py-[7px] w-52 transition-all duration-200 cursor-pointer hover:bg-[#d0dfef]"
                        >
                            <Search className="h-[14px] w-[14px] text-[#1a4494]/70 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search"
                                readOnly
                                className="w-full bg-transparent border-0 p-0 text-[13px] text-[#1a4494] placeholder-[#1a4494]/60 font-medium focus:ring-0 focus:outline-none cursor-pointer"
                            />
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                className="inline-flex items-center gap-1.5 bg-[#102a5c] text-white px-3 py-[7px] rounded-full text-[12px] font-bold cursor-pointer hover:bg-[#1a4494] transition-colors shrink-0 select-none"
                            >
                                <span className="text-sm leading-none"><ReactCountryFlag countryCode={selectedCountry.countryCode} svg /></span>
                                <span>{selectedCountry.code}</span>
                                <svg className={`fill-white ml-0.5 transition-transform duration-200 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                    <path d="M5 8l7 8 7-8H5z" />
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

                                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
                                        {countriesList
                                            .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((country) => (
                                                <button
                                                    key={country.name}
                                                    onClick={() => {
                                                        changeCountry(country)
                                                        setIsCountryDropdownOpen(false)
                                                        setSearchQuery('')
                                                    }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold rounded-xl text-left transition-colors ${selectedCountry.name === country.name
                                                        ? 'bg-[#e0eaf5] text-[#1a4494]'
                                                        : 'hover:bg-white/70 text-[#102a5c]'
                                                        }`}
                                                >
                                                    <span className="text-base shrink-0 leading-none"><ReactCountryFlag countryCode={country.countryCode} svg /></span>
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

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative h-9 w-9 rounded-full bg-[#e0eaf5] flex items-center justify-center text-[#1a4494] hover:bg-[#d0dfef] transition-colors shrink-0"
                        >
                            <ShoppingCart className="h-[17px] w-[17px]" />
                            {cartTotalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#1a4494] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                                    {cartTotalCount}
                                </span>
                            )}
                        </button>

                    </div>

                    <div className="flex xl:hidden items-center gap-2.5">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="relative h-9 w-9 rounded-full bg-[#e0eaf5] flex items-center justify-center text-[#1a4494] shrink-0"
                            aria-label="Open Search"
                        >
                            <Search className="h-[17px] w-[17px]" />
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative h-9 w-9 rounded-full bg-[#e0eaf5] flex items-center justify-center text-[#1a4494] shrink-0"
                        >
                            <ShoppingCart className="h-[17px] w-[17px]" />
                            {cartTotalCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#1a4494] text-white text-[10px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                                    {cartTotalCount}
                                </span>
                            )}
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
                    <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-lg rounded-b-xl absolute left-0 w-full z-[999] max-h-[80vh] overflow-y-auto">
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
                            <div className="relative" ref={mobileCountryDropdownRef}>
                                <div
                                    onClick={() => setIsMobileCountryDropdownOpen(!isMobileCountryDropdownOpen)}
                                    className="flex items-center justify-between w-full bg-[#102a5c] text-white px-4 py-3 rounded-xl text-sm font-bold cursor-pointer select-none hover:bg-[#1a4494] transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-base leading-none flex items-center shrink-0"><ReactCountryFlag countryCode={selectedCountry.countryCode} svg /></span>
                                        <span className="uppercase tracking-wider">{selectedCountry.code}</span>
                                    </div>
                                    <svg className={`fill-white transition-transform duration-200 ${isMobileCountryDropdownOpen ? 'rotate-180' : ''}`} style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24">
                                        <path d="M5 8l7 8 7-8H5z" />
                                    </svg>
                                </div>

                                {isMobileCountryDropdownOpen && (
                                    <div className="mt-2 w-full bg-[#f4f7fc] border border-slate-200/80 rounded-2xl shadow-xl z-50 p-3 flex flex-col text-[#102a5c]">
                                        <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mb-2">
                                            <svg className="h-4 w-4 text-[#102a5c]/60 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Search country..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-transparent border-0 p-0 text-[13px] text-[#102a5c] placeholder-[#102a5c]/50 font-medium focus:ring-0 focus:outline-none"
                                            />
                                        </div>

                                        <div className="max-h-[180px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
                                            {countriesList
                                                .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((country) => (
                                                    <button
                                                        key={country.name}
                                                        onClick={() => {
                                                            changeCountry(country)
                                                            setIsMobileCountryDropdownOpen(false)
                                                            setSearchQuery('')
                                                        }}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-semibold rounded-xl text-left transition-colors ${selectedCountry.name === country.name
                                                            ? 'bg-[#e0eaf5] text-[#1a4494]'
                                                            : 'hover:bg-white/70 text-[#102a5c]'
                                                            }`}
                                                    >
                                                        <span className="text-base shrink-0 leading-none"><ReactCountryFlag countryCode={country.countryCode} svg /></span>
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
            {isSearchOpen && (
                <SearchModal onClose={() => setIsSearchOpen(false)} navigate={navigate} />
            )}
        </header>
    )
}

export default Header