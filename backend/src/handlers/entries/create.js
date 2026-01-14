/**
 * POST /entries
 * Create a new journal entry
 */

exports.handler = async (event) => {
  console.log('Create entry event:', JSON.stringify(event, null, 2));

  try {
    // TODO: Extract user ID from Cognito JWT claims
    // const userId = event.requestContext.authorizer.claims.sub;

    // TODO: Parse request body
    // const { title, content, date } = JSON.parse(event.body);

    // TODO: Generate unique entry ID
    // const entryId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // TODO: Save to S3 at users/{userId}/{entryId}.md
    // TODO: Store metadata in S3 object metadata (title, date, preview)

    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Create entry - Not implemented yet',
      }),
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
