/**
 * PUT /entries/{id}
 * Update an existing entry (used by auto-save)
 */

exports.handler = async (event) => {
  console.log('Update entry event:', JSON.stringify(event, null, 2));

  try {
    // TODO: Extract user ID from Cognito JWT claims
    // const userId = event.requestContext.authorizer.claims.sub;

    // TODO: Get entry ID from path parameters
    // const entryId = event.pathParameters.id;

    // TODO: Parse request body
    // const { title, content, date } = JSON.parse(event.body);

    // TODO: Verify user owns this entry
    // TODO: Update S3 object at users/{userId}/{entryId}.md
    // TODO: Update metadata in S3 object metadata

    return {
      statusCode: 501,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Update entry - Not implemented yet',
      }),
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
