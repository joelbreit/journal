/**
 * DELETE /entries/{id}
 * Delete an entry
 */

import { getEntry, deleteEntry } from '../../layers/common/s3Client.js';
import { getUserId } from '../../layers/common/auth.js';

export const handler = async (event) => {
  console.log('Delete entry event:', JSON.stringify(event, null, 2));

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

    // Check if entry exists and user owns it
    try {
      await getEntry(userId, entryId);
    } catch (error) {
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
      throw error;
    }

    // Delete from S3
    await deleteEntry(userId, entryId);

    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: '',
    };
  } catch (error) {
    console.error('Error deleting entry:', error);
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
