import { useTTS } from '../../hooks/useTTS';

interface TTSButtonProps {
  text: string;
  className?: string;
}

export function TTSButton({ text, className = '' }: TTSButtonProps) {
  const { speak, stop, speaking } = useTTS();

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={speaking ? 'עצור הקראה' : 'הקרא טקסט'}
      className={[
        'rounded-full w-10 h-10 flex items-center justify-center text-lg transition-all duration-150 cursor-pointer border-2',
        speaking
          ? 'bg-accent text-white border-accent shadow-strong'
          : 'bg-white border-border-main text-text-sub hover:bg-bg hover:border-primary',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {speaking ? '⏹' : '🔊'}
    </button>
  );
}
