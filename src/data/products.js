import homeVial from '../assets/homePageFirstSection.png';
import retatrutideWhiteVial from '../assets/RetatrutideMad.png';
import retatrutideBlueVial from '../assets/retatrutide_vial.png';

export const products = [
    {
        id: 1,
        name: 'Bacteriostatic Water 10mL',
        price: 'Rs. 1,400.00',
        rating: '5.0',
        inStock: true,
        category: 'Metabolic Pathway Research',
        status: 'In Stock',
        tag: 'Metabolic Pathway Research',
        description: 'Bacteriostatic Water for Injection is sterile, non-pyrogenic water containing 0.9% benzyl alcohol added as a bacteriostatic preservative. It is designed for reconstituting research compounds.',
        reviewsCount: 24,
        image: homeVial
    },
    {
        id: 2,
        name: 'Retatrutide 10mg – Lyophilised Peptide',
        price: 'Rs. 8,900.00',
        rating: '5.0',
        inStock: false,
        category: 'Tissue & Cellular Research',
        status: 'Sold Out',
        tag: 'Dual GLP-1/GIP Receptor Agonist',
        description: 'Retatrutide is a triple agonist research peptide targeting GLP-1, GIP, and glucagon receptors for laboratory investigation of integrated metabolic pathways. ≥99% purity based on available third-party documentation. Strictly for in-vitro research use only.',
        reviewsCount: 44,
        image: retatrutideWhiteVial
    },
    {
        id: 3,
        name: 'Tirzepatide 10mg',
        price: 'Rs. 7,200.00',
        rating: '5.0',
        inStock: true,
        category: 'Dermal & Pigmentation Research',
        status: 'Sale',
        tag: 'Dual GIP/GLP-1 Receptor Agonist',
        description: 'Tirzepatide is a dual GIP and GLP-1 receptor agonist research peptide. Synthesized for experimental studies targeting metabolic disorders, insulin pathways, and cellular energy research.',
        reviewsCount: 18,
        image: retatrutideBlueVial
    },
    {
        id: 4,
        name: 'Semaglutide 5mg',
        price: 'Rs. 5,400.00',
        rating: '5.0',
        inStock: true,
        category: 'Metabolic Pathway Research',
        status: 'In Stock',
        tag: 'GLP-1 Receptor Agonist',
        description: 'Semaglutide is a highly stable GLP-1 receptor agonist studied in metabolic pathways, appetite regulation, and cellular insulin-response models.',
        reviewsCount: 32,
        image: retatrutideBlueVial
    },
    {
        id: 5,
        name: 'BPC-157 10mg',
        price: 'Rs. 4,800.00',
        rating: '5.0',
        inStock: true,
        category: 'Tissue & Cellular Research',
        status: 'In Stock',
        tag: 'Tissue & Cellular Research',
        description: 'BPC-157 is a pentadecapeptide composed of 15 amino acids, studied extensively for recovery, cellular repair, and soft-tissue response models.',
        reviewsCount: 56,
        image: homeVial
    },
    {
        id: 6,
        name: 'Melanotan II 10mg',
        price: 'Rs. 4,500.00',
        rating: '5.0',
        inStock: true,
        category: 'Dermal & Pigmentation Research',
        status: 'In Stock',
        tag: 'Dermal & Pigmentation Research',
        description: 'Melanotan II is a synthetic analog of the peptide hormone alpha-melanocyte stimulating hormone, studied in dermal pigmentation research.',
        reviewsCount: 29,
        image: homeVial
    }
];
