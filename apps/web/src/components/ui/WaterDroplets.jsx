import { useEffect, useRef } from 'react';

export function WaterDroplets() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -9999, y: -9999 };

    class Droplet {
      constructor(scatter = false) { this.reset(scatter); }
      reset(scatter = false) {
        this.x     = Math.random() * width;
        this.y     = scatter ? Math.random() * height : -Math.random() * height * 0.5;
        this.len   = 12 + Math.random() * 22;
        this.speed = 5 + Math.random() * 7;
        this.alpha = 0.25 + Math.random() * 0.5;
        this.thick = 0.8 + Math.random() * 1.4;
        this.vx    = (Math.random() - 0.5) * 0.6;
        this.hit   = false;
      }
      update() {
        const dx   = this.x - mouse.x;
        const dy   = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = ((120 - dist) / 120) * 0.7;
          this.vx += (dx / dist) * force;
        }
        this.vx *= 0.93;
        this.x  += this.vx;
        this.y  += this.speed;
        if (this.x < 0)     this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y - this.len > height) { this.hit = true; this.reset(); }
      }
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x - this.vx * 3, this.y - this.len);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(140, 220, 255, ${this.alpha})`;
        ctx.lineWidth   = this.thick;
        ctx.lineCap     = 'round';
        ctx.stroke();
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.r = 1;
        this.max   = 18 + Math.random() * 24;
        this.alpha = 0.55;
      }
      update() {
        this.r    += 1.2;
        this.alpha = 0.55 * (1 - this.r / this.max);
        return this.r < this.max;
      }
      draw() {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.r, this.r * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(160, 230, 255, ${this.alpha})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    }

    const droplets = Array.from({ length: 180 }, () => new Droplet(true));
    const ripples  = [];

    const onMouseMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onTouchMove  = (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; };
    const onMouseLeave = ()  => { mouse.x = -9999; mouse.y = -9999; };
    const onResize     = ()  => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('touchmove',  onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize',     onResize);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);
      for (const d of droplets) {
        if (d.hit && Math.random() < 0.4) { ripples.push(new Ripple(d.x, height - 4)); d.hit = false; }
        d.update();
        d.draw();
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const alive = ripples[i].update();
        ripples[i].draw();
        if (!alive) ripples.splice(i, 1);
      }
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize',     onResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

export default WaterDroplets;