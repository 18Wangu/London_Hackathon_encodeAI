import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface FrenchConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const FrenchConfetti: React.FC<FrenchConfettiProps> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    // Create a confetti canvas that covers the entire screen
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    // French flag colors
    const blueColor = { hex: '#0055A4' }; // French blue
    const whiteColor = { hex: '#FFFFFF' }; // White
    const redColor = { hex: '#EF4135' }; // French red

    // Function to fire confetti with French flag colors
    const fireFrenchConfetti = () => {
      // Blue confetti (left side)
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.2, y: 0.5 },
        colors: [blueColor.hex],
        angle: 60,
        startVelocity: 60,
        gravity: 0.8,
        ticks: 300
      });

      // White confetti (middle)
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: [whiteColor.hex],
        angle: 90,
        startVelocity: 60,
        gravity: 0.8,
        ticks: 300
      });

      // Red confetti (right side)
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.8, y: 0.5 },
        colors: [redColor.hex],
        angle: 120,
        startVelocity: 60,
        gravity: 0.8,
        ticks: 300
      });
    };

    // Initial burst
    fireFrenchConfetti();

    // Continue with smaller bursts for a few seconds
    let count = 0;
    const interval = setInterval(() => {
      if (count < 3) {
        fireFrenchConfetti();
        count++;
      } else {
        clearInterval(interval);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }
    }, 700);

    return () => {
      clearInterval(interval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${active ? 'block' : 'hidden'}`}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default FrenchConfetti;
