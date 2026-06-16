import React from 'react'
import { Link } from 'react-router-dom'

const AboutUs = () => {
    return (
        <div className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
                        About Us
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Solatide Biosciences is an Australian-operated research supplier committed to scientific integrity, quality, and complete transparency.
                    </p>
                </div>


                <div className="border-t border-slate-100 pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h4 className="text-base font-bold text-slate-900 mb-3">Independent Verification</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                We do not rely on manufacturer validation sheets alone. Every lot is verified by independent, ISO-accredited chemical testing laboratories.
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h4 className="text-base font-bold text-slate-900 mb-3">Sterile Lyophilization</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Our compounds are freeze-dried inside sterile nitrogen-purged environments to maintain maximum shelf life and prevent moisture degradation.
                            </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <h4 className="text-base font-bold text-slate-900 mb-3">Dedicated Logistics</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Specialized shock-absorbing and thermal-insulated wrapping maintains optimal transport environments from dispatch to delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs