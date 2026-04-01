import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ContactsScreen() {
  const { contacts, addContact, deleteContact } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', relation: '', phone: '', imageUrl: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToBase64(file);
    setForm((f) => ({ ...f, imageUrl: url }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    addContact({
      id: `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: form.name.trim(),
      relation: form.relation.trim(),
      phone: form.phone.trim() || undefined,
      imageUrl: form.imageUrl || undefined,
    });
    setForm({ name: '', relation: '', phone: '', imageUrl: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black text-primary mb-1">👥 אנשי קשר</h1>
          <p className="text-xl text-text-sub">בני משפחה וחברים קרובים</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'ביטול' : '+ הוסף איש קשר'}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-text-main mb-5">איש קשר חדש</h2>
          <div className="flex gap-5 items-start mb-4">
            {/* Photo upload */}
            <div
              className="w-24 h-24 rounded-full bg-bg border-2 border-dashed border-border-main flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:border-primary transition-colors"
              onClick={() => fileRef.current?.click()}
              title="הוסף תמונה"
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📷</span>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-text-sub mb-1">שם *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="שם מלא"
                  className="w-full border-2 border-border-main rounded-lg px-3 py-2.5 text-lg focus:outline-none focus:border-primary bg-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-sub mb-1">קשר</label>
                <input
                  type="text"
                  value={form.relation}
                  onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
                  placeholder="למשל: בן, בת, נכד"
                  className="w-full border-2 border-border-main rounded-lg px-3 py-2.5 text-lg focus:outline-none focus:border-primary bg-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-text-sub mb-1">מספר טלפון</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="050-1234567"
                  className="w-full border-2 border-border-main rounded-lg px-3 py-2.5 text-lg focus:outline-none focus:border-primary bg-white"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={handleSave} disabled={!form.name.trim()}>
            💾 שמור
          </Button>
        </Card>
      )}

      {/* Empty state */}
      {contacts.length === 0 && !showForm && (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">👥</div>
          <p className="text-2xl font-bold text-text-main mb-2">אין אנשי קשר עדיין</p>
          <p className="text-text-sub text-lg">הוסיפו אנשי קשר לגישה מהירה</p>
        </div>
      )}

      {/* Contacts grid */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-light border-2 border-primary flex-shrink-0 flex items-center justify-center">
                  {contact.imageUrl ? (
                    <img src={contact.imageUrl} alt={contact.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-black text-text-main truncate">{contact.name}</p>
                  {contact.relation && (
                    <p className="text-base text-text-sub">{contact.relation}</p>
                  )}
                  {contact.phone && (
                    <p className="text-base text-secondary font-bold" dir="ltr">{contact.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-lg no-underline hover:opacity-90 transition-opacity"
                  >
                    📞 התקשר
                  </a>
                ) : (
                  <div className="flex-1" />
                )}
                <button
                  onClick={() => {
                    if (window.confirm(`למחוק את "${contact.name}"?`)) deleteContact(contact.id);
                  }}
                  className="w-12 h-12 rounded-xl bg-red-50 text-red-500 border border-red-200 cursor-pointer hover:bg-red-100 transition-colors flex items-center justify-center text-xl"
                >
                  🗑
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
