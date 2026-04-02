import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTTS } from '../hooks/useTTS';

const DAYS_HE    = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const MONTHS_HE  = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

const DAILY_QUESTIONS = [
  'איזה שינוי טכנולוגי ממשיך להדהים אותך?',
  'איזו תקופה בחיים היתה החשובה ביותר עבורך?',
  'מה הדבר הגדול ביותר שעשית בחיים?',
  'האם את/ה מאושר/ת?',
  'מה חשוב לי בחיים?',
  'מה המתנה המשמעותית ביותר שקיבלתי בחיים?',
  'מהו הצליל הכי יפה בעולם?',
  'איך אני מקבל אדם חדש לביתי?',
  'מה זה אומץ עבורי?',
  'מה העוגן בחיי?',
  'מהם המאכלים וטעמי הילדות שלי?',
  'מהם הצלילים של ילדותי?',
  'מה המתנה שתרצה להעניק לילדיך?',
];

function getGreeting(hour: number) {
  if (hour >= 5  && hour < 12) return { text: 'בוקר טוב',    emoji: '☀️' };
  if (hour >= 12 && hour < 17) return { text: 'צהריים טובים', emoji: '🌤️' };
  if (hour >= 17 && hour < 21) return { text: 'ערב טוב',     emoji: '🌙' };
  return { text: 'לילה טוב', emoji: '✨' };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export function HomeScreen() {
  const { setScreen, setGameMode, mediaItems } = useAppStore();
  const { speak } = useTTS();
  const [now, setNow]       = useState(new Date());
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const photos = mediaItems.filter((i) => !i.id.startsWith('default-'));

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [photos.length]);

  const hour        = now.getHours();
  const greeting    = getGreeting(hour);
  const dayName     = DAYS_HE[now.getDay()];
  const dateStr     = `יום ${dayName}, ${now.getDate()} ב${MONTHS_HE[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr     = `${pad(hour)}:${pad(now.getMinutes())}`;

  const dayOfYear   = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyQ      = DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
  const currentPhoto = photos[slideIdx];

  const gameActions = [
    { label: 'שמות ותמונות',    icon: '👤', action: () => setGameMode('names') },
    { label: 'תמונות ואירועים', icon: '📅', action: () => setGameMode('events') },
    { label: 'תמונות ומשפחות', icon: '👨‍👩‍👧', action: () => setGameMode('families') },
    { label: 'סדר כרונולוגי',  icon: '📆', action: () => setGameMode('chronological') },
  ];

  const quickLinks = [
    { label: 'גלריה',     icon: '🖼️', action: () => setScreen('gallery') },
    { label: 'אנשי קשר', icon: '👥', action: () => setScreen('contacts') },
    { label: 'טיפים',    icon: '💡', action: () => setScreen('tips') },
    { label: 'שאלות',    icon: '❓', action: () => setScreen('questions') },
  ];

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">

      {/* ── Hero: Clock + Date ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 mb-6 text-white text-center shadow-strong"
        style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #1565C0 100%)' }}
        role="banner"
        aria-label="שעה ותאריך"
      >
        <div
          className="font-black tabular-nums mb-1 tracking-wide"
          style={{ fontSize: 'clamp(3.5rem, 15vw, 5rem)', lineHeight: 1 }}
          aria-live="polite"
          aria-atomic="true"
        >
          {timeStr}
        </div>
        <div className="text-xl sm:text-2xl font-semibold opacity-90 mb-3">{dateStr}</div>
        <div className="text-2xl sm:text-3xl font-bold">
          {greeting.emoji} {greeting.text}
        </div>
      </div>

      {/* ── Family Slideshow ── */}
      {photos.length > 0 ? (
        <div
          className="rounded-2xl overflow-hidden mb-6 shadow-strong relative bg-black"
          style={{ height: 260 }}
          aria-label="תמונות משפחה"
        >
          <img
            key={slideIdx}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.names[0]}
            className="w-full h-full object-cover opacity-90"
          />
          <div
            className="absolute bottom-0 right-0 left-0 p-5"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.78))' }}
          >
            <p className="text-white text-2xl font-black">{currentPhoto.names[0]}</p>
            {currentPhoto.event && (
              <p className="text-white/80 text-lg mt-0.5">{currentPhoto.event}</p>
            )}
          </div>
          {photos.length > 1 && (
            <div className="absolute top-3 right-3 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  aria-label={`תמונה ${i + 1}`}
                  aria-current={i === slideIdx ? 'true' : undefined}
                  className={[
                    'rounded-full border-none cursor-pointer transition-all min-h-0',
                    i === slideIdx ? 'bg-white w-3.5 h-3.5' : 'bg-white/40 w-2.5 h-2.5',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setScreen('upload')}
          className="w-full rounded-2xl bg-primary-light border-2 border-dashed border-primary p-8 text-center mb-6 cursor-pointer hover:bg-green-100 transition-colors min-h-0"
        >
          <div className="text-5xl mb-3">📷</div>
          <p className="text-xl font-bold text-primary">הוסיפו תמונות משפחתיות</p>
          <p className="text-text-sub mt-1">לחצו כאן להוספת תמונות</p>
        </button>
      )}

      {/* ── Games Section ── */}
      <section className="mb-6" aria-labelledby="games-title">
        <h2 id="games-title" className="text-2xl font-black text-text-main mb-4 flex items-center gap-2">
          🎮 התחל משחק
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {gameActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-primary text-white border-none cursor-pointer hover:bg-primary-hover transition-all duration-150 active:scale-[0.97] min-h-[100px] shadow-card"
            >
              <span className="text-4xl" aria-hidden="true">{item.icon}</span>
              <span className="text-lg font-bold leading-tight text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Daily Question ── */}
      <section
        className="bg-secondary-light rounded-2xl p-5 mb-6 border-r-4 border-secondary"
        aria-label="שאלת היום"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-secondary font-black text-base mb-2 uppercase tracking-wide">💭 שאלת היום</p>
            <p className="text-text-main text-xl font-bold leading-relaxed">{dailyQ}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => speak(dailyQ)}
              className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center text-xl border-none cursor-pointer hover:bg-blue-800 transition-colors min-h-0"
              aria-label="הקרא את השאלה"
            >
              🔊
            </button>
            <button
              onClick={() => setScreen('questions')}
              className="w-14 h-14 rounded-full bg-white text-secondary border-2 border-secondary flex items-center justify-center text-2xl cursor-pointer hover:bg-secondary-light transition-colors font-bold min-h-0"
              aria-label="לכל השאלות"
            >
              ←
            </button>
          </div>
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section aria-labelledby="links-title">
        <h2 id="links-title" className="text-2xl font-black text-text-main mb-4">⚡ גישה מהירה</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border-2 border-border-main hover:border-primary hover:bg-primary-light cursor-pointer transition-all duration-150 active:scale-[0.97] min-h-[90px] shadow-card font-bold text-text-main"
            >
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <span className="text-base leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
