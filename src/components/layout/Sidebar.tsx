import { useAppStore } from '../../store/useAppStore';
import type { GameMode, Screen } from '../../types';

interface NavItem {
  label: string;
  icon: string;
  action: () => void;
  isActive: (screen: Screen | null, mode: GameMode) => boolean;
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { screen, gameMode, setScreen, setGameMode, simpleMode, setSimpleMode } = useAppStore();

  const wrap = (fn: () => void) => () => { fn(); onNavigate?.(); };

  const allNavItems: NavItem[] = [
    {
      label: 'בית',
      icon: '🏠',
      action: wrap(() => setScreen('home')),
      isActive: (s) => s === 'home',
    },
    {
      label: 'שמות ותמונות',
      icon: '👤',
      action: wrap(() => setGameMode('names')),
      isActive: (s, m) => s === 'game' && m === 'names',
    },
    {
      label: 'תמונות ואירועים',
      icon: '📅',
      action: wrap(() => setGameMode('events')),
      isActive: (s, m) => s === 'game' && m === 'events',
    },
    {
      label: 'תמונות ומשפחות',
      icon: '👨‍👩‍👧',
      action: wrap(() => setGameMode('families')),
      isActive: (s, m) => s === 'game' && m === 'families',
    },
    {
      label: 'סדר כרונולוגי',
      icon: '📆',
      action: wrap(() => setGameMode('chronological')),
      isActive: (s, m) => s === 'game' && m === 'chronological',
    },
    {
      label: 'גלריה',
      icon: '🖼️',
      action: wrap(() => setScreen('gallery')),
      isActive: (s) => s === 'gallery',
    },
    {
      label: 'אנשי קשר',
      icon: '👥',
      action: wrap(() => setScreen('contacts')),
      isActive: (s) => s === 'contacts',
    },
    {
      label: 'טיפים',
      icon: '💡',
      action: wrap(() => setScreen('tips')),
      isActive: (s) => s === 'tips',
    },
    {
      label: 'שאלות',
      icon: '❓',
      action: wrap(() => setScreen('questions')),
      isActive: (s) => s === 'questions',
    },
    {
      label: 'ניהול תמונות',
      icon: '📤',
      action: wrap(() => setScreen('upload')),
      isActive: (s) => s === 'upload',
    },
  ];

  const simpleModeItems: NavItem[] = [
    {
      label: 'בית',
      icon: '🏠',
      action: wrap(() => setScreen('home')),
      isActive: (s) => s === 'home',
    },
    {
      label: 'משחק',
      icon: '🎮',
      action: wrap(() => setGameMode('names')),
      isActive: (s) => s === 'game',
    },
    {
      label: 'גלריה',
      icon: '🖼️',
      action: wrap(() => setScreen('gallery')),
      isActive: (s) => s === 'gallery',
    },
    {
      label: 'אנשי קשר',
      icon: '👥',
      action: wrap(() => setScreen('contacts')),
      isActive: (s) => s === 'contacts',
    },
    {
      label: 'טיפים',
      icon: '💡',
      action: wrap(() => setScreen('tips')),
      isActive: (s) => s === 'tips',
    },
    {
      label: 'שאלות',
      icon: '❓',
      action: wrap(() => setScreen('questions')),
      isActive: (s) => s === 'questions',
    },
  ];

  const navItems = simpleMode ? simpleModeItems : allNavItems;

  return (
    <aside
      className="flex flex-col h-full min-h-screen"
      style={{
        width: 264,
        background: 'linear-gradient(180deg, #1B5E20 0%, #145218 100%)',
      }}
      aria-label="תפריט ראשי"
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-green-700">
        <button
          onClick={wrap(() => setScreen('home'))}
          className="bg-transparent border-none cursor-pointer text-right w-full p-0 min-h-0"
          aria-label="עמוד הבית"
        >
          <div className="text-white text-2xl font-black leading-tight">🧠 משחק זיכרון</div>
          <div className="text-green-300 text-base mt-1 font-medium">לשיפור החשיבה והזיכרון</div>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="ניווט">
        {navItems.map((item) => {
          const active = item.isActive(screen, gameMode);
          return (
            <button
              key={item.label}
              onClick={item.action}
              aria-current={active ? 'page' : undefined}
              className={[
                'w-full flex items-center gap-4 px-6 text-right',
                'transition-all duration-150 cursor-pointer border-none outline-none',
                'min-h-[68px] text-xl font-bold',
                active
                  ? 'bg-white text-primary'
                  : 'bg-transparent text-white hover:bg-green-800',
              ].join(' ')}
            >
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.icon}</span>
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Simple mode toggle */}
      <div className="px-5 py-5 border-t border-green-700 space-y-2">
        <button
          onClick={() => setSimpleMode(!simpleMode)}
          className={[
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl',
            'font-bold text-lg cursor-pointer border-2 transition-all min-h-[56px]',
            simpleMode
              ? 'bg-white text-primary border-white'
              : 'bg-transparent text-green-200 border-green-500 hover:bg-green-800',
          ].join(' ')}
          aria-pressed={simpleMode}
        >
          {simpleMode ? '🔍 מצב מלא' : '🔠 מצב פשוט'}
        </button>
        <p className="text-green-400 text-sm text-center">פותח לסיוע לאוכלוסייה המבוגרת</p>
      </div>
    </aside>
  );
}
