// Vercel Serverless Function: /api/ai-assist
//
// This is the ONLY place the AI API key is used — it runs on Vercel's
// server, never in the browser, so the key is never exposed to visitors.
//
// SETUP REQUIRED (one-time, in Vercel dashboard):
//   Project Settings -> Environment Variables -> add:
//     ANTHROPIC_API_KEY = <your own Anthropic API key>
//   (Get one at https://console.anthropic.com — this is a paid API,
//    separate from your Claude.ai chat subscription.)
//
// Without this env var set, this endpoint returns a clear error message
// instead of crashing, and the Admin Panel will show that error to you.

export const config = { runtime: 'nodejs' };

const SYSTEM_PROMPT = `You are a careful, honest drafting assistant for a local job/news website in Sri Ganganagar, Rajasthan, India (SriganganagarJobs.in).

CRITICAL RULES — you must follow these strictly:
- NEVER invent job vacancies, government announcements, dates, salaries, eligibility criteria, official statements, local news facts, or quotations.
- Only use information explicitly supplied by the admin in the request.
- If information is missing, write "[Information Required]" instead of guessing or inventing it.
- Never claim something is "verified" or "official" unless the admin explicitly told you it is.
- You are producing a DRAFT for a human editor to review and edit — never write as if this is already published fact.
- For News content, prioritize accuracy over word count or style.
- Write in the requested tone. Mix Hindi and English naturally if "Hinglish" tone is requested.
- Output clean HTML using only these tags: <h2> <h3> <p> <ul> <ol> <li> <strong> <em> <blockquote> <a> <hr>. No <script>, no inline styles, no event handlers.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'AI Assistant not configured yet. Add ANTHROPIC_API_KEY in your Vercel project\'s Environment Variables, then redeploy.',
    });
    return;
  }

  try {
    const { action, fields } = req.body || {};
    if (!action) {
      res.status(400).json({ error: 'Missing "action" in request body.' });
      return;
    }

    const userPrompt = buildPrompt(action, fields || {});
    if (!userPrompt) {
      res.status(400).json({ error: `Unknown action: ${action}` });
      return;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    if (data.error) {
      res.status(502).json({ error: data.error.message || 'AI provider error.' });
      return;
    }

    const text = (data.content || []).map((c: any) => c.text || '').join('');
    res.status(200).json({ result: text });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'AI Assistant request failed.' });
  }
}

function buildPrompt(action: string, f: Record<string, string>): string | null {
  const ctx = `
Article Type: ${f.articleType || '[not specified]'}
Title: ${f.title || '[not specified]'}
Topic / Brief: ${f.brief || '[not specified]'}
Key Facts: ${f.keyFacts || '[not specified]'}
Important Dates: ${f.dates || '[not specified]'}
Location: ${f.location || 'Sri Ganganagar, Rajasthan'}
Eligibility / Requirements: ${f.eligibility || '[not specified]'}
Official Source URL: ${f.sourceUrl || '[not specified]'}
Keywords: ${f.keywords || '[not specified]'}
Tone: ${f.tone || 'Simple Hindi-English / Hinglish'}
`.trim();

  switch (action) {
    case 'outline':
      return `${ctx}\n\nGenerate a recommended section outline (headings only, as <h2> tags with one placeholder <p> under each) for this article. Do not write full content yet.`;
    case 'introduction':
      return `${ctx}\n\nWrite only the introduction paragraph (2-4 sentences) for this article as HTML <p> tags.`;
    case 'section':
      return `${ctx}\nSection to write: ${f.sectionName || '[not specified]'}\n\nWrite this one section as HTML (a <h2> and 1-3 <p>/<ul> tags), using ONLY the facts given above. Use [Information Required] for any missing facts.`;
    case 'improve':
      return `Improve the clarity and flow of this text without changing its factual meaning. Return only the improved HTML:\n\n${f.selectedText || ''}`;
    case 'rewrite':
      return `Rewrite this text more clearly and simply, in ${f.tone || 'Simple Hindi-English / Hinglish'} tone, without changing its factual meaning. Return only the rewritten HTML:\n\n${f.selectedText || ''}`;
    case 'summarize':
      return `Summarize this article content in 2-3 sentences (plain text, no HTML tags):\n\n${f.fullContent || ''}`;
    case 'meta-description':
      return `${ctx}\n\nWrite an SEO meta description (max 155 characters, plain text only) for this article.`;
    case 'seo-title':
      return `${ctx}\n\nSuggest 3 SEO-friendly title options (30-65 characters each) for this article, as a plain numbered list.`;
    case 'keywords':
      return `${ctx}\n\nSuggest 8-10 relevant SEO keywords/phrases for this article, comma-separated, plain text.`;
    case 'faq':
      return `${ctx}\n\nGenerate 3-4 relevant FAQ questions and answers based ONLY on the facts given above (use [Information Required] if an answer isn't in the given facts). Format as HTML: <h2>FAQ</h2> then <h3>Question</h3><p>Answer</p> pairs.`;
    case 'content-quality':
      return `Review this article content for a local job/news website and give brief, honest feedback (plain text, 4-6 bullet points) on: clarity, structure, missing information, and anything that looks unverified or risky to publish as-is:\n\n${f.fullContent || ''}`;
    default:
      return null;
  }
}
