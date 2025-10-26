import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { label: "Features", href: "/about" },
    { label: "Pricing", href: "/about" },
    { label: "Blog", href: "/about" },
    { label: "Privacy", href: "/about" },
    { label: "Terms", href: "/about" },
    { label: "Contact", href: "/about" }
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@editorialchain.com", label: "Email" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8">
          {/* Brand */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold">EditorialChain</span>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex space-x-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © 2025 EditorialChain. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;