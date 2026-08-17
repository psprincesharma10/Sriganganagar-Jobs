import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Pencil,
  DollarSign,
  Phone,
  MessageSquare,
  Users,
  Search,
  Loader2,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Candidate, ContactUnlock, EmployerInquiry, ProfileReport } from './candidateTypes';
import {
  fetchAllCandidates,
  toggleCandidateVerification,
  toggleCandidateAvailability,
  deleteCandidateProfile,
  fetchAllUnlocks,
  fetchAllInquiries,
  fetchAllReports
} from './candidateSupabase';

interface AdminDashboardViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<'candidates' | 'unlocks' | 'inquiries' | 'reports'>('candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [unlocks, setUnlocks] = useState<ContactUnlock[]>([]);
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>([]);
  const [reports, setReports] = useState<ProfileReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadAll() {
      setIsLoading(true);
      const [cands, unl, inq, rep] = await Promise.all([
        fetchAllCandidates(),
        fetchAllUnlocks(),
        fetchAllInquiries(),
        fetchAllReports(),
      ]);
      setCandidates(cands);
      setUnlocks(unl);
      setInquiries(inq);
      setReports(rep);
      setIsLoading(false);
    }
    loadAll();
  }, []);

  const handleToggleVerify = async (candId: string, currentVerified: boolean) => {
    const updated = !currentVerified;
    await toggleCandidateVerification(candId, updated);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, is_verified: updated } : c))
    );
  };

  const handleToggleAvail = async (candId: string, currentAvail: boolean) => {
    const updated = !currentAvail;
    await toggleCandidateAvailability(candId, updated);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, is_available: updated } : c))
    );
  };

  const handleDelete = async (candId: string) => {
    if (window.confirm('Delete candidate profile?')) {
      await deleteCandidateProfile(candId);
      setCandidates((prev) => prev.filter((c) => c.id !== candId));
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.phone_number.includes(q) ||
      c.skill_category.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  });

  const totalRevenue = unlocks.reduce((sum, u) => sum + Number(u.amount_paid || 15), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Title */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 p-2.5 rounded-2xl text-slate-950 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Admin Management Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Sri Ganganagar Jobs (sriganganagarjobs.in) Platform Verification & Revenue Logs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              Total Unlocks Revenue
            </span>
            <span className="text-lg font-black text-amber-400">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('candidates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'candidates'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Candidates ({candidates.length})
        </button>

        <button
          onClick={() => setTab('unlocks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'unlocks'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Contact Unlocks Logs ({unlocks.length})
        </button>

        <button
          onClick={() => setTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            tab === 'inquiries'
              ? 'bg-[#075E54] text-white shadow'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Employer Inquiries ({inquiries.length})
        </button>

        <button
          onClick={() => setTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            tab === 'reports'
              ? 'bg-red-600 text-white shadow'
              : 'bg-white hover:bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Fake Profile Reports ({reports.length})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-[#075E54] animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading admin data...</p>
        </div>
      ) : tab === 'candidates' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#075E54] focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Skill & Exp</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Views</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={
                          c.photo_url ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                        }
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{c.full_name}</span>
                        <span className="text-[10px] text-slate-500">{c.phone_number}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#075E54]">{c.skill_category}</span>
                      <span className="block text-[10px] text-slate-500">{c.experience_years}Y Exp</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {c.village_or_town || c.tahsil}, {c.district}, {c.state}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleAvail(c.id, c.is_available)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.is_available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {c.is_available ? 'Available' : 'Busy'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleVerify(c.id, c.is_verified)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          c.is_verified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.is_verified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <span>Unverified</span>
                        )}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-700">{c.view_count || 0}</td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => onNavigate('detail', c.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate('admin-edit-profile', c.phone_number)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold"
                        title="Edit Profile"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded font-bold"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'unlocks' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Contact Unlocks Transactions Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="p-3">Unlock ID</th>
                  <th className="p-3">Candidate ID</th>
                  <th className="p-3">Employer Phone</th>
                  <th className="p-3">Amount Paid</th>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unlocks.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[10px] text-slate-500">{u.id}</td>
                    <td className="p-3 font-mono text-[10px] text-[#075E54]">{u.candidate_id}</td>
                    <td className="p-3 font-bold text-slate-800">{u.employer_phone}</td>
                    <td className="p-3 font-extrabold text-emerald-700">₹{u.amount_paid}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-500">{u.payment_id}</td>
                    <td className="p-3 text-slate-500">{new Date(u.unlocked_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'inquiries' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Employer Inquiries</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="p-3">Employer Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Candidate ID</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{inq.employer_name}</td>
                    <td className="p-3 font-bold text-slate-800">{inq.employer_phone}</td>
                    <td className="p-3 font-mono text-[10px] text-[#075E54]">{inq.candidate_id}</td>
                    <td className="p-3 text-slate-600">{inq.message || '-'}</td>
                    <td className="p-3 text-slate-500">{new Date(inq.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Fake Profile / Misconduct Reports</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-red-50 border-b border-red-200 text-red-900 font-bold uppercase">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Candidate ID / Target</th>
                  <th className="p-3">Reason / Details</th>
                  <th className="p-3">Reporter Contact</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-red-50/50">
                    <td className="p-3 font-mono text-[10px] text-slate-500">{rep.id}</td>
                    <td className="p-3 font-mono text-[10px] text-[#075E54] font-bold">
                      {rep.candidate_id || 'General'}
                    </td>
                    <td className="p-3 text-slate-800 font-medium">{rep.reason}</td>
                    <td className="p-3 text-slate-600">{rep.reporter_contact || '-'}</td>
                    <td className="p-3 text-slate-500">{new Date(rep.created_at).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      {rep.candidate_id && (
                        <button
                          onClick={() => handleDelete(rep.candidate_id!)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Candidate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
