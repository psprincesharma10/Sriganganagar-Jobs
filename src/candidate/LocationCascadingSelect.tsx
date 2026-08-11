import React from 'react';
import { MapPin, Globe, Compass, Building, Home, HelpCircle } from 'lucide-react';
import { INDIA_STATES, getIndiaDistricts } from './indiaLocations';
import { VoiceInput } from './VoiceInput';

interface LocationCascadingSelectProps {
  country: string;
  state: string;
  district: string;
  tahsil: string;
  village_or_town: string;
  area_other: string;
  onChange: (field: string, value: string) => void;
  showVoiceInput?: boolean;
}

export const LocationCascadingSelect: React.FC<LocationCascadingSelectProps> = ({
  country,
  state,
  district,
  tahsil,
  village_or_town,
  area_other,
  onChange,
  showVoiceInput = true,
}) => {
  const availableDistricts = getIndiaDistricts(state);

  return (
    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-4">
      <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
        <label className="text-sm font-bold text-[#075E54] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Location Hierarchy (स्थान जानकारी) *</span>
        </label>
        <span className="text-[11px] text-emerald-700 font-medium">
          Country ➔ State ➔ District ➔ Tahsil ➔ Village
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Country - locked to India */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            1. Country (देश) *
          </label>
          <select
            value="India"
            disabled
            className="w-full bg-slate-100 border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-600 cursor-not-allowed shadow-sm"
          >
            <option value="India">🇮🇳 India</option>
          </select>
        </div>

        {/* 2. State Dropdown - all Indian states */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            2. State (राज्य) *
          </label>
          <select
            value={state}
            onChange={(e) => {
              onChange('country', 'India');
              onChange('state', e.target.value);
              onChange('district', '');
              onChange('tahsil', '');
              onChange('village_or_town', '');
            }}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none shadow-sm"
          >
            <option value="">-- State chunein --</option>
            {INDIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 3. District Dropdown - all districts for chosen state */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-emerald-600" />
            3. District (जिला) *
          </label>
          <select
            value={district}
            onChange={(e) => {
              onChange('district', e.target.value);
              onChange('tahsil', '');
              onChange('village_or_town', '');
            }}
            disabled={!state}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">{state ? '-- District chunein --' : 'Pehle State chunein'}</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Tahsil / Tehsil / Block - free text (India has 5,000+ tahsils) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            4. Tahsil / Block (तहसील)
          </label>
          <input
            type="text"
            value={tahsil}
            onChange={(e) => onChange('tahsil', e.target.value)}
            placeholder="e.g. Padampur Tahsil"
            className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* 5. Village / Town name free text input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <span>5. Gaon / Town Ka Naam (गाँव या शहर)</span>
            </label>
            {showVoiceInput && (
              <VoiceInput
                currentValue={village_or_town}
                onSpeechResult={(val) => onChange('village_or_town', val)}
              />
            )}
          </div>
          <input
            type="text"
            value={village_or_town}
            onChange={(e) => onChange('village_or_town', e.target.value)}
            placeholder="e.g. Gajsinghpur, Mirzewala, Padampur, Ward 4"
            className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none shadow-sm"
          />
        </div>

        {/* 6. Other / Landmark / Free text field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Other Detail / Landmark (मोहल्ला / लैंडमार्क)</span>
            </label>
            {showVoiceInput && (
              <VoiceInput
                currentValue={area_other}
                onSpeechResult={(val) => onChange('area_other', val)}
              />
            )}
          </div>
          <input
            type="text"
            value={area_other}
            onChange={(e) => onChange('area_other', e.target.value)}
            placeholder="e.g. Near Bus Stand, Ravindra Path, Chak 17 BB"
            className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#075E54] focus:outline-none shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
