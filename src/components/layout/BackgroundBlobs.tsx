import React, { useEffect, useRef, useState } from 'react';

/**
 * DnaBackground (BackgroundBlobs)
 * High-performance 60fps Canvas DNA Double Helix Animation
 * Features White & Green nucleotide strands, hydrogen rungs,
 * depth-sorted 3D perspective projection, and ambient bio-particles.
 */
export const BackgroundBlobs: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLowPower] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Handle high DPI displays
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Floating ambient bio-particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      pulsePhase: number;
    }

    const particleCount = 42;
    const particles: Particle[] = [];
    const colors = [
      '#FFFFFF',
      '#18A66A',
      '#34D399',
      '#A7F3D0',
      '#10B981',
      '#E6FFFA'
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Animation Loop
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      time += delta * 1.05;

      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------------
      // 1. Draw Floating Ambient Bio-particles
      // ----------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.pulsePhase) * 0.15;
        p.pulsePhase += delta * 1.5;

        // Wrap around viewport
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulsePhase));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.shadowColor = p.color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(24, 166, 106, 0.6)';
        ctx.shadowBlur = p.size * 2.5;
        ctx.fill();
        ctx.restore();
      }

      // ----------------------------------------------------
      // 2. DNA Strands Setup (Dual Helices: Primary + Secondary)
      // ----------------------------------------------------
      // Primary DNA Double Helix: positioned gracefully on the right/center
      // Secondary subtle DNA Helix: positioned delicately on the left
      const helices = [
        {
          // Primary Helix (Right/Center-right)
          centerX: width > 1024 ? width * 0.82 : width * 0.88,
          radius: Math.min(width * 0.14, 85),
          stepY: 28, // Vertical spacing between base pairs
          frequency: 0.016, // Twist frequency along vertical axis
          speed: 1.25, // Rotation speed
          curveAmp: 30, // Gentle undulation curve
          curveFreq: 0.003,
          tiltAngle: 0.08, // Subtle tilt
          alphaFactor: 1.0,
          scale: 1.0
        },
        {
          // Secondary Helix (Ambient Left-side)
          centerX: width > 1024 ? width * 0.12 : width * 0.08,
          radius: Math.min(width * 0.09, 50),
          stepY: 34,
          frequency: 0.014,
          speed: -0.95, // Counter-rotation
          curveAmp: 20,
          curveFreq: 0.0025,
          tiltAngle: -0.06,
          alphaFactor: 0.45, // Soft ambient layer
          scale: 0.75
        }
      ];

      helices.forEach((helix) => {
        const { centerX, radius, stepY, frequency, speed, curveAmp, curveFreq, tiltAngle, alphaFactor, scale } = helix;
        const totalSteps = Math.ceil(height / stepY) + 6;

        // Base pairs collection for depth sorting
        interface BasePair {
          y: number;
          // Strand A (Green)
          x1: number;
          z1: number;
          // Strand B (White)
          x2: number;
          z2: number;
          // Depth index for ordering
          avgZ: number;
          phase: number;
        }

        const basePairs: BasePair[] = [];

        for (let i = -3; i < totalSteps; i++) {
          const y = i * stepY;
          // Curve of the spine
          const spineOffset = Math.sin(y * curveFreq + time * 0.4) * curveAmp;
          const tiltOffset = (y - height / 2) * tiltAngle;
          const currentCenterX = centerX + spineOffset + tiltOffset;

          const angle = y * frequency + time * speed;

          // 3D coordinates
          const x1 = currentCenterX + Math.cos(angle) * radius;
          const z1 = Math.sin(angle) * radius;

          const x2 = currentCenterX + Math.cos(angle + Math.PI) * radius;
          const z2 = Math.sin(angle + Math.PI) * radius;

          basePairs.push({
            y,
            x1,
            z1,
            x2,
            z2,
            avgZ: (z1 + z2) / 2,
            phase: angle
          });
        }

        // Draw connecting backbone ribbons between consecutive nodes
        for (let i = 0; i < basePairs.length - 1; i++) {
          const bp1 = basePairs[i];
          const bp2 = basePairs[i + 1];

          // Ribbon 1: Strand A (Green)
          const zNormA = (bp1.z1 + radius) / (radius * 2);
          ctx.beginPath();
          ctx.moveTo(bp1.x1, bp1.y);
          ctx.lineTo(bp2.x1, bp2.y);
          ctx.strokeStyle = `rgba(24, 166, 106, ${Math.max(0.12, zNormA * 0.45 * alphaFactor)})`;
          ctx.lineWidth = Math.max(1.2, (1.2 + zNormA * 2.2) * scale);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Ribbon 2: Strand B (White)
          const zNormB = (bp1.z2 + radius) / (radius * 2);
          ctx.beginPath();
          ctx.moveTo(bp1.x2, bp1.y);
          ctx.lineTo(bp2.x2, bp2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.2, zNormB * 0.65 * alphaFactor)})`;
          ctx.lineWidth = Math.max(1.2, (1.2 + zNormB * 2.2) * scale);
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Depth Sort & Render Base Pairs (Rungs + Nucleotide Nodes)
        basePairs.forEach((bp) => {
          const zNorm1 = (bp.z1 + radius) / (radius * 2); // 0 (back) to 1 (front)
          const zNorm2 = (bp.z2 + radius) / (radius * 2);

          const node1InFront = bp.z1 > bp.z2;

          // Helper to draw a node
          const drawNode = (x: number, y: number, zNorm: number, isGreen: boolean) => {
            const nodeRadius = (3.2 + zNorm * 3.8) * scale;
            const opacity = (0.3 + zNorm * 0.7) * alphaFactor;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);

            if (isGreen) {
              // Emerald Green Nucleotide
              const grad = ctx.createRadialGradient(
                x - nodeRadius * 0.3,
                y - nodeRadius * 0.3,
                nodeRadius * 0.1,
                x,
                y,
                nodeRadius
              );
              grad.addColorStop(0, '#A7F3D0');
              grad.addColorStop(0.4, '#18A66A');
              grad.addColorStop(1, '#0F7F51');
              ctx.fillStyle = grad;
              ctx.globalAlpha = opacity;
              ctx.shadowColor = 'rgba(24, 166, 106, 0.7)';
              ctx.shadowBlur = nodeRadius * 2.5;
            } else {
              // Luminous White Nucleotide
              const grad = ctx.createRadialGradient(
                x - nodeRadius * 0.2,
                y - nodeRadius * 0.2,
                nodeRadius * 0.1,
                x,
                y,
                nodeRadius
              );
              grad.addColorStop(0, '#FFFFFF');
              grad.addColorStop(0.6, '#F8FAFC');
              grad.addColorStop(1, '#E2E8F0');
              ctx.fillStyle = grad;
              ctx.globalAlpha = opacity;
              ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
              ctx.shadowBlur = nodeRadius * 2.5;
            }

            ctx.fill();

            // Subtle outer highlight ring
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = isGreen ? 'rgba(255, 255, 255, 0.4)' : 'rgba(24, 166, 106, 0.3)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.restore();
          };

          // 1. Draw back node first
          if (node1InFront) {
            // Node 2 (White) is behind
            drawNode(bp.x2, bp.y, zNorm2, false);
          } else {
            // Node 1 (Green) is behind
            drawNode(bp.x1, bp.y, zNorm1, true);
          }

          // 2. Draw Connecting Horizontal Base-Pair Rung
          const midX = (bp.x1 + bp.x2) / 2;
          const avgZNorm = (zNorm1 + zNorm2) / 2;
          const rungOpacity = (0.2 + avgZNorm * 0.55) * alphaFactor;

          // Rung line with gradient: Green on Strand A half, White on Strand B half
          ctx.save();
          const rungGrad = ctx.createLinearGradient(bp.x1, bp.y, bp.x2, bp.y);
          rungGrad.addColorStop(0, 'rgba(24, 166, 106, 0.9)');
          rungGrad.addColorStop(0.45, 'rgba(52, 211, 153, 0.7)');
          rungGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.8)');
          rungGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

          ctx.beginPath();
          ctx.moveTo(bp.x1, bp.y);
          ctx.lineTo(bp.x2, bp.y);
          ctx.strokeStyle = rungGrad;
          ctx.lineWidth = Math.max(1.0, (1.2 + avgZNorm * 2.0) * scale);
          ctx.globalAlpha = rungOpacity;
          ctx.shadowColor = 'rgba(24, 166, 106, 0.4)';
          ctx.shadowBlur = 4;
          ctx.stroke();

          // Hydrogen bond bead at center
          const beadRadius = (1.6 + avgZNorm * 1.5) * scale;
          ctx.beginPath();
          ctx.arc(midX, bp.y, beadRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = (0.4 + avgZNorm * 0.6) * alphaFactor;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.restore();

          // 3. Draw front node last
          if (node1InFront) {
            // Node 1 (Green) is in front
            drawNode(bp.x1, bp.y, zNorm1, true);
          } else {
            // Node 2 (White) is in front
            drawNode(bp.x2, bp.y, zNorm2, false);
          }
        });
      });

      if (!isLowPower) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause rendering when page is hidden to preserve battery/CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLowPower]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {/* Ambient Gradient Foundation: Mint & Soft Emerald Glow */}
      <div 
        className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-200/25 via-[#EAFFF4]/40 to-transparent blur-3xl" 
      />
      <div 
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#EAFFF4]/50 via-emerald-100/30 to-emerald-200/20 blur-3xl" 
      />
      <div 
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-emerald-100/30 via-teal-50/20 to-transparent blur-3xl" 
      />

      {/* Subtle Medical Grid Matrix */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#18A66A_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.03]" 
      />

      {/* High-Performance 60fps DNA Double Helix Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
};
