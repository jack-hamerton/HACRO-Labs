import { useState, useEffect, useRef } from 'react';
import { Users, Shield, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { WaterDroplets } from '@/components/ui/WaterDroplets.jsx';

const HERO_IMAGES = [
  'https://i.postimg.cc/J7XRsQ9y/IMG-8869-1.jpg',
  'https://i.postimg.cc/P52ZvHBW/IMG-1064.jpg',
  'https://i.postimg.cc/hj1np6Gj/IMG-0078.jpg',
  'https://i.postimg.cc/sDw6nvXs/0Q4A0683.jpg',
  'https://i.postimg.cc/ydjcV32V/IMG-0458.jpg',
  'https://i.postimg.cc/BZNB3RGY/IMG-0561.jpg',
  'https://i.postimg.cc/MZ9qCkzd/IMG-0479.jpg',
  'https://i.postimg.cc/6p4rd3Gs/IMG-0572.jpg',
  'https://i.postimg.cc/fyW7XfYC/IMG-0624.jpg',
];

const HEADING = 'Harnessing Community on Resource‑based Outreach_ (HACRO) Labs';

const BENEFITS = [
  {
    icon: Shield,
    title: 'Community Financial Empowerment Protection',
    description:
      'At HACRO Labs, we are reimagining the traditional chama spirit for the digital age, creating a robust financial safety net that is accessible to everyone. By leveraging modern technology, we provide a transparent, secure, and fully automated platform designed to bridge the gap in financial inclusion. We empower communities to pool resources collectively, access fair and responsible credit, and cultivate sustainable wealth.',
    link: '/community-financial-empowerment',
  },
  {
    icon: TrendingUp,
    title: 'Gender Equality and Social Inclusion (GESI)',
    description:
      'We believe that true development is only possible when everyone has a seat at the table. By integrating inclusion into our programs, we dismantle the norms and obstacles that limit human potential. We empower our members by ensuring equitable access to resources, leadership, and decision-making, creating a society where every voice is heard, valued, and positioned to thrive.',
    link: '/gender-equality-and-inclusion',
  },
  {
    icon: Award,
    title: 'Regenerative Agribusiness',
    description:
      'We believe that farming is the backbone of our economy and must be made profitable through modern techniques, value addition, and smarter market access. By replacing harmful chemicals with eco-friendly, regenerative practices, we transform environmental protection into a competitive advantage. This ensures that our growth respects the land, reduces input costs, and builds a resilient, sustainable legacy for our community.',
    link: '/regenerative-agribusiness',
  },
];

const TEAM = [
  { name: 'Jack Hamerton',    role: 'Founder & Executive Director' },
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
  const [next, setNext] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return;

    const id = window.setInterval(() => {
      setIsTransitioning(true);
      setNext((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);

      window.setTimeout(() => {
        setCurrent((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
        setNext((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
        setIsTransitioning(false);
      }, 2200);
    }, 6000);

    return () => window.clearInterval(id);
  }, []);

  const activeImage = HERO_IMAGES[current];
  const upcomingImage = HERO_IMAGES[next];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${activeImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.04)',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 2.2s ease-in-out, transform 2.2s ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${upcomingImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.04)',
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 2.2s ease-in-out, transform 2.2s ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_36%)]" />
      <div className="absolute inset-0 bg-black/10" />
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
          <div className="max-w-3xl opacity-100">
            <div className="mb-6 relative overflow-hidden" style={{ minHeight: '3.2em' }}>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                style={{ letterSpacing: '-0.02em', visibility: 'hidden' }}
              >
                {HEADING}
              </h1>
              <h1
                className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                <TypeWriter text={HEADING} />
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-prose" style={{ minHeight: '7.5rem' }}>
              HACRO Labs is a non-profit organization dedicated to fostering self-reliance and collective
              prosperity among our community members. By providing the digital tools, training, and resources
              necessary for growth, we empower our community members to turn their potential into scalable
              solutions, ensuring that every financial gain and agricultural harvest contributes to a more
              resilient, sustainable, and thriving community for all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4" style={{ minHeight: '3.25rem' }}>
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
              At HACRO Labs, we believe that true empowerment is rooted in community. Our community membership model is
              built on three core pillars designed to elevate every participant.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <div className="bg-[#1a1a1a] rounded-xl p-8 border border-white/10 hover:border-green-500/30 transition-all duration-200 h-full flex flex-col">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6">
                    <b.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{b.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{b.description}</p>
                  <a
                    href={b.link}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-400 transition hover:text-green-300"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </a>
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}