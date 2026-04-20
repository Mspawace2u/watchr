import { sql, safeUpsert } from './neon';

export async function getReactionsByRecommendation(recId) {
  return await sql`SELECT * FROM reactions WHERE recommendation_id = ${recId}`;
}

export async function updateReactionStatus(recId, userId, status) {
  return await safeUpsert({
    table: 'reactions',
    conflictKeys: ['recommendation_id', 'user_id'],
    columns: {
      recommendation_id: recId,
      user_id: userId,
      status,
    },
  });
}

/**
 * Returns the current reaction row for (recId, userId), or null if none exists.
 */
async function getReaction(recId, userId) {
  const rows = await sql`
    SELECT * FROM reactions
    WHERE recommendation_id = ${recId} AND user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

/**
 * Save a rating + hot take. Locked once the other user has viewed the reveal:
 * returns `{ locked: true, reaction }` without writing.
 *
 * Lock enforcement is atomic: the upsert's DO UPDATE only runs when
 * `reveal_viewed_by_other_user IS NOT TRUE`, so a concurrent `setRevealViewed`
 * between the pre-read and the write cannot be bypassed. Pre-read is kept as a
 * fast-path so the common "already locked" case skips the write round-trip.
 *
 * Uses schema-drift-tolerant upsert so an optional column (e.g. hot_take_raw)
 * going missing does not fail the whole save.
 */
export async function saveRating(recId, userId, rating, moreLikeThis, hotTake) {
  const existing = await getReaction(recId, userId);
  if (existing?.reveal_viewed_by_other_user === true) {
    return { locked: true, reaction: existing };
  }

  const result = await safeUpsert({
    table: 'reactions',
    conflictKeys: ['recommendation_id', 'user_id'],
    columns: {
      recommendation_id: recId,
      user_id: userId,
      taco_rating: rating,
      more_like_this: moreLikeThis,
      hot_take_raw: hotTake,
      reveal_ready: true,
    },
    updateWhere: 'reactions.reveal_viewed_by_other_user IS NOT TRUE',
  });

  const rows = Array.isArray(result) ? result : result ? [result] : [];
  if (rows.length === 0) {
    // Upsert matched an existing row, but the WHERE guard blocked the update —
    // the other user viewed the reveal between our pre-read and the write.
    const locked = await getReaction(recId, userId);
    return { locked: true, reaction: locked ?? existing };
  }
  return { locked: false, reaction: rows[0] };
}

export async function setRevealViewed(recId, viewerUserId) {
  // Set reveal_viewed_by_other_user to TRUE for the reaction created by the OTHER user
  return await sql`
    UPDATE reactions
    SET reveal_viewed_by_other_user = TRUE
    WHERE recommendation_id = ${recId} AND user_id != ${viewerUserId}
  `;
}
