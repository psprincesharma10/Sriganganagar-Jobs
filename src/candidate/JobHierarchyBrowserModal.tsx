import React, { useState, useMemo } from 'react';
import { X, Search, ChevronRight, Briefcase } from 'lucide-react';
import {
  JOB_INDUSTRIES,
  getDepartmentsForIndustry,
  getRolesForDepartment,
  TOTAL_INDUSTRIES,
  TOTAL_DEPARTMENTS,
  TOTAL_JOB_ROLES,
  JobRole,
} from './jobHierarchyData';

interface JobHierarchyBrowserModalProps {
  onClose: () => void;
  onRoleClick: (roleName: string) => void;
  onViewIndustryJobs: (industryName: string) => void;
}

export const JobHierarchyBrowserModal: React.FC<JobHierarchyBrowserModalProps> = ({
  onClose,
  onRoleClick,
  onViewIndustryJobs,
}) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<number>(JOB_INDUSTRIES[0]?.id || 1);
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  const selectedIndustry = JOB_INDUSTRIES.find((i) => i.id === selectedIndustryId);
  const departments = useMemo(
    () => (selectedIndustry ? getDepartmentsForIndustry(selectedIndustry.id) : []),
    [selectedIndustry]
  );

  // Simple search across all role names (only computed when the user types)
  const searchResults: JobRole[] = useMemo(() => {
    if (searchText.trim().length < 2) return [];
    const q = searchText.trim().toLowerCase();
    const results: JobRole[] = [];
    for (const ind of JOB_INDUSTRIES) {
      for (const dept of getDepartmentsForIndustry(ind.id)) {
        for (const role of getRolesForDepartment(dept.id)) {
          if (role.name.toLowerCase().includes(q)) {
            results.push(role);
            if (results.length >= 40) return results;
          }
        }
      }
    }
    return results;
  }, [searchText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-300" />
              <span>Browse All {TOTAL_JOB_ROLES}+ Job Roles</span>
            </h3>
            <p className="text-[11px] text-emerald-200 mt-0.5">
              {TOTAL_INDUSTRIES} Industries • {TOTAL_DEPARTMENTS} Departments • {TOTAL_JOB_ROLES} Job Roles
            </p>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1.5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-slate-100 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Job role search karein (e.g. Nurse, Driver, Teacher)..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#075E54] focus:outline-none"
            />
          </div>
        </div>

        {/* Body */}
        {searchText.trim().length >= 2 ? (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-slate-500 mb-2">{searchResults.length} results</p>
            <div className="flex flex-wrap gap-2">
              {searchResults.map((role) => (
                <button
                  key={role.id}
                  onClick={() => onRoleClick(role.name)}
                  className="text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {role.name}
                </button>
              ))}
              {searchResults.length === 0 && (
                <p className="text-xs text-slate-400">Koi matching role nahi mila.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Left: Industries list */}
            <div className="sm:w-64 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto max-h-40 sm:max-h-none">
              {JOB_INDUSTRIES.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => {
                    setSelectedIndustryId(ind.id);
                    setExpandedDeptId(null);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-colors border-l-4 ${
                    selectedIndustryId === ind.id
                      ? 'bg-emerald-50 border-l-[#075E54] text-[#075E54]'
                      : 'border-l-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{ind.icon}</span>
                  <span className="truncate">{ind.name}</span>
                </button>
              ))}
            </div>

            {/* Main: Departments + Roles */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedIndustry && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                        <span>{selectedIndustry.icon}</span>
                        <span>{selectedIndustry.name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">{departments.length} Departments</p>
                    </div>
                    <button
                      onClick={() => onViewIndustryJobs(selectedIndustry.name)}
                      className="text-[11px] font-bold text-white bg-[#075E54] hover:bg-[#054840] px-3 py-1.5 rounded-lg whitespace-nowrap"
                    >
                      Find Jobs in this Industry →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {departments.map((dept) => {
                      const isExpanded = expandedDeptId === dept.id;
                      const roles = isExpanded ? getRolesForDepartment(dept.id) : [];
                      return (
                        <div key={dept.id} className="border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-left"
                          >
                            <span className="text-xs font-bold text-slate-800">{dept.name}</span>
                            <ChevronRight
                              className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="p-3 flex flex-wrap gap-2 bg-white">
                              {roles.map((role) => (
                                <button
                                  key={role.id}
                                  onClick={() => onRoleClick(role.name)}
                                  className="text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {role.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
