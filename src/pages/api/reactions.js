import { updateReactionStatus, saveRating, setRevealViewed, getReactionsByRecommendation, getAllReactionStatuses } from '../../lib/reactions';
import { getRecommendationById } from '../../lib/recommendations';
import { notifyRevealReady } from '../../lib/loops';

export const GET = async ({ url }) => {
  try {
    const recId = url.searchParams.get('recId');
    // Guide page calls this with no recId — return only status columns for
    // every reaction so the client can map each card to its viewer's status.
    // Without this fallback, the WHERE clause resolved to `= NULL`, the array
    // was always empty, and the uniform-yellow active state never rendered
    // because userStatus fell back to the 'in_my_queue' default after every
    // click. The no-recId branch deliberately excludes hot_take_raw /
    // taco_rating / more_like_this so the reveal-gating guarantee holds.
    const data = recId
      ? await getReactionsByRecommendation(recId)
      : await getAllReactionStatuses();
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

    if (action === 'updateStatus') {
      const result = await updateReactionStatus(recId, userId, params.status);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'saveRating') {
      const { locked, reaction } = await saveRating(recId, userId, params.rating, params.moreLikeThis, params.hotTake);
      if (locked) {
        return new Response(
          JSON.stringify({
            error: 'locked',
            message: 'This rating is locked — the other user has already viewed the reveal.',
            reaction,
          }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Trigger Reveal Ready notification
      const rec = await getRecommendationById(recId);
      if (rec) {
        await notifyRevealReady(userId, rec.title);
      }
      return new Response(JSON.stringify(reaction), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'setViewed') {
      const result = await setRevealViewed(recId, userId);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: `unknown action: ${action}` }), { status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
