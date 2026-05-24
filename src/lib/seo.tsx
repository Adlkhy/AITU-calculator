import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { createSiteUrl } from './siteUrl';

const SITE_NAME = 'Evalis';
const DEFAULT_IMAGE_PATH = '/meta_image.png';

type SeoMetaProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  children?: ReactNode;
};

export function SeoMeta({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE_PATH,
  keywords,
  noindex = false,
  jsonLd,
}: SeoMetaProps) {
  const canonicalUrl = createSiteUrl(path);
  const imageUrl = createSiteUrl(image);
  const keywordContent = keywords?.length ? keywords.join(', ') : undefined;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordContent ? <meta name="keywords" content={keywordContent} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
