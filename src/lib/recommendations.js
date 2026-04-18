import { sql } from './neon';

export async function createRecommendation(data) {
  const { userId, title, streamer, type, genre, blurb } = data;
  return await sql`
    INSERT INTO recommendations (created_by_user_id, title, streamer, content_type, genre_or_topic, short_blurb)
    VALUES (${userId}, ${title}, ${streamer}, ${type}, ${genre}, ${blurb})
    RETURNING *
  `;
}

export async function getRecommendations() {
  return await sql`SELECT * FROM recommendations ORDER BY created_at DESC`;
}

export async function deleteRecommendation(id, userId) {
  return await sql`DELETE FROM recommendations WHERE id = ${id} AND created_by_user_id = ${userId}`;
}

export async function getRecommendationById(id) {
  const results = await sql`SELECT * FROM recommendations WHERE id = ${id}`;
  return results[0];
}
