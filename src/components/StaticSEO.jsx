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
  "/pages/research-use-disclaimer": {
    title: "Research Use Disclaimer | Solatide Biosciences Australia",
    description: "Important research-use terms, regulatory positioning, and laboratory compliance guidelines for Solatide Biosciences analytical compounds and peptides."
  }
};

const StaticSEO = () => {
  const location = useLocation();

  // Normalize path (remove trailing slash if present, unless it's just '/')
  let path = location.pathname;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  // Do not inject static SEO for product or collection pages - rely on their own page components to avoid duplicate canonicals/titles
  if (path.startsWith('/product/') || path.startsWith('/products/') || path.startsWith('/collections/')) {
    return null;
  }

  const seo = seoData[path];

  if (!seo) return null;

  const canonicalUrl = `https://solatidebiosciences.com.au${path === '/' ? '' : path}`;
  const defaultOgImage = "https://solatidebiosciences.com.au/assets/logo.webp";

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={defaultOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={defaultOgImage} />
    </Helmet>
  );
};

export default StaticSEO;
