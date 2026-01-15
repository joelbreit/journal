/**
 * POST /entries
 * Create a new journal entry
 */

import { Entry } from '/opt/nodejs/Entry.js';
import { saveEntry } from '/opt/nodejs/s3Client.js';
import { getUserId } from '/opt/nodejs/auth.js';

export const handler = async (event) => {
  console.log('Create entry event:', JSON.stringify(event, null, 2));

  try {
    const userId = getUserId(event);
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

    // Generate unique entry ID
    const entryId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create Entry instance
    const entry = new Entry({
      id: entryId,
      userId,
      title: title || 'Untitled',
      content,
      date: date || new Date().toISOString(),
    });

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
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(entry.toJSON()),
    };
  } catch (error) {
    console.error('Error creating entry:', error);
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
