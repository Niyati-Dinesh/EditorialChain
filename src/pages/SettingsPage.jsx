import React, { useState, useEffect } from 'react';
import {
  Settings,
  Palette,
  BookOpen,
  Filter,
  BarChart3,
  Download,
  Upload,
  Bell,
  Save,
  RotateCcw,
  // Removed Eye, EyeOff, Volume2, VolumeX as they aren't used currently
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx'; // 1. Import AppContext

const SettingsPage = () => {
  // 2. Get theme and toggleTheme from context
  const { theme, toggleTheme } = useAppContext();
  const [activeTab, setActiveTab] = useState('appearance');

  // 3. Removed 'theme' from local state, it's now managed globally
  const [settings, setSettings] = useState({
    // Appearance (theme removed)
    fontSize: 'medium',
    fontFamily: 'inter',

    // Reading Preferences
    readingSpeed: 'normal',
    vocabularyLevel: 'intermediate',
    autoScroll: false,
    highlightMode: 'word',

    // Topic Filters
    topics: {
      technology: true,
      science: true,
      business: false,
      health: true,
      arts: false,
      politics: false,
      sports: false,
      entertainment: true
    },

    // Notifications
    notifications: {
      dailyReminder: true,
      streakReminder: true,
      newArticle: true,
      achievement: true,
      weeklyReport: false,
      soundEnabled: true,
      emailDigest: true
    },

    // Data settings (moved from analytics/privacy for clarity)
    readingHistory: true,
    analyticsSharing: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings (excluding theme) from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('editorialChainSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Remove theme if it exists in saved data to avoid overriding context
      delete parsedSettings.theme;
      setSettings(prev => ({ ...prev, ...parsedSettings }));
    }
  }, []);

  // Save settings (excluding theme) to localStorage
  useEffect(() => {
    // Create a copy of settings without the theme property to save locally
    const { theme: currentTheme, ...settingsToSave } = settings;
    localStorage.setItem('editorialChainSettings', JSON.stringify(settingsToSave));
  }, [settings]);

  // Handler for nested settings (like notifications, topics)
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Handler for direct settings (like fontSize, fontFamily)
  const handleDirectSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 4. Update handleThemeChange to use context's toggleTheme
  const handleThemeChange = (newTheme) => {
    if (theme !== newTheme) {
      toggleTheme(); // Call the function from context
    }
  };


  const handleSave = async () => {
    setIsLoading(true);
    // TODO: In a real app, save 'settings' to Firestore user document
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log("Settings saved (locally):", settings);
    console.log("Current theme (global):", theme);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset local settings state
      setSettings({
        fontSize: 'medium',
        fontFamily: 'inter',
        readingSpeed: 'normal',
        vocabularyLevel: 'intermediate',
        autoScroll: false,
        highlightMode: 'word',
        topics: { technology: true, science: true, business: false, health: true, arts: false, politics: false, sports: false, entertainment: true },
        notifications: { dailyReminder: true, streakReminder: true, newArticle: true, achievement: true, weeklyReport: false, soundEnabled: true, emailDigest: true },
        readingHistory: true,
        analyticsSharing: false
      });
      // Optionally reset theme via context if desired
      // if (theme !== 'light') { toggleTheme(); }
    }
  };

  // Export/Import remain the same but will only handle local state settings
  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2); // Excludes theme
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'editorialchain-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
     const file = event.target.files[0];
     if (file) {
       const reader = new FileReader();
       reader.onload = (e) => {
         try {
           const importedSettings = JSON.parse(e.target.result);
           // Ensure theme from imported file doesn't override context
           delete importedSettings.theme;
           setSettings(importedSettings);
           alert('Settings imported successfully!');
         } catch (error) {
           alert('Invalid settings file');
         }
       };
       reader.readAsText(file);
       event.target.value = null; // Reset file input
     }
  };


  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'reading', label: 'Reading', icon: BookOpen },
    { id: 'topics', label: 'Topics', icon: Filter },
    // Removed Analytics tab for now as it mostly showed read-only data
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Download } // Includes history/sharing toggles now
  ];

  // --- Render Functions with Dark Mode Classes ---

  const renderAppearanceSettings = () => (
    <div className="space-y-8">
      <div>
        {/* 5. Added dark mode classes for label */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleThemeChange('light')} // Use new handler
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              theme === 'light' // Check context theme
                ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
            }`}
          >
            <div className="w-full h-8 bg-white border dark:border-gray-600 rounded mb-2"></div>
             {/* 6. Added dark mode classes for text */}
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Light</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Clean and bright</div>
          </button>
          <button
            onClick={() => handleThemeChange('dark')} // Use new handler
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              theme === 'dark' // Check context theme
                ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
             }`}
          >
            <div className="w-full h-8 bg-gray-800 border border-gray-600 rounded mb-2"></div>
             {/* 7. Added dark mode classes for text */}
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Easy on the eyes</div>
          </button>
        </div>
      </div>

      <div>
         {/* 8. Added dark mode classes for label */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Size</label>
        <div className="flex space-x-2 sm:space-x-4">
          {['small', 'medium', 'large'].map(size => (
            <button
              key={size}
              onClick={() => handleDirectSettingChange('fontSize', size)}
               // 9. Added dark mode classes for buttons
              className={`px-3 sm:px-4 py-2 rounded-lg border text-sm transition-all ${
                settings.fontSize === size
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
                  : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 bg-white dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
         {/* 10. Added dark mode classes for label and select */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Family</label>
        <select
          value={settings.fontFamily}
          onChange={(e) => handleDirectSettingChange('fontFamily', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
        >
          <option value="inter">Inter (Default)</option>
          <option value="system">System Font</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </div>
    </div>
  );

  // --- Other render functions need similar dark mode updates ---

  const renderReadingSettings = () => (
     // 11. Add dark mode classes throughout this section
    <div className="space-y-8 text-gray-900 dark:text-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reading Speed</label>
        <div className="space-y-2">
          {['slow', 'normal', 'fast'].map(speed => (
            <label key={speed} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="readingSpeed"
                value={speed}
                checked={settings.readingSpeed === speed}
                onChange={(e) => handleDirectSettingChange('readingSpeed', e.target.value)}
                className="mr-3 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
              />
              <span className="capitalize text-sm">{speed}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Vocabulary Level</label>
        <select
          value={settings.vocabularyLevel}
          onChange={(e) => handleDirectSettingChange('vocabularyLevel', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="space-y-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoScroll}
            onChange={(e) => handleDirectSettingChange('autoScroll', e.target.checked)}
             className="mr-3 h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
          />
          <span className="text-sm">Auto-scroll during reading</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Highlight Mode</label>
          <div className="flex space-x-2 sm:space-x-4">
            {['word', 'sentence', 'paragraph'].map(mode => (
              <button
                key={mode}
                onClick={() => handleDirectSettingChange('highlightMode', mode)}
                className={`px-3 sm:px-4 py-2 rounded-lg border text-sm transition-all ${
                  settings.highlightMode === mode
                     ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-700'
                     : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 bg-white dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                 }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

   const renderTopicSettings = () => (
     <div className="space-y-4">
       <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
         Choose topics you're interested in to personalize your reading experience.
       </p>
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
         {Object.entries(settings.topics).map(([topic, enabled]) => (
           <label key={topic} className={`flex items-center p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${enabled ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}>
             <input
               type="checkbox"
               checked={enabled}
               onChange={(e) => handleSettingChange('topics', topic, e.target.checked)}
               className="mr-3 h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
             />
             <span className={`capitalize text-sm font-medium ${enabled ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{topic}</span>
           </label>
         ))}
       </div>
     </div>
   );

   // Removed renderAnalyticsSettings

   const renderNotificationSettings = () => (
     <div className="space-y-6 text-gray-900 dark:text-gray-200">
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
       <div className="space-y-4">
         {Object.entries(settings.notifications).map(([key, value]) => (
           <label key={key} className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               checked={value}
               onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                className="mr-3 h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
             />
             <span className="text-sm capitalize">
                {/* Simple formatting for keys */}
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
             </span>
           </label>
         ))}
       </div>
     </div>
   );

   const renderDataSettings = () => (
     // 12. Added dark mode text/button colors
     <div className="space-y-8 text-gray-900 dark:text-gray-200">
        {/* Reading History & Analytics Sharing */}
       <div className="space-y-4 border-b dark:border-gray-700 pb-8">
            <h3 className="text-lg font-medium">Privacy & Data Usage</h3>
         <label className="flex items-center cursor-pointer">
           <input
             type="checkbox"
             checked={settings.readingHistory}
             onChange={(e) => handleDirectSettingChange('readingHistory', e.target.checked)}
              className="mr-3 h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
           />
           <span className="text-sm">Track reading history</span>
         </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">Allows the app to remember which articles you've read.</p>

         <label className="flex items-center cursor-pointer">
           <input
             type="checkbox"
             checked={settings.analyticsSharing}
             onChange={(e) => handleDirectSettingChange('analyticsSharing', e.target.checked)}
              className="mr-3 h-4 w-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
           />
           <span className="text-sm">Share anonymous analytics to improve the platform</span>
         </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 pl-7">Helps us understand usage patterns and fix bugs. No personal data is shared.</p>
       </div>

        {/* Export */}
       <div>
         <h3 className="font-medium text-gray-900 dark:text-white mb-2">Export Your Data</h3>
         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
           Download your settings preferences.
         </p>
         <button
           onClick={handleExport}
           className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors text-sm font-medium"
         >
           <Download className="w-4 h-4 mr-2" />
           Export Settings
         </button>
       </div>

        {/* Import */}
       <div>
         <h3 className="font-medium text-gray-900 dark:text-white mb-2">Import Settings</h3>
         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
           Upload a previously exported settings file.
         </p>
         <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer text-sm font-medium">
           <Upload className="w-4 h-4 mr-2" />
           Import Settings File
           <input
             type="file"
             accept=".json"
             onChange={handleImport}
             className="hidden"
           />
         </label>
       </div>

        {/* Reset */}
       <div className="border-t dark:border-gray-700 pt-8">
         <h3 className="font-medium text-gray-900 dark:text-white mb-2">Reset Settings</h3>
         <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
           Reset all settings (except theme) to their default values. This action cannot be undone.
         </p>
         <button
           onClick={handleReset}
           className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm font-medium"
         >
           <RotateCcw className="w-4 h-4 mr-2" />
           Reset to Defaults
         </button>
       </div>
     </div>
   );


  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance': return renderAppearanceSettings();
      case 'reading': return renderReadingSettings();
      case 'topics': return renderTopicSettings();
      // case 'analytics': return renderAnalyticsSettings(); // Removed
      case 'notifications': return renderNotificationSettings();
      case 'data': return renderDataSettings();
      default: return renderAppearanceSettings();
    }
  };

  return (
    // 13. Added dark mode classes for page background
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 14. Added dark mode classes for main card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
                {/* 15. Added dark mode text */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-md text-sm transition-colors flex-1 sm:flex-none"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 transition-colors text-sm font-medium flex-1 sm:flex-none"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            {/* 16. Added dark mode for sidebar border and nav */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
              <nav className="p-4 space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                       // 17. Added dark mode for active/inactive tab states
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 min-h-[400px]"> {/* Added min-height */}
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          // 18. Added dark mode for success message
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 text-sm">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;