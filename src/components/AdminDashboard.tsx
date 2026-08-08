import React, { useState, useEffect } from 'react';
import { Job, Ad, Language } from '../types';
import { Shield, Clock, Eye, EyeOff, Check, X, Pin, Trash2, Award, LogOut, Users, CheckCircle2, XCircle, Search, Loader2, AlertTriangle, DollarSign } from 'lucide-react';
import { Candidate, ContactUnlock, ProfileReport } from '../candidate/candidateTypes';
import { fetchAllCandidates, toggleCandidateVerification, deleteCandidateProfile, fetchAllUnlocks, fetchAllReports } from '../candidate/candidateSupabase';

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
  jobs, ads, lang, expiryMonths, onSetExpiry,
  onApproveAd, onRejectAd, onDeleteAd, onToggleAdFeature,
  onDeleteJob, onToggleJobPhone, onToggleJobPin, onLogout,
}: AdminDashboardProps) {

  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'unlocks' | 'reports'>('jobs');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [unlocks, setUnlocks] = useState<ContactUnlock[]>([]);
  const [reports, setReports] = useState<ProfileReport[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');

  const pendingAds = ads.filter(ad => ad.status === 'pending');
  const activeAds = ads.filter(ad => ad.status === 'approved');
  const pinnedJobsCount = jobs.filter(j => j.pinned).length;

  useEffect(() => {
    if (activeTab === 'candidates' || activeTab === 'unlocks' || activeTab === 'reports') {
      loadCandidateData();
    }
  }, [activeTab]);

  const loadCandidateData = async () => {
    setIsLoadingCandidates(true);
    const [cands, unl, rep] = await Promise.all([
      fetchAllCandidates(),
      fetchAllUnlocks(),
      fetchAllReports(),
    ]);
    setCandidates(cands);
    setUnlocks(unl);
    setReports(rep);
    setIsLoadingCandidates(false);
  };

  const handleVerifyCandidate = async (id: string, current: boolean) => {
    await toggleCandidateVerification(id, !current);
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, is_verified: !current } : c));
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm('Is candidate profile ko delete karna chahte hain?')) return;
    await deleteCandidateProfile(id);
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const filteredCandidates = candidates.filter(c =>
    !candidateSearch ||
    c.full_name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.skill_category.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.district.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  const totalUnlockRevenue = unlocks.reduce((sum, u) => sum + (u.amount_paid || 0), 0);

  return (
    <div id="admin-dashboard-container" className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-md space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-[#075E54]/10 text-[#075E54] rounded-2xl">
            <Shield size={22} className="fill-[#075E54]/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none">Admin Control Center</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Jobs • Candidates • Revenue • Reports</p>
          </div>
        </div>
        <button onClick={onLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer">
          <LogOut size={14} />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Jobs</span>
          <span className="text-2xl font-black text-slate-800">{jobs.length}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Candidates</span>
          <span className="text-2xl font-black text-emerald-600">{candidates.length || '—'}</span>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pending Ads</span>
          <span className="text-2xl font-black text-amber-500">{pendingAds.length}</span>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Unlock Revenue</span>
          <span className="text-2xl font-black text-emerald-700">₹{totalUnlockRevenue || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-slate-100 pb-3">
        {[
          { id: 'jobs', label: '💼 Jobs & Ads' },
          { id: 'candidates', label: '👷 Candidates' },
          { id: 'unlocks', label: '💰 Unlocks' },
          { id: 'reports', label: '🚨 Reports' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#075E54] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Jobs & Ads */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          {/* Job Expiry Settings */}
          <div className="p-4 rounded-2xl bg-[#eefaf7] border border-[#128C7E]/20 space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock size={16} className="text-[#128C7E]" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider">Job Expiry Controls</h3>
            </div>
            <div className="flex items-center gap-2 max-w-xs">
              <button onClick={() => onSetExpiry(6)} className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${expiryMonths === 6 ? 'bg-[#128C7E] text-white border-[#075E54]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>6 Months</button>
              <button onClick={() => onSetExpiry(12)} className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${expiryMonths === 12 ? 'bg-[#128C7E] text-white border-[#075E54]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>1 Year</button>
            </div>
          </div>

          {/* Pending Ads */}
          {pendingAds.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800">Pending Ads ({pendingAds.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingAds.map((ad) => (
                  <div key={ad.id} className="border-2 border-amber-200 rounded-2xl overflow-hidden bg-white flex flex-col p-3.5 space-y-3">
                    <div className="flex gap-3">
                      <img src={ad.image_url} alt={ad.business_name} className="w-20 h-20 object-cover rounded-xl bg-slate-100" referrerPolicy="no-referrer" />
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{ad.ad_title || ad.business_name}</h4>
                        <p className="text-[10px] text-emerald-800 font-bold">{ad.business_name}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{ad.ad_description || ad.short_description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-slate-50">
                      <button onClick={() => onApproveAd(ad.id)} className="flex-1 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center gap-1 cursor-pointer"><Check size={14} />Approve</button>
                      <button onClick={() => onRejectAd(ad.id)} className="flex-1 py-2 text-xs font-bold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center gap-1 cursor-pointer"><X size={14} />Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                <tr><th className="p-3">Title</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 truncate max-w-[150px]">{lang === 'en' ? job.job_title_en : job.job_title_hi}</td>
                    <td className="p-3 font-mono text-[10px] uppercase text-[#128C7E]">Job</td>
                    <td className="p-3"><span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${job.pinned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>{job.pinned ? 'Pinned' : 'Active'}</span></td>
                    <td className="p-3 text-right space-x-1.5">
                      <button onClick={() => onToggleJobPin(job.id)} className="p-1 hover:bg-slate-100 text-[#075E54] rounded" title="Toggle Pin"><Pin size={13} className={job.pinned ? 'fill-[#075E54]' : ''} /></button>
                      <button onClick={() => onToggleJobPhone(job.id)} className="p-1 hover:bg-slate-100 text-slate-600 rounded" title="Toggle Phone">{job.phone_hidden ? <EyeOff size={13} /> : <Eye size={13} />}</button>
                      <button onClick={() => onDeleteJob(job.id)} className="p-1 hover:bg-red-50 text-red-600 rounded" title="Delete"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
                {ads.filter(a => a.status === 'approved').map(ad => (
                  <tr key={ad.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 truncate max-w-[150px]">{ad.business_name}</td>
                    <td className="p-3 font-mono text-[10px] uppercase text-amber-600">Ad</td>
                    <td className="p-3"><span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${ad.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>{ad.featured ? 'Featured' : 'Approved'}</span></td>
                    <td className="p-3 text-right space-x-1.5">
                      <button onClick={() => onToggleAdFeature(ad.id)} className="p-1 hover:bg-slate-100 text-amber-500 rounded"><Award size={13} className={ad.featured ? 'fill-amber-500' : ''} /></button>
                      <button onClick={() => onDeleteAd(ad.id)} className="p-1 hover:bg-red-50 text-red-600 rounded"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: Candidates */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-black text-slate-800">👷 Candidate Profiles ({filteredCandidates.length})</h3>
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 flex-1 max-w-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, skill, district..."
                value={candidateSearch}
                onChange={e => setCandidateSearch(e.target.value)}
                className="bg-transparent text-xs outline-none w-full text-slate-700"
              />
            </div>
          </div>

          {isLoadingCandidates ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading candidates...</span>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-sm text-slate-400">
              Koi candidate nahi mila
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Skill</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Verified</th>
                    <th className="p-3">Views</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={c.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'} alt={c.full_name} className="w-8 h-8 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <div className="font-bold text-slate-900 truncate max-w-[120px]">{c.full_name}</div>
                            <div className="text-[10px] text-slate-400">{c.phone_number.slice(0,5)}XXXXX</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="bg-[#075E54] text-white text-[10px] font-bold px-2 py-0.5 rounded">{c.skill_category}</span>
                      </td>
                      <td className="p-3 text-slate-600">{c.district}, {c.state}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {c.is_available ? 'Available' : 'Busy'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleVerifyCandidate(c.id, c.is_verified)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-colors ${c.is_verified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {c.is_verified ? <><CheckCircle2 size={11} /> Verified</> : <><XCircle size={11} /> Unverified</>}
                        </button>
                      </td>
                      <td className="p-3 font-bold text-slate-700">{c.view_count}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteCandidate(c.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete Profile">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: Unlocks Revenue */}
      {activeTab === 'unlocks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">💰 Contact Unlock Revenue</h3>
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-black text-sm">
              Total: ₹{totalUnlockRevenue}
            </div>
          </div>

          {isLoadingCandidates ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : unlocks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-sm text-slate-400">
              Abhi koi unlock nahi hua hai
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-3">Employer Phone</th>
                    <th className="p-3">Candidate ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unlocks.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">{u.employer_phone}</td>
                      <td className="p-3 text-slate-400 truncate max-w-[100px]">{u.candidate_id.slice(0,8)}...</td>
                      <td className="p-3 font-black text-emerald-700">₹{u.amount_paid}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-400 truncate max-w-[100px]">{u.payment_id}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${u.payment_status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {u.payment_status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(u.unlocked_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800">🚨 Fake Profile Reports ({reports.length})</h3>

          {isLoadingCandidates ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-sm text-slate-400">
              ✅ Koi report nahi hai — sab theek hai!
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className="p-4 border-2 border-red-100 rounded-2xl bg-red-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-xs font-black text-red-700">Report</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{r.reason}</p>
                  {r.reporter_contact && (
                    <p className="text-[10px] text-slate-500">Reporter: {r.reporter_contact}</p>
                  )}
                  {r.candidate_id && (
                    <p className="text-[10px] text-slate-500 font-mono">Candidate ID: {r.candidate_id.slice(0,12)}...</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
