import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import GuideCard from './GuideCard';

// 4-bright palette for the DONE confetti burst.
const CONFETTI_COLORS = ['#2de2e6', '#9b5cff', '#ff2f92', '#ffe44d'];

const fireDoneConfetti = () => {
  // Two staggered bursts from just-below-center give a fuller feel on mobile.
  const base = {
    particleCount: 70,
    spread: 70,
    startVelocity: 40,
    gravity: 0.9,
    ticks: 180,
    origin: { y: 0.7 },
    colors: CONFETTI_COLORS,
  };
  confetti({ ...base, angle: 70, origin: { x: 0.3, y: 0.7 } });
  confetti({ ...base, angle: 110, origin: { x: 0.7, y: 0.7 } });
};

const GuideGrid = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // Stored so we can cancel the post-DONE redirect if the user changes their
  // mind to another status within the 1.2s celebration window.
  const redirectTimer = useRef(null);

  const userId = typeof window !== 'undefined' ? (localStorage.getItem('watchr_user') || 'A') : 'A';

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const [recsRes, reactRes] = await Promise.all([
        fetch('/api/recommendations'),
        fetch('/api/reactions')
      ]);

      const recs = await recsRes.json();
      const reacts = await reactRes.json();

      setRecommendations(recs);
      setReactions(reacts);
    } catch (error) {
      console.error('Failed to fetch guide data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (recId, newStatus) => {
    // Cancel any in-flight DONE redirect — if the user hit DONE and then
    // picked another status inside the 1.2s window, we should NOT whisk them
    // off to the reveal flow.
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', recId, userId, status: newStatus })
      });

      fetchData();

      if (newStatus === 'done') {
        // Confetti burst + ~1.2s beat so the celebration actually lands
        // before we whisk the user off to the reveal flow.
        fireDoneConfetti();
        redirectTimer.current = setTimeout(() => {
          window.location.href = `/reveal?id=${recId}`;
        }, 1200);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderCard = (rec, variant) => {
    const userReaction = reactions.find(
      (r) => r.recommendation_id === rec.id && r.user_id === userId
    );
    // For 'sent' cards we need the OTHER user's status so GuideCard can gate
    // the edit/delete icons: edit + delete are only allowed while the
    // recipient is still IN MY QUEUE (or hasn't reacted yet).
    const otherReaction = reactions.find(
      (r) => r.recommendation_id === rec.id && r.user_id !== userId
    );
    const recipientStatus = otherReaction?.status ?? 'in_my_queue';
    return (
      <GuideCard
        key={rec.id}
        recommendation={rec}
        userStatus={userReaction?.status || 'in_my_queue'}
        onStatusChange={(status) => handleStatusChange(rec.id, status)}
        variant={variant}
        recipientStatus={recipientStatus}
        currentUserId={userId}
        onChanged={fetchData}
      />
    );
  };

  const renderEmpty = (msg) => (
    <div className="text-center py-10 border border-dashed border-brand-muted/20 rounded-3xl">
      <p className="text-brand-muted font-light text-sm">{msg}</p>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-totes-turquoise border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const recsForYou = recommendations.filter((r) => r.created_by_user_id !== userId);
  const recsFromYou = recommendations.filter((r) => r.created_by_user_id === userId);

  return (
    <div className="flex flex-col gap-12">
      {/* Typography hierarchy inverted per session spec: section headlines are
          larger than card titles. Headlines stay brand-white 100% now that the
          size delta alone carries the hierarchy, plus a trailing emoji that
          matches the section's notification email for glanceable wayfinding. */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-text">
          Watchr Recs for You <span aria-hidden="true">🎬</span>
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {recsForYou.length === 0
            ? renderEmpty('No recs for you yet — nudge your human.')
            : recsForYou.map((rec) => renderCard(rec, 'received'))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-text">
          Your Recs to Others <span aria-hidden="true">👀</span>
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {recsFromYou.length === 0
            ? renderEmpty("You haven't dropped any recs yet.")
            : recsFromYou.map((rec) => renderCard(rec, 'sent'))}
        </div>
      </section>
    </div>
  );
};

export default GuideGrid;
