/**
 * Navigation guards that must stay free of heavy imports (this module is
 * pulled into statically prerendered routes, where a DOMPurify/jsdom import
 * breaks the export build).
 */

/**
 * Only allow same-origin paths for post-login redirects, so a stored or
 * crafted target can never bounce a customer to another site.
 */
export const isSafeInternalPath = (target?: string | null): boolean => {
    if (!target) return false;
    try {
        return new URL(target, window.location.origin).origin === window.location.origin;
    } catch {
        return false;
    }
};
