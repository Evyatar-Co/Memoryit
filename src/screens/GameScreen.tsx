import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { buildQuestion, getSortedByDate, shuffle } from '../engine/gameEngine';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TTSButton } from '../components/ui/TTSButton';
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-7xl animate-bounce">🏆</div>
      <h2 className="text-4xl font-black text-primary text-center">כל הכבוד!</h2>
      <p className="text-2xl text-text-sub font-bold">
        ענית נכון על {score} מתוך {total} שאלות
      </p>
      <div className="flex gap-4">
        <Button variant="primary" size="lg" onClick={onRestart}>
          שחק שוב
        </Button>
      </div>
    </div>
  );
}

export function GameScreen() {
  const { gameMode, mediaItems } = useAppStore();
  const { speak } = useTTS();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);
  const [questionState, setQuestionState] = useState<QuestionState | null>(null);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');

  const initGame = useCallback(() => {
    let ordered: MediaItem[];
    if (gameMode === 'chronological') {
      ordered = getSortedByDate(mediaItems);
    } else {
      ordered = shuffle(mediaItems);
    }
    setItems(ordered);
    setCurrentIdx(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setFinished(false);
    setAvatarSpeaking(false);
  }, [gameMode, mediaItems]);

  useEffect(() => {
    initGame();
  }, [initGame]);

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
      speak('נסו שוב! אתם יכולים!');
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= items.length) {
      setFinished(true);
    } else {
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-6xl">📷</div>
        <h2 className="text-3xl font-bold text-text-main">אין תמונות</h2>
        <p className="text-xl text-text-sub text-center">
          יש להוסיף תמונות בניהול התמונות כדי להתחיל לשחק
        </p>
      </div>
    );
  }

  if (finished) {
    return <WinScreen score={score} total={items.length} onRestart={initGame} />;
  }

  if (!questionState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-2xl text-text-sub">טוען...</div>
      </div>
    );
  }

  const progress = items.length > 0 ? ((currentIdx) / items.length) * 100 : 0;

  const modeLabels: Record<string, string> = {
    names: '👤 שמות ותמונות',
    events: '📅 תמונות ואירועים',
    families: '👨‍👩‍👧 תמונות ומשפחות',
    chronological: '📆 סדר כרונולוגי',
    free: '🎮 משחק חופשי',
  };

  return (
    <div className="max-w-2xl mx-auto" dir="rtl">
      {/* Avatar Widget */}
      <AvatarWidget speaking={avatarSpeaking} message={avatarMessage} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-primary">{modeLabels[gameMode]}</h1>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-text-sub">
              {currentIdx + 1} / {items.length}
            </span>
            <span className="text-lg font-bold text-accent">⭐ {score}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-border-main rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        {/* Question text + TTS */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-text-main flex-1">{questionState.question}</h2>
          <TTSButton text={questionState.question} />
        </div>

        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src={questionState.item.imageUrl}
            alt="תמונה למשחק"
            className="w-64 h-64 object-cover rounded-lg border-4 border-border-main shadow-card"
            style={{ maxWidth: '280px', maxHeight: '280px' }}
          />
        </div>

        {/* Answer feedback banner */}
        {answered && isCorrect && (
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
            <p className="text-2xl font-black text-green-700">✅ כל הכבוד! ענית נכון!</p>
          </div>
        )}
        {answered && !isCorrect && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-center">
            <p className="text-xl font-bold text-red-700">❌ לא מדויק — נסו שוב!</p>
            <p className="text-lg text-red-600 mt-1">
              התשובה הנכונה: <strong>{questionState.correct}</strong>
            </p>
          </div>
        )}
      </Card>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {questionState.options.map((option) => {
          let extraClass = '';

          if (answered) {
            if (option === questionState.correct) {
              extraClass = '!bg-green-500 !text-white !border-green-600 !shadow-strong';
            } else if (option === selectedAnswer && !isCorrect) {
              extraClass = '!bg-red-500 !text-white !border-red-600';
            } else {
              extraClass = 'opacity-50';
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={answered}
              className={[
                'w-full min-h-[72px] text-xl font-bold rounded-lg border-2 border-primary text-primary px-6 py-4 text-right',
                'transition-all duration-150 cursor-pointer',
                'hover:bg-primary-light active:scale-[0.98] disabled:cursor-default',
                'focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2',
                extraClass,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center">
        {answered && !isCorrect && (
          <Button variant="secondary" size="lg" onClick={handleRetry}>
            נסה שוב
          </Button>
        )}
        {answered && isCorrect && (
          <Button variant="primary" size="lg" onClick={handleNext}>
            {currentIdx + 1 >= items.length ? 'סיום המשחק 🏆' : 'שאלה הבאה ←'}
          </Button>
        )}
        {answered && !isCorrect && (
          <Button variant="ghost" size="lg" onClick={handleNext}>
            דלג
          </Button>
        )}
      </div>
    </div>
  );
}
