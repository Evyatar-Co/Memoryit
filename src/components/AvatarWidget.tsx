import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

interface AvatarWidgetProps {
  speaking?: boolean;
  message?: string;
}

export function AvatarWidget({ speaking = false, message }: AvatarWidgetProps) {
  const { avatarData } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image once
  useEffect(() => {
    if (!avatarData?.img) return;
    const img = new Image();
    img.src = avatarData.img;
    img.onload = () => {
      imgRef.current = img;
    };
  }, [avatarData?.img]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 160;
    const H = 160;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background circle
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, W / 2 - 2, 0, Math.PI * 2);
      ctx.fillStyle = '#E8F5E9';
      ctx.fill();
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (imgRef.current) {
        // Draw image clipped to circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, W / 2 - 4, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgRef.current, 0, 0, W, H);
        ctx.restore();
      } else {
        // Default face emoji
        ctx.font = '80px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧓', W / 2, H / 2);
      }

      // Talking jaw animation
      if (speaking) {
        frameRef.current += 1;
        const jawOpen = Math.abs(Math.sin(frameRef.current * 0.3)) * 14;

        // Draw jaw overlay
        ctx.save();
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, W / 2 - 4, 0, Math.PI * 2);
        ctx.clip();

        // Semi-transparent overlay on lower half to simulate jaw
        const gradient = ctx.createLinearGradient(0, H * 0.6, 0, H);
        gradient.addColorStop(0, `rgba(27, 94, 32, ${jawOpen / 30})`);
        gradient.addColorStop(1, 'rgba(27, 94, 32, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, H * 0.6, W, H * 0.4);

        // Mouth line
        ctx.beginPath();
        ctx.moveTo(W * 0.35, H * 0.68 + jawOpen * 0.3);
        ctx.quadraticCurveTo(W * 0.5, H * 0.68 + jawOpen, W * 0.65, H * 0.68 + jawOpen * 0.3);
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [speaking, avatarData]);

  if (!avatarData && !speaking) return null;

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col items-center gap-2">
      {/* Speech bubble */}
      {message && speaking && (
        <div className="bg-white border-2 border-primary rounded-lg px-4 py-2 shadow-strong max-w-[200px] text-center">
          <p className="text-primary font-bold text-base leading-snug">{message}</p>
          <div className="w-0 h-0 mx-auto mt-1 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="rounded-full shadow-strong border-4 border-primary"
        />
        {avatarData && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-card border border-border-main">
            <span className="text-xs font-bold text-primary">{avatarData.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
