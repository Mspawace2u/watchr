import { updateReactionStatus, saveRating, setRevealViewed, getReactionsByRecommendation } from '../../lib/reactions';
import { getRecommendationById } from '../../lib/recommendations';
import { notifyRevealReady } from '../../lib/loops';

export const GET = async ({ url }) => {
  try {
    const recId = url.searchParams.get('recId');
    const data = await getReactionsByRecommendation(recId);
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
    const { action, recId, userId, ...params } = await request.json();
    
    let result;
    if (action === 'updateStatus') {
      result = await updateReactionStatus(recId, userId, params.status);
    } else if (action === 'saveRating') {
      result = await saveRating(recId, userId, params.rating, params.moreLikeThis, params.hotTake);
      
      // Trigger Reveal Ready notification
      const rec = await getRecommendationById(recId);
      if (rec) {
        await notifyRevealReady(userId, rec.title);
      }
    } else if (action === 'setViewed') {
      result = await setRevealViewed(recId, userId);
    }

    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
