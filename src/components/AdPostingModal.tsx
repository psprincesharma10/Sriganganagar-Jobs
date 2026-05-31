import React, { useState } from 'react';
import { Ad, Language } from '../types';
import { X, Image, Upload, AlertCircle, Phone, Award, Globe, Navigation, Calendar, MessageSquare, CheckCircle, QrCode, Copy } from 'lucide-react';

interface AdPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPostAd: (adData: Omit<Ad, 'id' | 'created_at' | 'sponsored' | 'status' | 'featured'>) => void;
}

const TEMPLATE_IMAGES = [
  {
    name: 'Coaching Class',
    nameHi: 'कोचिंग क्लास',
    url: 'https://picsum.photos/seed/coaching/600/300',
    color: '#4F46E5',
    emoji: '📚',
  },
  {
    name: 'Agriculture/Kinnow',
    nameHi: 'कृषि / किन्नू',
    url: 'https://picsum.photos/seed/farm/600/300',
    color: '#16A34A',
    emoji: '🌾',
  },
  {
    name: 'Retail Shop/Sale',
    nameHi: 'दुकान सेल / रिटेल',
    url: 'https://picsum.photos/seed/shop/600/300',
    color: '#EA580C',
    emoji: '🛒',
  }
];

// Pricing per duration
const PRICING: Record<string, number> = {
  '7': 250,
  '15': 500,
  '30': 1000,
  '90': 2500,
};

// YOUR UPI ID
const YOUR_UPI_ID = '9309352063-2@ibl';
const YOUR_NAME = 'Prince Sharma';
const YOUR_WHATSAPP = '919309352063';

export default function AdPostingModal({
  isOpen,
  onClose,
  lang,
  onPostAd,
}: AdPostingModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'confirm'>('form');
  const [businessName, setBusinessName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [expiryDays, setExpiryDays] = useState('30');
  const [location, setLocation] = useState('Sri Ganganagar');
  const [placement, setPlacement] = useState<'sidebar' | 'feed'>('sidebar');
  const [errorStr, setErrorStr] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const amount = PRICING[expiryDays] || 349;
  const upiLink = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('SGN Jobs Ad - ' + businessName)}`;
  const whatsappMsg = `https://wa.me/${YOUR_WHATSAPP}?text=${encodeURIComponent(
    `Namaste Prince Sharma Ji!\n\nMaine sponsored ad ka payment kar diya hai:\n\n📌 Business: ${businessName}\n📍 Location: ${location}\n📅 Duration: ${expiryDays} Days\n💰 Amount: ₹${amount}\n\nKripya ad approve karein. 🙏`
  )}`;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorStr(lang === 'en' ? 'Image is too large! Maximum 2MB allowed.' : 'चित्र बहुत बड़ा है! अधिकतम 2MB की अनुमति है।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (url: string) => {
    setImageUrl(url);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr('');

    if (!businessName.trim()) {
      setErrorStr(lang === 'en' ? 'Business name is required!' : 'व्यवसाय का नाम लिखना अनिवार्य है!');
      return;
    }
    if (!adDescription.trim()) {
      setErrorStr(lang === 'en' ? 'Ad Description is required!' : 'विज्ञापन का विवरण लिखना अनिवार्य है!');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorStr(lang === 'en' ? 'Phone Number is required!' : 'फ़ोन नंबर दर्ज करना अनिवार्य है!');
      return;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorStr(lang === 'en' ? 'Please enter a valid 10-digit phone number!' : 'कृपया सही 10-अंकों का फ़ोन नंबर दर्ज करें!');
      return;
    }
    // Image is optional - use placeholder if not provided
    // (removed mandatory image check so form can proceed)
    if (!location.trim()) {
      setErrorStr(lang === 'en' ? 'Location is required!' : 'स्थान दर्ज करना अनिवार्य है!');
      return;
    }

    // Notify admin on WhatsApp — user reached payment screen
    const adminNo = '919309352063';
    const msg = encodeURIComponent(
      `🔔 *AD PAYMENT SCREEN KHULA!*

` +
      `📌 *Business:* ${businessName.trim()}
` +
      `📍 *Location:* ${location.trim()}
` +
      `📅 *Duration:* ${expiryDays} Days
` +
      `💰 *Amount:* ₹${PRICING[expiryDays] || 1000}
` +
      `📞 *Contact:* ${phoneNumber.trim()}

` +
      `⚠️ User abhi QR scan karke pay kar raha hai!
` +
      `Admin panel ready rakhein 👇
` +
      `www.sriganganagarjobs.in`
    );
    window.open(`https://wa.me/${adminNo}?text=${msg}`, '_blank');

    setStep('payment');
  };

  const handlePaymentDone = () => {
    // Save ad to Supabase
    onPostAd({
      business_name: businessName.trim(),
      short_description: adDescription.trim(),
      image_url: imageUrl.trim(),
      contact: phoneNumber.trim(),
      ad_title: businessName.trim(),
      ad_description: adDescription.trim(),
      phone_number: phoneNumber.trim(),
      whatsapp_url: whatsappUrl.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      expiry_days: Number(expiryDays) || 30,
      location: location.trim(),
      placement: placement,
    });

    // Send WhatsApp notification to admin
    const adminWhatsApp = '919309352063';
    const msg = encodeURIComponent(
      `🔔 *NEW AD PAYMENT RECEIVED!*

` +
      `📌 *Business:* ${businessName.trim()}
` +
      `📍 *Location:* ${location.trim()}
` +
      `📅 *Duration:* ${expiryDays} Days
` +
      `💰 *Amount:* ₹${amount}
` +
      `📞 *Contact:* ${phoneNumber.trim()}
` +
      `📋 *Placement:* ${placement === 'sidebar' ? 'Side Bar' : 'Job Feed'}

` +
      `✅ *Action Required:* Admin panel se approve karein!
` +
      `🔗 www.sriganganagarjobs.in`
    );
    // Auto-open WhatsApp notification to admin
    setTimeout(() => {
      window.open(`https://wa.me/${adminWhatsApp}?text=${msg}`, '_blank');
    }, 800);

    setStep('confirm');
  };

  const handleClose = () => {
    setStep('form');
    setBusinessName('');
    setAdDescription('');
    setPhoneNumber('');
    setWhatsappUrl('');
    setImageUrl('');
    setWebsiteUrl('');
    setExpiryDays('30');
    setLocation('Sri Ganganagar');
    setPlacement('sidebar');
    setErrorStr('');
    setCopied(false);
    onClose();
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(YOUR_UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={step === 'confirm' ? handleClose : onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <Award size={20} className="fill-slate-900 animate-bounce" />
            <span className="text-lg font-extrabold tracking-tight">
              {step === 'payment'
                ? (lang === 'en' ? '💳 Complete Payment' : '💳 भुगतान करें')
                : step === 'confirm'
                ? (lang === 'en' ? '✅ Ad Submitted!' : '✅ विज्ञापन सबमिट हुआ!')
                : (lang === 'en' ? 'Submit Sponsored Business Ad' : 'प्रायोजित व्यवसाय विज्ञापन सबमिट करें')}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-900/80 hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================== STEP 1: FORM ===================== */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

            <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
              <Award size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold mb-0.5">
                  {lang === 'en' ? '🔒 Premium Verified Placement' : '🔒 प्रीमियम सत्यापित विज्ञापन स्थान'}
                </p>
                <p className="opacity-90 leading-relaxed">
                  {lang === 'en'
                    ? 'Your sponsored ad will appear within the Business Showcase sidebar and between job posts. Goes live after payment confirmation!'
                    : 'आपका स्पॉन्सर्ड विज्ञापन बिज़नेस शोकेस साइडबार और जॉब फीड के बीच दिखाई देगा। भुगतान के बाद लाइव होगा!'}
                </p>
              </div>
            </div>

            {errorStr && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{errorStr}</span>
              </div>
            )}

            {/* Business Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Business Name' : 'व्यवसाय का नाम'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={lang === 'en' ? 'e.g., Apex Spoken English Institute' : 'जैसे: एपेक्स स्पोकन इंग्लिश'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
              />
            </div>

            {/* Ad Description */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Ad Description' : 'विज्ञापन का विवरण (ऑफर / सेवाएं)'} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                placeholder={lang === 'en' ? 'Provide details about your seasonal discount, business services, address, and special offers.' : 'अपनी विशेष छूट, काम का विवरण, व्यवसाय स्थान तथा विशेष जानकारियों को यहाँ लिखें।'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Number */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                  {lang === 'en' ? 'Contact Number' : 'संपर्क नंबर'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 94143XXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp URL */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                  {lang === 'en' ? 'WhatsApp URL (Optional)' : 'व्हाट्सएप यूआरएल (वैकल्पिक)'}
                </label>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-green-500" />
                  <input
                    type="url"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="e.g., https://wa.me/91XXXXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Website URL (Optional)' : 'वेबसाइट / फेसबुक लिंक (वैकल्पिक)'}
              </label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-3.5 text-blue-500" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expiry Days */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                  {lang === 'en' ? 'Ad Duration & Price' : 'विज्ञापन अवधि व कीमत'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all cursor-pointer"
                  >
                    <option value="7">{lang === 'en' ? '7 Days — ₹250' : '7 दिन — ₹250'}</option>
                    <option value="15">{lang === 'en' ? '15 Days — ₹500' : '15 दिन — ₹500'}</option>
                    <option value="30">{lang === 'en' ? '30 Days — ₹1000 ✅ Best' : '30 दिन — ₹1000 ✅ बेस्ट'}</option>
                    <option value="90">{lang === 'en' ? '90 Days — ₹2500' : '90 दिन — ₹2500'}</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                  {lang === 'en' ? 'Location / Address' : 'स्थान / क्षेत्र'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Navigation size={15} className="absolute left-3.5 top-3.5 text-amber-500" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g., Gol Bazar, Sri Ganganagar' : 'जैसे: गोल बाजार, श्रीगंगानगर'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Placement Option */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Ad Placement' : 'विज्ञापन कहाँ दिखाएं'} <span className="text-red-500">*</span>
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as 'sidebar' | 'feed')}
                className="w-full px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all cursor-pointer"
              >
                <option value="sidebar">{lang === 'en' ? '📌 Side Bar (Right Panel)' : '📌 साइड बार (दाईं तरफ)'}</option>
                <option value="feed">{lang === 'en' ? '📋 Between Jobs (Every 3rd job)' : '📋 जॉब के बीच में (हर 3 जॉब के बाद)'}</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {placement === 'sidebar'
                  ? (lang === 'en' ? 'Your ad shows in the Business Showcase panel on the right.' : 'आपका विज्ञापन दाईं तरफ Business Showcase में दिखेगा।')
                  : (lang === 'en' ? 'Your ad appears between job listings every 3 posts.' : 'आपका विज्ञापन हर 3 जॉब के बाद दिखेगा।')}
              </span>
            </div>

            {/* Banner Image URL */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Banner Image URL' : 'बैनर इमेज यूआरएल लिंक'} <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or upload below"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono mb-2 transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Or upload a custom banner:' : 'या अपना कस्टमाइज्ड बैनर अपलोड करें:'}
              </span>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-colors relative bg-slate-50/50">
                {imageUrl && imageUrl.startsWith('data:') ? (
                  <div className="w-full relative rounded-lg overflow-hidden h-36 bg-black">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-20 flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="text-slate-400 mb-1" size={22} />
                    <span className="text-xs font-bold text-slate-600">{lang === 'en' ? 'Upload Image File' : 'फ़ोटो फ़ाइल अपलोड करें'}</span>
                    <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG up to 2MB</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Templates — always show so user can pick/change */}
            {(
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Or Choose a Premium Design Template:' : 'या कोई प्रीमियम डिज़ाइन टेम्पलेट चुनें:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATE_IMAGES.map((tmpl, idx) => (
                    <button key={idx} type="button" onClick={() => handleSelectTemplate(tmpl.url)}
                      className={`group border-2 rounded-xl overflow-hidden text-left cursor-pointer focus:outline-none transition-all text-[10px] font-bold ${imageUrl === tmpl.url ? 'border-amber-500 bg-amber-50' : 'border-slate-100 hover:border-amber-400 bg-slate-50'}`}>
                      <div className="h-14 flex items-center justify-center text-3xl" style={{ backgroundColor: tmpl.color + '22' }}>
                        {tmpl.emoji}
                        {imageUrl === tmpl.url && <span className="ml-1 text-amber-600 text-xs font-black">✓</span>}
                      </div>
                      <div className="p-1 px-1.5 truncate text-center bg-white border-t border-slate-100 text-slate-700">
                        {lang === 'en' ? tmpl.name : tmpl.nameHi}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview */}
            {imageUrl && (
              <div className="border border-amber-200 rounded-2xl p-3 bg-amber-50/20">
                <span className="block text-[10px] font-extrabold text-amber-800 uppercase tracking-widest mb-1.5">
                  {lang === 'en' ? 'Live Banner Preview' : 'लाइव बैनर प्रीव्यू'}
                </span>
                <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img src={imageUrl} alt="Live Ad Preview" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }}
                    referrerPolicy="no-referrer" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-600 text-white text-[9px] uppercase font-bold rounded">
                    {lang === 'en' ? 'Sponsored' : 'प्रायोजित'}
                  </span>
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-green-800">{lang === 'en' ? 'Total Amount to Pay:' : 'कुल भुगतान राशि:'}</p>
                <p className="text-2xl font-black text-green-700">₹{PRICING[expiryDays] || 349}</p>
                <p className="text-[10px] text-green-600">{expiryDays} {lang === 'en' ? 'days ad duration' : 'दिन विज्ञापन अवधि'}</p>
              </div>
              <div className="text-right text-xs text-green-700">
                <p className="font-bold">UPI Payment</p>
                <p className="text-[10px]">Instant via QR Code</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">
              <button type="button" onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer text-center">
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button type="submit"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-500 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <QrCode size={16} />
                <span>{lang === 'en' ? `Pay ₹${amount} & Submit` : `₹${amount} भुगतान करें`}</span>
              </button>
            </div>
          </form>
        )}

        {/* ===================== STEP 2: PAYMENT ===================== */}
        {step === 'payment' && (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

            {/* Amount Box */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                {lang === 'en' ? 'Pay This Amount' : 'इतने पैसे भेजें'}
              </p>
              <p className="text-4xl font-black text-amber-700">₹{amount}</p>
              <p className="text-xs text-amber-600 mt-1">{businessName} — {expiryDays} {lang === 'en' ? 'days' : 'दिन'}</p>
            </div>

            {/* UPI QR Code */}
            <div className="text-center space-y-3">
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                {lang === 'en' ? 'Scan QR Code to Pay' : 'QR Code स्कैन करें'}
              </p>
              {/* QR Code using Google Charts API */}
              <div className="flex justify-center">
                <div className="p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                    alt="UPI QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* UPI ID copy */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">UPI ID</p>
                  <p className="text-sm font-black text-slate-800 font-mono">{YOUR_UPI_ID}</p>
                </div>
                <button onClick={copyUpi}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 rounded-xl text-xs font-black text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Copy size={12} />
                  <span>{copied ? (lang === 'en' ? 'Copied!' : 'कॉपी!') : (lang === 'en' ? 'Copy' : 'कॉपी')}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {lang === 'en'
                  ? '📱 Open any UPI app (GPay, PhonePe, Paytm) → Scan QR or enter UPI ID → Pay ₹' + amount
                  : '📱 कोई भी UPI ऐप खोलें (GPay, PhonePe, Paytm) → QR स्कैन करें या UPI ID डालें → ₹' + amount + ' भेजें'}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-bold">
                {lang === 'en' ? 'AFTER PAYMENT' : 'भुगतान के बाद'}
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* WhatsApp Confirm */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-black text-green-800">
                {lang === 'en'
                  ? '📸 Send payment screenshot on WhatsApp to activate your ad:'
                  : '📸 अपना पेमेंट स्क्रीनशॉट WhatsApp पर भेजें — ad activate होगी:'}
              </p>
              <a
                href={whatsappMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl text-sm transition-colors cursor-pointer"
              >
                <MessageSquare size={16} />
                {lang === 'en' ? 'Send on WhatsApp' : 'WhatsApp पर भेजें'}
              </a>
              <p className="text-[10px] text-green-600 text-center">
                {lang === 'en' ? 'Your ad will be approved within 1-2 hours!' : 'आपकी ad 1-2 घंटे में approve हो जाएगी!'}
              </p>
            </div>

            {/* Done Button */}
            <button
              onClick={handlePaymentDone}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              {lang === 'en' ? 'I have paid — Submit my Ad' : 'मैंने भुगतान कर दिया — Ad Submit करें'}
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              {lang === 'en'
                ? 'Your ad details are saved. It will go live after payment verification.'
                : 'आपकी ad details save हो गई हैं। payment verify होने के बाद live होगी।'}
            </p>
          </div>
        )}

        {/* ===================== STEP 3: CONFIRMATION ===================== */}
        {step === 'confirm' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'en' ? 'Ad Submitted!' : 'Ad Submit हो गई!'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'en'
                  ? `Your ad for "${businessName}" has been saved. Once payment is confirmed on WhatsApp, it will go live within 1-2 hours.`
                  : `"${businessName}" की ad save हो गई है। WhatsApp पर payment confirm होने के बाद 1-2 घंटे में live होगी।`}
              </p>
            </div>

            {/* Remind WhatsApp */}
            <a
              href={whatsappMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl text-sm transition-colors cursor-pointer"
            >
              <MessageSquare size={16} />
              {lang === 'en' ? 'Send Screenshot on WhatsApp' : 'WhatsApp पर Screenshot भेजें'}
            </a>

            <button onClick={handleClose}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-sm transition-colors cursor-pointer">
              {lang === 'en' ? 'Close' : 'बंद करें'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
