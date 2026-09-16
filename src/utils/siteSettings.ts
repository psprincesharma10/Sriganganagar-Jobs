import { supabase } from '../supabaseClient';
import { SocialLinks, YoutubeSettings } from '../types';

export async function fetchSocialLinks(): Promise<SocialLinks> {
  try {
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'social_links').maybeSingle();
    return (data?.value as SocialLinks) || {};
  } catch {
    return {};
  }
}

export async function saveSocialLinks(links: SocialLinks): Promise<void> {
  await supabase.from('site_settings').upsert({ key: 'social_links', value: links, updated_at: new Date().toISOString() });
}

export async function fetchYoutubeSettings(): Promise<YoutubeSettings> {
  try {
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'youtube').maybeSingle();
    return (data?.value as YoutubeSettings) || { videos: [], channel_url: '' };
  } catch {
    return { videos: [], channel_url: '' };
  }
}

export async function saveYoutubeSettings(settings: YoutubeSettings): Promise<void> {
  await supabase.from('site_settings').upsert({ key: 'youtube', value: settings, updated_at: new Date().toISOString() });
}

// Extracts a YouTube video ID from any common URL format (or returns the input if it already looks like an ID)
export function extractYoutubeId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  // Already looks like a bare 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return trimmed;
}
