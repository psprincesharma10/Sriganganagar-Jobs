import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react';

interface AiArticleAssistantProps {
  articleType: string;
  title: string;
  onInsertHtml: (html: string) => void;
  onApplyMetaDescription?: (desc: string) => void;
  onApplyKeywords?: (keywords: string) => void;
  fullContentPlainText: string;
  sourceUrl?: string;
}

const TONE_OPTIONS = ['Professional', 'Simple Hindi-English / Hinglish', 'Formal News', 'Informative', 'Beginner Friendly'];

const ACTIONS: { id: string; label: string }[] = [
  { id: 'outline', label: 'Generate Article Outline' },
  { id: 'introduction', label: 'Generate Introduction' },
  { id: 'section', label: 'Generate Section' },
  { id: 'rewrite', label: 'Rewrite Clearly' },
  { id: 'summarize', label: 'Summarize' },
  { id: 'meta-description', label: 'Generate SEO Meta Description' },
  { id: 'seo-title', label: 'Suggest SEO Title' },
  { id: 'keywords', label: 'Suggest Keywords' },
  { id: 'faq', label: 'Generate FAQ' },
  { id: 'content-quality', label: 'Check Content Quality' },
];

export const AiArticleAssistant: React.FC<AiArticleAssistantProps> = ({
  articleType, title, onInsertHtml, onApplyMetaDescription, onApplyKeywords, fullContentPlainText, sourceUrl,
}) => {
  const [open, setOpen] = useState(false);
  const [brief, setBrief] = useState('');
  const [keyFacts, setKeyFacts] = useState('');
  const [dates, setDates] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState(TONE_OPTIONS[1]);
  const [sectionName, setSectionName] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [lastActionType, setLastActionType] = useState('');

  const callAi = async (action: string) => {
    setError('');
    setLastResult('');
    setLoadingAction(action);
    try {
      const res = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          fields: {
            articleType, title, brief, keyFacts, dates, eligibility, keywords, tone,
            sourceUrl, sectionName, fullContent: fullContentPlainText,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI request failed.');

      const result = data.result || '';
      setLastResult(result);
      setLastActionType(action);

      if (action === 'meta-description' && onApplyMetaDescription) onApplyMetaDescription(result.trim());
      else if (action === 'keywords' && onApplyKeywords) onApplyKeywords(result.trim());
      else if (action === 'seo-title' || action === 'summarize' || action === 'content-quality') {
        // Shown as a text suggestion below, not auto-inserted into the article body
      } else {
        onInsertHtml(result);
      }
    } catch (err: any) {
      setError(err.message || 'Kuch galat ho gaya. Dobara try karein.');
    } finally {
      setLoadingAction(null);
    }
  };

  const showResultBox = lastResult && ['seo-title', 'summarize', 'content-quality', 'meta-description', 'keywords'].includes(lastActionType);

  return (
    <div className="border border-purple-200 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50/60 to-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
      >
        <span className="text-sm font-black text-purple-800 flex items-center gap-2">
          <Sparkles size={16} />✨ AI Article Assistant
        </span>
        {open ? <ChevronUp size={16} className="text-purple-400" /> : <ChevronDown size={16} className="text-purple-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-purple-100 pt-3">
          <p className="text-[11px] text-purple-700 bg-purple-100/60 rounded-lg p-2.5">
            Ye sirf ek <strong>drafting tool</strong> hai — kabhi khud publish nahi karta, aur kabhi facts invent nahi karta. Missing info ko <code>[Information Required]</code> likh dega. Har cheez review karke edit/save aapko karni hai.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Topic / Brief</label>
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={2}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300 resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Key Facts (jo aapko pata hai)</label>
              <textarea value={keyFacts} onChange={(e) => setKeyFacts(e.target.value)} rows={2}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300 resize-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Important Dates</label>
              <input value={dates} onChange={(e) => setDates(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Eligibility / Requirements</label>
              <input value={eligibility} onChange={(e) => setEligibility(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Keywords</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white">
                {TONE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Section Name (for "Generate Section")</label>
              <input value={sectionName} onChange={(e) => setSectionName(e.target.value)} placeholder="e.g. Eligibility"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-300" />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => callAi(a.id)}
                disabled={loadingAction !== null}
                className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {loadingAction === a.id && <Loader2 size={11} className="animate-spin" />}
                {a.label}
              </button>
            ))}
          </div>

          {showResultBox && (
            <div className="text-xs bg-white border border-slate-200 rounded-lg p-3 text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
              <span className="font-bold text-slate-500 block mb-1">AI Suggestion:</span>
              {lastResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
