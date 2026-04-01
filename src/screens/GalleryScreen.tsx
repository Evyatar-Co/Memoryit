import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTTS } from '../hooks/useTTS';
import { Card } from '../components/ui/Card';
import type { MediaItem } from '../types';

function speakItem(item: MediaItem, speak: (t: string) => void) {
  const parts = [item.names[0]];
  if (item.event) parts.push(item.event);
  if (item.family) parts.push(item.family);
  if (item.date) parts.push(item.date);
  speak(parts.join('. '));
}

export function GalleryScreen() {
  const { mediaItems, setScreen } = useAppStore();
  const { speak } = useTTS();
  const [mode, setMode] = useState<'grid' | 'slideshow'>('grid');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const items = mediaItems;

  useEffect(() => {
    if (!autoPlay || mode !== 'slideshow' || items.length <= 1) return;
    const t = setInterval(() => setCurrentIdx((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [autoPlay, mode, items.length]);

  useEffect(() => {
    if (mode === 'grid') setAutoPlay(false);
  }, [mode]);

  const current = items[currentIdx];

  const prev = () => setCurrentIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setCurrentIdx((i) => (i + 1) % items.length);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6" dir="rtl">
        <div className="text-6xl">🖼️</div>
        <h2 className="text-3xl font-bold text-text-main">אין תמונות עדיין</h2>
        <p className="text-xl text-text-sub">הוסיפו תמונות בניהול תמונות</p>
        <button
          onClick={() => setScreen('upload')}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-lg border-none cursor-pointer hover:opacity-90"
        >
          📤 ניהול תמונות
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-black text-primary mb-1">🖼️ גלריית זיכרונות</h1>
        <p className="text-xl text-text-sub">{items.length} תמונות</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode('grid')}
          className={[
            'px-5 py-3 rounded-xl font-bold text-lg border-2 cursor-pointer transition-all',
            mode === 'grid'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-sub border-border-main hover:border-primary',
          ].join(' ')}
        >
          ☰ תצוגת רשת
        </button>
        <button
          onClick={() => { setMode('slideshow'); setCurrentIdx(0); }}
          className={[
            'px-5 py-3 rounded-xl font-bold text-lg border-2 cursor-pointer transition-all',
            mode === 'slideshow'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-sub border-border-main hover:border-primary',
          ].join(' ')}
        >
          ▶ שקופיות
        </button>
      </div>

      {/* Grid mode */}
      {mode === 'grid' && (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <Card key={item.id} className="overflow-hidden !p-0">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.names[0]}
                  className="w-full h-52 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => { setCurrentIdx(idx); setMode('slideshow'); }}
                />
                <button
                  onClick={() => speakItem(item, speak)}
                  className="absolute top-2 left-2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-base border-none cursor-pointer hover:bg-black/60 transition-colors"
                  title="הקרא"
                >
                  🔊
                </button>
              </div>
              <div className="p-4">
                <p className="text-xl font-black text-text-main">{item.names[0]}</p>
                {item.event && <p className="text-base text-text-sub mt-1">{item.event}</p>}
                {item.family && <p className="text-sm text-secondary font-bold mt-1">{item.family}</p>}
                {item.date && <p className="text-sm text-text-sub">{item.date}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Slideshow mode */}
      {mode === 'slideshow' && current && (
        <div>
          {/* Main image */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-strong mb-4 bg-black"
            style={{ height: 420 }}
          >
            <img
              src={current.imageUrl}
              alt={current.names[0]}
              className="w-full h-full object-contain"
            />
            <div
              className="absolute bottom-0 right-0 left-0 p-6"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
            >
              <p className="text-white text-3xl font-black">{current.names[0]}</p>
              {current.event && <p className="text-white/90 text-xl mt-1">{current.event}</p>}
              {current.family && <p className="text-white/75 text-lg">{current.family}</p>}
              {current.date && <p className="text-white/60 text-base">{current.date}</p>}
            </div>
            <button
              onClick={() => speakItem(current, speak)}
              className="absolute top-4 left-4 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center text-xl border-none cursor-pointer hover:bg-black/60 transition-colors"
              title="הקרא"
            >
              🔊
            </button>
            <div className="absolute top-4 right-4 bg-black/40 text-white text-base font-bold px-3 py-1 rounded-full">
              {currentIdx + 1} / {items.length}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-primary text-primary text-lg font-bold cursor-pointer hover:bg-primary-light transition-colors"
            >
              הבא ›
            </button>
            <button
              onClick={() => setAutoPlay((a) => !a)}
              className={[
                'px-6 py-3 rounded-xl font-bold text-lg border-2 cursor-pointer transition-all',
                autoPlay
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-text-main border-border-main hover:border-primary',
              ].join(' ')}
            >
              {autoPlay ? '⏸ עצור' : '▶ אוטומטי'}
            </button>
            <button
              onClick={prev}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-primary text-primary text-lg font-bold cursor-pointer hover:bg-primary-light transition-colors"
            >
              ‹ הקודם
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 flex-wrap">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={[
                  'rounded-full border-none cursor-pointer transition-all',
                  i === currentIdx ? 'bg-primary w-4 h-4' : 'bg-border-main w-2.5 h-2.5 hover:bg-primary/40',
                ].join(' ')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
