import { useAppStore } from '../../store/useAppStore';

export function BottomNav() {
  const { screen, gameMode, setScreen, setGameMode } = useAppStore();

  const items = [
    { label: 'בית',    icon: '🏠', action: () => setScreen('home'),      active: screen === 'home' },
    { label: 'משחק',   icon: '🎮', action: () => setGameMode('names'),   active: screen === 'game' },
    { label: 'גלריה',  icon: '🖼️', action: () => setScreen('gallery'),   active: screen === 'gallery' },
    { label: 'קשר',    icon: '👥', action: () => setScreen('contacts'),  active: screen === 'contacts' },
    { label: 'עוד',    icon: '⋯',  action: () => setScreen('tips'),      active: screen === 'tips' || screen === 'questions' || screen === 'upload' },
  ];

  return (
    <nav
      className="fixed bottom-0 right-0 left-0 z-30 bg-surface border-t-2 border-border-main shadow-strong"
      aria-label="ניווט תחתון"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            aria-current={item.active ? 'page' : undefined}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 border-none cursor-pointer transition-all duration-150',
              'text-base font-bold min-h-[64px]',
              item.active
                ? 'bg-primary-light text-primary'
                : 'bg-transparent text-text-sub hover:bg-bg',
            ].join(' ')}
          >
            <span className="text-2xl leading-none">{item.icon}</span>
            <span className="text-sm leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
