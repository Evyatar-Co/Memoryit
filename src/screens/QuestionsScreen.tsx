import { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTTS } from '../hooks/useTTS';

const QUESTIONS = [
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

const ICONS = ['💻', '⏳', '🌟', '😊', '💎', '🎁', '🎶', '🏠', '🦁', '⚓', '🍽️', '🎵', '🎀'];

const STORAGE_KEY = 'mem_question_answers';
const AUDIO_STORAGE_KEY = 'mem_question_audio';

function loadAnswers(): Record<number, string> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function loadAudioAnswers(): Record<number, string> {
  try { return JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

export function QuestionsScreen() {
  const { speak, stop, speaking } = useTTS();
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [readingAll, setReadingAll] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>(loadAnswers);
  const [audioAnswers, setAudioAnswers] = useState<Record<number, string>>(loadAudioAnswers);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [recordingQ, setRecordingQ] = useState<number | null>(null);
  const [answerMode, setAnswerMode] = useState<Record<number, 'text' | 'audio'>>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const saveAnswer = (idx: number, value: string) => {
    const updated = { ...answers, [idx]: value };
    setAnswers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const saveAudioAnswer = (idx: number, dataUrl: string) => {
    const updated = { ...audioAnswers, [idx]: dataUrl };
    setAudioAnswers(updated);
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteAudioAnswer = (idx: number) => {
    const updated = { ...audioAnswers };
    delete updated[idx];
    setAudioAnswers(updated);
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(updated));
  };

  const startRecording = async (idx: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        const reader = new FileReader();
        reader.onloadend = () => {
          saveAudioAnswer(idx, reader.result as string);
        };
        reader.readAsDataURL(blob);
        setRecordingQ(null);
      };

      recorder.start();
      setRecordingQ(idx);
    } catch {
      alert('לא ניתן לגשת למיקרופון. אנא אשרו הרשאת מיקרופון בדפדפן.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const playAudio = (idx: number) => {
    const dataUrl = audioAnswers[idx];
    if (!dataUrl) return;
    const audio = new Audio(dataUrl);
    audio.play();
  };

  const speakQ = (idx: number) => {
    setActiveQ(idx);
    speak(QUESTIONS[idx]);
  };

  const stopAll = () => {
    stop();
    setActiveQ(null);
    setReadingAll(false);
  };

  const readAll = async () => {
    setReadingAll(true);
    for (let i = 0; i < QUESTIONS.length; i++) {
      setActiveQ(i);
      await new Promise<void>((resolve) => {
        const utt = new SpeechSynthesisUtterance(QUESTIONS[i]);
        utt.lang = 'he-IL';
        utt.rate = 0.85;
        utt.onend = () => resolve();
        utt.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utt);
      });
    }
    setActiveQ(null);
    setReadingAll(false);
  };

  const getMode = (idx: number) => answerMode[idx] ?? 'text';

  const setMode = (idx: number, mode: 'text' | 'audio') => {
    setAnswerMode((prev) => ({ ...prev, [idx]: mode }));
  };

  const hasAnswer = (idx: number) => !!(answers[idx] || audioAnswers[idx]);

  return (
    <div className="max-w-3xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-primary mb-2">❓ שאלות לחשיבה</h1>
        <p className="text-xl text-text-sub">13 שאלות לעורר זיכרונות ומחשבות</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Button variant="primary" size="md" onClick={readAll} disabled={readingAll}>
          🎧 הקרא הכל
        </Button>
        {(speaking || readingAll) && (
          <Button variant="danger" size="md" onClick={stopAll}>
            ⏹ עצור הקראה
          </Button>
        )}
      </div>

      {/* Questions grid */}
      <div className="grid grid-cols-1 gap-4">
        {QUESTIONS.map((question, idx) => (
          <Card
            key={idx}
            className={[
              'transition-all duration-200',
              activeQ === idx ? 'bg-yellow-50 border-yellow-400 border-2 shadow-strong' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{ICONS[idx]}</span>
              <div className="flex-1 min-w-0">
                {/* Question row */}
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xl font-semibold text-text-main leading-relaxed flex-1">
                    <span className="text-secondary font-black ml-2">{idx + 1}.</span>
                    {question}
                  </p>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setOpenQ(openQ === idx ? null : idx)}
                      className={[
                        'rounded-full w-11 h-11 flex items-center justify-center text-lg border-2 transition-all cursor-pointer',
                        hasAnswer(idx)
                          ? 'bg-primary text-white border-primary'
                          : openQ === idx
                          ? 'bg-secondary text-white border-secondary'
                          : 'bg-white border-border-main text-text-sub hover:bg-bg hover:border-primary',
                      ].join(' ')}
                      title="כתוב/הקלט תשובה"
                    >
                      {hasAnswer(idx) ? '✏️' : '📝'}
                    </button>
                    <button
                      onClick={() => { if (activeQ === idx && speaking) stopAll(); else speakQ(idx); }}
                      className={[
                        'rounded-full w-11 h-11 flex items-center justify-center text-lg border-2 transition-all cursor-pointer',
                        activeQ === idx && speaking
                          ? 'bg-accent text-white border-accent shadow-strong'
                          : 'bg-white border-border-main text-text-sub hover:bg-bg hover:border-secondary',
                      ].join(' ')}
                      title={activeQ === idx && speaking ? 'עצור' : 'הקרא'}
                    >
                      {activeQ === idx && speaking ? '⏹' : '🔊'}
                    </button>
                  </div>
                </div>

                {/* Answer area */}
                {openQ === idx && (
                  <div className="mt-4">
                    {/* Mode toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setMode(idx, 'text')}
                        className={[
                          'flex items-center gap-1 px-4 py-2 rounded-lg text-base font-bold border-2 cursor-pointer transition-all',
                          getMode(idx) === 'text'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-text-sub border-border-main hover:border-primary',
                        ].join(' ')}
                      >
                        ⌨️ הקלדה
                      </button>
                      <button
                        onClick={() => setMode(idx, 'audio')}
                        className={[
                          'flex items-center gap-1 px-4 py-2 rounded-lg text-base font-bold border-2 cursor-pointer transition-all',
                          getMode(idx) === 'audio'
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-text-sub border-border-main hover:border-primary',
                        ].join(' ')}
                      >
                        🎙️ הקלטה
                      </button>
                    </div>

                    {/* Text input */}
                    {getMode(idx) === 'text' && (
                      <div>
                        <textarea
                          className="w-full rounded-xl border-2 border-border-main focus:border-primary outline-none p-4 text-xl text-text-main resize-none leading-relaxed font-[Heebo]"
                          rows={3}
                          placeholder="כתבו את תשובתכם כאן..."
                          value={answers[idx] ?? ''}
                          onChange={(e) => saveAnswer(idx, e.target.value)}
                          dir="rtl"
                          autoFocus
                        />
                        {answers[idx] && (
                          <button
                            onClick={() => { speak(answers[idx]); setActiveQ(idx); }}
                            className="mt-2 text-base text-secondary underline cursor-pointer bg-transparent border-none"
                          >
                            🔊 הקרא את תשובתי
                          </button>
                        )}
                      </div>
                    )}

                    {/* Audio input */}
                    {getMode(idx) === 'audio' && (
                      <div className="flex flex-col gap-3">
                        {recordingQ === idx ? (
                          <button
                            onClick={stopRecording}
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-red-500 text-white text-xl font-bold border-none cursor-pointer animate-pulse"
                          >
                            ⏹ עצור הקלטה
                          </button>
                        ) : (
                          <button
                            onClick={() => startRecording(idx)}
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-primary text-white text-xl font-bold border-none cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            🎙️ {audioAnswers[idx] ? 'הקלט מחדש' : 'התחל הקלטה'}
                          </button>
                        )}

                        {audioAnswers[idx] && recordingQ !== idx && (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => playAudio(idx)}
                              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-white text-lg font-bold border-none cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              ▶️ השמע הקלטה
                            </button>
                            <button
                              onClick={() => deleteAudioAnswer(idx)}
                              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-red-500 text-lg font-bold border-2 border-red-300 cursor-pointer hover:bg-red-50 transition-colors"
                            >
                              🗑️ מחק
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Preview if answered and closed */}
                {openQ !== idx && (answers[idx] || audioAnswers[idx]) && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {answers[idx] && (
                      <p className="text-lg text-text-sub bg-primary-light rounded-xl px-4 py-3 leading-relaxed border-r-4 border-primary flex-1">
                        {answers[idx]}
                      </p>
                    )}
                    {audioAnswers[idx] && (
                      <button
                        onClick={() => playAudio(idx)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white text-base font-bold border-none cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                      >
                        ▶️ השמע הקלטה
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
