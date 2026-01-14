/**
 * PUT /entries/{id}
 * Update an existing entry (used by auto-save)
 */

import { Entry } from '../../../../../shared/models/Entry.js';
import { getEntry, saveEntry } from '../../layers/common/s3Client.js';
import { getUserId } from '../../layers/common/auth.js';

export const handler = async (event) => {
  console.log('Update entry event:', JSON.stringify(event, null, 2));

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

    const { title, content, date } = JSON.parse(event.body);

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Content is required',
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

    // Create updated Entry instance
    const entry = new Entry({
      id: entryId,
      userId,
      title: title || 'Untitled',
      content,
      date: date || new Date().toISOString(),
    });

    // Update timestamp
    entry.touch();

    // Generate preview
    entry.generatePreview();

    // Validate entry
    const validation = entry.validate();
    if (!validation.isValid) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Validation failed',
          errors: validation.errors,
        }),
      };
    }

    // Save to S3
    await saveEntry(entry);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(entry.toJSON()),
    };
  } catch (error) {
    console.error('Error updating entry:', error);
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
