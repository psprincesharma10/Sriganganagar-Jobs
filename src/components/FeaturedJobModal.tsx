import React, { useState } from 'react';
import { Job, Language } from '../types';
import { X, Star, Phone, AlertCircle, Upload, Copy, CheckCircle, Briefcase } from 'lucide-react';

interface FeaturedJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPostFeaturedJob: (jobData: any) => void;
}

const FEATURED_PRICE = 199;
const YOUR_UPI_ID = '9309352063-2@ibl';
const YOUR_NAME = 'Prince Sharma';
const YOUR_WHATSAPP = '919309352063';

const JOB_CATEGORIES = [
  { en: 'Full Time', hi: 'फुल टाइम' },
  { en: 'Part Time', hi: 'पार्ट टाइम' },
  { en: 'Freelance', hi: 'फ्रीलांस' },
  { en: 'Daily Worker', hi: 'दैनिक मजदूर' },
  { en: 'Other', hi: 'अन्य' },
];

const CITY_LIST = [
  'Sri Ganganagar','Hanumangarh','Suratgarh','Raisinghnagar','Padampur',
  'Gharsana','Gajsinghpur','Karanpur','Keshrisinghpur','Sangaria',
  'Sadulsahar','Vijaynagar','Jaitsar','Abohar','Anupgarh','Rawatsar',
  'Nohar','Bhadra','Pilibanga','Other',
];

export default function FeaturedJobModal({ isOpen, onClose, lang, onPostFeaturedJob }: FeaturedJobModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'utr' | 'done'>('form');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [posterName, setPosterName] = useState('');
  const [salary, setSalary] = useState('');
  const [city, setCity] = useState('Sri Ganganagar');
  const [errorStr, setErrorStr] = useState('');
  const [copied, setCopied] = useState(false);

  // UTR step
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentTime, setPaymentTime] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [utrError, setUtrError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const upiLink = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${FEATURED_PRICE}&cu=INR&tn=${encodeURIComponent('SGN Featured Job - ' + title)}`;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr('');
    if (!title.trim()) { setErrorStr('Job title required!'); return; }
    if (!category) { setErrorStr('Category select karo!'); return; }
    if (!description.trim()) { setErrorStr('Description required!'); return; }
    const clean = phone.replace(/\D/g, '');
    if (clean.length !== 10) { setErrorStr('Valid 10-digit number daalo!'); return; }

    // Notify admin on WhatsApp
    const msg = encodeURIComponent(
      `⭐ *FEATURED JOB PAYMENT SCREEN KHULA!*\n\n` +
      `📌 *Title:* ${title.trim()}\n` +
      `📍 *City:* ${city}\n` +
      `💰 *Amount:* ₹${FEATURED_PRICE}\n` +
      `📞 *Contact:* ${clean}\n\n` +
      `⚠️ User abhi payment kar raha hai!\n` +
      `www.sriganganagarjobs.in`
    );
    window.open(`https://wa.me/${YOUR_WHATSAPP}?text=${msg}`, '_blank');
    setStep('payment');
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setUtrError('Image 3MB se chhoti honi chahiye!'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUTRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError('');
    if (!utrNumber.trim() || utrNumber.trim().length < 6) { setUtrError('Valid UTR number daalo!'); return; }
    if (!paymentPhone.replace(/\D/g,'') || paymentPhone.replace(/\D/g,'').length !== 10) { setUtrError('Payment wala phone number daalo!'); return; }
    if (!paymentDate) { setUtrError('Payment ki date daalo!'); return; }
    if (!paymentTime) { setUtrError('Payment ka time daalo!'); return; }
    if (!screenshot) { setUtrError('Payment screenshot upload karo!'); return; }

    setSubmitting(true);
    const fullTitle = `${title.trim()} (${category})`;
    const descWithCity = `📍 ${city}\n${description.trim()}${salary ? '\n💰 Salary: ₹' + salary : ''}`;

    onPostFeaturedJob({
      job_title_en: fullTitle,
      job_title_hi: fullTitle,
      job_description_en: descWithCity,
      job_description_hi: descWithCity,
      phone: phone.replace(/\D/g,''),
      poster_name: posterName.trim() || undefined,
      phone_hidden: false,
      is_featured: true,
      salary_range: salary,
      job_type: category,
      utr_number: utrNumber.trim(),
      payment_phone: paymentPhone.replace(/\D/g,''),
      payment_date: `${paymentDate} ${paymentTime}`,
      payment_amount: FEATURED_PRICE,
      payment_screenshot: screenshot,
    });
    setSubmitting(false);
    setStep('done');
  };

  const handleClose = () => {
    setStep('form'); setTitle(''); setCategory(''); setDescription('');
    setPhone(''); setPosterName(''); setSalary(''); setCity('Sri Ganganagar');
    setErrorStr(''); setCopied(false); setUtrNumber(''); setPaymentPhone('');
    setPaymentDate(''); setPaymentTime(''); setScreenshot(''); setUtrError('');
    onClose();
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={step === 'done' ? handleClose : undefined} />
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-t-3xl sm:rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Star size={20} className="fill-slate-900 text-slate-900" />
            <h2 className="font-black text-slate-900 text-base">
              {step === 'form' ? (lang === 'en' ? '⭐ Post Featured Job' : '⭐ फीचर्ड जॉब पोस्ट करें') :
               step === 'payment' ? (lang === 'en' ? '💳 Pay ₹199' : '💳 ₹199 भुगतान करें') :
               step === 'utr' ? (lang === 'en' ? '🧾 Enter Payment Details' : '🧾 भुगतान विवरण भरें') :
               (lang === 'en' ? '✅ Job Live!' : '✅ जॉब लाइव!')}
            </h2>
          </div>
          <button onClick={handleClose} className="p-1.5 hover:bg-black/10 rounded-full cursor-pointer"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-black mb-1">⭐ Featured Job — ₹{FEATURED_PRICE} sirf</p>
                <p>Tumhari job <strong>sabse upar</strong> dikhegi "Featured" badge ke saath — 20 din tak!</p>
              </div>

              {errorStr && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />{errorStr}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Computer Operator, Shop Manager..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white">
                    <option value="">-- Select --</option>
                    {JOB_CATEGORIES.map(c => <option key={c.en} value={c.en}>{lang === 'en' ? c.en : c.hi}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">City *</label>
                  <select value={city} onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white">
                    {CITY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Salary Range (Optional)</label>
                <input type="text" value={salary} onChange={e => setSalary(e.target.value)}
                  placeholder="e.g. 8000-15000 / month"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Description *</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Duties, timing, address, requirements..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone *</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-3 text-slate-400" />
                    <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
                      placeholder="94143XXXXX"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Name / Firm</label>
                  <input type="text" value={posterName} onChange={e => setPosterName(e.target.value)}
                    placeholder="Gupta Traders..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-green-800">Featured Job Price:</p>
                  <p className="text-2xl font-black text-green-700">₹{FEATURED_PRICE}</p>
                  <p className="text-[10px] text-green-600">20 din — Top pe ⭐</p>
                </div>
                <div className="text-right text-xs text-green-600">
                  <p className="font-bold">UPI Payment</p>
                  <p className="text-[10px]">QR se pay karo</p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <Star size={15} />Pay ₹{FEATURED_PRICE} & Continue
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT - QR */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Pay This Amount</p>
                <p className="text-4xl font-black text-amber-700">₹{FEATURED_PRICE}</p>
                <p className="text-xs text-amber-600 mt-1">Featured Job — 20 Days Top Listing</p>
              </div>

              <div className="text-center space-y-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Scan QR Code to Pay</p>
                <div className="flex justify-center">
                  <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`}
                      alt="UPI QR" className="w-44 h-44" />
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">UPI ID</p>
                    <p className="text-sm font-black text-slate-800 font-mono">{YOUR_UPI_ID}</p>
                  </div>
                  <button onClick={copyUpi}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 rounded-xl text-xs font-black text-slate-900 flex items-center gap-1 cursor-pointer">
                    <Copy size={11} />{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">📱 GPay, PhonePe, Paytm — QR scan karo ya UPI ID use karo</p>
              </div>

              <button onClick={() => setStep('utr')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2">
                <CheckCircle size={16} />Maine Pay Kar Diya — UTR Enter Karein
              </button>
              <p className="text-[10px] text-slate-400 text-center">Payment ke baad UTR number aur screenshot submit karo — job turant live!</p>
            </div>
          )}

          {/* STEP 3: UTR DETAILS */}
          {step === 'utr' && (
            <form onSubmit={handleUTRSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                <p className="font-black mb-1">🧾 Payment Details Bharo — Job Turant Live Hogi!</p>
                <p>Sahi UTR number aur screenshot dalo — system automatically verify karega.</p>
              </div>

              {utrError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex gap-2">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />{utrError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">UTR Number * <span className="text-slate-400 font-normal normal-case">(GPay/PhonePe history mein milega)</span></label>
                <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)}
                  placeholder="e.g. 407316548291"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm font-mono" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Karne Wala Phone Number *</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-3 text-slate-400" />
                  <input type="tel" maxLength={10} value={paymentPhone} onChange={e => setPaymentPhone(e.target.value.replace(/\D/g,''))}
                    placeholder="Jis number se pay kiya"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Date *</label>
                  <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Time *</label>
                  <input type="time" value={paymentTime} onChange={e => setPaymentTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Screenshot * <span className="text-slate-400 font-normal normal-case">(GPay/PhonePe ka proof)</span></label>
                {screenshot ? (
                  <div className="relative rounded-xl overflow-hidden h-32 bg-slate-100">
                    <img src={screenshot} alt="Payment proof" className="w-full h-full object-contain" />
                    <button type="button" onClick={() => setScreenshot('')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full cursor-pointer"><X size={12} /></button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl p-4 cursor-pointer transition-colors">
                    <Upload size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-600">Screenshot Upload Karo</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPEG/PNG — max 3MB</span>
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                <p className="font-black mb-1">⚠️ Important:</p>
                <p>Galat UTR ya fake screenshot dene par job delete kar di jaayegi aur number block hoga.</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep('payment')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">← Back</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                  <Briefcase size={15} />{submitting ? 'Submitting...' : 'Submit & Go Live!'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: DONE */}
          {step === 'done' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">⭐ Featured Job Live!</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tumhari job <strong>sabse upar</strong> dikh rahi hai "Featured" badge ke saath — 20 din tak!
                </p>
              </div>
              <button onClick={handleClose}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-xl text-sm cursor-pointer">
                Dekho Site Pe ✨
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
