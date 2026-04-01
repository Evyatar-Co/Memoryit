import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const RELATIONS = [
  'סבתא',
  'סבא',
  'אמא',
  'אבא',
  'בת',
  'בן',
  'נכדה',
  'נכד',
  'אחות',
  'אח',
  'דודה',
  'דוד',
  'חבר/ה',
  'אחר',
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AvatarScreen() {
  const { avatarData, setAvatarData } = useAppStore();
  const [img, setImg] = useState<string>(avatarData?.img ?? '');
  const [name, setName] = useState(avatarData?.name ?? '');
  const [relation, setRelation] = useState(avatarData?.relation ?? RELATIONS[0]);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setImg(b64);
    setSaved(false);
  };

  const handleSave = () => {
    if (!img || !name) return;
    setAvatarData({ img, name, relation });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    setImg('');
    setName('');
    setRelation(RELATIONS[0]);
    setAvatarData(null);
    setSaved(false);
  };

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">🧑 אווטר מעודד</h1>
        <p className="text-xl text-text-sub">
          הוסיפו תמונה של אדם אהוב שיעודד אתכם במהלך המשחק
        </p>
      </div>

      <Card>
        {/* Preview */}
        <div className="flex flex-col items-center mb-8">
          {img ? (
            <div className="relative">
              <img
                src={img}
                alt="אווטר"
                className="w-40 h-40 rounded-full object-cover border-4 border-primary shadow-strong"
              />
              {name && (
                <div className="mt-2 text-center">
                  <span className="font-bold text-xl text-primary">{name}</span>
                  <span className="text-text-sub text-lg mr-2">({relation})</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-border-main flex items-center justify-center text-6xl border-4 border-dashed border-border-main">
              🧑
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-text-main mb-2">תמונה</label>
          <label className="flex items-center gap-4 border-2 border-dashed border-border-main rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary-light transition-all">
            <span className="text-3xl">📷</span>
            <div>
              <p className="font-bold text-text-main">לחצו לבחירת תמונה</p>
              <p className="text-sm text-text-sub">JPG, PNG, WEBP</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-text-main mb-2">שם *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            placeholder="הזינו שם"
            className="w-full border-2 border-border-main rounded-md px-4 py-3 text-xl font-medium focus:outline-none focus:border-primary bg-white"
          />
        </div>

        {/* Relation */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-text-main mb-2">קשר משפחתי</label>
          <select
            value={relation}
            onChange={(e) => { setRelation(e.target.value); setSaved(false); }}
            className="w-full border-2 border-border-main rounded-md px-4 py-3 text-xl font-medium focus:outline-none focus:border-primary bg-white cursor-pointer"
          >
            {RELATIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={!img || !name}
          >
            💾 שמור אווטר
          </Button>
          {avatarData && (
            <Button variant="danger" size="lg" onClick={handleClear}>
              🗑 הסר אווטר
            </Button>
          )}
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 font-bold text-lg">
            ✅ האווטר נשמר! הוא יופיע בפינה בזמן המשחק.
          </div>
        )}

        {!img && !name && (
          <div className="mt-4 p-4 bg-secondary-light border border-secondary rounded-lg text-secondary text-base">
            💡 האווטר יופיע בפינה השמאלית העליונה במהלך המשחק ויעודד אתכם כשתענו נכון!
          </div>
        )}
      </Card>
    </div>
  );
}
