import React, { useState, useEffect } from 'react';
import { X, Newspaper, Lock, Eye, Trash2, Calendar, Plus, ChevronLeft, Loader2 } from 'lucide-react';
import { Language, NewsPost } from '../types';
import { supabase } from '../supabaseClient';

interface NewsPageProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialPostId?: string | null;
  onPostsChanged?: () => void;
}

const NEWS_PASSWORD = 'SGN@Prince#2026';

const CATEGORIES = ['Local', 'Rajasthan', 'National', 'Crime', 'Politics', 'Other'];

export default function NewsPage({ isOpen, onClose, lang, initialPostId, onPostsChanged }: NewsPageProps) {
  const [view, setView] = useState<'list' | 'read' | 'write' | 'login'>('list');
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Local');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const mapRow = (row: any): NewsPost => ({
    id: String(row.id),
    title: row.title,
    content: row.content,
    category: row.category || 'Local',
    date: row.created_at
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
      setView('write');
      setPwError('');
      setPassword('');
    } else {
      setPwError('Galat password! Dobara try karein.');
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    try {
      const { error } = await supabase.from('news_posts').insert({
        title: title.trim(),
        content: content.trim(),
        category
      });
      if (error) throw error;
      setTitle('');
      setContent('');
      setCategory('Local');
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[94vh] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 flex-shrink-0 bg-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button onClick={() => setView('list')} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer mr-1">
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
              <button onClick={() => setView('write')}
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

            {/* WRITE VIEW */}
            {view === 'write' && isAdmin && (
              <div className="space-y-4">
                <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54]">
                  <p className="font-black">📰 Nayi News Add Karein</p>
                  <p className="opacity-80 mt-0.5">Publish karte hi sabhi visitors ko turant dikhegi! Ye 30 din baad automatically hat jaayegi.</p>
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
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Content *</label>
                  <textarea rows={12} value={content} onChange={e => setContent(e.target.value)}
                    placeholder="News ka content yahan likho..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm resize-none leading-relaxed" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setView('list')}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handlePublish} disabled={!title.trim() || !content.trim() || publishing}
                    className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black text-sm cursor-pointer flex items-center justify-center gap-2">
                    {publishing ? <Loader2 size={15} className="animate-spin" /> : <Newspaper size={15} />}
                    {publishing ? 'Publish ho raha hai...' : 'Publish Karein'}
                  </button>
                </div>
              </div>
            )}

            {/* READ VIEW */}
            {view === 'read' && selectedPost && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] border border-[#128C7E]/20 px-2 py-0.5 rounded-full inline-block">
                  {selectedPost.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(selectedPost.date)}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</div>
                {isAdmin && (
                  <button onClick={() => handleDelete(selectedPost.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 cursor-pointer mt-4">
                    <Trash2 size={13} />Delete News
                  </button>
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
                      className="border border-slate-100 hover:border-[#128C7E]/30 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-sm group"
                      onClick={() => { setSelectedPost(post); setView('read'); }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                          <h3 className="font-black text-slate-900 text-sm mt-2 group-hover:text-[#075E54] transition-colors leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {post.content.substring(0, 120)}...
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                            <span className="flex items-center gap-0.5"><Calendar size={9} />{formatDate(post.date)}</span>
                          </div>
                        </div>
                        <Eye size={15} className="text-slate-300 group-hover:text-[#075E54] flex-shrink-0 mt-1 transition-colors" />
                      </div>
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
