import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from '../lib/auth.js';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// 1. Create the Context
const AppContext = createContext();

// 2. Create the Provider
export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // --- Theme Management ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // --- Streak & Stats Logic (Combined with Auth) ---
  const handleUserLogin = useCallback(async (user) => {
    if (!user) return null; // Return null if no user
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const today = new Date(); // Use full date for comparison
      let userData = {};
      let needsUpdate = false;

      if (!userDoc.exists()) {
        // New user
        userData = {
          displayName: user.displayName || 'Anonymous',
          email: user.email || '',
          photoURL: user.photoURL || '',
          joinedAt: serverTimestamp(),
          lastLogin: serverTimestamp(), // Use server timestamp for consistency
          streak: 1,
          // Use nested stats object as in ProfilePage
          stats: {
            articlesRead: 0,
            timeSpent: 0, // Example stat
            commentsMade: 0, // Example stat
          },
          totalLogins: 1, // Add totalLogins
        };
        await setDoc(userRef, userData);
        // We fetch again after setDoc to get serverTimestamps resolved
        const newUserSnap = await getDoc(userRef);
        userData = newUserSnap.data();

      } else {
        // Returning user
        userData = userDoc.data();
        const lastLoginDate = userData.lastLogin?.toDate();
        let currentStreak = userData.streak || 0;
        let newTotalLogins = (userData.totalLogins || 0) + 1;


        if (lastLoginDate) {
          const lastLoginDayStart = new Date(lastLoginDate);
          lastLoginDayStart.setHours(0, 0, 0, 0);

          const todayStart = new Date(today);
          todayStart.setHours(0, 0, 0, 0);

          const diffTime = todayStart.getTime() - lastLoginDayStart.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Calculate difference in days

          if (diffDays === 1) {
            // Consecutive login
            currentStreak += 1;
            needsUpdate = true;
          } else if (diffDays > 1) {
            // Missed a day (or more)
            currentStreak = 1;
            needsUpdate = true;
          }
          // If diffDays is 0 (same day), streak doesn't change, but we still update lastLogin
          if (diffDays >= 0) { // Update if same day or later
             needsUpdate = true;
          }
        } else {
           // First login since implementing streak or lastLogin field missing
           currentStreak = 1;
           needsUpdate = true;
        }


        if (needsUpdate) {
            await updateDoc(userRef, {
              lastLogin: serverTimestamp(), // Always update lastLogin
              streak: currentStreak,
              totalLogins: newTotalLogins,
            });
            // Update local state immediately after successful DB update
            userData.streak = currentStreak;
            userData.lastLogin = new Date(); // Approximate with local time for immediate UI update
            userData.totalLogins = newTotalLogins;
        } else {
             // Fetch existing data if no update needed (though unlikely with lastLogin update)
             userData = userDoc.data();
        }
      }
      return userData; // Return the Firestore data

    } catch (error) {
      console.error('Error handling user login:', error);
      return null; // Return null on error
    }
  }, []);

  // --- Auth State Listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Process Firestore data when auth state changes to logged in
          const firestoreData = await handleUserLogin(user);
          if (firestoreData) {
            setCurrentUser({ ...user, ...firestoreData }); // Merge Auth and Firestore data
          } else {
              // Fallback if firestore update failed but user is authenticated
              console.warn('Firestore data handling failed, using auth data only.');
              setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setCurrentUser(null); // Ensure user is logged out on error
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [handleUserLogin]); // Include handleUserLogin dependency


  const googleSignIn = useCallback(async () => {
    // setLoading(true); // Set loading true immediately for better UX
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user and loading state
    } catch (error) {
      console.error('Google sign-in failed:', error);
      // setLoading(false); // Ensure loading is false if sign-in fails immediately
      throw error;
    }
  }, []);

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will set currentUser to null
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    theme,
    toggleTheme,
    googleSignIn,
    logOut,
  };

  return (
    <AppContext.Provider value={value}>
       {/* Removed !loading check here, App.jsx handles loading state display */}
      {children}
    </AppContext.Provider>
  );
}

// 3. Custom hook for context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};