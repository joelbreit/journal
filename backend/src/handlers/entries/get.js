/**
 * GET /entries/{id}
 * Get a specific entry with full markdown content
 */

import { getEntry } from '../../layers/common/s3Client.js';
import { getUserId } from '../../layers/common/auth.js';

export const handler = async (event) => {
  console.log('Get entry event:', JSON.stringify(event, null, 2));

  try {
    const userId = getUserId(event);
    const entryId = event.pathParameters?.id;

    if (!entryId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Entry ID is required',
        }),
      };
    }

    // Get entry from S3
    const entry = await getEntry(userId, entryId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(entry.toJSON()),
    };
  } catch (error) {
    console.error('Error getting entry:', error);

    // Check if it's a not found error
    if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey') {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Entry not found',
        }),
      };
    }

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
