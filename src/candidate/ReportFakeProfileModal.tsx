import React, { useState } from 'react';
import { AlertTriangle, X, Send, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { submitProfileReport } from './candidateSupabase';

interface ReportFakeProfileModalProps {
  initialCandidateId?: string;
  onClose: () => void;
}

export const ReportFakeProfileModal: React.FC<ReportFakeProfileModalProps> = ({
  initialCandidateId,
  onClose,
}) => {
  const [candidateId, setCandidateId] = useState(initialCandidateId || '');
  const [reason, setReason] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reason.trim()) {
      setErrorMsg('Kripya report ka karan (reason) zaroor darj karein.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitProfileReport(candidateId.trim() || undefined, reason.trim(), reporterContact.trim() || undefined);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Report submit karne me error aaya. Kripya punah prayas karein.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 p-2 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Report Fake Profile</h3>
              <p className="text-[11px] text-red-100">गलत या फर्जी प्रोफाइल की शिकायत करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900">Aapki Report Safaltapurvak Darj Ho Gayi Hai</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Hamari team jald hi is profile ki jaanch karegi aur uchit karyawahi karegi. Sahayog ke liye dhanoyawad!
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-[#075E54] text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-red-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>
                  Agar koi candidate paise ki advance maang kare ya galat jankari de, toh turant yahan report karein.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Candidate ID ya Naam (Optional)
                </label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  placeholder="e.g. cand-12345 ya Ramkumar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Report Ka Karan (Reason for reporting) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Phone number galat hai, advance payment maang rahe hain, etc..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aapka Contact / Phone (Optional - For follow up)
                </label>
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Aapka phone number"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-100 text-red-700 text-xs font-bold rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
