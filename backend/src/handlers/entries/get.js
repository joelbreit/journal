/**
 * GET /entries/{id}
 * Get a specific entry with full markdown content
 */

exports.handler = async (event) => {
  console.log('Get entry event:', JSON.stringify(event, null, 2));

  try {
    // TODO: Extract user ID from Cognito JWT claims
    // const userId = event.requestContext.authorizer.claims.sub;

    // TODO: Get entry ID from path parameters
    // const entryId = event.pathParameters.id;

    // TODO: Fetch from S3 at users/{userId}/{entryId}.md
    // TODO: Verify user owns this entry
    // TODO: Return full markdown content and metadata

    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Get entry - Not implemented yet',
      }),
    };
  } catch (error) {
    console.error('Error getting entry:', error);
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
