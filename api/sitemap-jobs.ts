// Vercel Serverless Function: /api/sitemap-jobs
// Lists every active job's real URL (/jobs/:id) so Google can discover and
// index each one individually — this is the single biggest indexing lever
// for this site since there are 190+ real job pages that were previously
// invisible to Google (no sitemap entry existed for them at all).

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
    const apiUrl = `${SUPABASE_URL}/rest/v1/jobs?select=id,created_at,expires_at&order=created_at.desc&limit=500`;
    const response = await fetch(apiUrl, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    const rows = await response.json();
    const jobs = Array.isArray(rows) ? rows : [];
    const now = Date.now();

    const urls = jobs
      .filter((j: any) => !j.expires_at || new Date(j.expires_at).getTime() > now)
      .map((j: any) => `
  <url>
    <loc>${SITE_URL}/jobs/${j.id}</loc>
    <lastmod>${new Date(j.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
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
