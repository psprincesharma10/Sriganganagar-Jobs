export interface Job {
  id: string;
  created_at: string;
  job_title_en: string;
  job_title_hi: string;
  job_description_en: string;
  job_description_hi: string;
  phone: string;
  poster_name?: string;
  phone_hidden: boolean;
  expires_at: string; // ISO string
  pinned: boolean; // Admin can pin important jobs
}

export interface Ad {
  id: string;
  created_at: string;
  business_name: string;
  image_url: string; // URL or base64
  contact?: string;
  short_description: string;
  sponsored: boolean; // default true
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean; // Admin can select to feature/promote
}

export interface AdminSettings {
  defaultExpiryMonths: number; // 6 or 12 (1 year)
  adminPasswordHash: string; // Simple local check (default can be "admin335001" - Sri Ganganagar PIN code)
}

export type Language = 'en' | 'hi';
