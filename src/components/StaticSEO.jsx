import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const seoData = {
  "/": {
    title: "Solatide Biosciences | Research Grade Peptides | COA Verified",
    description: "Solatide Biosciences is a laboratory supply company providing analytical reference standards and chemical compounds for in-vitro research and laboratory analysis. All compounds are independently third-party tested and verified for purity. Not for human or animal consumption, therapeutic, diagnostic, or prophylactic use"
  },
  "/collections/dermal-pigmentation-research": {
    title: "Dermal & Pigmentation Research Peptides MT2 GHK-Cu Australia – Solatide Biosciences",
    description: "Solatide Biosciences dermal and pigmentation research peptides, including MT2 and GHK-Cu. Melanocortin receptor and copper peptide compounds with COA."
  },
  "/pages/affiliate-program": {
    title: "Affiliate Program | Earn with Solatide Biosciences",
    description: "Join the Solatide Biosciences Affiliate Program and earn commissions by promoting trusted research compounds and laboratory products."
  },
  "/pages/research-peptides-guide": {
    title: "Research Peptide Guide | Solatide Biosciences",
    description: "A plain-language guide to research peptides — covering common categories, laboratory use, handling, quality documentation and research-use terminology. For in-vitro research use only."
  },
  "/collections/all": {
    title: "Research Grade Peptides | Solatide Biosciences",
    description: "Browse research peptides, analytical compounds and laboratory-use materials with batch documentation, COAs and testing information where available."
  },
  "/collections/research-solutions": {
    title: "Research Solutions | Laboratory Support Materials | Solatide – Solatide Biosciences",
    description: "Laboratory support materials and sterile solvents for peptide handling, preparation, and controlled in-vitro research workflows. For laboratory use only."
  },
  "/pages/research-library": {
    title: "Research Resource Hub | Solatide Biosciences",
    description: "A central directory of research resources from Solatide Biosciences — including the Peptide Guide, Compound Index, COA library, concentration calculator and FAQ."
  },
  "/pages/research-compound-database": {
    title: "Compound Index | Solatide Biosciences Research Compounds",
    description: "Browse Solatide's research compound index by name, category and receptor pathway. Each entry links to product pages, batch documentation and available COA information. For in-vitro research use only."
  },
  "/pages/faq": {
    title: "FAQs - Research Peptides | Solatide Biosciences",
    description: "Find answers about dispatch, tracking, documentation, support, restocks, and research-use policies at Solatide Biosciences."
  },
  "/pages/contact-us": {
    title: "Contact Solatide Biosciences | Peptide Enquiries Australia",
    description: "Contact Solatide Biosciences for order support, shipping updates, documentation requests, and general enquiries. Support & dispatch: Melbourne, VIC 3000."
  },
  "/pages/refund-policy": {
    title: "Refund Policy | Solatide Biosciences Australia",
    description: "Read the Solatide Biosciences refund policy covering damaged orders, refunds, returns, cancellations, customs issues, and support options."
  },
  "/pages/terms-of-services": {
    title: "Terms of Service | Solatide Biosciences Australia",
    description: "Review Solatide Biosciences' Terms of Service covering orders, shipping, refunds, research-use products, liability, and user obligations."
  },
  "/pages/privacy-policy": {
    title: "Privacy Policy | Solatide Biosciences Research Australia",
    description: "Read the Solatide Biosciences Privacy Policy to learn how we collect, use, store, protect, and manage your personal information and data online."
  },
  "/pages/shipping-policy": {
    title: "Shipping Policy | Solatide Biosciences Australia",
    description: "Read the Solatide Biosciences Shipping Policy covering order processing, dispatch times, delivery estimates, tracking, customs, and support."
  },
  "/collections/tissue-cellular-research-peptides": {
    title: "Tissue & Cellular Research Peptides | BPC-157 TB-500 AU – Solatide Biosciences",
    description: "Browse tissue and cellular research peptides including BPC-157, TB-500, and combined-pathway compounds for in-vitro laboratory research. COA verified."
  },
  "/pages/concentration-calculator": {
    title: "Concentration Calculator | Solatide Biosciences",
    description: "Concentration calculator for math conversions and dilution calculations. Educational reference tool for research use only."
  },
  "/pages/coa-lab-testing": {
    title: "Lab Testing & Analytical Verification | Solatide Biosciences",
    description: "Learn how Solatide Biosciences verifies research compound purity and identity through independent third-party testing, including HPLC-UV and LC-MS analysis."
  },
  "/pages/about": {
    title: "About Solatide Biosciences | Quality Research Peptides",
    description: "Learn about Solatide Biosciences, an Australian-operated research supplier focused on third-party verification, documentation, and dependable support."
  },
  "/pages/coa": {
    title: "Certificates of Analysis | Solatide Biosciences",
    description: "Access batch-specific certificates of analysis for Solatide Biosciences research peptides. Third-party analytical documentation by product and batch."
  },
  "/collections/glp-1-metabolic-peptides": {
    title: "GLP-1 & Metabolic Research Peptides Australia | Solatide – Solatide Biosciences",
    description: "Research-grade GLP-1 receptor agonists, dual agonists, triple agonists, and metabolic research compounds. COA-verified. For in-vitro laboratory use only."
  },
  "/pages/data-sharing-opt-out": {
    title: "Your Privacy Choices | Solatide Biosciences",
    description: "Manage your privacy choices and data sharing preferences for Solatide Biosciences. Control how your information is used."
  },
  "/pages/bpc-157-vs-tb-500": {
    title: "BPC-157 vs TB-500 Comparison | Solatide Biosciences",
    description: "Compare BPC-157 and TB-500 in laboratory peptide research, including differences in pathway focus, tissue-response models, and migration-related investigation."
  },
  "/collections/bundles": {
    title: "Research Peptide Bundles | Solatide Biosciences",
    description: "Research peptide bundles with bacteriostatic water for laboratory reconstitution. COA-verified, ≥99% purity. For in-vitro laboratory use only."
  },
  "/pages/what-is-retatrutide": {
    title: "What Is Retatrutide? The Triple Agonist Peptide Explained | Solatide Biosciences",
    description: "Retatrutide is a triple-agonist peptide that targets GLP-1, GIP and glucagon receptors simultaneously. Learn what makes it different from Semaglutide and Tirzepatide in this research overview."
  },
  "/pages/what-is-cjc-1295": {
    title: "What Is CJC-1295? | Solatide Biosciences Research",
    description: "A research-use overview of CJC-1295 No DAC — a GHRH analogue studied for growth hormone pulse amplification, GH/IGF-1 axis research and pituitary somatotroph signalling in laboratory models."
  },
  "/pages/semaglutide-research-overview": {
    title: "Semaglutide Research Overview | Solatide Biosciences",
    description: "A laboratory-focused overview of semaglutide, including GLP-1 receptor selectivity, incretin pathway research, and comparative metabolic peptide context."
  },
  "/blogs/research-insights/nnmt-inhibition-5-amino-1mq": {
    title: "NNMT Inhibition & 5-Amino-1MQ | Research Article by Solatide – Solatide Biosciences",
    description: "A scientific overview of NNMT inhibition, 5-Amino-1MQ in cellular energy and NAD-related pathway research, and its use as a selective lab research tool."
  },
  "/blogs/research-insights/retatrutide-vs-semaglutide-research": {
    title: "Retatrutide vs Semaglutide Research Comparison | Solatide Biosciences",
    description: "A comparative overview of retatrutide and semaglutide in laboratory research, including receptor selectivity, pathway differences, and experimental context."
  },
  "/pages/what-is-nad-plus": {
    title: "What Is NAD+? | Solatide Biosciences Research",
    description: "A research-use overview of NAD+ (nicotinamide adenine dinucleotide) — a coenzyme studied for cellular energy metabolism, mitochondrial function and sirtuin activation in laboratory models. For in-vitro research use only."
  },
  "/pages/what-is-tb500": {
    title: "What Is TB-500? | Solatide Biosciences",
    description: "Learn what TB-500 is in the context of laboratory peptide research, including cellular migration, actin-associated processes, and recovery-pathway investigation."
  },
  "/pages/retatrutide-research-overview": {
    title: "Retatrutide Research Overview | Solatide Biosciences",
    description: "A laboratory-focused overview of retatrutide, including multi-receptor signalling, GLP-1/GIP/glucagon pathway research, and comparative peptide context."
  },
  "/pages/tirzepatide-research-overview": {
    title: "Tirzepatide Research Overview | Solatide Biosciences",
    description: "A laboratory-focused overview of tirzepatide, including dual GLP-1/GIP receptor signalling, incretin pathway research, and comparative metabolic peptide context."
  },
  "/pages/cagrilintide-research-overview": {
    title: "Cagrilintide Research Overview | Solatide Biosciences",
    description: "A research-focused overview of Cagrilintide, a long-acting amylin receptor agonist studied in satiety signalling, gastric emptying, and GLP-1 combination models."
  },
  "/pages/what-is-ss-31": {
    title: "What Is SS-31 (Elamipretide)? | Solatide Biosciences Research",
    description: "A research-use overview of SS-31 (Elamipretide) — a mitochondria-targeted peptide studied for cardiolipin binding, mitochondrial membrane stabilisation and cellular energy production in laboratory models."
  },
  "/pages/what-is-semax": {
    title: "What Is Semax? | Solatide Biosciences Research",
    description: "A research-use overview of Semax — a synthetic ACTH analogue heptapeptide studied for BDNF upregulation, neuroprotective signalling, dopaminergic modulation and cognitive pathway research in laboratory models."
  },
  "/pages/cagrisema-comparison-guide": {
    title: "CagriSema Comparison Guide | Semaglutide, Tirzepatide & Retatrutide – Solatide Biosciences",
    description: "A structured guide to CagriSema comparison pages, linking CagriSema vs Semaglutide, Tirzepatide, and Retatrutide research resources."
  },
  "/pages/cagrisema-research-overview": {
    title: "CagriSema Research Overview | Solatide GLP-1 & Amylin Guide – Solatide Biosciences",
    description: "A research-focused overview of CagriSema, its dual GLP-1 and amylin receptor framework, role in metabolic research, and comparison to related compounds."
  },
  "/pages/what-is-ipamorelin": {
    title: "What Is Ipamorelin? | Solatide Biosciences Research",
    description: "A research-use overview of Ipamorelin — a selective GHS-R agonist pentapeptide studied for growth hormone secretagogue signalling, ghrelin receptor research and GH pulse dynamics in laboratory models."
  }
};

const StaticSEO = () => {
    const location = useLocation();
    
    // Normalize path (remove trailing slash if present, unless it's just '/')
    let path = location.pathname;
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    // Do not inject static SEO for product detail pages - rely on their own dynamic Helmet
    if (path.startsWith('/product/') || path.startsWith('/products/')) {
        return null;
    }

    const seo = seoData[path];

    if (!seo) return null;

    // Use dynamic domain for canonical URL
    const canonicalUrl = `${window.location.origin}${path}`;

    return (
        <Helmet>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
        </Helmet>
    );
};

export default StaticSEO;
