// Scaffold for Loops email integration
// Documentation: https://loops.so/docs/api

export async function sendTransactionalEmail(targetEmail, templateId, dataVariables) {
  const apiKey = import.meta.env.LOOPS_API_KEY;
  
  if (!apiKey) {
    if (import.meta.env.DEV) {
      console.warn('LOOPS_API_KEY is not defined. Email notification skipped.');
    }
    return { success: false, message: 'API key missing' };
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: targetEmail,
        transactionalId: templateId,
        dataVariables,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Loops API error: ${JSON.stringify(errorData)}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send Loops notification:', error);
    return { success: false, error };
  }
}

export async function notifyNewRec(senderUserId, recTitle) {
  const targetUserId = senderUserId === 'A' ? 'B' : 'A';
  const targetEmail = targetUserId === 'A' ? import.meta.env.USER_A_EMAIL : import.meta.env.USER_B_EMAIL;
  const templateId = import.meta.env.LOOPS_NEW_REC_TEMPLATE_ID;
  const senderName = senderUserId === 'A' ? 'User A' : 'User B';

  if (!targetEmail || !templateId) return { success: false, message: 'Config missing' };

  return await sendTransactionalEmail(targetEmail, templateId, {
    recTitle,
    senderName,
    actionUrl: `${import.meta.env.PUBLIC_APP_URL}/guide`
  });
}

export async function notifyRevealReady(senderUserId, recTitle) {
  const targetUserId = senderUserId === 'A' ? 'B' : 'A';
  const targetEmail = targetUserId === 'A' ? import.meta.env.USER_A_EMAIL : import.meta.env.USER_B_EMAIL;
  const templateId = import.meta.env.LOOPS_REVEAL_READY_TEMPLATE_ID;
  const senderName = senderUserId === 'A' ? 'User A' : 'User B';

  if (!targetEmail || !templateId) return { success: false, message: 'Config missing' };

  return await sendTransactionalEmail(targetEmail, templateId, {
    recTitle,
    senderName,
    actionUrl: `${import.meta.env.PUBLIC_APP_URL}/guide`
  });
}
