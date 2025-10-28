import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/auth.js';
import { useAppContext } from '../context/AppContext.jsx';

const ProfilePage = () => {
  const { currentUser, loading } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Use Firestore displayName primarily, fallback to auth
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    // Check against auth.currentUser as currentUser might be slightly delayed
    if (!auth.currentUser) return;

    const currentAuthUser = auth.currentUser; // Get the currently authenticated user

    try {
      // Update Firebase Auth profile
      await updateProfile(currentAuthUser, {
        displayName: displayName,
      });

      // Update Firestore 'users' document
      const userRef = doc(db, 'users', currentAuthUser.uid);
      await updateDoc(userRef, {
        displayName: displayName,
      });

      setIsEditing(false);
      // Re-fetch or manually update context for immediate UI update is complex.
      // Easiest is to inform user or rely on next page load/login.
      alert('Profile updated! Changes might take a moment to reflect everywhere.');

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Improved date formatting to handle potential nulls/undefined
 const formatDate = (dateInput) => {
    if (!dateInput) return 'Not available';
    try {
      const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
      if (isNaN(date.getTime())) return 'Invalid Date'; // Check if date is valid
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Error';
    }
  };

  const formatDateTime = (dateInput) => {
    if (!dateInput) return 'Not available';
     try {
       const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
       if (isNaN(date.getTime())) return 'Invalid Date';
       return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
     } catch(e) {
        console.error("Error formatting datetime:", e);
        return 'Error';
     }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900 dark:text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={currentUser.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none dark:text-white dark:border-blue-500"
                          placeholder="Enter your name"
                        />
                        <div className="space-x-2">
                          <button
                            onClick={handleUpdateProfile}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setDisplayName(currentUser.displayName || '');
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                          {currentUser.displayName || 'Anonymous User'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{currentUser.email}</p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          Edit Name
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        currentUser.emailVerified // From Auth user object
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {currentUser.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Account Information
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-200">{currentUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  User ID
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-200 font-mono text-sm break-all">
                  {currentUser.uid}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Account Created
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                   {/* Use joinedAt from Firestore doc (currentUser now includes Firestore data) */}
                  {formatDate(currentUser.joinedAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Sign In
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-200">
                   {/* Use lastLogin from Firestore doc */}
                  {formatDateTime(currentUser.lastLogin)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Activity Statistics
            </h2>
          </div>
          <div className="px-6 py-4">
             {/* Adjusted grid columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/50 rounded-lg">
                 <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {/* Use streak from Firestore doc */}
                    {currentUser.streak || 0}
                 </div>
                 <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                   {/* Use nested stats object */}
                  {currentUser.stats?.articlesRead || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Articles Read</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentUser.stats?.commentsMade || 0}
                  </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Comments Made</div>
              </div>
               <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                     {/* Use totalLogins from Firestore doc */}
                    {currentUser.totalLogins || 0}
                 </div>
                 <div className="text-sm text-gray-600 dark:text-gray-400">Total Logins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;