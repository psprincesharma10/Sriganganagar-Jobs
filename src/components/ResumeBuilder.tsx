import React, { useState } from 'react';
import { X, FileText, Download, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { Language } from '../types';

interface ResumeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const JOB_ROLES = [
  { emoji: '🚚', en: 'Delivery Boy', hi: 'डिलीवरी बॉय' },
  { emoji: '🚗', en: 'Driver', hi: 'ड्राइवर' },
  { emoji: '💻', en: 'Computer Operator', hi: 'कंप्यूटर ऑपरेटर' },
  { emoji: '👩‍🏫', en: 'Teacher / Tutor', hi: 'टीचर / ट्यूटर' },
  { emoji: '💂', en: 'Security Guard', hi: 'सिक्योरिटी गार्ड' },
  { emoji: '🏭', en: 'Factory Helper', hi: 'फैक्ट्री हेल्पर' },
  { emoji: '💊', en: 'Medical / Pharmacist', hi: 'मेडिकल / फार्मासिस्ट' },
  { emoji: '🏪', en: 'Shop Assistant', hi: 'दुकान सहायक' },
  { emoji: '🍽️', en: 'Cook / Chef', hi: 'कुक / शेफ' },
  { emoji: '🔧', en: 'Technician / Mechanic', hi: 'तकनीशियन / मैकेनिक' },
  { emoji: '📞', en: 'Customer Support', hi: 'कस्टमर सपोर्ट' },
  { emoji: '🧹', en: 'Housekeeping', hi: 'हाउसकीपिंग' },
  { emoji: '💈', en: 'Beautician', hi: 'ब्यूटीशियन' },
  { emoji: '📦', en: 'Warehouse / Store', hi: 'वेयरहाउस / स्टोर' },
  { emoji: '🌾', en: 'Agriculture Worker', hi: 'कृषि कामगार' },
];

export default function ResumeBuilder({ isOpen, onClose, lang }: ResumeBuilderProps) {
  const [step, setStep] = useState<'role' | 'form' | 'preview'>('role');
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Sri Ganganagar');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [languages, setLanguages] = useState('Hindi, English');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFullResume, setShowFullResume] = useState(false);

  if (!isOpen) return null;

  const generateResume = async () => {
    setLoading(true);
    try {
      const prompt = `Create a professional resume in simple plain text format for the following person applying for ${selectedRole} job in Sri Ganganagar, Rajasthan, India.

Details:
- Name: ${name}
- Phone: ${phone}
- Email: ${email || 'Not provided'}
- City: ${city}
- Job Role: ${selectedRole}
- Experience: ${experience || 'Fresher'}
- Skills: ${skills}
- Education: ${education}
- Languages Known: ${languages}

Create a clean, professional resume with these sections:
1. PERSONAL INFORMATION
2. OBJECTIVE (2-3 lines specific to ${selectedRole} job)
3. SKILLS (bullet points)
4. EXPERIENCE (if any, else write "Fresher - Ready to Learn")
5. EDUCATION
6. LANGUAGES
7. REFERENCES (write "Available on request")

Keep it simple, honest, and suitable for a local job in Sri Ganganagar. Write in English. Make it fit on one page. Use plain text with clear section headers.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.map((c: any) => c.text || '').join('') || '';
      setResumeText(text);
      setStep('preview');
    } catch (e) {
      setResumeText(`ERROR: Resume generate nahi hua. Please check internet connection.`);
      setStep('preview');
    }
    setLoading(false);
  };

  const handleDownload = () => {
    // Generate a printable HTML page and trigger PDF save via browser print
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${name} — ${selectedRole} Resume</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #111; line-height: 1.6; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .sub { color: #555; font-size: 13px; margin-bottom: 20px; }
  pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.7; }
  .footer { margin-top: 30px; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 10px; }
  @media print { body { margin: 20px; } .footer { display: none; } }
</style>
</head>
<body>
<h1>${name}</h1>
<div class="sub">${selectedRole} | ${city} | ${phone}</div>
<pre>${resumeText}</pre>
<div class="footer">Generated free on sriganganagarjobs.in</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.focus();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(`My Resume for ${selectedRole}:\n\n${resumeText.substring(0, 500)}...\n\nGenerated on sriganganagarjobs.in`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleClose = () => {
    setStep('role'); setSelectedRole(''); setName(''); setPhone('');
    setEmail(''); setCity('Sri Ganganagar'); setExperience(''); setSkills('');
    setEducation(''); setLanguages('Hindi, English'); setResumeText(''); setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#075E54] to-[#128C7E] rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[#25D366]" />
            <div>
              <h2 className="font-black text-white text-base">
                {lang === 'en' ? '📄 Free Resume Builder' : '📄 मुफ्त Resume बनाएं'}
              </h2>
              <p className="text-[10px] text-white/70">AI se 2 minute mein ready</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer text-white"><X size={18} /></button>
        </div>

        {/* Progress */}
        <div className="flex items-center px-6 py-2 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          {['role', 'form', 'preview'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${step === s ? 'text-[#075E54]' : i < ['role','form','preview'].indexOf(step) ? 'text-green-500' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === s ? 'bg-[#075E54] text-white' : i < ['role','form','preview'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{i+1}</span>
                {s === 'role' ? 'Job Role' : s === 'form' ? 'Details' : 'Resume'}
              </div>
              {i < 2 && <div className="flex-1 h-px bg-slate-200 mx-2" />}
            </React.Fragment>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* STEP 1: SELECT ROLE */}
          {step === 'role' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-700">
                {lang === 'en' ? 'Select the job role you are applying for:' : 'आप किस जॉब के लिए apply कर रहे हैं?'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {JOB_ROLES.map((role) => (
                  <button key={role.en}
                    onClick={() => setSelectedRole(lang === 'en' ? role.en : role.hi)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm font-semibold transition-all cursor-pointer ${selectedRole === (lang === 'en' ? role.en : role.hi) ? 'border-[#075E54] bg-[#eefaf7] text-[#075E54]' : 'border-slate-100 hover:border-[#128C7E] text-slate-700'}`}>
                    <span className="text-lg">{role.emoji}</span>
                    <span className="text-xs">{lang === 'en' ? role.en : role.hi}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => selectedRole && setStep('form')}
                disabled={!selectedRole}
                className="w-full py-3 bg-[#075E54] hover:bg-[#064a43] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black rounded-xl text-sm cursor-pointer transition-colors">
                {lang === 'en' ? 'Next — Fill Details →' : 'आगे बढ़ें →'}
              </button>
            </div>
          )}

          {/* STEP 2: FORM */}
          {step === 'form' && (
            <div className="space-y-3">
              <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54]">
                <p className="font-black">📄 Resume for: {selectedRole}</p>
                <p className="opacity-80 mt-0.5">Sab fields fill karo — better resume banega!</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Aapka poora naam"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Phone *</label>
                  <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))} placeholder="94143XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm font-mono" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Sri Ganganagar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Email (Optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="aapka@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Education *</label>
                <input type="text" value={education} onChange={e => setEducation(e.target.value)} placeholder="e.g. 10th Pass, 12th Pass, Graduate, ITI..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Experience</label>
                <input type="text" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 2 saal delivery ka experience, ya Fresher"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Skills *</label>
                <textarea rows={2} value={skills} onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. Driving license, MS Excel, Good communication, Tally..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Languages Known</label>
                <input type="text" value={languages} onChange={e => setLanguages(e.target.value)} placeholder="Hindi, English, Punjabi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep('role')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">← Back</button>
                <button onClick={generateResume} disabled={!name.trim() || !phone.trim() || !education.trim() || !skills.trim() || loading}
                  className="flex-1 py-3 rounded-xl bg-[#075E54] hover:bg-[#064a43] disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  {loading ? <><Loader size={14} className="animate-spin" />Generating...</> : <>✨ Generate Resume</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                <p className="font-black mb-1">✅ Resume Ready!</p>
                <p>Download karo ya WhatsApp pe share karo employer ko directly!</p>
              </div>

              {/* Resume Preview */}
              <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">📄 {name} — {selectedRole}</span>
                  <button onClick={() => setShowFullResume(!showFullResume)}
                    className="text-slate-400 hover:text-white cursor-pointer flex items-center gap-1 text-xs">
                    {showFullResume ? <><ChevronUp size={12} />Less</> : <><ChevronDown size={12} />Full</>}
                  </button>
                </div>
                <div className={`p-4 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed overflow-auto ${showFullResume ? 'max-h-none' : 'max-h-48'}`}>
                  {resumeText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button onClick={handleDownload}
                  className="w-full py-3 bg-[#075E54] hover:bg-[#064a43] text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer">
                  <Download size={15} />
                  {lang === 'en' ? '⬇ Download as PDF' : '⬇ PDF Download करें'}
                </button>
                <button onClick={handleShareWhatsApp}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-slate-900 font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer">
                  💬 {lang === 'en' ? 'Share on WhatsApp' : 'WhatsApp पर Share करें'}
                </button>
                <button onClick={() => { setStep('form'); setResumeText(''); }}
                  className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-sm cursor-pointer">
                  ← Edit & Regenerate
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Free resume generated by AI on sriganganagarjobs.in
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
