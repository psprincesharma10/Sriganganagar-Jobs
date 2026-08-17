import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { ArticleTypeOption, COMMON_SECTIONS, NEWS_ONLY_SECTIONS } from '../data/articleTemplates';

interface ArticleTypeSelectorProps {
  types: ArticleTypeOption[];
  selectedType: string;
  onSelectType: (id: string) => void;
  onInsertTemplate: (html: string) => void;
  onInsertSection: (html: string) => void;
  isNews?: boolean;
}

export const ArticleTypeSelector: React.FC<ArticleTypeSelectorProps> = ({
  types, selectedType, onSelectType, onInsertTemplate, onInsertSection, isNews,
}) => {
  const current = types.find((t) => t.id === selectedType);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
          Content Type / Article Type
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={selectedType}
            onChange={(e) => onSelectType(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm bg-white"
          >
            <option value="">-- Type chunein --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={!current}
            onClick={() => current && onInsertTemplate(current.template)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap"
          >
            <LayoutTemplate size={14} />
            Insert Recommended Structure
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
          Quick Add Section (cursor par insert hoga)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SECTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onInsertSection(s.html)}
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              {s.label}
            </button>
          ))}
          {isNews && NEWS_ONLY_SECTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onInsertSection(s.html)}
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
