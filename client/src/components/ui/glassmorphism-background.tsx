import React, { useEffect, useRef } from 'react';

const GlassmorphismBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full viewport size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Circle parameters
    const circleCount = 20;
    const circles: Circle[] = [];

    interface Circle {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
    }

    // Create random circles
    for (let i = 0; i < circleCount; i++) {
      const radius = Math.random() * 100 + 50;
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: getRandomColor(0.1),
      });
    }

    function getRandomColor(opacity: number) {
      const hue = Math.floor(Math.random() * 360);
      return `hsla(${hue}, 70%, 60%, ${opacity})`;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const circle of circles) {
        // Draw gradient circle
        const gradient = ctx.createRadialGradient(
          circle.x, circle.y, 0,
          circle.x, circle.y, circle.radius
        );
        gradient.addColorStop(0, circle.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Move circle
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Bounce off edges
        if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
          circle.dx = -circle.dx;
        }
        if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
          circle.dy = -circle.dy;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default GlassmorphismBackground;