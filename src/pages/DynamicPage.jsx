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
          window.location.replace(`/page/${data.targetSlug}`);
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

  // Ensure HTML is safe before injecting (double layer of security)
  const createMarkup = (htmlString) => {
    return {
      __html: DOMPurify.sanitize(htmlString, {
        ALLOWED_TAGS: [
          'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'a',
          'ul', 'ol', 'li', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'blockquote', 'hr', 'pre', 'code', 'br', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'name', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id', 'style']
      })
    };
  };

  return (
    <div className="main-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in duration-500">
      <Helmet>
        <title>{page.seoTitle || page.title} - Solatide Biosciences</title>
        {page.metaDescription && (
          <meta name="description" content={page.metaDescription} />
        )}
        <link rel="canonical" href={`${window.location.origin}/page/${page.slug}`} />
      </Helmet>

      {/* 
        Tailwind Prose class ensures that the raw HTML inherits nice styles 
        (line height, heading sizes, list bullets, etc.)
      */}
      <div
        className="prose prose-slate prose-lg max-w-none 
                   prose-a:text-brand-cyan prose-a:no-underline hover:prose-a:underline
                   prose-headings:text-slate-900 prose-headings:font-bold
                   prose-img:rounded-xl prose-img:shadow-md
                   prose-pre:bg-slate-800 prose-pre:text-slate-50"
        dangerouslySetInnerHTML={createMarkup(page.content?.html || '')}
      />
    </div>
  );
};

export default DynamicPage;
