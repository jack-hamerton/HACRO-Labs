import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const Footer = () => {
  const [footerEmail, setFooterEmail] = useState('');
  const [footerMessage, setFooterMessage] = useState('');

  const handleFooterSubscribe = async (e) => {
    e.preventDefault();
    const email = String(footerEmail || '').trim();
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }

    try {
      await pb.collection('newsletter_subscribers').create({ email });
      setFooterEmail('');
      setFooterMessage('Subscribed — updates will be sent to your inbox.');
      toast.success('Subscription saved');
    } catch (error) {
      console.error('Footer subscription failed:', error);
      if (error?.data?.message?.includes('email')) {
        setFooterMessage('You are already subscribed.');
      } else {
        setFooterMessage('Subscription failed. Please try again later.');
      }
      toast.error('Subscription failed');
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {                                    }
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          
          {           }
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">HACRO Hub</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Building a strong community of members through collaborative programs that protect, empower, and connect people for shared growth and impact.
            </p>
          </div>

          {             }
          <div className="flex-1">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <Link to="/" className="opacity-80 hover:text-green-600 transition-colors duration-200">Home</Link>
              <Link to="/register" className="opacity-80 hover:text-green-600 transition-colors duration-200">Register</Link>
              <Link to="/member-login" className="opacity-80 hover:text-green-600 transition-colors duration-200">Login</Link>
              <Link to="/donate" className="opacity-80 hover:text-green-600 transition-colors duration-200">Donate</Link>
              <Link to="/newsletter" className="opacity-80 hover:text-green-600 transition-colors duration-200">Newsletter</Link>
              <Link to="/staff" className="opacity-80 hover:text-green-600 transition-colors duration-200">Our Team</Link>
            </div>
          </div>

          {            }
          <div className="flex-1">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 opacity-80">
                <Mail className="w-4 h-4" />
                <span>info@hacrolabs.com</span>
              </li>
              <li className="flex items-center space-x-2 opacity-80">
                <Phone className="w-4 h-4" />
                <span>+254 757 838 028</span>
              </li>
              <li className="flex items-center space-x-2 opacity-80">
                <MapPin className="w-4 h-4" />
                <span>Kisumu, Kenya</span>
              </li>
            </ul>
          </div>

          {           }
          <div className="flex-1">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://linkedin.com/company/hacrolabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-80 hover:text-green-600 transition-colors duration-200">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://twitter.com/hacrolabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-80 hover:text-green-600 transition-colors duration-200">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com/hacrolabs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-80 hover:text-green-600 transition-colors duration-200">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {                           }
        <div className="border-t border-green-500 mt-8 pt-6 text-sm text-slate-200 opacity-90" style={{ borderTopWidth: '1px' }}>
          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <p className="font-semibold text-black">&copy; {new Date().getFullYear()} HACRO Hub. All rights reserved.</p>
            <form onSubmit={handleFooterSubscribe} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <label htmlFor="footer-newsletter" className="sr-only">Subscribe to newsletter</label>
              <div className="relative min-w-[220px] rounded-full border border-slate-400 bg-slate-200 transition-colors duration-200 hover:border-green-500 hover:bg-green-100 focus-within:border-green-500 focus-within:bg-green-100">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder=""
                  className="w-full rounded-full border-none bg-transparent px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                />
                {!footerEmail && (
                  <div className="pointer-events-none absolute inset-y-0 left-4 right-4 flex items-center overflow-hidden rounded-full">
                    <span className="animate-marquee inline-block text-xs font-medium text-slate-600 whitespace-nowrap">
                      enter your email Subscribe to our newsletter&nbsp;&nbsp;&nbsp;
                    </span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-500"
              >
                Join
              </button>
            </form>
          </div>
          {footerMessage && (
            <p className="mt-2 text-center text-xs text-green-300 sm:text-right">{footerMessage}</p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
          will-change: transform;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
