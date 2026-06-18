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
  expires_at: string;
  pinned: boolean;
  is_featured?: boolean;       // Featured job (paid)
  salary_range?: string;       // e.g. "8000-12000"
  job_type?: string;           // Full Time / Part Time etc
  utr_number?: string;         // UTR payment proof
  payment_screenshot?: string; // base64 screenshot
  payment_phone?: string;      // who paid
  payment_date?: string;       // when paid
  payment_amount?: number;     // amount paid
}

export interface Ad {
  id: string;
  created_at: string;
  business_name: string;
  image_url: string;
  contact?: string;
  short_description: string;
  sponsored: boolean;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  ad_title?: string;
  ad_description?: string;
  phone_number?: string;
  whatsapp_number?: string;
  whatsapp_url?: string;
  website_url?: string;
  expiry_days?: number;
  location?: string;
  placement?: 'sidebar' | 'feed';
  utr_number?: string;
  payment_screenshot?: string;
  payment_phone?: string;
  payment_date?: string;
  payment_amount?: number;
}

export interface AdminSettings {
  defaultExpiryMonths: number;
  adminPasswordHash: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

export type Language = 'en' | 'hi';
