import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Shield, TrendingUp, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
const HomePage = () => {
  const benefits = [{
    icon: Shield,
    title: 'Community Protection',
    description: 'Join Hacro Labs with confidence — your personal data, contributions, and community trust are safeguarded by strong security measures and encryption designed to protect every member.”'
  }, {
    icon: TrendingUp,
    title: 'Community Growth Opportunities',
    description: 'Unlock exclusive financial training, shared resources, and collaborative networking that accelerate your skills, strengthen your career, and expand your community’s impact..'
  }, {
    icon: Award,
    title: 'Community Recognition & Protection',
    description: 'At Hacro Labs, every community member is honored and safeguarded, your contributions are celebrated with awards and acknowledgment, while strong protections ensure your dignity and trust remain secure.'
  }];
  return <>
      <Helmet>
        <title>HACRO Labs - Professional Membership Platform</title>
        <meta name="description" content="Join Hacro Labs to gain digital and financial skills, connect with supportive networks, and unlock your full potential while building solutions that uplift communities." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1542868727-1d2c316ed573)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/80"></div>
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
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance" style={{
                letterSpacing: '-0.02em'
              }}>
                   Harnessing Community on Resource‑based  Outreach_ (HACRO) Labs
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-prose">
                  HACRO Labs is a registered non‑profit in Kenya dedicated to digital and financial empowerment. Through training, support,
                  and linkages, it helps members unlock their full potential and build scalable solutions for their communities.
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
                Membership benefits
              </h2>
              <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
                HACRO Labs membership protects every community member, supports collective growth through shared training and resources,
                and honors contributions with recognition that uplifts the whole community.
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
