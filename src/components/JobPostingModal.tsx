import React, { useState } from 'react';
import { Job, Language } from '../types';
import { X, Briefcase, AlertCircle, Phone, Sparkles } from 'lucide-react';

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPostJob: (jobData: Omit<Job, 'id' | 'created_at' | 'expires_at' | 'pinned'>) => void;
}

const JOB_CATEGORIES = [
  { en: 'Full Time', hi: 'फुल टाइम' },
  { en: 'Part Time', hi: 'पार्ट टाइम' },
  { en: 'Freelance', hi: 'फ्रीलांस' },
  { en: 'Daily Worker', hi: 'दैनिक मजदूर' },
  { en: 'Other', hi: 'अन्य' },
];

const CITY_LIST = [
  'Sri Ganganagar', 'Hanumangarh', 'Suratgarh', 'Raisinghnagar', 'Padampur',
  'Gharsana', 'Gajsinghpur', 'Karanpur', 'Keshrisinghpur', 'Sangaria',
  'Sadulsahar', 'Vijaynagar', 'Jaitsar', 'Abohar', 'Anupgarh', 'Rawatsar',
  'Nohar', 'Bhadra', 'Pilibanga', 'Tibi', 'Lalgarh Jattan', 'Sherewala',
  'Anoopgarh', 'Ridhi Sidhi', 'Gol Bazar', 'Meera Chowk', 'Padampur Road',
  'Other',
];

export default function JobPostingModal({
  isOpen,
  onClose,
  lang,
  onPostJob,
}: JobPostingModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [posterName, setPosterName] = useState('');
  const [city, setCity] = useState('Sri Ganganagar');
  const [salary, setSalary] = useState('');
  const [errorStr, setErrorStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr('');

    if (!title.trim()) {
      setErrorStr(lang === 'en' ? 'Job title is required!' : 'कार्य का नाम डालना अनिवार्य है!');
      return;
    }
    if (!category) {
      setErrorStr(lang === 'en' ? 'Please select a job category!' : 'कृपया जॉब की श्रेणी चुनें!');
      return;
    }
    if (!description.trim()) {
      setErrorStr(lang === 'en' ? 'Job description is required!' : 'कार्य का विवरण डालना अनिवार्य है!');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorStr(lang === 'en' ? 'Please enter a valid 10-digit mobile number!' : 'कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें!');
      return;
    }

    const fullTitle = `${title.trim()} (${category})`;
    const descWithCity = `📍 ${city}\n${description.trim()}${salary ? '\n💰 Salary: ₹' + salary : ''}`;

    onPostJob({
      job_title_en: fullTitle,
      job_title_hi: fullTitle,
      job_description_en: descWithCity,
      job_description_hi: descWithCity,
      phone: cleanPhone,
      poster_name: posterName.trim() || undefined,
      phone_hidden: false,
    } as any);

    setTitle('');
    setCategory('');
    setDescription('');
    setPhone('');
    setPosterName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-[#075E54] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-[#25D366]" />
            <h2 className="text-lg font-bold">
              {lang === 'en' ? 'Post a Local Job (Free)' : 'मुफ़्त कार्य पोस्ट करें'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

          <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 flex gap-2 text-xs text-[#075E54]">
            <Sparkles size={16} className="text-[#25D366] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'en' ? 'Sri Ganganagar Local Hub' : 'श्रीगंगानगर लोकल जॉब्स'}
              </p>
              <p className="opacity-80">
                {lang === 'en'
                  ? 'Your post will go LIVE instantly. No login required!'
                  : 'आपका काम तुरंत लाइव हो जाएगा। कोई लॉगिन जरूरी नहीं!'}
              </p>
            </div>
          </div>

          {errorStr && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorStr}</span>
            </div>
          )}

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Job Title' : 'कार्य / नौकरी का नाम'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Shop Helper, Security Guard...' : 'जैसे: दुकान का हेल्पर, गार्ड की जरूरत...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Job Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Job Category' : 'जॉब की श्रेणी'} <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all bg-white cursor-pointer"
            >
              <option value="">{lang === 'en' ? '-- Select Category --' : '-- श्रेणी चुनें --'}</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat.en} value={cat.en}>
                  {lang === 'en' ? cat.en : cat.hi}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Job Description' : 'कार्य का पूर्ण विवरण'} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'en' ? 'Explain duties, timing (e.g. 10 AM to 8 PM), salary, and address...' : 'काम के बारे में बताएं, समय, वेतन और दुकान का पता...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all resize-none"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Salary / Wages (Optional)' : 'वेतन / मजदूरी (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. 8000-12000/month or 500/day' : 'जैसे: 8000-12000/महीना या 500/दिन'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Contact Phone Number' : 'मोबाइल नंबर (कॉल हेतु)'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g., 94143XXXXX"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm font-mono transition-all"
              />
            </div>
          </div>

          {/* Poster Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Your Name / Shop Name (Optional)' : 'आपका / दुकान का नाम (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={posterName}
              onChange={(e) => setPosterName(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Gupta Garments, Verma Clinic...' : 'जैसे: गुप्ता गारमेंट्स, वर्मा क्लीनिक...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'City / Location' : 'शहर / स्थान'} <span className="text-red-500">*</span>
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all bg-white cursor-pointer"
            >
              {CITY_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer text-center">
              {lang === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            <button type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center">
              <Briefcase size={16} />
              <span>{lang === 'en' ? 'Publish Live' : 'अभी लाइव करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
