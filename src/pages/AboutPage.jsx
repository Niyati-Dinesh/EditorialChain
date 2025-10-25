import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Heart, 
  Star, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin,
  CheckCircle,
  BarChart3,
  Clock,
  Award,
  Globe,
  Code,
  Database,
  Cloud,
  Smartphone
} from 'lucide-react';

const AboutPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Daily Reading Habit",
      description: "Build consistent reading habits with our curated daily articles and progress tracking.",
      icon: BookOpen,
      stats: "10,000+ daily readers"
    },
    {
      title: "Personalized Content",
      description: "AI-powered content recommendations based on your interests and reading level.",
      icon: Target,
      stats: "95% user satisfaction"
    },
    {
      title: "Community Learning",
      description: "Join discussions, share insights, and learn together with fellow readers.",
      icon: Users,
      stats: "50,000+ active members"
    },
    {
      title: "Progress Analytics",
      description: "Track your reading journey with detailed analytics and achievement badges.",
      icon: BarChart3,
      stats: "2.5M articles completed"
    }
  ];

  const techStack = [
    { name: "React 19", description: "Modern UI framework", icon: Code },
    { name: "Firebase", description: "Authentication & database", icon: Database },
    { name: "Tailwind CSS", description: "Utility-first styling", icon: Palette },
    { name: "Vite", description: "Fast build tool", icon: Zap },
    { name: "Cloudflare", description: "Global CDN", icon: Cloud },
    { name: "PWA Ready", description: "Mobile-first design", icon: Smartphone }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "EditorialChain helped me build a consistent reading habit. I've read 50+ articles in just 2 months!",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      content: "The personalized recommendations are spot-on. I always find articles that match my interests perfectly.",
      avatar: "MJ",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Student",
      content: "As a non-native English speaker, the vocabulary tracking feature has been incredibly helpful for my learning.",
      avatar: "ER",
      rating: 5
    }
  ];

  const achievements = [
    { number: "100K+", label: "Active Users", icon: Users },
    { number: "2.5M+", label: "Articles Read", icon: BookOpen },
    { number: "50K+", label: "Community Members", icon: Heart },
    { number: "95%", label: "User Satisfaction", icon: Star }
  ];

  const communityGuidelines = [
    "Respect diverse perspectives and opinions",
    "Maintain constructive and respectful discussions",
    "Share knowledge and help fellow readers",
    "Report inappropriate content or behavior",
    "Follow platform terms of service"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Building Consistent Reading Habits
            <span className="block text-3xl mt-2 text-indigo-200">
              One Article at a Time
            </span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            EditorialChain is a community-driven platform that helps you develop and maintain 
            consistent reading habits through curated content, progress tracking, and social learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Reading Today
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that consistent reading is one of the most powerful tools for personal growth, 
            learning, and staying informed. Our mission is to make quality reading accessible, 
            engaging, and sustainable for everyone, regardless of their background or reading level.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              <span>Global Community</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              <span>User-Centric</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">
              Everything you need to build and maintain consistent reading habits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                    activeFeature === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${
                      activeFeature === index ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        activeFeature === index ? 'text-indigo-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.stats}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Feature Details */}
          <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                {React.createElement(features[activeFeature].icon, { 
                  className: "w-8 h-8 text-indigo-600" 
                })}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-600">{features[activeFeature].stats}</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {features[activeFeature].description}
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-gray-600">
              We use cutting-edge tools to deliver a fast, reliable, and scalable experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-3">
                    <Icon className="w-8 h-8 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{tech.name}</h3>
                  </div>
                  <p className="text-gray-600">{tech.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Impact</h2>
            <p className="text-xl text-indigo-100">
              Join thousands of readers building better habits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white bg-opacity-20 rounded-full">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                  <div className="text-indigo-200">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h2>
            <p className="text-lg text-gray-600">
              We're committed to fostering a positive and inclusive community
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="space-y-4">
              {communityGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{guideline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of readers building consistent habits and expanding their knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contributing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bug Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feature Requests</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EditorialChain. Built with ❤️ for the reading community.</p>
            <p className="mt-2">Hacktoberfest 2025 Project</p>
          </div>
        </div>
      </section>
  </div>
);
};

export default AboutPage;
