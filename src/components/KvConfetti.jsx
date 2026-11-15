
import { useEffect, useRef } from "react";

export default function KvConfetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = canvas?.parentElement;

    if (!canvas || !ctx || !container) return;

    let animationId;
    let particles = [];
    let startTime;
    let burstDone = false;
    let animationStarted = false;

    const colors = ["#FFF9ED", "#F5DDAE", "#EBC5C8", "#DCE8EF"];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (!rect.width || !rect.height) return false;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      return true;
    };

    const burst = (x, y, direction) => {
      for (let i = 0; i < 65; i++) {
        const angle =
          direction === "left"
            ? -Math.PI / 3 + Math.random() * (Math.PI * 2 / 3)
            : direction === "right"
              ? Math.PI - Math.PI / 3 + Math.random() * (Math.PI * 2 / 3)
              : Math.random() * Math.PI * 2;

        const speed = Math.random() * 4 + 2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          w: Math.random() * 5 + 5,
          h: Math.random() * 7 + 6,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.12,
          gravity: 0.055 + Math.random() * 0.035,
          sway: Math.random() * 0.8,
          phase: Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
        });
      }
    };

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      if (!burstDone) {
        burst(width * 0.06, height * 0.55, "left");
        burst(width * 0.94, height * 0.55, "right");
        burst(width * 0.5, height * 0.15, "center");
        burstDone = true;
      }

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(elapsed * 0.002 + p.phase) * p.sway;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.993;
        p.rotation += p.spin;

        if (p.y > height * 0.65) p.opacity -= 0.012;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      particles = particles.filter(
        (p) => p.opacity > 0 && p.y < height + 30
      );

      if (elapsed < 6000 && particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    const startAnimation = () => {
      if (animationStarted || !resizeCanvas()) return;

      animationStarted = true;
      animationId = requestAnimationFrame(animate);
    };

    // 等 KV 區塊真正有尺寸後才發射
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => {
        if (!animationStarted) {
          startAnimation();
        } else {
          resizeCanvas();
        }
      });

      observer.observe(container);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    } else {
      startAnimation();

      window.addEventListener("resize", resizeCanvas);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    }
  }, []);

  return <canvas ref={canvasRef} className="kv-confetti" />;
}
