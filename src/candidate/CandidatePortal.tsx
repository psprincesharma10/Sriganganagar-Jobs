import React, { useState, useEffect } from 'react';
import { UserSession, Candidate } from './candidateTypes';
import {
  getStoredSession,
  clearStoredSession,
  fetchAllCandidates,
  checkIsContactUnlocked,
} from './candidateSupabase';
import { RazorpayUnlockModal } from './RazorpayUnlockModal';
import { CandidateSignupModal } from './CandidateSignupModal';
import { ProfileFormView } from './ProfileFormView';
import { CandidateProfileDetailView } from './CandidateProfileDetailView';
import { EmployerBrowseView } from './EmployerBrowseView';
import { AdminDashboardView as CandidateAdminView } from './CandidateAdminView';
import { LandingView } from './LandingView';

interface CandidatePortalProps {
  onBackToMain: () => void;
}

export default function CandidatePortal({ onBackToMain }: CandidatePortalProps) {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(getStoredSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [unlockedCandidateIds, setUnlockedCandidateIds] = useState<Set<string>>(new Set());
  const [unlockModalCandidate, setUnlockModalCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchAllCandidates();
      setCandidates(data);
      if (session?.phone_number) {
        const unlockedSet = new Set<string>();
        for (const c of data) {
          const isUnl = await checkIsContactUnlocked(c.id, session.phone_number);
          if (isUnl) unlockedSet.add(c.id);
        }
        setUnlockedCandidateIds(unlockedSet);
      }
    }
    load();
  }, [session?.phone_number]);

  // Handle hash routing for candidate portal
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#/candidates/browse') setCurrentView('browse');
    else if (hash === '#/candidates/profile') setCurrentView('profile-form');
    else if (hash.startsWith('#/candidates/detail/')) {
      const id = hash.replace('#/candidates/detail/', '');
      setSelectedCandidateId(id);
      setCurrentView('detail');
    }
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (param) setSelectedCandidateId(param);
    // Update hash for SEO
    if (view === 'browse') window.location.hash = '/candidates/browse';
    else if (view === 'profile-form') window.location.hash = '/candidates/profile';
    else if (view === 'detail' && param) window.location.hash = `/candidates/detail/${param}`;
    else if (view === 'landing') window.location.hash = '/candidates';
  };

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    setCurrentView('landing');
  };

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setIsLoginModalOpen(false);
    setCurrentView('profile-form');
  };

  const handleUnlockClick = (candidate: Candidate) => {
    setUnlockModalCandidate(candidate);
  };

  const handleSuccessUnlock = (candidateId: string) => {
    setUnlockedCandidateIds((prev) => new Set([...prev, candidateId]));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Candidate Portal Top Bar */}
      <div className="bg-[#075E54] text-white text-xs py-2 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
          >
            ← Main Site
          </button>
          <span className="text-emerald-400">|</span>
          <span className="font-bold">Candidate Portal — Sri Ganganagar Jobs</span>
        </div>
        <div className="flex items-center gap-3">
          {session?.is_logged_in ? (
            <>
              <span className="text-emerald-200">📱 {session.phone_number}</span>
              <button
                onClick={() => handleNavigate('profile-form')}
                className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg font-bold transition-colors"
              >
                Meri Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-white px-3 py-1 rounded-lg font-bold transition-colors"
            >
              Candidate Register / Login
            </button>
          )}
        </div>
      </div>

      {/* Candidate Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-4 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => handleNavigate('landing')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${currentView === 'landing' ? 'bg-[#075E54] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          🏠 Home
        </button>
        <button
          onClick={() => handleNavigate('browse')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${currentView === 'browse' ? 'bg-[#075E54] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          🔍 Search Workers
        </button>
        <button
          onClick={() => session?.is_logged_in ? handleNavigate('profile-form') : setIsLoginModalOpen(true)}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors ${currentView === 'profile-form' ? 'bg-[#075E54] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          👤 My Profile
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={handleNavigate}
            onOpenSignup={() => setIsLoginModalOpen(true)}
            recentCandidates={candidates}
            unlockedCandidateIds={unlockedCandidateIds}
            onUnlockClick={handleUnlockClick}
          />
        )}

        {currentView === 'browse' && (
          <EmployerBrowseView
            onNavigate={handleNavigate}
            unlockedCandidateIds={unlockedCandidateIds}
            onUnlockClick={handleUnlockClick}
          />
        )}

        {currentView === 'profile-form' && (
          session?.is_logged_in ? (
            <ProfileFormView
              session={session}
              onSaved={(cand) => {
                setCandidates((prev) => [cand, ...prev.filter((c) => c.id !== cand.id)]);
              }}
              onDeleted={handleLogout}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto my-12 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900">Login Required</h2>
              <p className="text-sm text-slate-600">
                Apni profile banane ke liye mobile number se login karein।
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full bg-[#075E54] hover:bg-[#054840] text-white font-extrabold py-3 rounded-xl shadow-md"
              >
                Mobile Number Se Login Karein ➔
              </button>
            </div>
          )
        )}

        {currentView === 'detail' && selectedCandidateId && (
          <CandidateProfileDetailView
            candidateId={selectedCandidateId}
            isUnlocked={unlockedCandidateIds.has(selectedCandidateId)}
            onUnlockClick={handleUnlockClick}
            onNavigate={handleNavigate}
            unlockedCandidateIds={unlockedCandidateIds}
          />
        )}

        {currentView === 'admin' && (
          <CandidateAdminView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Modals */}
      {isLoginModalOpen && (
        <CandidateSignupModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {unlockModalCandidate && (
        <RazorpayUnlockModal
          candidate={unlockModalCandidate}
          onClose={() => setUnlockModalCandidate(null)}
          onSuccessUnlock={handleSuccessUnlock}
        />
      )}
    </div>
  );
}
