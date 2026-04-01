export type GameMode = 'names' | 'events' | 'families' | 'chronological' | 'free';
export type Screen = 'home' | 'game' | 'tips' | 'questions' | 'upload' | 'avatar' | 'gallery' | 'contacts';

export interface MediaItem {
  id: string;
  imageUrl: string;
  names: string[];
  event?: string;
  date?: string;
  family?: string;
}

export interface GameState {
  mode: GameMode;
  items: MediaItem[];
  currentIdx: number;
  score: number;
  total: number;
  answered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export interface AvatarData {
  img: string;
  name: string;
  relation: string;
}

export interface Contact {
  id: string;
  name: string;
  relation: string;
  phone?: string;
  imageUrl?: string;
}
