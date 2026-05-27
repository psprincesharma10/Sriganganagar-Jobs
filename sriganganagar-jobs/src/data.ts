import { Job, Ad } from './types';

// Helper to generate a date relative to now in months
const getFutureDate = (months: number): string => {
  const date = new Date('2026-05-24T11:17:41Z');
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
};

const getPastDate = (daysAgo: number): string => {
  const date = new Date('2026-05-24T11:17:41Z');
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    created_at: getPastDate(1),
    job_title_en: 'Computer Operator & Billing Clerk',
    job_title_hi: 'कंप्यूटर ऑपरेटर और बिलिंग क्लर्क',
    job_description_en: 'Required urgently for a retail shop in Gol Bazar, Sri Ganganagar. Must have basic knowledge of MS Excel and Tally. Good typing speed. Timings: 10 AM to 8 PM.',
    job_description_hi: 'गोल बाजार, श्रीगंगानगर में रिटेल शॉप के लिए तत्काल आवश्यकता है। MS Excel और Tally का बुनियादी ज्ञान होना चाहिए। अच्छी टाइपिंग स्पीड। समय: सुबह 10 से रात 8 बजे तक।',
    phone: '9414321098',
    poster_name: 'Gupta Traders',
    phone_hidden: false,
    expires_at: getFutureDate(6),
    pinned: true, // Pinned/Featured by admin
  },
  {
    id: 'job-2',
    created_at: getPastDate(3),
    job_title_en: 'Primary School Teacher (English & Maths)',
    job_title_hi: 'प्राइमरी स्कूल टीचर (अंग्रेजी और गणित)',
    job_description_en: 'A reputed Sr. Sec. School near Sukhadia Circle needs experienced teachers to teach classes 1st to 5th. Fluency in English speaking is preferred. Safe environment.',
    job_description_hi: 'सुखाड़िया सर्कल के पास एक प्रतिष्ठित सीनियर सेकेंडरी स्कूल को कक्षा 1 से 5वीं तक पढ़ाने के लिए अनुभवी शिक्षकों की आवश्यकता है। अंग्रेजी बोलने में निपुणता को प्राथमिकता दी जाएगी। सुरक्षित वातावरण।',
    phone: '9829012345',
    poster_name: 'Tagore Kids Academy',
    phone_hidden: true, // Phone concealed
    expires_at: getFutureDate(6),
    pinned: false,
  },
  {
    id: 'job-3',
    created_at: getPastDate(5),
    job_title_en: 'Kinnow Sorting & Packing Helpers',
    job_title_hi: 'किन्नू सॉर्टिंग और पैकिंग हेल्पर',
    job_description_en: 'Urgent helpers needed for Kinnow waxing and packaging plant at Padampur Road, Sri Ganganagar. Daily wage based work, food and accommodation provided. 15 vacancies available.',
    job_description_hi: 'पदमपुर रोड, श्रीगंगानगर में किन्नू वैक्सिंग और पैकेजिंग प्लांट के लिए तत्काल सहायकों की आवश्यकता है। दैनिक वेतन आधारित कार्य, भोजन और रहने की व्यवस्था उपलब्ध है। 15 रिक्तियां।',
    phone: '8003112233',
    poster_name: 'Ganganagar Agro Industries',
    phone_hidden: false,
    expires_at: getFutureDate(6),
    pinned: false,
  },
  {
    id: 'job-4',
    created_at: getPastDate(8),
    job_title_en: 'Delivery Partners / Bikers',
    job_title_hi: 'डिलीवरी पार्टनर्स / बाइक सवार',
    job_description_en: 'Earn Rs 15,000 to 22,000 per month. Deliver food and groceries around Sri Ganganagar city (Ridhi Sidhi, Chahal Chowk, Jawahar Nagar). Must own a bike and valid driving license.',
    job_description_hi: 'प्रति माह 15,000 से 22,000 रुपये कमाएं। श्रीगंगानगर शहर (रिद्धि सिद्धि, चहल चौक, जवाहर नगर) के आसपास भोजन और राशन की डिलीवरी करें। बाइक और वैध ड्राइविंग लाइसेंस होना अनिवार्य है।',
    phone: '7023344556',
    poster_name: 'Sgngr Express Delivery',
    phone_hidden: false,
    expires_at: getFutureDate(6),
    pinned: false,
  },
  {
    id: 'job-5',
    created_at: getPastDate(12),
    job_title_en: 'Medical Lab Assistant',
    job_title_hi: 'मेडिकल लैब असिस्टेंट',
    job_description_en: 'Required DMLT certified laboratory technician for a pathology lab near Meera Chowk. Experience of blood collection and basic testing is preferred.',
    job_description_hi: 'मीरा चौक के पास एक पैथोलॉजी लैब के लिए DMLT प्रमाणित प्रयोगशाला तकनीशियन की आवश्यकता है। रक्त संग्रह और बुनियादी परीक्षण का अनुभव बेहतर होगा।',
    phone: '9460010020',
    poster_name: 'Sanjivani Diagnostics',
    phone_hidden: true,
    expires_at: getFutureDate(6),
    pinned: false,
  }
];

export const INITIAL_ADS: Ad[] = [
  {
    id: 'ad-1',
    created_at: getPastDate(2),
    business_name: 'Apex Spoken English & IELTS Prep Circle / एपेक्स स्पोकन इंग्लिश',
    short_description: 'Best English coaching in Sri Ganganagar. Free demo classes. / श्रीगंगानगर में सर्वोत्तम इंग्लिश कोचिंग। फ्री डेमो क्लास।',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    contact: '9887766554',
    sponsored: true,
    status: 'approved',
    featured: true, // Promoted at the top or beautifully embedded
  },
  {
    id: 'ad-2',
    created_at: getPastDate(6),
    business_name: 'Rishi Computer Institute / ऋषि कंप्यूटर संस्थान',
    short_description: 'Free Tally & GST course with certification. / टैली और जीएसटी का फ्री सर्टिफिकेट कोर्स।',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&auto=format&fit=crop&q=80',
    contact: '9414099999',
    sponsored: true,
    status: 'approved',
    featured: false,
  }
];
