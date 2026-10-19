import React, { useState, useEffect } from 'react';
import { X, Loader2, Play, Youtube, Instagram, Facebook } from 'lucide-react';
import { VideoGalleryItem } from '../types';
import { fetchVideoGallery, getVideoThumbnail } from '../utils/siteSettings';

interface VideoGalleryPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORM_ICON: Record<string, React.ComponentType<any>> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
};

export default function VideoGalleryPage({ isOpen, onClose }: VideoGalleryPageProps) {
  const [videos, setVideos] = useState<VideoGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        setVideos(await fetchVideoGallery());
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="bg-white sticky top-0 z-10 border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <h2 className="font-black text-slate-900 text-base flex items-center gap-1.5">
          <Play size={18} className="text-[#075E54]" />
          Videos
        </h2>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
          <X size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <Loader2 size={28} className="mx-auto mb-3 animate-spin" />
            <p className="text-sm">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Play size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Abhi koi video add nahi hui hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {videos.map((item) => {
              const thumb = getVideoThumbnail(item);
              const PlatformIcon = PLATFORM_ICON[item.platform] || Play;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="aspect-video bg-slate-900 relative overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No thumbnail</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={18} className="text-slate-800 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full p-1">
                      <PlatformIcon size={12} className="text-slate-700" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-800 p-2 leading-snug line-clamp-2">{item.title}</p>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
