import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { apiService } from '../services/api';
import DOMPurify from 'dompurify'; // ensure frontend sanitization as well

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await apiService.getPublicPage(slug);

        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();

        // Handle redirect if the backend says the slug moved
        if (data.redirect) {
          window.location.replace(`/pages/${data.targetSlug}`);
          return;
        }

        setPage(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
      </div>
    );
  }

  // If not found or draft, show generic 404 style
  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Helmet>
          <title>Page Not Found - Solatide Biosciences</title>
          <meta name="robots" content="noindex, nofollow" />
          <link rel="canonical" href="" />
        </Helmet>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 mb-4">404</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors font-semibold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const knownPageDescriptions = {
    'bpc-157-vs-tb-500': 'Compare BPC-157 and TB-500 research peptides. Explore mechanisms of action, tissue repair pathways, and laboratory protocols for research use.',
    'data-sharing-opt-out': 'Manage your privacy choices and data sharing preferences for Solatide Biosciences. Control how your information is used.'
  };

  const pageDescription = page.metaDescription || knownPageDescriptions[page.slug] || (page.title ? `${page.title} — Research documentation, laboratory protocols, and reference analysis from Solatide Biosciences Australia.` : '');
  const pageTitle = page.seoTitle || `${page.title} - Solatide Biosciences`;
  const canonicalUrl = `https://solatidebiosciences.com.au/pages/${page.slug}`;

  const articleSchema = page ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": pageDescription,
    "url": canonicalUrl,
    "datePublished": page.publishedAt || page.createdAt || "2026-01-01T00:00:00Z",
    "dateModified": page.updatedAt || page.publishedAt || "2026-01-01T00:00:00Z",
    "publisher": {
      "@type": "Organization",
      "name": "Solatide Biosciences",
      "logo": {
        "@type": "ImageObject",
        "url": "https://solatidebiosciences.com.au/assets/logo.webp"
      }
    }
  } : null;

  const normalizePageContent = (rawHtml, pageTitle) => {
    if (!rawHtml) return '';
    let sanitized = DOMPurify.sanitize(rawHtml);

    // 1. Remove empty or whitespace/<br> only H1 tags
    sanitized = sanitized.replace(/<h1[^>]*>(\s*|<br\s*\/?>|&nbsp;)*<\/h1>/gi, '');

    // 2. Parse any remaining H1 tags:
    // If the H1 text is identical, essentially the same as pageTitle, or begins with pageTitle, remove it.
    // Otherwise convert it to an H2 so the document strictly has 1 H1.
    sanitized = sanitized.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (match, attrs, innerContent) => {
      const plainText = innerContent.replace(/<[^>]*>/g, '').trim().toLowerCase().replace(/&amp;/g, '&');
      const cleanTitle = (pageTitle || '').trim().toLowerCase().replace(/&amp;/g, '&');
      if (!plainText || plainText === cleanTitle || plainText.startsWith(cleanTitle)) {
        return '';
      }
      return `<h2${attrs}>${innerContent}</h2>`;
    });

    // 3. Normalize legacy internal links to canonical targets
    sanitized = sanitized
      .replace(/\/products\/semaglutide-5mg-lyophilised-peptide/g, '/products/semaglutide-5mg')
      .replace(/\/products\/semaglutide-10mg-lyophilised-peptide/g, '/products/semaglutide-10mg')
      .replace(/\/products\/retatrutide-5mg-lyophilised-peptide/g, '/products/retatrutide-5mg')
      .replace(/\/products\/retatrutide-10mg-lyophilised-peptide/g, '/products/retatrutide-10mg')
      .replace(/\/products\/([a-z0-9-]+)-lyophilised-peptide/g, '/products/$1')
      .replace(/href=["']\/privacy-policy["']/g, 'href="/pages/privacy-policy"');

    return sanitized;
  };

  return (
    <div className="main-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in duration-500">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://solatidebiosciences.com.au/assets/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://solatidebiosciences.com.au/assets/logo.webp" />
        {articleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
        )}
      </Helmet>

      {/* Render the page title as an H1 heading at the top */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-8 text-center">
        {page.title}
      </h1>

      {/* 
        Tailwind Prose class ensures that the raw HTML inherits nice styles 
        (line height, heading sizes, list bullets, etc.). 
      */}
      <div
        className="prose prose-lg max-w-none 
                   prose-p:text-slate-700 prose-p:leading-relaxed
                   prose-headings:text-brand-navy prose-headings:font-bold prose-headings:mb-4
                   prose-h1:text-[2em] prose-h2:text-[1.5em] prose-h3:text-[1.25em]
                   prose-li:text-slate-700 prose-li:leading-relaxed
                   prose-a:text-brand-cyan prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-brand-blue
                   prose-img:rounded-xl prose-img:shadow-md
                   prose-pre:bg-slate-800 prose-pre:text-slate-50
                   jodit-content-wrapper"
        dangerouslySetInnerHTML={{ __html: normalizePageContent(page.content?.html, page.title) }}
      />
    </div>
  );
};

export default DynamicPage;
