// Shared city/location list for the main SriganganagarJobs.in site.
// Used by: JobPostingModal (post a job), App.tsx job listing Location
// filter, and the homepage "Rajasthan ke Shehar" browse-by-city section.

// Local towns/areas within Sri Ganganagar district (kept for hyper-local precision)
export const SRI_GANGANAGAR_LOCAL_AREAS = [
  'Sri Ganganagar', 'Suratgarh', 'Raisinghnagar', 'Padampur',
  'Gharsana', 'Gajsinghpur', 'Karanpur', 'Keshrisinghpur', 'Sangaria',
  'Sadulsahar', 'Vijaynagar', 'Jaitsar', 'Anupgarh', 'Rawatsar',
  'Nohar', 'Bhadra', 'Pilibanga', 'Tibi', 'Lalgarh Jattan', 'Sherewala',
  'Ridhi Sidhi', 'Gol Bazar', 'Meera Chowk', 'Padampur Road',
];

// All Rajasthan districts — job posters/seekers anywhere in Rajasthan can use these
export const RAJASTHAN_DISTRICTS = [
  'Ajmer', 'Alwar', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg', 'Dholpur', 'Didwana-Kuchaman', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur', 'Abohar',
];

// Full dropdown list for forms (Sri Ganganagar first, then A-Z, then "Other")
export const CITY_LIST = Array.from(new Set([...SRI_GANGANAGAR_LOCAL_AREAS, ...RAJASTHAN_DISTRICTS]))
  .sort((a, b) => (a === 'Sri Ganganagar' ? -1 : b === 'Sri Ganganagar' ? 1 : a.localeCompare(b)))
  .concat(['Other']);

// Just the Rajasthan district-level list (used for the homepage "Browse by City" grid —
// district-level is a cleaner set of ~46 cities for a homepage grid than all local areas too)
export const RAJASTHAN_CITIES_FOR_BROWSE = ['Sri Ganganagar', ...RAJASTHAN_DISTRICTS.filter((c) => c !== 'Ganganagar')].sort(
  (a, b) => (a === 'Sri Ganganagar' ? -1 : b === 'Sri Ganganagar' ? 1 : a.localeCompare(b))
);
