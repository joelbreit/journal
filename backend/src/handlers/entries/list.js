/**
 * GET /entries
 * List all entries for the authenticated user (metadata only)
 */

exports.handler = async (event) => {
  console.log('List entries event:', JSON.stringify(event, null, 2));

  try {
    // TODO: Extract user ID from Cognito JWT claims
    // const userId = event.requestContext.authorizer.claims.sub;

    // TODO: List objects from S3 at users/{userId}/
    // TODO: Return metadata only (title, date, id, preview) - not full content

    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'List entries - Not implemented yet',
        entries: [],
      }),
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
