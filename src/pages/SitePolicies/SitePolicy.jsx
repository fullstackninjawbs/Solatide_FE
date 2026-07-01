import React, { useEffect, useState } from 'react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('personal-information');

    const sections = [
        { id: 'personal-information', num: '01', title: 'Personal Information We Collect or Process' },
        { id: 'information-sources', num: '02', title: 'Personal Information Sources' },
        { id: 'use-information', num: '03', title: 'How We Use Your Personal Information' },
        { id: 'disclose-information', num: '04', title: 'How We Disclose Personal Information' },
        { id: 'third-party-links', num: '05', title: 'Third Party Websites and Links' },
        { id: 'childrens-data', num: '06', title: 'Children\'s Data' },
        { id: 'security-retention', num: '07', title: 'Security and Retention of Your Information' },
        { id: 'rights-choices', num: '08', title: 'Your Rights and Choices' },
        { id: 'complaints', num: '09', title: 'Complaints' },
        { id: 'international-transfers', num: '10', title: 'International Transfers' },
        { id: 'policy-changes', num: '11', title: 'Changes to This Privacy Policy' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('personal-information');
                return;
            }

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 220 && rect.bottom >= 220) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToId = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 120,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen pb-20">
            {/* Header Banner */}
            <section className="w-full bg-[#F0F5FB] py-16 text-center border-b border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <h1
                        className="text-4xl sm:text-5xl font-semibold text-[#214A9E] leading-tight mb-6"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Privacy Policy
                    </h1>
                    <p className="text-[15px] sm:text-[16px] font-regular text-[#6A6A6A] leading-[1.75] max-w-[1440px] mx-auto">
                        Solatide Biosciences operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us. If there is a conflict between our Terms of Service and this Privacy Policy, this Privacy Policy controls with respect to the collection, processing, and disclosure of your personal information.
                    </p>
                </div>
            </section>

            {/* Layout Wrapper */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Sticky Sidebar navigation */}
                    <aside className="hidden lg:block w-[320px] bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm shrink-0 sticky top-[90px] text-left">
                        <h3 className="text-[17px] font-semibold text-[#1E1E1E] mb-4 px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            On this page
                        </h3>
                        <nav className="space-y-1">
                            {sections.map((sec) => (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToId(sec.id)}
                                    className={`w-full flex items-start gap-3.5 px-3 py-2.5 rounded-lg text-[14.5px] transition-all ${activeSection === sec.id
                                        ? 'bg-[#F0F5FB] text-[#214A9E] font-semibold'
                                        : 'text-slate-600 hover:text-black hover:bg-slate-50 font-medium'
                                        }`}
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    <span className={`text-[14px] shrink-0 w-5 pt-0.5 ${activeSection === sec.id ? 'text-[#214A9E] font-bold' : 'text-[#94A3B8]'}`}>
                                        {sec.num}
                                    </span>
                                    <span className="flex-1 text-left whitespace-normal">{sec.title}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Right Content Area */}
                    <div className="flex-grow w-full space-y-12 text-left lg:max-w-[calc(100%-352px)]">

                        {/* Welcome Disclaimer Box */}
                        <div className="bg-[#fef3c7]/40 border-l-4 border-amber-500 rounded-r-2xl p-6 text-[14.5px] leading-relaxed text-amber-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <strong className="font-bold text-amber-950">Disclaimer:</strong> Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy.
                        </div>

                        {/* Section 01: Personal Information We Collect or Process */}
                        <section id="personal-information" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Information Gathering
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Personal Information We Collect or Process
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    When we use the term "personal information," we are referring to information that identifies or can reasonably be linked to you or another person. Personal information does not include information that is collected anonymously or that has been de-identified, so that it cannot identify or be reasonably linked to you. We may collect or process the following categories of personal information, including inferences drawn from this personal information, depending on how you interact with the Services, where you live, and as permitted or required by applicable law:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Contact details</strong> including your name, address, billing address, shipping address, phone number, and email address.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Financial information</strong> including credit card, debit card, and financial account numbers, payment card information, financial account information, transaction details, form of payment, payment confirmation and other payment details.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Account information</strong> including your username, password, security questions, preferences and settings.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Transaction information</strong> including the items you view, put in your cart, add to your wishlist, or purchase, return, exchange or cancel and your past transactions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Communications with us</strong> including the information you include in communications with us, for example, when sending a customer support inquiry.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Device information</strong> including information about your device, browser, or network connection, your IP address, and other unique identifiers.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Usage information</strong> including information regarding your interaction with the Services, including how and when you interact with or navigate the Services.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 02: Personal Information Sources */}
                        <section id="information-sources" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Information Origins
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Personal Information Sources
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    We may collect personal information from the following sources:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Directly from you</strong> including when you create an account, visit or use the Services, communicate with us, or otherwise provide us with your personal information;</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Automatically through the Services</strong> including from your device when you use our products or services or visit our websites, and through the use of cookies and similar technologies;</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">From our service providers</strong> including when we engage them to enable certain technology and when they collect or process your personal information on our behalf;</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">From our partners or other third parties.</strong></span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 03: How We Use Your Personal Information */}
                        <section id="use-information" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Information Usage
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                How We Use Your Personal Information
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    Depending on how you interact with us or which of the Services you use, we may use personal information for the following purposes:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Provide, Tailor, and Improve the Services.</strong> We use your personal information to provide you with the Services, including to perform our contract with you, to process your payments, to fulfill your orders, to remember your preferences and items you are interested in, to send notifications to you related to your account, to process purchases, returns, exchanges or other transactions, to create, maintain and otherwise manage your account, to arrange for shipping, to facilitate any returns and exchanges, to enable you to post reviews, and to create a customized shopping experience for you, such as recommending products related to your purchases. This may include using your personal information to better tailor and improve the Services.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Marketing and Advertising.</strong> We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications by email, text message or postal mail, and to show you online advertisements for products or services on the Services or other websites, including based on items you previously have purchased or added to your cart and other activity on the Services.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Security and Fraud Prevention.</strong> We use your personal information to authenticate your account, to provide a secure payment and shopping experience, detect, investigate or take action regarding possible fraudulent, illegal, unsafe, or malicious activity, protect public safety, and to secure our services. If you choose to use the Services and register an account, you are responsible for keeping your account credentials safe. We highly recommend that you do not share your username, password or other access details with anyone else.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Communicating with You.</strong> We use your personal information to provide you with customer support, to be responsive to you, to provide effective services to you and to maintain our business relationship with you.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Legal Reasons.</strong> We use your personal information to comply with applicable law or respond to valid legal process, including requests from law enforcement or government agencies, to investigate or participate in civil discovery, potential or actual litigation, or other adversarial legal proceedings, and to enforce or investigate potential violations of our terms or policies.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 04: How We Disclose Personal Information */}
                        <section id="disclose-information" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Information Disclosure
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                How We Disclose Personal Information
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    In certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">With vendors and other third parties</strong> who perform services on our behalf (e.g. IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">With business and marketing partners</strong> to provide marketing services and advertise to you. For example, we support personalized advertising with third-party services based on your online activity with different merchants and websites. Our business and marketing partners will use your information in accordance with their own privacy notices. Depending on where you reside, you may have a right to direct us not to share information about you to show you targeted advertisements and marketing based on your online activity with different merchants and websites. You can exercise your rights to opt-out of those uses <span className="text-[#00bfef] underline cursor-pointer">here</span>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">When you direct, request us or otherwise consent</strong> to our disclosure of certain information to third parties, such as to ship you products or through your use of social media widgets or login integrations.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">With our affiliates</strong> or otherwise within our corporate group.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">In connection with a business transaction</strong> such as a merger or bankruptcy, to comply with any applicable legal obligations (including to respond to subpoenas, search warrants and similar requests), to enforce any applicable terms of service or policies, and to protect or defend the Services, our rights, and the rights of our users or others.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 06: Third Party Websites and Links */}
                        <section id="third-party-links" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                External Sites
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Third Party Websites and Links
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    The Services may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated or controlled by us, you should review their privacy and security policies and other terms and conditions. We do not guarantee and are not responsible for the privacy or security of such sites, including the accuracy, completeness, or reliability of information found on these sites. Information you provide on public or semi-public venues, including information you share on third-party social networking platforms may also be viewable by other users of the Services and/or users of those third-party platforms without limitation as to its use by us or by a third party. Our inclusion of such links does not, by itself, imply any endorsement of the content on such platforms or of their owners or operators, except as disclosed on the Services.
                                </p>
                            </div>
                        </section>

                        {/* Section 07: Children's Data */}
                        <section id="childrens-data" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Age Limitations
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Children's Data
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority in your jurisdiction. If you are the parent or guardian of a child who has provided us with their personal information, you may contact us using the contact details set out below to request that it be deleted.As of the Effective Date of this Privacy Policy, we do not have actual knowledge that we "share" or "sell" (as those terms are defined in applicable law) personal information of individuals under 16 years of age.
                                </p>
                            </div>
                        </section>

                        {/* Section 08: Security and Retention of Your Information */}
                        <section id="security-retention" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Data Safeguards
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Security and Retention of Your Information
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    Please be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.
                                </p>
                                <p>
                                    How long we retain your personal information depends on different factors, such as whether we need the information to maintain your account, to provide you with Services, comply with legal obligations, resolve disputes or enforce other applicable contracts and policies.
                                </p>
                            </div>
                        </section>

                        {/* Section 09: Your Rights and Choices */}
                        <section id="rights-choices" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Control & Consent
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Your Rights and Choices
                            </h2>
                            <div className="space-y-6 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    Depending on where you live, you may have some or all of the rights listed below in relation to your personal information. However, these rights are not absolute, may apply only in certain circumstances and, in certain cases, we may decline your request as permitted by law.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Right to Access / Know.</strong> You may have a right to request access to personal information that we hold about you.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Right to Delete.</strong> You may have a right to request that we delete personal information we maintain about you.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Right to Correct.</strong> You may have a right to request that we correct inaccurate personal information we maintain about you.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Right of Portability.</strong> You may have a right to receive a copy of the personal information we hold about you and to request that we transfer it to a third party, in certain circumstances and with certain exceptions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Right to Opt out of Sale or Sharing for Targeted Advertising.</strong> Depending on where you reside, you may have a right to opt out of the "sale" or "share" of your personal information or to opt out of the processing of your personal information for purposes considered to be "targeted advertising", as defined in applicable privacy laws. You can exercise your rights to opt-out of those uses <span className="text-[#00bfef] underline cursor-pointer">here</span>. Please note that if you visit our website with the Global Privacy Control opt-out preference signal enabled, depending on where you are, we will automatically treat this as a request to opt-out for the device and browser that you use to visit the website. If we are able to associate the device sending the signal to your account, we will apply the opt out request to the account as well. To learn more about Global Privacy Control, you can visit https://globalprivacycontrol.org/. Other than the Global Privacy Control, we do not recognize other "Do Not Track" signals that may be sent from your web browser or device.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                        <span><strong className="text-slate-800 font-semibold">Managing Communication Preferences.</strong> We may send you promotional emails, and you may opt out of receiving these at any time by using the unsubscribe option displayed in our emails to you. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made.</span>
                                    </li>
                                </ul>

                                <div className="mt-8 pt-4 border-t border-slate-100">
                                    <p className="font-semibold text-slate-800 mb-4">
                                        If you reside in the UK or European Economic Area, and subject to exceptions and limitations provided by local law, you may exercise the following rights in addition to the rights outlined above:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                            <span><strong className="text-slate-800 font-semibold">Objection to Processing and Restriction of Processing:</strong> You may have the right to ask us to stop or restrict our processing of personal information for certain purposes.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#214A9E] mt-[9px] shrink-0"></span>
                                            <span><strong className="text-slate-800 font-semibold">Withdrawal of Consent:</strong> Where we rely on consent to process your personal information, you have the right to withdraw this consent. If you withdraw your consent, this will not affect the lawfulness of any processing based on your consent before its withdrawal.</span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="mt-6">
                                    You may exercise any of these rights where indicated on the Services or by contacting us using the contact details provided below.
                                </p>

                                <p>
                                    We will not discriminate against you for exercising any of these rights. We may need to verify your identity before we can process your requests, as permitted or required under applicable law. In accordance with applicable laws, you may designate an authorized agent to make requests on your behalf to exercise your rights. Before accepting such a request from an agent, we will require that the agent provide proof you have authorized them to act on your behalf, and we may need you to verify your identity directly with us. We will respond to your request in a timely manner as required under applicable law.
                                </p>
                            </div>
                        </section>

                        {/* Section 10: Complaints */}
                        <section id="complaints" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Feedback & Disputes
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Complaints
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    If you have complaints about how we process your personal information, please contact us using the contact details provided below. Depending on where you live, you may have the right to appeal our decision by contacting us using the contact details set out below, or lodge your complaint with your local data protection authority. For the EEA, you can find a list of the responsible data protection supervisory authorities <span className="text-[#00bfef] underline cursor-pointer">here</span>.
                                </p>
                            </div>
                        </section>

                        {/* Section 11: International Transfers */}
                        <section id="international-transfers" className="scroll-mt-24 py-2 pb-8">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Cross-Border Data
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                International Transfers
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    Please note that we may transfer, store and process your personal information outside the country you live in.
                                </p>
                                <p>
                                    If we transfer your personal information out of the European Economic Area or the United Kingdom, we will rely on recognized transfer mechanisms like the European Commission's Standard Contractual Clauses, or any equivalent contracts issued by the relevant competent authority of the UK, as relevant, unless the data transfer is to a country that has been determined to provide an adequate level of protection.
                                </p>
                            </div>
                        </section>

                        {/* Section 12: Changes to This Privacy Policy */}
                        <section id="policy-changes" className="scroll-mt-24 py-2">
                            {/* <span className="text-[#00bfef] text-[13px] font-extrabold tracking-widest uppercase mb-1 block">
                                Document Updates
                            </span> */}
                            <h2 className="text-2xl sm:text-3xl font-semibold text-[#214A9E] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Changes to This Privacy Policy
                            </h2>
                            <div className="space-y-4 text-[#6A6A6A] text-[15px] leading-[1.7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <p>
                                    We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on this website, update the "Last updated" date and provide notice as required by applicable law.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
