import React from 'react';
import { Ad, Language } from '../types';
import { Phone, Sparkles, AlertTriangle, Check, X, Trash2, Award } from 'lucide-react';

interface BusinessAdCardProps {
  key?: string | number;
  ad: Ad;
  lang: Language;
  isAdmin: boolean;
  layout?: 'sidebar' | 'feed';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFeature?: (id: string) => void;
}

export default function BusinessAdCard({
  ad,
  lang,
  isAdmin,
  layout = 'feed',
  onApprove,
  onReject,
  onDelete,
  onToggleFeature,
}: BusinessAdCardProps) {
  const businessName = ad.business_name;
  const adDescription = ad.ad_description || ad.short_description || '';
  const contactNumber = ad.contact_number || ad.contact || '';
  const imageUrl = ad.image_url;

  const cleanPhone = contactNumber.replace(/\D/g, '');

  return (
    <div 
      id={`business-ad-card-${ad.id}`}
      className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
        ad.featured 
          ? 'border-amber-400 bg-amber-50/20 shadow-md ring-2 ring-amber-400/20' 
          : 'border-amber-200/60 bg-gradient-to-tr from-amber-50/10 to-amber-50/40 shadow-xs'
      } ${
        layout === 'sidebar' 
          ? 'flex flex-col space-y-3 p-3.5' 
          : 'flex flex-col sm:flex-row gap-4 p-4 items-stretch'
      }`}
    >
      {/* Visual Indicator of Sponsorship */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
          <Sparkles size={9} className="fill-white" />
          <span>{lang === 'en' ? 'Sponsored' : 'प्रायोजित'}</span>
        </span>
      </div>

      {/* Ad Image */}
      {imageUrl && (
        <div 
          className={`relative overflow-hidden rounded-2xl bg-slate-900 flex-shrink-0 ${
            layout === 'sidebar' 
              ? 'w-full h-36' 
              : 'w-full sm:w-48 h-36'
          }`}
        >
          <img 
            src={imageUrl} 
            alt={businessName} 
            className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-grow flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <span className="text-[10px] text-amber-600 block font-black tracking-widest uppercase">
            {lang === 'en' ? '✨ BUSINESS PARTNER' : '✨ बिजनेस पार्टनर'}
          </span>
          
          <h4 className="text-base font-extrabold text-slate-950 tracking-tight leading-snug">
            {businessName}
          </h4>
          
          <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
            {adDescription}
          </p>
        </div>

        {/* Action / Phone Section */}
        <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
          {contactNumber && (
            <div>
              <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">
                {lang === 'en' ? 'Contact Partner' : 'व्यवसाय नंबर'}
              </span>
              <span className="font-mono text-xs font-black text-slate-800">
                {contactNumber}
              </span>
            </div>
          )}

          {contactNumber && (
            <a 
              href={`tel:${cleanPhone}`}
              className="px-3.5 py-1.5 text-xs font-black text-slate-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Phone size={12} className="text-slate-950 fill-slate-950" />
              <span>{lang === 'en' ? 'Call Now' : 'अभी कॉल करें'}</span>
            </a>
          )}
        </div>

        {/* Administration Box if logged in as Admin */}
        {isAdmin && (
          <div className="mt-3 pt-2 border-t border-red-100 bg-red-50/40 p-2 rounded-xl text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-red-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={11} /> Admin Panel ({ad.status})
              </span>
              {onToggleFeature && (
                <button
                  type="button"
                  onClick={() => onToggleFeature(ad.id)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border transition-all ${
                    ad.featured 
                      ? 'bg-amber-200 border-amber-300 text-amber-955' 
                      : 'bg-white border-slate-205 text-slate-600'
                  }`}
                >
                  {ad.featured ? '★ Featured' : '☆ Feature'}
                </button>
              )}
            </div>

            <div className="flex gap-1">
              {ad.status !== 'approved' && ad.status !== 'active' && onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(ad.id)}
                  className="flex-1 py-1 text-[9px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded"
                >
                  Approve/Active
                </button>
              )}
              {ad.status !== 'rejected' && onReject && (
                <button
                  type="button"
                  onClick={() => onReject(ad.id)}
                  className="flex-1 py-1 text-[9px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded"
                >
                  Reject
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(ad.id)}
                  className="px-1.5 py-1 text-[9px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded flex items-center justify-center"
                  title="Delete Ad"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
