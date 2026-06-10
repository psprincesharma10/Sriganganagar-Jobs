import React from 'react';
import { X, CheckCircle, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface ServiceDetailProps {
  serviceId: string | null;
  lang: Language;
  onClose: () => void;
  onAction?: (type: string) => void;
}

const SERVICES: Record<string, any> = {
  'post-job': {
    icon: '💼',
    titleEn: 'Post Job (Free)',
    titleHi: 'जॉब पोस्ट करें (मुफ्त)',
    tagEn: 'FREE — No charges ever',
    tagHi: 'बिल्कुल मुफ्त — कोई चार्ज नहीं',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    descEn: 'Looking to hire someone for your shop, business, or home? Post your job vacancy for FREE on Sri Ganganagar\'s #1 local job board. Your job goes LIVE instantly and is visible to thousands of local job seekers.',
    descHi: 'अपनी दुकान, व्यापार या घर के लिए कोई काम करने वाला चाहिए? Sri Ganganagar के #1 लोकल जॉब बोर्ड पर अपनी vacancy बिल्कुल मुफ्त में पोस्ट करें। आपकी job तुरंत LIVE हो जाएगी।',
    features: [
      { en: 'Job goes live in seconds — no waiting', hi: 'Job सेकंडों में live — कोई इंतजार नहीं' },
      { en: 'No login or account required', hi: 'कोई login या account जरूरी नहीं' },
      { en: 'Your phone number visible to all seekers', hi: 'आपका phone number सभी को दिखेगा' },
      { en: 'Job stays active for 30 days', hi: 'Job 30 दिन तक active रहेगी' },
      { en: 'Visible to 28+ nearby cities', hi: '28+ आसपास के शहरों में दिखेगी' },
      { en: 'WhatsApp share button — spread via groups', hi: 'WhatsApp share — groups में फैलाएं' },
    ],
    howEn: ['Click "Post Job (Free)" button at top', 'Fill job title, category, description', 'Add your mobile number', 'Select your city', 'Click "Publish" — Done!'],
    howHi: ['"Post Job (Free)" बटन दबाएं', 'Job title, category, description भरें', 'अपना mobile number डालें', 'अपना शहर चुनें', '"Publish" दबाएं — हो गया!'],
    actionType: 'job',
    actionEn: 'Post Job Now — Free',
    actionHi: 'अभी Job पोस्ट करें — Free',
    actionClass: 'bg-[#25D366] hover:bg-[#20ba5a] text-slate-900',
  },
  'featured-job': {
    icon: '⭐',
    titleEn: 'Featured Job — ₹199',
    titleHi: 'फीचर्ड जॉब — ₹199',
    tagEn: 'PAID — ₹199 only',
    tagHi: 'सिर्फ ₹199',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    descEn: 'Want your job to be seen by MORE people? Featured Job puts your vacancy at the TOP of all listings with a ⭐ badge — maximum visibility for 20 days. Perfect when you need to hire FAST.',
    descHi: 'क्या आप चाहते हैं कि आपकी job ज्यादा लोग देखें? Featured Job आपकी vacancy को सभी listings के सबसे ऊपर ⭐ badge के साथ दिखाता है — 20 दिन maximum visibility।',
    features: [
      { en: 'Appears at TOP of all job listings', hi: 'सभी jobs के सबसे ऊपर दिखेगी' },
      { en: '⭐ Featured badge — stands out instantly', hi: '⭐ Featured badge — एक नज़र में पहचान' },
      { en: 'Active for 20 days', hi: '20 दिन तक active' },
      { en: 'UPI payment — QR code scan', hi: 'UPI payment — QR code scan करें' },
      { en: 'Goes live after UTR verification', hi: 'UTR verify होने पर तुरंत live' },
      { en: 'Best for urgent hiring needs', hi: 'जल्दी hire करने के लिए बेस्ट' },
    ],
    howEn: ['Click "⭐ Post Job (Featured)" button', 'Fill all job details', 'Pay ₹199 via UPI/QR code', 'Enter UTR number + upload screenshot', 'Job goes LIVE at top instantly!'],
    howHi: ['"⭐ Post Job (Featured)" बटन दबाएं', 'Job की सारी details भरें', '₹199 UPI/QR code से pay करें', 'UTR number + screenshot upload करें', 'Job तुरंत सबसे ऊपर LIVE!'],
    actionType: 'featured',
    actionEn: 'Post Featured Job — ₹199',
    actionHi: 'फीचर्ड Job पोस्ट करें — ₹199',
    actionClass: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
  },
  'business-ad': {
    icon: '📢',
    titleEn: 'Business Advertisement — ₹250+',
    titleHi: 'बिज़नेस विज्ञापन — ₹250+',
    tagEn: 'PAID — Starting ₹250',
    tagHi: '₹250 से शुरू',
    tagColor: 'bg-orange-100 text-orange-700 border-orange-200',
    descEn: 'Promote your shop, coaching center, clinic, showroom, or any local business to thousands of daily visitors on Sri Ganganagar\'s #1 job board. Your banner ad appears in the sidebar or between job listings.',
    descHi: 'अपनी दुकान, coaching center, clinic, showroom या कोई भी local business को Sri Ganganagar के #1 job board के हज़ारों daily visitors तक promote करें।',
    features: [
      { en: 'Sidebar placement — always visible', hi: 'Sidebar में — हमेशा दिखता रहे' },
      { en: 'Or between job listings — maximum reach', hi: 'या jobs के बीच में — maximum reach' },
      { en: '7 days = ₹250 | 15 days = ₹500', hi: '7 दिन = ₹250 | 15 दिन = ₹500' },
      { en: '30 days = ₹1000 | 90 days = ₹2500', hi: '30 दिन = ₹1000 | 90 दिन = ₹2500' },
      { en: 'Upload your banner image or use template', hi: 'अपना banner upload करें या template चुनें' },
      { en: 'Goes live after payment verification', hi: 'Payment verify होने पर live' },
    ],
    howEn: ['Click "Business Ad Lagao" button', 'Fill business details + upload banner', 'Choose placement: sidebar or feed', 'Select duration & pay via UPI', 'Send payment screenshot on WhatsApp → Live!'],
    howHi: ['"Business Ad Lagao" बटन दबाएं', 'Business details + banner upload करें', 'Placement चुनें: sidebar या feed', 'Duration चुनें और UPI से pay करें', 'WhatsApp पर screenshot भेजें → Live!'],
    actionType: 'ad',
    actionEn: 'Post Business Ad Now',
    actionHi: 'Business Ad लगाएं',
    actionClass: 'bg-orange-400 hover:bg-orange-500 text-white',
  },
  'website': {
    icon: '🌐',
    titleEn: 'Website Design & Development',
    titleHi: 'वेबसाइट डिज़ाइन & डेवलपमेंट',
    tagEn: 'Professional Service',
    tagHi: 'प्रोफेशनल सेवा',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    descEn: 'Get a professional website for your business, shop, clinic, school, or personal brand. Modern, mobile-friendly websites that help you reach more customers online. Contact Prince Sharma for pricing and details.',
    descHi: 'अपने business, दुकान, clinic, school या personal brand के लिए professional website बनवाएं। Modern, mobile-friendly websites जो आपको online ज्यादा customers तक पहुंचाएं।',
    features: [
      { en: 'Business websites — shop, clinic, school', hi: 'Business websites — दुकान, clinic, school' },
      { en: 'E-commerce websites — sell online', hi: 'E-commerce — online बेचें' },
      { en: 'Portfolio & personal websites', hi: 'Portfolio & personal websites' },
      { en: 'Mobile responsive design', hi: 'Mobile responsive design' },
      { en: 'Fast loading & SEO optimized', hi: 'Fast loading & SEO optimized' },
      { en: 'Domain & hosting setup included', hi: 'Domain & hosting setup included' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Discuss your requirements', 'Get quote and timeline', 'Development starts', 'Website delivered!'],
    howHi: ['WhatsApp करें: 9309352063', 'अपनी requirements बताएं', 'Quote और timeline पाएं', 'Development शुरू', 'Website मिल जाएगी!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Website — WhatsApp',
    actionHi: 'Website के लिए Contact करें',
    actionClass: 'bg-[#25D366] hover:bg-[#20ba5a] text-slate-900',
  },
  'mobile-app': {
    icon: '📱',
    titleEn: 'Mobile App Development',
    titleHi: 'Mobile App डेवलपमेंट',
    tagEn: 'Android & iOS',
    tagHi: 'Android & iOS',
    tagColor: 'bg-purple-100 text-purple-700 border-purple-200',
    descEn: 'Turn your business idea into a mobile app. Get Android and iOS apps developed for your business, service, or startup. Delivery apps, booking apps, business apps — all types available.',
    descHi: 'अपने business idea को mobile app में बदलें। Android और iOS apps बनवाएं — delivery app, booking app, business app — सभी प्रकार उपलब्ध।',
    features: [
      { en: 'Android (Play Store) apps', hi: 'Android (Play Store) apps' },
      { en: 'iOS (App Store) apps', hi: 'iOS (App Store) apps' },
      { en: 'Business & service apps', hi: 'Business & service apps' },
      { en: 'Food delivery & booking apps', hi: 'Food delivery & booking apps' },
      { en: 'E-commerce mobile apps', hi: 'E-commerce mobile apps' },
      { en: 'Custom apps as per requirement', hi: 'Requirement के अनुसार custom apps' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Share your app idea & requirements', 'Get detailed quote', 'Development & testing', 'App deployed on Play Store / App Store'],
    howHi: ['WhatsApp करें: 9309352063', 'App idea & requirements बताएं', 'Detailed quote पाएं', 'Development & testing', 'Play Store / App Store पर app launch'],
    actionType: 'whatsapp',
    actionEn: 'Contact for App Development',
    actionHi: 'App Development के लिए Contact',
    actionClass: 'bg-purple-500 hover:bg-purple-600 text-white',
  },
  'accounting': {
    icon: '🧾',
    titleEn: 'Accounting & Tally Work',
    titleHi: 'Accounting & Tally वर्क',
    tagEn: 'Professional Service',
    tagHi: 'प्रोफेशनल सेवा',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    descEn: 'Complete accounting solutions for your business. GST filing, Tally entries, ITR filing, account management — all done professionally. Save time and stay tax compliant.',
    descHi: 'आपके business के लिए complete accounting solutions। GST filing, Tally entries, ITR filing, account management — सब professionally। समय बचाएं और tax compliant रहें।',
    features: [
      { en: 'GST return filing (monthly/quarterly)', hi: 'GST return filing (monthly/quarterly)' },
      { en: 'Tally data entry & management', hi: 'Tally data entry & management' },
      { en: 'ITR (Income Tax Return) filing', hi: 'ITR (Income Tax Return) filing' },
      { en: 'Bank reconciliation', hi: 'Bank reconciliation' },
      { en: 'Balance sheet & P&L preparation', hi: 'Balance sheet & P&L preparation' },
      { en: 'Payroll management', hi: 'Payroll management' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Share your business details', 'Get monthly/yearly package quote', 'Documents handover', 'Regular accounting done!'],
    howHi: ['WhatsApp करें: 9309352063', 'Business details बताएं', 'Monthly/yearly package quote पाएं', 'Documents handover करें', 'Regular accounting हो जाएगी!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Accounting Work',
    actionHi: 'Accounting के लिए Contact करें',
    actionClass: 'bg-green-500 hover:bg-green-600 text-white',
  },
  'software': {
    icon: '💻',
    titleEn: 'Software Development',
    titleHi: 'Software डेवलपमेंट',
    tagEn: 'Custom Software',
    tagHi: 'Custom Software',
    tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
    descEn: 'Get custom software built for your business needs. Billing software, inventory management, school management, hospital management — any software as per your requirements.',
    descHi: 'आपके business के लिए custom software बनवाएं। Billing software, inventory management, school management, hospital management — कोई भी software आपकी requirement के अनुसार।',
    features: [
      { en: 'Billing & invoicing software', hi: 'Billing & invoicing software' },
      { en: 'Inventory management system', hi: 'Inventory management system' },
      { en: 'School/college management software', hi: 'School/college management software' },
      { en: 'Hospital/clinic management', hi: 'Hospital/clinic management' },
      { en: 'ERP & CRM solutions', hi: 'ERP & CRM solutions' },
      { en: 'Any custom software requirement', hi: 'कोई भी custom software requirement' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Explain your software requirements', 'Get detailed proposal & cost', 'Development & testing phase', 'Software delivered & trained!'],
    howHi: ['WhatsApp करें: 9309352063', 'Software requirements explain करें', 'Detailed proposal & cost पाएं', 'Development & testing phase', 'Software deliver & training!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Software Development',
    actionHi: 'Software Development के लिए Contact',
    actionClass: 'bg-slate-800 hover:bg-slate-700 text-white',
  },
  'document': {
    icon: '📄',
    titleEn: 'Document & Form Work',
    titleHi: 'Document & Form वर्क',
    tagEn: 'Quick Service',
    tagHi: 'जल्दी सेवा',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    descEn: 'Need help with government forms, documents, or certificates? Get all your document and form filling work done professionally. Affidavits, applications, certificates — all types handled.',
    descHi: 'सरकारी forms, documents या certificates में मदद चाहिए? अपना सारा document और form filling का काम professionally करवाएं। Affidavit, application, certificate — सब handled।',
    features: [
      { en: 'Government form filling (online/offline)', hi: 'Government form filling (online/offline)' },
      { en: 'Affidavit & notary work', hi: 'Affidavit & notary work' },
      { en: 'Birth/death certificate applications', hi: 'Birth/death certificate applications' },
      { en: 'Job application forms', hi: 'Job application forms' },
      { en: 'College & school admission forms', hi: 'College & school admission forms' },
      { en: 'Passport, Aadhaar, PAN related work', hi: 'Passport, Aadhaar, PAN related work' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Tell which form/document needed', 'Bring required documents', 'Work done professionally', 'Document ready!'],
    howHi: ['WhatsApp करें: 9309352063', 'बताएं कौन सा form/document चाहिए', 'Required documents लाएं', 'Professional काम हो जाएगा', 'Document तैयार!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Document Work',
    actionHi: 'Document Work के लिए Contact',
    actionClass: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  'freelance': {
    icon: '🎯',
    titleEn: 'Freelance Work',
    titleHi: 'Freelance वर्क',
    tagEn: 'Available for hire',
    tagHi: 'काम के लिए उपलब्ध',
    tagColor: 'bg-teal-100 text-teal-700 border-teal-200',
    descEn: 'Need digital work done? Data entry, typing, content writing, Excel work, online research, or any other digital task — contact for quick and professional freelance services.',
    descHi: 'Digital काम करवाना है? Data entry, typing, content writing, Excel work, online research, या कोई भी digital task — quick और professional freelance services के लिए contact करें।',
    features: [
      { en: 'Data entry & Excel work', hi: 'Data entry & Excel work' },
      { en: 'Typing work (Hindi & English)', hi: 'Typing work (Hindi & English)' },
      { en: 'Content writing & copywriting', hi: 'Content writing & copywriting' },
      { en: 'Online research & data collection', hi: 'Online research & data collection' },
      { en: 'PDF to Word/Excel conversion', hi: 'PDF to Word/Excel conversion' },
      { en: 'Any other digital work', hi: 'कोई भी digital work' },
    ],
    howEn: ['Contact via WhatsApp: 9309352063', 'Describe your work requirement', 'Get quote based on work volume', 'Work starts immediately', 'Delivered on time!'],
    howHi: ['WhatsApp करें: 9309352063', 'काम की requirement describe करें', 'Work volume के आधार पर quote पाएं', 'काम तुरंत शुरू', 'समय पर deliver!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Freelance Work',
    actionHi: 'Freelance Work के लिए Contact',
    actionClass: 'bg-teal-500 hover:bg-teal-600 text-white',
  },
};

export default function ServiceDetailPage({ serviceId, lang, onClose, onAction }: ServiceDetailProps) {
  if (!serviceId) return null;
  const svc = SERVICES[serviceId];
  if (!svc) return null;

  const handleAction = () => {
    if (svc.actionType === 'whatsapp') {
      const msg = encodeURIComponent('Namaste Prince Sharma Ji!\n\nMujhe ' + (lang === 'en' ? svc.titleEn : svc.titleHi) + ' service ke baare mein jaankari chahiye.\n\nPlease contact karein.');
      window.open('https://wa.me/919309352063?text=' + msg, '_blank');
    } else if (onAction) {
      onAction(svc.actionType);
      onClose();
    }
  };

  const howSteps = lang === 'en' ? svc.howEn : svc.howHi;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{svc.icon}</span>
            <div>
              <h2 className="font-black text-slate-900 text-base leading-tight">
                {lang === 'en' ? svc.titleEn : svc.titleHi}
              </h2>
              <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + svc.tagColor}>
                {lang === 'en' ? svc.tagEn : svc.tagHi}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer flex-shrink-0">
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'en' ? svc.descEn : svc.descHi}
          </p>

          {/* Features */}
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              {lang === 'en' ? '✅ What You Get' : '✅ आपको क्या मिलेगा'}
            </h3>
            <div className="space-y-2">
              {svc.features.map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-3">
                  <CheckCircle size={14} className="text-[#25D366] flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">
                    {lang === 'en' ? f.en : f.hi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              {lang === 'en' ? '📋 How It Works' : '📋 कैसे काम करता है'}
            </h3>
            <div className="space-y-2">
              {howSteps.map((step: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="min-w-6 h-6 bg-[#075E54] text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-600 leading-relaxed">{step}</span>
                  {i < howSteps.length - 1 && <ArrowRight size={10} className="text-slate-300 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Contact info for non-job services */}
          {svc.actionType === 'whatsapp' && (
            <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-4">
              <p className="text-xs font-black text-[#075E54] mb-2">
                {lang === 'en' ? '📞 Contact Details' : '📞 संपर्क विवरण'}
              </p>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MessageSquare size={12} className="text-[#25D366]" />
                  <span className="font-bold">WhatsApp: +91-9309352063</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-[#075E54]" />
                  <span>Prince Sharma — Sri Ganganagar</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={handleAction}
            className={'w-full py-3.5 rounded-2xl font-black text-sm cursor-pointer transition-colors ' + svc.actionClass}>
            {lang === 'en' ? svc.actionEn : svc.actionHi}
          </button>
        </div>
      </div>
    </div>
  );
}
