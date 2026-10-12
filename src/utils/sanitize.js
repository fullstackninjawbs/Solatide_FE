import DOMPurify from 'dompurify';

/**
 * Single shared sanitiser for every piece of admin/CMS/product-supplied HTML that is
 * rendered with dangerouslySetInnerHTML.
 *
 * It is called synchronously during render, so the prerender (Chromium/Puppeteer)
 * and the client produce the same markup from the same input.
 */

const IFRAME_HOST_ALLOWLIST = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

let hooksInstalled = false;
const installHooks = () => {
    if (hooksInstalled || typeof DOMPurify.addHook !== 'function') return;
    hooksInstalled = true;

    DOMPurify.addHook('uponSanitizeElement', (node, data) => {
        if (data.tagName === 'iframe') {
            const src = node.getAttribute && node.getAttribute('src');
            if (!src || !IFRAME_HOST_ALLOWLIST.test(src)) {
                node.parentNode && node.parentNode.removeChild(node);
            }
        }
    });

    DOMPurify.addHook('afterSanitizeAttributes', (node) => {
        // Links that open a new tab must not get window.opener.
        if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });
};

const CONFIG = {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder'],
};

/**
 * Returns sanitised HTML (string). Non-string input yields ''.
 * Server-side safe: if DOMPurify has no DOM (e.g. in Node), returns '' rather than raw HTML.
 */
export const sanitizeHtml = (html) => {
    if (typeof html !== 'string' || html === '') return '';
    if (!DOMPurify.isSupported) return '';
    installHooks();
    return DOMPurify.sanitize(html, CONFIG);
};

export default sanitizeHtml;

// React 19 re-assigns innerHTML whenever the dangerouslySetInnerHTML object identity changes on
// a re-render (e.g. when a context updates after hydration), which throws away the hydrated DOM.
// Return the SAME { __html } object for the same input so re-renders are no-ops.
const markupCache = new Map();
const MARKUP_CACHE_MAX = 500;
export const sanitizedMarkup = (html) => {
    const key = typeof html === 'string' ? html : '';
    let entry = markupCache.get(key);
    if (!entry) {
        entry = { __html: sanitizeHtml(key) };
        if (markupCache.size >= MARKUP_CACHE_MAX) markupCache.delete(markupCache.keys().next().value);
        markupCache.set(key, entry);
    }
    return entry;
};
