import { sql, safeInsert } from './neon';

export async function createRecommendation(data) {
  const { userId, title, streamer, type, genre, blurb } = data;
  const result = await safeInsert({
    table: 'recommendations',
    columns: {
      created_by_user_id: userId,
      title,
      streamer,
      content_type: type,
      genre_or_topic: genre,
      short_blurb: blurb,
    },
  });
  return result;
}

export async function getRecommendations() {
  return await sql`SELECT * FROM recommendations ORDER BY created_at DESC`;
}

export async function getRecommendationById(id) {
  const results = await sql`SELECT * FROM recommendations WHERE id = ${id}`;
  return results[0];
}

// Edit/delete are gated by the recipient still being in `in_my_queue`. Once
// the recipient flips to watching/done/no_thanks the recommender loses the
// right to rewrite history on them. We check ANY non-creator reaction — if
// one exists and is not `in_my_queue` the gate fails. (A missing row is fine;
// default status is `in_my_queue`.)
async function isQueueGateOpen(recId, creatorUserId) {
  const rows = await sql`
    SELECT status
    FROM reactions
    WHERE recommendation_id = ${recId}
      AND user_id != ${creatorUserId}
    LIMIT 1
  `;
  if (rows.length === 0) return true;
  return rows[0].status === 'in_my_queue' || rows[0].status === null;
}

/**
 * Delete a rec, but only if:
 *   - the requesting user is the rec's creator AND
 *   - the OTHER user's status for it is still `in_my_queue` (or missing).
 *
 * Returns `{ ok: true }` on delete, `{ ok: false, reason }` when gated.
 */
export async function deleteRecommendationGated(id, userId) {
  const rec = await getRecommendationById(id);
  if (!rec) return { ok: false, reason: 'not_found' };
  if (rec.created_by_user_id !== userId) return { ok: false, reason: 'forbidden' };

  const open = await isQueueGateOpen(id, userId);
  if (!open) return { ok: false, reason: 'queue_closed' };

  await sql`DELETE FROM recommendations WHERE id = ${id} AND created_by_user_id = ${userId}`;
  return { ok: true };
}

/**
 * Update the editable fields of a rec, gated identically to delete.
 * Does NOT touch the recipient's existing reaction row.
 */
export async function updateRecommendationGated(id, userId, patch) {
  const rec = await getRecommendationById(id);
  if (!rec) return { ok: false, reason: 'not_found' };
  if (rec.created_by_user_id !== userId) return { ok: false, reason: 'forbidden' };

  const open = await isQueueGateOpen(id, userId);
  if (!open) return { ok: false, reason: 'queue_closed' };

  const title = typeof patch.title === 'string' ? patch.title.trim() : rec.title;
  const streamer = typeof patch.streamer === 'string' ? patch.streamer.trim() : rec.streamer;
  const contentType = typeof patch.contentType === 'string' ? patch.contentType : rec.content_type;
  const genre = typeof patch.genre === 'string' ? patch.genre.trim() : rec.genre_or_topic;
  const blurb = typeof patch.blurb === 'string' ? patch.blurb.trim() : rec.short_blurb;

  const rows = await sql`
    UPDATE recommendations
    SET title = ${title},
        streamer = ${streamer},
        content_type = ${contentType},
        genre_or_topic = ${genre},
        short_blurb = ${blurb}
    WHERE id = ${id} AND created_by_user_id = ${userId}
    RETURNING *
  `;
  return { ok: true, rec: rows[0] };
}
