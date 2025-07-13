'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import UserCard from './UserCard';

const InfiniteScrollUserFeed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 10;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const fetchUsers = useCallback(async (currentSkip = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://tech-test.raintor.com/api/users/GetUsersList?take=${take}&skip=${currentSkip}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.users && data.users.length > 0) {
        if (currentSkip === 0) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }
        setSkip(currentSkip + data.users.length);
        setHasMore(data.users.length === take);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [take]);

  // Load more users when bottom is reached
  useEffect(() => {
    if (inView && !loading && hasMore) {
      fetchUsers(skip);
    }
  }, [inView, loading, hasMore, skip, fetchUsers]);

  // Initial load
  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const retryFetch = () => {
    setError(null);
    setSkip(0);
    setHasMore(true);
    fetchUsers(0);
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error && users.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Feed</h2>
        <p className="text-gray-600">
          Showing {users.length} users
          {hasMore && !loading && ' - Scroll down to load more'}
        </p>
      </div>

      {/* Users Grid */}
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Error State for subsequent loads */}
      {error && users.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={retryFetch}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && users.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">You've reached the end of the user list</p>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={ref} className="h-4" />
    </div>
  );
};

export default InfiniteScrollUserFeed; 