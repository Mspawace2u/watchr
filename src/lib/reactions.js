import { sql } from './neon';

export async function getReactionsByRecommendation(recId) {
  return await sql`SELECT * FROM reactions WHERE recommendation_id = ${recId}`;
}

export async function updateReactionStatus(recId, userId, status) {
  return await sql`
    INSERT INTO reactions (recommendation_id, user_id, status, updated_at)
    VALUES (${recId}, ${userId}, ${status}, NOW())
    ON CONFLICT (recommendation_id, user_id) 
    DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
    RETURNING *
  `;
}

export async function saveRating(recId, userId, rating, moreLikeThis, hotTake) {
  return await sql`
    INSERT INTO reactions (recommendation_id, user_id, taco_rating, more_like_this, hot_take_raw, reveal_ready, updated_at)
    VALUES (${recId}, ${userId}, ${rating}, ${moreLikeThis}, ${hotTake}, TRUE, NOW())
    ON CONFLICT (recommendation_id, user_id) 
    DO UPDATE SET 
      taco_rating = EXCLUDED.taco_rating, 
      more_like_this = EXCLUDED.more_like_this, 
      hot_take_raw = EXCLUDED.hot_take_raw,
      reveal_ready = TRUE,
      updated_at = NOW()
    RETURNING *
  `;
}

export async function setRevealViewed(recId, viewerUserId) {
  // Set reveal_viewed_by_other_user to TRUE for the reaction created by the OTHER user
  return await sql`
    UPDATE reactions 
    SET reveal_viewed_by_other_user = TRUE 
    WHERE recommendation_id = ${recId} AND user_id != ${viewerUserId}
  `;
}
