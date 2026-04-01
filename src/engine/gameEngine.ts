import type { MediaItem, GameMode } from '../types';

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function getCorrectAnswer(item: MediaItem, mode: GameMode): string {
  switch (mode) {
    case 'events':
      return item.event ?? item.names[0];
    case 'families':
      return item.family ?? item.names[0];
    case 'chronological':
      return item.date ?? item.names[0];
    case 'names':
    case 'free':
    default:
      return item.names[0];
  }
}

export function getDistractor(item: MediaItem, mode: GameMode): string {
  switch (mode) {
    case 'events':
      return item.event ?? item.names[0];
    case 'families':
      return item.family ?? item.names[0];
    case 'chronological':
      return item.date ?? item.names[0];
    case 'names':
    case 'free':
    default:
      return item.names[0];
  }
}

export function buildQuestion(
  item: MediaItem,
  allItems: MediaItem[],
  mode: GameMode
): { question: string; correct: string; options: string[] } {
  const correct = getCorrectAnswer(item, mode);

  const distractors = allItems
    .filter((x) => x.id !== item.id)
    .map((x) => getDistractor(x, mode))
    .filter(Boolean)
    .filter((d) => d !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Pad with generic options if not enough distractors
  const placeholders = ['אדם אחר', 'לא ידוע', 'אין תשובה', 'דלג'];
  while (distractors.length < 3) {
    const p = placeholders[distractors.length];
    if (!distractors.includes(p) && p !== correct) {
      distractors.push(p);
    } else {
      distractors.push(`אפשרות ${distractors.length + 1}`);
    }
  }

  // Build exactly 4 unique options including the correct answer
  const uniqueDistractors = [...new Set(distractors)].filter((d) => d !== correct).slice(0, 3);
  while (uniqueDistractors.length < 3) {
    const fallback = `אפשרות ${uniqueDistractors.length + 1}`;
    uniqueDistractors.push(fallback);
  }
  const options = shuffle([...uniqueDistractors, correct]).slice(0, 4);

  let question: string;
  switch (mode) {
    case 'events':
      question = 'מהו האירוע בתמונה?';
      break;
    case 'families':
      question = 'לאיזו משפחה שייך האדם בתמונה?';
      break;
    case 'chronological':
      question = 'מתי צולמה התמונה?';
      break;
    case 'free':
      question = 'מה אתה זוכר על האדם בתמונה?';
      break;
    case 'names':
    default:
      question = 'מי האדם בתמונה?';
  }

  return { question, correct, options };
}

export function getSortedByDate(items: MediaItem[]): MediaItem[] {
  return [...items].sort((a, b) => {
    const da = a.date ?? '';
    const db = b.date ?? '';
    return da.localeCompare(db);
  });
}
