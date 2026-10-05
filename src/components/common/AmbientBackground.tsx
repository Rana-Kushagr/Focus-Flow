import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface AmbientBackgroundProps {
  variant?: 'aurora' | 'particles' | 'subtle';
  interactive?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for soft parallax
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Floating Ambient Light Orbs
    const isDark = theme === 'dark';
    const orbs = [
      {
        x: width * 0.3,
        y: height * 0.25,
        radius: Math.min(width, height) * 0.45,
        vx: 0.35,
        vy: 0.25,
        color: isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(99, 102, 241, 0.12)', // Electric Indigo
      },
      {
        x: width * 0.7,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.5,
        vx: -0.28,
        vy: 0.32,
        color: isDark ? 'rgba(139, 92, 246, 0.16)' : 'rgba(139, 92, 246, 0.10)', // Violet
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        radius: Math.min(width, height) * 0.4,
        vx: 0.2,
        vy: -0.3,
        color: isDark ? 'rgba(14, 165, 233, 0.14)' : 'rgba(14, 165, 233, 0.08)', // Sky Cyan
      },
      {
        x: width * 0.8,
        y: height * 0.8,
        radius: Math.min(width, height) * 0.35,
        vx: -0.25,
        vy: -0.2,
        color: isDark ? 'rgba(244, 63, 94, 0.10)' : 'rgba(244, 63, 94, 0.06)', // Subtle Rose
      },
    ];

    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render drifting orbs with smooth radial blur
      orbs.forEach((orb, i) => {
        // Natural organic harmonic motion
        orb.x += orb.vx + Math.sin(time + i) * 0.3;
        orb.y += orb.vy + Math.cos(time + i * 1.5) * 0.3;

        // Bounce gently inside canvas bounds
        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        // Mouse subtle magnetic attraction
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseFactor = Math.max(0, 1 - dist / (width * 0.7)) * 0.08;
        const currentX = orb.x + dx * mouseFactor;
        const currentY = orb.y + dy * mouseFactor;

        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          orb.radius
        );

        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, '0.04)'));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, interactive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* HTML5 Canvas Ambient Fluid Aurora */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-90 transition-opacity duration-1000" 
      />

      {/* Engineering Architectural Grid Overlay with Vignette Mask */}
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_80%_70%_at_50%_20%,#000_50%,transparent_100%)] opacity-70 dark:opacity-60" />

      {/* Soft Vignette Edge Dimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.04)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.4)_100%)]" />
    </div>
  );
};
