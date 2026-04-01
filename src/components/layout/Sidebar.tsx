import { useAppStore } from '../../store/useAppStore';
import type { GameMode, Screen } from '../../types';

interface NavItem {
  label: string;
  icon: string;
  action: () => void;
  isActive: (screen: Screen | null, mode: GameMode) => boolean;
  simpleOnly?: boolean;
}

export function Sidebar() {
  const { screen, gameMode, setScreen, setGameMode, simpleMode, setSimpleMode } = useAppStore();

  const allNavItems: NavItem[] = [
    {
      label: 'בית',
      icon: '🏠',
      action: () => setScreen('home'),
      isActive: (s) => s === 'home',
    },
    {
      label: 'שמות ותמונות',
      icon: '👤',
      action: () => setGameMode('names'),
      isActive: (s, m) => s === 'game' && m === 'names',
    },
    {
      label: 'תמונות ואירועים',
      icon: '📅',
      action: () => setGameMode('events'),
      isActive: (s, m) => s === 'game' && m === 'events',
    },
    {
      label: 'תמונות ומשפחות',
      icon: '👨‍👩‍👧',
      action: () => setGameMode('families'),
      isActive: (s, m) => s === 'game' && m === 'families',
    },
    {
      label: 'סדר כרונולוגי',
      icon: '📆',
      action: () => setGameMode('chronological'),
      isActive: (s, m) => s === 'game' && m === 'chronological',
    },
    {
      label: 'גלריה',
      icon: '🖼️',
      action: () => setScreen('gallery'),
      isActive: (s) => s === 'gallery',
    },
    {
      label: 'אנשי קשר',
      icon: '👥',
      action: () => setScreen('contacts'),
      isActive: (s) => s === 'contacts',
    },
    {
      label: 'טיפים',
      icon: '💡',
      action: () => setScreen('tips'),
      isActive: (s) => s === 'tips',
    },
    {
      label: 'שאלות',
      icon: '❓',
      action: () => setScreen('questions'),
      isActive: (s) => s === 'questions',
    },
    {
      label: 'ניהול תמונות',
      icon: '📤',
      action: () => setScreen('upload'),
      isActive: (s) => s === 'upload',
    },
  ];

  const simpleModeItems: NavItem[] = [
    {
      label: 'בית',
      icon: '🏠',
      action: () => setScreen('home'),
      isActive: (s) => s === 'home',
    },
    {
      label: 'משחק',
      icon: '🎮',
      action: () => setGameMode('names'),
      isActive: (s) => s === 'game',
    },
    {
      label: 'גלריה',
      icon: '🖼️',
      action: () => setScreen('gallery'),
      isActive: (s) => s === 'gallery',
    },
    {
      label: 'אנשי קשר',
      icon: '👥',
      action: () => setScreen('contacts'),
      isActive: (s) => s === 'contacts',
    },
    {
      label: 'טיפים',
      icon: '💡',
      action: () => setScreen('tips'),
      isActive: (s) => s === 'tips',
    },
    {
      label: 'שאלות',
      icon: '❓',
      action: () => setScreen('questions'),
      isActive: (s) => s === 'questions',
    },
  ];

  const navItems = simpleMode ? simpleModeItems : allNavItems;

  return (
    <aside
      className="flex-shrink-0 flex flex-col"
      style={{
        width: simpleMode ? 220 : 260,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)',
      }}
    >
      {/* Header */}
      <div className="px-5 py-7 border-b border-green-600">
        <button
          onClick={() => setScreen('home')}
          className="bg-transparent border-none cursor-pointer text-right w-full p-0"
        >
          <div className="text-white text-2xl font-black leading-tight">🧠 משחק זיכרון</div>
          <div className="text-green-200 text-sm mt-1 font-medium">לשמירה על הזיכרון</div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.isActive(screen, gameMode);
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={[
                'w-full flex items-center gap-3 px-5 text-right transition-all duration-150 cursor-pointer border-none outline-none',
                simpleMode ? 'min-h-[72px] text-[1.15rem]' : 'min-h-[60px] text-[1.05rem]',
                'font-bold',
                active
                  ? 'bg-white text-primary shadow-strong'
                  : 'bg-transparent text-white hover:bg-green-700',
              ].join(' ')}
            >
              <span className={simpleMode ? 'text-3xl flex-shrink-0' : 'text-2xl flex-shrink-0'}>
                {item.icon}
              </span>
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Simple Mode Toggle */}
      <div className="px-4 py-4 border-t border-green-600">
        <button
          onClick={() => setSimpleMode(!simpleMode)}
          className={[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-base cursor-pointer border-2 transition-all',
            simpleMode
              ? 'bg-white text-primary border-white'
              : 'bg-transparent text-green-200 border-green-500 hover:bg-green-700',
          ].join(' ')}
        >
          {simpleMode ? '🔍 מצב מלא' : '🔠 מצב פשוט'}
        </button>
        {!simpleMode && (
          <p className="text-green-400 text-xs text-center mt-2">
            פותח לסיוע לאוכלוסייה המבוגרת
          </p>
        )}
      </div>
    </aside>
  );
}
