// Path-based routing helper.
//
// IMPORTANT SEO FIX: The site previously used hash-based navigation
// (e.g. sriganganagarjobs.in/#/candidates). Google generally does NOT
// treat "#/..." fragments as separate, indexable pages — everything
// after "#" is ignored for indexing purposes. That is the main reason
// only 1 page was being indexed despite 190+ URLs in the sitemap.
//
// This helper uses the browser History API (pushState) so every
// section of the site now has a REAL, indexable URL like
// sriganganagarjobs.in/candidates — with no "#" — while still behaving
// like a single-page app (no full page reload).
//
// vercel.json has a matching rewrite rule so any of these paths serve
// index.html correctly instead of 404-ing on direct load/refresh.

type RouteChangeListener = () => void;

const listeners: Set<RouteChangeListener> = new Set();

/** Navigate to a new path without a full page reload. */
export function navigateTo(path: string, opts?: { replace?: boolean }) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (window.location.pathname + window.location.search === normalized) return;
  if (opts?.replace) {
    window.history.replaceState({}, '', normalized);
  } else {
    window.history.pushState({}, '', normalized);
  }
  listeners.forEach((fn) => fn());
}

/** Current path, e.g. "/candidates/browse". Always starts with "/". */
export function getCurrentPath(): string {
  return window.location.pathname || '/';
}

/** Subscribe to path changes (covers both our own navigateTo calls and browser back/forward). */
export function onRouteChange(fn: RouteChangeListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Wire up browser back/forward buttons.
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    listeners.forEach((fn) => fn());
  });
}

/**
 * One-time migration: if someone arrives via an old bookmarked/shared
 * "#/..." hash link, silently convert it to the clean path equivalent
 * so old links keep working instead of breaking.
 */
export function migrateLegacyHashUrl() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#/')) {
    const cleanPath = hash.slice(1); // "#/candidates" -> "/candidates"
    window.history.replaceState({}, '', cleanPath || '/');
  }
}

/** Sets/updates the <link rel="canonical"> tag to match the current real URL — required for correct indexing of each page. */
export function setCanonicalUrl(path: string) {
  const url = `https://www.sriganganagarjobs.in${path}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

/** Sets the document title — each real page should have a unique, descriptive title for SEO. */
export function setPageTitle(title: string) {
  document.title = title;
}

/** Sets the meta description — each real page should have a unique description for SEO/CTR. */
export function setMetaDescription(description: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}
