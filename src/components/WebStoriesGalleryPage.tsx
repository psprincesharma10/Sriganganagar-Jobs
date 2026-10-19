import React, { useState, useEffect } from 'react';
import { X, Loader2, Film } from 'lucide-react';
import { WebStory } from '../types';
import { supabase } from '../supabaseClient';

interface WebStoriesGalleryPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebStoriesGalleryPage({ isOpen, onClose }: WebStoriesGalleryPageProps) {
  const [stories, setStories] = useState<WebStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('web_stories')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });
        if (error) throw error;
        setStories((data || []) as WebStory[]);
      } catch (e) {
        console.warn('Failed to load web stories gallery:', e);
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
          <Film size={18} className="text-[#075E54]" />
          Web Stories
        </h2>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer">
          <X size={18} className="text-slate-600" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <Loader2 size={28} className="mx-auto mb-3 animate-spin" />
            <p className="text-sm">Loading stories...</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Film size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Abhi koi story publish nahi hui hai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stories.map((story) => (
              <a
                key={story.id}
                href={`/stories/${story.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow bg-white"
              >
                <div className="aspect-[9/16] bg-slate-100 overflow-hidden">
                  <img
                    src={story.poster_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-bold text-slate-800 p-2 leading-snug line-clamp-2">{story.title}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
