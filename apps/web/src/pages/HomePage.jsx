import { useState, useEffect, useRef } from 'react';
import { Users, Shield, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

function TypeWriter({
  text,
  typeSpeed = 38,
  deleteSpeed = 18,
  pauseAfterType = 1800,
  pauseAfterDelete = 500,
}) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    let timeout;
    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pause-full'), pauseAfterType);
      }
    } else if (phase === 'pause-full') {
      timeout = setTimeout(() => setPhase('deleting'), pauseAfterDelete);
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pause-empty'), pauseAfterDelete);
      }
    } else if (phase === 'pause-empty') {
      timeout = setTimeout(() => setPhase('typing'), pauseAfterDelete);
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  return <span className="typing-text">{displayed}&nbsp;</span>;
}

const TOTAL_FRAMES = 300;
const FRAME_DIR = '/images/ezgif-71b2b3261ea4ced2-jpg';
const APP_GREEN = 'var(--app-green, #22c55e)';
const HEADING = ['Harnessing Community on', 'Resource-based Outreach (HACRO) Hub'];

const getFrameUrl = (index) =>
  `${FRAME_DIR}/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

const EDITORIAL_SECTIONS = [
  {
    headerLine1: 'Harnessing Community on Resource-base ',
    headerLine2: 'Outreach (HACRO) Hub',
    nextPage: '/CommunityFinancialEmpowermentPage',
    paragraphs: [
      'The relationship of community and sustainable outreach inspires our core work. Using collaborative programs and transparent digital tools, we establish a sustainable rhythm for community growth.',
      'HACRO Hub is dedicated to empowering local populations through financial inclusion, regenerative agriculture, gender equality, and collaborative resource sharing to build a resilient future.',
    ],
    textPosition: 'right',
  },
  {
    headerLine1: 'OUR',
    headerLine2: 'MISSION',
    nextPage: '/CommunityFinancialEmpowermentPage',
    paragraphs: [
      'Fostering member-owned savings groups, micro-loans, and economic resilience across regions through transparent, accessible, and scalable digital systems.',
      'We believe that empowering individuals at the grassroots level creates a ripple effect of self-reliance, innovation, and shared prosperity.',
    ],
    textPosition: 'left',
  },
  {
    headerLine1: 'REGENERATIVE',
    headerLine2: 'AGRIBUSINESS',
    nextPage: '/CommunityFinancialEmpowermentPage',
    paragraphs: [
      'Supporting regenerative agriculture practices, food security, and environmental stewardship to build resilient ecosystems for future generations.',
      'Connecting farmers with resources, knowledge, and modern tools to maximize crop yields while preserving biodiversity and soil health.',
    ],
    textPosition: 'offset',
  },
  {
    headerLine1: 'GENDER',
    headerLine2: 'EQUALITY',
    nextPage: '/GenderEqualityAndInclusionPage',
    paragraphs: [
      'Promoting inclusive financial participation, leadership opportunities, and equal rights for women and youth across all community programs.',
      'Ensuring every voice is heard and every member has equal access to financial tools and decision-making power.',
    ],
    textPosition: 'left',
  },
  {
    headerLine1: 'JOIN THE',
    headerLine2: 'ECOSYSTEM',
    nextPage: '/GenderEqualityAndInclusionPage',
    paragraphs: [
      'Explore our initiatives, become a member, or partner with us to drive meaningful, lasting transformation across communities.',
      'Together, we harness community strength to build self-sustaining socio-economic solutions.',
    ],
    textPosition: 'right',
  },
];

export default function HomePage() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef({ current: 0, target: 0 });
  const animFrameIdRef = useRef(null);

  const [currentProgress, setCurrentProgress] = useState(0);
  const lastProgressRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const images = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      images.push(img);
    }
    imagesRef.current = images;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(frameRef.current.current);
    };

    const renderFrame = (frameIndex) => {
      if (!canvas || !ctx) return;
      const idx = Math.min(Math.max(Math.round(frameIndex), 0), TOTAL_FRAMES - 1);
      const img = imagesRef.current[idx];

      const cw = canvas.width;
      const ch = canvas.height;

      if (img && img.complete && img.naturalWidth > 0) {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const cx = (cw - nw) / 2;
        const cy = (ch - nh) / 2;

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, cx, cy, nw, nh);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, cw, ch);
        if (img) {
          img.onload = () => {
            if (isMounted) renderFrame(frameRef.current.current);
          };
        }
      }
    };

    const updateTargetFrame = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      frameRef.current.target = progress * (TOTAL_FRAMES - 1);
    };

    const animate = () => {
      if (!isMounted) return;

      const { current, target } = frameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        frameRef.current.current += diff * 0.15;
        renderFrame(frameRef.current.current);
      } else if (current !== target) {
        frameRef.current.current = target;
        renderFrame(target);
      }

      const newProgress = frameRef.current.current / (TOTAL_FRAMES - 1);
      if (Math.abs(newProgress - lastProgressRef.current) > 0.0005) {
        lastProgressRef.current = newProgress;
        setCurrentProgress(newProgress);
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateTargetFrame, { passive: true });

    handleResize();
    updateTargetFrame();
    renderFrame(0);

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateTargetFrame);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  const getStepStyle = (index, totalSteps, progress) => {
    const stepCenter = (index + 0.5) / totalSteps;
    const dist = Math.abs(progress - stepCenter);
    const range = 0.14;

    let opacity = 0;
    if (dist < range) {
      opacity = Math.cos((dist / range) * (Math.PI / 2));
      opacity = Math.pow(opacity, 1.5);
    }

    const translateY = (1 - opacity) * 24;

    return {
      opacity,
      transform: `translate(-50%, calc(-50% + ${translateY}px))`,
      visibility: opacity > 0.01 ? 'visible' : 'hidden',
      pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      transition: 'opacity 0.16s ease-out, transform 0.16s ease-out',
    };
  };

  return (
    <>
      <Header />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        .font-dm-sans {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          height: '600vh',
          backgroundColor: '#000',
          position: 'relative',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center px-4 sm:px-12 z-20 font-dm-sans">
            <div className="relative max-w-4xl w-full min-h-[450px]">
              {EDITORIAL_SECTIONS.map((section, index) => {
                const style = getStepStyle(index, EDITORIAL_SECTIONS.length, currentProgress);

                return (
                  <div
                    key={index}
                    style={style}
                    className="absolute left-1/2 top-1/2 w-full max-w-4xl px-4 sm:px-8 text-white drop-shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
                  >
                    <div
                      className="w-full h-[1px] mb-6 sm:mb-8"
                      style={{ backgroundColor: 'rgba(34,197,94,0.35)' }}
                    />

                    <div className="flex flex-col gap-3 mb-6">
                      <div className="inline-flex items-center gap-3">
                        <span
                          className="text-sm tracking-[0.4em] uppercase"
                          style={{ color: APP_GREEN }}
                        >
                          {section.leadText}
                        </span>
                        <span
                          className="flex-1 h-px"
                          style={{ backgroundColor: 'rgba(34,197,94,0.18)' }}
                        />
                      </div>

                      <div className="space-y-2">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[-0.04em] text-white">
                          {section.headerLine1}
                        </h1>
                        {section.headerLine2 && (
                          <h2
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[-0.04em]"
                            style={{ color: APP_GREEN }}
                          >
                            {section.headerLine2}
                          </h2>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
                      <div
                        className={`${
                          section.textPosition === 'right'
                            ? 'md:col-span-7 md:col-start-6'
                            : section.textPosition === 'offset'
                            ? 'md:col-span-7 md:col-start-3'
                            : 'md:col-span-7 md:col-start-1'
                        }`}
                        style={{ backgroundColor: 'rgba(34,197,94,0.18)' }}
                      >
                        <p
                          className="text-sm sm:text-base font-semibold uppercase tracking-[0.24em] mb-4"
                          style={{ color: APP_GREEN }}
                        >
                          {section.leadText}
                        </p>
                        {section.paragraphs.map((p, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-sm sm:text-base leading-relaxed text-slate-100/95 mb-4"
                          >
                            {p}
                          </p>
                        ))}
                        {section.nextPage && (
                          <div className="mt-8">
                            <a
                              href={section.nextPage}
                              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold uppercase tracking-[0.32em] text-[var(--app-green,#22c55e)] hover:text-white"
                              style={{ textDecoration: 'none' }}
                            >
                              HACRO Hub
                              <span aria-hidden="true">→</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 min-h-[75vh] flex flex-col justify-between bg-secondary">
        <Footer className="mt-0 min-h-[75vh] flex flex-col justify-between" />
      </div>
    </>
  );
}