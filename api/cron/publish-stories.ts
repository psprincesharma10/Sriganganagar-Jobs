// Vercel Cron Function: /api/cron/publish-stories
// Runs daily (see vercel.json "crons") and flips any story whose
// scheduled_date has arrived from status='scheduled' to status='published'.
// This is what makes "daily auto-posting" work — admin schedules stories
// in advance from the Admin Panel, and they go live on their own each day.

export const config = { runtime: 'nodejs' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: any, res: any) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    res.status(500).json({ error: 'Not configured' });
    return;
  }
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `${SUPABASE_URL}/rest/v1/web_stories?status=eq.scheduled&scheduled_date=lte.${today}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ status: 'published', published_at: new Date().toISOString() }),
    });

    const updated = await response.json();
    res.status(200).json({ published: Array.isArray(updated) ? updated.length : 0 });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Cron failed' });
  }
}
