import { sql, safeInsert } from './neon';

export async function createNotification(recId, targetUserId, type) {
  return await safeInsert({
    table: 'notifications',
    columns: {
      recommendation_id: recId,
      target_user_id: targetUserId,
      notification_type: type,
    },
  });
}

export async function getUnreadNotifications(userId) {
  return await sql`
    SELECT n.*, r.title
    FROM notifications n
    JOIN recommendations r ON n.recommendation_id = r.id
    WHERE n.target_user_id = ${userId} AND n.is_read = FALSE
    ORDER BY n.created_at DESC
  `;
}

export async function markNotificationsAsRead(userId, recId) {
  return await sql`
    UPDATE notifications
    SET is_read = TRUE
    WHERE target_user_id = ${userId} AND recommendation_id = ${recId}
  `;
}
