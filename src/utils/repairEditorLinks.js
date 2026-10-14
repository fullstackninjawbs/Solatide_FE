/**
 * Repairs a Jodit link-editing artifact: changing a link by placing the caret inside it and
 * using the toolbar inserts a NEW, empty <a> inside the old one, e.g.
 *   <a href="/old">GLP-1 &amp; m<a href="/new"></a>etabolic peptides</a>
 * Nested links are invalid HTML, so browsers split them and the link/pill styling breaks.
 *
 * Rewrites that to one link using the inner (newer) href, keeping the outer link's other
 * attributes (class, target, …) unless the inner link sets them:
 *   <a href="/new">GLP-1 &amp; metabolic peptides</a>
 * and drops any remaining empty links. Must run on the RAW HTML string, before DOMPurify /
 * the DOM parser (which would already have split the nested links).
 * Keep in sync with Server/src/utils/repairEditorLinks.ts.
 */
const ATTR_RE = /([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;

const parseAttrs = (attrs) => {
    const out = new Map();
    for (const m of attrs.matchAll(ATTR_RE)) out.set(m[1].toLowerCase(), m[0]);
    return out;
};

const mergeAttrs = (outer, inner) => {
    const merged = parseAttrs(outer);
    for (const [name, raw] of parseAttrs(inner)) merged.set(name, raw);
    return merged.size ? ' ' + [...merged.values()].join(' ') : '';
};

// <a OUTER>before<a INNER>(whitespace)</a>after</a>, where before/after contain no other links
const NESTED_EMPTY_LINK =
    /<a\b([^>]*)>((?:(?!<\/?a\b)[\s\S])*?)<a\b([^>]*)>(?:\s|&nbsp;)*<\/a>((?:(?!<\/?a\b)[\s\S])*?)<\/a>/gi;
const EMPTY_LINK = /<a\b[^>]*>(?:\s|&nbsp;)*<\/a>/gi;

export const repairEditorLinks = (html) => {
    if (!html || typeof html !== 'string' || !/<a\b/i.test(html)) return html;
    let out = html;
    for (let i = 0; i < 20; i++) {
        const next = out.replace(NESTED_EMPTY_LINK, (_m, outer, before, inner, after) =>
            `<a${mergeAttrs(outer, inner)}>${before}${after}</a>`);
        if (next === out) break;
        out = next;
    }
    return out.replace(EMPTY_LINK, '');
};

export default repairEditorLinks;
