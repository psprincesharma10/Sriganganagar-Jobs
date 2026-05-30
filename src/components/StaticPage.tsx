import { X, Info, Phone, Shield, FileText, AlertTriangle, Megaphone, Flag } from 'lucide-react';
import { Language } from '../types';

export type PageType = 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'advertise' | 'report';

interface StaticPageProps {
  page: PageType;
  lang: Language;
  onClose: () => void;
}

export default function StaticPage({ page, lang, onClose }: StaticPageProps) {

  const pages: Record<PageType, { icon: React.ReactNode; titleEn: string; titleHi: string; content: React.ReactNode }> = {

    about: {
      icon: <Info size={20} className="text-[#25D366]" />,
      titleEn: 'About Us',
      titleHi: 'हमारे बारे में',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-4">
            <p className="font-black text-[#075E54] text-base mb-1">Sriganganagar Jobs</p>
            <p className="text-xs text-[#128C7E]">Sri Ganganagar ka #1 Local Job Board</p>
          </div>
          <p>
            <strong>Sriganganagar Jobs</strong> ek local job board hai jo Sri Ganganagar aur aaspaas ke logon ke liye banaya gaya hai. Hamaara maksad hai ki har koi — chahe job dhundhne wala ho ya job dene wala — seedha ek doosre se connect kar sake bina kisi beech wale ke.
          </p>
          <p>
            Hamari website pe koi signup nahi, koi password nahi, koi jhanjhat nahi. Bas job post karo — turant live ho jaati hai. Employer ka number seedha dikh jaata hai — seedha call karo.
          </p>
          <div className="space-y-2">
            <p className="font-bold text-slate-800">Hamari Khasiyatein:</p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Direct phone calls — koi middleman nahi</li>
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Free job posting — bilkul muft</li>
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Local Sri Ganganagar focus</li>
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Cloud sync — real time updates</li>
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Hindi + English support</li>
              <li className="flex items-start gap-2"><span className="text-[#25D366] font-bold mt-0.5">✓</span> Mobile app (PWA) — install kar sakte ho</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-xs">
            <p className="font-bold text-slate-700 mb-1">Founder</p>
            <p className="text-slate-600">Prince Sharma, Sri Ganganagar, Rajasthan</p>
            <p className="text-slate-500 mt-0.5">📧 princeoffice2021@gmail.com</p>
          </div>
        </div>
      ),
    },

    contact: {
      icon: <Phone size={20} className="text-blue-500" />,
      titleEn: 'Contact Us',
      titleHi: 'संपर्क करें',
      content: (
        <div className="space-y-4 text-sm text-slate-600">
          <p className="leading-relaxed">
            Koi bhi samasya ho, job post karne mein dikkat ho, ya kuch bhi poochna ho — seedha hamse sampark karen.
          </p>
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Phone / WhatsApp</p>
                <a href="tel:+919309352063" className="font-black text-slate-800 text-base hover:text-blue-600 transition-colors">+91-9309352063</a>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-sm font-black">@</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Email</p>
                <a href="mailto:princeoffice2021@gmail.com" className="font-black text-slate-800 hover:text-amber-600 transition-colors break-all">princeoffice2021@gmail.com</a>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm font-black">📍</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                <p className="font-bold text-slate-800">Sri Ganganagar, Rajasthan — 335001</p>
              </div>
            </div>
          </div>
          <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54]">
            <p className="font-bold mb-0.5">Response Time</p>
            <p>Hum aam taur par 2-4 ghante mein jawab dete hain. WhatsApp pe jaldi jawab milta hai.</p>
          </div>
        </div>
      ),
    },

    privacy: {
      icon: <Shield size={20} className="text-purple-500" />,
      titleEn: 'Privacy Policy',
      titleHi: 'गोपनीयता नीति',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="text-xs text-slate-400">Last updated: May 2026</p>

          <div className="space-y-3">
            <section>
              <h3 className="font-black text-slate-800 mb-1">1. Hum Kya Data Collect Karte Hain</h3>
              <p className="text-xs">Jab aap job post karte hain ya sponsored ad submit karte hain, hum collect karte hain: aapka naam (optional), phone number, aur job/ad description. Koi email, password, ya personal ID required nahi hai.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">2. Data Ka Upyog</h3>
              <p className="text-xs">Aapka phone number sirf website pe publicly dikhaya jaata hai taaki job seekers seedha call kar sakein. Hum aapka data kisi third party ko nahi bechte.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">3. Cookies</h3>
              <p className="text-xs">Hum minimal cookies use karte hain sirf app install preference store karne ke liye. Koi tracking cookies nahi hain.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">4. Data Storage</h3>
              <p className="text-xs">Aapka data Supabase (secure cloud database) mein store hota hai. Har job listing automatically expire hoti hai — data automatically delete ho jaata hai.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">5. Aapke Adhikar</h3>
              <p className="text-xs">Aap apni koi bhi listing hatawane ke liye humse contact kar sakte hain. Email: princeoffice2021@gmail.com</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">6. Contact</h3>
              <p className="text-xs">Privacy se related koi bhi sawaal ke liye: princeoffice2021@gmail.com</p>
            </section>
          </div>
        </div>
      ),
    },

    terms: {
      icon: <FileText size={20} className="text-orange-500" />,
      titleEn: 'Terms & Conditions',
      titleHi: 'नियम और शर्तें',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p className="text-xs text-slate-400">Last updated: May 2026</p>
          <p>Is website ka upyog karke aap in niyamon se sahmat hote hain:</p>
          <div className="space-y-3 text-xs">
            <section>
              <h3 className="font-black text-slate-800 mb-1">1. Job Posting Rules</h3>
              <ul className="space-y-1">
                <li>• Sirf asli aur sahi job listings post karein</li>
                <li>• Galat, fake, ya misleading information post karna mana hai</li>
                <li>• Ek hi job ko baar baar post karna spam maana jaayega</li>
                <li>• Koi bhi illegal kaam ki posting turant delete ki jaayegi</li>
              </ul>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">2. Sponsored Ads</h3>
              <ul className="space-y-1">
                <li>• Payment ke baad hi ad live hogi</li>
                <li>• Payment refundable nahi hai agar ad approve ho gayi</li>
                <li>• Hamare paas kisi bhi ad ko reject karne ka adhikar hai</li>
                <li>• Ad duration ke baad ad automatically expire ho jaayegi</li>
              </ul>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">3. Prohibited Content</h3>
              <ul className="space-y-1">
                <li>• Adult content, gambling ya illegal services ki ads nahi</li>
                <li>• Doosre businesses ki badnaami karna mana hai</li>
                <li>• Copyright material ka upyog bina permission ke mana hai</li>
              </ul>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">4. Liability</h3>
              <p>Sriganganagar Jobs sirf ek platform hai. Hum job offers ki authenticity ki guarantee nahi dete. Users apni zimmedari pe employers se contact karein.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">5. Changes</h3>
              <p>Hum in terms ko kabhi bhi badal sakte hain. Website ka continued use naye terms se agreement maana jaayega.</p>
            </section>
          </div>
        </div>
      ),
    },

    disclaimer: {
      icon: <AlertTriangle size={20} className="text-yellow-500" />,
      titleEn: 'Disclaimer',
      titleHi: 'अस्वीकरण',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="font-black text-yellow-800 text-sm mb-1">⚠️ Important Notice</p>
            <p className="text-xs text-yellow-700">Please is page ko dhyan se padhen apni suraksha ke liye.</p>
          </div>
          <div className="space-y-3 text-xs">
            <section>
              <h3 className="font-black text-slate-800 mb-1">Job Listings</h3>
              <p>Sriganganagar Jobs pe listed saari jobs third-party users dwara post ki jaati hain. Hum kisi bhi job ki authenticity, legality, ya accuracy ki guarantee nahi dete. Interview ya job ke liye koi bhi payment karne se pehle employer ko personally verify karein.</p>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">Fraud Se Bachein</h3>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-1.5"><span className="text-red-500 mt-0.5">✗</span> Kisi bhi employer ko pehle paise mat bhejein</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500 mt-0.5">✗</span> Personal documents (Aadhaar, PAN) share karne se pehle sochein</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500 mt-0.5">✗</span> Bahut zyada salary wale offers pe shak karein</li>
                <li className="flex items-start gap-1.5"><span className="text-green-600 mt-0.5">✓</span> Pehle personally milein ya video call karein</li>
                <li className="flex items-start gap-1.5"><span className="text-green-600 mt-0.5">✓</span> Suspicious job Report Scam button se report karein</li>
              </ul>
            </section>
            <section>
              <h3 className="font-black text-slate-800 mb-1">Platform Responsibility</h3>
              <p>Hum ek neutral platform hain. Kisi bhi job transaction, payment dispute, ya employment matters mein Sriganganagar Jobs ki koi zimmedari nahi hai.</p>
            </section>
          </div>
        </div>
      ),
    },

    advertise: {
      icon: <Megaphone size={20} className="text-amber-500" />,
      titleEn: 'Advertise With Us',
      titleHi: 'विज्ञापन दें',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-black text-amber-800 mb-1">📢 Sri Ganganagar ke hazaron logon tak pahunchen!</p>
            <p className="text-xs text-amber-700">Hamari website daily Sri Ganganagar ke local job seekers aur employers use karte hain.</p>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-slate-800 text-sm">Advertising Plans:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">7 Din ka Ad</p>
                  <p className="text-slate-500">Side bar ya job feed mein</p>
                </div>
                <p className="font-black text-[#075E54] text-lg">₹250</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">15 Din ka Ad</p>
                  <p className="text-slate-500">Side bar ya job feed mein</p>
                </div>
                <p className="font-black text-[#075E54] text-lg">₹500</p>
              </div>
              <div className="bg-[#eefaf7] border-2 border-[#128C7E] rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">30 Din ka Ad ⭐ Best</p>
                  <p className="text-slate-500">Side bar ya job feed mein</p>
                </div>
                <p className="font-black text-[#075E54] text-lg">₹1000</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">90 Din ka Ad</p>
                  <p className="text-slate-500">Side bar ya job feed mein</p>
                </div>
                <p className="font-black text-[#075E54] text-lg">₹2500</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2">
            <p className="font-bold text-slate-700">Ad dene ke liye contact karein:</p>
            <a href="https://wa.me/919309352063" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 bg-[#25D366] text-white font-black rounded-xl justify-center transition-colors hover:bg-[#20ba5a]">
              📱 WhatsApp: +91-9309352063
            </a>
            <p className="text-center text-slate-400">ya website pe "Post Sponsored Ad" button use karein</p>
          </div>
        </div>
      ),
    },

    report: {
      icon: <Flag size={20} className="text-red-500" />,
      titleEn: 'Report Scam Job',
      titleHi: 'फर्जी जॉब की शिकायत करें',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-black text-red-800 mb-1">🚨 Fraud Job Report Karein</p>
            <p className="text-xs text-red-700">Agar aapko koi job fake, scam ya suspicious lagti hai to turant report karein. Hum use jaldi hata denge.</p>
          </div>
          <div className="space-y-3 text-xs">
            <section>
              <p className="font-bold text-slate-800 mb-2">Kab Report Karein?</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-1.5"><span className="text-red-500">⚠</span> Employer ne pehle paise maange</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500">⚠</span> Job ka number galat ya band aa raha hai</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500">⚠</span> Bahut zyada salary ka jhansa diya</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500">⚠</span> Personal documents maange bina milne ke</li>
                <li className="flex items-start gap-1.5"><span className="text-red-500">⚠</span> Job bilkul alag nikli jo likhi thi</li>
              </ul>
            </section>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-slate-800 text-xs">Report karne ke tarike:</p>
            <a
              href="https://wa.me/919309352063?text=Scam%20Job%20Report%3A%20Mujhe%20ek%20suspicious%20job%20mili%20hai%20Sriganganagar%20Jobs%20pe.%20Details%3A%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full py-2.5 bg-[#25D366] text-white font-black rounded-xl justify-center transition-colors hover:bg-[#20ba5a] text-xs"
            >
              📱 WhatsApp pe Report Karein (Sabse Fast)
            </a>
            <a
              href="mailto:princeoffice2021@gmail.com?subject=Scam Job Report - Sriganganagar Jobs&body=Namaste, mujhe ek suspicious job mili hai. Job title: [likhen] Phone number: [likhen] Reason: [likhen]"
              className="flex items-center gap-2 w-full py-2.5 bg-slate-800 text-white font-black rounded-xl justify-center transition-colors hover:bg-slate-700 text-xs"
            >
              📧 Email se Report Karein
            </a>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Hum 2-4 ghante mein review karke suspicious listing hata denge. Aapki pehchaan gupat rakhi jaayegi.
          </p>
        </div>
      ),
    },
  };

  const currentPage = pages[page];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 border border-slate-100 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {currentPage.icon}
            <h2 className="text-base font-black text-slate-900">
              {lang === 'en' ? currentPage.titleEn : currentPage.titleHi}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {currentPage.content}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer">
            {lang === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
