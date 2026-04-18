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
        fetch('/api/reactions') // Needs to fetch all reactions for all recs, or we map them individually
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
      
      fetchData(); // Refresh

      if (newStatus === 'done') {
        window.location.href = `/reveal?id=${recId}`;
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-totes-turquoise border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8">
      {recommendations.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-brand-muted/20 rounded-3xl">
          <p className="text-brand-muted font-light">No recommendations yet. Be the first!</p>
        </div>
      ) : (
        recommendations.map((rec) => {
          const userReaction = reactions.find(r => r.recommendation_id === rec.id && r.user_id === userId);
          return (
            <GuideCard 
              key={rec.id}
              recommendation={rec}
              userStatus={userReaction?.status || 'in_my_queue'}
              onStatusChange={(status) => handleStatusChange(rec.id, status)}
            />
          );
        })
      )}
    </div>
  );
};

export default GuideGrid;
