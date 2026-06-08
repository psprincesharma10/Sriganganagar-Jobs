import React, { useState } from 'react';
import { X, Briefcase, Loader, Copy, Check, ChevronDown } from 'lucide-react';
import { Language } from '../types';

interface InterviewToolProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const JOB_ROLES = [
  'Accountant', 'Computer Operator', 'Data Entry Operator', 'Teacher / Tutor',
  'Driver', 'Security Guard', 'Delivery Boy', 'Sales Executive',
  'Shop Assistant / Sales', 'Receptionist', 'Office Manager', 'Personal Assistant',
  'Medical / Pharmacist', 'Lab Technician', 'Nurse / Compounder', 'Ward Boy',
  'Cook / Chef', 'Beautician', 'Gym Trainer', 'Factory Helper',
  'Electrician', 'Plumber', 'AC Technician', 'Mobile Repair Technician',
  'Graphic Designer', 'Video Editor', 'Content Writer', 'Digital Marketing',
  'Customer Support / Telecaller', 'Back Office / Data Entry',
  'Tally Operator', 'CA / Finance Assistant', 'Warehouse / Store Keeper',
  'Agriculture Worker', 'Construction Worker', 'Other',
];

const EXPERIENCE_LEVELS = [
  { en: 'Fresher (0 experience)', hi: 'फ्रेशर' },
  { en: '0-1 Year', hi: '0-1 साल' },
  { en: '1-3 Years', hi: '1-3 साल' },
  { en: '3-5 Years', hi: '3-5 साल' },
  { en: '5+ Years', hi: '5+ साल' },
];

export default function InterviewTool({ isOpen, onClose, lang }: InterviewToolProps) {
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('Fresher (0 experience)');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const generateQuestions = async () => {
    if (!jobRole) { setError('Job role select karo!'); return; }
    setLoading(true);
    setQuestions([]);
    setError('');

    try {
      const companyPart = company ? 'Company type: ' + company + '.' : '';
      const prompt = 'Generate exactly 15 interview questions for a ' + jobRole + ' job in Sri Ganganagar, Rajasthan. Experience: ' + experience + '. ' + companyPart + ' Write in simple Hinglish. Return ONLY 15 numbered questions like: 1. Question. No extra text.';

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) throw new Error('API Error: ' + response.status);

      const data = await response.json();
      const text = (data.content || []).map((c: any) => c.text || '').join('');

      if (!text) throw new Error('Empty response');

      const allLines = text.split('\n').filter((l: string) => l.trim().length > 5);
      const numbered = allLines.filter((l: string) => /^\d+[.)]\s/.test(l.trim()));

      if (numbered.length >= 3) {
        setQuestions(numbered.map((l: string) => l.replace(/^\d+[.)]\s*/, '').trim()));
      } else {
        setQuestions(allLines.slice(0, 15).map((l: string) => l.trim()));
      }
    } catch (err: any) {
      console.error('Interview Tool Error:', err);
      setError('Questions generate nahi hue. Thodi der baad dobara try karein.');
    }
    setLoading(false);
  };

  const copyAll = () => {
    const text = questions.map((q, i) => (i + 1) + '. ' + q).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#075E54] to-[#128C7E] rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-[#25D366]" />
            <div>
              <h2 className="font-black text-white text-base">
                {lang === 'en' ? '🎯 Interview Prep Tool' : '🎯 इंटरव्यू तैयारी'}
              </h2>
              <p className="text-[10px] text-white/70">AI se 15 interview questions generate karo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer text-white">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {questions.length === 0 && !loading && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                <p className="font-black mb-1">💡 Kaise Use Karein?</p>
                <p>Job role chunno → Experience batao → Generate karo → 15 interview questions ready!</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">{error}</div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Job Role * <span className="text-slate-400 font-normal normal-case">(kaunsi job ke liye interview hai?)</span>
                </label>
                <div className="relative">
                  <select value={jobRole} onChange={e => setJobRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm bg-white appearance-none cursor-pointer">
                    <option value="">-- Job Role Chunein --</option>
                    {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Experience Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EXPERIENCE_LEVELS.map(exp => (
                    <button key={exp.en} type="button"
                      onClick={() => setExperience(exp.en)}
                      className={'py-2.5 px-3 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all ' + (
                        experience === exp.en
                          ? 'border-[#075E54] bg-[#eefaf7] text-[#075E54]'
                          : 'border-slate-100 hover:border-slate-200 text-slate-600'
                      )}>
                      {lang === 'en' ? exp.en : exp.hi}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Company Type <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Retail Shop, School, Hospital, Factory..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>

              <button onClick={generateQuestions} disabled={!jobRole}
                className="w-full py-3.5 bg-[#075E54] hover:bg-[#064a43] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl text-sm cursor-pointer transition-colors flex items-center justify-center gap-2">
                ✨ {lang === 'en' ? 'Generate Interview Questions' : 'इंटरव्यू प्रश्न बनाएं'}
              </button>
            </>
          )}

          {loading && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#eefaf7] rounded-full flex items-center justify-center mx-auto">
                <Loader size={28} className="text-[#075E54] animate-spin" />
              </div>
              <p className="font-black text-slate-800">{jobRole} ke liye questions ban rahe hain...</p>
              <p className="text-xs text-slate-400">AI 15 questions taiyaar kar raha hai — 10-15 seconds</p>
            </div>
          )}

          {questions.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-900">{jobRole} — Interview Questions</p>
                  <p className="text-xs text-slate-400">{experience} • {questions.length} questions</p>
                </div>
                <button onClick={copyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                  {copied ? <><Check size={12} className="text-green-500" />Copied!</> : <><Copy size={12} />Copy All</>}
                </button>
              </div>

              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl hover:bg-[#eefaf7] transition-colors">
                    <span className="min-w-7 h-7 bg-[#075E54] text-white text-xs font-black rounded-full flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{q}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-black mb-1">💡 Tip:</p>
                <p>In questions ke answers pehle se taiyaar karo — interview mein confident rahoge!</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setQuestions([]); setJobRole(''); setError(''); }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">
                  ← New Search
                </button>
                <button onClick={generateQuestions}
                  className="flex-1 py-3 rounded-xl bg-[#075E54] text-white font-black text-sm cursor-pointer hover:bg-[#064a43]">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
