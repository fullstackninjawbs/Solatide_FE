import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { apiService } from '../services/api';
import { sanitizeHtml, sanitizedMarkup } from '../utils/sanitize';
import { getRouteData, sameData, stripInternal } from '../utils/routeData';
import { ROBOTS_INDEX, ROBOTS_NOINDEX } from '../utils/seo';
import NotFoundMarker from '../components/NotFoundMarker';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// CMS page embedded by prerender.js for this slug (same response the prerender rendered).
const getEmbeddedPage = (slug) => {
  if (!slug) return null;
  const body = getRouteData(`/api/v1/pages/${slug}`);
  return body && typeof body === 'object' && !body.redirect && body.slug ? body : null;
};

// Legacy /policies/* links in CMS content -> canonical /pages/* URLs (L-3).
const POLICY_LINKS = [
  [/href=["']\/policies\/shipping-policy["']/gi, 'href="/pages/shipping-policy"'],
  [/href=["']\/policies\/refund-policy["']/gi, 'href="/pages/refund-policy"'],
  [/href=["']\/policies\/terms-of-service["']/gi, 'href="/pages/terms-of-services"'],
  [/href=["']\/policies\/privacy-policy["']/gi, 'href="/pages/privacy-policy"'],
];

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(() => getEmbeddedPage(slug));
  const [loading, setLoading] = useState(() => !getEmbeddedPage(slug));
  const [error, setError] = useState(false);
  // When the slug changes (client navigation), adopt embedded data or show the loader
  // (adjust-state-during-render pattern instead of a synchronous setState in an effect).
  const [stateForSlug, setStateForSlug] = useState(slug);
  if (stateForSlug !== slug) {
    setStateForSlug(slug);
    const embedded = getEmbeddedPage(slug);
    if (embedded) {
      setPage(prev => (sameData(prev, embedded) ? prev : embedded));
      setLoading(false);
    } else if (!page || page.slug !== slug) {
      setLoading(true);
    }
    setError(false);
  }

  useEffect(() => {
    let cancelled = false;
    const embedded = getEmbeddedPage(slug);

    const fetchPage = async () => {
      try {
        if (!SLUG_RE.test(slug || '')) {
          if (!cancelled) setError(true);
          return;
        }
        const res = await apiService.getPublicPage(slug);
        if (cancelled) return;

        // Check the status before anything else: 404/410/5xx are "not found" for the visitor.
        if (res.status === 404 || res.status === 410 || !res.ok) {
          if (!embedded) setError(true);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        // Slug moved: server answers 200 {redirect: true, targetSlug} -> client-side replace.
        if (data && data.redirect && data.targetSlug && SLUG_RE.test(data.targetSlug)) {
          navigate(`/pages/${data.targetSlug}`, { replace: true });
          return;
        }

        if (data && data.slug) {
          const fresh = stripInternal(data);
          setPage(prev => (sameData(prev, fresh) ? prev : fresh));
          setError(false);
        } else if (!embedded) {
          setError(true);
        }
      } catch {
        if (!cancelled && !embedded) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPage();
    return () => { cancelled = true; };
  }, [slug, navigate]);

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
          <meta name="robots" content={ROBOTS_NOINDEX} />
        </Helmet>
        <NotFoundMarker />
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
  // Always carry the brand: an SEO title entered without it would otherwise equal the H1
  // (Semrush "duplicate title and H1")
  const pageTitle = page.seoTitle
    ? (/solatide/i.test(page.seoTitle) ? page.seoTitle : `${page.seoTitle} | Solatide Biosciences`)
    : `${page.title} - Solatide Biosciences`;
  const canonicalUrl = `https://solatidebiosciences.com.au/pages/${page.slug}`;

  const articleSchema = page ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": pageDescription,
    "url": canonicalUrl,
    // Real CMS timestamps only — never a fabricated date.
    ...((page.publishedAt || page.createdAt) ? { "datePublished": page.publishedAt || page.createdAt } : {}),
    ...((page.updatedAt || page.publishedAt) ? { "dateModified": page.updatedAt || page.publishedAt } : {}),
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
    let sanitized = sanitizeHtml(rawHtml);

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
    for (const [re, replacement] of POLICY_LINKS) {
      sanitized = sanitized.replace(re, replacement);
    }

    return sanitized;
  };

  return (
    <div className="main-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in duration-500">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={ROBOTS_INDEX} />
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
        dangerouslySetInnerHTML={sanitizedMarkup(normalizePageContent(page.content?.html, page.title))}
      />
    </div>
  );
};

export default DynamicPage;
