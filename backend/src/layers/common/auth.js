/**
 * Authentication Utilities for Journal App
 * Handles extraction of user information from Cognito JWT tokens
 */

/**
 * Extract user ID from API Gateway event
 * API Gateway validates JWT and includes claims in requestContext
 * @param {object} event - API Gateway event object
 * @returns {string} User ID (sub claim from Cognito JWT)
 */
function getUserId(event) {
  // TODO: Extract user ID from Cognito authorizer claims
  // event.requestContext.authorizer.claims.sub

  if (!event.requestContext?.authorizer?.claims?.sub) {
    throw new Error('Unauthorized: No user ID found in request');
  }

  return event.requestContext.authorizer.claims.sub;
}

/**
 * Get user email from API Gateway event
 * @param {object} event - API Gateway event object
 * @returns {string} User email
 */
function getUserEmail(event) {
  // TODO: Extract email from Cognito authorizer claims
  // event.requestContext.authorizer.claims.email

  return event.requestContext?.authorizer?.claims?.email || null;
}

/**
 * Get all user claims from API Gateway event
 * @param {object} event - API Gateway event object
 * @returns {object} All Cognito claims
 */
function getUserClaims(event) {
  // TODO: Return all claims
  // event.requestContext.authorizer.claims

  return event.requestContext?.authorizer?.claims || {};
}

module.exports = {
  getUserId,
  getUserEmail,
  getUserClaims,
};
