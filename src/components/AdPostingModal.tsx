import React, { useState } from 'react';
import { Ad, Language } from '../types';
import { X, Image, Upload, AlertCircle, Phone, Award, Globe, Navigation, Calendar, MessageSquare } from 'lucide-react';

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
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Agriculture/Kinnow',
    nameHi: 'कृषि / किन्नू',
    url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Retail Shop/Sale',
    nameHi: 'दुकान सेल / रिटेल',
    url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&auto=format&fit=crop&q=80',
  }
];

export default function AdPostingModal({
  isOpen,
  onClose,
  lang,
  onPostAd,
}: AdPostingModalProps) {
  const [businessName, setBusinessName] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [expiryDays, setExpiryDays] = useState('30');
  const [location, setLocation] = useState('Sri Ganganagar');
  const [errorStr, setErrorStr] = useState('');

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!imageUrl.trim()) {
      setErrorStr(lang === 'en' ? 'Please upload an image, select a template, or paste an Image URL!' : 'कृपया फोटो अपलोड करें, टेम्पलेट चुनें या इमेज यूआरएल दर्ज करें!');
      return;
    }

    if (!location.trim()) {
      setErrorStr(lang === 'en' ? 'Location is required!' : 'स्थान दर्ज करना अनिवार्य है!');
      return;
    }

    onPostAd({
      business_name: businessName.trim(),
      short_description: adDescription.trim(), // Default column support
      image_url: imageUrl.trim(),
      contact: phoneNumber.trim(),

      ad_title: businessName.trim(),
      ad_description: adDescription.trim(),
      phone_number: phoneNumber.trim(),
      whatsapp_url: whatsappUrl.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      expiry_days: Number(expiryDays) || 30,
      location: location.trim(),
    });

    // Reset Form
    setBusinessName('');
    setAdDescription('');
    setPhoneNumber('');
    setWhatsappUrl('');
    setImageUrl('');
    setWebsiteUrl('');
    setExpiryDays('30');
    setLocation('Sri Ganganagar');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <Award size={20} className="fill-slate-900 animate-bounce" />
            <span className="text-lg font-extrabold tracking-tight">
              {lang === 'en' ? 'Submit Sponsored Business Ad' : 'प्रायोजित व्यवसाय विज्ञापन सबमिट करें'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-900/80 hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-black/10 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Award size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold mb-0.5">
                {lang === 'en' ? '🔒 Premium Verified Placement' : '🔒 प्रीमियम सत्यापित विज्ञापन स्थान'}
              </p>
              <p className="opacity-90 leading-relaxed">
                {lang === 'en' 
                  ? 'Your sponsored ad will appear within the Business Showcase sidebar and between job posts. It becomes active instantly upon submission!' 
                  : 'आपका स्पॉन्सर्ड विज्ञापन बिज़नेस शोकेस साइडबार और जॉब फीड के बीच दिखाई देगा। यह सबमिट करते ही तुरंत लाइव हो जाएगा!'}
              </p>
            </div>
          </div>

          {/* Validation Alert */}
          {errorStr && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorStr}</span>
            </div>
          )}

          {/* Business Name Field */}
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-[#f59e0b] focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-[#f59e0b] focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Number */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Contact Number' : 'सुरक्षित संपर्क नंबर (Call)'} <span className="text-red-500">*</span>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
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
                  placeholder="e.g., https://wa.me/9194143XXXXX"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
                />
              </div>
            </div>
          </div>

          {/* Website URL Option */}
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expiry Days Dropdown */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
                {lang === 'en' ? 'Ad Expiry Duration' : 'विज्ञापन प्रदर्शन अवधि'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all cursor-pointer"
                >
                  <option value="7">{lang === 'en' ? '7 Days (Standard)' : '7 दिन (साधारण)'}</option>
                  <option value="15">{lang === 'en' ? '15 Days (Popular)' : '15 दिन (प्रसिद्ध)'}</option>
                  <option value="30">{lang === 'en' ? '30 Days (Recommended)' : '30 दिन (अनुशंसित)'}</option>
                  <option value="90">{lang === 'en' ? '90 Days (Quarterly)' : '90 दिन (त्रैमासिक)'}</option>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Image URL input field (Direct input as requested) */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1">
              {lang === 'en' ? 'Banner Image URL' : 'बैनर इमेज यूआरएल लिंक'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or upload below"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono mb-2 transition-all"
            />
          </div>

          {/* Image Upload Option */}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Or upload a custom banner:' : 'या अपना कस्टमाइज्ड बैनर अपलोड करें:'}
            </span>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-colors relative bg-slate-50/50">
              {imageUrl && imageUrl.startsWith('data:') ? (
                <div className="w-full relative rounded-lg overflow-hidden h-36 bg-black">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-20 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="text-slate-400 mb-1" size={22} />
                  <span className="text-xs font-bold text-slate-600">
                    {lang === 'en' ? 'Upload Image File' : 'फ़ोटो फ़ाइल अपलोड करें'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    JPEG, PNG up to 2MB (converts to database url)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Preset templates option */}
          {!imageUrl && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Or Choose a Premium Design Template:' : 'या कोई प्रीमियम डिज़ाइन टेम्पलेट चुनें:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATE_IMAGES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.url)}
                    className="group border border-slate-100 hover:border-amber-400 rounded-xl overflow-hidden text-left bg-slate-50 cursor-pointer focus:outline-hidden transition-all text-[10px] font-bold text-slate-700"
                  >
                    <div className="h-12 overflow-hidden relative">
                      <img 
                        src={tmpl.url} 
                        alt={tmpl.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-1 px-1.5 truncate text-center bg-white border-t border-slate-100">
                      {lang === 'en' ? tmpl.name : tmpl.nameHi}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview section */}
          {imageUrl && (
            <div className="border border-amber-200 rounded-2xl p-3 bg-amber-50/20">
              <span className="block text-[10px] font-extrabold text-amber-800 uppercase tracking-widest mb-1.5">
                {lang === 'en' ? 'Live Banner Preview' : 'लाइव बैनर प्रीव्यू'}
              </span>
              <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                <img 
                  src={imageUrl} 
                  alt="Live Ad Preview" 
                  className="w-full h-full object-cover"
                  onError={() => setErrorStr(lang === 'en' ? 'Invalid Image URL or blocked. Try a different URL or file upload!' : 'अमान्य इमेज यूआरएल लिंक। दूसरा यूआरएल या फ़ाइल अपलोड करें!')}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-600 text-white text-[9px] uppercase font-bold rounded">
                  {lang === 'en' ? 'Sponsored' : 'प्रायोजित'}
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              {lang === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-500 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Image size={16} />
              <span>{lang === 'en' ? 'Register Sponsored Ad' : 'प्रायोजित विज्ञापन पंजीकृत करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
