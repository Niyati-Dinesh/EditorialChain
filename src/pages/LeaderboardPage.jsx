import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx'; // 1. Import context
import { db } from '../lib/auth.js'; // 2. Import Firestore db
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'; // 3. Import Firestore functions
import { Award, UserCheck, UserPlus } from 'lucide-react'; // Import icons for follow button

const LeaderboardPage = () => {
  const { currentUser } = useAppContext(); // Get current user if needed later
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [sortBy, setSortBy] = useState('streak'); // Default sort
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Increased users per page

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        let q;

        // Determine Firestore field to sort by
        let firestoreSortField = 'streak'; // Default
        if (sortBy === 'articlesRead') {
          firestoreSortField = 'stats.articlesRead'; // Assuming nested structure
        } else if (sortBy === 'name') {
           firestoreSortField = 'displayName'; // Sort by name
        }
        // Add more sorting criteria if needed, e.g., readingSpeed if stored

        // Create the query
        // Note: Firestore requires an index for composite queries or ordering by fields not in equality filters.
        // You might need to create indexes in your Firebase console.
        q = query(usersRef, orderBy(firestoreSortField, 'desc'), limit(50)); // Fetch top 50 initially

        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id, // Use Firestore document ID
          name: doc.data().displayName || 'Anonymous',
          streak: doc.data().streak || 0,
          // Safely access nested stats
          articlesRead: doc.data().stats?.articlesRead || 0,
          // Reading speed needs to be stored in Firestore to sort/display
          readingSpeed: doc.data().stats?.averageWPM || 0, // Example: Assuming 'averageWPM' is stored
          photoURL: doc.data().photoURL, // Get photoURL
        }));

         // If sorting by name client-side after fetch (Firestore doesn't sort case-insensitively easily)
         if (sortBy === 'name') {
           fetchedUsers.sort((a, b) => a.name.localeCompare(b.name));
         }

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Handle error state if needed
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [sortBy]); // Refetch when sortBy changes


  const handleSort = (criteria) => {
     // Prevent re-sorting by name if already sorted by name, as we handle that client-side
     if (criteria === 'name' && sortBy === 'name') return;
    setSortBy(criteria);
    setCurrentPage(1); // Reset to first page on sort change
  };


  // Pagination logic remains similar
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Follow state remains local for now
  const [following, setFollowing] = useState({});
  const toggleFollow = (userId) => {
    setFollowing((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    // TODO: Add logic to update following status in Firestore if needed
  };

  return (
    // 4. Added dark mode background, text
    <div className='p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
       {/* 5. Added dark mode text */}
      <h1 className='text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2'>
         <Award className="text-yellow-500" /> Leaderboard
      </h1>

      {loading ? (
           <div className="flex justify-center items-center py-10">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
           </div>
      ) : (
          <>
             <div className='overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700'>
                 {/* 6. Added dark mode background, border, table */}
               <table className='min-w-full bg-white dark:bg-gray-800'>
                 {/* 7. Added dark mode header */}
                 <thead className='bg-indigo-600 dark:bg-gray-700 text-white dark:text-gray-300 uppercase text-xs tracking-wider'>
                   <tr>
                     <th className='py-3 px-4 text-left font-semibold'>Rank</th>
                     <th className='py-3 px-4 text-left font-semibold cursor-pointer hover:bg-indigo-700 dark:hover:bg-gray-600' onClick={() => handleSort('name')}>
                        User {sortBy === 'name' && '▼'}
                     </th>
                      {/* Updated Sort Headers */}
                     <th className='py-3 px-4 text-left font-semibold cursor-pointer hover:bg-indigo-700 dark:hover:bg-gray-600' onClick={() => handleSort('streak')}>
                       Streak {sortBy === 'streak' && '▼'}
                     </th>
                     <th className='py-3 px-4 text-left font-semibold cursor-pointer hover:bg-indigo-700 dark:hover:bg-gray-600' onClick={() => handleSort('articlesRead')}>
                       Articles {sortBy === 'articlesRead' && '▼'}
                     </th>
                     <th className='py-3 px-4 text-left font-semibold cursor-pointer hover:bg-indigo-700 dark:hover:bg-gray-600' onClick={() => handleSort('readingSpeed')}>
                       Avg Speed (WPM) {sortBy === 'readingSpeed' && '▼'}
                     </th>
                     <th className='py-3 px-4 text-left font-semibold'>Actions</th>
                   </tr>
                 </thead>
                 {/* 8. Added dark mode body rows */}
                 <tbody className='text-gray-700 dark:text-gray-300'>
                   {currentUsers.map((user, index) => {
                     const rank = indexOfFirstUser + index + 1;
                     const isCurrentUser = currentUser && user.id === currentUser.uid; // Check if it's the logged-in user

                     return (
                       <tr
                         key={user.id}
                         // 9. Highlight current user, add dark mode hover/border
                         className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${isCurrentUser ? 'bg-indigo-50 dark:bg-indigo-900/30 font-semibold' : ''}`}
                        >
                         <td className='py-3 px-4 text-center w-16'>
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                         </td>
                         <td className='py-3 px-4 font-medium'>
                            <div className="flex items-center gap-3">
                                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={user.name} className="w-8 h-8 rounded-full object-cover"/>
                                {/* Link might go to a user profile page later */}
                                <span className={`truncate ${isCurrentUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {user.name}
                                    {isCurrentUser && ' (You)'}
                                </span>
                            </div>
                         </td>
                         <td className='py-3 px-4'>{user.streak}</td>
                         <td className='py-3 px-4'>{user.articlesRead}</td>
                         <td className='py-3 px-4'>{user.readingSpeed > 0 ? user.readingSpeed : 'N/A'}</td>
                         <td className='py-3 px-4'>
                            {/* Disable follow button for self */}
                            {!isCurrentUser && (
                                <button
                                    className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                                        following[user.id]
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'
                                    }`}
                                    onClick={() => toggleFollow(user.id)}
                                >
                                    {following[user.id] ? <UserCheck size={14}/> : <UserPlus size={14} />}
                                    {following[user.id] ? 'Following' : 'Follow'}
                                </button>
                            )}
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>

             {/* Pagination */}
             <div className='mt-6 flex justify-center items-center space-x-1'>
               {/* Previous Button */}
               <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
               >
                 Prev
               </button>

               {/* Page Numbers */}
               {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                 <button
                   key={number}
                    // 10. Added dark mode pagination buttons
                   className={`mx-1 px-3 py-1 rounded text-sm transition-colors ${
                     currentPage === number
                       ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                       : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                   }`}
                   onClick={() => paginate(number)}
                 >
                   {number}
                 </button>
               ))}

                 {/* Next Button */}
                 <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                 >
                   Next
                 </button>
             </div>
          </>
      )}
    </div>
  );
};

export default LeaderboardPage;