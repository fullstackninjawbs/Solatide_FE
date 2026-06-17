import React, { useState } from 'react'

const steps = [
    { number: '01', text: 'Enter the mass of compound shown on the vial label (e.g., 5 mg or 10 mg).' },
    { number: '02', text: 'Enter the volume of diluent you added to the vial (e.g., 2 mL).' },
    { number: '03', text: 'Enter the target mass you wish to achieve for your laboratory work.' },
    { number: '04', text: 'The calculator displays the required volume in millilitres (mL).' },
]

const ConcentrationCal = () => {
    const [s1Mass, setS1Mass] = useState('5')
    const [s1Diluent, setS1Diluent] = useState('5')
    const [s2Target, setS2Target] = useState('5')
    const [s2Diluent, setS2Diluent] = useState('5')

    const resultingConc =
        s1Mass && s1Diluent && parseFloat(s1Diluent) !== 0
            ? parseFloat(s1Mass) / parseFloat(s1Diluent)
            : null

    const requiredVol =
        resultingConc && s2Target && resultingConc !== 0
            ? parseFloat(s2Target) / resultingConc
            : null

    return (
        <div className="w-full bg-white min-h-screen">

            <section className="w-full bg-[#F0F5FB] py-12 text-center">
                <div className="main-container">
                    <h1
                        className="text-[48px] font-semibold font-weight-600 md:text-[46px] text-[#214A9E] leading-tight mb-4"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Concentration Calculator
                    </h1>
                    <p className="text-[16px] font-regular font-weight-400 text-[#6A6A6A] leading-[1.75] w-full mx-auto">
                        This calculator is provided for educational and mathematical reference only for laboratory applications. It does not provide medical advice, treatment recommendations, or administration instructions. All values must be independently verified. Products sold on this website are for research use only.
                    </p>
                </div>
            </section>
            <section className="w-full bg-white py-12">
                <div className="main-container mx-auto flex flex-col gap-8">


                    <div className="border-l-4 border-[#F59E0B] bg-[#FFFBEB] px-5 py-4">
                        <p className="text-[13px] text-[#92400E] leading-[1.7]">
                            <span className="font-bold text-[#D97706]">Disclaimer: </span>
                            These calculators are provided as a convenience tool for laboratory researchers. Results are for research planning purposes only and should always be verified against your own analytical data. AnalytiCore accepts no liability for errors arising from incorrect input values.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="text-[14px] font-semibold font-weight-600 uppercase tracking-[0.14em] text-[#00E5FF] mb-2 block">
                                GETTING STARTED
                            </span>
                            <h2
                                className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-3"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                How To Use These Calculators
                            </h2>
                            <p className="text-[14px] text-[#6A6A6A] font-weight-400 font-regular leading-[1.75]">
                                A Certificate of Analysis (COA) is an official document issued by an accredited analytical laboratory that confirms a compound's identity, purity, and compliance with defined specifications. Every batch of research material we supply is accompanied by a fully traceable COA, providing researchers with the confidence needed for reproducible, reliable science.
                            </p>
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {steps.map((step, index) => (
                                <div
                                    key={step.number}
                                    className={`flex items-center gap-4 px-5 py-4 bg-white ${index < steps.length - 1 ? 'border-b border-slate-200' : ''}`}
                                >
                                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#1D1D1F] flex items-center justify-center text-white text-[12px] font-bold leading-none">
                                        {step.number}
                                    </span>
                                    <p className="text-[14px] font-weight-400 font-regular text-[#6A6A6A] leading-[1.6]">{step.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border border-slate-200 rounded-lg px-5 py-5 bg-white flex flex-col gap-2">
                            <p className="text-[13.5px] text-[#4B5563] leading-[1.7]">
                                <span className="font-bold text-[#1D1D1F]">Scenario : </span>
                                You have a vial containing 10 mg of compound and you add 2 mL of bacteriostatic water. You want to transfer a mass of 1 mg.
                            </p>
                            <p className="text-[13.5px] text-[#4B5563] leading-[1.7]">
                                <span className="font-bold text-[#1D1D1F]">Final Concentration: </span>
                                This yields a working solution of 5 mg/mL (10 mg ÷ 2 mL).
                            </p>
                            <p className="text-[13.5px] text-[#4B5563] leading-[1.7]">
                                <span className="font-bold text-[#1D1D1F]">Result: </span>
                                The calculator shows the required volume is 0.20 mL.
                            </p>
                        </div>
                    </div>

                    <div className="border-l-4 border-red-400 bg-[#FEF2F2] px-5 py-4">
                        <p className="text-[13px] text-[#991B1B] leading-[1.7]">
                            <span className="font-bold">CRITICAL WARNING: </span>
                            Always verify the vial label, units, and total liquid volume before relying on any calculation.{' '}
                            <span className="text-[#DC2626]">
                                This tool is a mathematical reference only and must not replace strict laboratory protocols or independent scientific verification.
                            </span>{' '}
                            <span className="font-bold">
                                Products sold on this website are strictly for research purposes and are not for human consumption.
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <span className="text-[14px] font-semibold font-weight-600 tracking-[0.14em] text-[#00E5FF] mb-2 block">
                                Measurements
                            </span>
                            <h2
                                className="text-[24px] font-semibold font-weight-600 text-[#214A9E] leading-snug mb-3"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                Laboratory Volume Measurements
                            </h2>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[13px] font-medium font-weight-500 text-[#6A6A6A]">mg = milligrams (mass)</p>
                                <p className="text-[13px] font-medium font-weight-500 text-[#6A6A6A]">mL = millilitres (volume)</p>
                            </div>
                        </div>


                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-200">
                                <h3 className="text-[16px] font-semibold text-[#214A9E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Step 1: Solution Preparation
                                </h3>
                            </div>

                            <div className="px-5 pt-4 pb-1 border-b border-slate-100">
                                <label className="text-[13px] font-medium font-weight-500 text-[#1E1E1E] block mb-2">
                                    Mass of compound in vial (mg)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={s1Mass}
                                    onChange={(e) => setS1Mass(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#214A9E]/20 focus:border-[#214A9E] transition-all mb-1.5"
                                />
                                <p className="text-[13px] font-regular font-weight-400 text-[#6A6A6A] pb-3">This is the mass written on your vial label (e.g., 5 mg or 10 mg)</p>
                            </div>

                            <div className="px-5 pt-4 pb-1">
                                <label className="text-[13px] font-medium font-weight-500 text-[#1E1E1E] block mb-2">
                                    Diluent volume added (mL)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={s1Diluent}
                                    onChange={(e) => setS1Diluent(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#214A9E]/20 focus:border-[#214A9E] transition-all mb-1.5"
                                />
                                <p className="text-[13px] font-regular font-weight-400 text-[#6A6A6A] pb-3">Volume of bacteriostatic water or laboratory buffer added</p>
                            </div>

                            {resultingConc !== null && (
                                <div className="mx-4 mb-4 bg-[#EBF3FF] rounded-lg px-5 py-3">
                                    <p className="text-[14px] font-medium font-weight-500 text-[#214A9E] mb-0.5">Resulting Concentration:</p>
                                    <p className="text-[14px] font-regular font-weight-400 text-[#214A9E]">{resultingConc.toFixed(2)} mg per 1 mL</p>
                                </div>
                            )}
                        </div>

                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-200">
                                <h3 className="text-[24px] font-weight-500 font-medium text-[#214A9E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Step 2: Target Volume Calculation
                                </h3>
                            </div>

                            <div className="px-5 pt-4 pb-1 border-b border-slate-100">
                                <label className="text-[13px] font-medium font-weight-500 text-[#1E1E1E] block mb-2">
                                    Target mass (mg)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={s2Target}
                                    onChange={(e) => setS2Target(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#214A9E]/20 focus:border-[#214A9E] transition-all mb-1.5"
                                />
                                <p className="text-[13px] font-regular font-weight-400 text-[#6A6A6A] pb-3">The exact mass you wish to transfer for your experiment</p>
                            </div>

                            <div className="px-5 pt-4 pb-1">
                                <label className="text-[13px] font-medium font-weight-500 text-[#1E1E1E] block mb-2">
                                    Diluent volume added (mL)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={s2Diluent}
                                    onChange={(e) => setS2Diluent(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#214A9E]/20 focus:border-[#214A9E] transition-all mb-1.5"
                                />
                                <p className="text-[13px] font-regular font-weight-400 text-[#6A6A6A] pb-3">Volume of bacteriostatic water or laboratory buffer added</p>
                            </div>
                            {requiredVol !== null && (
                                <div className="mx-4 mb-4 bg-[#F0FDF4] border border-green-200 rounded-lg px-5 py-3">
                                    <p className="text-[14px] font-medium font-weight-500 text-[#219E25] mb-0.5">Required volume:</p>
                                    <p className="text-[14px] font-regular font-weight-400 text-[#219E25]">{requiredVol.toFixed(2)} mL</p>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </section>
        </div>
    )
}

export default ConcentrationCal