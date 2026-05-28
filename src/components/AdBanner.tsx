import { Ad, Language } from '../types';
import { Phone, CheckCircle, XCircle, Trash2, Award, ShieldAlert, Navigation, MessageSquare, Globe, ExternalLink, Sparkles } from 'lucide-react';

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
  const adTitle = ad.ad_title || '';
  const adDescription = ad.ad_description || ad.short_description || '';
  const phone = ad.phone_number || ad.contact || '';
  const whatsapp = ad.whatsapp_number || phone;
  const website = ad.website_url || '';
  const location = ad.location || 'Sri Ganganagar';
  const adWhatsappUrl = ad.whatsapp_url || '';

  const cleanPhone = phone.replace(/\D/g, '');
  const cleanWA = whatsapp.replace(/\D/g, '');
  const legacyWhatsappUrl = cleanWA ? `https://wa.me/91${cleanWA}?text=${encodeURIComponent(lang === 'en' ? 'Hello, saw your sponsored ad on SriGanganagar Jobs Board' : 'नमस्ते, मैंने श्रीगंगानगर जॉब्स पर आपका प्रायोजित विज्ञापन देखा।')}` : '';
  const finalWhatsappUrl = adWhatsappUrl || legacyWhatsappUrl;

  return (
    <div 
      id={`ad-card-${ad.id}`}
      className={`rounded-3xl overflow-hidden border-2 bg-gradient-to-br from-white to-amber-50/5 hover:to-amber-50/20 transition-all duration-300 ${
        ad.featured 
          ? 'border-amber-400 shadow-lg ring-4 ring-amber-100/50 scale-[1.01]' 
          : 'border-slate-150 hover:border-slate-300 shadow-sm'
      } ${layout === 'sidebar' ? 'flex flex-col' : 'flex flex-col sm:flex-row'}`}
    >
      {/* Banner Left/Top Section */}
      <div 
        className={`relative bg-slate-950 flex-shrink-0 flex items-center justify-center overflow-hidden group ${
          layout === 'sidebar' 
            ? 'h-48 w-full' 
            : 'h-52 w-full sm:w-72'
        }`}
      >
        <img 
          src={ad.image_url} 
          alt={businessName} 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Real Sponsored Badge */}
        <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-md tracking-widest flex items-center gap-1">
          <Sparkles size={10} className="fill-white" />
          <span>{lang === 'en' ? 'Sponsored' : 'प्रायोजित विज्ञापन'}</span>
        </div>

        {ad.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
            <Award size={11} className="fill-slate-950" />
            <span>{lang === 'en' ? 'Featured' : 'विशेष'}</span>
          </div>
        )}
      </div>

      {/* Content Side Section */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] text-amber-600 block font-extrabold tracking-widest uppercase mb-1 flex items-center gap-1">
            <span>{lang === 'en' ? '★ Premium Showcase Partner' : '★ प्रीमियम शोकेस पार्टनर'}</span>
          </span>
          
          <h4 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug mb-2 font-sans">
            {businessName}
          </h4>
          
          <p className="text-xs text-slate-600 mb-4 whitespace-pre-wrap leading-relaxed font-sans">
            {adDescription}
          </p>
        </div>

        {/* Action Triggers Box */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {phone && (
              <div>
                <span className="text-[9px] text-slate-400 block font-bold tracking-wider uppercase">
                  {lang === 'en' ? 'Direct Hotline' : 'पूछताछ हेल्पलाइन'}
                </span>
                <span className="font-mono text-sm font-extrabold text-slate-800">
                  {phone}
                </span>
              </div>
            )}

            {/* Quick Actions Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {phone && (
                <a 
                  href={`tel:${cleanPhone}`}
                  className="px-4 py-2 text-xs font-black text-slate-950 bg-[#eefaf7] hover:bg-[#d8f4ed] border-2 border-emerald-500 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Phone size={13} className="text-emerald-600" />
                  <span>{lang === 'en' ? 'Call Now' : 'अभी कॉल करें'}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Administration Controls Box (Authenticated Admin Mode) */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-red-100 bg-red-50/50 p-3 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-rose-700 flex items-center gap-1 uppercase tracking-wider">
                <ShieldAlert size={12} className="text-red-500" />
                <span>Ad Control & Pricing Plan</span>
              </span>
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-lg border ${
                ad.status === 'approved' 
                  ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                  : ad.status === 'pending'
                  ? 'bg-amber-100 border-amber-200 text-amber-800'
                  : 'bg-red-100 border-red-200 text-red-800'
              }`}>
                {ad.status}
              </span>
            </div>

            {/* Future Paid Ad Management Internal Fields (Admin Only) */}
            <div className="mb-3 p-2.5 bg-white/90 rounded-xl border border-red-100/50 text-xs space-y-1.5 shadow-2xs">
              <span className="block text-[9px] font-black text-rose-600 uppercase tracking-widest">
                ⚙️ Internal Metadata (For Targeting & Pricing Plans)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-slate-700">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Location Target:</span>
                  <p className="font-extrabold text-slate-900 leading-tight">{location}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider">Duration Days:</span>
                  <p className="font-extrabold text-slate-900 leading-tight">{ad.expiry_days || 30} Days</p>
                </div>
                {website && (
                  <div className="col-span-2 border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Website URL:</span>
                    <a href={website} target="_blank" rel="noreferrer" className="block text-blue-600 font-extrabold truncate hover:underline">
                      {website}
                    </a>
                  </div>
                )}
                {finalWhatsappUrl && (
                  <div className="col-span-2 border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">WhatsApp Contact URL:</span>
                    <a href={finalWhatsappUrl} target="_blank" rel="noreferrer" className="block text-emerald-600 font-extrabold truncate hover:underline">
                      {finalWhatsappUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-xl border border-red-100 shadow-xs">
              {ad.status !== 'approved' && onApprove && (
                <button
                  type="button"
                  onClick={() => onApprove(ad.id)}
                  className="flex-1 py-1.5 px-2 text-[10px] font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCircle size={11} />
                  <span>Approve</span>
                </button>
              )}

              {ad.status !== 'rejected' && onReject && (
                <button
                  type="button"
                  onClick={() => onReject(ad.id)}
                  className="flex-1 py-1.5 px-2 text-[10px] font-black text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <XCircle size={11} />
                  <span>Reject</span>
                </button>
              )}

              {onToggleFeature && (
                <button
                  type="button"
                  onClick={() => onToggleFeature(ad.id)}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                    ad.featured 
                      ? 'bg-amber-200 border-amber-305 text-amber-950 hover:bg-amber-300' 
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Award size={11} />
                  <span>{ad.featured ? 'Featured' : 'Feature'}</span>
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(ad.id)}
                  className="py-1.5 px-3 text-[10px] font-black text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Delete Ad Permanently"
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
