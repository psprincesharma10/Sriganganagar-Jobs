import React, { useState, useEffect } from 'react';
import { X, PenLine, Lock, Eye, Trash2, Calendar, User, Plus, ChevronLeft } from 'lucide-react';
import { Language } from '../types';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

interface BlogPageProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const BLOG_PASSWORD = 'SGN@Prince#2026';
const STORAGE_KEY = 'sgn_blog_posts';

const CATEGORIES = ['Job Tips', 'Local News', 'Career Advice', 'Business', 'Announcement', 'Other'];

export default function BlogPage({ isOpen, onClose, lang }: BlogPageProps) {
  const [view, setView] = useState<'list' | 'read' | 'write' | 'login'>('list');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Job Tips');
  const [author, setAuthor] = useState('Prince Sharma');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setPosts(JSON.parse(saved)); } catch {}
    } else {
      // Default first post
      const defaultPosts: BlogPost[] = [{
        id: '1',
        title: 'Sriganganagar Jobs — Shuruat Ho Gayi!',
        content: `Sri Ganganagar ke logon ke liye ek nayi shuruaat!\n\nHamari website sriganganagarjobs.in launch ho gayi hai. Ab aap:\n\n✅ Free mein job post kar sakte hain\n✅ Seedha employer ko call kar sakte hain\n✅ Koi login ya password yaad nahi rakhna\n✅ 28 cities mein jobs dhundh sakte hain\n\nAgar aapko naukri chahiye ya aap kisi ko naukri dena chahte hain — bas visit karein:\nwww.sriganganagarjobs.in\n\nHamara uddeshya hai Sri Ganganagar ke har ghar mein rozgaar pahunchana. Saath milkar ye sapna pura karenge!\n\n— Prince Sharma`,
        category: 'Announcement',
        date: new Date().toISOString(),
        author: 'Prince Sharma'
      }];
      setPosts(defaultPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    }
  }, []);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (password === BLOG_PASSWORD) {
      setIsAdmin(true);
      setView('write');
      setPwError('');
    } else {
      setPwError('Galat password! Dobara try karein.');
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      category,
      date: new Date().toISOString(),
      author: author.trim() || 'Prince Sharma'
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTitle(''); setContent(''); setCategory('Job Tips');
    setView('list');
  };

  const handleDelete = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selectedPost?.id === id) setView('list');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button onClick={() => setView('list')} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer mr-1">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
            )}
            <PenLine size={20} className="text-[#075E54]" />
            <div>
              <h2 className="font-black text-slate-900 text-base">
                {lang === 'en' ? 'SGN Jobs Blog' : 'SGN जॉब्स ब्लॉग'}
              </h2>
              <p className="text-[10px] text-slate-400">Local news, tips & updates</p>
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
                <Plus size={13} />New Post
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
              <X size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="max-w-sm mx-auto space-y-4 pt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#eefaf7] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock size={28} className="text-[#075E54]" />
                </div>
                <h3 className="font-black text-slate-900 text-lg">Admin Login</h3>
                <p className="text-sm text-slate-500 mt-1">Apna blog password daalo</p>
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
                <p className="font-black">✍️ Naya Blog Post Likhein</p>
                <p className="opacity-80 mt-0.5">Publish karte hi turant live ho jaayega!</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Blog post ka title..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Author</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Content *</label>
                <textarea rows={12} value={content} onChange={e => setContent(e.target.value)}
                  placeholder="Yahan apna blog likho... (Hindi ya English dono mein likh sakte hain)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm resize-none leading-relaxed" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setView('list')}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handlePublish} disabled={!title.trim() || !content.trim()}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black text-sm cursor-pointer flex items-center justify-center gap-2">
                  <PenLine size={15} />Publish Karein
                </button>
              </div>
            </div>
          )}

          {/* READ VIEW */}
          {view === 'read' && selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] border border-[#128C7E]/20 px-2 py-0.5 rounded-full">
                  {selectedPost.category}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedPost.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><User size={11} />{selectedPost.author}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(selectedPost.date)}</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</div>
              {isAdmin && (
                <button onClick={() => handleDelete(selectedPost.id)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 cursor-pointer mt-4">
                  <Trash2 size={13} />Delete Post
                </button>
              )}
            </div>
          )}

          {/* LIST VIEW */}
          {view === 'list' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <PenLine size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Abhi koi post nahi hai.</p>
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
                          <span className="flex items-center gap-0.5"><User size={9} />{post.author}</span>
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
  );
}
