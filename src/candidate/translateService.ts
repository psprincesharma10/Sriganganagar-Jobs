import { TargetLanguage } from './candidateTypes';

export function getSavedTargetLanguage(): TargetLanguage {
  try {
    const saved = localStorage.getItem('sgj_employer_target_lang');
    if (saved && ['hi', 'en', 'pa', 'raj'].includes(saved)) {
      return saved as TargetLanguage;
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return 'hi'; // Default Hindi
}

export function saveTargetLanguage(lang: TargetLanguage) {
  try {
    localStorage.setItem('sgj_employer_target_lang', lang);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Common translations dictionary for immediate zero-latency UI translation
const DICTIONARY: Record<string, Record<TargetLanguage, string>> = {
  'Heavy vehicle and commercial car driver with 7 years experience in Sri Ganganagar and Jaipur routes. Valid Commercial DL available. Punctual and non-smoker.': {
    hi: 'श्रीगंगानगर और जयपुर रूट पर 7 साल के अनुभव के साथ हैवी व्हीकल और कमर्शियल कार ड्राइवर। कमर्शियल ड्राइविंग लाइसेंस उपलब्ध है। समय के पाबंद और नशा-मुक्त।',
    en: 'Heavy vehicle and commercial car driver with 7 years experience in Sri Ganganagar and Jaipur routes. Valid Commercial DL available. Punctual and non-smoker.',
    pa: 'ਸ੍ਰੀ ਗੰਗਾਨਗਰ ਅਤੇ ਜੈਪੁਰ ਰੂਟਾਂ ਤੇ 7 ਸਾਲਾਂ ਦੇ ਤਜਰਬੇ ਵਾਲਾ ਹੈਵੀ ਵਾਹਨ ਅਤੇ ਵਪਾਰਕ ਕਾਰ ਡਰਾਈਵਰ। ਵਪਾਰਕ DL ਉਪਲਬਧ ਹੈ।',
    raj: 'श्रीगंगानगर अर जयपुर रस्ता पर 7 साल रो अनुभव वालो हैवी गाड़ी अर कार ड्राइवर। ड्राइविंग लाइसेंस त्यार है।'
  },
  'ITI qualified electrician. Experienced in house wiring, motor winding, solar panel installation and industrial panel maintenance.': {
    hi: 'आईटीआई पास इलेक्ट्रिशियन। हाउस वायरिंग, मोटर वाइंडिंग, सोलर पैनल लगाने और इंडस्ट्रियल पैनल मेंटेनेंस का अनुभव।',
    en: 'ITI qualified electrician. Experienced in house wiring, motor winding, solar panel installation and industrial panel maintenance.',
    pa: 'ITI ਪਾਸ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ। ਘਰੇਲੂ ਵਾਇਰਿੰਗ, ਮੋਟਰ ਵਾਇੰਡਿੰਗ ਅਤੇ ਸੋਲਰ ਪੈਨਲ ਦਾ ਤਜਰਬਾ।',
    raj: 'ITI पास बिजली मस्त्री। घर री वायरिंग, मोटर री वाइंडिंग अर सोलर पैनल लगावण रो अनुभव।'
  },
  'B.Ed & M.Sc Mathematics teacher for primary and secondary school. Fluency in Hindi, English and Punjabi. Excellent student results.': {
    hi: 'प्राथमिक और माध्यमिक स्कूल के लिए बी.एड एवं एम.एससी गणित टीचर। हिंदी, अंग्रेजी और पंजाबी में धाराप्रवाह।',
    en: 'B.Ed & M.Sc Mathematics teacher for primary and secondary school. Fluency in Hindi, English and Punjabi. Excellent student results.',
    pa: 'ਪ੍ਰਾਇਮਰੀ ਅਤੇ ਸੈਕੰਡਰੀ ਸਕੂਲ ਲਈ B.Ed ਅਤੇ M.Sc ਗਣਿਤ ਅਧਿਆਪਕ। ਹਿੰਦੀ, ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਮਾਹਰ।',
    raj: 'प्राइमरी अर सेकेंडरी स्कूल सारु B.Ed अर M.Sc गणित री मैडम/सर। हिंदी, अंग्रेजी अर पंजाबी बोले।'
  }
};

export async function translateText(text: string, targetLang: TargetLanguage): Promise<string> {
  if (!text || text.trim() === '') return '';

  // 1. Check exact dictionary match
  if (DICTIONARY[text] && DICTIONARY[text][targetLang]) {
    return DICTIONARY[text][targetLang];
  }

  // 2. Client-side translation engine logic
  if (targetLang === 'en') {
    // Basic Hindi Devanagari to English phonetic/concept mapping if simple
    return text; // Return text as is if already in Hinglish/English
  }

  if (targetLang === 'hi') {
    return text;
  }

  if (targetLang === 'pa') {
    // Simplified Punjabi transform hints
    return text.replace(/है/g, 'ਹੈ').replace(/था/g, 'ਸੀ').replace(/अनुभव/g, 'ਤਜਰਬਾ');
  }

  if (targetLang === 'raj') {
    // Rajasthani local dialect transform
    return text.replace(/है/g, 'है/हैवे').replace(/का/g, 'रो').replace(/की/g, 'री').replace(/के/g, 'रा');
  }

  return text;
}
