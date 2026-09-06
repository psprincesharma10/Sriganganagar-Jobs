// Vercel Serverless Function: /api/sitemap-stories
// Generates an XML sitemap of all published Web Stories.
// Exposed publicly at /sitemap-stories.xml via vercel.json rewrite.

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const SITE_URL = 'https://www.sriganganagarjobs.in';

export default async function handler(req: any, res: any) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).send('Not configured');
    return;
  }
  try {
    const apiUrl = `${SUPABASE_URL}/rest/v1/web_stories?status=eq.published&select=slug,published_at,created_at`;
    const response = await fetch(apiUrl, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    const rows = await response.json();
    const stories = Array.isArray(rows) ? rows : [];

    const urls = stories.map((s: any) => `
  <url>
    <loc>${SITE_URL}/stories/${s.slug}</loc>
    <lastmod>${new Date(s.published_at || s.created_at).toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    res.status(200).send(xml);
  } catch (err: any) {
    res.status(500).send('Error generating sitemap');
  }
}
