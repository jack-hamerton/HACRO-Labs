import { useState, useEffect, useRef } from 'react';
import { Users, Shield, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { WaterDroplets } from '@/components/ui/WaterDroplets.jsx';

const HERO_IMAGES = [
  'https://i.postimg.cc/J7XRsQ9y/IMG-8869-1.jpg',
  'https://i.postimg.cc/P52ZvHBW/IMG-1064.jpg',
  'https://i.postimg.cc/CMv6VZhm/IMG-0433.jpg',
  'https://i.postimg.cc/sDw6nvXs/0Q4A0683.jpg',
  'https://i.postimg.cc/ydjcV32V/IMG-0458.jpg',
  'https://i.postimg.cc/BZNB3RGY/IMG-0561.jpg',
  'https://i.postimg.cc/6p4rd3Gs/IMG-0572.jpg',
  'https://i.postimg.cc/CKyjJgjK/IMG-0578.jpg',
  'https://i.postimg.cc/fyW7XfYC/IMG-0624.jpg',
];

const HEADING = 'Harnessing Community on Resource‑based Outreach_ (HACRO) Labs';

const BENEFITS = [
  {
    icon: Shield,
    title: 'Community Financial Empowerment Protection',
    description:
      'We are digitizing the chama spirit to build a safety net for everyone. HACRO Labs provides a transparent, secure, and automated platform where communities can pool resources, access fair credit, and grow their wealth together.',
  },
  {
    icon: TrendingUp,
    title: 'Sustainable Agri-Business Growth',
    description:
      'Farming is the backbone of our economy, and we are committed to making it profitable. We equip our members with the skills to transform their harvests through value addition, modern farming techniques, and smarter market access.',
  },
  {
    icon: Award,
    title: 'Environmental Resilience & Stewardship',
    description:
      'True growth respects the land. We empower our members to thrive by adopting eco-friendly practices that reduce reliance on harmful chemicals and preserve our natural heritage.',
  },
];

const TEAM = [
  { name: 'Jack Hamerton',    role: 'Founder & Executive Director / Advisory Chairman' },
  { name: 'Jessy Mala',       role: 'Program Delivery Manager' },
  { name: 'Chrispine Samwel', role: 'Development Gateway Manager' },
  { name: 'Ruth Njeri',       role: 'Community Outreach Coordinator' },
];

function TypeWriter({ text, typeSpeed = 38, deleteSpeed = 18, pauseAfterType = 1800, pauseAfterDelete = 500 }) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase]         = useState('typing');

  useEffect(() => {
    let timeout;
    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pause-full'), pauseAfterType);
      }
    } else if (phase === 'pause-full') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), deleteSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pause-empty'), pauseAfterDelete);
      }
    } else if (phase === 'pause-empty') {
      setPhase('typing');
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  return (
    <>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '3px',
          height: '0.85em',
          background: '#22c55e',
          marginLeft: '2px',
          verticalAlign: 'middle',
          animation: 'blink 0.7s step-end infinite',
        }}
      />
    </>
  );
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState(null);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setPrev(current);
      setFading(true);
      setCurrent((c) => (c + 1) % HERO_IMAGES.length);
      setTimeout(() => { setPrev(null); setFading(false); }, 1800);
    }, 2000);
    return () => clearInterval(id);
  }, [current]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {prev !== null && (
        <div
          key={`prev-${prev}`}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${HERO_IMAGES[prev]})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: fading ? 0 : 1,
            transition: 'opacity 1.8s ease',
          }}
        />
      )}
      <div
        key={`cur-${current}`}
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${HERO_IMAGES[current]})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 1,
          transition: 'opacity 1.8s ease',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/90" />
    </div>
  );
}

function SlideDots() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % HERO_IMAGES.length), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {HERO_IMAGES.map((_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: i === current ? '#22c55e' : 'rgba(255,255,255,0.4)',
            transition: 'background 0.4s',
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <Header />

      {/* Water droplet animation — fixed background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WaterDroplets />
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <HeroSlideshow />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl" style={{ animation: 'fadeUp 0.7s ease forwards' }}>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ letterSpacing: '-0.02em', minHeight: '1.2em' }}
            >
              <TypeWriter text={HEADING} />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-prose">
              HACRO Labs is a non-profit organization dedicated to fostering self-reliance and collective
              prosperity among our community members. By providing the digital tools, training, and resources
              necessary for growth, we empower our community members to turn their potential into scalable
              solutions, ensuring that every financial gain and agricultural harvest contributes to a more
              resilient, sustainable, and thriving community for all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors"
              >
                <span>Register now</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/member-login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-green-500 hover:border-green-500 hover:text-black transition-colors"
              >
                Member login
              </a>
            </div>
          </div>
        </div>

        {HERO_IMAGES.length > 1 && <SlideDots />}
      </section>

      {/* ── How We Work ── */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How We Work</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              At HACRO Labs, we believe that true empowerment is rooted in community. Our membership model is
              built on three core pillars designed to elevate every participant.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/10 hover:border-green-500/30 transition-all duration-200 h-full">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                    <b.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{b.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{b.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.35em] text-green-600">Meet our team</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
              A dedicated team supporting every community member
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              HACRO Labs staff deliver support, digital training, and community outreach so every member can thrive.
            </p>
          </FadeIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.08}>
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 font-semibold text-sm">
                    {member.name.split(' ').map((p) => p[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="/staff"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors"
            >
              Meet our full Team
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-12 border border-green-500/20">
              <div className="max-w-3xl mx-auto text-center">
                <Users className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Join hundreds of community members who have empowered themselves, grown their skills, and
                  uplifted others through HACRO Labs membership.
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors"
                >
                  <span>Create your account</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}