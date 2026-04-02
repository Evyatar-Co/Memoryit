import { useAppStore } from '../../store/useAppStore';

export function BottomNav() {
  const { screen, gameMode, setScreen, setGameMode } = useAppStore();

  const items = [
    {
      label: 'בית',
      icon: '🏠',
      action: () => setScreen('home'),
      active: screen === 'home',
    },
    {
      label: 'משחק',
      icon: '🎮',
      action: () => setGameMode('names'),
      active: screen === 'game',
    },
    {
      label: 'גלריה',
      icon: '🖼️',
      action: () => setScreen('gallery'),
      active: screen === 'gallery',
    },
    {
      label: 'קשר',
      icon: '👥',
      action: () => setScreen('contacts'),
      active: screen === 'contacts',
    },
    {
      label: 'עוד',
      icon: '⋯',
      action: () => setScreen('tips'),
      active: screen === 'tips' || screen === 'questions' || screen === 'upload',
    },
  ];

  return (
    <nav
      aria-label="ניווט תחתון"
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 40,
        background: '#ffffff',
        borderTop: '2px solid #D1D5DB',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          aria-current={item.active ? 'page' : undefined}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingTop: 10,
            paddingBottom: 10,
            minHeight: 68,
            background: item.active ? '#E8F5E9' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: item.active ? '#1B5E20' : '#374151',
            fontWeight: 700,
            fontFamily: "'Heebo', sans-serif",
          }}
        >
          <span style={{ fontSize: 26, lineHeight: 1 }}>{item.icon}</span>
          <span style={{ fontSize: 13, lineHeight: 1 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
