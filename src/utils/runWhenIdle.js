/**
 * Run a non-critical task after the page has loaded and the browser is idle, so it does not
 * compete with the HTML, CSS, JS and hero image for the network on first paint.
 */
export const runWhenIdle = (fn, timeout = 4000) => {
    if (typeof window === 'undefined') return;
    const schedule = () => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(() => fn(), { timeout });
        else window.setTimeout(fn, 1500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
};
