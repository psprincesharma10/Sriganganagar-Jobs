import React, { useState } from 'react';
import { Ad, Language } from '../types';
import { X, Image, Upload, AlertCircle, Phone, Award } from 'lucide-react';

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
    name: 'Kinnow Trade / Farm',
    nameHi: 'किन्नू ट्रेडिंग / फार्म',
    url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Shop Sale / Retail',
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
  const [shortDescription, setShortDescription] = useState('');
  const [contact, setContact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
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
        setImagePreview(base64String);
        setImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectTemplate = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStr('');

    if (!businessName.trim()) {
      setErrorStr(lang === 'en' ? 'Business name is required!' : 'व्यवसाय का नाम लिखना अनिवार्य है!');
      return;
    }

    if (!shortDescription.trim()) {
      setErrorStr(lang === 'en' ? 'Short description is required!' : 'संक्षिप्त विवरण लिखना अनिवार्य है!');
      return;
    }

    if (!imageUrl) {
      setErrorStr(lang === 'en' ? 'Please upload a banner or select a design template!' : 'कृपया बैनर अपलोड करें या एक डिज़ाइन टेम्प्लेट चुनें!');
      return;
    }

    // Optional phone validation if entered
    if (contact.trim()) {
      const cleanContact = contact.replace(/\D/g, '');
      if (cleanContact.length !== 10) {
        setErrorStr(lang === 'en' ? 'Please enter a valid 10-digit mobile number!' : 'कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें!');
        return;
      }
    }

    onPostAd({
      business_name: businessName.trim(),
      short_description: shortDescription.trim(),
      image_url: imageUrl,
      contact: contact.trim() || undefined,
    });

    // Reset Form
    setBusinessName('');
    setShortDescription('');
    setContact('');
    setImageUrl('');
    setImagePreview('');
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
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header (Golden/Amber theme for sponsored/premium ads) */}
        <div className="bg-amber-500 text-slate-940 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <Award size={20} className="fill-slate-900" />
            <h2 className="text-lg font-bold">
              {lang === 'en' ? 'Submit Business Ad' : 'व्यवसाय विज्ञापन सबमिट करें'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-900/80 hover:text-slate-900 transition-colors cursor-pointer p-1 rounded-full hover:bg-black/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
            <p className="font-bold">
              {lang === 'en' ? 'Promote Your Business' : 'अपने व्यापार का प्रचार करें'}
            </p>
            <p className="opacity-90">
              {lang === 'en' 
                ? 'Your ad will be submitted. It will become LIVE soon after Admin approval!' 
                : 'आपका विज्ञापन जमा हो जाएगा। एडमिन द्वारा मंज़ूरी के बाद जल्द ही लाइव होगा!'}
            </p>
          </div>

          {/* Validation Alert */}
          {errorStr && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorStr}</span>
            </div>
          )}

          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Business Name' : 'व्यवसाय का नाम'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Rishi Accent Computer Institute' : 'जैसे: ऋषि कंप्यूटर संस्थान'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-[#f59e0b] focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Short Description / Offer' : 'संक्षिप्त विवरण या ऑफर'} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Learn Tally & GST fully certified course free for students this month!' : 'जैसे: इस महीने छात्रों के लिए नि:शुल्क टैली और जीएसटी का सर्टिफिकेट कोर्स!'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-[#f59e0b] focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all resize-none"
            />
          </div>

          {/* Image Upload Option */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Upload Banner Image' : 'बैनर फोटो अपलोड करें'} <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-colors relative bg-slate-50">
              {imagePreview ? (
                <div className="w-full relative rounded-lg overflow-hidden h-32 bg-black">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-24 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="text-slate-400 mb-1.5" size={24} />
                  <span className="text-xs font-bold text-slate-600">
                    {lang === 'en' ? 'Choose Image From Phone/PC' : 'फोन/पीसी से फोटो चुनें'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    JPEG, PNG up to 2MB
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

          {/* Preset templates option if they don't have images */}
          {!imagePreview && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'en' ? 'Or Select a Ready Template Banner:' : 'या बना-बनाया टेम्पलेट बैनर चुनें:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATE_IMAGES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.url)}
                    className="group border border-slate-100 hover:border-amber-400 rounded-xl overflow-hidden text-left bg-slate-50 cursor-pointer focus:outline-hidden transition-all text-[10px] font-bold text-slate-700"
                  >
                    <div className="h-14 overflow-hidden relative">
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

          {/* Contact Inquiry Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Inquiry Contact Number (Optional)' : 'पूछताछ के लिए मोबाइल नंबर (वैकल्पिक)'}
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="tel"
                maxLength={10}
                value={contact}
                onChange={(e) => setContact(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g., 94143XXXXX"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm font-mono transition-all"
              />
            </div>
          </div>

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
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Image size={16} />
              <span>{lang === 'en' ? 'Submit Ad' : 'विज्ञापन भेजें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
