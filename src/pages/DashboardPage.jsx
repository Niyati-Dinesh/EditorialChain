import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, ChevronLeft, ChevronRight, User, Award, Settings, BarChart3, Home } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/auth.js';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    streak: 0,
    totalWords: 0,
    avgWordsPerDay: 0,
  });
  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [hasDailyGoal, setHasDailyGoal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
        
        // Load user stats from localStorage
        const storedStats = localStorage.getItem(`stats_${currentUser.uid}`);
        if (storedStats) {
          setStats(JSON.parse(storedStats));
        }
        
        // Load goal settings from localStorage
        const storedGoal = localStorage.getItem(`goal_${currentUser.uid}`);
        if (storedGoal) {
          const goalData = JSON.parse(storedGoal);
          setHasDailyGoal(goalData.hasDailyGoal);
          setDailyGoal(goalData.dailyGoal);
        }
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch recommended articles from NewsData.io
    const fetchArticles = async () => {
      try {
        const apiKey = import.meta.env.VITE_NEWS_DATA_API_KEY;
        const topics = ['technology', 'education', 'politics', 'business'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&category=${randomTopic}`
        );
        const data = await response.json();
        
        if (data.status === 'success') {
          setArticles(data.results.slice(0, 6) || []);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    if (user) {
      fetchArticles();
    }
  }, [user]);

  useEffect(() => {
    if (articles.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const toggleDailyGoal = () => {
    const newGoalStatus = !hasDailyGoal;
    setHasDailyGoal(newGoalStatus);
    
    if (user) {
      localStorage.setItem(`goal_${user.uid}`, JSON.stringify({
        hasDailyGoal: newGoalStatus,
        dailyGoal: newGoalStatus ? dailyGoal : 0
      }));
    }
  };

  const handlePrevArticle = () => {
    setCurrentArticleIndex((prev) => 
      prev === 0 ? articles.length - 1 : prev - 1
    );
  };

  const handleNextArticle = () => {
    setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
  };

  const progress = hasDailyGoal ? Math.min((stats.avgWordsPerDay / dailyGoal) * 100, 100) : 0;
  const streakPercentage = Math.min((stats.streak / 30) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <div className="flex">
        {/* Sidebar - Non-sticky, only in content area */}
        <aside className="w-72 bg-white shadow-lg border-r border-slate-200 p-6">
          {/* User Profile Card */}
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-r-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-800 truncate" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                  Welcome, {user?.name?.split(' ')[0]}
                </h3>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Avid reader passionate about learning
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <Link 
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link 
              to="/article"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Daily Articles</span>
            </Link>
            <Link 
              to="/leaderboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600"
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Leaderboard</span>
            </Link>
            <Link 
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-blue-600"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Libertinus Serif', serif" }}>
              <div className="flex flex-row gap-2 ">Your Reading Journey <BookOpen className='mt-2 font-bold text-medium'/></div>
            </h2>
            <p className="text-slate-600">Track your progress and continue building your reading habit</p>
          </div>

          {/* Stats Section */}
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Streak Card */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700">Current Streak</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-3">{stats.streak} days</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    style={{ width: `${streakPercentage}%` }} 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
                <p className="text-sm text-slate-500 mt-2">Keep it up! Target: 30 days</p>
              </div>

              {/* Total Words Card */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700">Total Words</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-3">
                  {stats.totalWords.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  ≈ {Math.round(stats.totalWords / 250)} articles completed
                </p>
              </div>

              {/* Daily Average Card */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700">Daily Average</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 mb-3">{stats.avgWordsPerDay}</p>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={toggleDailyGoal}
                >
                  {hasDailyGoal ? '✓ Goal Active' : '+ Set Daily Goal'}
                </button>
                {hasDailyGoal && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Goal: {dailyGoal}w | {progress.toFixed(0)}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Article Carousel */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                Recommended for You
              </h3>
              <Link 
                to="/article"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All Articles →
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentArticleIndex * 100}%)` }}
                  >
                    {articles.map((article, index) => (
                      <div key={article.article_id || index} className="w-full flex-shrink-0">
                        <div className="grid md:grid-cols-2 gap-6 p-8">
                          {article.image_url && (
                            <div className="h-64 rounded-xl overflow-hidden">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop'}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex flex-col justify-center">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-3 w-fit">
                              {article.category?.[0] || 'Featured'}
                            </span>
                            <h4 className="text-2xl font-bold text-slate-800 mb-4 leading-tight" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                              {article.title}
                            </h4>
                            <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                              {article.description || 'Discover this interesting article curated just for you.'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">{article.source_name}</span>
                              <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Read Article →
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Controls */}
                <button
                  onClick={handlePrevArticle}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button
                  onClick={handleNextArticle}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentArticleIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentArticleIndex 
                          ? 'bg-blue-600 w-8' 
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Loading recommended articles...</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;