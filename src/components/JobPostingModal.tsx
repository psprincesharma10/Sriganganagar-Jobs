import React, { useState } from 'react';
import { Job, Language } from '../types';
import { X, Briefcase, Info, AlertCircle, Phone, Sparkles } from 'lucide-react';

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPostJob: (jobData: Omit<Job, 'id' | 'created_at' | 'expires_at' | 'pinned'>) => void;
}

export default function JobPostingModal({
  isOpen,
  onClose,
  lang,
  onPostJob,
}: JobPostingModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [posterName, setPosterName] = useState('');
  const [errorStr, setErrorStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr('');

    if (!title.trim()) {
      setErrorStr(lang === 'en' ? 'Job title is required!' : 'कार्य का नाम डालना अनिवार्य है!');
      return;
    }

    if (!description.trim()) {
      setErrorStr(lang === 'en' ? 'Job description is required!' : 'कार्य का विवरण डालना अनिवार्य है!');
      return;
    }

    // Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorStr(lang === 'en' ? 'Please enter a valid 10-digit mobile number!' : 'कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें!');
      return;
    }

    // Since the visitor inputs once, we use the same text for both _en and _hi fields for robust display, or they can mix Hindi/English.
    onPostJob({
      job_title_en: title.trim(),
      job_title_hi: title.trim(),
      job_description_en: description.trim(),
      job_description_hi: description.trim(),
      phone: cleanPhone,
      poster_name: posterName.trim() || undefined,
      phone_hidden: false, // Default is public until changed by admin or requested
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPhone('');
    setPosterName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (WhatsApp styled top accent) */}
        <div className="bg-[#075E54] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={20} className="text-[#25D366]" />
            <h2 className="text-lg font-bold">
              {lang === 'en' ? 'Post a Local Job (Free)' : 'मुफ़्त कार्य पोस्ट करें'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Sriganganagar Header */}
          <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 flex gap-2 text-xs text-[#075E54]">
            <Sparkles size={16} className="text-[#25D366] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'en' ? 'Sri Ganganagar Local Hub' : 'श्रीगंगानगर लोकल जॉब्स'}
              </p>
              <p className="opacity-80">
                {lang === 'en' 
                  ? 'Your post will go LIVE instantly. No login, no verification required!' 
                  : 'आपका काम तुरंत लाइव हो जाएगा। कोई लॉगिन या वेरिफिकेशन की जरूरत नहीं है!'}
              </p>
            </div>
          </div>

          {/* Validation Alert */}
          {errorStr && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorStr}</span>
            </div>
          )}

          {/* Title Input */}
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {lang === 'en' ? 'Keep it short and english/hindi friendly' : 'छोटा और अंग्रेजी/हिंदी मिश्रित लिख सकते हैं'}
            </span>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Job Description' : 'कार्य का पूर्ण विवरण'} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'en' ? 'Explain duties, timing (e.g. 10 AM to 8 PM), salary offered, and exact address near Sukhadia Circle/Gol Bazar...' : 'काम के बारे में बताएं, काम का समय, वेतन और दुकान का सही पता (जैसे सुखाड़िया सर्कल के पास)...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all resize-none"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Contact Phone / Phone Number' : 'मोबाइल नंबर (कॉल हेतु)'} <span className="text-red-500">*</span>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm font-mono transition-all"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {lang === 'en' ? 'Mandatory for direct calls' : 'सीधा कॉल प्राप्त करने के लिए अनिवार्य है'}
            </span>
          </div>

          {/* Poster Name / Company Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Your Name / Shop Name (Optional)' : 'आपका / दुकान का नाम (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={posterName}
              onChange={(e) => setPosterName(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Gupta Garments, Verma Clinic...' : 'जैसे: गुप्ता गारमेंट्स, वर्मा क्लीनिक...'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#128C7E] focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              {lang === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Briefcase size={16} />
              <span>{lang === 'en' ? 'Publish Live' : 'अभी लाइव करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
