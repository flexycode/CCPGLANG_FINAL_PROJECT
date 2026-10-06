import { useEffect, useRef } from 'react';
import { useTheme } from '../utils/theme';

/**
 * AnimatedBackground — Chess-themed particle/floating piece animation.
 * 
 * Uses HTML5 Canvas for performant rendering of floating chess piece
 * silhouettes with parallax-like depth effect.
 */

interface FloatingPiece {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
  depth: number; // 0-1, affects parallax
}

const CHESS_SYMBOLS = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];

/**
 * Pure function to create a random floating piece.
 */
const createFloatingPiece = (canvasWidth: number, canvasHeight: number): FloatingPiece => ({
  x: Math.random() * canvasWidth,
  y: Math.random() * canvasHeight,
  size: 16 + Math.random() * 32,
  speed: 0.15 + Math.random() * 0.4,
  opacity: 0.03 + Math.random() * 0.08,
  rotation: Math.random() * Math.PI * 2,
  rotationSpeed: (Math.random() - 0.5) * 0.005,
  symbol: CHESS_SYMBOLS[Math.floor(Math.random() * CHESS_SYMBOLS.length)],
  depth: Math.random(),
});

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<FloatingPiece[]>([]);
  const animationRef = useRef<number>(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize floating pieces
    const pieceCount = Math.min(25, Math.floor(window.innerWidth / 60));
    piecesRef.current = Array.from({ length: pieceCount }, () =>
      createFloatingPiece(canvas.width, canvas.height)
    );

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (isDark) {
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.5, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
      } else {
        gradient.addColorStop(0, '#FFFBF4');
        gradient.addColorStop(0.5, '#F5E6D3');
        gradient.addColorStop(1, '#E8D5C4');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating pieces
      piecesRef.current.forEach(piece => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.font = `${piece.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark
          ? `rgba(212, 168, 67, ${piece.opacity})`
          : `rgba(30, 30, 30, ${piece.opacity})`;
        ctx.fillText(piece.symbol, 0, 0);
        ctx.restore();

        // Update position (vertical drift upward)
        piece.y -= piece.speed;
        piece.rotation += piece.rotationSpeed;

        // Wrap around when off screen
        if (piece.y < -piece.size) {
          piece.y = canvas.height + piece.size;
          piece.x = Math.random() * canvas.width;
        }
      });

      // Draw subtle grid pattern (chessboard hint)
      const gridSize = 80;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
