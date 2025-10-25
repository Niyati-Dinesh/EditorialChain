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
  Eye,
  EyeOff,
  Volume2,
  VolumeX
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'light',
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
    
    // Privacy
    profileVisibility: 'public',
    readingHistory: true,
    analyticsSharing: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('editorialChainSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('editorialChainSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleDirectSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'light',
        fontSize: 'medium',
        fontFamily: 'inter',
        readingSpeed: 'normal',
        vocabularyLevel: 'intermediate',
        autoScroll: false,
        highlightMode: 'word',
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
        notifications: {
          dailyReminder: true,
          streakReminder: true,
          newArticle: true,
          achievement: true,
          weeklyReport: false,
          soundEnabled: true,
          emailDigest: true
        },
        profileVisibility: 'public',
        readingHistory: true,
        analyticsSharing: false
      });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
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
          setSettings(importedSettings);
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'reading', label: 'Reading', icon: BookOpen },
    { id: 'topics', label: 'Topics', icon: Filter },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleDirectSettingChange('theme', 'light')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              settings.theme === 'light' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-8 bg-white border rounded mb-2"></div>
            <div className="text-sm font-medium">Light</div>
            <div className="text-xs text-gray-500">Clean and bright</div>
          </button>
          <button
            onClick={() => handleDirectSettingChange('theme', 'dark')}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              settings.theme === 'dark' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-8 bg-gray-800 border rounded mb-2"></div>
            <div className="text-sm font-medium">Dark</div>
            <div className="text-xs text-gray-500">Easy on the eyes</div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
        <div className="flex space-x-4">
          {['small', 'medium', 'large'].map(size => (
            <button
              key={size}
              onClick={() => handleDirectSettingChange('fontSize', size)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                settings.fontSize === size
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Font Family</label>
        <select
          value={settings.fontFamily}
          onChange={(e) => handleDirectSettingChange('fontFamily', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="inter">Inter</option>
          <option value="system">System Font</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </div>
    </div>
  );

  const renderReadingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Reading Speed</label>
        <div className="space-y-2">
          {['slow', 'normal', 'fast'].map(speed => (
            <label key={speed} className="flex items-center">
              <input
                type="radio"
                name="readingSpeed"
                value={speed}
                checked={settings.readingSpeed === speed}
                onChange={(e) => handleDirectSettingChange('readingSpeed', e.target.value)}
                className="mr-3"
              />
              <span className="capitalize">{speed}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Vocabulary Level</label>
        <select
          value={settings.vocabularyLevel}
          onChange={(e) => handleDirectSettingChange('vocabularyLevel', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.autoScroll}
            onChange={(e) => handleDirectSettingChange('autoScroll', e.target.checked)}
            className="mr-3"
          />
          <span>Auto-scroll during reading</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Highlight Mode</label>
          <div className="flex space-x-4">
            {['word', 'sentence', 'paragraph'].map(mode => (
              <button
                key={mode}
                onClick={() => handleDirectSettingChange('highlightMode', mode)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  settings.highlightMode === mode
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
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
      <p className="text-sm text-gray-600 mb-6">
        Choose topics you're interested in to personalize your reading experience.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(settings.topics).map(([topic, enabled]) => (
          <label key={topic} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleSettingChange('topics', topic, e.target.checked)}
              className="mr-3"
            />
            <span className="capitalize">{topic}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Reading Statistics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Articles Read:</span>
            <span className="ml-2 font-medium">47</span>
          </div>
          <div>
            <span className="text-blue-700">Current Streak:</span>
            <span className="ml-2 font-medium">12 days</span>
          </div>
          <div>
            <span className="text-blue-700">Total Reading Time:</span>
            <span className="ml-2 font-medium">23h 45m</span>
          </div>
          <div>
            <span className="text-blue-700">Words Learned:</span>
            <span className="ml-2 font-medium">156</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.readingHistory}
            onChange={(e) => handleDirectSettingChange('readingHistory', e.target.checked)}
            className="mr-3"
          />
          <span>Track reading history</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.analyticsSharing}
            onChange={(e) => handleDirectSettingChange('analyticsSharing', e.target.checked)}
            className="mr-3"
          />
          <span>Share anonymous analytics to improve the platform</span>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.dailyReminder}
            onChange={(e) => handleSettingChange('notifications', 'dailyReminder', e.target.checked)}
            className="mr-3"
          />
          <span>Daily reading reminder</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.streakReminder}
            onChange={(e) => handleSettingChange('notifications', 'streakReminder', e.target.checked)}
            className="mr-3"
          />
          <span>Streak maintenance reminders</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.newArticle}
            onChange={(e) => handleSettingChange('notifications', 'newArticle', e.target.checked)}
            className="mr-3"
          />
          <span>New article notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.achievement}
            onChange={(e) => handleSettingChange('notifications', 'achievement', e.target.checked)}
            className="mr-3"
          />
          <span>Achievement notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.weeklyReport}
            onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)}
            className="mr-3"
          />
          <span>Weekly reading report</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.soundEnabled}
            onChange={(e) => handleSettingChange('notifications', 'soundEnabled', e.target.checked)}
            className="mr-3"
          />
          <span>Sound notifications</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.emailDigest}
            onChange={(e) => handleSettingChange('notifications', 'emailDigest', e.target.checked)}
            className="mr-3"
          />
          <span>Email digest</span>
        </label>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Export Your Data</h3>
        <p className="text-sm text-gray-600 mb-4">
          Download all your settings, reading history, and preferences.
        </p>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Settings
        </button>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-4">Import Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a previously exported settings file.
        </p>
        <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Import Settings
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Reset Settings</h3>
        <p className="text-sm text-gray-600 mb-4">
          Reset all settings to their default values.
        </p>
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </button>
      </div>
  </div>
);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'reading':
        return renderReadingSettings();
      case 'topics':
        return renderTopicSettings();
      case 'analytics':
        return renderAnalyticsSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderAppearanceSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
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

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200">
              <nav className="p-4 space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50">
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
