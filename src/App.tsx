import React, { useState, useEffect } from 'react';
import { Job, Ad, Language } from './types';
import { INITIAL_JOBS, INITIAL_ADS } from './data';
import JobCard from './components/JobCard';
import AdBanner from './components/AdBanner';
import BusinessAdCard from './components/BusinessAdCard';
import JobPostingModal from './components/JobPostingModal';
import AdPostingModal from './components/AdPostingModal';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './supabaseClient';

import { 
  Building, 
  Search, 
  Plus, 
  Lock, 
  Check, 
  MapPin, 
  Sparkles, 
  Megaphone, 
  Briefcase,
  Shield, 
  CheckCircle, 
  Languages, 
  ArrowRight,
  Info,
  X
} from 'lucide-react';

export default function App() {
  // --- Persistent States ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('sgn_job_lang');
    return (saved as Language) || 'en';
  });

  const [jobs, setJobs] = useState<Job[]>([]);

  const [ads, setAds] = useState<Ad[]>([]);

  const [defaultExpiryMonths, setDefaultExpiryMonths] = useState<number>(() => {
    const saved = localStorage.getItem('sgn_expiry_months');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sgn_admin_session') === 'true';
  });

  // --- Filtering & Search States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // --- UI Control States ---
  const [activeModal, setActiveModal] = useState<'job' | 'ad' | 'login' | null>(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // --- Supabase Integration States ---
  const [isLoading, setIsLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);

  const loadSupabaseData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live jobs from Supabase
      const { data: dbJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*');

      if (jobsError) {
        console.error('Exact Supabase jobs fetch error:', jobsError);
        throw jobsError;
      }

      // 2. Fetch live ads from Supabase
      const { data: dbAds, error: adsError } = await supabase
        .from('ads')
        .select('*');

      if (adsError) {
        console.error('Exact Supabase ads fetch error:', adsError);
        throw adsError;
      }

      let finalJobs: Job[] = [];
      let finalAds: Ad[] = [];

      // If the jobs table is empty, auto-seed it with state defaults
      if (dbJobs && dbJobs.length > 0) {
        finalJobs = dbJobs.map((row: any) => ({
          id: row.id,
          created_at: row.created_at,
          job_title_en: row.job_title || row.job_title_en || '',
          job_title_hi: row.job_title || row.job_title_hi || '',
          job_description_en: row.job_description || row.job_description_en || '',
          job_description_hi: row.job_description || row.job_description_hi || '',
          phone: row.phone,
          poster_name: row.poster_name || undefined,
          phone_hidden: typeof row.phone_hidden === 'boolean' ? row.phone_hidden : false,
          expires_at: row.expires_at || new Date().toISOString(),
          pinned: typeof row.pinned === 'boolean' ? row.pinned : false,
        }));
      } else {
        console.log('Jobs table in Supabase is empty. Commencing auto-seed of default jobs...');
        const jobsToInsert = INITIAL_JOBS.map(job => ({
          job_title: job.job_title_en || job.job_title_hi,
          job_description: job.job_description_en || job.job_description_hi,
          phone: job.phone,
          poster_name: job.poster_name || null,
          phone_hidden: job.phone_hidden,
          expires_at: job.expires_at,
          pinned: job.pinned
        }));

        const { error: insertErr } = await supabase.from('jobs').insert(jobsToInsert);
        if (insertErr) {
          console.error('Error inserting feed seeding:', insertErr);
        }
        
        // Re-fetch after seeding so we have authentic database-allocated IDs and timestamps
        const { data: freshJobs } = await supabase.from('jobs').select('*');
        if (freshJobs && freshJobs.length > 0) {
          finalJobs = freshJobs.map((row: any) => ({
            id: row.id,
            created_at: row.created_at,
            job_title_en: row.job_title || '',
            job_title_hi: row.job_title || '',
            job_description_en: row.job_description || '',
            job_description_hi: row.job_description || '',
            phone: row.phone,
            poster_name: row.poster_name || undefined,
            phone_hidden: typeof row.phone_hidden === 'boolean' ? row.phone_hidden : false,
            expires_at: row.expires_at || new Date().toISOString(),
            pinned: typeof row.pinned === 'boolean' ? row.pinned : false,
          }));
        } else {
          finalJobs = INITIAL_JOBS;
        }
      }

      // If the ads table is empty or has entries
      if (dbAds && dbAds.length > 0) {
        finalAds = dbAds.map((row: any) => {
          let extra: Partial<Ad> = {};
          if (row.short_description && row.short_description.trim().startsWith('{')) {
            try {
              extra = JSON.parse(row.short_description);
            } catch (e) {
              console.error('Failed to parse rich ad description:', e);
            }
          }
          
          const businessName = row.business_name || '';
          const imageUrl = row.image_url || '';
          const dbContact = row.contact_number || row.contact || '';
          const dbDescription = row.ad_description || row.short_description || '';
          
          return {
            id: row.id,
            created_at: row.created_at,
            business_name: businessName,
            image_url: imageUrl,
            contact: dbContact,
            contact_number: dbContact,
            short_description: extra.short_description || dbDescription || '',
            sponsored: typeof row.sponsored === 'boolean' ? row.sponsored : true,
            status: row.status || 'pending',
            featured: typeof row.featured === 'boolean' ? row.featured : false,
            is_active: typeof row.is_active === 'boolean' ? row.is_active : false,
            
            // Populating extended fields
            ad_title: extra.ad_title || businessName,
            ad_description: dbDescription || extra.ad_description || '',
            phone_number: dbContact || extra.phone_number || '',
            whatsapp_number: extra.whatsapp_number || dbContact || '',
            whatsapp_url: extra.whatsapp_url || '',
            website_url: extra.website_url || '',
            expiry_days: extra.expiry_days || 30,
            location: extra.location || 'Sri Ganganagar'
          };
        });
      } else {
        finalAds = [];
      }

      const now = new Date('2026-05-24T11:17:41Z').getTime();
      const validJobs = finalJobs.filter(j => new Date(j.expires_at).getTime() >= now);

      setJobs(validJobs);
      setAds(finalAds);
      setDbConnected(true);
    } catch (err: any) {
      console.error('Failed fetching data from Supabase:', err.message || err);
      setDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // --- Synchronization & Expiry Effects ---
  useEffect(() => {
    localStorage.setItem('sgn_job_lang', lang);
  }, [lang]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- Handlers ---
  const handleToggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // 1. Post Instant Job Live
  const handleCreateJob = async (jobData: Omit<Job, 'id' | 'created_at' | 'expires_at' | 'pinned'>) => {
    // Calculate expiry based on admin configuration settings
    const expiryDate = new Date('2026-05-24T11:17:41Z');
    expiryDate.setMonth(expiryDate.getMonth() + defaultExpiryMonths);

    try {
      // Ensure jobs table insert fields exactly match database columns requested
      const { error } = await supabase
        .from('jobs')
        .insert([{
          job_title: jobData.job_title_en,
          job_description: jobData.job_description_en,
          phone: jobData.phone,
          poster_name: jobData.poster_name || null,
          phone_hidden: jobData.phone_hidden,
          expires_at: expiryDate.toISOString(),
        }]);

      if (error) {
        console.error('Supabase jobs insert error details:', error);
        throw error;
      }

      // Refresh data so the frontend is fully in sync with the database records
      await loadSupabaseData();
      triggerToast(lang === 'en' ? 'Job posted successfully! Live immediately.' : 'नौकरी सफलतापूर्वक पोस्ट हो गई है! तुरंत लाइव है।');
    } catch (err: any) {
      console.error('Supabase job publication failed inside try-catch:', err);
      triggerToast(lang === 'en' ? `⚠️ Supabase error: ${err.message || err}` : `⚠️ सिंक त्रुटि: ${err.message || err}`);
    }
  };

  // 2. Submit Business Ad
  const handleCreateAd = async (adData: Omit<Ad, 'id' | 'created_at' | 'sponsored' | 'status' | 'featured'>) => {
    try {
      const richAdMetadata = {
        ad_title: adData.ad_title || '',
        ad_description: adData.ad_description || adData.short_description || '',
        phone_number: adData.phone_number || adData.contact || '',
        whatsapp_number: adData.whatsapp_number || adData.contact || '',
        whatsapp_url: adData.whatsapp_url || '',
        website_url: adData.website_url || '',
        expiry_days: adData.expiry_days || 30,
        location: adData.location || 'Sri Ganganagar',
        short_description: adData.short_description || ''
      };

      const payloadDescription = JSON.stringify(richAdMetadata);

      const { error } = await supabase
        .from('ads')
        .insert([{
          business_name: adData.business_name,
          ad_description: adData.ad_description || adData.short_description || '',
          contact_number: adData.contact || adData.phone_number || '',
          image_url: adData.image_url,
          status: 'active',
          is_active: true,
          sponsored: true,
          featured: false,
          
          // Legacy compatibility
          contact: adData.contact || adData.phone_number || null,
          short_description: payloadDescription,
        }]);

      if (error) {
        console.error('Exact Supabase ads insert error details:', error);
        throw error;
      }

      // Reload all matching data from Supabase in real-time
      await loadSupabaseData();

      triggerToast(lang === 'en' ? 'Sponsored ad submitted successfully! Active and live.' : 'प्रायोजित विज्ञापन सफलतापूर्वक सबमिट हुआ और तुरंत लाइव हो गया है।');
    } catch (err: any) {
      console.error('Supabase ad submission failed inside try-catch:', err);
      triggerToast(lang === 'en' ? `⚠️ Supabase error: ${err.message || err}` : `⚠️ विज्ञापन पंजीकरण में त्रुटि: ${err.message || err}`);
    }
  };

  // 4. Admin Authentication
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminPasswordInput === 'admin335001') {
      setIsAdmin(true);
      localStorage.setItem('sgn_admin_session', 'true');
      setAdminPasswordInput('');
      setActiveModal(null);
      triggerToast(lang === 'en' ? 'Logged in as Admin successfully!' : 'सफलतापूर्वक एडमिन लॉगइन संपन्न हुआ!');
    } else {
      setLoginError(lang === 'en' ? 'Incorrect passcode!' : 'गलत पासवर्ड दर्ज किया!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('sgn_admin_session');
    triggerToast(lang === 'en' ? 'Logged out which hides restricted views' : 'मर्यादित दृश्य छुपाते हुए लॉगआउट हुआ');
  };

  // --- Admin Moderation Actions ---
  const handleToggleJobPhone = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const newHidden = !job.phone_hidden;

    setJobs(prev => prev.map(j => (j.id === id ? { ...j, phone_hidden: newHidden } : j)));

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ phone_hidden: newHidden })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase toggle job phone visibility failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Job phone visibility updated!' : 'जॉब फोन दृश्यता अपडेट की गई!');
  };

  const handleToggleJobPin = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const newPinned = !job.pinned;

    setJobs(prev => prev.map(j => (j.id === id ? { ...j, pinned: newPinned } : j)));

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ pinned: newPinned })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase toggle pin failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Job pin status toggled!' : 'जॉब पिन स्थिति अपडेट की गई!');
  };

  const handleDeleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase delete job failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Job deleted successfully' : 'नौकरी सफलतापूर्वक हटा दी गई');
  };

  // Admin Ads approval
  const handleApproveAd = async (id: string) => {
    setAds(prev => prev.map(a => (a.id === id ? { ...a, status: 'approved' } : a)));

    try {
      const { error } = await supabase
        .from('ads')
        .update({ status: 'approved' })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase approve ad failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Ad approved and live!' : 'विज्ञापन स्वीकृत और लाइव हुआ!');
  };

  const handleRejectAd = async (id: string) => {
    setAds(prev => prev.map(a => (a.id === id ? { ...a, status: 'rejected' } : a)));

    try {
      const { error } = await supabase
        .from('ads')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase reject ad failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Ad rejected!' : 'विज्ञापन खारिज किया गया!');
  };

  const handleToggleAdFeature = async (id: string) => {
    const ad = ads.find(a => a.id === id);
    if (!ad) return;
    const newFeatured = !ad.featured;

    setAds(prev => prev.map(a => (a.id === id ? { ...a, featured: newFeatured } : a)));

    try {
      const { error } = await supabase
        .from('ads')
        .update({ featured: newFeatured })
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase toggle feature ad failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Ad premium featured status updated!' : 'विज्ञापन विशेष स्थिति अपडेट की गई!');
  };

  const handleDeleteAd = async (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase delete ad failed:', err.message || err);
    }
    triggerToast(lang === 'en' ? 'Ad completely deleted' : 'विज्ञापन पूरी तरह हटा दिया गया');
  };

  const handleChangeConfigExpiry = (months: number) => {
    setDefaultExpiryMonths(months);
    localStorage.setItem('sgn_expiry_months', months.toString());
    triggerToast(lang === 'en' ? `New jobs will now expire in ${months} months!` : `अब नए काम ${months} महीनों में समाप्त होंगे!`);
  };

  // --- Filtering Algorithm ---
  // We search for query on Title & Description in both English and Hindi
  const filteredJobs = jobs.filter(job => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      job.job_title_en.toLowerCase().includes(q) ||
      job.job_title_hi.toLowerCase().includes(q) ||
      job.job_description_en.toLowerCase().includes(q) ||
      job.job_description_hi.toLowerCase().includes(q) ||
      (job.poster_name && job.poster_name.toLowerCase().includes(q));

    const matchesLocation = selectedLocation === 'All' || 
      job.job_description_en.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      job.job_description_hi.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || 
      job.job_title_en.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      job.job_title_hi.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      job.job_description_en.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      job.job_description_hi.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesLocation && matchesCategory;
  });

  // Sort: Pinned first, then by creation date newest first
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Active Approved Ads to display and inject
  const approvedAds = ads.filter(ad => ad.status === 'active' || ad.is_active === true || ad.status === 'approved');
  const featuredAds = approvedAds.filter(ad => ad.featured);

  // Sri Ganganagar Locations for swift pills
  const SGN_LOCATIONS = [
    { en: 'All', hi: 'सभी स्थान' },
    { en: 'Gol Bazar', hi: 'गोल बाजार' },
    { en: 'Sukhadia Circle', hi: 'सुखाड़िया सर्कल' },
    { en: 'Meera Chowk', hi: 'मीरा चौक' },
    { en: 'Ridhi Sidhi', hi: 'रिद्धि सिद्धि' },
    { en: 'Chahal Chowk', hi: 'चहल चौक' },
    { en: 'Padampur Road', hi: 'पदमपुर रोड' }
  ];

  // Quick categories
  const SGN_CATEGORIES = [
    { en: 'All', hi: 'सभी श्रेणियां' },
    { en: 'Helper', hi: 'हेल्पर / सहायक' },
    { en: 'Teacher', hi: 'टीचर / शिक्षक' },
    { en: 'Computer', hi: 'कंप्यूटर / आॅपरेटर' },
    { en: 'Delivery', hi: 'डिलीवरी' }
  ];

  // Text constants for bilingual setup
  const text = {
    title: lang === 'en' ? 'Sriganganagar Jobs' : 'श्रीगंगानगर जॉब्स',
    sub: lang === 'en' ? 'Direct Phone Calls • No Login • Verified Local Board' : 'सीधा फोन कॉल • कोई पासवर्ड या लॉगिन नहीं • प्रमाणित बोर्ड',
    placeholders: lang === 'en' ? 'Search jobs (e.g. computer, helper, teacher)...' : 'काम खोजें (जैसे: कंप्यूटर, हेल्पर, टीचर)...',
    btnPost: lang === 'en' ? 'Post Job (Free)' : 'जॉब पोस्ट करें (फ्री)',
    btnAd: lang === 'en' ? 'Post Sponsored Ad' : 'स्पॉन्सर्ड विज्ञापन डालें',
    pinnedTitle: lang === 'en' ? 'Featured listings' : 'मुख्य स्थानीय नौकरियां',
    allListings: lang === 'en' ? 'Available jobs in Ganganagar' : 'श्रीगंगानगर में रिक्तियां',
    emptyList: lang === 'en' ? 'No local jobs matching search criteria.' : 'खोजे गए विवरण से संबंधित कोई नौकरी नहीं मिली।',
    pinLabel: lang === 'en' ? 'Pincode: 335001 • Rajasthan' : 'पिन कोड: 335001 • राजस्थान',
    sideAdTitle: lang === 'en' ? 'Business Showcase' : 'लोकल बिजनेस शोकेस',
    sideAdSub: lang === 'en' ? 'Reach thousand of locals monthly' : 'प्रति माह हजारों स्थानीय लोगों तक पहुंचे',
    adminTrigger: lang === 'en' ? '🔒 Admin Area' : '🔒 एडमिन क्षेत्र',
    adminPassTitle: lang === 'en' ? 'Enter Owner Passcode' : 'ऑनर सीक्रेट पिन डालें',
    adminPassDesc: lang === 'en' ? 'Default passcode is PIN Code: admin335001' : 'डिफ़ॉल्ट पिन कोड है: admin335001'
  };

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans selection:bg-[#25D366]/30">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#075E54] border border-[#128C7E] text-[#ECE5DD] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-sm text-xs font-bold font-sans">
            <CheckCircle size={16} className="text-[#25D366]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Primary Header */}
      <header className="bg-[#075E54] text-[#ECE5DD] shadow-md sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3">
          
          <div className="flex items-center justify-between">
            {/* Logo Brand */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-2xl">
                <Building size={24} className="text-[#25D366] stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white sm:text-2xl">
                  {text.title}
                </h1>
                <p className="text-[10px] text-[#25D366] font-bold tracking-wider uppercase mt-1">
                  {text.pinLabel}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher Button */}
              <button
                onClick={handleToggleLang}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Languages size={14} className="text-[#25D366]" />
                <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
              </button>

              {/* Desktop action buttons (Visible on sm/tablet and larger) */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  id="header-post-job-btn"
                  onClick={() => setActiveModal('job')}
                  className="px-4 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span>{text.btnPost}</span>
                </button>

                <button
                  id="header-post-ad-btn"
                  onClick={() => setActiveModal('ad')}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Megaphone size={14} className="fill-slate-950 stroke-[2.5]" />
                  <span>{text.btnAd}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile action buttons (Visible only under sm/tablet breakpoint) */}
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:hidden w-full">
            <button
              onClick={() => setActiveModal('job')}
              className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              <span>{text.btnPost}</span>
            </button>
            <button
              onClick={() => setActiveModal('ad')}
              className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Megaphone size={14} className="fill-slate-950 stroke-[2.5]" />
              <span>{text.btnAd}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Secondary Dynamic Subheader info banner */}
      <div className="bg-[#128C7E] text-white/90 text-[11px] sm:text-xs py-2 px-4 shadow-inner flex flex-wrap items-center justify-center gap-2 font-medium font-sans">
        <div className="flex items-center gap-1.5 justify-center">
          <Sparkles size={13} className="text-amber-300 animate-pulse flex-shrink-0" />
          <span>{text.sub}</span>
        </div>
        
        {/* Supabase Status Indicator Badge */}
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
          dbConnected 
            ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/20 shadow-xs' 
            : 'bg-amber-950/40 text-amber-200 border border-amber-500/20 animate-pulse'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
          <span>{dbConnected ? 'Cloud Sync Live' : 'Connecting Sync...'}</span>
        </span>
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Middle Main Feed Section (8 cols) */}
        <section className="lg:col-span-8 space-y-6">

          {/* Admin Dashboard Active state */}
          {isAdmin && (
            <AdminDashboard
              jobs={jobs}
              ads={ads}
              lang={lang}
              expiryMonths={defaultExpiryMonths}
              onSetExpiry={handleChangeConfigExpiry}
              onApproveAd={handleApproveAd}
              onRejectAd={handleRejectAd}
              onDeleteAd={handleDeleteAd}
              onToggleAdFeature={handleToggleAdFeature}
              onDeleteJob={handleDeleteJob}
              onToggleJobPhone={handleToggleJobPhone}
              onToggleJobPin={handleToggleJobPin}
              onLogout={handleAdminLogout}
            />
          )}

          {/* Mobile Spotlight Featured Ads Carousel */}
          {featuredAds.length > 0 && (
            <div className="block lg:hidden bg-amber-400 p-4 rounded-3xl shadow-sm border border-amber-500/30 overflow-hidden relative">
              <div className="flex items-center gap-1.5 text-xs text-slate-900 font-black tracking-wider uppercase mb-3">
                <Megaphone size={14} className="fill-slate-900" />
                <span>⭐ {lang === 'en' ? 'Top Sriganganagar Business' : 'मुख्य व्यवसायी विज्ञापन'}</span>
              </div>
              <div className="space-y-3">
                {featuredAds.slice(0, 1).map(ad => (
                  <BusinessAdCard
                    key={ad.id}
                    ad={ad}
                    lang={lang}
                    isAdmin={isAdmin}
                    layout="feed"
                    onApprove={handleApproveAd}
                    onReject={handleRejectAd}
                    onDelete={handleDeleteAd}
                    onToggleFeature={handleToggleAdFeature}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Searching and swift filters */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-100 space-y-4">
            
            {/* Direct Input Field */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={text.placeholders}
                className="w-full pl-11 pr-4 py-3 bg-[#F0F2F5]/50 hover:bg-[#F0F2F5]/80 focus:bg-white rounded-2xl border border-transparent focus:border-[#128C7E] focus:outline-hidden text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Locations Pill Filter Row */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                📍 {lang === 'en' ? 'Filter by Location' : 'स्थान चुनें'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SGN_LOCATIONS.map((loc) => (
                  <button
                    key={loc.en}
                    onClick={() => setSelectedLocation(loc.en)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      (loc.en === 'All' && selectedLocation === 'All') || selectedLocation === loc.en
                        ? 'bg-[#075E54] text-[#ECE5DD] shadow-xs'
                        : 'bg-[#F0F2F5] hover:bg-[#ECE5DD] text-slate-700'
                    }`}
                  >
                    {lang === 'en' ? loc.en : loc.hi}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Pill Filter Row */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                💼 {lang === 'en' ? 'Filter by Job Category' : 'जॉब की श्रेणी'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SGN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.en}
                    onClick={() => setSelectedCategory(cat.en)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      (cat.en === 'All' && selectedCategory === 'All') || selectedCategory === cat.en
                        ? 'bg-[#128C7E] text-white shadow-xs'
                        : 'bg-[#F0F2F5] hover:bg-[#ECE5DD] text-slate-700'
                    }`}
                  >
                    {lang === 'en' ? cat.en : cat.hi}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Active Job Feed Display */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Briefcase size={16} className="text-[#128C7E]" />
                <span>{text.allListings}</span>
                <span className="bg-[#128C7E]/10 text-[#075E54] text-xs font-bold px-2 py-0.5 rounded-full">
                  {sortedJobs.length}
                </span>
              </h2>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Direct phone listings' : 'सीधे संपर्क नंबर'}
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs animate-pulse space-y-3">
                    <div className="flex gap-2 items-center">
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                      <div className="h-4 w-16 bg-slate-100 rounded" />
                    </div>
                    <div className="h-6 w-2/3 bg-slate-200 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-slate-100 rounded" />
                      <div className="h-4 w-5/6 bg-slate-50 rounded" />
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 p-2 rounded-xl">
                      <div className="h-6 w-32 bg-slate-100 rounded" />
                      <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200/60 p-12 text-center rounded-3xl space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase size={28} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{text.emptyList}</p>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' 
                      ? 'Be the first to post a vacancy! No registration required.' 
                      : 'पहली रिक्ति पोस्ट करने वाले बनें! कोई पंजीकरण की आवश्यकता नहीं है।'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal('job')}
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] font-bold text-xs text-slate-950 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span>{text.btnPost}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Dynamically alternate jobs and ads */}
                {(() => {
                  const elements: React.ReactNode[] = [];
                  let adIndex = 0;

                  sortedJobs.forEach((job, index) => {
                    elements.push(
                      <JobCard
                        key={job.id}
                        job={job}
                        lang={lang}
                        isAdmin={isAdmin}
                        onDelete={handleDeleteJob}
                        onTogglePhone={handleToggleJobPhone}
                        onTogglePin={handleToggleJobPin}
                      />
                    );

                    // Insert approved ad every 2 job listings in feed scroll - do not duplicate ads
                    if ((index + 1) % 2 === 0 && adIndex < approvedAds.length) {
                      const adToShow = approvedAds[adIndex];
                      adIndex++;
                      elements.push(
                        <div key={`feed-ad-wrap-${adToShow.id}-${index}`} className="my-4">
                          <BusinessAdCard
                            ad={adToShow}
                            lang={lang}
                            isAdmin={isAdmin}
                            layout="feed"
                            onApprove={handleApproveAd}
                            onReject={handleRejectAd}
                            onDelete={handleDeleteAd}
                            onToggleFeature={handleToggleAdFeature}
                          />
                        </div>
                      );
                    }
                  });

                  return elements;
                })()}
              </div>
            )}

          </div>

        </section>

        {/* Right Desktop Sidebar Section (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">

          {/* Quick info disclaimer card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info size={14} className="text-[#128C7E]" />
              <span>{lang === 'en' ? 'How Sri Ganganagar Board Works' : 'यह बोर्ड कैसे कार्य करता है'}</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2.5 leading-relaxed pl-1">
              <li className="flex gap-2">
                <span className="text-[#25D366] font-bold">✓</span>
                <span>
                  {lang === 'en' 
                    ? 'Anyone can post work instantly. Visible to all visitors live immediately!' 
                    : 'कोई भी तुरंत नया काम पोस्ट कर सकता है। सभी को तुरंत लाइव दिखाई देता है!'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#25D366] font-bold">✓</span>
                <span>
                  {lang === 'en' 
                    ? 'No signups, profiles, emails, or password lists to remember.' 
                    : 'याद रखने के लिए कोई पंजीकरण, प्रोफाइल, ईमेल या विज्ञापन पासवर्ड नहीं।'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#25D366] font-bold">✓</span>
                <span>
                  {lang === 'en' 
                    ? 'Contact employers directly by clicking "Call Directly" or unlocking contact.' 
                    : 'कॉल करके सीधा संपर्क करें! पूरी गोपनीयता के लिए कुछ नंबर आंशिक बंद होते हैं।'}
                </span>
              </li>
            </ul>
          </div>

          {/* Business Ads Board Side panel */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-rose-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                  {text.sideAdTitle}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase tracking-wider">
                  {text.sideAdSub}
                </span>
              </div>

              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:text-amber-805 border border-amber-200 text-[10px] font-black tracking-wider rounded-lg uppercase">
                {lang === 'en' ? 'Verified Ads' : 'सत्यापित'}
              </span>
            </div>

            {/* Display Approved / Promoted Business templates */}
            {approvedAds.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50 p-4">
                <Megaphone size={20} className="mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-bold text-slate-500">
                  {lang === 'en' ? 'No featured ads live.' : 'कोई प्रायोजित विज्ञापन उपलब्ध नहीं है।'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {lang === 'en' ? 'Click "Post Sponsored Ad" in the header to submit yours!' : 'अपना पहला विज्ञापन लगाने के लिए ऊपर हैडर के बटन पर क्लिक करें!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedAds.map(ad => (
                  <BusinessAdCard
                    key={`side-ad-${ad.id}`}
                    ad={ad}
                    lang={lang}
                    isAdmin={isAdmin}
                    layout="sidebar"
                    onApprove={handleApproveAd}
                    onReject={handleRejectAd}
                    onDelete={handleDeleteAd}
                    onToggleFeature={handleToggleAdFeature}
                  />
                ))}
              </div>
            )}

            {/* Advertising Contact Sticky Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-[#fffbf0] border border-amber-200/60 shadow-xs space-y-1.5 bh-amber-50">
              <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-amber-800 tracking-widest">
                <Sparkles size={11} className="fill-amber-500 text-amber-500" />
                <span>{lang === 'en' ? 'Advertise With Us' : 'यहाँ विज्ञापन लगाएं'}</span>
              </div>
              <p className="text-[11px] text-slate-605 leading-relaxed font-sans">
                {lang === 'en' ? 'Promote your shop, coaching, or local business on Sriganganagar\'s #1 board.' : 'अपने स्थानीय व्यवसाय, कोचिंग या दुकान का श्रीगंगानगर की नंबर #1 वेबसाइट पर प्रचार करें।'}
              </p>
              <div className="pt-2 text-[11px] text-slate-700 border-t border-amber-200/50 flex flex-col gap-0.5 font-bold font-sans">
                <span>
                  {lang === 'en' ? 'For advertising contact:' : 'विज्ञापन हेतु संपर्क:'}{' '}
                  <span className="font-black text-slate-900">Prince Sharma</span>
                </span>
                <span>
                  {lang === 'en' ? 'Email:' : 'ईमेल:'}{' '}
                  <a href="mailto:princeoffice2021@gmail.com" className="text-amber-600 underline font-black hover:text-amber-700">
                    princeoffice2021@gmail.com
                  </a>
                </span>
              </div>
            </div>

          </div>

          {/* Sri Ganganagar Area Landmark Tags */}
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Popular Sri Ganganagar Sectors' : 'लोकप्रिय श्रीगंगानगर व्यापार क्षेत्र'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-100/50">
                🌾 Grain Mandi (अनाज मंडी)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-100/50">
                🍊 Kinnow Packers (किन्नू पैकिंग)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-100/50">
                📚 Coaching Hubs (कोचिंग हब)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-100/50">
                🏥 Meera Chowk Labs (लैब्स / अस्पताल)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-50 text-slate-600 rounded-lg border border-slate-100/50">
                👚 Gol Bazar Showrooms (शोरूम)
              </span>
            </div>
          </div>

        </aside>

      </main>

      {/* Structured Minimal Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 mt-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <p className="font-bold text-slate-200">
              {lang === 'en' ? 'Sri Ganganagar Local App Board' : 'श्रीगंगानगर लोकल जॉब बोर्ड'}
            </p>
            <p className="text-[10.5px] text-slate-400">
              © 2026. Made of simple WhatsApp concepts. Expire-protected listings.
            </p>
          </div>

          {/* Need Help Section */}
          <div className="py-2.5 px-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-[11px] max-w-sm space-y-0.5 mx-auto md:mx-0">
            <p className="font-bold text-slate-300">
              {lang === 'en' ? 'Need help or facing any issue?' : 'क्या आपको मदद की ज़रूरत है या कोई समस्या आ रही है?'}
            </p>
            <p className="text-slate-400">
              {lang === 'en' ? 'Contact:' : 'संपर्क:'} <span className="text-slate-200 font-medium">Prince Sharma</span>
            </p>
            <p className="text-slate-400">
              {lang === 'en' ? 'Email:' : 'ईमेल:'} <a href="mailto:princeoffice2021@gmail.com" className="text-amber-400 hover:underline">princeoffice2021@gmail.com</a>
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Standard Privacy/General Note placeholder */}
            <span className="text-[11px] text-slate-500 font-medium">
              Made in Rajasthan for local community
            </span>

            {/* Admin trigger handler */}
            {!isAdmin ? (
              <button
                id="footer-admin-login-btn"
                onClick={() => setActiveModal('login')}
                className="text-[11px] text-slate-400 underline hover:text-white font-black cursor-pointer bg-transparent border-none outline-hidden"
              >
                {text.adminTrigger}
              </button>
            ) : (
              <button
                onClick={handleAdminLogout}
                className="text-[11.5px] text-red-400 hover:text-red-300 font-bold cursor-pointer bg-transparent border-none outline-hidden flex items-center gap-1"
              >
                <span>Logout Admin ({lang === 'en' ? 'Exit' : 'लॉगआउट'})</span>
              </button>
            )}
          </div>

        </div>
      </footer>

      {/* --- Overlay Modals (All components initialized conditionally) --- */}
      
      {/* 1. Job Posting Form Modal */}
      <JobPostingModal
        isOpen={activeModal === 'job'}
        onClose={() => setActiveModal(null)}
        lang={lang}
        onPostJob={handleCreateJob}
      />

      {/* 2. Business Ad Posting Modal */}
      <AdPostingModal
        isOpen={activeModal === 'ad'}
        onClose={() => setActiveModal(null)}
        lang={lang}
        onPostAd={handleCreateAd}
      />

      {/* 4. Owner Admin Login Secret Pin Prompt Modal */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setActiveModal(null)} />
          
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield size={18} className="text-amber-400" />
                <h3 className="font-bold text-sm">{text.adminPassTitle}</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)} 
                className="text-white/60 hover:text-white cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                {text.adminPassDesc}
              </p>

              {loginError && (
                <div className="p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>{loginError}</span>
                </div>
              )}

              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Password (e.g. admin335001)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-sm font-mono"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
              >
                {lang === 'en' ? 'Verify Password & Enter' : 'पासवर्ड सत्यापित करें'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
