import React, { useEffect } from 'react';
import { Job, Language } from '../types';
import { ChevronLeft, Phone, Share2, MapPin, Calendar, User, Briefcase, GraduationCap, IndianRupee, ClipboardList, CheckCircle2 } from 'lucide-react';
import { setCanonicalUrl, setPageTitle } from '../router';

interface JobDetailPageProps {
  job: Job;
  lang: Language;
  onBack: () => void;
  relatedJobs: Job[];
  onOpenRelated: (job: Job) => void;
}

// Extracts the city that was embedded as "📍 City" in older job descriptions,
// falling back to the real `location` field when present.
function extractLocation(job: Job): string {
  if (job.location) return job.location;
  const match = (job.job_description_en || '').match(/📍\s*(.+)/);
  return match ? match[1].split('\n')[0].trim() : 'Sri Ganganagar';
}

export default function JobDetailPage({ job, lang, onBack, relatedJobs, onOpenRelated }: JobDetailPageProps) {
  const title = lang === 'en' ? job.job_title_en : job.job_title_hi;
  const description = (lang === 'en' ? job.job_description_en : job.job_description_hi) || '';
  const location = extractLocation(job);
  const jobType = job.job_type || 'Full Time';
  const category = title.split('(')[0].trim();

  useEffect(() => {
    const slug = `${job.id}`;
    setCanonicalUrl(`/jobs/${slug}`);
    setPageTitle(`${title} in ${location} | Sri Ganganagar Jobs`);
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Per-job JobPosting schema (Google for Jobs rich results) for this specific page
    const old = document.getElementById('single-jobposting-schema');
    if (old) old.remove();
    const schema = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      title,
      description,
      datePosted: new Date(job.created_at).toISOString().split('T')[0],
      validThrough: new Date(job.expires_at).toISOString().split('T')[0],
      employmentType: jobType === 'Part Time' ? 'PART_TIME' : jobType === 'Freelance' ? 'CONTRACTOR' : jobType === 'Daily Worker' ? 'PER_DIEM' : 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.poster_name || 'Sriganganagar Jobs',
        sameAs: 'https://www.sriganganagarjobs.in',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: location,
          addressRegion: 'Rajasthan',
          addressCountry: 'IN',
        },
      },
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'single-jobposting-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const cleanup = document.getElementById('single-jobposting-schema');
      if (cleanup) cleanup.remove();
    };
  }, [job.id]);

  const formattedDate = new Date(job.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const shareText = encodeURIComponent(
    `${title}\n📍 ${location}\n${description}\n📞 ${job.phone}\n🔗 www.sriganganagarjobs.in/jobs/${job.id}`
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-[#075E54] text-white sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-1 text-sm font-bold"
          >
            <ChevronLeft size={18} />
            {lang === 'en' ? 'Back to Jobs' : 'सभी जॉब्स'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-500">
            {job.poster_name && (
              <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                <User size={12} />{job.poster_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />{formattedDate}
            </span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
              <MapPin size={12} />{location}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            {jobType} • {location}, Rajasthan
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${job.phone}`}
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-900 font-black text-sm rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Phone size={15} />
              {lang === 'en' ? 'Call Employer Now' : 'अभी कॉल करें'}
            </a>
            <a
              href={`https://wa.me/91${job.phone}?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] font-bold text-sm rounded-xl flex items-center gap-1.5"
            >
              <Share2 size={15} />WhatsApp
            </a>
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl flex items-center gap-1.5"
            >
              <Share2 size={15} />{lang === 'en' ? 'Share' : 'शेयर'}
            </a>
          </div>
        </div>

        {/* About this job */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <Briefcase size={16} className="text-[#075E54]" />
            {lang === 'en' ? 'About This Job' : 'इस जॉब के बारे में'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        </div>

        {/* Responsibilities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <ClipboardList size={16} className="text-[#075E54]" />
            {lang === 'en' ? 'Job Responsibilities' : 'कार्य की जिम्मेदारियां'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'en'
              ? `As a ${category} in ${location}, your day-to-day responsibilities will generally include completing the tasks assigned by the employer on time, maintaining a professional and punctual attitude, following the workplace's standard safety and conduct guidelines, and communicating clearly with the employer or supervising staff. Exact duties, working hours and reporting structure for this specific opening are described above in the "About This Job" section — please confirm these details directly with the employer when you call or message them.`
              : `${category} की इस नौकरी में आम तौर पर नियोक्ता द्वारा सौंपे गए काम समय पर पूरे करना, समय के पाबंद और पेशेवर रहना, कार्यस्थल के सुरक्षा व आचरण नियमों का पालन करना, और नियोक्ता या सुपरवाइज़र से स्पष्ट संवाद बनाए रखना शामिल होता है। इस विशेष जॉब के सटीक कार्य, समय और रिपोर्टिंग ढांचे की जानकारी ऊपर "इस जॉब के बारे में" सेक्शन में दी गई है — बेहतर होगा कि कॉल या मैसेज करते समय नियोक्ता से इसकी पुष्टि कर लें।`}
          </p>
        </div>

        {/* Qualification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <GraduationCap size={16} className="text-[#075E54]" />
            {lang === 'en' ? 'Qualification & Eligibility' : 'योग्यता'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'en'
              ? `Specific qualification requirements, if mentioned by the employer, are included in the description above. In general, candidates with relevant prior experience in ${category} roles are preferred, though freshers may also be considered depending on the employer's requirement. Candidates residing in or near ${location}, Rajasthan are encouraged to apply directly, since most local employers prefer nearby candidates who can start quickly.`
              : `नियोक्ता द्वारा बताई गई विशेष योग्यता (अगर कोई है) ऊपर विवरण में दी गई है। सामान्यतः ${category} जैसे पदों के लिए पूर्व अनुभव रखने वाले उम्मीदवारों को प्राथमिकता दी जाती है, हालांकि नियोक्ता की जरूरत के अनुसार फ्रेशर्स पर भी विचार किया जा सकता है। ${location}, राजस्थान व आसपास के उम्मीदवार सीधे आवेदन करें, क्योंकि ज्यादातर स्थानीय नियोक्ता नज़दीकी उम्मीदवारों को प्राथमिकता देते हैं जो जल्दी काम शुरू कर सकें।`}
          </p>
        </div>

        {/* Salary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
            <IndianRupee size={16} className="text-[#075E54]" />
            {lang === 'en' ? 'Salary Details' : 'सैलरी विवरण'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {job.salary_range
              ? (lang === 'en'
                  ? `The employer has indicated a salary range of ₹${job.salary_range} for this position. Final salary may be discussed and confirmed directly with the employer based on your experience and skills.`
                  : `नियोक्ता ने इस पद के लिए ₹${job.salary_range} सैलरी बताई है। अंतिम सैलरी आपके अनुभव और स्किल के अनुसार नियोक्ता से सीधे बातचीत करके तय होगी।`)
              : (lang === 'en'
                  ? `The exact salary for this position was not specified by the employer and will be discussed directly at the time of interview or on your first call, based on your experience and the employer's budget.`
                  : `इस पद के लिए सटीक सैलरी नियोक्ता ने नहीं बताई है — यह आपके अनुभव और नियोक्ता के बजट के अनुसार interview या पहली कॉल के समय सीधे तय होगी।`)}
          </p>
        </div>

        {/* How to Apply */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 sm:p-6">
          <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#075E54]" />
            {lang === 'en' ? 'How to Apply' : 'आवेदन कैसे करें'}
          </h2>
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><span className="font-black text-[#075E54]">1.</span>{lang === 'en' ? `Tap "Call Employer Now" above to speak directly with ${job.poster_name || 'the employer'}.` : `ऊपर "अभी कॉल करें" दबाकर सीधे ${job.poster_name || 'नियोक्ता'} से बात करें।`}</li>
            <li className="flex gap-2"><span className="font-black text-[#075E54]">2.</span>{lang === 'en' ? 'Mention that you found this job on Sri Ganganagar Jobs (sriganganagarjobs.in).' : 'बताएं कि आपको ये जॉब Sri Ganganagar Jobs (sriganganagarjobs.in) पर मिली है।'}</li>
            <li className="flex gap-2"><span className="font-black text-[#075E54]">3.</span>{lang === 'en' ? 'Confirm role details, timing, and salary directly with the employer before joining.' : 'joining se pehle role, timing aur salary ki poori jankari sidha niyokta se confirm kar lein.'}</li>
          </ol>
          <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-500">
            ⚠️ {lang === 'en'
              ? 'Sri Ganganagar Jobs never asks for money for any job. Be cautious of anyone asking for payment/registration fees.'
              : 'Sri Ganganagar Jobs kisi bhi naukri ke liye paise nahi maangta. Jo bhi payment/registration fees maange, uss se saavdhan rahein.'}
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 mb-3">
              {lang === 'en' ? 'Similar Jobs You Might Like' : 'मिलती-जुलती अन्य नौकरियां'}
            </h2>
            <div className="space-y-2">
              {relatedJobs.slice(0, 4).map((rj) => (
                <button
                  key={rj.id}
                  onClick={() => onOpenRelated(rj)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
                >
                  <p className="text-sm font-bold text-slate-800">{lang === 'en' ? rj.job_title_en : rj.job_title_hi}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{extractLocation(rj)}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
