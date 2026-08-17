import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SeoAuditProps {
  title: string;
  seoTitle: string;
  slug: string;
  metaDescription: string;
  htmlContent: string;
  headerImage: string;
  sourceUrl?: string;
  isNews?: boolean;
}

type Status = 'good' | 'warn' | 'missing';

function StatusIcon({ status }: { status: Status }) {
  if (status === 'good') return <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />;
  if (status === 'warn') return <AlertTriangle size={14} className="text-amber-500 shrink-0" />;
  return <XCircle size={14} className="text-red-400 shrink-0" />;
}

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export const SeoAudit: React.FC<SeoAuditProps> = ({
  title, seoTitle, slug, metaDescription, htmlContent, headerImage, sourceUrl, isNews,
}) => {
  const plainText = stripHtml(htmlContent);
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const h2Count = (htmlContent.match(/<h2/g) || []).length;
  const h3Count = (htmlContent.match(/<h3/g) || []).length;
  const effectiveTitle = seoTitle || title;

  const checks: { label: string; status: Status; note: string }[] = [
    {
      label: 'Title Length',
      status: effectiveTitle.length === 0 ? 'missing' : effectiveTitle.length >= 30 && effectiveTitle.length <= 65 ? 'good' : 'warn',
      note: `${effectiveTitle.length} characters (ideal: 30-65)`,
    },
    {
      label: 'SEO Slug',
      status: !slug ? 'missing' : /^[a-z0-9-]+$/.test(slug) ? 'good' : 'warn',
      note: slug ? (/^[a-z0-9-]+$/.test(slug) ? 'Clean slug' : 'Use only lowercase letters, numbers, hyphens') : 'No slug set',
    },
    {
      label: 'Meta Description',
      status: metaDescription.length === 0 ? 'missing' : metaDescription.length >= 70 && metaDescription.length <= 160 ? 'good' : 'warn',
      note: `${metaDescription.length} characters (ideal: 70-160)`,
    },
    {
      label: 'Word Count',
      status: wordCount === 0 ? 'missing' : wordCount >= 300 ? 'good' : 'warn',
      note: `${wordCount} words (recommended: 300+)`,
    },
    {
      label: 'H2 Headings',
      status: h2Count === 0 ? 'missing' : h2Count >= 2 ? 'good' : 'warn',
      note: `${h2Count} found`,
    },
    {
      label: 'H3 Headings',
      status: h3Count > 0 ? 'good' : 'warn',
      note: `${h3Count} found (optional but helpful)`,
    },
    {
      label: 'Introduction Present',
      status: /introduction|summary|quick summary/i.test(htmlContent) ? 'good' : 'warn',
      note: /introduction|summary/i.test(htmlContent) ? 'Found' : 'No clear intro/summary section detected',
    },
    {
      label: 'Featured Image',
      status: headerImage ? 'good' : 'missing',
      note: headerImage ? 'Present' : 'No featured image uploaded',
    },
    ...(isNews
      ? [{
          label: 'Official Source URL',
          status: (sourceUrl ? 'good' : 'warn') as Status,
          note: sourceUrl ? 'Present' : 'No source URL — add for credibility',
        }]
      : []),
    {
      label: 'FAQ Section',
      status: /faq|frequently asked/i.test(htmlContent) ? 'good' : 'warn',
      note: /faq/i.test(htmlContent) ? 'Found' : 'Not present (optional)',
    },
  ];

  const goodCount = checks.filter((c) => c.status === 'good').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">SEO & Content Quality Audit</h4>
        <span className="text-[11px] text-slate-400">{goodCount}/{checks.length} checks passed</span>
      </div>
      <div className="space-y-1.5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-start gap-2 text-xs">
            <StatusIcon status={c.status} />
            <div className="min-w-0">
              <span className="font-bold text-slate-700">{c.label}</span>
              <span className="text-slate-400 ml-1.5">— {c.note}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-100">
        Ye sirf ek helpful checklist hai — Google ranking ya AdSense approval ki koi guarantee nahi deta.
      </p>
    </div>
  );
};
