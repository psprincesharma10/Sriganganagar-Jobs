// Vercel Serverless Function: /api/stories/[slug]
//
// Serves a real, valid AMP HTML "Web Story" page for the given slug.
// This MUST be raw server-rendered HTML (not the React SPA) because
// Google Web Stories require valid AMP markup that's crawlable without
// running JavaScript to see the content.
//
// vercel.json rewrites the clean public URL /stories/:slug to this
// function, so visitors and Google see: sriganganagarjobs.in/stories/my-story

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SITE_URL = 'https://www.sriganganagarjobs.in';

function escapeHtml(str: string): string {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req: any, res: any) {
  const { slug } = req.query;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).send('Web Stories not configured (missing Supabase env vars).');
    return;
  }

  try {
    const apiUrl = `${SUPABASE_URL}/rest/v1/web_stories?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`;
    const response = await fetch(apiUrl, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const rows = await response.json();
    const story = Array.isArray(rows) ? rows[0] : null;

    if (!story) {
      res.status(404).send('<h1>Story not found</h1>');
      return;
    }

    const pages = Array.isArray(story.pages) ? story.pages : [];
    const storyUrl = `${SITE_URL}/stories/${story.slug}`;

    const ampPages = pages.map((p: any, i: number) => `
      <amp-story-page id="page-${i + 1}">
        <amp-story-grid-layer template="fill">
          <amp-img src="${escapeHtml(p.image)}" width="720" height="1280" layout="responsive" alt="${escapeHtml(p.headline || '')}"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" class="bottom-text-layer">
          <div class="story-headline">${escapeHtml(p.headline || '')}</div>
          ${p.cta_text && p.cta_link ? `
          <amp-story-cta-layer>
            <a href="${escapeHtml(p.cta_link)}" class="story-cta-button">${escapeHtml(p.cta_text)}</a>
          </amp-story-cta-layer>` : ''}
        </amp-story-grid-layer>
      </amp-story-page>`).join('\n');

    const html = `<!doctype html>
<html amp lang="hi">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(story.title)}</title>
  <link rel="canonical" href="${storyUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <meta name="description" content="${escapeHtml(story.title)} — Sri Ganganagar Jobs">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <style amp-custom>
    .story-headline { color: #fff; font-family: sans-serif; font-weight: 800; font-size: 28px; line-height: 1.3; text-shadow: 0 2px 8px rgba(0,0,0,0.6); padding: 24px; text-align: center; }
    .bottom-text-layer { align-content: flex-end; padding-bottom: 40px; }
    .story-cta-button { display: inline-block; margin: 0 auto; background: #075E54; color: #fff; font-family: sans-serif; font-weight: 700; padding: 12px 28px; border-radius: 999px; text-decoration: none; }
  </style>
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    image: [story.poster_image],
    datePublished: story.published_at || story.created_at,
    publisher: { '@type': 'Organization', name: 'Sri Ganganagar Jobs', url: SITE_URL },
    mainEntityOfPage: storyUrl,
  })}
  </script>
</head>
<body>
  <amp-story standalone
    title="${escapeHtml(story.title)}"
    publisher="Sri Ganganagar Jobs"
    publisher-logo-src="${SITE_URL}/icons/icon-192x192.png"
    poster-portrait-src="${escapeHtml(story.poster_image)}">
    ${ampPages}
  </amp-story>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
    res.status(200).send(html);
  } catch (err: any) {
    res.status(500).send(`<h1>Error loading story</h1><p>${escapeHtml(err?.message || '')}</p>`);
  }
}
