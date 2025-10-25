import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data (replace with real data from Firebase/Auth or API)
const mockUserStats = {
  streak: 7,
  totalWords: 15000,
  avgWordsPerDay: 2143,
};

const mockUser = {
  name: 'Kunal Sharma',
  email: 'kunal@example.com',
  summary: 'Avid reader and tech enthusiast passionate about learning and exploring new topics.',
};

// Mock articles (replace with API-based recommendations)
const mockArticles = [
  {
    id: 1,
    title: 'Economy Update: GDP Growth',
    preview: 'India\'s GDP is projected to grow by 7.5% in the next quarter, driven by strong manufacturing and services sectors. Key factors include increased exports and government spending on infrastructure, which are expected to boost economic stability. Analysts predict a positive outlook if current trends continue, with potential impacts on job creation and inflation rates.',
    topic: 'Economy',
    source: 'Economic Times',
  },
  {
    id: 2,
    title: 'Environmental Policies in India',
    preview: 'New policies aim to reduce carbon emissions by 45% by 2030, focusing on renewable energy sources like solar and wind. The government is offering incentives for green tech adoption, targeting a sustainable future. Challenges include funding and public awareness, but experts see this as a critical step toward net-zero goals.',
    topic: 'Environment',
    source: 'The Hindu',
  },
  {
    id: 3,
    title: 'International Relations: India-US Ties',
    preview: 'A recent summit has strengthened bilateral ties between India and the US, with agreements on defense and technology transfer. The focus is on countering regional threats and boosting trade, with both nations committing to joint military exercises. This partnership could reshape global alliances in the coming years.',
    topic: 'IR',
    source: 'BBC News',
  },
  {
    id: 4,
    title: 'Master DSA with GeeksforGeeks',
    preview: 'GeeksforGeeks offers a comprehensive guide to Data Structures and Algorithms (DSA), ideal for coding enthusiasts. With tutorials on arrays, linked lists, and dynamic programming, it’s a go-to resource for preparing for interviews at top tech companies. Practice problems range from beginner to advanced levels.',
    topic: 'Tech/Education',
    source: 'GeeksforGeeks',
  },
  {
    id: 5,
    title: 'CodeChef Contests This Month',
    preview: 'CodeChef is hosting multiple coding contests this month, featuring challenges for all skill levels. Participants can earn ratings and prizes, with problems designed to enhance problem-solving skills. The platform also provides editorials and tutorials post-contest to aid learning.',
    topic: 'Tech/Education',
    source: 'CodeChef',
  },
  {
    id: 6,
    title: 'LeetCode Premium Problems',
    preview: 'LeetCode’s premium subscription unlocks advanced problems and mock interviews, perfect for tech job preparation. Topics include system design and optimized solutions, with a community-driven approach to learning. It’s a valuable tool for mastering competitive programming.',
    topic: 'Tech/Education',
    source: 'LeetCode',
  },
];

const DashboardPage = () => {
  const [stats, setStats] = useState(mockUserStats);
  const [articles, setArticles] = useState(mockArticles);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [hasDailyGoal, setHasDailyGoal] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [streakHistory, setStreakHistory] = useState([
    { day: 1, words: 1000 },
    { day: 2, words: 1200 },
    { day: 3, words: 1500 },
    { day: 4, words: 1800 },
    { day: 7, words: 2000 },
  ]);

  useEffect(() => {
    // TODO: Fetch real data from Firebase/Auth for user and stats
    // TODO: Fetch API-based recommendations (e.g., GFG, CodeChef, LeetCode APIs)
    // Example API call structure:
    // fetch('https://api.example.com/articles?topics=tech,education')
    //   .then(response => response.json())
    //   .then(data => setArticles(data));

    // Auto-advance carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const handleAddWords = () => {
    setStats((prev) => ({
      ...prev,
      totalWords: prev.totalWords + 1000,
      avgWordsPerDay: Math.round((prev.totalWords + 1000) / (prev.streak + 1)),
    }));
  };

  const toggleDailyGoal = () => {
    setHasDailyGoal(!hasDailyGoal);
    if (!hasDailyGoal) setDailyGoal(2000); // Default goal
  };

  const progress = hasDailyGoal ? Math.min((stats.avgWordsPerDay / dailyGoal) * 100, 100) : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 p-6 font-sans text-gray-800'>
      {/* Sidebar for Quick Access and User Info - Always visible */}
      <aside className='fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-medium mb-8'>EditorialChain</h1>
          {/* Highlighted User Information */}
          <div className='mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg'>
            <h3 className='text-lg font-medium text-indigo-700'>Welcome, {mockUser.name}</h3>
            <p className='text-sm text-gray-600'>{mockUser.email}</p>
            <p className='text-sm text-gray-600 mt-1'>{mockUser.summary}</p>
          </div>
          {/* Navigation */}
          <nav className='flex flex-col space-y-4'>
            <Link to='/leaderboard' className='text-lg hover:text-indigo-600 transition-colors'>Leaderboard</Link>
            <Link to='/settings' className='text-lg hover:text-indigo-600 transition-colors'>Settings</Link>
            <Link to='/about' className='text-lg hover:text-indigo-600 transition-colors'>About</Link>
          </nav>
        </div>
        <button className='text-sm text-gray-500 hover:text-gray-700' onClick={handleAddWords}>
          Add 1000 Words (Test)
        </button>
      </aside>

      {/* Main Content */}
      <main className='ml-64 p-6'>
        {/* Stats Section with Streak Visualization */}
        <section className='mb-12'>
          <h2 className='text-2xl font-medium mb-4'>Your Progress</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium'>Current Streak</h3>
              <p className='text-3xl'>{stats.streak} days</p>
              <div className='mt-2 h-1 bg-gray-200 rounded'>
                <div style={{ width: `${(stats.streak / 30) * 100}%` }} className='h-full bg-blue-400 rounded'></div>
              </div>
              <div className='mt-4 text-sm flex space-x-2'>
                {streakHistory.map((entry) => (
                  <div key={entry.day} className='text-center'>
                    <span>Day {entry.day}: {entry.words}w</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium'>Total Words Read</h3>
              <p className='text-3xl'>{stats.totalWords.toLocaleString()}</p>
            </div>
            <div className='bg-white p-4 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium'>Avg Words/Day</h3>
              <p className='text-3xl'>{stats.avgWordsPerDay}</p>
              <button
                className='mt-2 text-sm text-blue-500 hover:underline'
                onClick={toggleDailyGoal}
              >
                {hasDailyGoal ? 'Remove Goal' : 'Set Daily Goal'}
              </button>
              {hasDailyGoal && (
                <div className='mt-2'>
                  <div className='w-full bg-gray-200 rounded-full h-1'>
                    <div
                      className='bg-green-400 h-1 rounded-full'
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className='text-sm'>Goal: {dailyGoal}w | Progress: {progress.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Article Carousel */}
        <section>
          <h2 className='text-2xl font-medium mb-4'>Recommended Daily Articles</h2>
          <div className='relative overflow-hidden rounded-lg shadow-md bg-white'>
            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentArticleIndex * 100}%)` }}
            >
              {articles.map((article) => (
                <div key={article.id} className='w-full flex-shrink-0 p-6'>
                  <h3 className='text-xl font-medium mb-2'>{article.title}</h3>
                  <p className='text-gray-600 mb-4'>
                    {article.preview.length > 150
                      ? article.preview.substring(0, 150) + '...'
                      : article.preview}
                  </p>
                  <span className='text-sm text-gray-500'>{article.topic}</span>
                  <p className='text-xs text-gray-400 mt-1'>Source: {article.source}</p>
                  <Link to='/article' className='block mt-2 text-blue-500 hover:underline'>Read Now</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;