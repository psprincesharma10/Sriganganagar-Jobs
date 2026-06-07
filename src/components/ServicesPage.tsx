import React from 'react';
import { X, Briefcase, Star, Megaphone, FileText, Target, CheckCircle, Phone } from 'lucide-react';
import { Language } from '../types';

interface ServicesPageProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenModal: (type: 'job' | 'featured' | 'ad' | 'resume' | 'interview') => void;
}

export default function ServicesPage({ isOpen, onClose, lang, onOpenModal }: ServicesPageProps) {
  if (!isOpen) return null;

  const services = [
    {
      icon: <Briefcase size={24} className="text-[#25D366]" />,
      bg: 'bg-[#eefaf7]',
      border: 'border-[#128C7E]/20',
      badge: lang === 'en' ? 'FREE' : 'मुफ्त',
      badgeColor: 'bg-green-100 text-green-700',
      title: lang === 'en' ? 'Post Job (Free)' : 'जॉब पोस्ट करें (मुफ्त)',
      desc: lang === 'en'
        ? 'Post your job vacancy instantly. Visible to all visitors. Direct phone calls — no middleman. Job stays live for 30 days.'
        : 'अपनी job vacancy तुरंत post करें। सभी visitors को दिखेगी। सीधा फोन कॉल — कोई बिचौलिया नहीं। 30 दिन live रहेगी।',
      features: ['30 din live', 'Direct call', 'Turant visible', 'No login'],
      price: 'FREE',
      action: () => onOpenModal('job'),
      actionLabel: lang === 'en' ? 'Post Now' : 'अभी पोस्ट करें',
      actionClass: 'bg-[#25D366] hover:bg-[#20ba5a] text-slate-900',
    },
    {
      icon: <Star size={24} className="text-amber-500 fill-amber-400" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: lang === 'en' ? 'PAID' : 'पेड',
      badgeColor: 'bg-amber-100 text-amber-700',
      title: lang === 'en' ? '⭐ Featured Job' : '⭐ फीचर्ड जॉब',
      desc: lang === 'en'
        ? 'Your job appears at the TOP of all listings with a ⭐ Featured badge. Maximum visibility for 20 days. Perfect for urgent hiring.'
        : 'आपकी job सभी listings में सबसे ऊपर ⭐ Featured badge के साथ दिखेगी। 20 दिन maximum visibility।',
      features: ['Top pe dikhegi', '⭐ Featured badge', '20 din live', 'Maximum reach'],
      price: '₹199',
      action: () => onOpenModal('featured'),
      actionLabel: lang === 'en' ? 'Post Featured Job' : 'फीचर्ड जॉब पोस्ट करें',
      actionClass: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
    },
    {
      icon: <Megaphone size={24} className="text-orange-500" />,
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: lang === 'en' ? 'PAID' : 'पेड',
      badgeColor: 'bg-orange-100 text-orange-700',
      title: lang === 'en' ? '📢 Business Advertisement' : '📢 बिज़नेस विज्ञापन',
      desc: lang === 'en'
        ? 'Promote your shop, coaching, clinic or any business to thousands of local visitors. Choose sidebar or job feed placement.'
        : 'अपनी दुकान, coaching, clinic या business को हज़ारों local visitors तक promote करें।',
      features: ['Sidebar ya feed', 'Image banner', '7-90 din', 'UPI payment'],
      price: '₹250 se',
      action: () => onOpenModal('ad'),
      actionLabel: lang === 'en' ? 'Post Business Ad' : 'बिज़नेस Ad लगाएं',
      actionClass: 'bg-orange-400 hover:bg-orange-500 text-white',
    },
    {
      icon: <FileText size={24} className="text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: lang === 'en' ? 'FREE' : 'मुफ्त',
      badgeColor: 'bg-blue-100 text-blue-700',
      title: lang === 'en' ? '📄 Free Resume Builder' : '📄 मुफ्त Resume Builder',
      desc: lang === 'en'
        ? 'Build a professional resume in 2 minutes using AI. Choose from 23+ job roles. Download as PDF or share on WhatsApp.'
        : 'AI से 2 मिनट में professional resume बनाएं। 23+ job roles। PDF download या WhatsApp share करें।',
      features: ['AI powered', '23+ job roles', 'PDF download', 'WhatsApp share'],
      price: 'FREE',
      action: () => onOpenModal('resume'),
      actionLabel: lang === 'en' ? 'Build Resume' : 'Resume बनाएं',
      actionClass: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    {
      icon: <Target size={24} className="text-purple-500" />,
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: lang === 'en' ? 'FREE' : 'मुफ्त',
      badgeColor: 'bg-purple-100 text-purple-700',
      title: lang === 'en' ? '🎯 Interview Prep Tool' : '🎯 इंटरव्यू तैयारी',
      desc: lang === 'en'
        ? 'Get 15 AI-generated interview questions for any job role. Prepare confidently before your interview in Sri Ganganagar.'
        : 'किसी भी job के लिए AI से 15 interview questions पाएं। interview से पहले confident बनें।',
      features: ['15 questions', 'Job specific', 'Hindi+English', 'AI powered'],
      price: 'FREE',
      action: () => onOpenModal('interview'),
      actionLabel: lang === 'en' ? 'Prepare Now' : 'तैयारी करें',
      actionClass: 'bg-purple-500 hover:bg-purple-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-black text-slate-900 text-base">
              {lang === 'en' ? '🛠️ Our Services' : '🛠️ हमारी सेवाएं'}
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'en' ? 'Everything you need for jobs in Sri Ganganagar' : 'Sri Ganganagar में jobs के लिए सब कुछ'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {services.map((svc, i) => (
            <div key={i} className={`rounded-2xl border-2 ${svc.border} ${svc.bg} p-5`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    {svc.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-black text-slate-900 text-sm">{svc.title}</h3>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${svc.badgeColor}`}>
                        {svc.badge}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{svc.price}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{svc.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {svc.features.map((f, j) => (
                  <span key={j} className="flex items-center gap-1 text-[10px] font-bold bg-white/70 text-slate-600 px-2 py-1 rounded-lg border border-white">
                    <CheckCircle size={9} className="text-[#25D366]" />{f}
                  </span>
                ))}
              </div>

              <button onClick={svc.action}
                className={`w-full py-2.5 rounded-xl font-black text-sm cursor-pointer transition-colors ${svc.actionClass}`}>
                {svc.actionLabel}
              </button>
            </div>
          ))}

          {/* Contact */}
          <div className="bg-slate-800 rounded-2xl p-5 text-center">
            <p className="text-white font-black mb-1">
              {lang === 'en' ? '📞 Need Help?' : '📞 मदद चाहिए?'}
            </p>
            <p className="text-slate-400 text-xs mb-3">
              {lang === 'en' ? 'Contact us directly for any query' : 'किसी भी सवाल के लिए directly contact करें'}
            </p>
            <a href="https://wa.me/919309352063" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-slate-900 font-black rounded-xl text-xs cursor-pointer">
              <Phone size={13} />WhatsApp: +91-9309352063
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
