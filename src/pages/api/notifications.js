import { getUnreadNotifications, markNotificationsAsRead, createNotification } from '../../lib/notifications';

export const GET = async ({ url }) => {
  try {
    const userId = url.searchParams.get('userId');
    const data = await getUnreadNotifications(userId);
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const { action, ...params } = await request.json();
    
    let result;
    if (action === 'create') {
      result = await createNotification(params.recId, params.targetUserId, params.type);
    } else if (action === 'markRead') {
      result = await markNotificationsAsRead(params.userId, params.recId);
    }

    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
