export interface Candidate {
  id: string;
  phone_number: string;
  password_hash?: string;
  full_name: string;
  photo_url?: string;
  skill_category: string;
  skill_categories?: string[]; // up to 5 skills chosen by the candidate
  experience_years: number;
  country: string;
  state: string;
  district: string;
  tahsil?: string;
  village_or_town?: string;
  area_other?: string;
  is_available: boolean;
  expected_salary?: string;
  bio?: string;
  is_verified: boolean;
  view_count: number;
  created_at: string;
}

export interface SkillCategory {
  id: number;
  name_hindi: string;
  name_english: string;
  icon_name: string;
}

export interface LocationItem {
  country: string;
  state: string;
  district: string;
  tahsil: string;
  village_or_town: string;
}

export interface ContactUnlock {
  id: string;
  candidate_id: string;
  employer_phone: string;
  amount_paid: number;
  payment_id: string;
  payment_status: 'success' | 'pending' | 'failed';
  unlocked_at: string;
}

export interface EmployerInquiry {
  id: string;
  candidate_id: string;
  employer_name: string;
  employer_phone: string;
  message?: string;
  created_at: string;
}

export interface UserSession {
  phone_number: string;
  candidate_id?: string;
  is_logged_in: boolean;
}

export interface FilterState {
  searchQuery: string;
  skill: string;
  country: string;
  state: string;
  district: string;
  tahsil: string;
  village: string;
  onlyAvailable: boolean;
  minExp: number;
}

export type TargetLanguage = 'hi' | 'en' | 'pa' | 'raj';

export interface ProfileReport {
  id: string;
  candidate_id?: string;
  reason: string;
  reporter_contact?: string;
  created_at: string;
}
