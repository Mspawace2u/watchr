import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const NotificationIndicator = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('watchr_user') || 'A');
  }, []);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`);
        const data = await res.json();
        if (!cancelled) setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh periodically for prototype
    const interval = setInterval(fetchNotifications, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  if (loading || notifications.length === 0) return null;

  const firstNotif = notifications[0];

  return (
    <motion.a
      href={`/reveal?id=${firstNotif.recommendation_id}&view=1`}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 bg-brand-text text-brand-bg px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(243,244,246,0.3)] group transition-all"
    >
      <div className="relative">
        <Bell size={16} fill="currentColor" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-totes-turquoise rounded-full animate-ping"></span>
      </div>
      <span className="text-[10px] font-urbanist font-bold tracking-widest uppercase">
        {notifications.length} {notifications.length === 1 ? 'Reveal' : 'Reveals'} Ready
      </span>
    </motion.a>
  );
};

export default NotificationIndicator;
