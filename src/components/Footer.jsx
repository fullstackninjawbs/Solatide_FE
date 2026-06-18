import React from 'react'
import { Link } from 'react-router-dom'
import facebookIcon from '../assets/icons/facebook.png'
import linkdinIcon from '../assets/icons/linkdin.png'
import instagramIcon from '../assets/icons/instagram.png'
import twiterIcon from '../assets/icons/twiter.png'

function Footer() {
    return (
        <footer className="bg-[#071120] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
            <div className="main-container">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-12 gap-6">
                    <div className="w-full max-w-sm">
                        <form className="flex bg-white rounded-full p-1 border border-sky-400 shadow-sm" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent border-0 px-4 py-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="rounded-full bg-[#009bf2] px-6 py-2.5 text-xs font-bold text-white uppercase hover:bg-sky-500 transition-colors shrink-0"
                            >
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-white font-semibold text-sm mr-2">Follow Us:</span>
                        <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#071120] hover:opacity-90 transition-opacity">
                            <img src={facebookIcon} alt="Facebook" className="h-4.5 w-4.5 object-contain" />
                        </a>
                        <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#071120] hover:opacity-90 transition-opacity">
                            <img src={linkdinIcon} alt="LinkedIn" className="h-4.5 w-4.5 object-contain" />
                        </a>
                        <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#071120] hover:opacity-90 transition-opacity">
                            <img src={instagramIcon} alt="Instagram" className="h-4.5 w-4.5 object-contain" />
                        </a>
                        <a href="#" className="h-8 w-8 flex items-center justify-center rounded-full bg-white text-[#071120] hover:opacity-90 transition-opacity">
                            <img src={twiterIcon} alt="X" className="h-4.5 w-4.5 object-contain" />
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4 mb-16">
                    <div className="col-span-1 md:col-span-4 max-w-[280px]">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="8" r="2" fill="#38bdf8" />
                                    <circle cx="34" cy="14" r="3" fill="#0ea5e9" />
                                    <circle cx="38" cy="24" r="2.5" fill="#38bdf8" />
                                    <circle cx="34" cy="34" r="2" fill="#0ea5e9" />
                                    <circle cx="26" cy="40" r="3" fill="#38bdf8" />
                                    <circle cx="16" cy="14" r="1.5" fill="#0ea5e9" />
                                    <circle cx="12" cy="24" r="2.5" fill="#38bdf8" />
                                    <circle cx="16" cy="34" r="1.5" fill="#0ea5e9" />
                                    <circle cx="24" cy="22" r="2.5" fill="#38bdf8" />
                                    <circle cx="26" cy="30" r="1.5" fill="#0ea5e9" />

                                    <line x1="24" y1="8" x2="34" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="34" y1="14" x2="38" y2="24" stroke="#38bdf8" strokeWidth="0.75" />
                                    <line x1="38" y1="24" x2="34" y2="34" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="34" y1="34" x2="26" y2="40" stroke="#38bdf8" strokeWidth="0.75" />

                                    <line x1="24" y1="8" x2="16" y2="14" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="16" y1="14" x2="12" y2="24" stroke="#38bdf8" strokeWidth="0.75" />
                                    <line x1="12" y1="24" x2="16" y2="34" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="16" y1="34" x2="26" y2="40" stroke="#38bdf8" strokeWidth="0.75" />

                                    <line x1="24" y1="22" x2="16" y2="14" stroke="#38bdf8" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="24" y2="8" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="34" y2="14" stroke="#38bdf8" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="38" y2="24" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="24" y1="22" x2="26" y2="30" stroke="#38bdf8" strokeWidth="0.75" />
                                    <line x1="26" y1="30" x2="34" y2="34" stroke="#0ea5e9" strokeWidth="0.75" />
                                    <line x1="26" y1="30" x2="16" y2="34" stroke="#38bdf8" strokeWidth="0.75" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-wider text-white leading-none">SOLATIDE</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#0ea5e9] leading-none mt-1">BIOSCIENCES</span>
                            </div>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Precision-developed compounds for laboratory research. Delivered with clarity, consistency and trust.
                        </p>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-4">Shop</h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li><Link to="/shop" className="hover:text-white transition-colors duration-200">All Product</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-4">Quick links</h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li><Link to="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors duration-200">About Us</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-4">Policies</h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li><Link to="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Policy</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors duration-200">FAQs</Link></li>
                            <li><Link to="/shipping-policy" className="hover:text-white transition-colors duration-200">Shipping Information</Link></li>
                            <li><Link to="/returns" className="hover:text-white transition-colors duration-200">Returns & Refunds</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-4">Research Resources</h4>
                        <ul className="space-y-3 text-xs text-slate-400">
                            <li><Link to="/resource" className="hover:text-white transition-colors duration-200">Research Resources</Link></li>
                            <li><Link to="/peptides-guide" className="hover:text-white transition-colors duration-200">Research Peptides Guide</Link></li>
                            <li><Link to="/compound-database" className="hover:text-white transition-colors duration-200">Research Compound Database</Link></li>
                            <li><Link to="/coa" className="hover:text-white transition-colors duration-200">COA & Lab Testing</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800/80 pt-8 text-center text-xs text-slate-500">
                    <p>© 2026 solatidebiosciences. Clinical Excellence.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer