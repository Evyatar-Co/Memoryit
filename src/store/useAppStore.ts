import { create } from 'zustand';
import type { Screen, GameMode, MediaItem, AvatarData, Contact } from '../types';
import { DEFAULT_ITEMS } from '../data/defaults';

const STORAGE_KEY = 'mem_items';
const AVATAR_KEY = 'mem_avatar';
const CONTACTS_KEY = 'mem_contacts';
const SIMPLE_MODE_KEY = 'mem_simple_mode';

function loadItems(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MediaItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_ITEMS;
}

function loadAvatar(): AvatarData | null {
  try {
    const raw = localStorage.getItem(AVATAR_KEY);
    if (raw) return JSON.parse(raw) as AvatarData;
  } catch { /* ignore */ }
  return null;
}

function loadContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw) as Contact[];
  } catch { /* ignore */ }
  return [];
}

function loadSimpleMode(): boolean {
  return localStorage.getItem(SIMPLE_MODE_KEY) === 'true';
}

function saveItems(items: MediaItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
}

function saveAvatar(avatar: AvatarData | null) {
  try {
    if (avatar) localStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
    else localStorage.removeItem(AVATAR_KEY);
  } catch { /* ignore */ }
}

function saveContacts(contacts: Contact[]) {
  try { localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts)); } catch { /* ignore */ }
}

interface AppStore {
  screen: Screen | null;
  gameMode: GameMode;
  avatarData: AvatarData | null;
  mediaItems: MediaItem[];
  contacts: Contact[];
  simpleMode: boolean;
  setScreen: (screen: Screen | null) => void;
  setGameMode: (mode: GameMode) => void;
  setAvatarData: (data: AvatarData | null) => void;
  addMediaItems: (items: MediaItem[]) => void;
  deleteMediaItem: (id: string) => void;
  addContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  setSimpleMode: (val: boolean) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  screen: 'home',
  gameMode: 'names',
  avatarData: loadAvatar(),
  mediaItems: loadItems(),
  contacts: loadContacts(),
  simpleMode: loadSimpleMode(),

  setScreen: (screen) => set({ screen }),

  setGameMode: (gameMode) => set({ gameMode, screen: 'game' }),

  setAvatarData: (avatarData) => {
    saveAvatar(avatarData);
    set({ avatarData });
  },

  addMediaItems: (newItems) => {
    const current = get().mediaItems;
    const hasUserItems = current.some((i) => !i.id.startsWith('default-'));
    const base = hasUserItems ? current : current.filter((i) => i.id.startsWith('default-'));
    const merged = [...base, ...newItems];
    saveItems(merged);
    set({ mediaItems: merged });
  },

  deleteMediaItem: (id) => {
    const updated = get().mediaItems.filter((i) => i.id !== id);
    const final = updated.length === 0 ? DEFAULT_ITEMS : updated;
    saveItems(final);
    set({ mediaItems: final });
  },

  addContact: (contact) => {
    const updated = [...get().contacts, contact];
    saveContacts(updated);
    set({ contacts: updated });
  },

  deleteContact: (id) => {
    const updated = get().contacts.filter((c) => c.id !== id);
    saveContacts(updated);
    set({ contacts: updated });
  },

  setSimpleMode: (val) => {
    localStorage.setItem(SIMPLE_MODE_KEY, String(val));
    set({ simpleMode: val });
  },
}));
