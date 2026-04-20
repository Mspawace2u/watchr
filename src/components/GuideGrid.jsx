import React, { useState, useEffect } from 'react';
import GuideCard from './GuideCard';

const GuideGrid = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== 'undefined' ? (localStorage.getItem('watchr_user') || 'A') : 'A';

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
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', recId, userId, status: newStatus })
      });

      fetchData();

      if (newStatus === 'done') {
        window.location.href = `/reveal?id=${recId}`;
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderCard = (rec) => {
    const userReaction = reactions.find(
      (r) => r.recommendation_id === rec.id && r.user_id === userId
    );
    return (
      <GuideCard
        key={rec.id}
        recommendation={rec}
        userStatus={userReaction?.status || 'in_my_queue'}
        onStatusChange={(status) => handleStatusChange(rec.id, status)}
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
      <section className="flex flex-col gap-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          Watchr Recs for You
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {recsForYou.length === 0
            ? renderEmpty('No recs for you yet — nudge your human.')
            : recsForYou.map(renderCard)}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
          Your Recs to Others
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {recsFromYou.length === 0
            ? renderEmpty("You haven't dropped any recs yet.")
            : recsFromYou.map(renderCard)}
        </div>
      </section>
    </div>
  );
};

export default GuideGrid;
