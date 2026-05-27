import React, { useState } from 'react';
import { Job, Language } from '../types';
import { X, Sparkles, Key, Phone, Check, CreditCard, Loader2 } from 'lucide-react';

interface UnlockModalProps {
  isOpen: boolean;
  job: Job | null;
  lang: Language;
  onClose: () => void;
  onUnlockSuccess: (jobId: string) => void;
}

export default function UnlockModal({
  isOpen,
  job,
  lang,
  onClose,
  onUnlockSuccess,
}: UnlockModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !job) return null;

  const handleUnlockDemo = () => {
    setIsProcessing(true);
    // Simulate UPI Payment loading
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onUnlockSuccess(job.id);
        setIsDone(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  const title = lang === 'en' ? job.job_title_en : job.job_title_hi;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#075E54] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-amber-400" />
            <h2 className="text-base font-bold">
              {lang === 'en' ? 'Unlock Contact Number' : 'मोबाइल नंबर अनलॉक करें'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          
          {isDone ? (
            <div className="py-8 space-y-3 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <Check size={36} strokeWidth={3} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">
                {lang === 'en' ? 'Number Unlocked!' : 'नंबर अनलॉक हो गया!'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'en' ? 'Contact details are now visible on the card.' : 'नियोक्ता का संपर्क अब कार्ड पर दिखाई दे रहा है।'}
              </p>
            </div>
          ) : isProcessing ? (
            <div className="py-8 space-y-4 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#128C7E]" size={42} />
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'en' ? 'Securing Connection via UPI...' : 'यूपीआई द्वारा भुगतान सत्यापित हो रहा है...'}
              </h3>
              <p className="text-xs text-slate-500 animate-pulse">
                {lang === 'en' ? 'Please wait a moment...' : 'कृपया कुछ सेकंड प्रतीक्षा करें...'}
              </p>
            </div>
          ) : (
            <>
              {/* Job Info */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {lang === 'en' ? 'Selected Vacancy' : 'चयनित नौकरी'}
                </span>
                <h4 className="font-bold text-slate-900 line-clamp-1">{title}</h4>
                {job.poster_name && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">@{job.poster_name}</p>
                )}
                
                <div className="mt-3 flex items-center gap-2 justify-between bg-white px-3 py-2 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-600 font-mono">
                    {job.phone.substring(0, 5)}XXXXX
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded uppercase">
                    {lang === 'en' ? '🔒 Locked' : '🔒 लॉक है'}
                  </span>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-600 leading-relaxed text-left">
                {lang === 'en' 
                  ? 'The employer chose to limit direct calls to prevent spam. Unlock this contact to reveal the full phone number and make an instant call.' 
                  : 'स्पैम से बचने के लिए नियोक्ता ने सीधा कॉल सीमित किया है। पूरा मोबाइल नंबर देखने और तुरंत कॉल करने के लिए संपर्क अनलॉक करें।'}
              </p>

              {/* Unlock Selection */}
              <div className="space-y-2.5 pt-2">
                
                {/* UPI Demo Unlock */}
                <button
                  onClick={handleUnlockDemo}
                  className="w-full py-3 px-4 rounded-xl border-2 border-[#128C7E] bg-white text-[#075E54] hover:bg-[#eefaf7] font-bold text-sm tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard size={16} />
                  <span>
                    {lang === 'en' ? 'Unlock Instantly (Demo: ₹49)' : 'तुरंत अनलॉक करें (डेमो: ₹49)'}
                  </span>
                </button>

                {/* WhatsApp Admin Alternative */}
                <div className="p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] font-bold text-[#075E54] block">
                      {lang === 'en' ? 'All-Access Unlimited Key' : 'सब्सक्रिप्शन (सभी नंबर देखें)'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {lang === 'en' ? 'Reveal all jobs for 30 days.' : '30 दिनों के लिए सभी नंबर अनलॉक करें।'}
                    </span>
                  </div>
                  <a
                    href="tel:9414321098"
                    className="p-2 bg-[#25D366] text-white hover:bg-[#20ba5a] rounded-xl transition-all flex items-center gap-1 text-[11px] font-extrabold"
                  >
                    <Phone size={12} />
                    <span>Call Admin</span>
                  </a>
                </div>

              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
