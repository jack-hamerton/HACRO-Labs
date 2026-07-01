import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Horizontal layout for all sections */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          
          {/* HACRO Labs */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">HACRO Labs</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Building a strong community of members through collaborative programs that protect, empower, and connect people for shared growth and impact.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <Link to="/" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Home</Link>
              <Link to="/register" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Register</Link>
              <Link to="/member-login" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Login</Link>
              <Link to="/donate" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Donate</Link>
              <Link to="/newsletter" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Newsletter</Link>
              <Link to="/staff" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Our Team</Link>
            </div>
          </div>

          {/* Contact Us */}
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

          {/* Follow Us */}
          <div className="flex-1">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://linkedin.com/company/hacrolabs" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity duration-200">LinkedIn</a></li>
              <li><a href="https://twitter.com/hacrolabs" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Twitter</a></li>
              <li><a href="https://facebook.com/hacrolabs" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity duration-200">Facebook</a></li>
            </ul>
          </div>
        </div>

              {/* Copyright */}
        <div className="border-t border-green-500 mt-8 pt-8 text-center text-sm opacity-80" style={{ borderTopWidth: '1px' }}>
          <p>&copy; {new Date().getFullYear()} HACRO Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
 
export default Footer;
