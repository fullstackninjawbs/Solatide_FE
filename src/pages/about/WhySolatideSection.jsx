import React from 'react'

const WhySolatideSection = () => {
    const cards = [
        {
            title: 'Independent Third-Party Documentation',
            content: 'Selected products or batches may be supported by independent third-party laboratory documentation. Available reports may include testing from independent laboratories such as Janoshik, Chromate, and Freedom Diagnostics, depending on the product and batch. Documentation and testing scope vary by product and batch.'
        },
        {
            title: 'Global Supply',
            content: 'We supply research compounds globally, with worldwide shipping and responsive customer support.'
        },
        {
            title: 'Research-Only Compliance',
            content: 'Where third-party analytical reports are published, key analytical results including purity, product identity, and date of analysis are displayed. Certain details may be redacted to protect supplier confidentiality and to prevent misuse of proprietary sourcing information by third parties.'
        },
        {
            title: 'Research-Only Compliance',
            content: 'We maintain strict research-use positioning with zero therapeutic, medical, or human-use claims. Our commitment to compliance means clear educational content, analytical data only, and transparent positioning on all materials.'
        }
    ]

    return (
        <section className="w-full py-16 bg-white border-t border-slate-100">
            <div className="main-container">
                <div className="text-center mb-12">
                    <h2 
                        className="text-[28px] md:text-[34px] font-bold text-[#214A9E] font-anek leading-tight"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Why Solatide Biosciences
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1440px] mx-auto">
                    {cards.map((card, idx) => (
                        <div 
                            key={idx} 
                            className="p-6 md:p-8 rounded-[16px] bg-white border border-slate-100 hover:border-[#00ADEE]/20 hover:shadow-sm transition-all duration-300 flex flex-col gap-3.5 text-left"
                            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                        >
                            <h3 className="text-[17px] md:text-[18px] font-bold text-[#1D1D1F]">
                                {card.title}
                            </h3>
                            <p className="text-[14px] md:text-[14.5px] text-[#6A6A6A] leading-[1.65] font-normal">
                                {card.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhySolatideSection
