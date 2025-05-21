"use client";
import { useEffect, useRef } from "react";

interface GlassmorphismBackgroundProps {
  intensity?: number;
  colorStart?: string;
  colorEnd?: string;
  speed?: number;
}

export default function GlassmorphismBackground({
  intensity = 0.3,
  colorStart = "rgba(156, 39, 176, 0.2)",
  colorEnd = "rgba(25, 118, 210, 0.2)",
  speed = 0.01
}: GlassmorphismBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const circles: Circle[] = [];
    const numCircles = 15;
    const maxRadius = 150;

    for (let i = 0; i < numCircles; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * maxRadius + 20,
        dx: (Math.random() - 0.5) * speed,
        dy: (Math.random() - 0.5) * speed,
        color: getRandomColor()
      });
    }

    function getRandomColor() {
      const colors = [
        "rgba(156, 39, 176, 0.2)",
        "rgba(25, 118, 210, 0.2)",
        "rgba(76, 175, 80, 0.2)",
        "rgba(245, 124, 0, 0.2)",
        "rgba(0, 137, 123, 0.2)"
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawCircle(circle: Circle) {
      if (!ctx || !canvas) return;
      
      const gradient = ctx.createRadialGradient(
        circle.x,
        circle.y,
        0,
        circle.x,
        circle.y,
        circle.radius
      );
      
      gradient.addColorStop(0, circle.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function updateCanvas() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (const circle of circles) {
        // Update position
        circle.x += circle.dx;
        circle.y += circle.dy;
        
        // Bounce off walls
        if (circle.x + circle.radius > canvas.width || circle.x - circle.radius < 0) {
          circle.dx = -circle.dx;
        }
        
        if (circle.y + circle.radius > canvas.height || circle.y - circle.radius < 0) {
          circle.dy = -circle.dy;
        }
        
        drawCircle(circle);
      }
      
      requestAnimationFrame(updateCanvas);
    }

    // Handle window resize
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    updateCanvas();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity, colorStart, colorEnd, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-60"
    />
  );
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
}