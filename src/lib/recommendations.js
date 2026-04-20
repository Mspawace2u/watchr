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

export async function deleteRecommendation(id, userId) {
  return await sql`DELETE FROM recommendations WHERE id = ${id} AND created_by_user_id = ${userId}`;
}

export async function getRecommendationById(id) {
  const results = await sql`SELECT * FROM recommendations WHERE id = ${id}`;
  return results[0];
}
