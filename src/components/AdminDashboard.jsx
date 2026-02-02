import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

const oneWeekAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBoards: 0,
    totalLanes: 0,
    totalCards: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const usersRef = collection(db, 'users');
        const boardsRef = collection(db, 'boards');

        const [usersCount, boardsCount] = await Promise.all([
          getCountFromServer(usersRef),
          getCountFromServer(boardsRef),
        ]);

        const activeQuery = query(usersRef, where('lastActive', '>=', oneWeekAgo()));
        const activeCount = await getCountFromServer(activeQuery);

        const boardsSnap = await getDocs(boardsRef);
        let totalLanes = 0;
        let totalCards = 0;

        boardsSnap.forEach(docSnap => {
          const lanes = docSnap.data().lanes || [];
          totalLanes += lanes.length;
          lanes.forEach(lane => {
            const rows = lane.rows || [];
            rows.forEach(row => {
              totalCards += (row.cards || []).length;
            });
          });
        });

        if (isMounted) {
          setStats({
            totalUsers: usersCount.data().count || 0,
            activeUsers: activeCount.data().count || 0,
            totalBoards: boardsCount.data().count || 0,
            totalLanes,
            totalCards,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load admin metrics.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      loadStats();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-8 px-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          <span className="text-xs text-gray-500">Last 7 days active</span>
        </div>
        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading metrics…</div>
        ) : error ? (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Registered Users</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Active Users</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{stats.activeUsers}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Boards</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalBoards}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Lanes</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalLanes}</div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Cards</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalCards}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
