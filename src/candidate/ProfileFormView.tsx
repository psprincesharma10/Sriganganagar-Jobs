import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Camera,
  CheckCircle2,
  Save,
  Loader2,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Candidate, UserSession } from './candidateTypes';
import {
  fetchCandidateByPhone,
  saveOrUpdateCandidate,
  toggleCandidateAvailability
} from './candidateSupabase';
import { LocationCascadingSelect } from './LocationCascadingSelect';
import { VoiceInput } from './VoiceInput';
import { SKILLS_100 } from './skillsData';

interface ProfileFormViewProps {
  session: UserSession;
  onSaved: (candidate: Candidate) => void;
  onDeleted: () => void;
}

export const ProfileFormView: React.FC<ProfileFormViewProps> = ({
  session,
  onSaved,
  onDeleted,
}) => {
  const [existingId, setExistingId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [skillCategory, setSkillCategory] = useState('Driver');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Driver']);
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Rajasthan');
  const [district, setDistrict] = useState('Sri Ganganagar');
  const [tahsil, setTahsil] = useState('Padampur Tahsil');
  const [villageOrTown, setVillageOrTown] = useState('Gajsinghpur');
  const [areaOther, setAreaOther] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [expectedSalary, setExpectedSalary] = useState('');
  const [bio, setBio] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const candidate = await fetchCandidateByPhone(session.phone_number);
        if (candidate) {
          setExistingId(candidate.id);
          setFullName(candidate.full_name || '');
          setPhotoUrl(candidate.photo_url || '');
          setSkillCategory(candidate.skill_category || 'Driver');
          setSelectedSkills(
            candidate.skill_categories && candidate.skill_categories.length > 0
              ? candidate.skill_categories
              : [candidate.skill_category || 'Driver']
          );
          setExperienceYears(candidate.experience_years ?? 3);
          setCountry(candidate.country || 'India');
          setState(candidate.state || 'Rajasthan');
          setDistrict(candidate.district || 'Sri Ganganagar');
          setTahsil(candidate.tahsil || '');
          setVillageOrTown(candidate.village_or_town || '');
          setAreaOther(candidate.area_other || '');
          setIsAvailable(candidate.is_available ?? true);
          setExpectedSalary(candidate.expected_salary || '');
          setBio(candidate.bio || '');
          setIsVerified(candidate.is_verified || false);
        }
      } catch (e) {
        console.warn('Error loading candidate profile:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [session.phone_number]);

  const handleLocationChange = (field: string, value: string) => {
    if (field === 'country') setCountry(value);
    if (field === 'state') setState(value);
    if (field === 'district') setDistrict(value);
    if (field === 'tahsil') setTahsil(value);
    if (field === 'village_or_town') setVillageOrTown(value);
    if (field === 'area_other') setAreaOther(value);
  };

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    if (existingId) {
      await toggleCandidateAvailability(existingId, nextVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Kripya apna poora naam darj karein.');
      return;
    }
    if (selectedSkills.length === 0) {
      setErrorMsg('Kripya kam se kam 1 Skill Category chunein.');
      return;
    }

    setIsSaving(true);

    try {
      const updatedCandidate = await saveOrUpdateCandidate({
        id: existingId || undefined,
        phone_number: session.phone_number,
        full_name: fullName.trim(),
        photo_url: photoUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        skill_category: selectedSkills[0],
        skill_categories: selectedSkills,
        experience_years: Number(experienceYears),
        country: country || 'India',
        state: state || 'Rajasthan',
        district: district || 'Sri Ganganagar',
        tahsil: tahsil,
        village_or_town: villageOrTown,
        area_other: areaOther,
        is_available: isAvailable,
        expected_salary: expectedSalary,
        bio: bio,
      });

      setExistingId(updatedCandidate.id);
      setIsSaving(false);
      setSuccessMsg('Aapki Candidate Profile safaltapurvak save ho gayi hai!');
      onSaved(updatedCandidate);
    } catch (err: any) {
      setIsSaving(false);
      setErrorMsg(`Profile save me error: ${err.message || err}`);
    }
  };

  // Profile deletion is now Admin-only (see CandidateAdminView) — candidates
  // can no longer delete their own profile from this page.

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <Loader2 className="w-8 h-8 text-[#075E54] animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Aapki profile load ho rahi hai...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Banner / Stats */}
      <div className="bg-gradient-to-r from-[#075E54] to-[#054840] text-white p-6 rounded-3xl shadow-lg border border-emerald-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30 uppercase">
            CANDIDATE DASHBOARD
          </span>
          <h1 className="text-xl sm:text-2xl font-black mt-1">
            {existingId ? 'Apni Profile Edit Karein' : 'Nayi Candidate Profile Banayein'}
          </h1>
          <p className="text-xs text-emerald-200 mt-1">
            Phone Number: <strong>+91 {session.phone_number}</strong>
          </p>
        </div>
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Availability Toggle Switch */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Work Availability (काम के लिए उपलब्ध हैं?)</span>
              {isAvailable ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Available Now
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  Not Available
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              इसे ऑन रखें ताकि एम्प्लॉयर्स आपको सर्च रिजल्ट्स में तुरंत देख सकें।
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAvailability}
            className={`p-1.5 rounded-full transition-colors ${
              isAvailable ? 'text-[#075E54]' : 'text-slate-400'
            }`}
          >
            {isAvailable ? (
              <ToggleRight className="w-10 h-10 text-[#075E54]" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-400" />
            )}
          </button>
        </div>

        {/* 1. Full Name & Photo URL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#075E54]" />
                <span>Poora Naam (Full Name) *</span>
              </label>
              <VoiceInput
                currentValue={fullName}
                onSpeechResult={(text) => setFullName(text)}
              />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramkumar Verma (रामकुमार वर्मा)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-[#075E54] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Photo URL / Avatar</span>
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-[#075E54] focus:outline-none"
            />
          </div>
        </div>

        {/* Photo Avatar Preview */}
        {photoUrl && (
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img
              src={photoUrl}
              alt="Photo preview"
              className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-600/30"
              onError={() => setErrorMsg('Photo URL load nahi ho saki.')}
            />
            <span className="text-xs text-slate-600 font-medium">Photo Preview (Employers ko dikhegi)</span>
          </div>
        )}

        {/* 2. Skill Categories (up to 5) & Experience Years */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Skill Categories — max 5 chunein (कार्य क्षेत्र) *</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              {selectedSkills.length}/5 chuni gayi
            </p>
            <div className="max-h-56 overflow-y-auto border border-slate-300 rounded-xl bg-slate-50 p-2 space-y-1">
              {SKILLS_100.map((sk) => {
                const checked = selectedSkills.includes(sk.en);
                const disableUnselected = !checked && selectedSkills.length >= 5;
                return (
                  <label
                    key={sk.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      checked ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-slate-100 text-slate-700'
                    } ${disableUnselected ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disableUnselected}
                      onChange={() => {
                        setSelectedSkills((prev) =>
                          checked ? prev.filter((s) => s !== sk.en) : [...prev, sk.en].slice(0, 5)
                        );
                      }}
                      className="accent-[#075E54]"
                    />
                    <span>
                      {sk.icon} {sk.en} ({sk.hi})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Kitne Saal Ka Anubhav (Experience in Years) *</span>
            </label>
            <input
              type="number"
              min={0}
              max={50}
              required
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm font-bold focus:ring-2 focus:ring-[#075E54] focus:outline-none"
            />
          </div>
        </div>

        {/* 3. Cascading Location Chain: Country > State > District > Tahsil > Village */}
        <LocationCascadingSelect
          country={country}
          state={state}
          district={district}
          tahsil={tahsil}
          village_or_town={villageOrTown}
          area_other={areaOther}
          onChange={handleLocationChange}
          showVoiceInput={true}
        />

        {/* 4. Expected Salary */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Expected Salary (उम्मीद वेतन)</span>
            </label>
            <VoiceInput
              currentValue={expectedSalary}
              onSpeechResult={(text) => setExpectedSalary(text)}
            />
          </div>
          <input
            type="text"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(e.target.value)}
            placeholder="e.g. ₹18,000 / month, या ₹600 / per day"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-[#075E54] focus:outline-none"
          />
        </div>

        {/* 5. Short Bio / Details (Microphone speech-to-text enabled!) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#075E54]" />
              <span>Apne Baare Me Batayein (Short Bio / Skill Details)</span>
            </label>
            <VoiceInput
              currentValue={bio}
              onSpeechResult={(text) => setBio(text)}
            />
          </div>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. श्रीगंगानगर में 7 साल से हैवी कमर्शियल गाड़ी चलाने का अनुभव। सभी लाइसेंस तैयार हैं..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#075E54] focus:outline-none leading-relaxed"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            💡 Tip: Aap Hindi, English, Punjabi kisi bhi bhasha me mic dabakar bol sakte hain!
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#075E54] hover:bg-[#054840] text-white font-extrabold text-sm py-3 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Profile Save Ho Rahi Hai...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>Save Candidate Profile</span>
              </>
            )}
          </button>
          {/* Delete Profile removed from candidate-facing view — only Admin Panel can delete a profile now */}
        </div>
      </form>
    </div>
  );
};
