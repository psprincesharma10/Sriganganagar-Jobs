import { Job, Ad, Language } from '../types';
import { Shield, Clock, Eye, EyeOff, Check, X, Pin, Trash2, Award, LogOut, CheckCircle, RefreshCcw } from 'lucide-react';

interface AdminDashboardProps {
  jobs: Job[];
  ads: Ad[];
  lang: Language;
  expiryMonths: number;
  onSetExpiry: (months: number) => void;
  onApproveAd: (id: string) => void;
  onRejectAd: (id: string) => void;
  onDeleteAd: (id: string) => void;
  onToggleAdFeature: (id: string) => void;
  onDeleteJob: (id: string) => void;
  onToggleJobPhone: (id: string) => void;
  onToggleJobPin: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  jobs,
  ads,
  lang,
  expiryMonths,
  onSetExpiry,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onToggleAdFeature,
  onDeleteJob,
  onToggleJobPhone,
  onToggleJobPin,
  onLogout,
}: AdminDashboardProps) {
  
  const pendingAds = ads.filter(ad => ad.status === 'pending');
  const activeAds = ads.filter(ad => ad.status === 'approved' || ad.status === 'active' || ad.is_active === true);
  const pinnedJobsCount = jobs.filter(j => j.pinned).length;

  return (
    <div id="admin-dashboard-container" className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-md space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-[#075E54]/10 text-[#075E54] rounded-2xl">
            <Shield size={22} className="fill-[#075E54]/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none">
              {lang === 'en' ? 'Admin Control Center' : 'एडमिन नियंत्रण केंद्र'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {lang === 'en' ? 'Manage jobs, ads, and system preferences.' : 'जॉब, विज्ञापन और सामान्य सेटिंग्स प्रबंधित करें।'}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          <span>{lang === 'en' ? 'Exit Admin Mode' : 'एडमिन से लॉगआउट'}</span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {lang === 'en' ? 'Total Jobs' : 'कुल नौकरियां'}
          </span>
          <span className="text-2xl font-black text-slate-800">{jobs.length}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {lang === 'en' ? 'Pinned Jobs' : 'पिन की गई जॉब्स'}
          </span>
          <span className="text-2xl font-black text-[#128C7E]">{pinnedJobsCount}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {lang === 'en' ? 'Pending Ads' : 'मंज़ूरी हेतु विज्ञापन'}
          </span>
          <span className="text-2xl font-black text-amber-500">{pendingAds.length}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            {lang === 'en' ? 'Active Ads' : 'कुल मुख्य विज्ञापन'}
          </span>
          <span className="text-2xl font-black text-slate-700">{activeAds.length}</span>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="p-4 rounded-2xl bg-[#eefaf7] border border-[#128C7E]/20 space-y-3">
        <div className="flex items-center gap-2 text-slate-800">
          <Clock size={16} className="text-[#128C7E]" />
          <h3 className="text-xs uppercase font-extrabold tracking-wider">
            {lang === 'en' ? 'Job Expiry Controls' : 'जॉब समाप्ति अवधि नियंत्रण'}
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {lang === 'en' 
            ? 'Choose how long any newly posted job remains on the feed of Sri Ganganagar before the auto-delete system triggers' 
            : 'चुनें कि कोई नई पोस्ट की गई जॉब ऑटो-डिलीट होने से पहले कितने समय तक फीड पर लाइव रहेगी:'}
        </p>

        <div className="flex items-center gap-2 max-w-xs">
          <button
            onClick={() => onSetExpiry(6)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
              expiryMonths === 6
                ? 'bg-[#128C7E] text-white border-[#075E54] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lang === 'en' ? '6 Months' : '6 महीने'}
          </button>
          
          <button
            onClick={() => onSetExpiry(12)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
              expiryMonths === 12
                ? 'bg-[#128C7E] text-white border-[#075E54] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {lang === 'en' ? '1 Year (12M)' : '1 साल (12 महीने)'}
          </button>
        </div>
      </div>

      {/* Ads Approval and list queue */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-800">
          {lang === 'en' ? 'Pending Ads Verification Queue' : 'सत्यापन के लिए लंबित विज्ञापन कतार'}
        </h3>

        {pendingAds.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl text-xs text-slate-400">
            {lang === 'en' ? 'No design ads waiting for approval.' : 'मंज़ूरी की प्रतीक्षा में कोई व्यावसायिक विज्ञापन कतार में नहीं हैं।'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAds.map((ad) => (
              <div key={ad.id} className="border-2 border-amber-200 rounded-2xl overflow-hidden bg-white flex flex-col p-3.5 space-y-3">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={ad.image_url} 
                      alt={ad.business_name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">
                      {ad.ad_title || ad.business_name}
                    </h4>
                    <p className="text-[10px] text-emerald-800 font-bold">
                      Business: {ad.business_name} • {ad.location || 'Sri Ganganagar'}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {ad.ad_description || ad.short_description}
                    </p>
                    {ad.contact && (
                      <p className="text-xs font-mono font-bold text-slate-500">Contact: {ad.contact}</p>
                    )}
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Pending Approval
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => onApproveAd(ad.id)}
                    className="flex-1 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onRejectAd(ad.id)}
                    className="flex-1 py-2 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global quick operations list */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-black text-slate-800">
          {lang === 'en' ? 'Full Listings Quick Directory' : 'सभी विज्ञापनों और नौकरियों की सूची'}
        </h3>
        
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
              <tr>
                <th className="p-3">Title / Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 truncate max-w-[150px]">
                    {lang === 'en' ? job.job_title_en : job.job_title_hi}
                  </td>
                  <td className="p-3 font-mono text-[10px] uppercase text-[#128C7E]">Job</td>
                  <td className="p-3">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      job.pinned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {job.pinned ? 'Pinned' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => onToggleJobPin(job.id)}
                      className="p-1 hover:bg-slate-100 text-[#075E54] rounded"
                      title="Toggle Pin"
                    >
                      <Pin size={13} className={job.pinned ? 'fill-[#075E54]' : ''} />
                    </button>
                    <button
                      onClick={() => onToggleJobPhone(job.id)}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded"
                      title="Toggle Phone Hide/Show"
                    >
                      {job.phone_hidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="p-1 hover:bg-red-50 text-red-600 rounded"
                      title="Delete Listing"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {ads.filter(a => a.status === 'approved' || a.status === 'active' || a.is_active === true).map(ad => (
                <tr key={ad.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 truncate max-w-[150px]">
                    {ad.business_name}
                  </td>
                  <td className="p-3 font-mono text-[10px] uppercase text-amber-600">Ad</td>
                  <td className="p-3">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ad.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {ad.featured ? 'Featured' : 'Approved'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => onToggleAdFeature(ad.id)}
                      className="p-1 hover:bg-slate-100 text-amber-500 rounded"
                      title="Toggle Featured"
                    >
                      <Award size={13} className={ad.featured ? 'fill-amber-500' : ''} />
                    </button>
                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="p-1 hover:bg-red-50 text-red-600 rounded"
                      title="Delete Ad"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
