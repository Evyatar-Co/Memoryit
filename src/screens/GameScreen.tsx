import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { buildQuestion, getSortedByDate, shuffle } from '../engine/gameEngine';
import { Button } from '../components/ui/Button';
import { AvatarWidget } from '../components/AvatarWidget';
import { useTTS } from '../hooks/useTTS';
import type { MediaItem } from '../types';

interface QuestionState {
  item: MediaItem;
  question: string;
  correct: string;
  options: string[];
}

function WinScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const { speak } = useTTS();

  useEffect(() => {
    speak(`כל הכבוד! סיימת את המשחק עם ${score} נקודות מתוך ${total}`);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4" dir="rtl">
      <div className="text-8xl">🏆</div>
      <h2 className="text-4xl font-black text-primary text-center">כל הכבוד!</h2>
      <p className="text-3xl text-text-sub font-bold text-center">
        ענית נכון על <span className="text-primary">{score}</span> מתוך <span className="text-primary">{total}</span> שאלות
      </p>
      <div
        className="w-full max-w-xs rounded-2xl p-6 text-center"
        style={{ background: score === total ? '#DCFCE7' : score >= total / 2 ? '#E3F2FD' : '#FEF9C3' }}
      >
        <div className="text-5xl mb-2">
          {score === total ? '🌟' : score >= total / 2 ? '👏' : '💪'}
        </div>
        <p className="text-xl font-bold text-text-main">
          {score === total ? 'תוצאה מושלמת!' : score >= total / 2 ? 'עשית עבודה טובה!' : 'ממשיכים להתאמן!'}
        </p>
      </div>
      <Button variant="primary" size="xl" onClick={onRestart} fullWidth>
        🔄 שחק שוב
      </Button>
    </div>
  );
}

export function GameScreen() {
  const { gameMode, mediaItems } = useAppStore();
  const { speak } = useTTS();

  const [items,          setItems]          = useState<MediaItem[]>([]);
  const [currentIdx,     setCurrentIdx]     = useState(0);
  const [score,          setScore]          = useState(0);
  const [answered,       setAnswered]       = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect,      setIsCorrect]      = useState<boolean | null>(null);
  const [finished,       setFinished]       = useState(false);
  const [questionState,  setQuestionState]  = useState<QuestionState | null>(null);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarMessage,  setAvatarMessage]  = useState('');

  const initGame = useCallback(() => {
    let ordered: MediaItem[];
    if (gameMode === 'chronological') ordered = getSortedByDate(mediaItems);
    else ordered = shuffle(mediaItems);
    setItems(ordered);
    setCurrentIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFinished(false);
    setAvatarSpeaking(false);
  }, [gameMode, mediaItems]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (items.length === 0 || currentIdx >= items.length) return;
    const item = items[currentIdx];
    const q = buildQuestion(item, mediaItems, gameMode);
    setQuestionState({ item, ...q });
  }, [items, currentIdx, gameMode, mediaItems]);

  const handleAnswer = (answer: string) => {
    if (answered || !questionState) return;
    const correct = answer === questionState.correct;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      setScore((s) => s + 1);
      setAvatarSpeaking(true);
      setAvatarMessage('כל הכבוד! ענית נכון! 🌟');
      speak('כל הכבוד! ענית נכון!');
      setTimeout(() => setAvatarSpeaking(false), 3000);
    } else {
      speak('לא מדויק, נסו שוב!');
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= items.length) setFinished(true);
    else {
      setCurrentIdx((i) => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleRetry = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  if (mediaItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4" dir="rtl">
        <div className="text-7xl">📷</div>
        <h2 className="text-3xl font-bold text-text-main text-center">אין תמונות</h2>
        <p className="text-xl text-text-sub text-center">
          יש להוסיף תמונות בניהול התמונות כדי להתחיל לשחק
        </p>
      </div>
    );
  }

  if (finished) return <WinScreen score={score} total={items.length} onRestart={initGame} />;

  if (!questionState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-2xl text-text-sub">טוען...</div>
      </div>
    );
  }

  const progress     = items.length > 0 ? ((currentIdx) / items.length) * 100 : 0;

  const modeLabels: Record<string, string> = {
    names:         '👤 שמות ותמונות',
    events:        '📅 תמונות ואירועים',
    families:      '👨‍👩‍👧 תמונות ומשפחות',
    chronological: '📆 סדר כרונולוגי',
  };

  return (
    <div className="max-w-xl mx-auto px-0 sm:px-2" dir="rtl">
      <AvatarWidget speaking={avatarSpeaking} message={avatarMessage} />

      {/* ── Header ── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h1 className="text-2xl font-black text-primary">{modeLabels[gameMode]}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-text-sub bg-bg px-3 py-1 rounded-xl">
              {currentIdx + 1} / {items.length}
            </span>
            <span className="text-xl font-bold text-accent bg-accent-light px-3 py-1 rounded-xl">
              ⭐ {score}
            </span>
          </div>
        </div>

        {/* Progress bar — thick and visible */}
        <div className="w-full h-5 bg-border-main rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentIdx} aria-valuemin={0} aria-valuemax={items.length}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Question + Image ── */}
      <div className="bg-surface rounded-2xl border border-border-main shadow-card mb-5 overflow-hidden">
        {/* Question text */}
        <div className="px-5 pt-6 pb-4 flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold text-text-main flex-1 leading-snug">
            {questionState.question}
          </h2>
          <button
            onClick={() => speak(questionState.question)}
            className="w-14 h-14 rounded-full bg-secondary-light text-secondary flex items-center justify-center text-2xl border-none cursor-pointer hover:bg-blue-200 transition-colors flex-shrink-0 min-h-0"
            aria-label="הקרא שאלה"
          >
            🔊
          </button>
        </div>

        {/* Photo — large and clear */}
        <div className="flex justify-center px-5 pb-5">
          <img
            src={questionState.item.imageUrl}
            alt="תמונה למשחק"
            className="rounded-xl border-4 border-border-main shadow-card object-cover"
            style={{ width: '100%', maxWidth: 320, height: 280 }}
          />
        </div>

        {/* Feedback banner */}
        {answered && isCorrect && (
          <div className="mx-5 mb-5 p-5 bg-success-bg border-2 border-success rounded-xl text-center">
            <p className="text-3xl font-black text-success">✅ כל הכבוד!</p>
            <p className="text-xl text-success mt-1">ענית נכון!</p>
          </div>
        )}
        {answered && !isCorrect && (
          <div className="mx-5 mb-5 p-5 bg-error-bg border-2 border-error rounded-xl text-center">
            <p className="text-2xl font-black text-error">❌ לא מדויק</p>
            <p className="text-xl text-error mt-2">
              התשובה הנכונה: <strong>{questionState.correct}</strong>
            </p>
          </div>
        )}
      </div>

      {/* ── Answer buttons — large, very clear ── */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {questionState.options.map((option, i) => {
          let bgClass = 'bg-white border-2 border-primary text-primary hover:bg-primary-light';

          if (answered) {
            if (option === questionState.correct) {
              bgClass = 'bg-success-bg border-4 border-success text-success';
            } else if (option === selectedAnswer && !isCorrect) {
              bgClass = 'bg-error-bg border-4 border-error text-error opacity-90';
            } else {
              bgClass = 'bg-bg border-2 border-border-main text-text-sub opacity-60';
            }
          }

          const optionLabels = ['א', 'ב', 'ג', 'ד'];

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={answered}
              aria-label={`אפשרות ${optionLabels[i]}: ${option}`}
              aria-pressed={selectedAnswer === option}
              className={[
                'w-full min-h-[80px] text-xl font-bold rounded-xl px-5 py-4 text-right',
                'transition-all duration-150 cursor-pointer',
                'active:scale-[0.98] disabled:cursor-default',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2',
                'flex items-center gap-4',
                bgClass,
              ].filter(Boolean).join(' ')}
            >
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-black flex-shrink-0 min-h-0">
                {optionLabels[i]}
              </span>
              <span className="flex-1 leading-snug">{option}</span>
              {answered && option === questionState.correct && (
                <span className="text-2xl flex-shrink-0">✅</span>
              )}
              {answered && option === selectedAnswer && !isCorrect && (
                <span className="text-2xl flex-shrink-0">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {answered && !isCorrect && (
          <Button variant="ghost" size="lg" fullWidth onClick={handleRetry}>
            🔄 נסה שוב
          </Button>
        )}
        {answered && isCorrect && (
          <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
            {currentIdx + 1 >= items.length ? '🏆 סיום המשחק' : 'שאלה הבאה ←'}
          </Button>
        )}
        {answered && !isCorrect && (
          <Button variant="secondary" size="lg" fullWidth onClick={handleNext}>
            דלג ←
          </Button>
        )}
      </div>
    </div>
  );
}
