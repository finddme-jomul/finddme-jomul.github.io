// Read only the final photo section, never CAD, viewer overlays or lightbox copies.
export function extractGallery(html, slug) {
  const photos = [];
  for (const section of html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)) {
    if (!/\bid\s*=\s*["']gallery["']/i.test(section[1])) continue;
    for (const tag of section[2].matchAll(/<img\b([^>]*)>/gi)) {
      const attrs = Object.fromEntries([...tag[1].matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/g)].map(m => [m[1], m[3]]));
      if (!attrs.src || /^(data:|https?:)/.test(attrs.src)) continue;
      const src = new URL(attrs.src, `https://local.invalid/projects/${slug}/`).pathname;
      if (!photos.some(photo => photo.src === src)) photos.push({ src, alt: attrs.alt || '' });
    }
  }
  return photos;
}
