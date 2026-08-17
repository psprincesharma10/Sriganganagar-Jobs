import React, { useState } from 'react';
import { X, Monitor, Smartphone, Calendar, User, Link as LinkIcon } from 'lucide-react';
import { sanitizeHtml } from './RichTextEditor';

interface ArticlePreviewModalProps {
  onClose: () => void;
  title: string;
  category: string;
  articleType?: string;
  author: string;
  headerImage: string;
  htmlContent: string;
  sourceName?: string;
  sourceUrl?: string;
  isNews?: boolean;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  onClose, title, category, articleType, author, headerImage, htmlContent, sourceName, sourceUrl, isNews,
}) => {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const clean = sanitizeHtml(htmlContent);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700">Preview</span>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={() => setMode('desktop')}
                className={`p-1.5 rounded-md cursor-pointer ${mode === 'desktop' ? 'bg-white shadow-sm text-[#075E54]' : 'text-slate-400'}`}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setMode('mobile')}
                className={`p-1.5 rounded-md cursor-pointer ${mode === 'mobile' ? 'bg-white shadow-sm text-[#075E54]' : 'text-slate-400'}`}
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8">
          <div className={`mx-auto bg-white rounded-2xl shadow-sm overflow-hidden ${mode === 'mobile' ? 'max-w-[380px]' : 'max-w-2xl'}`}>
            {headerImage && <img src={headerImage} alt="" className="w-full h-48 object-cover" />}
            <div className="p-5">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] px-2 py-0.5 rounded-full">{category}</span>
                {articleType && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{articleType}</span>}
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight mb-2">{title || '[Title]'}</h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1"><User size={11} />{author}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="text-sm text-slate-700 leading-relaxed rich-preview-body" dangerouslySetInnerHTML={{ __html: clean }} />
              {isNews && (sourceName || sourceUrl) && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                  <LinkIcon size={12} />
                  <span>Source: {sourceName || 'Not specified'}{sourceUrl ? ` (${sourceUrl})` : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .rich-preview-body h2 { font-size: 1.15rem; font-weight: 800; margin: 0.75rem 0 0.4rem; color: #0f172a; }
        .rich-preview-body h3 { font-size: 1.05rem; font-weight: 800; margin: 0.6rem 0 0.3rem; color: #0f172a; }
        .rich-preview-body p { margin: 0.5rem 0; }
        .rich-preview-body ul, .rich-preview-body ol { margin: 0.5rem 0 0.5rem 1.25rem; }
        .rich-preview-body blockquote { border-left: 3px solid #128C7E; padding-left: 0.75rem; color: #475569; font-style: italic; margin: 0.5rem 0; }
        .rich-preview-body a { color: #075E54; text-decoration: underline; }
        .rich-preview-body table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; }
        .rich-preview-body td, .rich-preview-body th { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 0.8rem; }
        .rich-preview-body img { max-width: 100%; border-radius: 12px; margin: 0.5rem 0; }
      `}</style>
    </div>
  );
};
