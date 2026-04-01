import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTTS } from '../hooks/useTTS';

const DAYS_HE = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS_HE = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

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
  if (hour >= 5 && hour < 12) return { text: 'בוקר טוב', emoji: '☀️' };
  if (hour >= 12 && hour < 17) return { text: 'צהריים טובים', emoji: '🌤️' };
  if (hour >= 17 && hour < 21) return { text: 'ערב טוב', emoji: '🌙' };
  return { text: 'לילה טוב', emoji: '✨' };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function HomeScreen() {
  const { setScreen, setGameMode, mediaItems } = useAppStore();
  const { speak } = useTTS();
  const [now, setNow] = useState(new Date());
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const photos = mediaItems.filter((i) => !i.id.startsWith('default-'));

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [photos.length]);

  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const dayName = DAYS_HE[now.getDay()];
  const dateStr = `יום ${dayName}, ${now.getDate()} ב${MONTHS_HE[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr = `${pad(hour)}:${pad(now.getMinutes())}`;

  const startOfYear = new Date(now.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((now.getTime() - startOfYear) / 86400000);
  const dailyQ = DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];

  const currentPhoto = photos[slideIdx];

  const actions = [
    { label: 'משחקים', icon: '🎮', action: () => setGameMode('names') },
    { label: 'גלריה', icon: '🖼️', action: () => setScreen('gallery') },
    { label: 'אנשי קשר', icon: '👥', action: () => setScreen('contacts') },
    { label: 'שאלות', icon: '❓', action: () => setScreen('questions') },
    { label: 'טיפים', icon: '💡', action: () => setScreen('tips') },
    { label: 'תמונות', icon: '📤', action: () => setScreen('upload') },
  ];

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">

      {/* Clock Hero */}
      <div
        className="rounded-3xl p-8 mb-6 text-white text-center shadow-strong"
        style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 55%, #1565C0 100%)' }}
      >
        <div className="text-8xl font-black tracking-wider mb-2 tabular-nums">{timeStr}</div>
        <div className="text-2xl font-semibold opacity-90 mb-3">{dateStr}</div>
        <div className="text-3xl font-bold">
          {greeting.emoji} {greeting.text}
        </div>
      </div>

      {/* Family Photo Slideshow */}
      {photos.length > 0 ? (
        <div
          className="rounded-2xl overflow-hidden mb-6 shadow-strong relative bg-black"
          style={{ height: 300 }}
        >
          <img
            key={slideIdx}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.names[0]}
            className="w-full h-full object-cover opacity-90"
          />
          <div
            className="absolute bottom-0 right-0 left-0 p-5"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
          >
            <p className="text-white text-2xl font-black">{currentPhoto.names[0]}</p>
            {currentPhoto.event && (
              <p className="text-white/80 text-lg mt-0.5">{currentPhoto.event}</p>
            )}
          </div>
          {photos.length > 1 && (
            <div className="absolute top-3 right-3 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={[
                    'rounded-full border-none cursor-pointer transition-all',
                    i === slideIdx ? 'bg-white w-3 h-3' : 'bg-white/40 w-2.5 h-2.5',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-primary-light border-2 border-dashed border-primary p-8 text-center mb-6">
          <div className="text-5xl mb-3">📷</div>
          <p className="text-xl font-bold text-primary">הוסיפו תמונות משפחתיות</p>
          <p className="text-text-sub mt-1 text-base">התמונות יוצגו כאן בשקופיות</p>
          <button
            onClick={() => setScreen('upload')}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:opacity-90 transition-opacity"
          >
            📤 ניהול תמונות
          </button>
        </div>
      )}

      {/* Daily Question */}
      <div className="bg-secondary-light rounded-2xl p-5 mb-6 border-r-4 border-secondary">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-secondary font-black text-sm mb-2 uppercase tracking-wide">💭 שאלת היום</p>
            <p className="text-text-main text-xl font-bold leading-relaxed">{dailyQ}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => speak(dailyQ)}
              className="w-11 h-11 rounded-full bg-secondary text-white flex items-center justify-center text-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
              title="הקרא"
            >
              🔊
            </button>
            <button
              onClick={() => setScreen('questions')}
              className="w-11 h-11 rounded-full bg-white text-secondary border-2 border-secondary flex items-center justify-center text-xl cursor-pointer hover:bg-secondary-light transition-colors font-bold"
              title="לכל השאלות"
            >
              ←
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-3 gap-3">
        {actions.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border-2 border-border-main hover:border-primary hover:bg-primary-light cursor-pointer transition-all duration-150 font-bold text-text-main text-lg min-h-[100px] shadow-card"
          >
            <span className="text-4xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
