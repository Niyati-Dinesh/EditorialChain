import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, ChevronLeft, ChevronRight, User, Award, Settings, Home } from 'lucide-react';
// 1. Import useAppContext
import { useAppContext } from '../context/AppContext.jsx';

const DashboardPage = () => {
  // 2. Get currentUser and theme from context
  const { currentUser, loading: contextLoading } = useAppContext(); // Rename loading to avoid conflict

  // 3. Remove local user state and onAuthStateChanged listener
  // const [user, setUser] = useState(null);

  // 4. Stats will come from currentUser (merged Firestore data)
  const stats = {
    streak: currentUser?.streak || 0,
    // totalWords needs to be calculated or stored in Firestore (let's assume 0 for now)
    totalWords: currentUser?.stats?.totalWordsRead || 0, // Example: Assuming 'totalWordsRead' is stored
    // avgWordsPerDay needs calculation based on history or stored data (let's assume 0 for now)
    avgWordsPerDay: currentUser?.stats?.averageWordsPerDay || 0, // Example: Assuming 'averageWordsPerDay' is stored
  };

  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

  // 5. Goal state might come from Firestore user settings or local state (keep local for now)
  const [hasDailyGoal, setHasDailyGoal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [articlesLoading, setArticlesLoading] = useState(true); // Separate loading state for articles

  // 6. Removed onAuthStateChanged useEffect

  // Fetch articles effect
  useEffect(() => {
    const fetchArticles = async () => {
      setArticlesLoading(true); // Start loading articles
      try {
        const apiKey = import.meta.env.VITE_NEWS_DATA_API_KEY;
        // Consider using user's preferred topics from Firestore if available
        const topics = ['technology', 'education', 'politics', 'business', 'science'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];

        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&category=${randomTopic}`
        );
        const data = await response.json();

        if (data.status === 'success' && data.results) {
          // Filter out articles without essential info
          const validArticles = data.results.filter(a => a.title && (a.description || a.content)).slice(0, 6);
          setArticles(validArticles || []);
        } else {
            console.error("Failed to fetch articles:", data.message || 'Unknown error');
            setArticles([]); // Set empty array on failure
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticles([]); // Set empty array on error
      } finally {
        setArticlesLoading(false); // Finish loading articles
      }
    };

    // Only fetch if logged in (currentUser exists)
    if (currentUser) {
      fetchArticles();
    } else {
        setArticles([]); // Clear articles if user logs out
        setArticlesLoading(false);
    }
    // Dependency: currentUser ensures fetch runs when user logs in
  }, [currentUser]);

  // Carousel auto-advance effect
  useEffect(() => {
    if (articles.length <= 1) return; // No need to slide if 0 or 1 article

    const interval = setInterval(() => {
      setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [articles.length]);

  // Load/Save goal from local storage (could be moved to Firestore later)
  useEffect(() => {
     if (currentUser) {
       const storedGoal = localStorage.getItem(`goal_${currentUser.uid}`);
       if (storedGoal) {
         try {
            const goalData = JSON.parse(storedGoal);
            setHasDailyGoal(goalData.hasDailyGoal ?? false); // Default to false if missing
            setDailyGoal(goalData.dailyGoal || 2000); // Default to 2000 if missing/invalid
         } catch (e) {
             console.error("Error parsing goal data from localStorage", e);
             setHasDailyGoal(false);
             setDailyGoal(2000);
         }
       }
     }
  }, [currentUser]);


  const toggleDailyGoal = () => {
    const newGoalStatus = !hasDailyGoal;
    setHasDailyGoal(newGoalStatus);

    if (currentUser) {
      localStorage.setItem(`goal_${currentUser.uid}`, JSON.stringify({
        hasDailyGoal: newGoalStatus,
        dailyGoal: newGoalStatus ? dailyGoal : 0 // Save current goal value or 0
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

  // Calculations based on potentially updated stats
  const progress = hasDailyGoal && dailyGoal > 0 ? Math.min((stats.avgWordsPerDay / dailyGoal) * 100, 100) : 0;
  const streakPercentage = Math.min((stats.streak / 30) * 100, 100); // Example target: 30 days

  // Use contextLoading for initial page load check
  if (contextLoading) {
    return (
      // 7. Added dark mode background
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Handle case where user isn't logged in after loading (shouldn't happen due to App.jsx logic)
  if (!currentUser) {
      return (
         <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">Please log in.</p>
        </div>
      );
  }


  // --- Render with Dark Mode Classes ---
  return (
    // 8. Added dark mode gradient
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 min-h-screen" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <div className="flex">
        {/* Sidebar */}
         {/* 9. Added dark mode background, border, text */}
        <aside className="w-72 bg-white dark:bg-gray-800 shadow-lg border-r border-slate-200 dark:border-gray-700 p-6 hidden md:block"> {/* Hide on small screens */}
          {/* User Profile Card */}
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-blue-900/50 border-l-4 border-blue-600 dark:border-blue-400 rounded-r-xl shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                 {/* 10. Added dark mode text */}
                <h3 className="text-base font-bold text-slate-800 dark:text-gray-100 truncate" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                  Welcome, {currentUser.displayName?.split(' ')[0] || 'User'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>
             {/* 11. Added dark mode text */}
            <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
              Keep exploring and learning!
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-md transition-all"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
             {/* 12. Added dark mode hover/text for inactive links */}
            <Link
              to="/article"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Daily Articles</span>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Award className="w-5 h-5" />
              <span className="font-medium">Leaderboard</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors text-slate-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
             {/* 13. Added dark mode text */}
            <h2 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-2" style={{ fontFamily: "'Libertinus Serif', serif" }}>
              <div className="flex flex-row items-center gap-2"> {/* Use items-center */}
                  Your Reading Journey
                  <BookOpen className='mt-1 text-slate-700 dark:text-gray-300'/> {/* Adjust margin/color */}
              </div>
            </h2>
            <p className="text-slate-600 dark:text-gray-400">Track your progress and continue building your reading habit</p>
          </div>

          {/* Stats Section */}
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Streak Card */}
              {/* 14. Added dark mode background, border, text */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-blue-900/30 transition-shadow border border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">Current Streak</h3>
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 dark:text-gray-100 mb-3">{stats.streak} days</p>
                <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    style={{ width: `${streakPercentage}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">Keep it up! Target: 30 days</p>
              </div>

              {/* Total Words Card */}
               {/* 15. Added dark mode background, border, text */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-blue-900/30 transition-shadow border border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">Total Words</h3>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 dark:text-gray-100 mb-3">
                  {stats.totalWords.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  ≈ {Math.round(stats.totalWords / 250)} articles completed
                </p>
              </div>

              {/* Daily Average Card */}
               {/* 16. Added dark mode background, border, text */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-blue-900/30 transition-shadow border border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">Daily Average</h3>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-800 dark:text-gray-100 mb-3">{stats.avgWordsPerDay.toLocaleString()}</p> {/* Added toLocaleString */}
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  onClick={toggleDailyGoal}
                >
                  {hasDailyGoal ? '✓ Goal Active' : '+ Set Daily Goal'}
                </button>
                {hasDailyGoal && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                      Goal: {dailyGoal.toLocaleString()}w | {progress.toFixed(0)}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Article Carousel */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
               {/* 17. Added dark mode text */}
              <h3 className="text-2xl font-bold text-slate-800 dark:text-gray-100" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                Recommended for You
              </h3>
              <Link
                to="/article"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
              >
                View All Articles →
              </Link>
            </div>

             {/* 18. Check articlesLoading state */}
            {articlesLoading ? (
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-slate-100 dark:border-gray-700">
                    <div className="animate-pulse flex flex-col items-center">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  <p className="text-slate-500 dark:text-gray-400 mt-2">Loading recommended articles...</p>
                </div>
            ) : articles.length > 0 ? (
               // 19. Added dark mode background, border
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-gray-700">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentArticleIndex * 100}%)` }}
                  >
                    {articles.map((article, index) => (
                      <div key={article.article_id || index} className="w-full flex-shrink-0">
                        {/* 20. Added dark mode padding */}
                        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                          {article.image_url ? ( // Show image only if URL exists
                            <div className="h-64 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"> {/* Added placeholder bg */}
                              <img
                                src={article.image_url}
                                alt={article.title}
                                onError={(e) => { e.target.style.display = 'none'; /* Hide broken image */ }}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                             <div className="h-64 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                 <BookOpen className="w-16 h-16 text-slate-400 dark:text-gray-500"/>
                             </div> // Placeholder if no image
                          )}
                          <div className="flex flex-col justify-center">
                             {/* 21. Added dark mode tag, text */}
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50 px-3 py-1 rounded-full inline-block mb-3 w-fit uppercase tracking-wider">
                              {/* Safely access category */}
                              {article.category?.[0]?.replace(/_/g, ' ') || 'Featured'}
                            </span>
                            <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-gray-100 mb-3 leading-tight" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                              {article.title}
                            </h4>
                            <p className="text-slate-600 dark:text-gray-400 mb-4 leading-relaxed line-clamp-3 text-sm">
                              {article.description || article.content || 'Discover this interesting article curated just for you.'}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-2"> {/* Ensure button is at bottom */}
                              <span className="text-sm text-slate-500 dark:text-gray-500 truncate pr-2">{article.source_id || 'Unknown Source'}</span> {/* Use source_id */}
                              <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm font-medium whitespace-nowrap" // Prevent wrapping
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
                 {/* 22. Added dark mode background/text */}
                <button
                  onClick={handlePrevArticle}
                  aria-label="Previous Article"
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-gray-900/50 dark:hover:bg-gray-900/80 p-2 sm:p-3 rounded-full shadow-lg transition-all text-slate-700 dark:text-gray-300"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextArticle}
                  aria-label="Next Article"
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white dark:bg-gray-900/50 dark:hover:bg-gray-900/80 p-2 sm:p-3 rounded-full shadow-lg transition-all text-slate-700 dark:text-gray-300"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to article ${index + 1}`}
                      onClick={() => setCurrentArticleIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentArticleIndex
                          ? 'bg-blue-600 dark:bg-blue-400 w-6 sm:w-8' // Make active indicator wider
                          : 'bg-slate-300 hover:bg-slate-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
                // 23. Added dark mode for empty state
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-slate-100 dark:border-gray-700">
                 <BookOpen className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                 <p className="text-slate-500 dark:text-gray-400">No recommended articles found right now.</p>
                 <Link to="/article" className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                    Browse Daily Articles
                 </Link>
               </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;