const DEFAULT_SITE_URL = 'https://evaiis.vercel.app';

export function getSiteOrigin() {
  const envSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

  if (envSiteUrl) {
    return envSiteUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/$/, '');
  }

  return DEFAULT_SITE_URL;
}

export function createSiteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteOrigin()}${normalizedPath}`;
}