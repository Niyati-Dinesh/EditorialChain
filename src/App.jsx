import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed useLocation, not needed here
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DailyArticlePage from './pages/DailyArticlePage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import CollaboratorPage from './pages/CollaboratorPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import QuizPage from './pages/QuizPage.jsx'; // 1. Import the new QuizPage

import { useAppContext } from './context/AppContext.jsx';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

function App() {
  const { currentUser, loading, theme } = useAppContext();

  // Global dark mode class is applied via AppContext

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return (
      <ErrorBoundary>
        <AuthPage />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/article" element={<DailyArticlePage />} />
            {/* 2. ADDED route for the QuizPage */}
            <Route path="/quiz/:articleId" element={<QuizPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/collaborators" element={<CollaboratorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<DashboardPage />} /> {/* Redirect if logged in */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;