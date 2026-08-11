import { createClient } from '@supabase/supabase-js';
import { Candidate, ContactUnlock, EmployerInquiry, UserSession, ProfileReport } from './candidateTypes';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// INITIAL SEED DATA FOR DEMO / PREVIEW MODE
// ==========================================
const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    phone_number: '9829012345',
    full_name: 'रामकुमार वर्मा (Ramkumar Verma)',
    photo_url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Driver',
    experience_years: 7,
    country: 'India',
    state: 'Rajasthan',
    district: 'Sri Ganganagar',
    tahsil: 'Padampur Tahsil',
    village_or_town: 'Gajsinghpur',
    area_other: 'Near Main Bus Stand, Ward No 4',
    is_available: true,
    expected_salary: '₹18,000 / month',
    bio: 'Heavy vehicle and commercial car driver with 7 years experience in Sri Ganganagar and Jaipur routes. Valid Commercial DL available. Punctual and non-smoker.',
    is_verified: true,
    view_count: 142,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'cand-2',
    phone_number: '9876543210',
    full_name: 'सुनील शर्मा (Sunil Sharma)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Electrician',
    experience_years: 5,
    country: 'India',
    state: 'Rajasthan',
    district: 'Sri Ganganagar',
    tahsil: 'Sri Ganganagar Tahsil',
    village_or_town: 'Sri Ganganagar City',
    area_other: 'Ravindra Path, Near Govt Hospital',
    is_available: true,
    expected_salary: '₹15,000 - ₹20,000 / month',
    bio: 'ITI qualified electrician. Experienced in house wiring, motor winding, solar panel installation and industrial panel maintenance.',
    is_verified: true,
    view_count: 89,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'cand-3',
    phone_number: '9414098765',
    full_name: 'प्रिया सेठी (Priya Sethi)',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Teacher',
    experience_years: 4,
    country: 'India',
    state: 'Rajasthan',
    district: 'Sri Ganganagar',
    tahsil: 'Suratgarh Tahsil',
    village_or_town: 'Suratgarh City',
    area_other: 'Model Town, Near Public Park',
    is_available: true,
    expected_salary: '₹16,000 / month',
    bio: 'B.Ed & M.Sc Mathematics teacher for primary and secondary school. Fluency in Hindi, English and Punjabi. Excellent student results.',
    is_verified: true,
    view_count: 210,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'cand-4',
    phone_number: '9988776655',
    full_name: 'गुरप्रीत सिंह (Gurpreet Singh)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Computer Operator',
    experience_years: 3,
    country: 'India',
    state: 'Punjab',
    district: 'Bathinda',
    tahsil: 'Bathinda Tahsil',
    village_or_town: 'Bathinda City',
    area_other: 'G T Road',
    is_available: false,
    expected_salary: '₹14,000 / month',
    bio: 'Expert in Tally Prime, MS Excel, Typing speed 45 WPM in English & Punjabi. GST billing and inventory management experience.',
    is_verified: false,
    view_count: 65,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'cand-5',
    phone_number: '9123456789',
    full_name: 'राकेश भाटी (Rakesh Bhati)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Security Guard',
    experience_years: 6,
    country: 'India',
    state: 'Rajasthan',
    district: 'Jaipur',
    tahsil: 'Sanganer Tahsil',
    village_or_town: 'Sanganer Town',
    area_other: 'Near Airport Road',
    is_available: true,
    expected_salary: '₹15,000 / month',
    bio: 'Ex-Army contractor security staff. Height 6ft. Experienced in CCTV monitoring, visitor logs and gate pass management.',
    is_verified: true,
    view_count: 118,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'cand-6',
    phone_number: '9811223344',
    full_name: 'मोहम्मद आरिफ (Mohd Arif)',
    photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    skill_category: 'Plumber',
    experience_years: 8,
    country: 'UAE',
    state: 'Dubai',
    district: 'Dubai Central',
    tahsil: 'Deira',
    village_or_town: 'Al Rigga',
    area_other: 'Building 12, Floor 2',
    is_available: true,
    expected_salary: 'AED 2,500 / month',
    bio: 'Sanitary fitting, pipeline repairing, water tank pump installations and leak detection specialist. Gulf return experienced.',
    is_verified: true,
    view_count: 76,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

// Helper to access LocalStorage with fallback
const getStoredCandidates = (): Candidate[] => {
  try {
    const data = localStorage.getItem('sgj_candidates');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_CANDIDATES;
};

const saveCandidatesToStorage = (candidates: Candidate[]) => {
  try {
    localStorage.setItem('sgj_candidates', JSON.stringify(candidates));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

const getStoredUnlocks = (): ContactUnlock[] => {
  try {
    const data = localStorage.getItem('sgj_contact_unlocks');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return [];
};

const saveUnlocksToStorage = (unlocks: ContactUnlock[]) => {
  try {
    localStorage.setItem('sgj_contact_unlocks', JSON.stringify(unlocks));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

const getStoredInquiries = (): EmployerInquiry[] => {
  try {
    const data = localStorage.getItem('sgj_employer_inquiries');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return [];
};

const saveInquiriesToStorage = (inquiries: EmployerInquiry[]) => {
  try {
    localStorage.setItem('sgj_employer_inquiries', JSON.stringify(inquiries));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

// ==========================================
// MOBILE NUMBER + PASSWORD AUTHENTICATION
// (No OTP / no paid SMS service — candidate sets their own password)
// ==========================================

// Hash the password client-side with SHA-256 before ever storing/sending it.
// This is a static frontend app with no custom backend server, so this is
// the strongest protection available without adding a paid backend service.
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function registerCandidate(
  phone: string,
  password: string
): Promise<{ success: boolean; message: string; session?: UserSession }> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, message: 'Kripya sahi 10-digit mobile number darj karein.' };
  }
  if (!password || password.length < 4) {
    return { success: false, message: 'Password kam se kam 4 characters ka hona chahiye.' };
  }

  const existing = await fetchCandidateByPhone(cleanPhone);
  if (existing && existing.password_hash) {
    return { success: false, message: 'Ye mobile number pehle se register hai. Kripya Login karein.' };
  }

  const passwordHash = await hashPassword(password);
  const candidate = await saveOrUpdateCandidate({
    id: existing?.id,
    phone_number: cleanPhone,
    password_hash: passwordHash,
    full_name: existing?.full_name,
  });

  const session: UserSession = {
    phone_number: cleanPhone,
    candidate_id: candidate.id,
    is_logged_in: true,
  };
  saveStoredSession(session);
  return { success: true, message: 'Registration safal! Ab apni profile complete karein.', session };
}

export async function loginCandidate(
  phone: string,
  password: string
): Promise<{ success: boolean; message: string; session?: UserSession }> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (cleanPhone.length !== 10) {
    return { success: false, message: 'Kripya sahi 10-digit mobile number darj karein.' };
  }

  const existing = await fetchCandidateByPhone(cleanPhone);
  if (!existing || !existing.password_hash) {
    return { success: false, message: 'Ye mobile number registered nahi hai. Kripya pehle Register karein.' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== existing.password_hash) {
    return { success: false, message: 'Galat password. Kripya dobara try karein.' };
  }

  const session: UserSession = {
    phone_number: cleanPhone,
    candidate_id: existing.id,
    is_logged_in: true,
  };
  saveStoredSession(session);
  return { success: true, message: 'Login safal!', session };
}

// ==========================================
// CORE DATA ACCESS SERVICE API
// ==========================================

export async function fetchAllCandidates(): Promise<Candidate[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Candidate[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }
  return getStoredCandidates();
}

export async function fetchCandidateById(id: string): Promise<Candidate | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Candidate;
      }
    } catch (e) {
      console.warn('Supabase fetchById error:', e);
    }
  }
  const candidates = getStoredCandidates();
  return candidates.find((c) => c.id === id) || null;
}

export async function fetchCandidateByPhone(phone: string): Promise<Candidate | null> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .ilike('phone_number', `%${cleanPhone}%`)
        .single();

      if (!error && data) {
        return data as Candidate;
      }
    } catch (e) {
      console.warn('Supabase fetchByPhone error:', e);
    }
  }
  const candidates = getStoredCandidates();
  return candidates.find((c) => c.phone_number.replace(/\D/g, '').slice(-10) === cleanPhone) || null;
}

export async function saveOrUpdateCandidate(candidateData: Partial<Candidate> & { phone_number: string }): Promise<Candidate> {
  const existing = await fetchCandidateByPhone(candidateData.phone_number);
  const candidateId = candidateData.id || existing?.id || `cand-${Date.now()}`;

  const fullCandidate: Candidate = {
    id: candidateId,
    phone_number: candidateData.phone_number,
    password_hash: candidateData.password_hash || existing?.password_hash,
    full_name: candidateData.full_name || 'Anonymous Worker',
    photo_url: candidateData.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    skill_category: candidateData.skill_category || 'Helper / Worker',
    experience_years: candidateData.experience_years ?? 0,
    country: candidateData.country || 'India',
    state: candidateData.state || 'Rajasthan',
    district: candidateData.district || 'Sri Ganganagar',
    tahsil: candidateData.tahsil || '',
    village_or_town: candidateData.village_or_town || '',
    area_other: candidateData.area_other || '',
    is_available: candidateData.is_available ?? true,
    expected_salary: candidateData.expected_salary || '',
    bio: candidateData.bio || '',
    is_verified: existing ? existing.is_verified : false,
    view_count: existing ? existing.view_count : 0,
    created_at: existing ? existing.created_at : new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .upsert(fullCandidate)
        .select()
        .single();

      if (!error && data) {
        return data as Candidate;
      }
    } catch (e) {
      console.warn('Supabase upsert error:', e);
    }
  }

  // Local storage fallback
  const candidates = getStoredCandidates();
  const index = candidates.findIndex((c) => c.id === fullCandidate.id || c.phone_number === fullCandidate.phone_number);
  if (index >= 0) {
    candidates[index] = fullCandidate;
  } else {
    candidates.unshift(fullCandidate);
  }
  saveCandidatesToStorage(candidates);
  return fullCandidate;
}

export async function toggleCandidateAvailability(candidateId: string, isAvailable: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('candidates')
        .update({ is_available: isAvailable })
        .eq('id', candidateId);
    } catch (e) {
      console.warn('Supabase toggleAvailability error:', e);
    }
  }

  const candidates = getStoredCandidates();
  const cand = candidates.find((c) => c.id === candidateId);
  if (cand) {
    cand.is_available = isAvailable;
    saveCandidatesToStorage(candidates);
    return true;
  }
  return false;
}

export async function toggleCandidateVerification(candidateId: string, isVerified: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('candidates')
        .update({ is_verified: isVerified })
        .eq('id', candidateId);
    } catch (e) {
      console.warn('Supabase toggleVerification error:', e);
    }
  }

  const candidates = getStoredCandidates();
  const cand = candidates.find((c) => c.id === candidateId);
  if (cand) {
    cand.is_verified = isVerified;
    saveCandidatesToStorage(candidates);
    return true;
  }
  return false;
}

export async function deleteCandidateProfile(candidateId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('candidates').delete().eq('id', candidateId);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  const candidates = getStoredCandidates().filter((c) => c.id !== candidateId);
  saveCandidatesToStorage(candidates);
  return true;
}

export async function incrementCandidateViewCount(candidateId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.rpc('increment_candidate_view', { candidate_uuid: candidateId });
    } catch (e) {
      console.warn('Supabase view increment error:', e);
    }
  }

  const candidates = getStoredCandidates();
  const cand = candidates.find((c) => c.id === candidateId);
  if (cand) {
    cand.view_count = (cand.view_count || 0) + 1;
    saveCandidatesToStorage(candidates);
  }
}

// ==========================================
// CONTACT UNLOCK & MONETIZATION METHODS
// ==========================================

export async function checkIsContactUnlocked(candidateId: string, employerPhone: string): Promise<boolean> {
  if (!employerPhone) return false;
  const cleanPhone = employerPhone.replace(/\D/g, '').slice(-10);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('contact_unlocks')
        .select('id')
        .eq('candidate_id', candidateId)
        .ilike('employer_phone', `%${cleanPhone}%`)
        .eq('payment_status', 'success');

      if (data && data.length > 0) return true;
    } catch (e) {
      console.warn('Supabase check unlock error:', e);
    }
  }

  const unlocks = getStoredUnlocks();
  return unlocks.some(
    (u) => u.candidate_id === candidateId && u.employer_phone.replace(/\D/g, '').slice(-10) === cleanPhone && u.payment_status === 'success'
  );
}

export async function recordContactUnlock(
  candidateId: string,
  employerPhone: string,
  amount: number,
  paymentId: string
): Promise<ContactUnlock> {
  const unlockRecord: ContactUnlock = {
    id: `unlock-${Date.now()}`,
    candidate_id: candidateId,
    employer_phone: employerPhone,
    amount_paid: amount,
    payment_id: paymentId,
    payment_status: 'success',
    unlocked_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('contact_unlocks').insert(unlockRecord).select().single();
      if (!error && data) return data as ContactUnlock;
    } catch (e) {
      console.warn('Supabase insert unlock error:', e);
    }
  }

  const unlocks = getStoredUnlocks();
  unlocks.unshift(unlockRecord);
  saveUnlocksToStorage(unlocks);
  return unlockRecord;
}

export async function fetchAllUnlocks(): Promise<ContactUnlock[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_unlocks')
        .select('*')
        .order('unlocked_at', { ascending: false });

      if (!error && data) return data as ContactUnlock[];
    } catch (e) {
      console.warn('Supabase fetch unlocks error:', e);
    }
  }
  return getStoredUnlocks();
}

// ==========================================
// EMPLOYER INQUIRIES
// ==========================================

export async function submitEmployerInquiry(
  candidateId: string,
  name: string,
  phone: string,
  message: string
): Promise<EmployerInquiry> {
  const inquiry: EmployerInquiry = {
    id: `inq-${Date.now()}`,
    candidate_id: candidateId,
    employer_name: name,
    employer_phone: phone,
    message: message,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('employer_inquiries').insert(inquiry).select().single();
      if (!error && data) return data as EmployerInquiry;
    } catch (e) {
      console.warn('Supabase insert inquiry error:', e);
    }
  }

  const inquiries = getStoredInquiries();
  inquiries.unshift(inquiry);
  saveInquiriesToStorage(inquiries);
  return inquiry;
}

export async function fetchAllInquiries(): Promise<EmployerInquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('employer_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as EmployerInquiry[];
    } catch (e) {
      console.warn('Supabase fetch inquiries error:', e);
    }
  }
  return getStoredInquiries();
}

// ==========================================
// REPORTS HANDLING
// ==========================================
const getStoredReports = (): ProfileReport[] => {
  try {
    const data = localStorage.getItem('sgj_reports');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return [];
};

const saveReportsToStorage = (reports: ProfileReport[]) => {
  try {
    localStorage.setItem('sgj_reports', JSON.stringify(reports));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

export async function submitProfileReport(
  candidateId: string | undefined,
  reason: string,
  reporterContact?: string
): Promise<ProfileReport> {
  const report: ProfileReport = {
    id: `rep-${Date.now()}`,
    candidate_id: candidateId || undefined,
    reason,
    reporter_contact: reporterContact || undefined,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('reports').insert(report).select().single();
      if (!error && data) return data as ProfileReport;
    } catch (e) {
      console.warn('Supabase insert report error:', e);
    }
  }

  const reports = getStoredReports();
  reports.unshift(report);
  saveReportsToStorage(reports);
  return report;
}

export async function fetchAllReports(): Promise<ProfileReport[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as ProfileReport[];
    } catch (e) {
      console.warn('Supabase fetch reports error:', e);
    }
  }
  return getStoredReports();
}


// ==========================================
// USER SESSION LOCAL STORAGE PERSISTENCE
// ==========================================

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem('sgj_user_session');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Session load error:', e);
  }
  return null;
}

export function saveStoredSession(session: UserSession) {
  try {
    localStorage.setItem('sgj_user_session', JSON.stringify(session));
  } catch (e) {
    console.warn('Session save error:', e);
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem('sgj_user_session');
  } catch (e) {
    console.warn('Session clear error:', e);
  }
}
