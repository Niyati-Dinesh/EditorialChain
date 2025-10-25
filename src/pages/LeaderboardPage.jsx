import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data (replace with real Firebase fetch)
const mockUsers = [
  { id: 1, name: 'User1', streak: 15, articlesRead: 45, readingSpeed: 250 },
  { id: 2, name: 'User2', streak: 22, articlesRead: 60, readingSpeed: 300 },
  { id: 3, name: 'User3', streak: 10, articlesRead: 30, readingSpeed: 220 },
  { id: 4, name: 'User4', streak: 18, articlesRead: 50, readingSpeed: 280 },
  { id: 5, name: 'User5', streak: 5, articlesRead: 20, readingSpeed: 200 },
  { id: 6, name: 'User6', streak: 12, articlesRead: 35, readingSpeed: 260 },
  { id: 7, name: 'User7', streak: 8, articlesRead: 25, readingSpeed: 230 },
];

const LeaderboardPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [sortBy, setSortBy] = useState('streak');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    sortUsers(sortBy);
  }, [sortBy]);

  const sortUsers = (criteria) => {
    const sorted = [...mockUsers].sort((a, b) => b[criteria] - a[criteria]);
    setUsers(sorted);
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [following, setFollowing] = useState({});

  const toggleFollow = (userId) => {
    setFollowing((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className='p-8 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Leaderboard</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md'>
          <thead className='bg-indigo-600 text-white'>
            <tr>
              <th className='py-3 px-4 text-left cursor-pointer' onClick={() => handleSort('streak')}>
                Rank
              </th>
              <th className='py-3 px-4 text-left cursor-pointer' onClick={() => handleSort('name')}>
                User
              </th>
              <th className='py-3 px-4 text-left cursor-pointer' onClick={() => handleSort('streak')}>
                Streaks <span className={sortBy === 'streak' ? 'text-yellow-300' : ''}>▼</span>
              </th>
              <th className='py-3 px-4 text-left cursor-pointer' onClick={() => handleSort('articlesRead')}>
                Articles Read <span className={sortBy === 'articlesRead' ? 'text-yellow-300' : ''}>▼</span>
              </th>
              <th className='py-3 px-4 text-left cursor-pointer' onClick={() => handleSort('readingSpeed')}>
                Reading Speed (wpm) <span className={sortBy === 'readingSpeed' ? 'text-yellow-300' : ''}>▼</span>
              </th>
              <th className='py-3 px-4 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id} className='hover:bg-gray-100 border-b'>
                <td className='py-3 px-4'>{indexOfFirstUser + index + 1}</td>
                <td className='py-3 px-4 font-semibold'>
                  <Link to={/profile/} className='text-blue-500 hover:underline'>
                    {user.name}
                  </Link>
                </td>
                <td className='py-3 px-4'>{user.streak}</td>
                <td className='py-3 px-4'>{user.articlesRead}</td>
                <td className='py-3 px-4'>{user.readingSpeed}</td>
                <td className='py-3 px-4'>
                  <button
                    className={'px-3 py-1 rounded ' + (following[user.id] ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600') + ' text-white'}
                    onClick={() => toggleFollow(user.id)}
                  >
                    {following[user.id] ? 'Unfollow' : 'Follow'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className='mt-4 flex justify-center'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            className={'mx-1 px-3 py-1 rounded ' + (currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300')}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
