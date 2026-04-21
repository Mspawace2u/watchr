import React, { useEffect, useState } from 'react';
import RevealFlow from './RevealFlow';

/**
 * Client-side gate that picks the *other* user's reveal-ready reaction.
 * Viewer identity lives in localStorage (watchr_user = 'A' | 'B'), so the
 * filter must run after hydration. Anything reveal_ready from the viewer
 * themselves is skipped so users never see their own hot take played back.
 *
 * @param {object} props
 * @param {Record<string, any>} props.recommendation
 * @param {Array<Record<string, unknown>>} [props.reactions]
 */
const RevealGate = ({ recommendation, reactions }) => {
  const list = reactions || [];
  const [friendReaction, setFriendReaction] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const viewer = (typeof window !== 'undefined' && window.localStorage.getItem('watchr_user')) || 'A';
    const found = list.find(
      (r) => r.reveal_ready === true && r.user_id !== viewer
    );
    setFriendReaction(found ?? null);
    setReady(true);
  }, [list]);

  if (!ready) {
    return null;
  }

  if (!friendReaction) {
    return (
      <div className="py-20 text-center space-y-2">
        <p className="text-brand-muted">The other user hasn't finished their reveal yet.</p>
        <a href="/guide" className="inline-block text-[10px] font-kumbh font-bold tracking-[0.2em] uppercase text-brand-muted/70 hover:text-brand-text transition-colors">
          Back to Guide
        </a>
      </div>
    );
  }

  return (
    <RevealFlow
      recommendation={recommendation}
      rating={friendReaction.taco_rating}
      hotTake={friendReaction.hot_take_raw}
      onComplete={() => {
        window.location.href = `/reveal?id=${recommendation.id}`;
      }}
    />
  );
};

export default RevealGate;
