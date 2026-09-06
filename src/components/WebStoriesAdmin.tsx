import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Pencil, X, Loader2, Image as ImageIcon, Calendar, Send, ExternalLink, Film,
} from 'lucide-react';
import { WebStory, WebStoryPage } from '../types';
import { supabase } from '../supabaseClient';

const CATEGORY_OPTIONS: { value: WebStory['category']; label: string }[] = [
  { value: 'intro', label: 'Site Intro / Features' },
  { value: 'job-category', label: 'Job Category' },
  { value: 'blog', label: 'Blog Article' },
  { value: 'custom', label: 'Custom' },
];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

const emptyPage = (): WebStoryPage => ({ image: '', headline: '', cta_text: '', cta_link: '' });

export default function WebStoriesAdmin() {
  const [stories, setStories] = useState<WebStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<WebStory['category']>('intro');
  const [posterImage, setPosterImage] = useState('');
  const [pages, setPages] = useState<WebStoryPage[]>([emptyPage(), emptyPage(), emptyPage()]);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule' | 'draft'>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const loadStories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('web_stories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStories((data || []) as WebStory[]);
    } catch (e) {
      console.warn('Failed to load web stories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStories(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('intro');
    setPosterImage('');
    setPages([emptyPage(), emptyPage(), emptyPage()]);
    setScheduleMode('draft');
    setScheduledDate('');
  };

  const startEdit = (s: WebStory) => {
    setEditingId(s.id);
    setTitle(s.title);
    setSlug(s.slug);
    setCategory(s.category);
    setPosterImage(s.poster_image);
    setPages(s.pages.length > 0 ? s.pages : [emptyPage(), emptyPage(), emptyPage()]);
    setScheduleMode(s.status === 'published' ? 'now' : s.status === 'scheduled' ? 'schedule' : 'draft');
    setScheduledDate(s.scheduled_date || '');
    setShowForm(true);
  };

  const handlePosterUpload = async (file: File) => {
    setUploadingSlot('poster');
    try { setPosterImage(await readFileAsBase64(file)); } finally { setUploadingSlot(null); }
  };

  const handlePageImageUpload = async (index: number, file: File) => {
    setUploadingSlot(`page-${index}`);
    try {
      const b64 = await readFileAsBase64(file);
      setPages((prev) => prev.map((p, i) => (i === index ? { ...p, image: b64 } : p)));
    } finally { setUploadingSlot(null); }
  };

  const updatePageField = (index: number, field: keyof WebStoryPage, value: string) => {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const addPage = () => setPages((prev) => [...prev, emptyPage()]);
  const removePage = (index: number) => setPages((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!title.trim() || !posterImage) {
      alert('Title aur Poster Image zaroori hai.');
      return;
    }
    const validPages = pages.filter((p) => p.image && p.headline.trim());
    if (validPages.length < 3) {
      alert('Kam se kam 3 pages honi chahiye (Google Web Stories ka minimum requirement hai) — har page mein image aur headline zaroori hai.');
      return;
    }

    setSaving(true);
    try {
      const finalSlug = slug.trim() ? slugify(slug) : slugify(title);
      const status = scheduleMode === 'now' ? 'published' : scheduleMode === 'schedule' ? 'scheduled' : 'draft';

      const payload: any = {
        title: title.trim(),
        slug: finalSlug,
        category,
        poster_image: posterImage,
        pages: validPages,
        status,
        scheduled_date: scheduleMode === 'schedule' ? scheduledDate || null : null,
      };
      if (status === 'published' && !editingId) payload.published_at = new Date().toISOString();

      if (editingId) {
        const { error } = await supabase.from('web_stories').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('web_stories').insert(payload);
        if (error) throw error;
      }

      resetForm();
      setShowForm(false);
      await loadStories();
    } catch (err: any) {
      alert(`Story save nahi ho payi: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ye story delete karni hai?')) return;
    try {
      await supabase.from('web_stories').delete().eq('id', id);
      await loadStories();
    } catch (e) { console.warn(e); }
  };

  const handlePublishNow = async (id: string) => {
    try {
      await supabase.from('web_stories').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', id);
      await loadStories();
    } catch (e) { console.warn(e); }
  };

  const storyUrl = (s: WebStory) => `https://www.sriganganagarjobs.in/stories/${s.slug}`;

  const statusPill = (status: string) => {
    const map: Record<string, string> = {
      published: 'bg-emerald-100 text-emerald-700',
      scheduled: 'bg-amber-100 text-amber-700',
      draft: 'bg-slate-100 text-slate-500',
    };
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] || map.draft}`}>{status}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
          <Film size={16} className="text-[#075E54]" />Web Stories ({stories.length})
        </h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#075E54] text-white text-xs font-black rounded-xl cursor-pointer"
        >
          <Plus size={13} />New Story
        </button>
      </div>

      {!showForm ? (
        loading ? (
          <div className="text-center py-10 text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" size={22} /><p className="text-xs">Loading...</p></div>
        ) : stories.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">Abhi koi Web Story nahi hai. "New Story" dabakar pehli banao.</div>
        ) : (
          <div className="space-y-2">
            {stories.map((s) => (
              <div key={s.id} className="flex items-center gap-3 border border-slate-200 rounded-xl p-3">
                <img src={s.poster_image} alt="" className="w-10 h-16 object-cover rounded-lg shrink-0 bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                    {statusPill(s.status)}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    /stories/{s.slug} • {s.pages?.length || 0} pages
                    {s.status === 'scheduled' && s.scheduled_date && <> • auto-publish: {s.scheduled_date}</>}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {s.status === 'published' && (
                    <a href={storyUrl(s)} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500" title="Open Story">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {s.status !== 'published' && (
                    <button onClick={() => handlePublishNow(s.id)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="Publish Now">
                      <Send size={14} />
                    </button>
                  )}
                  <button onClick={() => startEdit(s)} className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="border border-slate-200 rounded-2xl p-4 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-800">{editingId ? 'Story Edit Karein' : 'Nayi Story Banayein'}</h4>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-slate-200 rounded-lg"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E] bg-white">
                {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">URL Slug (optional, auto-generate hoga title se)</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={title ? slugify(title) : 'my-story'}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Poster/Cover Image * (portrait, jaise 720x1280)</label>
            {posterImage ? (
              <div className="relative w-24">
                <img src={posterImage} alt="" className="w-24 h-40 object-cover rounded-xl border border-slate-200" />
                <button onClick={() => setPosterImage('')} className="absolute -top-2 -right-2 bg-white shadow rounded-full p-1 text-red-500"><X size={12} /></button>
              </div>
            ) : (
              <label className="w-24 h-40 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#128C7E]/50">
                {uploadingSlot === 'poster' ? <Loader2 size={16} className="animate-spin text-[#128C7E]" /> : <ImageIcon size={16} className="text-slate-400" />}
                <span className="text-[9px] text-slate-400 font-bold">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePosterUpload(e.target.files[0])} />
              </label>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Story Pages * (min 3)</label>
              <button onClick={addPage} className="text-[11px] font-bold text-[#075E54] hover:underline flex items-center gap-1"><Plus size={12} />Add Page</button>
            </div>
            <div className="space-y-3">
              {pages.map((p, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-3 bg-white flex gap-3">
                  {p.image ? (
                    <div className="relative w-16 shrink-0">
                      <img src={p.image} alt="" className="w-16 h-28 object-cover rounded-lg" />
                      <label className="absolute bottom-0.5 right-0.5 bg-white/90 rounded p-0.5 cursor-pointer">
                        <Pencil size={9} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePageImageUpload(i, e.target.files[0])} />
                      </label>
                    </div>
                  ) : (
                    <label className="w-16 h-28 shrink-0 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-[#128C7E]/50">
                      {uploadingSlot === `page-${i}` ? <Loader2 size={14} className="animate-spin text-[#128C7E]" /> : <ImageIcon size={14} className="text-slate-400" />}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePageImageUpload(i, e.target.files[0])} />
                    </label>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input value={p.headline} onChange={(e) => updatePageField(i, 'headline', e.target.value)}
                      placeholder={`Page ${i + 1} headline text...`}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                    <div className="flex gap-1.5">
                      <input value={p.cta_text || ''} onChange={(e) => updatePageField(i, 'cta_text', e.target.value)}
                        placeholder="CTA text (optional)"
                        className="flex-1 text-[11px] p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                      <input value={p.cta_link || ''} onChange={(e) => updatePageField(i, 'cta_link', e.target.value)}
                        placeholder="CTA link (optional)"
                        className="flex-1 text-[11px] p-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]" />
                    </div>
                  </div>
                  {pages.length > 3 && (
                    <button onClick={() => removePage(i)} className="text-red-400 hover:text-red-600 self-start"><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Kab Publish Karni Hai?</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'draft', label: 'Draft (abhi nahi)' },
                { id: 'now', label: 'Abhi Publish Karo' },
                { id: 'schedule', label: 'Ek Date Schedule Karo' },
              ].map((opt) => (
                <button key={opt.id} onClick={() => setScheduleMode(opt.id as any)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer ${scheduleMode === opt.id ? 'bg-[#075E54] text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            {scheduleMode === 'schedule' && (
              <div className="mt-2 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-slate-200" />
                <span className="text-[10px] text-slate-400">Ye din aane par apne aap publish ho jayegi (roz subah check hota hai)</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] disabled:opacity-50 text-slate-900 font-black text-xs flex items-center justify-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {saving ? 'Saving...' : editingId ? 'Update Karein' : 'Save Karein'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
