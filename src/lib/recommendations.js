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

/**
 * Delete a rec, but only if:
 *   - the requesting user is the rec's creator AND
 *   - the OTHER user's status for it is still `in_my_queue` (or missing).
 *
 * Returns `{ ok: true }` on delete, `{ ok: false, reason }` when gated.
 *
 * The queue-gate is folded into the DELETE itself (NOT EXISTS subquery on
 * `reactions`) so the check and the write are atomic — avoids the TOCTOU
 * race where the recipient could flip status between a separate check and
 * a separate write on serverless Postgres.
 */
export async function deleteRecommendationGated(id, userId) {
  const rec = await getRecommendationById(id);
  if (!rec) return { ok: false, reason: 'not_found' };
  if (rec.created_by_user_id !== userId) return { ok: false, reason: 'forbidden' };

  const rows = await sql`
    DELETE FROM recommendations
    WHERE id = ${id}
      AND created_by_user_id = ${userId}
      AND NOT EXISTS (
        SELECT 1 FROM reactions
        WHERE reactions.recommendation_id = ${id}
          AND reactions.user_id != ${userId}
          AND reactions.status IS NOT NULL
          AND reactions.status != 'in_my_queue'
      )
    RETURNING id
  `;
  if (rows.length === 0) return { ok: false, reason: 'queue_closed' };
  return { ok: true };
}

/**
 * Update the editable fields of a rec, gated identically to delete.
 * Does NOT touch the recipient's existing reaction row.
 *
 * The gate is enforced atomically inside the UPDATE's WHERE clause.
 */
export async function updateRecommendationGated(id, userId, patch) {
  const rec = await getRecommendationById(id);
  if (!rec) return { ok: false, reason: 'not_found' };
  if (rec.created_by_user_id !== userId) return { ok: false, reason: 'forbidden' };

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
        short_blurb = ${blurb},
        updated_at = NOW()
    WHERE id = ${id}
      AND created_by_user_id = ${userId}
      AND NOT EXISTS (
        SELECT 1 FROM reactions
        WHERE reactions.recommendation_id = ${id}
          AND reactions.user_id != ${userId}
          AND reactions.status IS NOT NULL
          AND reactions.status != 'in_my_queue'
      )
    RETURNING *
  `;
  if (rows.length === 0) return { ok: false, reason: 'queue_closed' };
  return { ok: true, rec: rows[0] };
}
