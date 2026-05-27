import { Ad, Language } from '../types';
import { Phone, CheckCircle, XCircle, Trash2, Award, ShieldAlert } from 'lucide-react';

interface AdBannerProps {
  key?: string | number;
  ad: Ad;
  lang: Language;
  isAdmin: boolean;
  layout?: 'feed' | 'sidebar' | 'banner';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeature?: (id: string) => void;
}

export default function AdBanner({
  ad,
  lang,
  isAdmin,
  layout = 'feed',
  onApprove,
  onReject,
  onDelete,
  onToggleFeature,
}: AdBannerProps) {
  const businessName = ad.business_name;
  const description = ad.short_description;

  return (
    <div 
      id={`ad-card-${ad.id}`}
      className={`rounded-2xl overflow-hidden border-2 bg-white transition-all duration-300 ${
        ad.featured 
          ? 'border-amber-400 shadow-md ring-2 ring-amber-100' 
          : 'border-slate-100 hover:border-slate-200 shadow-sm'
      } ${layout === 'sidebar' ? 'flex flex-col' : 'flex flex-col sm:flex-row'}`}
    >
      {/* Banner Image */}
      <div 
        className={`relative bg-slate-950 flex-shrink-0 flex items-center justify-center overflow-hidden ${
          layout === 'sidebar' 
            ? 'h-44 w-full' 
            : 'h-48 w-full sm:w-64'
        }`}
      >
        <img 
          src={ad.image_url} 
          alt={businessName} 
          className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Sponsored Ribbon */}
        <div className="absolute top-3 left-3 bg-[#075E54] text-[#EFE5DD] text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-md tracking-wider">
          {lang === 'en' ? 'Sponsored' : 'प्रायोजित (Adv)'}
        </div>

        {ad.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
            <Award size={11} className="fill-slate-900" />
            <span>{lang === 'en' ? 'Featured' : 'विशेष'}</span>
          </div>
        )}
      </div>

      {/* Content Side */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-800 tracking-tight leading-snug mb-1">
            {businessName}
          </h4>
          
          <p className="text-xs text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">
            {description}
          </p>
          
          <p className="text-[10px] text-slate-400 mb-4 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
            {lang === 'en' ? 'Sri Ganganagar Local Advertise' : 'श्रीगंगानगर लोकल विज्ञापन'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-50">
          {ad.contact && (
            <div>
              <span className="text-[10px] text-slate-400 block font-bold tracking-wider uppercase">
                {lang === 'en' ? 'Inquiry Number' : 'पूछताछ नंबर'}
              </span>
              <span className="font-mono text-sm font-bold text-slate-800">
                {ad.contact}
              </span>
            </div>
          )}

          {ad.contact && (
            <a 
              href={`tel:${ad.contact}`}
              className="px-3.5 py-1.5 text-xs font-bold text-[#075E54] bg-[#eefaf7] hover:bg-[#d8f4ed] border-2 border-[#128C7E] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Phone size={12} />
              <span>{lang === 'en' ? 'Call' : 'कॉल'}</span>
            </a>
          )}
        </div>

        {/* Administration Box (Visible when user is in Admin mode) */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-red-100 bg-red-50/50 p-2.5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 uppercase">
                <ShieldAlert size={12} className="text-red-500" />
                <span>Ad Control</span>
              </span>
              <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                ad.status === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : ad.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {ad.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-lg border border-red-100 shadow-tiny">
              {ad.status !== 'approved' && onApprove && (
                <button
                  onClick={() => onApprove(ad.id)}
                  className="flex-1 py-1 px-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <CheckCircle size={10} />
                  <span>Approve</span>
                </button>
              )}

              {ad.status !== 'rejected' && onReject && (
                <button
                  onClick={() => onReject(ad.id)}
                  className="flex-1 py-1 px-2 text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <XCircle size={10} />
                  <span>Reject</span>
                </button>
              )}

              {onToggleFeature && (
                <button
                  onClick={() => onToggleFeature(ad.id)}
                  className={`flex-1 py-1 px-2 text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors ${
                    ad.featured 
                      ? 'bg-amber-200 text-amber-900 hover:bg-amber-300' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Award size={10} />
                  <span>{ad.featured ? 'Featured' : 'Feature'}</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(ad.id)}
                  className="py-1 px-2 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center justify-center transition-colors"
                  title="Delete Ad"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
