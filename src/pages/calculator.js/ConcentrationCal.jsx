import React, { useState } from 'react'

const ConcentrationCal = () => {
    const [s1Mass, setS1Mass] = useState('5')
    const [s1Diluent, setS1Diluent] = useState('2')
    const [s2Target, setS2Target] = useState('0.25')

    const resultingConc =
        s1Mass && s1Diluent && parseFloat(s1Diluent) !== 0
            ? parseFloat(s1Mass) / parseFloat(s1Diluent)
            : null

    const requiredVol =
        resultingConc && s2Target && resultingConc !== 0
            ? parseFloat(s2Target) / resultingConc
            : null

    return (
        <div className="w-full bg-white min-h-screen pb-20 font-sans">
            <section className="w-full pt-16 pb-8 text-center">
                <div className="main-container mx-auto">
                    <h1 className="text-[32px] md:text-[38px] font-bold text-[#214A9E] mb-8">
                        Concentration Calculator
                    </h1>

                    <div className="bg-[#FEF9C3] border-l-[3px] border-[#EAB308] p-5 rounded-[4px] text-left">
                        <h4 className="text-[14px] font-bold text-[#854D0E] flex items-center gap-2 mb-2">
                            <span>⚠️</span> Laboratory Mathematical Reference Tool
                        </h4>
                        <p className="text-[13px] text-[#854D0E] leading-relaxed">
                            This calculator is provided for educational and mathematical reference only for laboratory applications. It does not provide medical advice, treatment recommendations, or administration instructions. All values must be independently verified. Products sold on this website are for research use only.
                        </p>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white">
                <div className="main-container  mx-auto flex flex-col gap-10">

                    {/* How to Use This Calculator */}
                    <div>
                        <h2 className="text-[18px] font-bold text-[#214A9E] mb-5">
                            How to Use This Calculator
                        </h2>
                        <div className="space-y-3">
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-4 rounded-[4px]">
                                <p className="text-[13.5px] text-slate-700">
                                    <strong className="text-[#150F3A]">Step 1:</strong> Enter the mass of compound shown on the vial label (e.g., 5 mg or 10 mg).
                                </p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-4 rounded-[4px]">
                                <p className="text-[13.5px] text-slate-700">
                                    <strong className="text-[#150F3A]">Step 2:</strong> Enter the volume of diluent you added to the vial (e.g., 2 mL).
                                </p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-4 rounded-[4px]">
                                <p className="text-[13.5px] text-slate-700">
                                    <strong className="text-[#150F3A]">Step 3:</strong> Enter the target mass you wish to achieve for your laboratory work.
                                </p>
                            </div>
                            <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-4 rounded-[4px]">
                                <p className="text-[13.5px] text-slate-700">
                                    <strong className="text-[#150F3A]">Step 4:</strong> The calculator displays the required volume in millilitres (mL).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Example Calculation */}
                    <div>
                        <h2 className="text-[18px] font-bold text-[#214A9E] mb-5">
                            Example Calculation
                        </h2>
                        <div className="bg-[#f8fafc] border-l-[3px] border-[#3390ec] p-6 rounded-[4px] space-y-4">
                            <p className="text-[13.5px] text-slate-700">
                                <strong className="text-[#150F3A]">Scenario:</strong> You have a vial containing <strong className="text-[#150F3A]">10 mg</strong> of compound and you add <strong className="text-[#150F3A]">2 mL</strong> of bacteriostatic water. You want to transfer a mass of <strong className="text-[#150F3A]">1 mg</strong>.
                            </p>
                            <p className="text-[13.5px] text-slate-700">
                                <strong className="text-[#150F3A]">Final Concentration:</strong> This yields a working solution of 5 mg/mL (10 mg ÷ 2 mL).
                            </p>
                            <p className="text-[13.5px] text-slate-700">
                                <strong className="text-[#150F3A]">Result:</strong> The calculator shows the required volume is <strong className="text-[#150F3A]">0.20 mL</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Critical Warning */}
                    <div className="bg-[#FEF2F2] border-l-[3px] border-[#DC2626] p-5 rounded-[4px]">
                        <p className="text-[13.5px] text-[#991B1B] leading-relaxed">
                            <strong className="text-[#991B1B]">CRITICAL WARNING:</strong> Always verify the vial label, units, and total liquid volume before relying on any calculation. This tool is a mathematical reference only and must not replace strict laboratory protocols or independent scientific verification. <strong className="text-[#991B1B]">Products sold on this website are strictly for research purposes and are not for human consumption.</strong>
                        </p>
                    </div>

                    {/* The Calculator UI */}
                    <div className="border border-slate-200 w-full max-w-[768px] mx-auto rounded-lg overflow-hidden mt-4 shadow-sm">
                        
                        {/* Legend */}
                        <div className="bg-[#F8FAFC] p-6 sm:px-10 border-b border-slate-200">
                            <h3 className="text-[16px] font-bold text-[#150F3A] mb-4">
                                Laboratory Volume Measurements
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:gap-20 gap-4 mb-5 text-[13.5px] text-slate-700 font-bold">
                                <p>mg = milligrams (mass)</p>
                                <p>mL = millilitres (volume)</p>
                            </div>
                            <p className="text-[13.5px] text-[#150F3A] font-bold">
                                Use calibrated micropipettes or volumetric syringes for accurate liquid handling
                            </p>
                        </div>

                        {/* Step 1 */}
                        <div className="p-6 sm:px-10 border-b border-slate-200 bg-white">
                            <h3 className="text-[18px] font-bold text-[#150F3A] mb-6">
                                Step 1: Solution Preparation
                            </h3>

                            <div className="mb-6">
                                <label className="text-[13px] font-bold text-[#150F3A] block mb-2">
                                    Mass of compound in vial (mg)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={s1Mass}
                                    onChange={(e) => setS1Mass(e.target.value)}
                                    className="w-full border border-slate-300 rounded-[4px] px-4 py-2.5 text-[14px] text-slate-800 focus:outline-none focus:border-[#3390ec] transition-colors mb-2"
                                />
                                <p className="text-[12px] text-slate-500">This is the mass written on your vial label (e.g., 5 mg or 10 mg)</p>
                            </div>

                            <div className="mb-6">
                                <label className="text-[13px] font-bold text-[#150F3A] block mb-2">
                                    Diluent volume added (mL)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={s1Diluent}
                                    onChange={(e) => setS1Diluent(e.target.value)}
                                    className="w-full border border-slate-300 rounded-[4px] px-4 py-2.5 text-[14px] text-slate-800 focus:outline-none focus:border-[#3390ec] transition-colors mb-2"
                                />
                                <p className="text-[12px] text-slate-500">Volume of bacteriostatic water or laboratory buffer added</p>
                            </div>

                            {resultingConc !== null && (
                                <div className="bg-[#F0F5FB] border-l-[3px] border-[#3390ec] rounded-[4px] p-5 mt-2">
                                    <p className="text-[12px] font-bold text-[#1a4494] mb-1">Resulting Concentration:</p>
                                    <p className="text-[20px] font-bold text-[#150F3A]">{resultingConc.toFixed(2)} mg per 1 mL</p>
                                </div>
                            )}
                        </div>

                        {/* Step 2 */}
                        <div className="p-6 sm:px-10 bg-white">
                            <h3 className="text-[18px] font-bold text-[#150F3A] mb-6">
                                Step 2: Target Volume Calculation
                            </h3>

                            <div className="mb-6">
                                <label className="text-[13px] font-bold text-[#150F3A] block mb-2">
                                    Target mass (mg)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={s2Target}
                                    onChange={(e) => setS2Target(e.target.value)}
                                    className="w-full border border-slate-300 rounded-[4px] px-4 py-2.5 text-[14px] text-slate-800 focus:outline-none focus:border-[#3390ec] transition-colors mb-2"
                                />
                                <p className="text-[12px] text-slate-500">The exact mass you wish to transfer for your experiment</p>
                            </div>

                            {requiredVol !== null && (
                                <div className="bg-[#F0FDF4] border-l-[3px] border-[#16A34A] rounded-[4px] p-5 mt-2">
                                    <p className="text-[12px] font-bold text-[#166534] mb-2">Required volume:</p>
                                    <div className="bg-white border border-[#16A34A] rounded-[4px] inline-block px-6 py-3">
                                        <p className="text-[24px] font-bold text-[#150F3A]">{requiredVol.toFixed(2)} mL</p>
                                    </div>
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