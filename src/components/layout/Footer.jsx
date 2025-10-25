import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart,
  ArrowUp,
  ExternalLink,
  Shield,
  Users,
  Code,
  Globe
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Features", href: "/about" },
        { label: "How it Works", href: "/about" },
        { label: "Pricing", href: "/about" },
        { label: "API", href: "/about" },
        { label: "Status", href: "/about" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Guidelines", href: "/about" },
        { label: "Contributing", href: "/about" },
        { label: "Discord", href: "/about" },
        { label: "Blog", href: "/about" },
        { label: "Events", href: "/about" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/about" },
        { label: "Contact Us", href: "/about" },
        { label: "Bug Reports", href: "/about" },
        { label: "Feature Requests", href: "/about" },
        { label: "Documentation", href: "/about" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/about" },
        { label: "Terms of Service", href: "/about" },
        { label: "Cookie Policy", href: "/about" },
        { label: "GDPR", href: "/about" },
        { label: "Accessibility", href: "/about" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@editorialchain.com", label: "Email" }
  ];

  const stats = [
    { icon: Users, value: "100K+", label: "Active Users" },
    { icon: BookOpen, value: "2.5M+", label: "Articles Read" },
    { icon: Globe, value: "50+", label: "Countries" },
    { icon: Code, value: "Open", label: "Source" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold">EditorialChain</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Building consistent reading habits through curated content, 
              progress tracking, and community learning. Join thousands of 
              readers expanding their knowledge daily.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4 text-indigo-400 mr-1" />
                      <span className="text-lg font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
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

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm flex items-center"
                    >
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 ml-1" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Stay Updated
            </h3>
            <p className="text-slate-400 mb-4 text-sm">
              Get the latest articles and platform updates delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-sm">
                © 2025 EditorialChain. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span className="flex items-center">
                  <Heart className="w-4 h-4 text-red-500 mr-1" />
                  Made with love for readers
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  Privacy First
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">Hacktoberfest 2025</span>
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
        </div>
      </footer>
);
};

export default Footer;
