export function optimizedImageUrl(src: string, width = 400): string {
  // Vercel image optimization endpoint (works when deployed on Vercel)
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
