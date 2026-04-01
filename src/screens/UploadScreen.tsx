import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { MediaItem } from '../types';

interface PendingItem {
  imageUrl: string;
  name: string;
  event: string;
  date: string;
  family: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadScreen() {
  const { mediaItems, addMediaItems, deleteMediaItem } = useAppStore();
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newPending: PendingItem[] = [];
    for (const file of files) {
      const imageUrl = await fileToBase64(file);
      newPending.push({
        imageUrl,
        name: file.name.replace(/\.[^.]+$/, ''),
        event: '',
        date: '',
        family: '',
      });
    }
    setPending((p) => [...p, ...newPending]);
    setSaved(false);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updatePending = (idx: number, field: keyof PendingItem, value: string) => {
    setPending((p) => p.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const removePending = (idx: number) => {
    setPending((p) => p.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (pending.length === 0) return;
    const newItems: MediaItem[] = pending.map((p) => ({
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      imageUrl: p.imageUrl,
      names: [p.name || 'ללא שם'],
      event: p.event || undefined,
      date: p.date || undefined,
      family: p.family || undefined,
    }));
    addMediaItems(newItems);
    setPending([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">📤 ניהול תמונות</h1>
        <p className="text-xl text-text-sub">הוסיפו והסירו תמונות למשחק</p>
      </div>

      {/* Upload area */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-text-main mb-4">העלאת תמונות חדשות</h2>

        <label className="block w-full border-4 border-dashed border-border-main rounded-lg p-10 text-center cursor-pointer hover:border-primary hover:bg-primary-light transition-all duration-200 mb-6">
          <div className="text-5xl mb-3">📷</div>
          <p className="text-xl font-bold text-text-main mb-1">לחצו לבחירת תמונות</p>
          <p className="text-text-sub">JPG, PNG, GIF, WEBP</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFiles}
          />
        </label>

        {/* Pending items */}
        {pending.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-text-main">תמונות להוספה ({pending.length})</h3>
            {pending.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start p-4 bg-bg rounded-lg border border-border-main"
              >
                <img
                  src={item.imageUrl}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-md border border-border-main flex-shrink-0"
                />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-text-sub mb-1">שם האדם *</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updatePending(idx, 'name', e.target.value)}
                      placeholder="הזינו שם"
                      className="w-full border-2 border-border-main rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:border-primary bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-sub mb-1">אירוע</label>
                    <input
                      type="text"
                      value={item.event}
                      onChange={(e) => updatePending(idx, 'event', e.target.value)}
                      placeholder="למשל: חתונה, בר מצווה"
                      className="w-full border-2 border-border-main rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:border-primary bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-sub mb-1">תאריך</label>
                    <input
                      type="date"
                      value={item.date}
                      onChange={(e) => updatePending(idx, 'date', e.target.value)}
                      className="w-full border-2 border-border-main rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:border-primary bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-sub mb-1">משפחה</label>
                    <input
                      type="text"
                      value={item.family}
                      onChange={(e) => updatePending(idx, 'family', e.target.value)}
                      placeholder="למשל: משפחת כהן"
                      className="w-full border-2 border-border-main rounded-md px-3 py-2 text-base font-medium focus:outline-none focus:border-primary bg-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removePending(idx)}
                  className="text-red-500 hover:text-red-700 text-2xl cursor-pointer flex-shrink-0 mt-1"
                  title="הסר"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="flex gap-4 mt-4">
              <Button variant="primary" size="md" onClick={handleSave}>
                💾 שמור תמונות
              </Button>
              <Button variant="ghost" size="md" onClick={() => setPending([])}>
                ביטול
              </Button>
            </div>

            {saved && (
              <div className="p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 font-bold text-lg">
                ✅ התמונות נשמרו בהצלחה!
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Existing items */}
      <Card>
        <h2 className="text-2xl font-bold text-text-main mb-4">
          תמונות קיימות ({mediaItems.length})
        </h2>
        {mediaItems.length === 0 ? (
          <p className="text-text-sub text-lg text-center py-8">אין תמונות עדיין</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="border border-border-main rounded-lg overflow-hidden bg-bg shadow-card"
              >
                <img
                  src={item.imageUrl}
                  alt={item.names[0]}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3">
                  <p className="font-bold text-text-main text-base leading-tight truncate">
                    {item.names[0]}
                  </p>
                  {item.event && (
                    <p className="text-sm text-text-sub truncate">{item.event}</p>
                  )}
                  {item.family && (
                    <p className="text-xs text-text-sub truncate">{item.family}</p>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`האם למחוק את "${item.names[0]}"?`)) {
                        deleteMediaItem(item.id);
                      }
                    }}
                    className="mt-2 w-full py-1.5 text-sm font-bold text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    🗑 מחק
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
