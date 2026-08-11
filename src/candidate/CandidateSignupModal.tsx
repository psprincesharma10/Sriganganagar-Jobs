import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { registerCandidate, loginCandidate } from './candidateSupabase';
import { UserSession } from './candidateTypes';

interface CandidateSignupModalProps {
  onClose: () => void;
  onLoginSuccess: (session: UserSession, candidateId?: string) => void;
}

export const CandidateSignupModal: React.FC<CandidateSignupModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length !== 10) {
      setErrorMsg('Kripya 10-digit ka sahi mobile number darj karein.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password kam se kam 4 characters ka hona chahiye.');
      return;
    }

    setIsLoading(true);
    try {
      const result = mode === 'register'
        ? await registerCandidate(clean, password)
        : await loginCandidate(clean, password);

      setIsLoading(false);

      if (!result.success || !result.session) {
        setErrorMsg(result.message);
        return;
      }
      onLoginSuccess(result.session, result.session.candidate_id);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('Kuch samasya aayi, dobara try karein.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg">Candidate Register / Login</h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Mobile Number + Password Se Login Karein
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === 'register'
                ? 'text-[#075E54] border-b-2 border-[#075E54] bg-emerald-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Naya Register Karein
          </button>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === 'login'
                ? 'text-[#075E54] border-b-2 border-[#075E54] bg-emerald-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Already Registered? Login
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9829012345"
                  className="w-full pl-20 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#075E54] focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {mode === 'register' ? 'Apna Password Banayein (min 4 characters) *' : 'Apna Password Darj Karein *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Koi bhi password chunein' : 'Apna password'}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#075E54] focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  Ye password aapko yaad rakhna hai — future me isi mobile number aur password se login karein.
                </p>
              )}
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
                  <span>{mode === 'register' ? 'Register ho raha hai...' : 'Login ho raha hai...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{mode === 'register' ? 'Register Karein' : 'Login Karein'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Koi OTP nahi — sirf mobile number aur aapka apna password</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
