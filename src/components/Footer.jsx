import React from 'react'
import { Link } from 'react-router-dom'
import facebookIcon from '../assets/icons/facebook.png'
import linkdinIcon from '../assets/icons/linkdin.png'
import instagramIcon from '../assets/icons/instagram.png'
import twiterIcon from '../assets/icons/twiter.png'
import logo from '../assets/icons/logo.png'

function Footer() {
    return (
        <footer className="bg-[#0b1426] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="main-container mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-12 gap-6">
                    <div className="w-full max-w-[340px]">
                        <form className="flex bg-white rounded-full p-1" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent border-0 px-4 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="rounded-full bg-[#0ea5e9] px-7 py-2 text-[11px] font-bold tracking-wide text-white uppercase hover:bg-sky-500 transition-colors shrink-0"
                            >
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-white text-[17px] mr-2">Follow us:</span>
                        <a href="#" className="text-white hover:text-slate-300 transition-colors">
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                            </svg>
                        </a>
                        <a href="#" className="text-white hover:text-slate-300 transition-colors">
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 mt-2 mb-16 pt-10 border-t border-slate-700/50">
                    <div className="col-span-1 md:col-span-4 pr-6">
                        <Link to="/" className="flex items-center mb-6">
                            <img src={logo} alt="Solatide Biosciences" className="h-[75px] lg:h-[90px] w-auto object-contain" />
                        </Link>
                        <p className="text-[14px] text-slate-400/90 leading-[1.6]">
                            Solatide Biosciences supplies analytical reference standards and laboratory consumables for in-vitro laboratory research use only.
                        </p>
                        <div className="mt-5 text-[14px] text-slate-400/90 leading-relaxed">
                            <p>contact@solatidebiosciences.com.au</p>
                            <p>Melbourne, Victoria, Australia</p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-[20px] text-white mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-[14px] text-slate-300">
                            <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors duration-200">Shop Peptides</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQ's</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-[20px] text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-[14px] text-slate-300">
                            <li><Link to="/resource" className="hover:text-white transition-colors duration-200">Research Resources</Link></li>
                            <li><Link to="/peptides-guide" className="hover:text-white transition-colors duration-200">Research Peptides Guide</Link></li>
                            <li><Link to="/compound-database" className="hover:text-white transition-colors duration-200">Research Compound Database</Link></li>
                            <li><Link to="/coa" className="hover:text-white transition-colors duration-200">COA & Lab Testing</Link></li>
                            <li><Link to="/coa-reports" className="hover:text-white transition-colors duration-200">COA Reports</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-[20px] text-white mb-6">Support & Policies</h4>
                        <ul className="space-y-4 text-[14px] text-slate-300">
                            <li><Link to="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Services</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition-colors duration-200">Returns & Refunds</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800/80 pt-6 pb-2 text-center text-[13px] text-slate-400">
                    <p>© 2026 Solatide Biosciences. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer