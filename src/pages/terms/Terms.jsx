import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const sections = [
    { id: 'eligibility', num: '01', title: 'Eligibility and authority' },
    { id: 'research', num: '02', title: 'Research-use-only products' },
    { id: 'buyer', num: '03', title: 'Buyer responsibilities' },
    { id: 'account', num: '04', title: 'Account, order, and information accuracy' },
    { id: 'product', num: '05', title: 'Product information and website content' },
    { id: 'orders', num: '06', title: 'Orders and acceptance' },
    { id: 'manual', num: '07', title: 'Manual payment orders' },
    { id: 'pricing', num: '08', title: 'Pricing, taxes, and billing' },
    { id: 'shipping', num: '09', title: 'Shipping, delivery, and risk' },
    { id: 'customs', num: '10', title: 'Customs, imports, and cross-border orders' },
    { id: 'refunds', num: '11', title: 'Refunds, returns, and remedies' },
    { id: 'refuse', num: '12', title: 'Right to refuse or cancel orders' },
    { id: 'prohibited', num: '13', title: 'Prohibited conduct' },
    { id: 'ip', num: '14', title: 'Intellectual property' },
    { id: 'reviews', num: '15', title: 'Reviews, submissions, and feedback' },
    { id: 'third-party', num: '16', title: 'Third-party tools, services, and links' },
    { id: 'privacy', num: '17', title: 'Privacy' },
    { id: 'disclaimer', num: '18', title: 'Disclaimer' },
    { id: 'liability', num: '19', title: 'Limitation of liability' },
    { id: 'indemnity', num: '20', title: 'Indemnity' },
    { id: 'force-majeure', num: '21', title: 'Force majeure' },
    { id: 'suspension', num: '22', title: 'Suspension and termination' },
    { id: 'changes', num: '23', title: 'Changes to products, services, and terms' },
    { id: 'severability', num: '24', title: 'Severability' },
    { id: 'waiver', num: '25', title: 'Waiver' },
    { id: 'assignment', num: '26', title: 'Assignment' },
    { id: 'governing-law', num: '27', title: '27. Governing law and jurisdiction' },
    { id: 'entire-agreement', num: '28', title: 'Entire agreement' },
];

const Terms = () => {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200; // offset for fixed header

            for (let i = sectionElements.length - 1; i >= 0; i--) {
                const section = sectionElements[i];
                if (section && section.offsetTop <= scrollPosition) {
                    if (activeSection !== sections[i].id) {
                        setActiveSection(sections[i].id);
                    }
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeSection]);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100, // offset for fixed header
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full bg-white min-h-screen">
            <section className="w-full py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Terms of Service
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        These Terms of Service ("Terms") govern your access to and use of the Solatide Biosciences website, online store, products, content, tools, calculators, research resources, and related services (collectively, the "Services"). </p>
                </div>
            </section>

            <div className="main-container px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
                <div className="hidden lg:block w-[300px] shrink-0 sticky top-32 border border-slate-200 rounded-xl bg-white p-6 shadow-sm overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
                    <h3 className="text-[#214A9E] font-bold text-[15px] mb-6 pl-3">On this page</h3>
                    <ul className="space-y-1 relative">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    onClick={(e) => scrollToSection(e, section.id)}
                                    className={`flex items-start gap-3.5 py-2.5 px-3 rounded-lg text-[13.5px] transition-colors ${activeSection === section.id
                                        ? 'bg-[#e6effc] text-[#214A9E] font-bold'
                                        : 'text-slate-500 hover:text-[#214A9E] hover:bg-slate-50 font-medium'
                                        }`}
                                >
                                    <span className={`text-[11px] mt-1 shrink-0 ${activeSection === section.id ? 'opacity-100' : 'opacity-50'}`}>{section.num}</span>
                                    <span className="leading-tight">{section.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">

                    {/* Disclaimer Banner */}
                    <div className="bg-[#fff9f2] border-l-[3px] border-[#ea580c] p-7 rounded-r-xl mb-14 shadow-sm">
                        <p className="text-[#9a3412] text-[13.5px] leading-[1.8] font-medium">
                            <span className="font-bold text-[#ea580c]">Disclaimer:</span> By accessing or using the Services, or by placing an order with Solatide Biosciences ("we", "us", "our"), you agree to be bound by these Terms together with our <span className="text-[#38bdf8] hover:underline cursor-pointer">Privacy Policy</span>, <span className="text-[#38bdf8] hover:underline cursor-pointer">Shipping Policy</span>, <span className="text-[#38bdf8] hover:underline cursor-pointer">Refund Policy</span>, <span className="text-[#38bdf8] hover:underline cursor-pointer">Research Use Disclaimer</span>, and any other policies or notices posted on our website from time to time.<br /><br />
                            If you do not agree to these Terms, you must not access or use the Services.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* Section 1 */}
                        <section id="eligibility" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Eligibility and authority</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You must be at least 18 years old, or the age of legal majority in your jurisdiction, to access the Services or place an order.</p>
                                <p>By using the Services, you represent and warrant that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>you are legally capable of entering into a binding contract;</li>
                                    <li>all information you provide is true, current, complete, and accurate;</li>
                                    <li>you are accessing and purchasing our products solely for lawful purposes and in accordance with these Terms; and</li>
                                    <li>you will not use our Services or products in any way that is unlawful, prohibited, misleading, or inconsistent with our Research Use Disclaimer.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="research" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Research-use-only products</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>All compounds, lyophilised peptides, reagents, and related products sold by Solatide Biosciences are supplied strictly for in-vitro laboratory, analytical, and scientific research purposes only.</p>
                                <p>Our products are not intended or offered for:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>human use or human consumption;</li>
                                    <li>veterinary use or administration;</li>
                                    <li>clinical use;</li>
                                    <li>diagnostic use;</li>
                                    <li>therapeutic use;</li>
                                    <li>preventative use;</li>
                                    <li>cosmetic use;</li>
                                    <li>household use;</li>
                                    <li>administration to any living organism; or</li>
                                    <li>any unlawful purpose.</li>
                                </ul>
                                <p className="pt-2">You acknowledge and agree that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>you are purchasing and using products solely for legitimate research purposes;</li>
                                    <li>you will not misuse, repackage, relabel, market, transfer, or supply products for any prohibited purpose; and</li>
                                    <li>any educational, analytical, technical, structural, or molecular information made available on the website is provided for research-identification and general informational purposes only and does not constitute medical, clinical, therapeutic, diagnostic, veterinary, or safety advice.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="buyer" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Buyer responsibilities</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>As a buyer, you assume all responsibility and liability for the handling, storage, and use of our products. You agree to ensure that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>all research involving our products is conducted under strict laboratory conditions by qualified professionals;</li>
                                    <li>you follow all applicable local, state, and federal laws and regulations regarding the purchase, possession, and use of our products;</li>
                                    <li>you maintain appropriate safety protocols and wear adequate personal protective equipment (PPE) when handling any compounds; and</li>
                                    <li>you will safely dispose of any unused or waste products in accordance with environmental and safety guidelines.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 4: Account, order, and information accuracy */}
                        <section id="account" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Account, order, and information accuracy</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You may browse the website without creating an account, but certain features may require you to provide information such as your name, email, billing details, shipping details, and payment information.</p>
                                <p>You agree that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>all information submitted by you is accurate and complete;</li>
                                    <li>you will promptly update any information that becomes inaccurate;</li>
                                    <li>you will not impersonate any person or entity or otherwise submit misleading information; and</li>
                                    <li>you are responsible for maintaining the confidentiality of any login credentials associated with your account.</li>
                                </ul>
                                <p>We reserve the right to refuse service, suspend accounts, or cancel orders where information appears inaccurate, incomplete, suspicious, fraudulent, or inconsistent with these Terms.</p>
                            </div>
                        </section>

                        {/* Section 5: Product information and website content */}
                        <section id="product" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Product information and website content</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We aim to ensure that product descriptions, images, technical details, educational pages, and other content on the website are as accurate as reasonably possible. However:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>all product information is subject to change without notice;</li>
                                    <li>images and visual representations are illustrative and may vary from actual appearance;</li>
                                    <li>educational and research content is general information only;</li>
                                    <li>we do not warrant that website content is complete, current, error-free, or suitable for your intended use; and</li>
                                    <li>it is your responsibility to independently verify the suitability of any product for your lawful research purpose.</li>
                                </ul>
                                <p>Nothing on the website constitutes medical advice, therapeutic advice, clinical advice, veterinary advice, legal advice, or regulatory advice.</p>
                            </div>
                        </section>

                        {/* Section 6: Orders and acceptance */}
                        <section id="orders" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Orders and acceptance</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>When you place an order, you are making an offer to purchase products subject to these Terms.</p>
                                <p>No order is binding on us until we accept it. We may accept, reject, limit, or cancel any order at our discretion, including where:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>stock is unavailable;</li>
                                    <li>there is a pricing or listing error;</li>
                                    <li>payment is not received or cannot be verified;</li>
                                    <li>the order appears suspicious, fraudulent, or high-risk;</li>
                                    <li>the order appears inconsistent with research-only positioning;</li>
                                    <li>we suspect the products may be intended for human use, veterinary use, clinical use, resale, export, or any prohibited purpose; or</li>
                                    <li>we are unable to complete the order for legal, regulatory, compliance, or operational reasons.</li>
                                </ul>
                                <p>We may contact you for additional information before accepting or dispatching an order.</p>
                            </div>
                        </section>

                        {/* Section 7: Manual payment orders */}
                        <section id="manual" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Manual payment orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Where manual payment methods such as PayID or bank transfer are offered, payment must be received within the timeframe stated on the website or checkout.</p>
                                <p>If payment is not received within that timeframe:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>the order may be automatically cancelled;</li>
                                    <li>stock may be returned to inventory; and</li>
                                    <li>no contract for sale will arise unless and until payment is received and the order is accepted by us.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 8: Pricing, taxes, and billing */}
                        <section id="pricing" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Pricing, taxes, and billing</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Unless stated otherwise, prices displayed on the website are in Australian dollars.</p>
                                <p>You agree that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>prices, promotions, and product availability may change without notice;</li>
                                    <li>shipping charges, taxes, duties, levies, customs fees, and other charges may apply in addition to the listed product price;</li>
                                    <li>you are responsible for all applicable import duties, taxes, fees, and charges imposed by any customs or regulatory authority; and</li>
                                    <li>if a pricing, listing, or calculation error occurs, we may cancel or refuse the affected order and refund any amount paid.</li>
                                </ul>
                                <p>You must provide valid and accurate payment information. You authorise us and our payment providers to verify and process payments for orders placed through the website.</p>
                            </div>
                        </section>

                        {/* Section 9: Shipping, delivery, and risk */}
                        <section id="shipping" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Shipping, delivery, and risk</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Shipping and delivery are subject to our <span className="text-[#38bdf8] hover:underline cursor-pointer">Shipping Policy</span>.</p>
                                <p>By placing an order, you acknowledge and agree that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>shipping and delivery timeframes are estimates only and are not guaranteed;</li>
                                    <li>delays may occur due to customs, courier delays, stock constraints, holidays, payment verification, compliance reviews, or other matters outside our control;</li>
                                    <li>title to the goods passes to you when the goods are dispatched or otherwise as required by applicable law;</li>
                                    <li>risk of loss, delay, seizure, destruction, or damage during shipment passes in accordance with applicable law and the terms of our Shipping Policy; and</li>
                                    <li>you are responsible for ensuring that shipping details provided by you are correct and complete.</li>
                                </ul>
                                <p>If an order is returned to us as undeliverable due to incorrect address details, refusal, customs issues, or other matters attributable to you, we may require payment of additional shipping or handling fees before any reshipment.</p>
                            </div>
                        </section>

                        {/* Section 10: Customs, imports, and cross-border orders */}
                        <section id="customs" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Customs, imports, and cross-border orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You are solely responsible for ensuring that any order placed with us complies with all laws, regulations, permit requirements, import controls, customs rules, and other legal requirements that apply in your jurisdiction.</p>
                                <p>We are not responsible for:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>customs delays;</li>
                                    <li>customs inspections;</li>
                                    <li>seizures, holds, or destruction by customs or border authorities;</li>
                                    <li>refusal of entry;</li>
                                    <li>permits, approvals, or licences required by your jurisdiction;</li>
                                    <li>duties, taxes, or fees imposed by authorities; or</li>
                                    <li>any losses arising from non-compliance with local laws by you.</li>
                                </ul>
                                <p>Except where required by law, orders affected by customs or regulatory action are not eligible for refund, replacement, or compensation.</p>
                            </div>
                        </section>

                        {/* Section 11: Refunds, returns, and remedies */}
                        <section id="refunds" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Refunds, returns, and remedies</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Refunds, returns, and replacements are governed by our <span className="text-[#38bdf8] hover:underline cursor-pointer">Refund Policy</span> and by any rights you may have under the Australian Consumer Law or other non-excludable laws.</p>
                                <p>Subject to those laws:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>we do not accept change-of-mind returns;</li>
                                    <li>we do not accept returns of sensitive research compounds after dispatch because we cannot verify storage conditions, environmental exposure, handling, chain of custody, or integrity after the products leave our control;</li>
                                    <li>if a product arrives damaged in transit or you receive the wrong item, you must notify us within the timeframe stated in our Refund Policy and provide the evidence requested by us;</li>
                                    <li>where a refund or replacement is approved, we may require reasonable supporting information before processing it; and</li>
                                    <li>any approved refund will be made to the original payment method unless otherwise required by law.</li>
                                </ul>
                                <h3 className="text-[19px] text-[#214A9E] mt-8 mb-4 font-normal">Australian Consumer Law notice</h3>
                                <p>Nothing in these Terms excludes, restricts, or modifies any consumer guarantee, statutory right, or other right or remedy you may have under the Australian Consumer Law or any other applicable law that cannot lawfully be excluded, restricted, or modified.</p>
                                <p>If you are entitled to rights or remedies under the Australian Consumer Law, those rights apply despite anything else in these Terms.</p>
                                <p>For goods and services supplied to consumers in Australia, the following applies:</p>
                                <p>Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures with the service, you are entitled:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>to cancel your service contract with us; and</li>
                                    <li>to a refund for the unused portion, or to compensation for its reduced value.</li>
                                </ul>
                                <p>You are also entitled to choose a refund or replacement for major failures with goods.</p>
                                <p>If a failure with the goods or a service does not amount to a major failure, you are entitled to have the failure rectified in a reasonable time. If this is not done, you are entitled to a refund for the goods and to cancel the contract for the service and obtain a refund of any unused portion.</p>
                            </div>
                        </section>

                        {/* Section 12: Right to refuse or cancel orders */}
                        <section id="refuse" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Right to refuse or cancel orders</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We reserve the right to refuse, suspend, hold, or cancel any order at any time before or after payment where reasonably necessary to protect our business, comply with law, or enforce our research-only position.</p>
                                <p>This includes where we believe, acting reasonably, that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>the order may involve unlawful use;</li>
                                    <li>the products may be intended for human or veterinary administration;</li>
                                    <li>the products may be intended for clinical, therapeutic, cosmetic, or prohibited purposes; or</li>
                                    <li>the order may expose us to regulatory, legal, or reputational risk.</li>
                                </ul>
                                <p>Where we cancel an order after payment has been received, we will refund the amount paid, less any amount we are legally entitled to retain or any deduction permitted by law.</p>
                            </div>
                        </section>

                        {/* Section 13: Prohibited conduct */}
                        <section id="prohibited" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Prohibited conduct</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You must not use the website or Services:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>for any unlawful, fraudulent, deceptive, or malicious purpose;</li>
                                    <li>to infringe intellectual property or other rights;</li>
                                    <li>to harvest data, scrape content, crawl the website, or automate access without our written permission;</li>
                                    <li>to upload malicious code, attempt to interfere with the website, or bypass security features;</li>
                                    <li>to submit false, misleading, defamatory, abusive, or unlawful content;</li>
                                    <li>to purchase products for prohibited uses; or</li>
                                    <li>to resell, export, distribute, or repackage products without our prior written approval where such conduct would create compliance, safety, or legal risk.</li>
                                </ul>
                                <p>We may suspend or block access to the Services where we reasonably suspect prohibited conduct.</p>
                            </div>
                        </section>

                        {/* Section 14: Intellectual property */}
                        <section id="ip" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Intellectual property</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>All website content, including text, branding, product names, graphics, layout, logos, images, design elements, page structure, research content, downloadable material, and software-related content, is owned by us or licensed to us and is protected by applicable intellectual property laws.</p>
                                <p>You may access and use the website for your own lawful personal or internal research-related information purposes only. You must not, without our prior written consent, reproduce, republish, distribute, modify, reverse engineer, create derivative works from, commercially exploit, or otherwise use any website content except as permitted by law.</p>
                                <p>All rights not expressly granted are reserved.</p>
                            </div>
                        </section>

                        {/* Section 15: Reviews, submissions, and feedback */}
                        <section id="reviews" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Reviews, submissions, and feedback</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>If you submit feedback, reviews, suggestions, ideas, testimonials, comments, or other material to us, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free licence to use, reproduce, adapt, publish, display, edit, and distribute that material for our business purposes, subject to applicable law.</p>
                                <p>You warrant that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>you have the right to submit the material;</li>
                                    <li>the material is accurate to the best of your knowledge; and</li>
                                    <li>the material does not infringe third-party rights or contain unlawful content.</li>
                                </ul>
                                <p>We may remove or decline to publish submissions at our discretion.</p>
                            </div>
                        </section>

                        {/* Section 16: Third-party tools */}
                        <section id="third-party" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Third-party tools, services, and links</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>The website may contain links to third-party websites, apps, tools, analytics, payment services, communication channels, or embedded content. We do not control those third parties and are not responsible for their content, availability, acts, omissions, or policies.</p>
                                <p>Your use of any third-party service is at your own risk and may be subject to separate terms and privacy policies.</p>
                            </div>
                        </section>

                        {/* Section 17: Privacy */}
                        <section id="privacy" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Privacy</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>Your use of the Services is also governed by our <span className="text-[#38bdf8] hover:underline cursor-pointer">Privacy Policy</span>.</p>
                                <p>You acknowledge that:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>personal information submitted through the website may be processed by Shopify and other service providers to facilitate the Services; and</li>
                                    <li>we may collect, use, store, and disclose information in accordance with our Privacy Policy and applicable law.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 18: Disclaimer */}
                        <section id="disclaimer" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Disclaimer</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>To the maximum extent permitted by law, and subject to any non-excludable rights:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>the Services and website content are provided on an "as is" and "as available" basis;</li>
                                    <li>we do not warrant that the Services will be uninterrupted, secure, error-free, or free of viruses or harmful components;</li>
                                    <li>we do not warrant that the website, products, or content will meet your requirements or expectations;</li>
                                    <li>we do not warrant that product descriptions, educational pages, research pages, calculators, or technical information are complete, current, or suitable for any particular purpose; and</li>
                                    <li>all use of the products is at your own risk, subject to your non-excludable rights under applicable law.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 19: Limitation of liability */}
                        <section id="liability" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Limitation of liability</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>To the maximum extent permitted by law, and subject to any rights that cannot be excluded under the Australian Consumer Law or other applicable law, we are not liable for any indirect, incidental, special, punitive, or consequential loss, including:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>loss of profit,</li>
                                    <li>loss of revenue,</li>
                                    <li>loss of opportunity,</li>
                                    <li>loss of data,</li>
                                    <li>loss of business,</li>
                                    <li>reputational damage,</li>
                                    <li>customs seizure,</li>
                                    <li>regulatory action against you, or</li>
                                    <li>losses arising from misuse of products.</li>
                                </ul>
                                <p>To the maximum extent permitted by law, our total aggregate liability arising out of or in connection with any claim relating to the Services or products is limited to the greater of:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>the amount actually paid by you for the relevant order giving rise to the claim; or</li>
                                    <li>any minimum amount required by applicable law.</li>
                                </ul>
                                <p>Nothing in these Terms limits or excludes liability for any matter that cannot lawfully be limited or excluded.</p>
                            </div>
                        </section>

                        {/* Section 20: Indemnity */}
                        <section id="indemnity" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Indemnity</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You indemnify and hold us harmless from and against any loss, damage, cost, claim, liability, or expense (including reasonable legal costs) arising out of or in connection with:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>your breach of these Terms;</li>
                                    <li>your misuse of the Services or products;</li>
                                    <li>your breach of any law;</li>
                                    <li>your infringement of third-party rights;</li>
                                    <li>your importation, possession, handling, storage, transport, use, resale, export, or disposal of products; or</li>
                                    <li>any prohibited or unlawful use of products by you or anyone to whom you supply or make products available.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 21: Force majeure */}
                        <section id="force-majeure" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Force majeure</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We are not liable for any failure or delay in performing our obligations where that failure or delay results from events beyond our reasonable control, including natural disasters, public health events, war, cyber incidents, supplier disruption, courier delay, customs action, government action, labour shortage, utility failure, or stock shortages.</p>
                            </div>
                        </section>

                        {/* Section 22: Suspension and termination */}
                        <section id="suspension" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Suspension and termination</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We may suspend, restrict, or terminate your access to the Services at any time if:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>you breach these Terms;</li>
                                    <li>we reasonably suspect unlawful, unsafe, or prohibited conduct; or</li>
                                    <li>your conduct exposes us to legal, compliance, regulatory, safety, payment, or reputational risk.</li>
                                </ul>
                                <p>Termination does not affect any accrued rights, obligations, or remedies.</p>
                            </div>
                        </section>

                        {/* Section 23: Changes to products, services, and terms */}
                        <section id="changes" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Changes to products, services, and terms</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>We may:</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-slate-400">
                                    <li>change, withdraw, suspend, or discontinue products or Services at any time;</li>
                                    <li>update product information, pricing, policies, and website content; and</li>
                                    <li>amend these Terms from time to time.</li>
                                </ul>
                                <p>Updated Terms take effect when published on the website unless stated otherwise. Your continued use of the Services after publication constitutes acceptance of the updated Terms.</p>
                            </div>
                        </section>

                        {/* Section 24: Severability */}
                        <section id="severability" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Severability</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>If any provision of these Terms is held to be invalid, illegal, void, or unenforceable, that provision will be read down or severed to the extent necessary, and the remaining provisions will continue in full force and effect.</p>
                            </div>
                        </section>

                        {/* Section 25: Waiver */}
                        <section id="waiver" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Waiver</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>A failure or delay by us to exercise any right under these Terms does not operate as a waiver of that right.</p>
                            </div>
                        </section>

                        {/* Section 26: Assignment */}
                        <section id="assignment" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Assignment</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>You may not assign, transfer, sublicense, or otherwise deal with your rights or obligations under these Terms without our prior written consent.</p>
                                <p>We may assign, transfer, novate, or otherwise deal with our rights and obligations under these Terms without notice to you where permitted by law.</p>
                            </div>
                        </section>

                        {/* Section 27: Governing law and jurisdiction */}
                        <section id="governing-law" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">27. Governing law and jurisdiction</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>These Terms are governed by the laws of Victoria, Australia, and the laws of the Commonwealth of Australia applicable there.</p>
                                <p>You submit to the non-exclusive jurisdiction of the courts of Victoria, Australia and any courts competent to hear appeals from those courts.</p>
                            </div>
                        </section>

                        {/* Section 28: Entire agreement */}
                        <section id="entire-agreement" className="scroll-mt-32">
                            <h2 className="text-[22px] font-bold text-[#214A9E] mb-6">Entire agreement</h2>
                            <div className="text-[14.5px] leading-[1.8] text-slate-600 space-y-4">
                                <p>These Terms, together with our posted policies and any other terms expressly incorporated by reference, form the entire agreement between you and us relating to the Services and supersede any prior understandings relating to the same subject matter.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
