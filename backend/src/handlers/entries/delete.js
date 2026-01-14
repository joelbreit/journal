/**
 * DELETE /entries/{id}
 * Delete an entry
 */

exports.handler = async (event) => {
  console.log('Delete entry event:', JSON.stringify(event, null, 2));

  try {
    // TODO: Extract user ID from Cognito JWT claims
    // const userId = event.requestContext.authorizer.claims.sub;

    // TODO: Get entry ID from path parameters
    // const entryId = event.pathParameters.id;

    // TODO: Verify user owns this entry
    // TODO: Delete from S3 at users/{userId}/{entryId}.md

    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Delete entry - Not implemented yet',
      }),
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
