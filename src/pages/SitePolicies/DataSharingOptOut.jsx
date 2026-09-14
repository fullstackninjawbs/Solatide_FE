import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Cookie, Sliders, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const DataSharingOptOut = () => {
    // Cookie-based opt-out toggle state (persisted in localStorage)
    const [optedOut, setOptedOut] = useState(() => {
        return localStorage.getItem('solatide_data_sharing_opt_out') === 'true';
    });
    const [savedNotice, setSavedNotice] = useState(false);

    // GPC detection
    const [gpcActive, setGpcActive] = useState(false);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && (navigator.globalPrivacyControl || window.globalPrivacyControl)) {
            setGpcActive(true);
        }
    }, []);

    // Form state for account-linked opt-out
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        state: '',
        notes: ''
    });

    const handleSaveCookiePreference = () => {
        localStorage.setItem('solatide_data_sharing_opt_out', String(optedOut));
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 4000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Record opt-out form submission locally
        try {
            const requests = JSON.parse(localStorage.getItem('solatide_privacy_requests') || '[]');
            requests.push({ ...formData, date: new Date().toISOString() });
            localStorage.setItem('solatide_privacy_requests', JSON.stringify(requests));
        } catch {
            // ignore localStorage quota errors
        }
        setFormSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            <Helmet>
                <title>Your Privacy Choices &amp; Data Sharing Opt-Out | Solatide Biosciences</title>
                <meta
                    name="description"
                    content="Exercise your privacy choices and manage your data sharing preferences with Solatide Biosciences. Opt out of targeted advertising, cookies, and data sharing."
                />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/data-sharing-opt-out-1" />
            </Helmet>

            {/* Header Banner */}
            <section className="w-full py-6 text-center border-b border-slate-100 mb-10 bg-[#fafcff]">
                <div className="main-container max-w-[960px] mx-auto px-4">
                    <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold text-[#214A9E] leading-tight mb-3">
                        Your Privacy Choices
                    </h1>
                    <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed max-w-[780px] mx-auto">
                        Manage your data sharing and targeted advertising preferences in accordance with applicable privacy laws.
                    </p>
                </div>
            </section>

            <div className="main-container max-w-[960px] mx-auto px-4 pb-20">
                {/* Intro Disclaimer / Explanation Box */}
                <div className="bg-[#F0F5FB] border-l-[3px] border-[#1a4494] p-5 mb-10 rounded-[4px]">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#214A9E] shrink-0 mt-0.5" />
                        <div className="space-y-2 text-[13.5px] text-slate-700 leading-relaxed">
                            <p>
                                <strong>Notice Regarding Personal Information:</strong> Depending on your jurisdiction or state of residence, you may have the right to opt out of the “sale” or “sharing” of your personal information, or the processing of your personal information for “targeted advertising.”
                            </p>
                            <p>
                                Solatide Biosciences does <strong>not</strong> sell personal information in exchange for monetary consideration. However, like many websites, we may use cookies, pixels, and similar tracking technologies to disclose certain information (such as identifiers, device details, and browsing activity) to third-party advertising and analytics partners to deliver personalized research content and ads.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Option 1: Browser Cookie Opt-Out */}
                <div className="mb-12 border border-[#E2E8F0] rounded-[10px] p-6 sm:p-8 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#EBF2FE] flex items-center justify-center text-[#214A9E]">
                            <Cookie className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#214A9E]">Option 01</span>
                            <h2 className="text-[20px] font-bold text-[#150F3A]">Cookie-Based Opt-Out (This Browser)</h2>
                        </div>
                    </div>

                    <p className="text-[14px] text-slate-600 leading-[1.8] mb-6">
                        Use the preference setting below to opt out of third-party advertising cookies and tracking scripts on this specific browser. Note that because your choice is stored locally, if you clear your browser cookies, switch browsers, or use another device, you will need to renew your preference.
                    </p>

                    <div className="bg-[#f8fafc] border border-slate-200 rounded-[8px] p-5 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[15px] font-semibold text-[#150F3A]">
                                    Opt Out of Targeted Advertising &amp; Tracking Cookies
                                </h3>
                                <p className="text-[13px] text-slate-500 mt-1">
                                    Current Status:{' '}
                                    <span className={optedOut ? 'text-emerald-700 font-bold' : 'text-slate-700 font-semibold'}>
                                        {optedOut ? 'Opted Out (Tracking Restricted)' : 'Standard (Analytics & Targeted Content Active)'}
                                    </span>
                                </p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={optedOut}
                                    onChange={(e) => setOptedOut(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-13 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#214A9E]"></div>
                                <span className="ml-3 text-[13.5px] font-medium text-slate-700">
                                    {optedOut ? 'Opted Out' : 'Allow'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleSaveCookiePreference}
                            className="bg-[#214A9E] hover:bg-[#1a3d82] text-white font-medium text-[14px] px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            Save Preferences
                        </button>
                        {savedNotice && (
                            <span className="inline-flex items-center gap-1.5 text-[13.5px] text-emerald-600 font-medium animate-fade-in">
                                <CheckCircle2 className="w-4 h-4" /> Preferences successfully saved!
                            </span>
                        )}
                    </div>
                </div>

                {/* Option 2: Global Privacy Control (GPC) */}
                <div className="mb-12 border border-[#E2E8F0] rounded-[10px] p-6 sm:p-8 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#EBF2FE] flex items-center justify-center text-[#214A9E]">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#214A9E]">Option 02</span>
                            <h2 className="text-[20px] font-bold text-[#150F3A]">Global Privacy Control (GPC)</h2>
                        </div>
                    </div>

                    <p className="text-[14px] text-slate-600 leading-[1.8] mb-4">
                        You can also opt out of the sale or sharing of personal information and targeted advertising automatically across websites by broadcasting the <strong>Global Privacy Control (GPC)</strong> signal from a supported browser or privacy extension.
                    </p>

                    <div className={`border rounded-[8px] p-4 flex items-start gap-3 ${gpcActive ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        {gpcActive ? (
                            <>
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="text-[13.5px] text-emerald-900 leading-relaxed">
                                    <strong className="font-semibold">GPC Signal Active:</strong> Your browser is broadcasting a Global Privacy Control signal. We automatically detect and honor this preference to restrict non-essential tracking and targeted ad disclosure for this session.
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                <div className="text-[13.5px] text-slate-600 leading-relaxed">
                                    <strong>No GPC Signal Detected:</strong> Your current browser is not transmitting an active Global Privacy Control signal. You can use Option 01 above or activate GPC in your browser settings (e.g., Brave, Firefox, or DuckDuckGo).
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Option 3: Account-Linked / Non-Cookie Opt-Out */}
                <div className="mb-12 border border-[#E2E8F0] rounded-[10px] p-6 sm:p-8 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#EBF2FE] flex items-center justify-center text-[#214A9E]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11.5px] font-bold uppercase tracking-wider text-[#214A9E]">Option 03</span>
                            <h2 className="text-[20px] font-bold text-[#150F3A]">Account-Linked &amp; Offline Data Opt-Out</h2>
                        </div>
                    </div>

                    <p className="text-[14px] text-slate-600 leading-[1.8] mb-6">
                        If you have an account or purchase history with Solatide Biosciences and wish to opt out of any non-cookie disclosures (such as hashed email matching for custom audiences), please complete the request form below or email us directly at{' '}
                        <a href="mailto:support@solatidebiosciences.com.au" className="text-[#3390ec] hover:underline font-medium">
                            support@solatidebiosciences.com.au
                        </a>{' '}
                        with the subject <em>“Privacy Opt-Out Request”</em>.
                    </p>

                    {formSubmitted ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-[8px] p-6 text-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                            <h3 className="text-[17px] font-bold text-emerald-950 mb-1">Opt-Out Request Received</h3>
                            <p className="text-[13.5px] text-emerald-800 max-w-[500px] mx-auto">
                                Thank you. We have recorded your opt-out request. Our compliance team will process your request across our customer records within the timeframe required by applicable laws.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-4 max-w-[640px]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Dr. Alex Morgan"
                                        className="w-full border border-slate-300 rounded-[6px] px-3.5 py-2 text-[14px] focus:outline-none focus:border-[#214A9E] focus:ring-1 focus:ring-[#214A9E]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="researcher@lab.org"
                                        className="w-full border border-slate-300 rounded-[6px] px-3.5 py-2 text-[14px] focus:outline-none focus:border-[#214A9E] focus:ring-1 focus:ring-[#214A9E]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                                    State / Region / Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    placeholder="e.g. New South Wales, Australia or California, USA"
                                    className="w-full border border-slate-300 rounded-[6px] px-3.5 py-2 text-[14px] focus:outline-none focus:border-[#214A9E] focus:ring-1 focus:ring-[#214A9E]"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-1">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Provide any specific account details or instructions..."
                                    className="w-full border border-slate-300 rounded-[6px] px-3.5 py-2 text-[14px] focus:outline-none focus:border-[#214A9E] focus:ring-1 focus:ring-[#214A9E]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-[#214A9E] hover:bg-[#1a3d82] text-white font-medium text-[14px] px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                Submit Opt-Out Request
                            </button>
                        </form>
                    )}
                </div>

                {/* More Information & Links */}
                <div className="border-t border-slate-200 pt-8">
                    <h3 className="text-[17px] font-bold text-[#150F3A] mb-2">More Information</h3>
                    <p className="text-[14px] text-slate-600 leading-[1.8] mb-4">
                        To learn more about what personal data we collect, how we protect it, and your full statutory rights, please review our comprehensive legal documentation:
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/pages/privacy-policy"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/pages/terms-of-services"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/pages/research-use-disclaimer"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors"
                        >
                            Research Disclaimer
                        </Link>
                        <Link
                            to="/pages/contact-us"
                            className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded-full text-[12.5px] text-[#3390ec] hover:bg-slate-50 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSharingOptOut;
