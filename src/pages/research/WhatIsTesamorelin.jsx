import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const WhatIsTesamorelin = () => {
    return (
        <div className="bg-white font-sans min-h-screen">
            <Helmet>
                <title>What Is Tesamorelin? | Solatide Biosciences</title>
                <meta
                    name="description"
                    content="Tesamorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH) used in laboratory research to investigate growth hormone secretion and metabolic regulation."
                />
                <link rel="canonical" href="https://solatidebiosciences.com.au/pages/what-is-tesamorelin" />
            </Helmet>

            <div className="shopify-page-container">
                <div className="wi-wrap">
                    <div className="wi-callout">
                        <p>
                            <strong>Research Use Only:</strong> Tesamorelin is intended strictly for in-vitro laboratory research purposes only. Not for human consumption, medical treatment, or veterinary use.{' '}
                            <Link to="/pages/research-use-disclaimer">Read our full disclaimer</Link>.
                        </p>
                    </div>

                    <span className="wi-tag">GHRH Analogue - Growth Hormone Research</span>
                    <h1>What Is Tesamorelin?</h1>
                    <p style={{ fontSize: '1.05em', lineHeight: 1.75, color: '#444' }}>
                        Tesamorelin is a synthetic analogue of growth hormone-releasing hormone (GHRH) used in laboratory research to investigate growth hormone secretion, hypothalamic-pituitary signalling and metabolic regulation in experimental models.
                    </p>

                    <div className="wi-cta-row">
                        <Link to="/products/tesamorelin-10mg" className="wi-btn">View Product</Link>
                        <Link to="/pages/research-compound-database" className="wi-btn-outline">Compound Index</Link>
                    </div>

                    <h2>Mechanism of Action</h2>
                    <p>
                        Tesamorelin binds to GHRH receptors on pituitary somatotroph cells, stimulating the synthesis and pulsatile release of growth hormone (GH). As a stabilised GHRH analogue, it retains the full 44-amino-acid sequence of endogenous GHRH with a trans-3-hexenoic acid modification that confers resistance to dipeptidyl peptidase IV (DPP-IV) degradation, extending its activity in experimental settings.
                    </p>

                    <h3>Growth Hormone Axis</h3>
                    <p>
                        In laboratory models, Tesamorelin-induced GH release activates downstream IGF-1 production in the liver, enabling researchers to study the GH/IGF-1 axis and its role in anabolic signalling, lipid metabolism and body composition regulation.
                    </p>

                    <h2>Research Applications</h2>
                    <h3>Visceral Adipose Tissue Research</h3>
                    <p>
                        Tesamorelin is studied in the context of visceral adipose tissue (VAT) reduction in laboratory models. Researchers use it to investigate the relationship between GH secretion, lipolysis and central adiposity in controlled experimental settings.
                    </p>

                    <h3>Metabolic Signalling</h3>
                    <p>
                        Laboratory investigations employ Tesamorelin to study glucose homeostasis, insulin sensitivity and lipid processing as downstream effects of GH axis activation. It is relevant to research into metabolic syndrome and related pathway dysregulation.
                    </p>

                    <h3>Hypothalamic-Pituitary Research</h3>
                    <p>
                        As a GHRH receptor agonist, Tesamorelin is a useful tool compound for studying hypothalamic-pituitary axis function, GH pulse dynamics and neuroendocrine regulation in vitro.
                    </p>

                    <h2>Structural Characteristics</h2>
                    <p>
                        Tesamorelin consists of the full 44-amino-acid sequence of human GHRH(1-44) conjugated to a trans-3-hexenoic acid group at the N-terminus. This modification stabilises the peptide against enzymatic degradation while preserving receptor binding affinity and biological activity in experimental models.
                    </p>

                    <h2>Storage &amp; Handling</h2>
                    <p>
                        Store lyophilised Tesamorelin at -20°C or -80°C, protected from light and moisture. Reconstitute with bacteriostatic water prior to use. Use the{' '}
                        <Link to="/pages/concentration-calculator">Concentration Calculator</Link> to determine the correct volume for your target concentration. Follow institutional laboratory protocols for handling and disposal.
                    </p>

                    <h2>Quality &amp; Documentation</h2>
                    <p>
                        Solatide Biosciences Tesamorelin is independently third-party tested to &gt;=99% purity, verified by HPLC and mass spectrometry. A Certificate of Analysis is available on the product page.
                    </p>

                    <div className="wi-cta-row">
                        <Link to="/products/tesamorelin-10mg" className="wi-btn">View Product &amp; COA</Link>
                        <Link to="/pages/coa-lab-testing" className="wi-btn-outline">COA &amp; Lab Testing</Link>
                    </div>

                    <h2>Related Compounds</h2>
                    <div className="wi-utility">
                        <Link to="/pages/what-is-cjc-1295">CJC-1295</Link>
                        <Link to="/pages/what-is-ipamorelin">Ipamorelin</Link>
                        <Link to="/pages/research-compound-database">Compound Index</Link>
                        <Link to="/pages/research-library">Resource Hub</Link>
                    </div>

                    <hr className="wi-divider" />
                    <div className="wi-callout" style={{ marginTop: '32px', marginBottom: 0 }}>
                        <p>
                            <strong>Research Use Only:</strong> All compounds are manufactured for in-vitro laboratory research and are not intended for human consumption, medical use, or veterinary applications.{' '}
                            <Link to="/pages/research-use-disclaimer">Full disclaimer</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatIsTesamorelin;
