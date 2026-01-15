/**
 * S3 Client Utilities for Journal App
 * Handles all S3 operations for storing and retrieving journal entries
 */

import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Entry } from './Entry.js';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.BUCKET_NAME;

/**
 * Save a journal entry to S3
 * @param {Entry} entry - Entry instance to save
 * @returns {Promise<object>} S3 response
 */
async function saveEntry(entry) {
  if (!entry.userId || !entry.id) {
    throw new Error('Entry must have userId and id');
  }

  const key = `users/${entry.userId}/${entry.id}.md`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: entry.content,
    ContentType: 'text/markdown',
    Metadata: entry.toS3Metadata()
  });

  return await s3Client.send(command);
}

/**
 * Get a journal entry from S3
 * @param {string} userId - User ID from Cognito
 * @param {string} entryId - Entry identifier
 * @returns {Promise<Entry>} Entry instance with content
 */
async function getEntry(userId, entryId) {
  const key = `users/${userId}/${entryId}.md`;

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  const response = await s3Client.send(command);
  const content = await response.Body.transformToString();

  return Entry.fromS3WithContent(
    { ...response, Body: content },
    userId,
    entryId
  );
}

/**
 * List all entries for a user
 * @param {string} userId - User ID from Cognito
 * @returns {Promise<Array<Entry>>} Array of Entry instances (metadata only)
 */
async function listEntries(userId) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: `users/${userId}/`
  });

  const response = await s3Client.send(command);

  if (!response.Contents || response.Contents.length === 0) {
    return [];
  }

  // Convert S3 objects to Entry instances
  const entries = response.Contents.map(obj => Entry.fromS3Object(obj, userId));

  // Sort by date descending (newest first)
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  return entries;
}

/**
 * Delete a journal entry from S3
 * @param {string} userId - User ID from Cognito
 * @param {string} entryId - Entry identifier
 * @returns {Promise<object>} S3 response
 */
async function deleteEntry(userId, entryId) {
  const key = `users/${userId}/${entryId}.md`;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  return await s3Client.send(command);
}

export {
  saveEntry,
  getEntry,
  listEntries,
  deleteEntry,
};
