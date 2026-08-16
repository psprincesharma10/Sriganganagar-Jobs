import React, { useState, useEffect } from 'react';
import { X, PenLine, Lock, Eye, Trash2, Calendar, User, Plus, ChevronLeft, Loader2, Image as ImageIcon, Upload, Pencil } from 'lucide-react';
import { Language, BlogPost } from '../types';
import { supabase } from '../supabaseClient';
import { navigateTo, setCanonicalUrl, setPageTitle } from '../router';

interface BlogPageProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialPostId?: string | null;
  onPostsChanged?: () => void;
}

const BLOG_PASSWORD = 'SGN@Prince#2026';

const CATEGORIES = ['Job Tips', 'Local News', 'Career Advice', 'Business', 'Announcement', 'Other'];

const DEFAULT_POST = {
  title: 'Sriganganagar Jobs — Shuruat Ho Gayi!',
  content: `Sri Ganganagar ke logon ke liye ek nayi shuruaat!\n\nHamari website sriganganagarjobs.in launch ho gayi hai. Ab aap:\n\n✅ Free mein job post kar sakte hain\n✅ Seedha employer ko call kar sakte hain\n✅ Koi login ya password yaad nahi rakhna\n✅ 28 cities mein jobs dhundh sakte hain\n\nAgar aapko naukri chahiye ya aap kisi ko naukri dena chahte hain — bas visit karein:\nwww.sriganganagarjobs.in\n\nHamara uddeshya hai Sri Ganganagar ke har ghar mein rozgaar pahunchana. Saath milkar ye sapna pura karenge!\n\n— Prince Sharma`,
  category: 'Announcement',
  author: 'Prince Sharma'
};

// Reads a File as a base64 data URL (same pattern used elsewhere in this app for image uploads)
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Splits blog content into paragraphs and interleaves up to 3 in-content
// images: after the ~1/3 mark, after the ~2/3 mark, and always one at the
// very end — so a post with a header image + 3 in-content images shows at
// least 4 images total, spaced through header -> paragraphs -> end.
function renderContentWithImages(content: string, images: string[]) {
  const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());
  const blocks: React.ReactNode[] = [];

  if (images.length === 0) {
    paragraphs.forEach((p, i) => {
      blocks.push(
        <p key={`p-${i}`} className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
          {p}
        </p>
      );
    });
    return blocks;
  }

  // Decide insertion points for "in-between" images (all but the last image)
  const midImages = images.slice(0, -1);
  const lastImage = images[images.length - 1];
  const insertAfter = new Set<number>();
  if (midImages.length > 0 && paragraphs.length > 1) {
    midImages.forEach((_, idx) => {
      const fraction = (idx + 1) / (midImages.length + 1);
      const pos = Math.max(0, Math.min(paragraphs.length - 1, Math.round(paragraphs.length * fraction) - 1));
      insertAfter.add(pos);
    });
  }

  let midImgCursor = 0;
  const usedPositions = Array.from(insertAfter).sort((a, b) => a - b);

  paragraphs.forEach((p, i) => {
    blocks.push(
      <p key={`p-${i}`} className="text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
        {p}
      </p>
    );
    if (usedPositions.includes(i) && midImgCursor < midImages.length) {
      blocks.push(
        <img
          key={`img-${i}`}
          src={midImages[midImgCursor]}
          alt=""
          className="w-full rounded-2xl my-5 object-cover max-h-96"
        />
      );
      midImgCursor += 1;
    }
  });

  // Any remaining mid-images that didn't get a slot (very short posts) — add before the last image
  while (midImgCursor < midImages.length) {
    blocks.push(
      <img key={`img-extra-${midImgCursor}`} src={midImages[midImgCursor]} alt="" className="w-full rounded-2xl my-5 object-cover max-h-96" />
    );
    midImgCursor += 1;
  }

  // Final image always at the end
  blocks.push(
    <img key="img-last" src={lastImage} alt="" className="w-full rounded-2xl mt-5 object-cover max-h-96" />
  );

  return blocks;
}

export default function BlogPage({ isOpen, onClose, lang, initialPostId, onPostsChanged }: BlogPageProps) {
  const [view, setView] = useState<'list' | 'read' | 'write' | 'login'>('list');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');

  // Write/Edit form state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Job Tips');
  const [author, setAuthor] = useState('Prince Sharma');
  const [headerImage, setHeaderImage] = useState<string>('');
  const [inlineImages, setInlineImages] = useState<string[]>([]); // up to 3
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const mapRow = (row: any): BlogPost => ({
    id: String(row.id),
    title: row.title,
    content: row.content,
    category: row.category || 'Other',
    date: row.created_at,
    author: row.author || 'Prince Sharma',
    header_image: row.header_image || undefined,
    images: Array.isArray(row.images) ? row.images : [],
  });

  const loadPosts = async (jumpToId?: string | null) => {
    setLoading(true);
    setLoadError('');
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      let mapped: BlogPost[] = (data || []).map(mapRow);

      // Auto-seed the very first announcement post if the table is empty
      if (mapped.length === 0) {
        const { error: seedErr } = await supabase.from('blog_posts').insert(DEFAULT_POST);
        if (!seedErr) {
          const { data: freshData } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
          mapped = (freshData || []).map(mapRow);
          onPostsChanged?.();
        }
      }

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
      console.error('Failed to load blog posts:', err);
      setLoadError(
        lang === 'en'
          ? 'Could not load posts. Please check your internet connection.'
          : 'Posts load nahi ho paaye. Internet connection check karein.'
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
    if (password === BLOG_PASSWORD) {
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
    setCategory('Job Tips');
    setAuthor('Prince Sharma');
    setHeaderImage('');
    setInlineImages([]);
  };

  const startEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setAuthor(post.author);
    setHeaderImage(post.header_image || '');
    setInlineImages(post.images || []);
    setView('write');
  };

  const handleHeaderImageUpload = async (file: File) => {
    setUploadingSlot('header');
    try {
      const b64 = await readFileAsBase64(file);
      setHeaderImage(b64);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleInlineImageUpload = async (index: number, file: File) => {
    setUploadingSlot(`inline-${index}`);
    try {
      const b64 = await readFileAsBase64(file);
      setInlineImages((prev) => {
        const next = [...prev];
        next[index] = b64;
        return next;
      });
    } finally {
      setUploadingSlot(null);
    }
  };

  const removeInlineImage = (index: number) => {
    setInlineImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
    setPublishing(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        author: author.trim() || 'Prince Sharma',
        header_image: headerImage || null,
        images: inlineImages.filter(Boolean),
      };

      if (editingPostId) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPostId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload);
        if (error) throw error;
      }

      resetForm();
      await loadPosts();
      onPostsChanged?.();
    } catch (err: any) {
      console.error('Failed to publish blog post:', err);
      alert(
        lang === 'en'
          ? 'Could not publish the post. Please check your internet connection and try again.'
          : 'Post publish nahi ho saka. Internet check karke dobara try karein.'
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      if (selectedPost?.id === id) setView('list');
      await loadPosts();
      onPostsChanged?.();
    } catch (err: any) {
      console.error('Failed to delete blog post:', err);
      alert(lang === 'en' ? 'Could not delete the post.' : 'Post delete nahi ho saka.');
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

  const ImageSlot = ({
    label,
    value,
    onUpload,
    onRemove,
    uploading,
  }: {
    label: string;
    value: string;
    onUpload: (file: File) => void;
    onRemove?: () => void;
    uploading: boolean;
  }) => (
    <div>
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">{label}</label>
      {value ? (
        <div className="relative">
          <img src={value} alt="" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
          <div className="absolute top-1.5 right-1.5 flex gap-1.5">
            <label className="bg-white/90 hover:bg-white text-slate-700 rounded-lg p-1.5 cursor-pointer shadow-sm">
              <Pencil size={13} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
            </label>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="bg-white/90 hover:bg-white text-red-500 rounded-lg p-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <label className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#128C7E]/40 hover:bg-[#eefaf7]/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors">
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-[#128C7E]" />
          ) : (
            <>
              <Upload size={18} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500">Image Upload Karo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="bg-white w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 max-h-[94vh] flex flex-col">
      {/* Top bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <button onClick={() => { setView('list'); resetForm(); }} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer -ml-1.5">
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
          )}
          <div>
            <h2 className="font-black text-slate-900 text-base flex items-center gap-1.5">
              <PenLine size={16} className="text-[#075E54]" />
              SGN Jobs Blog
            </h2>
            <p className="text-[11px] text-slate-400">Local news, tips & updates</p>
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
              <Plus size={13} />New Post
            </button>
          )}
          <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
            <X size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Scrollable page body */}
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

          {/* WRITE / EDIT VIEW */}
          {view === 'write' && isAdmin && (
            <div className="space-y-4">
              <div className="bg-[#eefaf7] border border-[#128C7E]/20 rounded-xl p-3 text-xs text-[#075E54]">
                <p className="font-black">{editingPostId ? '✏️ Blog Post Edit Karein' : '✍️ Naya Blog Post Likhein'}</p>
                <p className="opacity-80 mt-0.5">
                  {editingPostId ? 'Changes save karte hi turant update ho jaayega!' : 'Publish karte hi sabhi visitors ko turant dikhega!'}
                </p>
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

              {/* Header Image */}
              <ImageSlot
                label="📌 Header Image (sabse upar, title ke upar dikhegi) *recommended*"
                value={headerImage}
                onUpload={handleHeaderImageUpload}
                onRemove={headerImage ? () => setHeaderImage('') : undefined}
                uploading={uploadingSlot === 'header'}
              />

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Content *</label>
                <textarea rows={14} value={content} onChange={e => setContent(e.target.value)}
                  placeholder="Yahan apna blog likho... (Hindi ya English dono mein likh sakte hain). Alag paragraphs ke beech ek khaali line chhodein."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#128C7E] text-sm resize-none leading-relaxed" />
                <p className="text-[11px] text-slate-400 mt-1">Tip: Paragraphs ke beech ek khaali line chhodo — neeche wali images automatically un paragraphs ke beech-beech mein aur last mein set ho jaayengi.</p>
              </div>

              {/* Inline Images */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  🖼️ Beech aur Last ki Images (max 3 — content ke beech-beech aur end mein dikhengi)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <ImageSlot
                      key={idx}
                      label={idx === 2 ? 'Last Image' : `Image ${idx + 2}`}
                      value={inlineImages[idx] || ''}
                      onUpload={(file) => handleInlineImageUpload(idx, file)}
                      onRemove={inlineImages[idx] ? () => removeInlineImage(idx) : undefined}
                      uploading={uploadingSlot === `inline-${idx}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setView('list'); resetForm(); }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handlePublish} disabled={!title.trim() || !content.trim() || publishing}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black text-sm cursor-pointer flex items-center justify-center gap-2">
                  {publishing ? <Loader2 size={15} className="animate-spin" /> : <PenLine size={15} />}
                  {publishing
                    ? (editingPostId ? 'Update ho raha hai...' : 'Publish ho raha hai...')
                    : (editingPostId ? 'Changes Save Karein' : 'Publish Karein')}
                </button>
              </div>
            </div>
          )}

          {/* READ VIEW */}
          {view === 'read' && selectedPost && (
            <div className="space-y-4">
              {selectedPost.header_image && (
                <img
                  src={selectedPost.header_image}
                  alt={selectedPost.title}
                  className="w-full rounded-2xl object-cover max-h-96 -mt-1"
                />
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold bg-[#eefaf7] text-[#075E54] border border-[#128C7E]/20 px-2 py-0.5 rounded-full">
                  {selectedPost.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedPost.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><User size={11} />{selectedPost.author}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(selectedPost.date)}</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                {renderContentWithImages(selectedPost.content, selectedPost.images || [])}
              </div>
              {isAdmin && (
                <div className="flex items-center gap-4 pt-2">
                  <button onClick={() => startEdit(selectedPost)}
                    className="flex items-center gap-1.5 text-xs text-[#075E54] hover:text-[#054840] cursor-pointer font-bold">
                    <Pencil size={13} />Edit Post
                  </button>
                  <button onClick={() => handleDelete(selectedPost.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 size={13} />Delete Post
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
                  <p className="text-sm">{lang === 'en' ? 'Loading posts...' : 'Posts load ho rahe hain...'}</p>
                </div>
              ) : loadError ? (
                <div className="text-center py-12 text-red-400">
                  <p className="text-sm">{loadError}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <PenLine size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Abhi koi post nahi hai.</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id}
                    className="border border-slate-100 hover:border-[#128C7E]/30 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-sm group"
                  >
                    {post.header_image && (
                      <img
                        src={post.header_image}
                        alt=""
                        onClick={() => {
                          setSelectedPost(post);
                          setView('read');
                          navigateTo(`/blog/${post.id}`);
                          setCanonicalUrl(`/blog/${post.id}`);
                          setPageTitle(`${post.title} | Sri Ganganagar Jobs Blog`);
                        }}
                        className="w-full h-36 object-cover"
                      />
                    )}
                    <div
                      className="p-4"
                      onClick={() => {
                        setSelectedPost(post);
                        setView('read');
                        navigateTo(`/blog/${post.id}`);
                        setCanonicalUrl(`/blog/${post.id}`);
                        setPageTitle(`${post.title} | Sri Ganganagar Jobs Blog`);
                      }}
                    >
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
                    {isAdmin && (
                      <div className="px-4 pb-3 flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(post); }}
                          className="flex items-center gap-1 text-[11px] text-[#075E54] hover:text-[#054840] font-bold cursor-pointer"
                        >
                          <Pencil size={11} />Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                          className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                        >
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
