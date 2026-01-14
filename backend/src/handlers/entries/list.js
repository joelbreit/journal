/**
 * GET /entries
 * List all entries for the authenticated user (metadata only)
 */

import { listEntries } from '../../layers/common/s3Client.js';
import { getUserId } from '../../layers/common/auth.js';

export const handler = async (event) => {
  console.log('List entries event:', JSON.stringify(event, null, 2));

  try {
    const userId = getUserId(event);

    // Get all entries for user
    const entries = await listEntries(userId);

    // Return metadata only (no content)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(entries.map(e => e.toMetadata())),
    };
  } catch (error) {
    console.error('Error listing entries:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error.message,
      }),
    };
  }
};
