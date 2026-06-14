import React from 'react';
import { X, CheckCircle, Phone, MessageSquare } from 'lucide-react';
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
    tagHi: 'बिल्कुल मुफ्त',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    descEn: 'Sri Ganganagar Jobs par apni vacancy bilkul FREE mein post karein. Job goes LIVE instantly and is visible to thousands of local job seekers across 28+ cities. No login, no account, no fees — ever.',
    descHi: 'Sri Ganganagar Jobs par apni vacancy bilkul मुफ्त में post karein। Job तुरंत LIVE ho jaati hai aur 28+ cities ke हज़ारों job seekers को dikh jaati hai। Koi login nahi, koi fees nahi।',
    features: [
      { en: 'Instant Job Publishing — goes live in seconds', hi: 'तुरंत Job Publish — seconds में live' },
      { en: '30 Days Visibility — active for full month', hi: '30 दिन Visibility — पूरे महीने active' },
      { en: 'Full Time, Part Time, Freelance, Contract jobs', hi: 'Full Time, Part Time, Freelance, Contract jobs' },
      { en: 'Your phone number visible to all candidates', hi: 'आपका phone number सभी candidates को दिखेगा' },
      { en: 'Reach 28+ nearby cities — Hanumangarh, Suratgarh & more', hi: '28+ शहरों तक पहुंच — Hanumangarh, Suratgarh आदि' },
      { en: 'WhatsApp share button — spread via local groups', hi: 'WhatsApp share button — local groups में फैलाएं' },
      { en: 'No login or registration required', hi: 'कोई login या registration जरूरी नहीं' },
      { en: 'Employer and candidate connect directly', hi: 'Employer और candidate directly connect करें' },
    ],
    howEn: ['Click "Post Job (Free)" button at the top', 'Fill job title, category and description', 'Add your 10-digit mobile number', 'Select city and salary range (optional)', 'Click Publish — Job is LIVE!'],
    howHi: ['ऊपर "Post Job (Free)" button dabayein', 'Job title, category aur description bharein', 'Apna 10-digit mobile number dalein', 'City aur salary range chunein (optional)', 'Publish dabayein — Job LIVE!'],
    actionType: 'job',
    actionEn: 'Post Job Now — Free',
    actionHi: 'अभी Job पोस्ट करें — Free',
    actionClass: 'bg-[#25D366] hover:bg-[#20ba5a] text-slate-900',
  },

  'featured-job': {
    icon: '⭐',
    titleEn: 'Featured Job Listing — ₹199',
    titleHi: 'Featured Job Listing — ₹199',
    tagEn: 'PAID — Only ₹199',
    tagHi: 'सिर्फ ₹199',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    descEn: 'Apni Job Vacancy ko zyada logon tak pahunchane ke liye Featured Job Service ka upyog karein. Aapki job sabhi listings ke SABSE UPAR ⭐ badge ke saath dikhegi — maximum visibility 20 days tak. Jab aapko jaldi hire karna ho tab yahi best option hai.',
    descHi: 'अपनी Job Vacancy को ज्यादा लोगों तक पहुंचाने के लिए Featured Job Service का उपयोग करें। आपकी job सभी listings के सबसे ऊपर ⭐ badge के साथ दिखेगी — 20 दिन maximum visibility। जल्दी hire करने के लिए best option।',
    features: [
      { en: 'Homepage Highlight — appears at very TOP', hi: 'Homepage Highlight — सबसे ऊपर दिखेगी' },
      { en: '⭐ Featured Badge — stands out instantly', hi: '⭐ Featured Badge — एक नज़र में पहचान' },
      { en: 'Priority Display — above all free jobs', hi: 'Priority Display — सभी free jobs से ऊपर' },
      { en: 'More Visibility — more candidates see it', hi: 'More Visibility — ज्यादा candidates देखेंगे' },
      { en: 'More Applications — faster response', hi: 'More Applications — जल्दी response' },
      { en: 'Trusted Appearance — verified looking', hi: 'Trusted Appearance — verified look' },
      { en: 'Active for 20 days', hi: '20 दिन तक active' },
      { en: 'Faster Hiring — best for urgent needs', hi: 'Faster Hiring — urgent requirement के लिए best' },
    ],
    howEn: ['Click "⭐ Post Job (Featured)" button at top', 'Fill all job details carefully', 'Pay ₹199 via UPI — scan QR code', 'Enter UTR number and upload payment screenshot', 'Job goes LIVE at TOP instantly!'],
    howHi: ['ऊपर "⭐ Post Job (Featured)" button dabayein', 'Saari job details carefully bharein', '₹199 UPI se pay karein — QR code scan karein', 'UTR number dalein aur payment screenshot upload karein', 'Job turant sabse oopar LIVE!'],
    actionType: 'featured',
    actionEn: 'Post Featured Job — ₹199',
    actionHi: 'Featured Job पोस्ट करें — ₹199',
    actionClass: 'bg-amber-400 hover:bg-amber-500 text-slate-900',
  },

  'business-ad': {
    icon: '📢',
    titleEn: 'Business Advertisement — ₹250+',
    titleHi: 'Business Advertisement — ₹250+',
    tagEn: 'Starting ₹250',
    tagHi: '₹250 से शुरू',
    tagColor: 'bg-orange-100 text-orange-700 border-orange-200',
    descEn: 'Apne Business, Shop, Service, Institute ya Brand ko Sri Ganganagar aur aaspaas ke ilakon mein promote karein. Hamaari website par daily hazaron local visitors aate hain — apna banner ad sidebar mein ya jobs ke beech mein dikhayein.',
    descHi: 'अपने Business, Shop, Service, Institute या Brand को Sri Ganganagar और आसपास के क्षेत्रों में promote करें। हमारी website पर daily हज़ारों local visitors आते हैं — अपना banner ad sidebar में या jobs के बीच में दिखाएं।',
    features: [
      { en: 'Website Promotion — reach thousands daily', hi: 'Website Promotion — daily हज़ारों तक पहुंचें' },
      { en: 'Featured Business Listing in sidebar', hi: 'Featured Business Listing sidebar में' },
      { en: 'Job Feed Placement — between listings', hi: 'Job Feed Placement — listings के बीच' },
      { en: 'Local Business Visibility boost', hi: 'Local Business Visibility boost' },
      { en: 'Brand Awareness in Sri Ganganagar area', hi: 'Sri Ganganagar area में Brand Awareness' },
      { en: '7 days = ₹250 | 15 days = ₹500', hi: '7 दिन = ₹250 | 15 दिन = ₹500' },
      { en: '30 days = ₹1000 | 90 days = ₹2500', hi: '30 दिन = ₹1000 | 90 दिन = ₹2500' },
      { en: 'Upload your banner or use our template', hi: 'अपना banner upload करें या template चुनें' },
    ],
    howEn: ['Click "Business Ad Lagao" button', 'Fill business name, description and contact', 'Upload your banner image or select template', 'Choose placement: sidebar or job feed', 'Pay via UPI and send screenshot on WhatsApp → LIVE!'],
    howHi: ['"Business Ad Lagao" button dabayein', 'Business name, description aur contact bharein', 'Banner image upload karein ya template chunein', 'Placement chunein: sidebar ya job feed', 'UPI se pay karein aur WhatsApp pe screenshot bhejein → LIVE!'],
    actionType: 'ad',
    actionEn: 'Post Business Ad Now',
    actionHi: 'Business Ad लगाएं अभी',
    actionClass: 'bg-orange-400 hover:bg-orange-500 text-white',
  },

  'website': {
    icon: '🌐',
    titleEn: 'Website Design & Development',
    titleHi: 'Website Design & Development',
    tagEn: 'Professional Service',
    tagHi: 'Professional Service',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    descEn: 'Hum aapke Business, Shop, School, College, Coaching Institute, Hospital, Clinic, NGO, Factory, Hotel, Restaurant aur kisi bhi organization ke liye aadhunik evam professional website banate hain. Apne Business ko online le jaayein aur Google par apni pehchaan banayein.',
    descHi: 'हम आपके Business, Shop, School, College, Coaching Institute, Hospital, Clinic, NGO, Factory, Hotel, Restaurant और अन्य किसी भी संगठन के लिए आधुनिक एवं Professional Website बनाते हैं। अपने Business को Online ले जाएं और Google पर अपनी पहचान बनाएं।',
    features: [
      { en: 'Business Website — shop, firm, agency', hi: 'Business Website — दुकान, firm, agency' },
      { en: 'School & College Website', hi: 'School & College Website' },
      { en: 'E-commerce Website — sell products online', hi: 'E-commerce Website — products online बेचें' },
      { en: 'Hospital & Clinic Website', hi: 'Hospital & Clinic Website' },
      { en: 'Coaching Institute & NGO Website', hi: 'Coaching Institute & NGO Website' },
      { en: 'Personal Portfolio Website', hi: 'Personal Portfolio Website' },
      { en: 'Landing Pages for promotion', hi: 'Landing Pages for promotion' },
      { en: 'Domain & Hosting Setup included', hi: 'Domain & Hosting Setup included' },
      { en: 'Mobile Friendly Design', hi: 'Mobile Friendly Design' },
      { en: 'SEO Optimization for Google ranking', hi: 'Google ranking के लिए SEO Optimization' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Share your business type and requirements', 'Get custom quote and timeline', 'Design approval and development starts', 'Website delivered and launched!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'Business type aur requirements batayein', 'Custom quote aur timeline paayen', 'Design approval aur development shuru', 'Website deliver aur launch!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Website — WhatsApp',
    actionHi: 'Website के लिए Contact करें',
    actionClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },

  'mobile-app': {
    icon: '📱',
    titleEn: 'Mobile App Development',
    titleHi: 'Mobile App Development',
    tagEn: 'Android & iOS',
    tagHi: 'Android & iOS',
    tagColor: 'bg-purple-100 text-purple-700 border-purple-200',
    descEn: 'Hum Business, School, College, Coaching, Hospital aur Startups ke liye Mobile Applications develop karte hain. Apne Business ko Mobile Users tak pahunchane ke liye Professional Mobile App Solutions prapt karein.',
    descHi: 'हम Business, School, College, Coaching, Hospital और Startups के लिए Mobile Applications विकसित करते हैं। अपने Business को Mobile Users तक पहुंचाने के लिए Professional Mobile App Solutions प्राप्त करें।',
    features: [
      { en: 'Android App Development (Play Store)', hi: 'Android App Development (Play Store)' },
      { en: 'iOS App Development (App Store)', hi: 'iOS App Development (App Store)' },
      { en: 'Business Apps — orders, bookings, services', hi: 'Business Apps — orders, bookings, services' },
      { en: 'E-commerce Apps — sell products via app', hi: 'E-commerce Apps — app se products बेचें' },
      { en: 'Education Apps — school, coaching, courses', hi: 'Education Apps — school, coaching, courses' },
      { en: 'Healthcare Apps — clinic, hospital', hi: 'Healthcare Apps — clinic, hospital' },
      { en: 'Job Portal Apps', hi: 'Job Portal Apps' },
      { en: 'App Maintenance & Regular Updates', hi: 'App Maintenance & Regular Updates' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Share your app idea and requirements', 'Get detailed quote and development plan', 'Development, testing and review phase', 'App launched on Play Store / App Store!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'App idea aur requirements share karein', 'Detailed quote aur development plan paayen', 'Development, testing aur review phase', 'App Play Store / App Store par launch!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for App Development',
    actionHi: 'App Development के लिए Contact',
    actionClass: 'bg-purple-600 hover:bg-purple-700 text-white',
  },

  'accounting': {
    icon: '🧾',
    titleEn: 'Accounting & Tally Services',
    titleHi: 'Accounting & Tally Services',
    tagEn: 'Full Time & Part Time',
    tagHi: 'Full Time & Part Time उपलब्ध',
    tagColor: 'bg-green-100 text-green-700 border-green-200',
    descEn: 'Hum aapke Business, Shop, School, College, Institution, Firm aur anya sangathanon ke liye Accounting evam Tally Services pradan karte hain. Agar aapke paas Accountant rakhne ka budget nahi hai, to hum Remote Accounting Services bhi upalabdh karate hain — Full Time ya Part Time dono options available hain.',
    descHi: 'हम आपके Business, Shop, School, College, Institution, Firm और अन्य संगठनों के लिए Accounting एवं Tally Services प्रदान करते हैं। यदि आपके पास Accountant रखने का budget नहीं है, तो हम Remote Accounting Services भी उपलब्ध कराते हैं — Full Time या Part Time दोनों options available हैं।',
    features: [
      { en: 'Tally Data Entry — accurate and timely', hi: 'Tally Data Entry — accurate और timely' },
      { en: 'GST Accounting Support — monthly/quarterly filing', hi: 'GST Accounting Support — monthly/quarterly filing' },
      { en: 'Book Keeping — for all business types', hi: 'Book Keeping — सभी business types के लिए' },
      { en: 'Sales & Purchase Entry', hi: 'Sales & Purchase Entry' },
      { en: 'Bank Reconciliation', hi: 'Bank Reconciliation' },
      { en: 'Profit & Loss Reports preparation', hi: 'Profit & Loss Reports preparation' },
      { en: 'Inventory Management in Tally', hi: 'Inventory Management in Tally' },
      { en: 'Monthly Accounting Support package', hi: 'Monthly Accounting Support package' },
      { en: 'Full Time & Part Time options available', hi: 'Full Time & Part Time options available' },
      { en: 'Remote Accounting Services also available', hi: 'Remote Accounting Services भी available' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Share your business type and accounting needs', 'Choose Full Time / Part Time / Remote package', 'Get monthly/yearly quote', 'Accounting work starts!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'Business type aur accounting needs batayein', 'Full Time / Part Time / Remote package chunein', 'Monthly/yearly quote paayen', 'Accounting kaam shuru!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Accounting Services',
    actionHi: 'Accounting के लिए Contact करें',
    actionClass: 'bg-green-600 hover:bg-green-700 text-white',
  },

  'software': {
    icon: '💻',
    titleEn: 'Custom Software Development',
    titleHi: 'Custom Software Development',
    tagEn: 'Any Business Software',
    tagHi: 'किसी भी Business के लिए',
    tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
    descEn: 'Hum aapke Business ki aavashyakta ke anusar Custom Software banate hain. Aapke Business Process ko aasan, tez aur Digital banane mein sahayata karte hain — billing se lekar employee management tak sab kuch.',
    descHi: 'हम आपके Business की आवश्यकता के अनुसार Custom Software बनाते हैं। आपके Business Process को आसान, तेज और Digital बनाने में सहायता करते हैं — billing से लेकर employee management तक सब कुछ।',
    features: [
      { en: 'Billing Software — invoices, receipts', hi: 'Billing Software — invoices, receipts' },
      { en: 'Inventory Management Software', hi: 'Inventory Management Software' },
      { en: 'School Management Software', hi: 'School Management Software' },
      { en: 'Hospital Management Software', hi: 'Hospital Management Software' },
      { en: 'Employee Management Software', hi: 'Employee Management Software' },
      { en: 'CRM Software — manage customers', hi: 'CRM Software — customers manage करें' },
      { en: 'Business Automation Solutions', hi: 'Business Automation Solutions' },
      { en: 'Custom Web Applications', hi: 'Custom Web Applications' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Explain your software requirements in detail', 'Get detailed proposal and cost estimate', 'Development, testing and training phase', 'Software delivered with full support!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'Software requirements detail mein explain karein', 'Detailed proposal aur cost estimate paayen', 'Development, testing aur training phase', 'Full support ke saath Software deliver!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Software Development',
    actionHi: 'Software के लिए Contact करें',
    actionClass: 'bg-slate-800 hover:bg-slate-700 text-white',
  },

  'document': {
    icon: '📄',
    titleEn: 'Document & Form Work Services',
    titleHi: 'Document & Form Work Services',
    tagEn: 'Quick & Reliable',
    tagHi: 'जल्दी और reliable',
    tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
    descEn: 'Saarkari evam niji dastavezov se sambandhit karyon mein sahayata. Sabhi kaam sahi evam samay par poore karne ka prayas kiya jaata hai. Online aur offline dono prakar ke forms aur documents handle kiye jaate hain.',
    descHi: 'सरकारी एवं निजी दस्तावेजों से संबंधित कार्यों में सहायता। सभी कार्य सही एवं समय पर पूरे करने का प्रयास किया जाता है। Online और Offline दोनों प्रकार के forms और documents handle किए जाते हैं।',
    features: [
      { en: 'Online Forms Filling — government portals', hi: 'Online Forms Filling — government portals' },
      { en: 'Government Applications — all types', hi: 'Government Applications — सभी प्रकार' },
      { en: 'Affidavit Assistance', hi: 'Affidavit Assistance' },
      { en: 'Scholarship Forms filling', hi: 'Scholarship Forms filling' },
      { en: 'Admission Forms — college, school', hi: 'Admission Forms — college, school' },
      { en: 'Resume & CV Preparation', hi: 'Resume & CV Preparation' },
      { en: 'Documentation Support', hi: 'Documentation Support' },
      { en: 'Certificate Applications', hi: 'Certificate Applications' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Tell which form or document you need', 'Bring or share the required documents', 'Work done professionally and quickly', 'Document ready on time!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'Batayein kaun sa form ya document chahiye', 'Required documents laayein ya share karein', 'Professional aur jaldi kaam ho jaayega', 'Document time par ready!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Document Work',
    actionHi: 'Document Work के लिए Contact',
    actionClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },

  'freelance': {
    icon: '🎯',
    titleEn: 'Professional Freelance Services',
    titleHi: 'Professional Freelance Services',
    tagEn: 'Available for hire',
    tagHi: 'काम के लिए उपलब्ध',
    tagColor: 'bg-teal-100 text-teal-700 border-teal-200',
    descEn: 'Vyaktigat evam vyavsayik aavashyaktaon ke liye Freelance Work Services uplabdh hain. Chhote aur bade dono prakar ke projects par kaam kiya jaata hai. Quick turnaround aur professional quality guaranteed.',
    descHi: 'व्यक्तिगत एवं व्यवसायिक आवश्यकताओं के लिए Freelance Work Services उपलब्ध हैं। छोटे और बड़े दोनों प्रकार के projects पर कार्य किया जाता है। Quick turnaround और professional quality guaranteed।',
    features: [
      { en: 'Data Entry Work — accurate and fast', hi: 'Data Entry Work — accurate और fast' },
      { en: 'Excel Work — formulas, reports, MIS', hi: 'Excel Work — formulas, reports, MIS' },
      { en: 'Typing Work — Hindi & English', hi: 'Typing Work — Hindi & English' },
      { en: 'PDF to Excel / Word Conversion', hi: 'PDF to Excel / Word Conversion' },
      { en: 'Content Writing — articles, descriptions', hi: 'Content Writing — articles, descriptions' },
      { en: 'Research Work — online research', hi: 'Research Work — online research' },
      { en: 'Virtual Assistant Services', hi: 'Virtual Assistant Services' },
      { en: 'Online Business Support tasks', hi: 'Online Business Support tasks' },
    ],
    howEn: ['Contact via WhatsApp: +91-9309352063', 'Describe your work requirement and deadline', 'Get quote based on work type and volume', 'Work starts immediately after confirmation', 'Delivered on time with quality!'],
    howHi: ['WhatsApp karein: +91-9309352063', 'Kaam ki requirement aur deadline batayein', 'Work type aur volume ke hisaab se quote paayen', 'Confirmation ke baad kaam turant shuru', 'Quality ke saath time par deliver!'],
    actionType: 'whatsapp',
    actionEn: 'Contact for Freelance Work',
    actionHi: 'Freelance Work के लिए Contact',
    actionClass: 'bg-teal-600 hover:bg-teal-700 text-white',
  },
};

export default function ServiceDetailPage({ serviceId, lang, onClose, onAction }: ServiceDetailProps) {
  if (!serviceId) return null;
  const svc = SERVICES[serviceId];
  if (!svc) return null;

  const handleAction = () => {
    if (svc.actionType === 'whatsapp') {
      const msg = encodeURIComponent(
        'Namaste Prince Sharma Ji!\n\nMujhe ' + (lang === 'en' ? svc.titleEn : svc.titleHi) +
        ' service ke baare mein jaankari chahiye.\n\nPlease contact karein.\n\nSriganganagar Jobs se'
      );
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
              <h2 className="font-black text-slate-900 text-sm leading-tight">
                {lang === 'en' ? svc.titleEn : svc.titleHi}
              </h2>
              <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ' + svc.tagColor}>
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
              {lang === 'en' ? '✅ What We Offer' : '✅ हमारी सेवाएं'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {svc.features.map((f: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl p-2.5">
                  <CheckCircle size={13} className="text-[#25D366] flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    {lang === 'en' ? f.en : f.hi}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              {lang === 'en' ? '📋 How It Works' : '📋 कैसे करें'}
            </h3>
            <div className="space-y-2.5">
              {howSteps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="min-w-6 h-6 bg-[#075E54] text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-600 leading-relaxed pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact for WhatsApp services */}
          {svc.actionType === 'whatsapp' && (
            <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-4">
              <p className="text-xs font-black text-[#075E54] mb-2">
                {lang === 'en' ? '📞 Contact Details' : '📞 संपर्क विवरण'}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <MessageSquare size={12} className="text-[#25D366]" />
                  <span className="font-bold text-slate-700">WhatsApp: +91-9309352063</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone size={12} className="text-[#075E54]" />
                  <span className="text-slate-600">Prince Sharma — Sri Ganganagar, Rajasthan</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 space-y-2">
          <button onClick={handleAction}
            className={'w-full py-3.5 rounded-2xl font-black text-sm cursor-pointer transition-colors ' + svc.actionClass}>
            {lang === 'en' ? svc.actionEn : svc.actionHi}
          </button>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-500 font-bold text-sm cursor-pointer hover:bg-slate-50 transition-colors">
            {lang === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
