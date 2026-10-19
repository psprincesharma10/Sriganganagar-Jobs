// Vercel Serverless Function: /api/admin-login
//
// Verifies the admin password on the SERVER so the real password is never
// shipped to the browser (previously it was hardcoded in the JS bundle,
// visible to anyone via View Source / DevTools).
//
// SETUP (one-time, in Vercel dashboard):
//   Project Settings -> Environment Variables -> add:
//     ADMIN_PASSWORD = <your admin password>
//   then Redeploy.

export const config = { runtime: 'nodejs' };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(500).json({ ok: false, error: 'ADMIN_PASSWORD not configured on server.' });
    return;
  }

  const { password } = req.body || {};
  if (typeof password === 'string' && password === expected) {
    res.status(200).json({ ok: true });
  } else {
    // small delay to slow down brute-force guessing
    await new Promise((r) => setTimeout(r, 600));
    res.status(401).json({ ok: false });
  }
}
