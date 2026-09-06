import { Job, Language } from '../types';

// Extracts the city that was embedded as "📍 City" in older job descriptions,
// falling back to the real `location` field when present.
export function extractJobLocation(job: Job): string {
  if (job.location) return job.location;
  const match = (job.job_description_en || '').match(/📍\s*(.+)/);
  return match ? match[1].split('\n')[0].trim() : 'Sri Ganganagar';
}

export interface JobRichContent {
  title: string;
  category: string;
  location: string;
  responsibilities: string;
  qualification: string;
  salary: string;
}

// Generates the same structured, honest, non-fabricated content used on the
// dedicated job detail page — deterministic per job, so it looks identical
// whether shown inline on the homepage feed or on /jobs/:id.
export function generateJobRichContent(job: Job, lang: Language): JobRichContent {
  const title = lang === 'en' ? job.job_title_en : job.job_title_hi;
  const location = extractJobLocation(job);
  const category = title.split('(')[0].trim();

  const responsibilities = lang === 'en'
    ? `As a ${category} in ${location}, your day-to-day responsibilities will generally include completing the tasks assigned by the employer on time, maintaining a professional and punctual attitude, following the workplace's standard safety and conduct guidelines, and communicating clearly with the employer or supervising staff. Exact duties, working hours and reporting structure for this specific opening are described above — please confirm these details directly with the employer when you call or message them.`
    : `${category} की इस नौकरी में आम तौर पर नियोक्ता द्वारा सौंपे गए काम समय पर पूरे करना, समय के पाबंद और पेशेवर रहना, कार्यस्थल के सुरक्षा व आचरण नियमों का पालन करना, और नियोक्ता या सुपरवाइज़र से स्पष्ट संवाद बनाए रखना शामिल होता है। इस विशेष जॉब के सटीक कार्य, समय और रिपोर्टिंग ढांचे की जानकारी ऊपर दी गई है — बेहतर होगा कि कॉल या मैसेज करते समय नियोक्ता से इसकी पुष्टि कर लें।`;

  const qualification = lang === 'en'
    ? `Specific qualification requirements, if mentioned by the employer, are included in the description above. In general, candidates with relevant prior experience in ${category} roles are preferred, though freshers may also be considered depending on the employer's requirement. Candidates residing in or near ${location}, Rajasthan are encouraged to apply directly, since most local employers prefer nearby candidates who can start quickly.`
    : `नियोक्ता द्वारा बताई गई विशेष योग्यता (अगर कोई है) ऊपर विवरण में दी गई है। सामान्यतः ${category} जैसे पदों के लिए पूर्व अनुभव रखने वाले उम्मीदवारों को प्राथमिकता दी जाती है, हालांकि नियोक्ता की जरूरत के अनुसार फ्रेशर्स पर भी विचार किया जा सकता है। ${location}, राजस्थान व आसपास के उम्मीदवार सीधे आवेदन करें, क्योंकि ज्यादातर स्थानीय नियोक्ता नज़दीकी उम्मीदवारों को प्राथमिकता देते हैं जो जल्दी काम शुरू कर सकें।`;

  const salary = job.salary_range
    ? (lang === 'en'
        ? `The employer has indicated a salary range of ₹${job.salary_range} for this position. Final salary may be discussed and confirmed directly with the employer based on your experience and skills.`
        : `नियोक्ता ने इस पद के लिए ₹${job.salary_range} सैलरी बताई है। अंतिम सैलरी आपके अनुभव और स्किल के अनुसार नियोक्ता से सीधे बातचीत करके तय होगी।`)
    : (lang === 'en'
        ? `The exact salary for this position was not specified by the employer and will be discussed directly at the time of interview or on your first call, based on your experience and the employer's budget.`
        : `इस पद के लिए सटीक सैलरी नियोक्ता ने नहीं बताई है — यह आपके अनुभव और नियोक्ता के बजट के अनुसार interview या पहली कॉल के समय सीधे तय होगी।`);

  return { title, category, location, responsibilities, qualification, salary };
}
