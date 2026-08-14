import React, { useState, useEffect, useMemo } from 'react';
import { Search, Briefcase, MapPin, Users, Loader2 } from 'lucide-react';
import { Candidate, FilterState } from './candidateTypes';
import { fetchAllCandidates } from './candidateSupabase';
import { CandidateFilterBar } from './CandidateFilterBar';
import { CandidateCard } from './CandidateCard';

interface EmployerBrowseViewProps {
  onNavigate: (view: string, param?: string) => void;
  unlockedCandidateIds: Set<string>;
  onUnlockClick: (candidate: Candidate) => void;
  initialSkillFilter?: string;
  initialSearchQuery?: string;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  skill: '',
  country: 'India',
  state: '',
  district: '',
  tahsil: '',
  village: '',
  onlyAvailable: false,
  minExp: 0,
};

export const EmployerBrowseView: React.FC<EmployerBrowseViewProps> = ({
  onNavigate,
  unlockedCandidateIds,
  onUnlockClick,
  initialSkillFilter,
  initialSearchQuery,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    skill: initialSkillFilter || '',
    searchQuery: initialSearchQuery || '',
  });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchAllCandidates();
      setCandidates(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filter candidates logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      // Search query (name, bio, skill, village, district)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const allSkillsText = (cand.skill_categories && cand.skill_categories.length > 0 ? cand.skill_categories : [cand.skill_category]).join(' ');
        const textToSearch = `${cand.full_name} ${allSkillsText} ${cand.bio || ''} ${cand.village_or_town || ''} ${cand.district} ${cand.tahsil || ''}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      // Skill category (matches any of the candidate's up-to-5 chosen skills)
      if (filters.skill) {
        const skillList = cand.skill_categories && cand.skill_categories.length > 0 ? cand.skill_categories : [cand.skill_category];
        const matches = skillList.some((sk) => (sk || '').toLowerCase().includes(filters.skill.toLowerCase()));
        if (!matches) return false;
      }

      // Country
      if (filters.country && cand.country && cand.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }

      // State
      if (filters.state && cand.state && cand.state.toLowerCase() !== filters.state.toLowerCase()) {
        return false;
      }

      // District
      if (filters.district && cand.district && cand.district.toLowerCase() !== filters.district.toLowerCase()) {
        return false;
      }

      // Tahsil (free text partial match)
      if (filters.tahsil && !(cand.tahsil || '').toLowerCase().includes(filters.tahsil.toLowerCase())) {
        return false;
      }

      // Village / Town (free text partial match)
      if (filters.village && !(cand.village_or_town || '').toLowerCase().includes(filters.village.toLowerCase())) {
        return false;
      }

      // Available now toggle
      if (filters.onlyAvailable && !cand.is_available) {
        return false;
      }

      // Min Experience
      if (filters.minExp > 0 && (cand.experience_years || 0) < filters.minExp) {
        return false;
      }

      return true;
    });
  }, [candidates, filters]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header title */}
      <div className="bg-gradient-to-r from-[#075E54] to-[#054840] text-white p-6 rounded-3xl shadow-sm border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase">
            EMPLOYER SEARCH PORTAL
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            वर्कर ढूंढें (Search Candidates & Skilled Labor)
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            ड्राइवर, इलेक्ट्रिशियन, टीचर, सिक्योरिटी गार्ड व अन्य वर्कफ़ोर्स खोजें
          </p>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-500/30 px-3 py-2 rounded-xl text-center">
          <span className="text-xs text-emerald-300 block font-bold">Total Directory</span>
          <span className="text-xl font-black text-amber-400">{candidates.length} Workers</span>
        </div>
      </div>

      {/* Filter Component */}
      <CandidateFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredCandidates.length}
      />

      {/* Candidates Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-[#075E54] animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Candidates list loading...</p>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isUnlocked={unlockedCandidateIds.has(candidate.id)}
              onUnlockClick={onUnlockClick}
              onViewDetails={(id) => onNavigate('detail', id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {filters.skill ? `No ${filters.skill} candidates found` : 'No Candidates Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {filters.skill
              ? `Abhi "${filters.skill}" ke liye koi registered candidate nahi hai. Filters clear karke doosri profession dekhein, ya baad mein dobara check karein.`
              : 'Aapke dwara chune gaye filters (skill/location) se koi candidate nahi mila. Kripya location filter badlein ya clear karein.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="bg-[#075E54] hover:bg-[#054840] text-white font-bold text-xs py-2 px-4 rounded-xl"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl border border-slate-300"
            >
              Browse All 1000+ Job Roles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
