import { Candidate } from './candidateTypes';

export function generateCandidateTitle(candidate: Candidate): string {
  const skill = candidate.skill_category || 'Skilled Worker';
  const district = candidate.district || 'Sri Ganganagar';
  const state = candidate.state || 'Rajasthan';
  return `${skill} available in ${district}, ${state} | Sri Ganganagar Jobs`;
}

export function generateCandidateDescription(candidate: Candidate): string {
  const name = candidate.full_name;
  const skill = candidate.skill_category;
  const location = `${candidate.village_or_town || ''} ${candidate.tahsil || ''} ${candidate.district}, ${candidate.state}`.trim();
  const exp = candidate.experience_years ? `${candidate.experience_years} years exp` : 'Skilled';
  const bioExcerpt = candidate.bio ? candidate.bio.slice(0, 100) : '';
  return `${name} - ${skill} (${exp}) in ${location}. ${bioExcerpt}. Hire directly on Sri Ganganagar Jobs.`;
}

export function generateCanonicalUrl(candidateId: string): string {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://sriganganagarjobs.in';
  return `${baseUrl.replace(/\/$/, '')}/candidate/${candidateId}`;
}

export function generatePersonSchema(candidate: Candidate) {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://sriganganagarjobs.in';
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': candidate.full_name,
    'jobTitle': candidate.skill_category,
    'image': candidate.photo_url,
    'description': candidate.bio || `${candidate.skill_category} located in ${candidate.district}, ${candidate.state}`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': candidate.village_or_town || candidate.tahsil || candidate.district,
      'addressRegion': candidate.state,
      'addressCountry': candidate.country,
    },
    'url': `${baseUrl.replace(/\/$/, '')}/candidate/${candidate.id}`,
    'knowsAbout': [candidate.skill_category, 'Skilled Labor', 'Local Employment']
  };
}
