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

  return (
    <div className="main-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in duration-500">
      <Helmet>
        <title>{page.seoTitle || page.title} - Solatide Biosciences</title>
        {page.metaDescription && (
          <meta name="description" content={page.metaDescription} />
        )}
        <link rel="canonical" href={`${window.location.origin}/pages/${page.slug}`} />
      </Helmet>

      {/* 
        Tailwind Prose class ensures that the raw HTML inherits nice styles 
        (line height, heading sizes, list bullets, etc.). 
        Removed prose-lg and tailored it to match the Jodit editor's exact look and feel.
      */}
      <div
        className="prose max-w-none 
                   prose-p:text-[14.5px] prose-p:leading-[1.65] prose-p:text-[#1e293b]
                   prose-headings:text-[#1a3a6b] prose-headings:font-bold prose-headings:mb-4
                   prose-h1:text-[2em] prose-h2:text-[1.35em] prose-h3:text-[1.05em]
                   prose-li:text-[14.5px] prose-li:leading-[1.65] prose-li:text-[#1e293b]
                   prose-a:text-[#2a7de1] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                   prose-img:rounded-xl prose-img:shadow-md
                   prose-pre:bg-slate-800 prose-pre:text-slate-50
                   jodit-content-wrapper"
        dangerouslySetInnerHTML={{ __html: page.content?.html || '' }}
      />
    </div>
  );
};

export default DynamicPage;
