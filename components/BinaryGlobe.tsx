import React, { useEffect, useRef } from 'react';

const BinaryGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let requestID: number;

    // Globe Config
    const GLOBE_RADIUS_BASE = 250;
    const DOT_COUNT = 800;
    const DOT_SIZE = 14;
    const PERSPECTIVE = 800;
    
    // State
    let rotationX = 0;
    let rotationY = 0;
    let scrollY = 0;

    // Points generation (Fibonacci Sphere)
    const points: {x: number, y: number, z: number, val: string}[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    const initPoints = () => {
      points.length = 0;
      for (let i = 0; i < DOT_COUNT; i++) {
        const y = 1 - (i / (DOT_COUNT - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        
        // Random binary value
        const val = Math.random() > 0.5 ? '1' : '0';

        points.push({
          x: Math.cos(theta) * radius,
          y: y,
          z: Math.sin(theta) * radius,
          val
        });
      }
    };
    initPoints();

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const radius = width < 768 ? width * 0.35 : GLOBE_RADIUS_BASE;
      
      // Rotations
      // Auto rotate Y
      rotationY += 0.002; 
      // Scroll affects X rotation (tilt)
      const targetRotationX = scrollY * 0.001;
      rotationX += (targetRotationX - rotationX) * 0.1; // Smooth easing

      // Check theme for color
      const isDark = document.documentElement.classList.contains('dark');
      
      // Draw points
      points.forEach(point => {
        // Scale point by radius
        const px = point.x * radius;
        const py = point.y * radius;
        const pz = point.z * radius;

        // Rotate around Y axis
        let x1 = px * Math.cos(rotationY) - pz * Math.sin(rotationY);
        let z1 = pz * Math.cos(rotationY) + px * Math.sin(rotationY);
        let y1 = py;

        // Rotate around X axis (Tilt)
        let y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = z1 * Math.cos(rotationX) + y1 * Math.sin(rotationX);
        let x2 = x1;

        // Perspective Projection
        // z2 ranges roughly from -radius to +radius
        // We push it back by PERSPECTIVE so camera is outside
        const scale = PERSPECTIVE / (PERSPECTIVE - z2);
        const x2D = width / 2 + x2 * scale;
        const y2D = height / 2 + y2 * scale;

        // Visibility / Alpha based on depth (z2)
        // Points in front (z2 > 0) are more visible
        const alpha = (z2 + radius) / (2 * radius);
        
        if (alpha > 0) {
            // Updated Colors for Light Mode Visibility
            // Light Mode: Darker Green (brand-700) for contrast against white
            // Dark Mode: Bright Green (brand-400) for contrast against black
            const color = isDark 
                ? `rgba(74, 222, 128, ${alpha})` // Brand 400
                : `rgba(21, 128, 61, ${alpha * 0.8})`; // Brand 700 with slight transp fix

            ctx.fillStyle = color;
            ctx.font = `${Math.max(8, DOT_SIZE * scale)}px monospace`;
            ctx.fillText(point.val, x2D, y2D);
        }
      });

      requestID = requestAnimationFrame(animate);
    };
    
    requestID = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestID);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
    />
  );
};

export default BinaryGlobe;