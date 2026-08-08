import React, { useState } from 'react';
import { X, Lock, CheckCircle, ShieldCheck, QrCode, Phone, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Candidate } from './candidateTypes';
import { recordContactUnlock } from './candidateSupabase';

interface RazorpayUnlockModalProps {
  candidate: Candidate;
  onClose: () => void;
  onSuccessUnlock: (candidateId: string) => void;
}

export const RazorpayUnlockModal: React.FC<RazorpayUnlockModalProps> = ({
  candidate,
  onClose,
  onSuccessUnlock,
}) => {
  const unlockAmount = import.meta.env.VITE_UNLOCK_PRICE_INR || '15';
  const [employerPhone, setEmployerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulateRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = employerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Kripya apna 10-digit mobile number enter karein.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate Razorpay gateway processing delay
      await new Promise((res) => setTimeout(res, 1200));

      const paymentId = `pay_rzp_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      await recordContactUnlock(
        candidate.id,
        cleanPhone,
        Number(unlockAmount),
        paymentId
      );

      setIsProcessing(false);
      setPaymentSuccess(true);

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      onSuccessUnlock(candidate.id);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg('Payment process me errror aaya. Kripya punah prayas karein.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Unlock Candidate Contact</h3>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {!paymentSuccess ? (
            <form onSubmit={handleSimulateRazorpayPayment} className="space-y-4">
              {/* Candidate Info Summary Box */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-3">
                <img
                  src={
                    candidate.photo_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={candidate.full_name}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-300"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 truncate text-sm">
                    {candidate.full_name}
                  </h4>
                  <p className="text-xs text-emerald-800 font-semibold">
                    {candidate.skill_category} ({candidate.experience_years}Y Exp)
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {candidate.district}, {candidate.state}
                  </p>
                </div>
              </div>

              {/* Price Callout */}
              <div className="text-center bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-xs text-slate-500 block uppercase font-bold tracking-wider">
                  Contact Unlock Fee
                </span>
                <div className="flex items-center justify-center gap-1 my-0.5">
                  <span className="text-2xl font-extrabold text-[#075E54]">₹{unlockAmount}</span>
                  <span className="text-xs text-slate-500 font-medium">only (One-time)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Direct Phone Call & WhatsApp Number access instantly
                </p>
              </div>

              {/* Employer Phone Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Aapka Mobile Number (Employer Phone) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Ye number record me save rahega taaki dobara pay na karna pade.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Simulated UPI & Razorpay Payment Methods */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block uppercase">
                  Supported Payment Gateways
                </span>
                <div className="flex items-center justify-around text-xs text-slate-700 font-semibold">
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-xs">
                    GPay / PhonePe UPI
                  </span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-xs">
                    Paytm UPI
                  </span>
                  <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-xs">
                    Razorpay
                  </span>
                </div>
              </div>

              {/* Payment Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#075E54] hover:bg-[#054840] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 text-emerald-300" />
                    <span>Pay ₹{unlockAmount} & Unlock Number</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant 256-bit Secure Unlock guarantee</span>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Candidate ka Phone Number safaltapurvak unlock ho gaya hai.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <span className="text-xs text-emerald-800 font-bold block uppercase">
                  Candidate Phone Number
                </span>
                <span className="text-xl font-extrabold text-[#075E54] tracking-wider block mt-1">
                  {candidate.phone_number}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${candidate.phone_number}`}
                  className="bg-[#075E54] hover:bg-[#054840] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/91${candidate.phone_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
