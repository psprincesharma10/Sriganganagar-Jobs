import React from 'react';
import {
  Users,
  Search,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  PhoneCall,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Candidate } from './candidateTypes';
import { CandidateCard } from './CandidateCard';

interface LandingViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenSignup: () => void;
  recentCandidates: Candidate[];
  unlockedCandidateIds: Set<string>;
  onUnlockClick: (candidate: Candidate) => void;
}

const SKILLS_GRID = [
  { name: 'Driver (चालक)', icon: '🚗', count: '120+' },
  { name: 'Electrician (बिजली मिस्त्री)', icon: '⚡', count: '95+' },
  { name: 'Teacher (शिक्षक)', icon: '🎓', count: '80+' },
  { name: 'Computer Operator', icon: '💻', count: '110+' },
  { name: 'Helper / Labor (हेल्पर)', icon: '👷', count: '250+' },
  { name: 'Security Guard (सुरक्षा)', icon: '🛡️', count: '70+' },
  { name: 'Accountant (अकाउंटेंट)', icon: '📊', count: '45+' },
  { name: 'Data Entry Operator', icon: '⌨️', count: '60+' },
];

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenSignup,
  recentCandidates,
  unlockedCandidateIds,
  onUnlockClick,
}) => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#075E54] via-[#054840] to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Ganganagar Jobs Reverse Job Board</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            कैंडिडेट अपनी प्रोफाइल डालें — <br />
            <span className="text-amber-400">एम्प्लॉयर्स खुद संपर्क करेंगे!</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            यह <strong>Sri Ganganagar Jobs (sriganganagarjobs.in)</strong> का आधिकारिक कैंडिडेट पोर्टल है। यहाँ ड्राइवर, इलेक्ट्रिशियन, टीचर, कंप्यूटर ऑपरेटर, सिक्यूरिटी गार्ड और अन्य स्किल्ड वर्कर अपनी प्रोफाइल बनाकर रखते हैं।
          </p>

          {/* Core Dual CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Candidate CTA */}
            <button
              onClick={onOpenSignup}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-base py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 group"
            >
              <UserPlus className="w-5 h-5 text-emerald-950" />
              <span>कैंडिडेट बनें — अपनी प्रोफाइल बनाएं (Free)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Employer CTA */}
            <button
              onClick={() => onNavigate('browse')}
              className="bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-5 h-5 text-emerald-300" />
              <span>एम्प्लॉयर हूँ — वर्कर ढूंढें</span>
            </button>
          </div>

          {/* Micro Trust badges */}
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>गाँव व तहसील स्तर तक मैपिंग</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>वॉइस इनपुट (बोलकर भरें)</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>डायरेक्ट कॉल व WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#075E54]" />
              <span>मुख्य कार्य क्षेत्र (Skill Categories)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              अपनी स्किल चुनें और उपलब्ध वर्कर्स की सूची देखें
            </p>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-bold text-[#075E54] hover:underline flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SKILLS_GRID.map((sk) => (
            <div
              key={sk.name}
              onClick={() => onNavigate('browse')}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {sk.icon}
              </span>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-[#075E54]">
                  {sk.name}
                </h3>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {sk.count} profiles
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Candidates */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#075E54]" />
              <span>हाल ही में जुड़े कैंडिडेट्स (Featured Candidates)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              श्रीगंगानगर, राजस्थान एवं देश-विदेश से हाल ही में पंजीकृत वर्कर
            </p>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="bg-emerald-50 hover:bg-emerald-100 text-[#075E54] border border-emerald-300 font-bold text-xs py-2 px-3 rounded-xl transition-colors"
          >
            सभी कैंडिडेट्स देखें ➔
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentCandidates.slice(0, 6).map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isUnlocked={unlockedCandidateIds.has(candidate.id)}
              onUnlockClick={onUnlockClick}
              onViewDetails={(id) => onNavigate('detail', id)}
            />
          ))}
        </div>
      </section>

      {/* How it Works Step Section */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            SIMPLE WORKFLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            यह काम कैसे करता है? (How It Works)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 bg-[#075E54] text-amber-300 font-black rounded-xl flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="font-bold text-base text-white">कैंडिडेट रजिस्ट्रेशन</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Candidate अपने मोबाइल नंबर व OTP से लॉगिन करके स्किल, अनुभव, और अपनी तहसील/गाँव की लोकेशन भरता है।
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 bg-[#075E54] text-amber-300 font-black rounded-xl flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="font-bold text-base text-white">एम्प्लॉयर सर्च करते हैं</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Employers बिना लॉगिन के गाँव व तहसील स्तर तक फ़िल्टर लगाकर वर्कर की स्किल व अनुभव प्रोफाइल देखते हैं।
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="w-10 h-10 bg-[#075E54] text-amber-300 font-black rounded-xl flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="font-bold text-base text-white">नंबर अनलॉक व डायरेक्ट कॉल</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Employer ₹15 का टोकन पे करके कैंडिडेट का पूरा फोन नंबर अनलॉक करता है और तुरंत कॉल या WhatsApp करता है।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
