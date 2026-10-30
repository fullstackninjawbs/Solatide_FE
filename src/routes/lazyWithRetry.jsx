import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Wrapper to handle Vite chunk load errors gracefully with retry before hard reloading.
// Only used for routes that are NEVER hydrated from prerendered HTML (admin, checkout,
// order status, review verification). Prerendered storefront routes are imported eagerly.
export const lazyWithRetry = (componentImport) => {
    const LazyComp = lazy(async () => {
        try {
            const component = await componentImport();
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
            return component;
        } catch (firstError) {
            // Retry once after 300ms to absorb transient network latency
            try {
                await new Promise((res) => setTimeout(res, 300));
                const component = await componentImport();
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
                return component;
            } catch (retryError) {
                const isChunkError =
                    /Failed to fetch dynamically imported module|Loading chunk|error loading dynamically imported module/i.test(
                        retryError?.message || firstError?.message || ''
                    );

                const pageHasAlreadyBeenForceRefreshed = JSON.parse(
                    window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
                );

                // Only perform a hard reload if it's a verified chunk/module error
                // and we haven't already attempted a force refresh in this session
                if (isChunkError && !pageHasAlreadyBeenForceRefreshed) {
                    window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                    window.location.reload();
                    return new Promise(() => { });
                }

                throw retryError || firstError;
            }
        }
    });

    const Wrapped = (props) => (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#102a5c]" /></div>}>
            <LazyComp {...props} />
        </Suspense>
    );
    return Wrapped;
};

export default lazyWithRetry;
