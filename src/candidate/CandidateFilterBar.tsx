import React, { useState } from 'react';
import { Search, Filter, X, MapPin, Briefcase, Sparkles, CheckCircle } from 'lucide-react';
import { FilterState } from './candidateTypes';
import {
  WORLD_LOCATIONS_DATA,
  POPULAR_COUNTRIES,
  getStatesForCountry,
  getDistrictsForState,
  getTahsilsForDistrict,
  getVillagesForTahsil,
} from './locationsData';

interface CandidateFilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const SKILLS_LIST = [
  'All Skills / सभी कार्य',
  'Driver',
  'Electrician',
  'Teacher',
  'Computer Operator',
  'Helper / Worker',
  'Delivery Boy',
  'Security Guard',
  'Accountant',
  'Data Entry',
  'Plumber',
  'Painter',
  'Mason',
  'Chef / Cook',
  'Tailor',
  'Mechanic'
];

export const CandidateFilterBar: React.FC<CandidateFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const states = getStatesForCountry(filters.country || 'India');
  const districts = getDistrictsForState(filters.country || 'India', filters.state);
  const tahsils = getTahsilsForDistrict(filters.country || 'India', filters.state, filters.district);
  const villages = getVillagesForTahsil(filters.country || 'India', filters.state, filters.district, filters.tahsil);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Input + Skill Select + Mobile Filter Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Keyword */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by worker name, village, or skill (e.g. Ramkumar, Padampur)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#075E54] focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Skill Select */}
        <div className="md:col-span-4 relative">
          <select
            value={filters.skill}
            onChange={(e) => onFilterChange({ skill: e.target.value })}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none"
          >
            {SKILLS_LIST.map((s) => (
              <option key={s} value={s === 'All Skills / सभी कार्य' ? '' : s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Action Toggle */}
        <div className="md:col-span-3 flex items-center gap-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              showAdvanced || filters.state || filters.district
                ? 'bg-emerald-50 text-[#075E54] border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Location Filters</span>
          </button>

          <button
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300 text-xs font-semibold"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Cascading Location & Status Filter Options */}
      {(showAdvanced || filters.country !== 'India' || filters.state || filters.district) && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
          {/* Country */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Country</label>
            <select
              value={filters.country}
              onChange={(e) =>
                onFilterChange({
                  country: e.target.value,
                  state: '',
                  district: '',
                  tahsil: '',
                  village: '',
                })
              }
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              {POPULAR_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) =>
                onFilterChange({
                  state: e.target.value,
                  district: '',
                  tahsil: '',
                  village: '',
                })
              }
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
            <select
              value={filters.district}
              onChange={(e) =>
                onFilterChange({
                  district: e.target.value,
                  tahsil: '',
                  village: '',
                })
              }
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Tahsil */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Tahsil / Block</label>
            <select
              value={filters.tahsil}
              onChange={(e) =>
                onFilterChange({
                  tahsil: e.target.value,
                  village: '',
                })
              }
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value="">All Tahsils</option>
              {tahsils.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Experience Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Experience</label>
            <select
              value={filters.minExp}
              onChange={(e) => onFilterChange({ minExp: Number(e.target.value) })}
              className="w-full py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            >
              <option value={0}>Any Experience</option>
              <option value={1}>1+ Years</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
              <option value={8}>8+ Years</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Count & Available Now Toggle Bar */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-extrabold text-[#075E54] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          Total Candidates Found: {totalResults}
        </span>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => onFilterChange({ onlyAvailable: e.target.checked })}
            className="w-4 h-4 text-[#075E54] rounded border-slate-300 focus:ring-[#075E54]"
          />
          <span className="font-bold text-slate-700">
            Show "Available Now" Only (तुरंत उपलब्ध)
          </span>
        </label>
      </div>
    </div>
  );
};
