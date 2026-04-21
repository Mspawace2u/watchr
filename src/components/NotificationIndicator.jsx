import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

// Reveal alert surfaced to the recommender when the other user finishes a
// reveal. Lives in the right column of /guide, stacked BELOW the "Drop a Rec"
// nav so the nav row stays aligned with "Home ←" on the left.
//
// Styling per session spec:
// - No pill background. Icon + text sit inline on the page surface.
// - Bell icon is Electric Purple; text is brand-white. Both pulse together
//   between 40% and 100% opacity.
// - Turquoise dot pulses (via CSS animate-ping) at rest and holds steady at
//   100% on hover so the container-level pulse pauses but the alert marker
//   still reads as active.
// - On hover: text swaps to the 4-bright gradient, weight nudges up, and the
//   arrow-less row gets a small translate to signal a redirect.
const GRADIENT_STYLE = {
  backgroundImage:
    'linear-gradient(to right, var(--color-totes-turquoise), var(--color-electric-purple), var(--color-punk-rock-pink), var(--color-highlighter-yellow))',
};

const NotificationIndicator = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [hovered, setHovered] = useState(false);

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

    const interval = setInterval(fetchNotifications, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  if (loading || notifications.length === 0) return null;

  const firstNotif = notifications[0];
  const label = `${notifications.length} ${notifications.length === 1 ? 'Reveal' : 'Reveals'} Ready`;

  return (
    <motion.a
      href={`/reveal?id=${firstNotif.recommendation_id}&view=1`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group flex items-center gap-2"
    >
      <span className="relative flex items-center justify-center w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-totes-turquoise/60 animate-ping group-hover:hidden" />
        <span className="relative w-2 h-2 rounded-full bg-totes-turquoise" />
      </span>

      <motion.span
        animate={hovered ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
        transition={hovered ? { duration: 0.2 } : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="flex items-center gap-2"
      >
        <Bell
          size={14}
          strokeWidth={1.75}
          className="text-electric-purple"
          aria-hidden="true"
        />
        <span
          className={`text-[10px] font-kumbh tracking-[0.2em] uppercase transition-all ${
            hovered
              ? 'font-extrabold bg-clip-text text-transparent'
              : 'font-bold text-brand-text'
          }`}
          style={hovered ? GRADIENT_STYLE : undefined}
        >
          {label}
        </span>
      </motion.span>
    </motion.a>
  );
};

export default NotificationIndicator;
