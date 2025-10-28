import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Globe, Calendar, Clock, BookOpen, User, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx'; // Make sure path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// --- Helper Functions ---
const calculateReadingTime = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time;
};

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

// --- Main Component ---
const DailyArticlePage = () => {
  const { currentUser } = useAppContext();
  const navigate = useNavigate(); // Hook for navigation
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [searchInput, setSearchInput] = useState('');
  const [timer, setTimer] = useState(0);

  // --- REMOVED Quiz Modal State ---
  // const [showQuizModal, setShowQuizModal] = useState(false);
  // const [currentQuizArticle, setCurrentQuizArticle] = useState(null);
  // const [selectedAnswers, setSelectedAnswers] = useState({});
  // const [quizScore, setQuizScore] = useState(null);
  // const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop';

  const countries = [
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' }
  ];

  // --- Effects ---
  useEffect(() => {
    const intervalId = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchArticles = useCallback(async () => {
    // ... (fetchArticles logic remains the same as previous correct version) ...
    setLoading(true);
    setError(null);
    setArticles([]);

    const getPreferredTopics = () => {
      const defaultTopics = { technology: true, science: true, business: true };
      const userTopics = currentUser?.topics || defaultTopics;
      const topicsString = Object.entries(userTopics)
        .filter(([, isEnabled]) => isEnabled)
        .map(([topic]) => topic)
        .join(',');
      return topicsString || (currentUser?.topics ? '' : 'top');
    };

    const preferredTopics = getPreferredTopics();

    const apiKey = import.meta.env.VITE_NEWS_DATA_API_KEY;
    if (!apiKey) {
      setError("API key missing. Cannot fetch articles.");
      setLoading(false);
      return;
    }
    if (preferredTopics === '' && currentUser?.topics) {
      setError("Please select topics in Settings to personalize your feed.");
      setLoading(false);
      return;
    }

    try {
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${selectedCountry}&language=en&category=${preferredTopics || 'top'}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);
      if (!response.ok) {
         let errorBody = `HTTP error! status: ${response.status}`;
         try { const errorData = await response.json(); errorBody = errorData.results?.message || errorData.message || errorBody; } catch(e) {}
         throw new Error(errorBody);
      }
      const data = await response.json();

      if (data.status === 'success' && data.results) {
        const validArticles = data.results
          .filter(a => a.title && (a.description || a.content))
          .map(a => ({ ...a, readingTime: calculateReadingTime(a.content || a.description || '') }));
        setArticles(validArticles || []);
      } else {
        const apiErrorMessage = data.results?.message || data.message || `API Error: Status ${data.status}`;
        throw new Error(`Could not fetch articles: ${apiErrorMessage}`);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(`Failed to fetch articles. ${err.message}`);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCountry, currentUser]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);


  // --- Event Handlers ---
  const handleSearch = () => setSearchQuery(searchInput.trim());
  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearch(); };
  const formatDate = (dateString) => { /* ... (same as before) ... */
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { console.error("Error formatting date:", dateString, e); return 'Invalid Date'; }
  };
  const handleImageError = (e) => { e.target.src = fallbackImage; };
  const getAuthorName = (creators) => { /* ... (same as before) ... */
    if (!creators || !Array.isArray(creators) || creators.length === 0) return null;
    return typeof creators[0] === 'string' && creators[0].trim() !== '' ? creators[0].trim() : null;
  };

  // --- NEW Navigation Handler ---
  const goToQuiz = (article) => {
    // Generate a somewhat unique ID if article_id is missing
    const articleIdForUrl = article.article_id || `temp-${article.title?.substring(0,10) || Date.now()}`;
    navigate(`/quiz/${encodeURIComponent(articleIdForUrl)}`, { state: { article } });
  };

  // --- Memoized Values ---
  const formattedTimer = useMemo(() => formatTime(timer), [timer]);

  // --- Render Logic ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Search Bar & Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 py-12">
         {/* ... (Header content: Title, Search, Country, Timer - same as previous correct version) ... */}
         <div className="max-w-4xl mx-auto px-4">
             {/* Title */}
           <h2 className="text-3xl font-bold text-white mb-6 text-center" style={{ fontFamily: "'Libertinus Serif', serif" }}>
             Your Personalized Article Feed
           </h2>
            {/* Search */}
           <div className="relative">
             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500 pointer-events-none" />
             <input type="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search articles..." className="w-full pl-12 pr-28 sm:pr-32 py-4 rounded-xl border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-blue-500" />
             <button onClick={handleSearch} aria-label="Search Articles" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-700">Search</button>
           </div>
           {/* Search Query Display */}
           {searchQuery && (
             <div className="mt-4 text-center">
               <span className="inline-flex items-center bg-white/20 dark:bg-gray-700/50 text-white dark:text-gray-300 px-4 py-2 rounded-full text-sm">
                 Showing results for: <strong className="ml-1">{searchQuery}</strong>
                 <button onClick={() => { setSearchQuery(''); setSearchInput(''); }} className="ml-2 text-white/80 hover:text-white dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-white rounded-full p-0.5" aria-label="Clear search">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               </span>
             </div>
           )}
        </div>
         {/* Country Selector & Timer */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-6 px-4">
            {/* Country */}
           <div className="flex items-center space-x-2">
             <Globe className="w-4 h-4 text-white/80 dark:text-gray-400 flex-shrink-0" />
             <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-blue-500 appearance-none cursor-pointer" aria-label="Select Country">
               {countries.map(country => (<option key={country.code} value={country.code} className="text-slate-800 dark:text-gray-200 dark:bg-gray-700">{country.flag} {country.name}</option>))}
             </select>
           </div>
            {/* Timer */}
           <div className="flex items-center space-x-2 bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm border border-white/30 dark:border-gray-600 text-white dark:text-gray-200 rounded-lg px-4 py-2 text-sm">
             <Clock className="w-4 h-4 text-white/80 dark:text-gray-400" />
             <span className="font-mono tabular-nums">{formattedTimer}</span>
             <span className="hidden sm:inline"> Reading Time</span>
           </div>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
             <div className="flex items-center justify-center py-20" aria-live="polite">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
               <span className="sr-only">Loading articles</span>
             </div>
        ) : error ? (
             <div className="text-center py-20 rounded-lg bg-red-50 dark:bg-red-900/30 shadow-md border border-red-200 dark:border-red-800 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 dark:text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-xl font-semibold text-red-700 dark:text-red-300">Could not load articles</p>
               <p className="text-sm text-red-500 dark:text-red-400 mt-2">{error}</p>
             </div>
        ) : articles.length === 0 ? (
             <div className="text-center py-20 rounded-lg bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 px-6">
               <BookOpen className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
               <p className="text-xl text-slate-500 dark:text-gray-400">No articles found</p>
               <p className="text-sm text-slate-400 dark:text-gray-500 mt-2">
                  {searchQuery ? "Try refining your search query." : "Try adjusting your preferred topics in Settings or select a different country."}
               </p>
             </div>
        ) : (
            // Article Cards
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => {
                const author = getAuthorName(article.creator);
                const hasHtmlContent = /<[a-z][\s\S]*>/i.test(article.content || '');
                const displayContent = article.description || (!hasHtmlContent ? article.content : '');

                return (
                  <article key={article.article_id || `article-${index}`} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-blue-900/20 dark:hover:shadow-blue-900/40 transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label={`Read article: ${article.title}`}>
                         <img src={article.image_url || fallbackImage} alt="" loading="lazy" onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"/>
                      </a>
                      {article.readingTime > 0 && (
                          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                              <Clock size={12}/> {article.readingTime} min read
                          </div>
                      )}
                    </div>
                     {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center space-x-2 mb-3 flex-wrap gap-y-1">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 dark:text-gray-300 dark:bg-gray-700 px-2 py-1 rounded uppercase tracking-wider">
                          {article.category?.[0]?.replace(/_/g, ' ').toUpperCase() || 'NEWS'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-gray-500">
                          {formatDate(article.pubDate)}
                        </span>
                      </div>
                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100 mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                        <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
                      </h3>
                      {/* Description */}
                      {displayContent && (
                        <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
                          {displayContent}
                        </p>
                      )}
                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-gray-700">
                        {/* Author/Source */}
                         <div className="flex flex-col overflow-hidden mr-2">
                           {author && <span className="text-xs text-slate-400 dark:text-gray-500 flex items-center mb-1 truncate" title={author}><User className="w-3 h-3 mr-1.5 flex-shrink-0" /><span className="truncate">{author}</span></span>}
                           <span className="text-xs text-slate-500 dark:text-gray-400 truncate" title={article.source_id}>{article.source_id || 'Unknown Source'}</span>
                         </div>
                         {/* Action Buttons */}
                         <div className="flex items-center space-x-2 flex-shrink-0">
                             {/* MODIFIED Quiz Button - Navigates instead of opening modal */}
                             <button
                                onClick={() => goToQuiz(article)}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium whitespace-nowrap p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                title="Take Quiz"
                                aria-label={`Take quiz for article: ${article.title}`}
                             >
                                 <HelpCircle size={18}/>
                             </button>
                             {/* Read Link */}
                            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium whitespace-nowrap group-hover:underline" aria-label={`Read article: ${article.title}`}>
                              Read →
                            </a>
                         </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
        )}
      </main>

      {/* REMOVED Quiz Modal JSX */}

    </div>
  );
};

export default DailyArticlePage;