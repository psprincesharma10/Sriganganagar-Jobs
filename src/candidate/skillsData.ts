// Master list of ~100 common local job / skill categories used across
// India for local job boards. Used in: Landing page skill grid,
// Search Workers skill dropdown, and Candidate profile skill selector.

export interface SkillCategoryItem {
  id: string;
  en: string;
  hi: string;
  icon: string;
  desc: string; // short one-line explanation of the role
}

export const SKILLS_100: SkillCategoryItem[] = [
  { id: 'driver', en: 'Driver', hi: 'चालक', icon: '🚗', desc: 'Car, taxi, van ya heavy vehicle chalane wale' },
  { id: 'truck-driver', en: 'Truck / Heavy Vehicle Driver', hi: 'ट्रक चालक', icon: '🚚', desc: 'Truck, trailer aur heavy commercial vehicle drivers' },
  { id: 'electrician', en: 'Electrician', hi: 'बिजली मिस्त्री', icon: '⚡', desc: 'House wiring, motor aur electrical repair specialist' },
  { id: 'teacher', en: 'Teacher', hi: 'शिक्षक', icon: '🎓', desc: 'School ya tuition padhane wale shikshak' },
  { id: 'computer-operator', en: 'Computer Operator', hi: 'कंप्यूटर ऑपरेटर', icon: '💻', desc: 'Data entry, typing, MS Office kaam karne wale' },
  { id: 'helper', en: 'Helper / Labor', hi: 'हेल्पर / मज़दूर', icon: '👷', desc: 'General labor aur helper kaam' },
  { id: 'security-guard', en: 'Security Guard', hi: 'सुरक्षा गार्ड', icon: '🛡️', desc: 'Gate, society ya factory security staff' },
  { id: 'accountant', en: 'Accountant', hi: 'लेखाकार', icon: '📊', desc: 'Accounts, billing aur Tally kaam' },
  { id: 'data-entry', en: 'Data Entry Operator', hi: 'डेटा एंट्री ऑपरेटर', icon: '⌨️', desc: 'Excel/software me data feed karne wale' },
  { id: 'plumber', en: 'Plumber', hi: 'प्लंबर', icon: '🔧', desc: 'Pipeline, sanitary fitting aur leak repair' },
  { id: 'painter', en: 'Painter', hi: 'पेंटर', icon: '🎨', desc: 'Ghar aur building painting karne wale' },
  { id: 'mason', en: 'Mason / Rajmistri', hi: 'राजमिस्त्री', icon: '🧱', desc: 'Construction aur building work' },
  { id: 'cook', en: 'Chef / Cook', hi: 'रसोइया', icon: '👨‍🍳', desc: 'Ghar, hotel ya dhaba me khana banane wale' },
  { id: 'tailor', en: 'Tailor', hi: 'दर्जी', icon: '🧵', desc: 'Kapde silne wale' },
  { id: 'mechanic', en: 'Mechanic', hi: 'मैकेनिक', icon: '🔩', desc: 'Vehicle aur machine repair karne wale' },
  { id: 'delivery-boy', en: 'Delivery Boy', hi: 'डिलीवरी बॉय', icon: '🛵', desc: 'Parcel aur food delivery staff' },
  { id: 'carpenter', en: 'Carpenter', hi: 'बढ़ई', icon: '🪚', desc: 'Furniture aur lakdi ka kaam karne wale' },
  { id: 'welder', en: 'Welder', hi: 'वेल्डर', icon: '🔥', desc: 'Metal welding aur fabrication kaam' },
  { id: 'ac-technician', en: 'AC / Fridge Technician', hi: 'एसी टेक्नीशियन', icon: '❄️', desc: 'AC, fridge install aur repair karne wale' },
  { id: 'salesman', en: 'Salesman / Sales Executive', hi: 'सेल्समैन', icon: '🛍️', desc: 'Shop ya field sales staff' },
  { id: 'receptionist', en: 'Receptionist / Front Desk', hi: 'रिसेप्शनिस्ट', icon: '🛎️', desc: 'Office reception aur call handling' },
  { id: 'peon', en: 'Peon / Office Boy', hi: 'चपरासी', icon: '📋', desc: 'Office ke chhote kaam sambhalne wale' },
  { id: 'housekeeping', en: 'Housekeeping Staff', hi: 'हाउसकीपिंग स्टाफ', icon: '🧹', desc: 'Office ya ghar ki safai staff' },
  { id: 'maid', en: 'Maid / Domestic Help', hi: 'घरेलू सहायिका', icon: '🧺', desc: 'Ghar ka kaam karne wali maid' },
  { id: 'cook-home', en: 'Home Cook', hi: 'घरेलू रसोइया', icon: '🍳', desc: 'Ghar par khana banane wali/wale' },
  { id: 'babysitter', en: 'Babysitter / Nanny', hi: 'आया', icon: '👶', desc: 'Bachchon ki dekhbhal karne wali' },
  { id: 'caretaker', en: 'Elderly Caretaker', hi: 'बुजुर्ग देखभालकर्ता', icon: '🧑‍⚕️', desc: 'Budhe logon ki dekhbhal karne wale' },
  { id: 'nurse', en: 'Nurse', hi: 'नर्स', icon: '👩‍⚕️', desc: 'Hospital ya home nursing staff' },
  { id: 'ward-boy', en: 'Ward Boy', hi: 'वार्ड बॉय', icon: '🏥', desc: 'Hospital ward assistant staff' },
  { id: 'pharmacist', en: 'Pharmacist', hi: 'फार्मासिस्ट', icon: '💊', desc: 'Medical store aur dawai counter staff' },
  { id: 'lab-technician', en: 'Lab Technician', hi: 'लैब टेक्नीशियन', icon: '🧪', desc: 'Pathology aur lab sample kaam' },
  { id: 'driver-school', en: 'School Van / Bus Driver', hi: 'स्कूल वैन चालक', icon: '🚌', desc: 'School bus/van chalane wale' },
  { id: 'gardener', en: 'Gardener / Mali', hi: 'माली', icon: '🌱', desc: 'Bagwani aur garden maintenance' },
  { id: 'watchman', en: 'Watchman / Chowkidar', hi: 'चौकीदार', icon: '🌙', desc: 'Rat ki chowkidari karne wale' },
  { id: 'guard-supervisor', en: 'Security Supervisor', hi: 'सुरक्षा सुपरवाइजर', icon: '🕵️', desc: 'Security team ka supervisor' },
  { id: 'store-keeper', en: 'Store Keeper', hi: 'स्टोर कीपर', icon: '📦', desc: 'Godown aur stock management' },
  { id: 'loader', en: 'Loader / Unloader', hi: 'लोडर', icon: '📥', desc: 'Truck loading unloading kaam' },
  { id: 'packer', en: 'Packing Staff', hi: 'पैकिंग स्टाफ', icon: '📦', desc: 'Factory/warehouse packing kaam' },
  { id: 'machine-operator', en: 'Machine Operator', hi: 'मशीन ऑपरेटर', icon: '⚙️', desc: 'Factory machine chalane wale' },
  { id: 'supervisor', en: 'Site / Production Supervisor', hi: 'सुपरवाइजर', icon: '📐', desc: 'Site ya factory supervisor' },
  { id: 'foreman', en: 'Foreman', hi: 'फोरमैन', icon: '🏗️', desc: 'Construction site incharge' },
  { id: 'civil-engineer', en: 'Civil Engineer', hi: 'सिविल इंजीनियर', icon: '🏛️', desc: 'Building aur site engineering' },
  { id: 'electrical-engineer', en: 'Electrical Engineer', hi: 'इलेक्ट्रिकल इंजीनियर', icon: '🔌', desc: 'Electrical design aur maintenance' },
  { id: 'diesel-mechanic', en: 'Diesel Mechanic', hi: 'डीजल मैकेनिक', icon: '🛠️', desc: 'Diesel engine repair specialist' },
  { id: 'tractor-driver', en: 'Tractor Driver', hi: 'ट्रैक्टर चालक', icon: '🚜', desc: 'Farm tractor chalane wale' },
  { id: 'farm-worker', en: 'Farm Worker / Krishi Majdoor', hi: 'कृषि मजदूर', icon: '🌾', desc: 'Kheti ke kaam karne wale' },
  { id: 'dairy-worker', en: 'Dairy Worker', hi: 'डेयरी कर्मचारी', icon: '🐄', desc: 'Pashupalan aur dairy kaam' },
  { id: 'poultry-worker', en: 'Poultry Farm Worker', hi: 'पोल्ट्री कर्मचारी', icon: '🐔', desc: 'Murgi farm ka kaam' },
  { id: 'fitter', en: 'Fitter', hi: 'फिटर', icon: '🔨', desc: 'Machine aur pipe fitting kaam' },
  { id: 'turner', en: 'Turner / Lathe Operator', hi: 'टर्नर', icon: '⚙️', desc: 'Lathe machine chalane wale' },
  { id: 'crane-operator', en: 'Crane Operator', hi: 'क्रेन ऑपरेटर', icon: '🏗️', desc: 'Crane chalane wale' },
  { id: 'jcb-operator', en: 'JCB / Excavator Operator', hi: 'जेसीबी ऑपरेटर', icon: '🚧', desc: 'JCB aur excavator chalane wale' },
  { id: 'forklift-operator', en: 'Forklift Operator', hi: 'फोर्कलिफ्ट ऑपरेटर', icon: '📦', desc: 'Godown forklift chalane wale' },
  { id: 'bike-mechanic', en: 'Bike Mechanic', hi: 'बाइक मैकेनिक', icon: '🏍️', desc: 'Two-wheeler repair specialist' },
  { id: 'car-mechanic', en: 'Car Mechanic', hi: 'कार मैकेनिक', icon: '🚘', desc: 'Car repair aur servicing' },
  { id: 'denter-painter', en: 'Denter / Painter (Vehicle)', hi: 'डेंटर पेंटर', icon: '🚗', desc: 'Vehicle body denting aur painting' },
  { id: 'tyre-mechanic', en: 'Tyre / Puncture Mechanic', hi: 'टायर मैकेनिक', icon: '🛞', desc: 'Tyre fitting aur puncture kaam' },
  { id: 'mobile-repair', en: 'Mobile Repair Technician', hi: 'मोबाइल रिपेयरिंग', icon: '📱', desc: 'Mobile phone repair specialist' },
  { id: 'cctv-technician', en: 'CCTV / Networking Technician', hi: 'सीसीटीवी टेक्नीशियन', icon: '📹', desc: 'CCTV install aur networking' },
  { id: 'solar-technician', en: 'Solar Panel Technician', hi: 'सोलर टेक्नीशियन', icon: '☀️', desc: 'Solar panel install aur maintenance' },
  { id: 'refrigeration-technician', en: 'Refrigeration Technician', hi: 'रेफ्रिजरेशन टेक्नीशियन', icon: '🧊', desc: 'Cold storage aur fridge repair' },
  { id: 'graphic-designer', en: 'Graphic Designer', hi: 'ग्राफिक डिज़ाइनर', icon: '🖌️', desc: 'Design aur banner making kaam' },
  { id: 'photographer', en: 'Photographer / Videographer', hi: 'फोटोग्राफर', icon: '📷', desc: 'Photo aur video shoot karne wale' },
  { id: 'video-editor', en: 'Video Editor', hi: 'वीडियो एडिटर', icon: '🎬', desc: 'Video editing kaam' },
  { id: 'social-media', en: 'Social Media Manager', hi: 'सोशल मीडिया मैनेजर', icon: '📱', desc: 'Facebook/Instagram page manage karne wale' },
  { id: 'web-developer', en: 'Web Developer', hi: 'वेब डेवलपर', icon: '💻', desc: 'Website banane wale' },
  { id: 'telecaller', en: 'Telecaller', hi: 'टेलीकॉलर', icon: '☎️', desc: 'Phone par sales/support call karne wale' },
  { id: 'customer-support', en: 'Customer Support Executive', hi: 'कस्टमर सपोर्ट', icon: '🎧', desc: 'Customer query handle karne wale' },
  { id: 'hr-executive', en: 'HR Executive', hi: 'एचआर एग्जीक्यूटिव', icon: '🧑‍💼', desc: 'Staff hiring aur HR kaam' },
  { id: 'office-assistant', en: 'Office Assistant', hi: 'ऑफिस असिस्टेंट', icon: '🗂️', desc: 'General office admin kaam' },
  { id: 'clerk', en: 'Clerk', hi: 'क्लर्क', icon: '📝', desc: 'Office paperwork aur record kaam' },
  { id: 'bank-agent', en: 'Bank / CSP Agent', hi: 'बैंक एजेंट', icon: '🏦', desc: 'Bank correspondent kaam' },
  { id: 'insurance-agent', en: 'Insurance Agent', hi: 'बीमा एजेंट', icon: '📄', desc: 'Insurance policy bechne wale' },
  { id: 'real-estate-agent', en: 'Real Estate Agent', hi: 'प्रॉपर्टी एजेंट', icon: '🏠', desc: 'Property khareed-bikri karwane wale' },
  { id: 'lawyer-clerk', en: 'Legal Assistant / Advocate Clerk', hi: 'वकील मुंशी', icon: '⚖️', desc: 'Court/advocate office assistant' },
  { id: 'beautician', en: 'Beautician', hi: 'ब्यूटीशियन', icon: '💇‍♀️', desc: 'Beauty parlour service dene wali' },
  { id: 'barber', en: 'Barber / Hairdresser', hi: 'नाई', icon: '💈', desc: 'Baal katne wale' },
  { id: 'spa-therapist', en: 'Spa / Massage Therapist', hi: 'मसाज थेरेपिस्ट', icon: '💆', desc: 'Spa aur massage service' },
  { id: 'fitness-trainer', en: 'Gym / Fitness Trainer', hi: 'फिटनेस ट्रेनर', icon: '🏋️', desc: 'Gym me training dene wale' },
  { id: 'yoga-instructor', en: 'Yoga Instructor', hi: 'योग शिक्षक', icon: '🧘', desc: 'Yoga sikhane wale' },
  { id: 'sports-coach', en: 'Sports Coach', hi: 'खेल कोच', icon: '🏏', desc: 'Cricket, football etc coaching' },
  { id: 'event-manager', en: 'Event / Wedding Manager', hi: 'इवेंट मैनेजर', icon: '🎉', desc: 'Shaadi aur event organise karne wale' },
  { id: 'decorator', en: 'Tent / Decoration Worker', hi: 'टेंट डेकोरेटर', icon: '🎪', desc: 'Shaadi/function tent decoration' },
  { id: 'catering-staff', en: 'Catering Staff', hi: 'कैटरिंग स्टाफ', icon: '🍽️', desc: 'Function me khana serve karne wale' },
  { id: 'waiter', en: 'Waiter / Steward', hi: 'वेटर', icon: '🍴', desc: 'Hotel/dhaba me serving staff' },
  { id: 'dhaba-staff', en: 'Dhaba / Restaurant Staff', hi: 'ढाबा कर्मचारी', icon: '🍛', desc: 'Dhaba aur restaurant general staff' },
  { id: 'baker', en: 'Baker', hi: 'बेकर', icon: '🍞', desc: 'Bakery item banane wale' },
  { id: 'driver-cab', en: 'Cab / Ola-Uber Driver', hi: 'कैब चालक', icon: '🚕', desc: 'App based taxi driver' },
  { id: 'auto-driver', en: 'Auto Rickshaw Driver', hi: 'ऑटो चालक', icon: '🛺', desc: 'Auto rickshaw chalane wale' },
  { id: 'e-rickshaw-driver', en: 'E-Rickshaw Driver', hi: 'ई-रिक्शा चालक', icon: '🛺', desc: 'E-rickshaw chalane wale' },
  { id: 'courier-staff', en: 'Courier / Logistics Staff', hi: 'कूरियर स्टाफ', icon: '📮', desc: 'Courier company staff' },
  { id: 'warehouse-staff', en: 'Warehouse Staff', hi: 'गोदाम कर्मचारी', icon: '🏭', desc: 'Godown/warehouse kaam' },
  { id: 'factory-worker', en: 'Factory Worker', hi: 'फैक्ट्री कर्मचारी', icon: '🏭', desc: 'Factory production line worker' },
  { id: 'iti-fresher', en: 'ITI Fresher (All Trades)', hi: 'आईटीआई फ्रेशर', icon: '🎓', desc: 'ITI pass fresher candidates' },
  { id: 'graduate-fresher', en: 'Graduate Fresher (Any Job)', hi: 'ग्रेजुएट फ्रेशर', icon: '🎓', desc: 'Graduate fresher — koi bhi job' },
  { id: 'part-time-worker', en: 'Part Time Worker', hi: 'पार्ट टाइम वर्कर', icon: '⏱️', desc: 'Part time / hourly kaam karne wale' },
  { id: 'daily-wager', en: 'Daily Wage Labor', hi: 'दिहाड़ी मजदूर', icon: '⛏️', desc: 'Roz ki dihadi par kaam karne wale' },
  { id: 'contractor', en: 'Contractor (Labor Supply)', hi: 'ठेकेदार', icon: '📋', desc: 'Labor supply karne wale thekedar' },
  { id: 'shop-assistant', en: 'Shop Assistant', hi: 'दुकान सहायक', icon: '🏪', desc: 'Dukan par kaam karne wale' },
  { id: 'cashier', en: 'Cashier', hi: 'कैशियर', icon: '💵', desc: 'Billing aur cash counter kaam' },
  { id: 'petrol-pump-staff', en: 'Petrol Pump Staff', hi: 'पेट्रोल पंप कर्मचारी', icon: '⛽', desc: 'Petrol pump attendant' },
  { id: 'welfare-worker', en: 'Social / NGO Worker', hi: 'सामाजिक कार्यकर्ता', icon: '🤝', desc: 'NGO aur samajik kaam karne wale' },
  { id: 'driving-instructor', en: 'Driving Instructor', hi: 'ड्राइविंग इंस्ट्रक्टर', icon: '🚦', desc: 'Driving sikhane wale' },
];

export function findSkillById(id: string): SkillCategoryItem | undefined {
  return SKILLS_100.find((s) => s.id === id);
}

// Matches a free-text skill_category value on a candidate record back to
// a canonical skill (by english or hindi name), used for filtering.
export function skillMatches(candidateSkill: string, skillId: string): boolean {
  const target = findSkillById(skillId);
  if (!target) return true;
  const val = (candidateSkill || '').toLowerCase();
  return val.includes(target.en.toLowerCase()) || val.includes(target.id.toLowerCase());
}
