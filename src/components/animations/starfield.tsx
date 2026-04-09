"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
  glowRadius: number;
  orbitSpeed: number;
  orbitRadius: number;
  originX: number;
  originY: number;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Generate stars
    const starCount = Math.floor((width * height) / 2500);
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(), // depth: 0 = far, 1 = close
        size: Math.random() * 1.8 + 0.2,
        brightness: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Generate planets
    const planets: Planet[] = [
      {
        x: 0,
        y: 0,
        radius: 12,
        color: "#1a1a2e",
        glowColor: "rgba(100, 100, 180, 0.08)",
        glowRadius: 40,
        orbitSpeed: 0.00003,
        orbitRadius: 30,
        originX: width * 0.85,
        originY: height * 0.2,
      },
      {
        x: 0,
        y: 0,
        radius: 6,
        color: "#1e1e1e",
        glowColor: "rgba(150, 120, 90, 0.06)",
        glowRadius: 20,
        orbitSpeed: 0.00005,
        orbitRadius: 15,
        originX: width * 0.15,
        originY: height * 0.75,
      },
      {
        x: 0,
        y: 0,
        radius: 20,
        color: "#111118",
        glowColor: "rgba(60, 60, 120, 0.05)",
        glowRadius: 60,
        orbitSpeed: 0.00002,
        orbitRadius: 40,
        originX: width * 0.5,
        originY: height * 0.9,
      },
    ];

    // Nebula clouds (subtle colored patches)
    const nebulae = [
      { x: width * 0.7, y: height * 0.3, radius: 200, color: "rgba(40, 20, 80, 0.04)" },
      { x: width * 0.2, y: height * 0.6, radius: 150, color: "rgba(20, 40, 60, 0.03)" },
      { x: width * 0.9, y: height * 0.8, radius: 180, color: "rgba(30, 15, 50, 0.03)" },
    ];

    // Travel speed (stars drift slowly to simulate forward motion)
    const travelSpeed = 0.15;

    function render(time: number) {
      ctx!.clearRect(0, 0, width, height);

      // Draw nebulae (static glow patches)
      for (const neb of nebulae) {
        const gradient = ctx!.createRadialGradient(
          neb.x, neb.y, 0,
          neb.x, neb.y, neb.radius
        );
        gradient.addColorStop(0, neb.color);
        gradient.addColorStop(1, "transparent");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(neb.x - neb.radius, neb.y - neb.radius, neb.radius * 2, neb.radius * 2);
      }

      // Draw and update stars
      for (const star of stars) {
        // Move star toward viewer (travel effect)
        star.y += travelSpeed * (0.3 + star.z * 0.7);
        star.x += (star.x - width / 2) * 0.00008 * star.z;

        // Wrap around
        if (star.y > height + 5) {
          star.y = -5;
          star.x = Math.random() * width;
          star.z = Math.random();
        }
        if (star.x < -5) star.x = width + 5;
        if (star.x > width + 5) star.x = -5;

        // Twinkle
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * (0.6 + 0.4 * twinkle);
        const drawSize = star.size * (0.5 + star.z * 0.5);

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, drawSize, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fill();

        // Larger/closer stars get a subtle glow
        if (star.z > 0.7 && star.size > 1.2) {
          ctx!.beginPath();
          ctx!.arc(star.x, star.y, drawSize * 3, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
          ctx!.fill();
        }
      }

      // Draw planets
      for (const planet of planets) {
        planet.x = planet.originX + Math.cos(time * planet.orbitSpeed) * planet.orbitRadius;
        planet.y = planet.originY + Math.sin(time * planet.orbitSpeed) * planet.orbitRadius;

        // Glow
        const glow = ctx!.createRadialGradient(
          planet.x, planet.y, planet.radius * 0.5,
          planet.x, planet.y, planet.glowRadius
        );
        glow.addColorStop(0, planet.glowColor);
        glow.addColorStop(1, "transparent");
        ctx!.fillStyle = glow;
        ctx!.fillRect(
          planet.x - planet.glowRadius,
          planet.y - planet.glowRadius,
          planet.glowRadius * 2,
          planet.glowRadius * 2
        );

        // Planet body
        ctx!.beginPath();
        ctx!.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx!.fillStyle = planet.color;
        ctx!.fill();

        // Subtle ring on the largest planet
        if (planet.radius > 15) {
          ctx!.beginPath();
          ctx!.ellipse(planet.x, planet.y, planet.radius * 2.2, planet.radius * 0.4, -0.3, 0, Math.PI * 2);
          ctx!.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;

      // Reposition planets on resize
      planets[0].originX = width * 0.85;
      planets[0].originY = height * 0.2;
      planets[1].originX = width * 0.15;
      planets[1].originY = height * 0.75;
      planets[2].originX = width * 0.5;
      planets[2].originY = height * 0.9;

      // Reposition nebulae
      nebulae[0].x = width * 0.7;
      nebulae[0].y = height * 0.3;
      nebulae[1].x = width * 0.2;
      nebulae[1].y = height * 0.6;
      nebulae[2].x = width * 0.9;
      nebulae[2].y = height * 0.8;
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#000" }}
    />
  );
}
