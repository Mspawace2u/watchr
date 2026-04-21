import {
  deleteRecommendationGated,
  updateRecommendationGated,
  getRecommendationById,
} from '../../../lib/recommendations';

export const prerender = false;

// Shared bad-request response for the queue-gate outcomes.
const gated = (reason) => {
  const map = {
    not_found: { status: 404, message: 'Recommendation not found.' },
    forbidden: { status: 403, message: 'Only the creator can edit this rec.' },
    queue_closed: {
      status: 409,
      message:
        'Your pal already started watching this — edits and deletes are locked.',
    },
  };
  const hit = map[reason] ?? { status: 400, message: 'Cannot change this rec.' };
  return new Response(JSON.stringify({ error: hit.message, reason }), {
    status: hit.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const GET = async ({ params }) => {
  try {
    const rec = await getRecommendationById(params.id);
    if (!rec) return gated('not_found');
    return new Response(JSON.stringify(rec), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH = async ({ params, request }) => {
  try {
    const body = await request.json();
    const { userId, ...patch } = body;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    const result = await updateRecommendationGated(params.id, userId, patch);
    if (!result.ok) return gated(result.reason);
    return new Response(JSON.stringify(result.rec), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE = async ({ params, request }) => {
  try {
    const url = new URL(request.url);
    let userId = url.searchParams.get('userId');
    if (!userId) {
      try {
        const body = await request.json();
        userId = body?.userId;
      } catch {
        // No JSON body is fine — we just need userId somewhere.
      }
    }
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    const result = await deleteRecommendationGated(params.id, userId);
    if (!result.ok) return gated(result.reason);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
