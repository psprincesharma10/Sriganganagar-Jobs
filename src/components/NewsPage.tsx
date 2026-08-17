import React, { useState, useEffect, useRef } from 'react';
import { X, Newspaper, Lock, Eye, Trash2, Calendar, Plus, ChevronLeft, Loader2, Pencil, ScanEye, ShieldCheck } from 'lucide-react';
import { Language, NewsPost } from '../types';
import { supabase } from '../supabaseClient';
import { navigateTo, setCanonicalUrl, setPageTitle } from '../router';
import { RichTextEditor, RichTextEditorHandle, sanitizeHtml } from './RichTextEditor';
import { ArticleTypeSelector } from './ArticleTypeSelector';
import { AiArticleAssistant } from './AiArticleAssistant';
import { SeoAudit } from './SeoAudit';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { NEWS_ARTICLE_TYPES } from '../data/articleTemplates';

interface NewsPageProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialPostId?: string | null;
  onPostsChanged?: () => void;
}

const NEWS_PASSWORD = 'SGN@Prince#2026';
const CATEGORIES = ['Local', 'Rajasthan', 'National', 'Crime', 'Politics', 'Other'];
const SOURCE_TYPES = [
  'Official Government Source', 'Official Department', 'Press Release',
  'Verified Local Source', 'Reporter / Editorial Desk', 'Other',
];

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function stripHtmlForPreview(content: string): string {
  if (!isHtmlContent(content)) return content;
  const div = document.createElement('div');
  div.innerHTML = content;
  return div.textContent || div.innerText || '';
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewsPage({ isOpen, onClose, lang, initialPostId, onPostsChanged }: NewsPageProps) {
  const [view, setView] = useState<'list' | 'read' | 'write' | 'login'>('list');
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Local');
  const [headerImage, setHeaderImage] = useState('');
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [articleType, setArticleType] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null);

  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const mapRow = (row: any): NewsPost => ({
    id: String(row.id),
    title: row.title,
    content: row.content,
    category: row.category || 'Local',
    date: row.created_at,
    header_image: row.header_image || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    article_type: row.article_type || undefined,
    seo_title: row.seo_title || undefined,
    slug: row.slug || undefined,
    meta_description: row.meta_description || undefined,
    keywords: row.keywords || undefined,
    source_type: row.source_type || undefined,
    source_name: row.source_name || undefined,
    source_url: row.source_url || undefined,
    verification_status: row.verification_status || undefined,
  });

  const loadPosts = async (jumpToId?: string | null) => {
    setLoading(true);
    setLoadError('');
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped: NewsPost[] = (data || []).map(mapRow);
      setPosts(mapped);

      if (jumpToId) {
        const found = mapped.find(p => p.id === jumpToId);
        if (found) {
          setSelectedPost(found);
          setView('read');
          return;
        }
      }
      setView('list');
    } catch (err: any) {
      console.error('Failed to load news posts:', err);
      setLoadError(
        lang === 'en'
          ? 'Could not load news. Please check your internet connection.'
          : 'News load nahi ho payi. Internet connection check karein.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPosts(initialPostId || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPostId]);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (password === NEWS_PASSWORD) {
      setIsAdmin(true);
      resetForm();
      setView('write');
      setPwError('');
      setPassword('');
    } else {
      setPwError('Galat password! Dobara try karein.');
    }
  };

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setCategory('Local');
    setHeaderImage('');
    setArticleType('');
    setSeoTitle('');
    setSlug('');
    setMetaDescription('');
    setKeywords('');
    setSourceType('');
    setSourceName('');
    setSourceUrl('');
  };

  const startEdit = (post: NewsPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setHeaderImage(post.header_image || '');
    setArticleType(post.article_type || '');
    setSeoTitle(post.seo_title || '');
    setSlug(post.slug || '');
    setMetaDescription(post.meta_description || '');
    setKeywords(post.keywords || '');
    setSourceType(post.source_type || '');
    setSourceName(post.source_name || '');
    setSourceUrl(post.source_url || '');
    setView('write');
  };

  const handleHeaderImageUpload = async (file: File) => {
    setUploadingHeader(true);
    try {
      const b64 = await readFileAsBase64(file);
      setHeaderImage(b64);
    } finally {
      setUploadingHeader(false);
    }
  };

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  // Never falsely label content as "Verified" — only what the editor themselves attests to.
  const getVerificationStatus = () => (sourceUrl.trim() ? 'Source provided by editor' : 'Pending editorial verification');

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    try {
      const payload = {
        title: title.trim(),
        content: sanitizeHtml(content.trim()),
        category,
        header_image: headerImage || null,
        article_type: articleType || null,
        seo_title: seoTitle.trim() || null,
        slug: (slug.trim() || slugify(title)) || null,
        meta_description: metaDescription.trim() || null,
        keywords: keywords.trim() || null,
        source_type: sourceType || null,
        source_name: sourceName.trim() || null,
        source_url: sourceUrl.trim() || null,
        verification_status: getVerificationStatus(),
      };

      if (editingPostId) {
        const { error } = await supabase.from('news_posts').update(payload).eq('id', editingPostId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news_posts').insert(payload);
        if (error) throw error;
      }

      resetForm();
      await loadPosts();
      onPostsChanged?.();
    } catch (err: any) {
      console.error('Failed to publish news post:', err);
      alert(
        lang === 'en'
          ? 'Could not publish the news. Please check your internet connection and try again.'
          : 'News publish nahi ho saki. Internet check karke dobara try karein.'
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) throw error;
      if (selectedPost?.id === id) setView('list');
      await loadPosts();
      onPostsChanged?.();
    } catch (err: any) {
      console.error('Failed to delete news post:', err);
      alert(lang === 'en' ? 'Could not delete the news.' : 'News delete nahi ho saki.');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleClose = () => {
    setView('list');
    setSelectedPost(null);
    onClose();
  };

  const showNoSourceWarning = view === 'write' && !sourceUrl.trim() && !sourceName.trim();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white max-w-3xl mx-auto min-h-screen shadow-sm flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 shrink-0 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button onClick={() => { setView('list'); resetForm(); }} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer mr-1">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
            )}
            <Newspaper size={20} className="text-[#075E54]" />
            <div>
              <h2 className="font-black text-slate-900 text-base leading-none">
                {lang === 'en' ? 'Local News' : 'लोकल न्यूज़'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">ताज़ा खबरें — Sri Ganganagar & around</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAdmin && view === 'list' && (
              <button onClick={() => setView('login')}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors">
                <Lock size={15} className="text-slate-600" />
              </button>
            )}
            {isAdmin && view === 'list' && (
              <button onClick={() => { resetForm(); setView('write'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#075E54] text-white text-xs font-black rounded-xl cursor-pointer">
                <Plus size={13} />Add News
              </button>
            )}
            <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
              <X size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

            {/* LOGIN VIEW */}
            {view === 'login' && (
              <div className="max-w-sm mx-auto space-y-4 pt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#eefaf7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock size={28} className="text-[#075E54]" />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg">Admin Login</h3>
                  <p className="text-sm text-slate-500 mt-1">Apna news password daalo</p>
                </div>
                {pwError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 text-center">{pwError}</div>
                )}
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Password daalo..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm text-center tracking-widest" />
                <button onClick={handleLogin}
                  className="w-full py-3 bg-[#075E54] hover:bg-[#064a43] text-white font-black rounded-xl text-sm cursor-pointer">
                  Login Karein
                </button>
              </div>
            )}

            {/* WRITE / EDIT VIEW */}
            {view === 'write' && isAdmin && (
              <div className="space-y-4">
                <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54]">
                  <p className="font-black">{editingPostId ? '✏️ News Edit Karein' : '📰 Nayi News Add Karein'}</p>
                  <p className="opacity-80 mt-0.5">
                    {editingPostId ? 'Changes save karte hi turant update ho jaayega!' : 'Publish karte hi sabhi visitors ko turant dikhegi!'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Title *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="News ka title..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm font-bold" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Article Type + Templates + Section Builder */}
                <ArticleTypeSelector
                  types={NEWS_ARTICLE_TYPES}
                  selectedType={articleType}
                  onSelectType={setArticleType}
                  onInsertTemplate={(html) => editorRef.current?.insertHtml(html)}
                  onInsertSection={(html) => editorRef.current?.insertHtml(html)}
                  isNews
                />

                {/* News Trust / Source fields */}
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck size={14} />Source & Trust Info
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Source Type</label>
                      <select value={sourceType} onChange={e => setSourceType(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white">
                        <option value="">-- Chunein --</option>
                        {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Source Name</label>
                      <input value={sourceName} onChange={e => setSourceName(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Source URL</label>
                      <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..."
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-400" />
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-700">
                    Verification Status: <strong>{getVerificationStatus()}</strong> — system kabhi khud "Verified" label nahi lagata jab tak actual verification na ho.
                  </p>
                  {showNoSourceWarning && (
                    <div className="text-[11px] text-amber-800 bg-amber-100 rounded-lg p-2 border border-amber-300">
                      ⚠️ Koi source nahi diya gaya — publish karne se pehle source add karna behtar rahega.
                    </div>
                  )}
                </div>

                {/* AI Article Assistant */}
                <AiArticleAssistant
                  articleType={NEWS_ARTICLE_TYPES.find(t => t.id === articleType)?.label || ''}
                  title={title}
                  fullContentPlainText={content.replace(/<[^>]+>/g, ' ')}
                  onInsertHtml={(html) => editorRef.current?.insertHtml(html)}
                  onApplyMetaDescription={setMetaDescription}
                  onApplyKeywords={setKeywords}
                  sourceUrl={sourceUrl}
                />

                {/* Header Image */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">📌 Featured Image</label>
                  {headerImage ? (
                    <div className="relative">
                      <img src={headerImage} alt="" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                      <button type="button" onClick={() => setHeaderImage('')}
                        className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-white text-red-500 rounded-lg p-1.5 shadow-sm cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#128C7E]/40 hover:bg-[#eefaf7]/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
                      {uploadingHeader ? <Loader2 size={18} className="animate-spin text-[#128C7E]" /> : (
                        <span className="text-[11px] font-bold text-slate-500">Image Upload Karo</span>
                      )}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleHeaderImageUpload(e.target.files[0])} />
                    </label>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Content *</label>
                  <RichTextEditor
                    key={editingPostId || 'new-news'}
                    ref={editorRef}
                    value={content}
                    onChange={setContent}
                    placeholder="News ka content yahan likho... Toolbar se headings, lists, table, image sab use kar sakte ho."
                  />
                </div>

                {/* SEO Fields */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">SEO Fields</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Title</label>
                      <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder={title || 'News title'}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">SEO Slug</label>
                      <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generate-from-title"
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Meta Description</label>
                      <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E] resize-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Keywords</label>
                      <input value={keywords} onChange={e => setKeywords(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                    </div>
                  </div>
                </div>

                <SeoAudit
                  title={title}
                  seoTitle={seoTitle}
                  slug={slug || slugify(title)}
                  metaDescription={metaDescription}
                  htmlContent={content}
                  headerImage={headerImage}
                  sourceUrl={sourceUrl}
                  isNews
                />

                <div className="flex gap-3">
                  <button onClick={() => { setView('list'); resetForm(); }}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">
                    Cancel
                  </button>
                  <button type="button" onClick={() => setShowPreview(true)} disabled={!title.trim() || !content.trim()}
                    className="py-3 px-4 rounded-xl border border-slate-300 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center gap-2">
                    <ScanEye size={15} />Preview
                  </button>
                  <button onClick={handlePublish} disabled={!title.trim() || !content.trim() || publishing}
                    className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black text-sm cursor-pointer flex items-center justify-center gap-2">
                    {publishing ? <Loader2 size={15} className="animate-spin" /> : <Newspaper size={15} />}
                    {publishing
                      ? (editingPostId ? 'Update ho raha hai...' : 'Publish ho raha hai...')
                      : (editingPostId ? 'Changes Save Karein' : 'Publish Karein')}
                  </button>
                </div>

                {showPreview && (
                  <ArticlePreviewModal
                    onClose={() => setShowPreview(false)}
                    title={title}
                    category={category}
                    articleType={NEWS_ARTICLE_TYPES.find(t => t.id === articleType)?.label}
                    author={sourceName || 'SGN Jobs Desk'}
                    headerImage={headerImage}
                    htmlContent={content}
                    sourceName={sourceName}
                    sourceUrl={sourceUrl}
                    isNews
                  />
                )}
              </div>
            )}

            {/* READ VIEW */}
            {view === 'read' && selectedPost && (
              <div className="space-y-4">
                {selectedPost.header_image && (
                  <img src={selectedPost.header_image} alt={selectedPost.title} className="w-full rounded-2xl object-cover max-h-96 -mt-1" />
                )}
                <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] border border-[#128C7E]/20 px-2 py-0.5 rounded-full inline-block">
                  {selectedPost.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(selectedPost.date)}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div>
                  {isHtmlContent(selectedPost.content) ? (
                    <div
                      className="text-[15px] text-slate-700 leading-relaxed rich-preview-body"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedPost.content) }}
                    />
                  ) : (
                    <div className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</div>
                  )}
                </div>
                {(selectedPost.source_name || selectedPost.source_url) && (
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#075E54]" />
                    <span>
                      Source: {selectedPost.source_name || 'Not specified'}
                      {selectedPost.source_url && <> — <a href={selectedPost.source_url} target="_blank" rel="noopener noreferrer" className="text-[#075E54] underline">{selectedPost.source_url}</a></>}
                      {' '}({selectedPost.verification_status || 'Pending editorial verification'})
                    </span>
                  </div>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-4 pt-2">
                    <button onClick={() => startEdit(selectedPost)}
                      className="flex items-center gap-1.5 text-xs text-[#075E54] hover:text-[#054840] cursor-pointer font-bold">
                      <Pencil size={13} />Edit News
                    </button>
                    <button onClick={() => handleDelete(selectedPost.id)}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 cursor-pointer">
                      <Trash2 size={13} />Delete News
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LIST VIEW */}
            {view === 'list' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12 text-slate-400">
                    <Loader2 size={28} className="mx-auto mb-3 animate-spin" />
                    <p className="text-sm">{lang === 'en' ? 'Loading news...' : 'News load ho rahi hai...'}</p>
                  </div>
                ) : loadError ? (
                  <div className="text-center py-12 text-red-400">
                    <p className="text-sm">{loadError}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Newspaper size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Abhi koi news nahi hai.</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <div key={post.id}
                      className="border border-slate-100 hover:border-[#128C7E]/30 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-sm group">
                      {post.header_image && (
                        <img src={post.header_image} alt="" onClick={() => {
                          setSelectedPost(post); setView('read');
                          navigateTo(`/news/${post.id}`); setCanonicalUrl(`/news/${post.id}`);
                          setPageTitle(`${post.title} | Sri Ganganagar Jobs News`);
                        }} className="w-full h-32 object-cover" />
                      )}
                      <div className="p-4" onClick={() => {
                        setSelectedPost(post); setView('read');
                        navigateTo(`/news/${post.id}`); setCanonicalUrl(`/news/${post.id}`);
                        setPageTitle(`${post.title} | Sri Ganganagar Jobs News`);
                      }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] px-2 py-0.5 rounded-full">
                              {post.category}
                            </span>
                            <h3 className="font-black text-slate-900 text-sm mt-2 group-hover:text-[#075E54] transition-colors leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {stripHtmlForPreview(post.content).substring(0, 120)}...
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                              <span className="flex items-center gap-0.5"><Calendar size={9} />{formatDate(post.date)}</span>
                            </div>
                          </div>
                          <Eye size={15} className="text-slate-300 group-hover:text-[#075E54] flex-shrink-0 mt-1 transition-colors" />
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="px-4 pb-3 flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); startEdit(post); }}
                            className="flex items-center gap-1 text-[11px] text-[#075E54] hover:text-[#054840] font-bold cursor-pointer">
                            <Pencil size={11} />Edit
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                            className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer">
                            <Trash2 size={11} />Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
