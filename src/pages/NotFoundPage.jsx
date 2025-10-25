import React from 'react';
import { Home, Search, BookOpen, ArrowLeft, FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
      <div className="max-w-2xl w-full text-center">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <div className="w-20  mt-5 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600" style={{ fontFamily: "'Libertinus Serif', serif" }}>
            404
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FileQuestion className="w-24 h-24 text-slate-300 opacity-50" />
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Libertinus Serif', serif" }}>
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Oops! The article you're looking for seems to have wandered off. 
          Let's get you back on track with your reading journey.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Go to Homepage</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 bg-white text-slate-700 px-8 py-3 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Go Back</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Libertinus Serif', serif" }}>
            While you're here...
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="/article"
              className="flex flex-col items-center p-4 rounded-xl hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Daily Articles</span>
            </a>
            
            <a
              href="/"
              className="flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                <Home className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Home</span>
            </a>
            
            <a
              href="/leaderboard"
              className="flex flex-col items-center p-4 rounded-xl hover:bg-purple-50 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <div className="text-purple-600 font-bold text-lg">🏆</div>
              </div>
              <span className="text-sm font-medium text-slate-700">Leaderboard</span>
            </a>
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-sm text-slate-500">
          Lost? Need help? Check our{' '}
          <a href="/help" className="text-blue-600 hover:text-blue-700 font-medium">
            Help Center
          </a>
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
    </div>
  );
};

export default NotFoundPage;