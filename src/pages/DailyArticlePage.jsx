import React, { useState, useEffect } from 'react';
import { Search, Filter, Globe, Calendar, TrendingUp, BookOpen, User } from 'lucide-react';

const DailyArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [activeCategory, setActiveCategory] = useState('top');
  const [searchInput, setSearchInput] = useState('');

  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=800&fit=crop';

  const countries = [
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' }
  ];

  const categories = [
    { id: 'top', label: 'Top Stories', icon: TrendingUp },
    { id: 'politics', label: 'Politics', icon: Globe },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'business', label: 'Business', icon: TrendingUp },
  ];

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, selectedCountry, activeCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_NEWS_DATA_API_KEY || 'pub_60935fcfadd75a6aa2e86ca2cc6a6a5b0f29c';
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${selectedCountry}&language=en`;
      
      if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }
      
      if (activeCategory !== 'top') {
        url += `&category=${activeCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        setArticles(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const getAuthorName = (creators) => {
    if (!creators || creators.length === 0) return null;
    return creators[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center" style={{ fontFamily: "'Libertinus Serif', serif" }}>
            Discover Today's Stories
          </h2>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search articles by keywords..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
          {searchQuery && (
            <div className="mt-4 text-center">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                Showing results for: <strong>{searchQuery}</strong>
                <button
                  onClick={() => { setSearchQuery(''); setSearchInput(''); }}
                  className="ml-2 text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </span>
            </div>
          )}
        </div>
        
        {/* Country Selector */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Globe className="w-4 h-4 text-white/80" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code} className="text-slate-800">
                {country.flag} {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-500">No articles found</p>
            <p className="text-sm text-slate-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {articles[0] && (
              <div className="mb-12 bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    <img
                      src={articles[0].image_url || fallbackImage}
                      alt={articles[0].title}
                      onError={handleImageError}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      FEATURED
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {articles[0].category?.[0] || 'News'}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(articles[0].pubDate)}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4 leading-tight" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                      {articles[0].title}
                    </h2>
                    {articles[0].description && (
                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                        {articles[0].description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {getAuthorName(articles[0].creator) && (
                          <span className="text-xs text-slate-400 flex items-center mb-1">
                            <User className="w-3 h-3 mr-1" />
                            {getAuthorName(articles[0].creator)}
                          </span>
                        )}
                        <span className="text-sm text-slate-500">
                          {articles[0].source_name}
                        </span>
                      </div>
                      <a
                        href={articles[0].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((article, index) => (
                <article
                  key={article.article_id || index}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image_url || fallbackImage}
                      alt={article.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {article.category?.[0] || 'News'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(article.pubDate)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight" style={{ fontFamily: "'Libertinus Serif', serif" }}>
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                        {article.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex flex-col flex-1 mr-2">
                        {getAuthorName(article.creator) && (
                          <span className="text-xs text-slate-400 flex items-center mb-1 truncate">
                            <User className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{getAuthorName(article.creator)}</span>
                          </span>
                        )}
                        <span className="text-xs text-slate-500 truncate">
                          {article.source_name}
                        </span>
                      </div>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium whitespace-nowrap"
                      >
                        Read →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DailyArticlePage;