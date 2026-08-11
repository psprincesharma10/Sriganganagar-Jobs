import React from 'react';
import {
  MapPin,
  CheckCircle2,
  Lock,
  Eye,
  Award,
  ChevronRight,
  UserCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Candidate } from './candidateTypes';
import { formatSalaryDisplay } from './skillsData';

interface CandidateCardProps {
  candidate: Candidate;
  isUnlocked: boolean;
  onUnlockClick: (candidate: Candidate) => void;
  onViewDetails: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isUnlocked,
  onUnlockClick,
  onViewDetails,
}) => {
  // Format masked phone number
  const rawPhone = candidate.phone_number.replace(/\D/g, '');
  const maskedPhone =
    rawPhone.length >= 10
      ? `${rawPhone.slice(0, 5)} XXXXX`
      : '98765 XXXXX';

  // Privacy: only show City/Village, Tahsil & District to employers — never state/country/landmark
  const fullLocation = [
    candidate.village_or_town,
    candidate.tahsil,
    candidate.district,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Top Header Row with Status & Verified Tag */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {candidate.is_available ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available Now (उपलब्ध)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                Currently Working
              </span>
            )}

            {candidate.is_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                Verified Worker
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>{candidate.view_count || 12} views</span>
          </div>
        </div>

        {/* Profile Main Info */}
        <div className="p-4 sm:p-5 flex gap-4">
          {/* Avatar Photo */}
          <div className="relative shrink-0">
            <img
              src={
                candidate.photo_url ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
              }
              alt={`${candidate.full_name} - ${candidate.skill_category}`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-600/30 shadow-inner bg-slate-100"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#075E54] text-white p-1 rounded-lg text-[10px] font-bold">
              {candidate.experience_years}Y Exp
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate flex items-center gap-1.5 group-hover:text-[#075E54] transition-colors">
              <span>{candidate.full_name}</span>
            </h3>

            {/* Skill Badges — shows all chosen categories (up to 5) */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {(candidate.skill_categories && candidate.skill_categories.length > 0
                ? candidate.skill_categories
                : [candidate.skill_category]
              ).map((sk) => (
                <span
                  key={sk}
                  className="bg-[#075E54] text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs"
                >
                  {sk}
                </span>
              ))}
              {candidate.expected_salary && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Expected Salary: {formatSalaryDisplay(candidate.expected_salary)}
                </span>
              )}
            </div>

            {/* Location hierarchy snippet */}
            <p className="mt-2 text-xs text-slate-600 flex items-start gap-1 line-clamp-2">
              <MapPin className="w-3.5 h-3.5 text-[#075E54] shrink-0 mt-0.5" />
              <span className="font-medium text-slate-700">{fullLocation}</span>
            </p>
          </div>
        </div>

        {/* Short Bio Excerpt */}
        {candidate.bio && (
          <div className="px-4 pb-3">
            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
              "{candidate.bio}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom Phone Action Section */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isUnlocked ? <UserCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">
                {isUnlocked ? 'Verified Phone' : 'Masked Phone'}
              </span>
              <span className="text-sm font-extrabold tracking-wide text-slate-800">
                {isUnlocked ? candidate.phone_number : maskedPhone}
              </span>
            </div>
          </div>

          {!isUnlocked ? (
            <button
              onClick={() => onUnlockClick(candidate)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow flex items-center gap-1 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock (₹15)</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Unlocked
            </span>
          )}
        </div>

        {/* Action Button: Profile only (Call/WhatsApp removed — employer must Unlock via ₹15 to see number, not message the candidate directly for free) */}
        <button
          onClick={() => onViewDetails(candidate.id)}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-300"
        >
          <span>Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
