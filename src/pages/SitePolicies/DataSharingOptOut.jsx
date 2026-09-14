import React from 'react';
import { Helmet } from 'react-helmet-async';

const DataSharingOptOut = () => {
    return (
        <div className="bg-white font-sans text-slate-800">
            <Helmet>
                <title>Your Privacy Choices &amp; Data Sharing Opt-Out | Solatide Biosciences</title>
                <meta
                    name="description"
                    content="Exercise your privacy choices and manage your data sharing preferences with Solatide Biosciences. Opt out of targeted advertising, cookies, and data sharing."
                />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/data-sharing-opt-out-1" />
            </Helmet>

            {/* Header Banner */}
            <section className="w-full py-8 border-b border-slate-100 mb-10 bg-[#fafcff]">
                <div className="main-container mx-auto px-4 max-w-[960px]">
                    <h1 className="text-[36px] text-center sm:text-[44px] md:text-[48px] font-bold text-[#214A9E] leading-tight mb-6">
                        Your Privacy Choices
                    </h1>
                    <div className="flex flex-col gap-4 text-left">
                        <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed">
                            As described in our Privacy Policy, we collect personal information from your interactions with us and our website, including through cookies and similar technologies. We may also share this personal information with third parties, including advertising partners. We do this in order to show you ads on other websites that are more relevant to your interests and for other reasons outlined in our privacy policy.
                        </p>
                        <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed">
                            Sharing of personal information for targeted advertising based on your interaction on different websites may be considered "sales", "sharing", or "targeted advertising" under certain U.S. state privacy laws. Depending on where you live, you may have the right to opt out of these activities. If you would like to exercise this opt-out right, please follow the instructions below.
                        </p>
                        <p className="text-[14.5px] sm:text-[15.5px] text-slate-600 leading-relaxed">
                            If you visit our website with the Global Privacy Control opt-out preference signal enabled, depending on where you are, we will treat this as a request to opt-out of activity that may be considered a “sale” or “sharing” of personal information or other uses that may be considered targeted advertising for the device and browser you used to visit our website.
                        </p>
                        <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-700 leading-relaxed pt-2">
                            To opt out of the "sale" or "sharing" of your personal information collected using cookies and other device-based identifiers as described above, you must be browsing from one of the applicable US states referred to above.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DataSharingOptOut;
