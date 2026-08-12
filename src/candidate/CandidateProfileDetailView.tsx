import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  Phone,
  MessageSquare,
  Lock,
  Eye,
  Award,
  ArrowLeft,
  Calendar,
  DollarSign,
  UserCheck,
  ShieldCheck,
  Share2,
  Loader2
} from 'lucide-react';
import { Candidate, TargetLanguage } from './candidateTypes';
import { formatSalaryDisplay, CONTACT_UNLOCK_ENABLED } from './skillsData';
import {
  fetchCandidateById,
  incrementCandidateViewCount,
  fetchAllCandidates
} from './candidateSupabase';
import {
  generateCandidateTitle,
  generateCandidateDescription,
  generatePersonSchema,
  generateCanonicalUrl
} from './seo';
import { TranslateBar } from './TranslateBar';
import { SchemaMarkup } from './SchemaMarkup';
import { CandidateCard } from './CandidateCard';
import { translateText, getSavedTargetLanguage, saveTargetLanguage } from './translateService';

interface CandidateProfileDetailViewProps {
  candidateId: string;
  isUnlocked: boolean;
  onUnlockClick: (candidate: Candidate) => void;
  onNavigate: (view: string, param?: string) => void;
  unlockedCandidateIds: Set<string>;
}

export const CandidateProfileDetailView: React.FC<CandidateProfileDetailViewProps> = ({
  candidateId,
  isUnlocked: isUnlockedProp,
  onUnlockClick,
  onNavigate,
  unlockedCandidateIds,
}) => {
  // While CONTACT_UNLOCK_ENABLED is false, every number is shown to
  // everyone for free — no need to pay/unlock.
  const isUnlocked = CONTACT_UNLOCK_ENABLED ? isUnlockedProp : true;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [similarCandidates, setSimilarCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Translation State
  const [targetLang, setTargetLang] = useState<TargetLanguage>(getSavedTargetLanguage());
  const [translatedBio, setTranslatedBio] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Inquiry form removed per product decision (see handleSubmit note below)

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const cand = await fetchCandidateById(candidateId);
      if (cand) {
        setCandidate(cand);
        setTranslatedBio(cand.bio || '');
        await incrementCandidateViewCount(cand.id);

        // Fetch similar candidates
        const all = await fetchAllCandidates();
        const similar = all.filter(
          (c) => c.id !== cand.id && (c.skill_category === cand.skill_category || c.district === cand.district)
        );
        setSimilarCandidates(similar);
      }
      setIsLoading(false);
    }
    load();
  }, [candidateId]);

  // Handle translation change
  const handleLangChange = async (newLang: TargetLanguage) => {
    setTargetLang(newLang);
    saveTargetLanguage(newLang);
    if (!candidate || !candidate.bio) return;

    setIsTranslating(true);
    const translated = await translateText(candidate.bio, newLang);
    setTranslatedBio(translated);
    setIsTranslating(false);
  };



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-[#075E54] animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Candidate Profile...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Candidate Not Found</h2>
        <button
          onClick={() => onNavigate('browse')}
          className="bg-[#075E54] text-white text-xs font-bold py-2 px-4 rounded-xl"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const rawPhone = candidate.phone_number.replace(/\D/g, '');
  const maskedPhone =
    rawPhone.length >= 10 ? `${rawPhone.slice(0, 5)} XXXXX` : '98765 XXXXX';

  const title = generateCandidateTitle(candidate);
  const description = generateCandidateDescription(candidate);
  const schema = generatePersonSchema(candidate);
  const canonicalUrl = generateCanonicalUrl(candidate.id);

  // Update document title for SEO
  if (typeof document !== 'undefined') {
    document.title = title;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Schema.org Structured Data */}
      <SchemaMarkup schemaData={schema} />

      {/* Back Button */}
      <button
        onClick={() => onNavigate('browse')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#075E54] bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Candidate List</span>
      </button>

      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#075E54] to-[#054840] p-6 text-white relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  candidate.photo_url ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                }
                alt={candidate.full_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg bg-slate-100"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {candidate.full_name}
                  </h1>
                  {candidate.is_verified && (
                    <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {(candidate.skill_categories && candidate.skill_categories.length > 0
                    ? candidate.skill_categories
                    : [candidate.skill_category]
                  ).map((sk) => (
                    <span
                      key={sk}
                      className="bg-amber-400 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-md shadow-xs"
                    >
                      {sk}
                    </span>
                  ))}
                  <span className="bg-emerald-800/80 text-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-emerald-600/50">
                    {candidate.experience_years} Years Exp
                  </span>
                </div>

                <p className="mt-2 text-xs text-emerald-100 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>
                    {/* Privacy: only show Tahsil & Village/Town to employers — never full address */}
                    {[candidate.village_or_town, candidate.tahsil]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </p>
              </div>
            </div>

            {/* View Count Badge */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-200 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{candidate.view_count || 12} Views</span>
            </div>
          </div>
        </div>

        {/* Translation Bar for Employers */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <TranslateBar
            currentLang={targetLang}
            onLanguageChange={handleLangChange}
            isTranslating={isTranslating}
          />
        </div>

        {/* Body Details */}
        <div className="p-6 space-y-6">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {candidate.is_available ? 'Available Now' : 'Busy'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Expected Salary</span>
              <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                {candidate.expected_salary ? formatSalaryDisplay(candidate.expected_salary) : 'Negotiable'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Tahsil / Block</span>
              <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                {candidate.tahsil || 'N/A'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Gaon / Town</span>
              <span className="text-xs font-extrabold text-slate-800 mt-0.5 block">
                {candidate.village_or_town || 'N/A'}
              </span>
            </div>
          </div>

          {/* Bio / Work Description Box */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[#075E54]">
              Candidate Bio & Work Experience
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed text-sm text-slate-700 relative">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-xs text-amber-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Translating to selected language...</span>
                </div>
              ) : (
                <p>{translatedBio || 'No description provided.'}</p>
              )}
            </div>
          </div>

          {/* Contact Details Unlock Card */}
          <div className="bg-emerald-50/80 border-2 border-emerald-600/30 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                  {isUnlocked ? <UserCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {isUnlocked
                      ? (CONTACT_UNLOCK_ENABLED ? 'Direct Contact Unlocked!' : 'Candidate Contact Number')
                      : 'Candidate Contact Number (Masked)'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {isUnlocked ? 'Contact candidate via Phone Call or WhatsApp' : 'Pay ₹15 to view full number & call'}
                  </p>
                </div>
              </div>

              <span className="text-lg font-black text-slate-900 tracking-wider">
                {isUnlocked ? candidate.phone_number : maskedPhone}
              </span>
            </div>

            {!isUnlocked ? (
              <button
                onClick={() => onUnlockClick(candidate)}
                className="w-full bg-[#075E54] hover:bg-[#054840] text-white font-black text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Unlock Contact Details for ₹15 (Direct Call & WhatsApp)</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${candidate.phone_number}`}
                  className="bg-[#075E54] hover:bg-[#054840] text-white font-extrabold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Direct Phone Call</span>
                </a>
                <a
                  href={`https://wa.me/91${rawPhone}?text=${encodeURIComponent(
                    `Namaste ${candidate.full_name}, maine aapka profile Sri Ganganagar Jobs (sriganganagarjobs.in) par dekha.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-600 text-white font-extrabold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Candidates (Internal Linking SEO Section) */}
      {similarCandidates.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>समान कैंडिडेट्स (Similar Candidate Profiles)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarCandidates.slice(0, 4).map((cand) => (
              <CandidateCard
                key={cand.id}
                candidate={cand}
                isUnlocked={unlockedCandidateIds.has(cand.id)}
                onUnlockClick={onUnlockClick}
                onViewDetails={(id) => onNavigate('detail', id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
