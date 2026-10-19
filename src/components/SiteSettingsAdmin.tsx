import React, { useState, useEffect } from 'react';
import {
  Facebook, Instagram, Youtube, Twitter, Linkedin, Send, MessageCircle,
  Image as ImageIcon, AtSign, Ghost, Save, Loader2, Plus, Trash2,
} from 'lucide-react';
import { SocialLinks, YoutubeVideoItem, VideoGalleryItem } from '../types';
import { fetchSocialLinks, saveSocialLinks, fetchYoutubeSettings, saveYoutubeSettings, fetchVideoGallery, saveVideoGallery, getVideoThumbnail } from '../utils/siteSettings';

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; icon: React.ComponentType<any>; placeholder: string }[] = [
  { key: 'facebook', label: 'Facebook Page', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
  { key: 'youtube', label: 'YouTube Channel', icon: Youtube, placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'twitter', label: 'X (Twitter)', icon: Twitter, placeholder: 'https://x.com/yourhandle' },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourpage' },
  { key: 'telegram', label: 'Telegram Channel', icon: Send, placeholder: 'https://t.me/yourchannel' },
  { key: 'whatsapp_channel', label: 'WhatsApp Channel', icon: MessageCircle, placeholder: 'https://whatsapp.com/channel/xxxx' },
  { key: 'pinterest', label: 'Pinterest', icon: ImageIcon, placeholder: 'https://pinterest.com/yourprofile' },
  { key: 'threads', label: 'Threads', icon: AtSign, placeholder: 'https://threads.net/@yourhandle' },
  { key: 'snapchat', label: 'Snapchat', icon: Ghost, placeholder: 'https://snapchat.com/add/yourhandle' },
];

export default function SiteSettingsAdmin() {
  const [links, setLinks] = useState<SocialLinks>({});
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([{ url: '', title: '' }, { url: '', title: '' }, { url: '', title: '' }]);
  const [channelUrl, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingLinks, setSavingLinks] = useState(false);
  const [savingYoutube, setSavingYoutube] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [gallery, setGallery] = useState<VideoGalleryItem[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState<{ platform: 'youtube' | 'instagram' | 'facebook'; url: string; title: string; thumbnail: string }>({ platform: 'youtube', url: '', title: '', thumbnail: '' });
  const [savingGallery, setSavingGallery] = useState(false);

  useEffect(() => {
    (async () => {
      const [sl, yt, gal] = await Promise.all([fetchSocialLinks(), fetchYoutubeSettings(), fetchVideoGallery()]);
      setLinks(sl);
      const defaultVideos = [{ url: '', title: '' }, { url: '', title: '' }, { url: '', title: '' }];
      const loaded = yt.videos && yt.videos.length > 0 ? yt.videos : defaultVideos;
      // Ensure always exactly 3 slots (in case older data had only 2)
      setVideos([0, 1, 2].map((i) => loaded[i] || { url: '', title: '' }));
      setChannelUrl(yt.channel_url || '');
      setGallery(gal);
      setLoading(false);
    })();
  }, []);

  const flashSaved = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const handleSaveLinks = async () => {
    setSavingLinks(true);
    try {
      await saveSocialLinks(links);
      flashSaved('Social links saved!');
    } catch (e: any) {
      alert(`Save nahi hua: ${e.message || e}`);
    } finally {
      setSavingLinks(false);
    }
  };

  const handleSaveYoutube = async () => {
    setSavingYoutube(true);
    try {
      // Keep all 3 slots in fixed order (Employer, Candidate, Intro) even if
      // some are empty — homepage relies on index position to know which is which.
      await saveYoutubeSettings({ videos, channel_url: channelUrl.trim() });
      flashSaved('YouTube settings saved!');
    } catch (e: any) {
      alert(`Save nahi hua: ${e.message || e}`);
    } finally {
      setSavingYoutube(false);
    }
  };

  const updateVideo = (i: number, field: keyof YoutubeVideoItem, value: string) => {
    setVideos((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const handleAddGalleryItem = async () => {
    if (!newGalleryItem.url.trim() || !newGalleryItem.title.trim()) {
      alert('URL aur Title dono zaroori hai.');
      return;
    }
    if (newGalleryItem.platform !== 'youtube' && !newGalleryItem.thumbnail.trim()) {
      alert('Instagram/Facebook video ke liye Thumbnail image zaroori hai.');
      return;
    }
    const item: VideoGalleryItem = { id: `v-${Date.now()}`, ...newGalleryItem };
    const updated = [item, ...gallery];
    setSavingGallery(true);
    try {
      await saveVideoGallery(updated);
      setGallery(updated);
      setNewGalleryItem({ platform: 'youtube', url: '', title: '', thumbnail: '' });
      flashSaved('Video gallery updated!');
    } catch (e: any) {
      alert(`Save nahi hua: ${e.message || e}`);
    } finally {
      setSavingGallery(false);
    }
  };

  const handleRemoveGalleryItem = async (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setSavingGallery(true);
    try {
      await saveVideoGallery(updated);
      setGallery(updated);
    } catch (e: any) {
      alert(`Delete nahi hua: ${e.message || e}`);
    } finally {
      setSavingGallery(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" size={22} /><p className="text-xs">Loading...</p></div>;
  }

  return (
    <div className="space-y-6">
      {savedMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-2 rounded-xl">✅ {savedMsg}</div>
      )}

      {/* Social Media Links */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-1">📱 Social Media Links</h3>
        <p className="text-xs text-slate-400 mb-3">Ye links Footer aur Sidebar mein icons ke roop mein dikhenge. Khaali chhodo agar us platform pe account nahi hai — icon apne aap hide ho jayega.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-slate-500" />
              </div>
              <input
                value={links[key] || ''}
                onChange={(e) => setLinks((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={`${label} — ${placeholder}`}
                className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          ))}
        </div>
        <button onClick={handleSaveLinks} disabled={savingLinks}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-[#075E54] text-white text-xs font-black rounded-xl disabled:opacity-50">
          {savingLinks ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Social Links Save Karein
        </button>
      </div>

      <div className="h-px bg-slate-100" />

      {/* YouTube Videos */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-1">▶️ Homepage YouTube Videos</h3>
        <p className="text-xs text-slate-400 mb-3">Ye 3 videos homepage ke upar side-by-side dikhengi — job search aur candidates section ke upar (koi bhi duration chalegi — 1 min ho ya 10 min).</p>
        <div className="space-y-3">
          {[
            { label: '1️⃣ Employer Ke Liye', hint: 'jaise "Free mein job kaise post karein"' },
            { label: '2️⃣ Candidate Ke Liye', hint: 'jaise "Free profile kaise banayein"' },
            { label: '3️⃣ Website Introduction', hint: 'poori site ka intro/walkthrough' },
          ].map((slot, i) => (
            <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <label className="text-xs font-black text-slate-700">{slot.label}</label>
              <p className="text-[10px] text-slate-400 -mt-1">{slot.hint}</p>
              <input
                value={videos[i]?.url || ''}
                onChange={(e) => updateVideo(i, 'url', e.target.value)}
                placeholder="YouTube video link (e.g. https://youtube.com/watch?v=xxxx)"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              />
              <input
                value={videos[i]?.title || ''}
                onChange={(e) => updateVideo(i, 'title', e.target.value)}
                placeholder="Video ka title (optional, display ke liye)"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-[10px] font-bold text-slate-500 uppercase">"View More Videos" Button Link (YouTube channel)</label>
          <input
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
            placeholder="https://youtube.com/@yourchannel"
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#128C7E] mt-1"
          />
        </div>
        <button onClick={handleSaveYoutube} disabled={savingYoutube}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-[#075E54] text-white text-xs font-black rounded-xl disabled:opacity-50">
          {savingYoutube ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          YouTube Settings Save Karein
        </button>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Video Gallery — unlimited videos, shown on /videos public page */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-1">🎬 Video Gallery (/videos page)</h3>
        <p className="text-xs text-slate-400 mb-3">Jitni chaho utni YouTube, Instagram ya Facebook videos yahan add karo — ye sab /videos page par grid mein dikhengi, click karte hi naye tab mein khulengi.</p>

        <div className="border border-slate-200 rounded-xl p-3 space-y-2 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select value={newGalleryItem.platform} onChange={(e) => setNewGalleryItem((p) => ({ ...p, platform: e.target.value as any }))}
              className="text-xs p-2 rounded-lg border border-slate-200 bg-white">
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
            <input value={newGalleryItem.url} onChange={(e) => setNewGalleryItem((p) => ({ ...p, url: e.target.value }))}
              placeholder="Video/Reel/Post link" className="sm:col-span-2 text-xs p-2 rounded-lg border border-slate-200" />
          </div>
          <input value={newGalleryItem.title} onChange={(e) => setNewGalleryItem((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title" className="w-full text-xs p-2 rounded-lg border border-slate-200" />
          {newGalleryItem.platform !== 'youtube' && (
            <input value={newGalleryItem.thumbnail} onChange={(e) => setNewGalleryItem((p) => ({ ...p, thumbnail: e.target.value }))}
              placeholder="Thumbnail image URL (Instagram/Facebook ke liye zaroori)" className="w-full text-xs p-2 rounded-lg border border-slate-200" />
          )}
          <button onClick={handleAddGalleryItem} disabled={savingGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#075E54] text-white text-xs font-black rounded-lg disabled:opacity-50">
            {savingGallery ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Gallery Mein Add Karein
          </button>
        </div>

        {gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {gallery.map((item) => (
              <div key={item.id} className="relative border border-slate-200 rounded-lg overflow-hidden">
                {getVideoThumbnail(item) ? (
                  <img src={getVideoThumbnail(item)} alt="" className="w-full h-20 object-cover" />
                ) : (
                  <div className="w-full h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">No thumbnail</div>
                )}
                <p className="text-[10px] font-bold text-slate-700 p-1 truncate">{item.title}</p>
                <button onClick={() => handleRemoveGalleryItem(item.id)}
                  className="absolute top-1 right-1 bg-white/90 rounded-full p-1 text-red-500 hover:bg-white">
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
