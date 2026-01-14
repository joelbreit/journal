/**
 * S3 Client Utilities for Journal App
 * Handles all S3 operations for storing and retrieving journal entries
 */

const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.BUCKET_NAME;

/**
 * Save a journal entry to S3
 * @param {string} userId - User ID from Cognito
 * @param {string} entryId - Unique entry identifier
 * @param {string} content - Markdown content
 * @param {object} metadata - Entry metadata (title, date, preview)
 * @returns {Promise<object>} S3 response
 */
async function saveEntry(userId, entryId, content, metadata = {}) {
  // TODO: Implement S3 PutObject with metadata
  // Key: `users/${userId}/${entryId}.md`
  // Metadata: title, date, preview
  // ContentType: 'text/markdown'

  throw new Error('Not implemented yet');
}

/**
 * Get a journal entry from S3
 * @param {string} userId - User ID from Cognito
 * @param {string} entryId - Entry identifier
 * @returns {Promise<object>} Entry content and metadata
 */
async function getEntry(userId, entryId) {
  // TODO: Implement S3 GetObject
  // Key: `users/${userId}/${entryId}.md`
  // Return: { content, metadata }

  throw new Error('Not implemented yet');
}

/**
 * List all entries for a user
 * @param {string} userId - User ID from Cognito
 * @returns {Promise<Array>} List of entry metadata
 */
async function listEntries(userId) {
  // TODO: Implement S3 ListObjectsV2
  // Prefix: `users/${userId}/`
  // Return: Array of { id, title, date, preview } from object metadata

  throw new Error('Not implemented yet');
}

/**
 * Delete a journal entry from S3
 * @param {string} userId - User ID from Cognito
 * @param {string} entryId - Entry identifier
 * @returns {Promise<object>} S3 response
 */
async function deleteEntry(userId, entryId) {
  // TODO: Implement S3 DeleteObject
  // Key: `users/${userId}/${entryId}.md`

  throw new Error('Not implemented yet');
}

module.exports = {
  saveEntry,
  getEntry,
  listEntries,
  deleteEntry,
};
