import React from 'react';
import { Languages, Globe2, Sparkles } from 'lucide-react';
import { TargetLanguage } from './candidateTypes';

interface TranslateBarProps {
  currentLang: TargetLanguage;
  onLanguageChange: (lang: TargetLanguage) => void;
  isTranslating?: boolean;
}

export const TranslateBar: React.FC<TranslateBarProps> = ({
  currentLang,
  onLanguageChange,
  isTranslating = false,
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
        <Languages className="w-4 h-4 text-amber-700 shrink-0" />
        <span>Translate Profile (अपनी भाषा में बदलें):</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onLanguageChange('hi')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentLang === 'hi'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-300'
          }`}
        >
          हिंदी (Hindi)
        </button>

        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentLang === 'en'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-300'
          }`}
        >
          English
        </button>

        <button
          onClick={() => onLanguageChange('pa')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentLang === 'pa'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-300'
          }`}
        >
          ਪੰਜਾਬੀ (Punjabi)
        </button>

        <button
          onClick={() => onLanguageChange('raj')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentLang === 'raj'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-300'
          }`}
        >
          राजस्थानी (Hinglish)
        </button>
      </div>
    </div>
  );
};
