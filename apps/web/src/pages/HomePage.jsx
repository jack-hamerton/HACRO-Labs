import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Users, Shield, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { EnergyScene } from '@/components/ui/EnergyScene.jsx';
const HomePage = () => {
  const benefits = [{
    icon: Shield,
    title: 'Community Financial Empowerment Protection',
    description: 'We are digitizing the chama spirit to build a safety net for everyone. HACRO Labs provides a transparent, secure, and automated platform where communities can pool resources, access fair credit, and grow their wealth together. We protect your savings with robust digital protocols, ensuring that your financial journey is safe, predictable, and managed by the community, for the community.'
  }, {
    icon: TrendingUp,
    title: 'Sustainable Agri-Business Growth',
    description: 'Farming is the backbone of our economy, and we are committed to making it profitable. We equip our members with the skills to transform their harvests through value addition, modern farming techniques, and smarter market access. Our training programs turn basic yields into viable businesses, ensuring that hard work translates into consistent income and tangible growth.'
  }, {
    icon: Award,
    title: 'Environmental Resilience & Stewardship',
    description: 'True growth respects the land. We empower our members to thrive by adopting eco-friendly practices that reduce reliance on harmful chemicals and preserve our natural heritage. Through income-generating activities that prioritize environmental health, we show that you can build a prosperous future while ensuring that the land remains fertile and healthy for generations to come.'
  }];
  return <>
      <Helmet>
        <title>HACRO Labs </title>
        <meta name="description" content="Join Hacro Labs to gain digital and financial skills, connect with supportive networks, and unlock your full potential while building solutions that uplift communities." />
      </Helmet>

      <div className="relative min-h-screen bg-background text-white overflow-x-hidden">
        <Header />

        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <ambientLight intensity={1} />
            <pointLight position={[20, 20, 20]} intensity={2} />
            <pointLight position={[-20, -20, 20]} intensity={1.5} color="#22c55e" />
            <Suspense fallback={null}>
              <EnergyScene />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(https://i.postimg.cc/J7XRsQ9y/IMG-8869-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/90"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance" style={{
                letterSpacing: '-0.02em'
              }}>
                   Harnessing Community on Resource‑based Outreach_ (HACRO) Labs
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-prose">
                 HACRO Labs is a non-profit organization dedicated to fostering self-reliance and collective prosperity among our community members. By providing the digital tools, training, and resources necessary for growth, we empower our community members to turn their potential into scalable solutions,
                  ensuring that every financial gain and agricultural harvest contributes to a more resilient, sustainable, and thriving community for all.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register" className="btn-primary inline-flex items-center justify-center space-x-2">
                    <span>Register now</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/member-login" className="btn-outline inline-flex items-center justify-center">
                    Member login
                  </Link>
                </div>
                <p className="mt-4 text-sm text-white/80">
                  Learn more about our policies in the <Link to="/newsletter#terms" className="underline text-white">Terms & Conditions</Link>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4 text-balance">
                How We Work
              </h2>
              <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
               At HACRO Labs, we believe that true empowerment is rooted in community. We work directly with our community members to build a future that is financially secure, agriculturally productive, and environmentally conscious.
               Our community membership model is built on three core pillars designed to elevate every participant:.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => <motion.div key={benefit.title} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">Meet our team</p>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">A dedicated team supporting every community member</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                HACRO Labs staff deliver  support, digital training, and community outreach so every member can thrive.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Jack Hamerton', role: 'Founder & Executive Director/ Advisory Chairman' },
                { name: 'Jessy Mala', role: 'Program Delivery Manager' },
                { name: 'Chrispine Samwel', role: 'Development Gateway Manager' },
                { name: 'Ruth Njeri', role: 'Community Outreach Coordinator' },
              ].map((member) => (
                <div key={member.name} className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-semibold">
                    {member.name.split(' ').map((part) => part[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/staff" className="btn-primary inline-flex items-center justify-center">
                Meet our full Team
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
              <div className="max-w-3xl mx-auto text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Ready to get started?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join hundreds of community members who have empowered themselves,
                  grown their skills, and uplifted others through HACRO Labs membership.
                </p>
                <Link to="/register" className="btn-primary inline-flex items-center space-x-2">
                  <span>Create your account</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>;
};
export default HomePage;
