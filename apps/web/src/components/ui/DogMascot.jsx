import { useEffect, useRef } from 'react';

export default function DogMascot() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({ tick: 0, mouse: { x: -9999, y: -9999 } });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // small fixed canvas anchored bottom-left
    const CSS_WIDTH = 140;
    const CSS_HEIGHT = 120;
    const DPR = window.devicePixelRatio || 1;
    canvas.style.position = 'fixed';
    canvas.style.left = '12px';
    canvas.style.bottom = '12px';
    canvas.style.width = `${CSS_WIDTH}px`;
    canvas.style.height = `${CSS_HEIGHT}px`;
    canvas.style.zIndex = 9999;
    canvas.style.pointerEvents = 'auto';
    canvas.width = Math.round(CSS_WIDTH * DPR);
    canvas.height = Math.round(CSS_HEIGHT * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    function distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function draw(tick) {
      const w = CSS_WIDTH;
      const h = CSS_HEIGHT;
      ctx.clearRect(0, 0, w, h);

      const baseX = 40;
      const baseY = h - 30;
      const phase = tick * 0.06;

      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(baseX + 10, baseY + 18, 30, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // breathing offset
      const bob = Math.sin(phase) * 1.5;

      // body
      ctx.fillStyle = '#dcb77c';
      ctx.beginPath();
      ctx.ellipse(baseX, baseY + bob, 36, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // belly
      ctx.fillStyle = '#fff3e6';
      ctx.beginPath();
      ctx.ellipse(baseX - 2, baseY + 6 + bob, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // head
      const headX = baseX + 36;
      const headY = baseY - 26 + bob;
      ctx.fillStyle = '#dcb77c';
      ctx.beginPath();
      ctx.ellipse(headX, headY, 20, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // ears
      ctx.fillStyle = '#c99763';
      ctx.beginPath();
      ctx.ellipse(headX - 12, headY - 10, 7, 10, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(headX + 12, headY - 10, 7, 10, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // eyes
      ctx.fillStyle = '#2b2b2b';
      ctx.beginPath();
      ctx.arc(headX - 6, headY - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(headX + 4, headY - 4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // nose
      ctx.beginPath();
      ctx.fillStyle = '#2b2b2b';
      ctx.ellipse(headX + 10, headY + 4, 4, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // tail wag responds to hover distance
      const mouse = stateRef.current.mouse;
      const center = { x: baseX, y: baseY };
      const d = distance(mouse, center);
      const near = d < 60;
      const wag = Math.sin(phase * (near ? 6 : 3)) * (near ? 12 : 6);
      ctx.strokeStyle = '#c99763';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(baseX - 26, baseY - 10 + bob);
      ctx.quadraticCurveTo(baseX - 44, baseY - 22 + wag * 0.4, baseX - 54, baseY - 8 + wag);
      ctx.stroke();

      // playful text when near
      if (near) {
        ctx.fillStyle = 'rgba(255,90,60,0.95)';
        ctx.font = '12px sans-serif';
        ctx.fillText('woof!', headX - 8, headY - 26);
      }
    }

    function loop() {
      stateRef.current.tick += 1;
      draw(stateRef.current.tick);
      animRef.current = requestAnimationFrame(loop);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse.x = e.clientX - rect.left;
      stateRef.current.mouse.y = e.clientY - rect.top;
    }

    function onLeave() {
      stateRef.current.mouse = { x: -9999, y: -9999 };
    }

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    loop();

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
