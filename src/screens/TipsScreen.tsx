import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTTS } from '../hooks/useTTS';

const TIPS = [
  'דיאטה בריאה ומאוזנת — מומלץ לאמץ תזונה ים-תיכונית: ירקות, פירות, דגים, קטניות ושמן זית',
  'פעילות גופנית — לפחות 150 דקות בשבוע של פעילות מתונה כמו הליכה, שחייה או רכיבה על אופניים',
  'פעילות חברתית — שמרו על קשרים חברתיים פעילים, בקרו חברים ומשפחה והשתתפו בפעילויות קבוצתיות',
  'הימנעות מאלכוהול עודף — הגבלת שתיית אלכוהול מפחיתה את הסיכון לפגיעה קוגניטיבית',
  'שמירה על ערכים מאוזנים — חשוב לשמור על לחץ דם, רמת סוכר ומשקל גוף תקינים, וכן על היגיינת פה ושיניים',
  'שימוש במכשירי שמיעה ומשקפיים — תיקון לקויות ראייה ושמיעה מפחית עומס קוגניטיבי ומסייע בשמירה על הזיכרון',
  'טיפול בדיכאון, חרדה והפרעות שינה — מצבים אלו מגבירים את הסיכון לדמנציה; יש לפנות לטיפול מקצועי בעת הצורך',
  'טיפול תרופתי מיטבי — יש לעבור מעת לעת על רשימת התרופות עם הרופא ולהימנע מתרופות שעלולות לפגוע בזיכרון',
];

const ICONS = ['🥗', '🚶', '👥', '🍷', '💊', '👓', '🧠', '💉'];

export function TipsScreen() {
  const { speak, stop, speaking } = useTTS();
  const [activeTip, setActiveTip] = useState<number | null>(null);
  const [readingAll, setReadingAll] = useState(false);

  const speakTip = (idx: number) => {
    setActiveTip(idx);
    speak(TIPS[idx]);
  };

  const stopAll = () => {
    stop();
    setActiveTip(null);
    setReadingAll(false);
  };

  const readAll = async () => {
    setReadingAll(true);
    for (let i = 0; i < TIPS.length; i++) {
      setActiveTip(i);
      speak(TIPS[i]);
      await new Promise<void>((resolve) => {
        const utt = new SpeechSynthesisUtterance(TIPS[i]);
        utt.lang = 'he-IL';
        utt.rate = 0.85;
        utt.onend = () => resolve();
        utt.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utt);
      });
    }
    setActiveTip(null);
    setReadingAll(false);
  };

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">💡 טיפים למניעת דמנציה</h1>
        <p className="text-xl text-text-sub">8 המלצות לשמירה על בריאות המוח</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Button
          variant="primary"
          size="md"
          onClick={readAll}
          disabled={readingAll}
        >
          🎧 הקרא הכל
        </Button>
        {(speaking || readingAll) && (
          <Button variant="danger" size="md" onClick={stopAll}>
            ⏹ עצור הקראה
          </Button>
        )}
      </div>

      {/* Tips grid */}
      <div className="grid grid-cols-1 gap-4">
        {TIPS.map((tip, idx) => (
          <Card
            key={idx}
            className={[
              'transition-all duration-200',
              activeTip === idx ? 'bg-yellow-50 border-yellow-400 border-2 shadow-strong' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{ICONS[idx]}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xl font-semibold text-text-main leading-relaxed flex-1">
                    <span className="text-primary font-black ml-2">{idx + 1}.</span>
                    {tip}
                  </p>
                  <button
                    onClick={() => {
                      if (activeTip === idx && speaking) {
                        stopAll();
                      } else {
                        speakTip(idx);
                      }
                    }}
                    className={[
                      'flex-shrink-0 rounded-full w-11 h-11 flex items-center justify-center text-lg border-2 transition-all cursor-pointer',
                      activeTip === idx && speaking
                        ? 'bg-accent text-white border-accent shadow-strong'
                        : 'bg-white border-border-main text-text-sub hover:bg-bg hover:border-primary',
                    ].join(' ')}
                    title={activeTip === idx && speaking ? 'עצור' : 'הקרא'}
                  >
                    {activeTip === idx && speaking ? '⏹' : '🔊'}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
