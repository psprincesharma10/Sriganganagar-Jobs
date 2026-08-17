// Article Type Templates & One-Click Section Builder for Blog and News editors.
// These insert only an editable OUTLINE/placeholder — they never invent facts.

export interface ArticleTypeOption {
  id: string;
  label: string;
  template: string; // HTML outline inserted when this type's "Insert Recommended Structure" is used
}

export const BLOG_ARTICLE_TYPES: ArticleTypeOption[] = [
  {
    id: 'career-guide',
    label: 'Career Guide',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Who This Career Is Suitable For</h2><p>[Details likhein]</p>
<h2>Required Education</h2><p>[Details likhein]</p>
<h2>Important Skills</h2><ul><li>[Skill 1]</li><li>[Skill 2]</li></ul>
<h2>Career Opportunities</h2><p>[Details likhein]</p>
<h2>Salary Expectations</h2><p>[Information Required]</p>
<h2>How to Start</h2><p>[Details likhein]</p>
<h2>Local Opportunities (Sri Ganganagar)</h2><p>[Details likhein]</p>
<h2>Tips</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'job-search-tips',
    label: 'Job Search Tips',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Where to Look for Jobs</h2><p>[Details likhein]</p>
<h2>Tips to Improve Your Search</h2><ul><li>[Tip 1]</li><li>[Tip 2]</li></ul>
<h2>Common Mistakes to Avoid</h2><p>[Details likhein]</p>
<h2>Local Resources (Sri Ganganagar)</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'resume-guide',
    label: 'Resume / CV Guide',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Why a Good Resume Matters</h2><p>[Details likhein]</p>
<h2>Required Resume Sections</h2><ul><li>Personal Info</li><li>Objective</li><li>Skills</li><li>Experience</li><li>Education</li></ul>
<h2>Step-by-Step Writing Guide</h2><p>[Details likhein]</p>
<h2>Common Mistakes</h2><p>[Details likhein]</p>
<h2>Resume Tips</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'interview-guide',
    label: 'Interview Guide',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Preparation Before Interview</h2><p>[Details likhein]</p>
<h2>Common Questions</h2><p>[Details likhein]</p>
<h2>How to Answer Professionally</h2><p>[Details likhein]</p>
<h2>Body Language</h2><p>[Details likhein]</p>
<h2>Documents to Carry</h2><p>[Details likhein]</p>
<h2>Common Mistakes</h2><p>[Details likhein]</p>
<h2>Final Tips</h2><p>[Details likhein]</p>`,
  },
  {
    id: 'skill-development',
    label: 'Skill Development',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Why This Skill Matters</h2><p>[Details likhein]</p>
<h2>How to Learn</h2><p>[Details likhein]</p>
<h2>Local Training Options (Sri Ganganagar)</h2><p>[Details likhein]</p>
<h2>Career Impact</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'career-advice',
    label: 'Career Advice',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>The Advice</h2><p>[Details likhein]</p>
<h2>Why This Matters</h2><p>[Details likhein]</p>
<h2>Practical Steps</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'employer-hiring-guide',
    label: 'Employer / Hiring Guide',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Who Should Read This</h2><p>[Details likhein]</p>
<h2>Hiring Steps</h2><p>[Details likhein]</p>
<h2>Tips for Employers</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'local-business',
    label: 'Local Business / Career Information',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Business / Sector Overview</h2><p>[Details likhein]</p>
<h2>Opportunities in Sri Ganganagar</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
  {
    id: 'general-blog',
    label: 'General Blog',
    template: `<h2>Introduction</h2><p>[Introduction likhein]</p>
<h2>Main Content</h2><p>[Details likhein]</p>
<h2>Conclusion</h2><p>[Conclusion likhein]</p>`,
  },
];

export const NEWS_ARTICLE_TYPES: ArticleTypeOption[] = [
  {
    id: 'local-jobs-update',
    label: 'Local Jobs Update',
    template: `<h2>Quick Summary</h2><p>[Summary likhein]</p>
<h2>What Happened / Latest Update</h2><p>[Details likhein]</p>
<h2>Vacancy / Opportunity Details</h2><p>[Details likhein]</p>
<h2>Eligibility</h2><p>[Information Required]</p>
<h2>Important Dates</h2><p>[Information Required]</p>
<h2>Location</h2><p>[Details likhein]</p>
<h2>How to Apply</h2><p>[Details likhein]</p>
<h2>Important Instructions</h2><p>[Details likhein]</p>
<h2>Official / Verified Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'government-announcement',
    label: 'Government Announcement',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>Announcement Details</h2><p>[Details likhein]</p>
<h2>Who Is Affected</h2><p>[Details likhein]</p>
<h2>Important Dates</h2><p>[Information Required]</p>
<h2>Benefits / Impact</h2><p>[Details likhein]</p>
<h2>How Citizens Can Take Action</h2><p>[Details likhein]</p>
<h2>Official Source</h2><p>[Source URL yahan daalein]</p>
<h2>Important Note</h2><p>[Details likhein]</p>`,
  },
  {
    id: 'education-news',
    label: 'Education News',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>What Happened</h2><p>[Details likhein]</p>
<h2>Important Details</h2><p>[Details likhein]</p>
<h2>Who Is Affected</h2><p>[Details likhein]</p>
<h2>Official Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'district-news',
    label: 'District News',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>What Happened</h2><p>[Details likhein]</p>
<h2>When and Where</h2><p>[Details likhein]</p>
<h2>Public Impact</h2><p>[Details likhein]</p>
<h2>Official Statement / Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'business-news',
    label: 'Business News',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>What Happened</h2><p>[Details likhein]</p>
<h2>Business Impact</h2><p>[Details likhein]</p>
<h2>Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'employment-news',
    label: 'Employment News',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>What Happened / Latest Update</h2><p>[Details likhein]</p>
<h2>Eligibility</h2><p>[Information Required]</p>
<h2>Important Dates</h2><p>[Information Required]</p>
<h2>How to Apply</h2><p>[Details likhein]</p>
<h2>Official Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'event-notice',
    label: 'Event / Public Notice',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>Event / Notice Details</h2><p>[Details likhein]</p>
<h2>When and Where</h2><p>[Information Required]</p>
<h2>Who Should Attend / Is Affected</h2><p>[Details likhein]</p>
<h2>Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'local-scheme-welfare',
    label: 'Local Scheme / Welfare Update',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>Scheme Details</h2><p>[Details likhein]</p>
<h2>Eligibility</h2><p>[Information Required]</p>
<h2>Benefits</h2><p>[Details likhein]</p>
<h2>How to Apply</h2><p>[Details likhein]</p>
<h2>Official Source</h2><p>[Source URL yahan daalein]</p>`,
  },
  {
    id: 'breaking-news',
    label: 'Breaking News',
    template: `<h2>Latest Update</h2><p>[Update likhein]</p>
<h2>What Happened</h2><p>[Verified information hi likhein]</p>
<h2>Time and Location</h2><p>[Information Required]</p>
<h2>Verified Facts</h2><p>[Sirf confirm hui jaankari likhein]</p>
<h2>Official Statement</h2><p>[Pending / Information Required]</p>
<h2>What Is Known So Far</h2><p>[Details likhein — unverified claims ko clearly "unconfirmed" mark karein]</p>
<h2>What Happens Next</h2><p>[Details likhein]</p>`,
  },
  {
    id: 'general-local-news',
    label: 'General Local News',
    template: `<h2>Summary</h2><p>[Summary likhein]</p>
<h2>What Happened</h2><p>[Details likhein]</p>
<h2>When and Where</h2><p>[Information Required]</p>
<h2>Important Details</h2><p>[Details likhein]</p>
<h2>Public Impact</h2><p>[Details likhein]</p>
<h2>Official Statement / Source</h2><p>[Source URL yahan daalein]</p>
<h2>What Happens Next</h2><p>[Details likhein]</p>`,
  },
];

// One-click section snippets — inserted at cursor via editor's insertHTML.
export const COMMON_SECTIONS: { label: string; html: string }[] = [
  { label: '+ Introduction', html: '<h2>Introduction</h2><p>[Introduction likhein]</p>' },
  { label: '+ Quick Summary', html: '<h2>Quick Summary</h2><p>[Summary likhein]</p>' },
  { label: '+ Key Highlights', html: '<h2>Key Highlights</h2><ul><li>[Point 1]</li><li>[Point 2]</li></ul>' },
  { label: '+ Important Dates', html: '<h2>Important Dates</h2><p>[Information Required]</p>' },
  { label: '+ Eligibility', html: '<h2>Eligibility</h2><p>[Information Required]</p>' },
  { label: '+ Required Documents', html: '<h2>Required Documents</h2><ul><li>[Document 1]</li></ul>' },
  { label: '+ Important Details', html: '<h2>Important Details</h2><p>[Details likhein]</p>' },
  { label: '+ Benefits', html: '<h2>Benefits</h2><p>[Details likhein]</p>' },
  { label: '+ Salary', html: '<h2>Salary</h2><p>[Information Required]</p>' },
  { label: '+ Skills Required', html: '<h2>Skills Required</h2><ul><li>[Skill 1]</li></ul>' },
  { label: '+ How to Apply', html: '<h2>How to Apply</h2><p>[Details likhein]</p>' },
  { label: '+ Step-by-Step Process', html: '<h2>Step-by-Step Process</h2><ol><li>[Step 1]</li><li>[Step 2]</li></ol>' },
  { label: '+ Location', html: '<h2>Location</h2><p>[Details likhein]</p>' },
  { label: '+ Contact Information', html: '<h2>Contact Information</h2><p>[Details likhein]</p>' },
  { label: '+ Important Instructions', html: '<h2>Important Instructions</h2><p>[Details likhein]</p>' },
  { label: '+ Official Source', html: '<h2>Official Source</h2><p>[Source URL yahan daalein]</p>' },
  { label: '+ Conclusion', html: '<h2>Conclusion</h2><p>[Conclusion likhein]</p>' },
];

export const NEWS_ONLY_SECTIONS: { label: string; html: string }[] = [
  { label: '+ What Happened', html: '<h2>What Happened</h2><p>[Details likhein]</p>' },
  { label: '+ When and Where', html: '<h2>When and Where</h2><p>[Information Required]</p>' },
  { label: '+ Official Statement', html: '<h2>Official Statement</h2><p>[Pending / Information Required]</p>' },
  { label: '+ Public Impact', html: '<h2>Public Impact</h2><p>[Details likhein]</p>' },
  { label: '+ Verified Facts', html: '<h2>Verified Facts</h2><p>[Sirf confirm hui jaankari likhein]</p>' },
  { label: '+ What Happens Next', html: '<h2>What Happens Next</h2><p>[Details likhein]</p>' },
];
