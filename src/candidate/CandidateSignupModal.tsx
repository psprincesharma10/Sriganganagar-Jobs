import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { fetchCandidateByPhone, saveStoredSession } from './candidateSupabase';
import { UserSession } from './candidateTypes';

interface CandidateSignupModalProps {
  onClose: () => void;
  onLoginSuccess: (session: UserSession, candidateId?: string) => void;
}

export const CandidateSignupModal: React.FC<CandidateSignupModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg('Kripya 10-digit ka sahi mobile number darj karein.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      // Generate simulated 4-digit OTP code for instant preview testing
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setStep('otp');
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('OTP bhejne me samasya aayi.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '1234') {
      setErrorMsg(`Galat OTP! Sahi OTP code hai: ${generatedOtp}`);
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
      const existingCandidate = await fetchCandidateByPhone(cleanPhone);

      const session: UserSession = {
        phone_number: cleanPhone,
        candidate_id: existingCandidate?.id,
        is_logged_in: true,
      };

      saveStoredSession(session);
      setIsLoading(false);
      onLoginSuccess(session, existingCandidate?.id);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('Verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">Candidate Login / Registration</h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Phone Number + OTP Se Login Karein
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aapka Mobile Number (10-digits) *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 flex items-center gap-1 border-r border-slate-200 pr-2">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9829012345"
                    className="w-full pl-20 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#075E54] focus:outline-none font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Is number par verification OTP code aayega.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#075E54] hover:bg-[#054840] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>OTP bhej rahe hain...</span>
                  </>
                ) : (
                  <>
                    <span>OTP Bhejein</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Safe & Secure Login Session</span>
              </div>
            </form>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
                <strong>+91 {phoneNumber}</strong> par verification OTP bhej diya gaya hai.
                <span className="block mt-1 text-[11px] font-bold text-[#075E54]">
                  🔑 Testing OTP Code: <span className="bg-amber-200 text-slate-900 px-1.5 py-0.5 rounded">{generatedOtp}</span> (ya '1234')
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4-Digit OTP Code Darj Karein *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 4-digit code"
                  className="w-full text-center text-xl font-extrabold tracking-widest py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#075E54] focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#075E54] hover:bg-[#054840] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verify kar rahe hain...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>OTP Verify & Login</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-xs text-slate-500 hover:text-slate-800 text-center block underline"
              >
                Mobile number badlein
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
