import { createRecommendation, getRecommendations } from '../../lib/recommendations';
import { notifyNewRec } from '../../lib/loops';

export const GET = async () => {
  try {
    const data = await getRecommendations();
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
    const data = await request.json();
    const result = await createRecommendation(data);
    
    // Trigger email notification
    if (result && result.length > 0) {
      const rec = result[0];
      await notifyNewRec(rec.created_by_user_id, rec.title);
    }

    return new Response(JSON.stringify(result), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
