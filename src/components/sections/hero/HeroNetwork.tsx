"use client";

import { useEffect, useRef } from "react";

interface Node {
  bx: number;
  by: number;
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  kind: 0 | 1 | 2; // 0 normal, 1 hub (signal), 2 IA (violet)
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
  color: string;
}

const SIGNAL = "122,157,255";
const CYAN = "63,216,232";
const VIOLET = "157,125,255";

/**
 * Red de nodos conectados: software, datos y automatización en movimiento.
 * Canvas 2D sin dependencias. Se pausa fuera de pantalla y con la pestaña
 * oculta; con prefers-reduced-motion dibuja un único fotograma estático.
 */
export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let linkDist = 150;
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let running = false;
    let lastSpawn = 0;

    // Generador pseudoaleatorio estable: misma composición en cada visita.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 768;
      const count = mobile ? 38 : Math.min(96, Math.round((w * h) / 15000));
      linkDist = mobile ? 118 : 158;
      seed = 7;
      nodes = Array.from({ length: count }, () => {
        // Más densidad a la derecha en escritorio: el titular respira a la izquierda.
        const bias = mobile ? rand() : Math.pow(rand(), 0.55);
        const x = mobile ? rand() * w : w * (0.18 + bias * 0.86);
        const y = rand() * h;
        const k = rand();
        return {
          bx: x,
          by: y,
          x,
          y,
          r: k > 0.93 ? 2.6 : k > 0.86 ? 2.2 : 1.3 + rand() * 0.6,
          phase: rand() * Math.PI * 2,
          speed: 0.00018 + rand() * 0.00028,
          kind: k > 0.93 ? 2 : k > 0.86 ? 1 : 0,
        };
      });
      packets = [];
    }

    function neighbours(i: number) {
      const out: number[] = [];
      const a = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < linkDist * linkDist) out.push(j);
      }
      return out;
    }

    function spawn() {
      if (packets.length > (w < 768 ? 7 : 16)) return;
      const a = Math.floor(rand() * nodes.length);
      const ns = neighbours(a);
      if (!ns.length) return;
      const b = ns[Math.floor(rand() * ns.length)];
      const kinds = [CYAN, CYAN, SIGNAL, VIOLET];
      packets.push({ a, b, t: 0, speed: 0.006 + rand() * 0.008, color: kinds[Math.floor(rand() * kinds.length)] });
    }

    function frame(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // Posición de nodos: deriva lenta + atracción suave del cursor.
      for (const n of nodes) {
        const t = time * n.speed + n.phase;
        let x = n.bx + Math.cos(t) * 14;
        let y = n.by + Math.sin(t * 1.3) * 10;
        if (mouse.active) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const d = Math.hypot(dx, dy);
          if (d < 220) {
            const f = (1 - d / 220) * 0.22;
            x += dx * f;
            y += dy * f;
          }
        }
        n.x = x;
        n.y = y;
      }

      // Conexiones.
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist * linkDist) continue;
          let alpha = (1 - Math.sqrt(d2) / linkDist) * 0.2;
          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            const md = Math.hypot(mx, my);
            if (md < 200) alpha += (1 - md / 200) * 0.32;
          }
          ctx!.strokeStyle = `rgba(${SIGNAL},${alpha})`;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      // Paquetes de datos viajando.
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const tx = a.x + (b.x - a.x) * Math.max(0, p.t - 0.18);
        const ty = a.y + (b.y - a.y) * Math.max(0, p.t - 0.18);
        const grad = ctx!.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${p.color},0)`);
        grad.addColorStop(1, `rgba(${p.color},0.9)`);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.4;
        ctx!.beginPath();
        ctx!.moveTo(tx, ty);
        ctx!.lineTo(x, y);
        ctx!.stroke();
        ctx!.fillStyle = `rgba(${p.color},1)`;
        ctx!.beginPath();
        ctx!.arc(x, y, 1.7, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Nodos.
      for (const n of nodes) {
        if (n.kind > 0) {
          const c = n.kind === 2 ? VIOLET : SIGNAL;
          const pulse = 0.5 + Math.sin(time * 0.002 + n.phase) * 0.5;
          ctx!.strokeStyle = `rgba(${c},${0.25 + pulse * 0.25})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + 4 + pulse * 3, 0, Math.PI * 2);
          ctx!.stroke();
          ctx!.fillStyle = `rgba(${c},0.95)`;
        } else {
          ctx!.fillStyle = "rgba(233,235,239,0.55)";
        }
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduce && time - lastSpawn > 260) {
        spawn();
        lastSpawn = time;
      }
    }

    function loop(time: number) {
      frame(time);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    build();
    if (reduce) frame(0);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      // En móvil la barra del navegador cambia la altura al hacer scroll: solo reconstruimos si cambia el ancho.
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        build();
        if (reduce) frame(0);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
