import { Job, Language } from '../types';
import { Phone, Calendar, User, Pin, Trash2, Eye, EyeOff, Sparkles, Star } from 'lucide-react';

interface JobCardProps {
  key?: string | number;
  job: Job;
  lang: Language;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
  onTogglePhone?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onUnlockClick?: (job: Job) => void;
}

export default function JobCard({
  job,
  lang,
  isAdmin,
  onDelete,
  onTogglePhone,
  onTogglePin,
  onUnlockClick,
}: JobCardProps) {
  const isExpired = new Date(job.expires_at).getTime() < new Date('2026-05-24T11:17:41Z').getTime();

  // Masking phone helper
  const getMaskedPhone = (phone: string) => {
    if (phone.length <= 5) return '*****';
    return phone.substring(0, 5) + 'XXXXX';
  };

  // Human-readable date helper
  const getDaysAgoText = (dateStr: string) => {
    const diffTime = new Date('2026-05-24T11:17:41Z').getTime() - new Date(dateStr).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return lang === 'en' ? 'Today' : 'आज';
    } else if (diffDays === 1) {
      return lang === 'en' ? '1 day ago' : '1 दिन पहले';
    } else {
      return lang === 'en' ? `${diffDays} days ago` : `${diffDays} दिनों पहले`;
    }
  };

  const title = lang === 'en' ? job.job_title_en : job.job_title_hi;
  const description = lang === 'en' ? job.job_description_en : job.job_description_hi;

  return (
    <div 
      id={`job-card-${job.id}`}
      className={`relative p-5 rounded-2xl bg-white border-2 transition-all duration-300 ${
        job.pinned 
          ? 'border-[#128C7E] shadow-md bg-emerald-50/10' 
          : 'border-slate-100 hover:border-slate-200 shadow-sm'
      }`}
    >
      {/* Pinned Tag */}
      {job.pinned && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#128C7E]/10 text-[#075E54] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
          <Star size={11} className="fill-[#128C7E]" />
          <span>{lang === 'en' ? 'Important' : 'महत्वपूर्ण'}</span>
        </div>
      )}

      {/* Meta Header */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-500">
        {job.poster_name && (
          <div className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            <User size={12} />
            <span>{job.poster_name}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{getDaysAgoText(job.created_at)}</span>
        </div>
        {isAdmin && (
          <div className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-mono">
            Exp: {new Date(job.expires_at).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight pr-16 mb-2">
        {title || (lang === 'en' ? job.job_title_hi : job.job_title_en)}
      </h3>

      {/* Description */}
      <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed mb-4">
        {description || (lang === 'en' ? job.job_description_hi : job.job_description_en)}
      </p>

      {/* Footer Contact Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
            {lang === 'en' ? 'Employer Phone' : 'नियोक्ता फोन'}
          </span>
          <span className="font-mono text-base font-bold text-slate-800">
            {job.phone}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            id={`call-${job.id}`}
            href={`tel:${job.phone}`}
            className="px-4 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone size={14} />
            <span>{lang === 'en' ? 'Call Directly' : 'कॉल करें'}</span>
          </a>
        </div>
      </div>

      {/* Advanced Admin Actions Row */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-xl flex flex-wrap items-center gap-2 justify-between">
          <span className="text-xs font-semibold text-slate-500">
            {lang === 'en' ? 'Admin Controls:' : 'एडमिन सेटिंग्स:'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTogglePin?.(job.id)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                job.pinned
                  ? 'bg-emerald-100 text-[#075E54] border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={job.pinned ? 'Unpin Job' : 'Pin Job to Top'}
            >
              <Pin size={13} className={job.pinned ? 'fill-[#075E54]' : ''} />
              <span>{job.pinned ? (lang === 'en' ? 'Pinned' : 'पिन है') : (lang === 'en' ? 'Pin' : 'पिन करें')}</span>
            </button>

            <button
              onClick={() => onTogglePhone?.(job.id)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                job.phone_hidden
                  ? 'bg-[#eefaf7] text-[#075E54] border-[#128C7E]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={job.phone_hidden ? 'Make Phone Public' : 'Mask/Hide Phone'}
            >
              {job.phone_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>
                {job.phone_hidden 
                  ? (lang === 'en' ? 'Hidden' : 'छिपा है') 
                  : (lang === 'en' ? 'Public' : 'सार्वजनिक')}
              </span>
            </button>

            <button
              onClick={() => onDelete?.(job.id)}
              className="p-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs flex items-center gap-1 hover:bg-red-100 transition-colors"
              title="Delete Listing"
            >
              <Trash2 size={13} />
              <span>{lang === 'en' ? 'Delete' : 'हटाएं'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
