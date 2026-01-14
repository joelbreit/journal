/**
 * Markdown Utilities
 * Convert between HTML and Markdown for TipTap editor
 */

import TurndownService from 'turndown';
import { marked } from 'marked';

// Configure Turndown for HTML -> Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Configure Marked for Markdown -> HTML conversion
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Convert HTML to Markdown
 * Used when saving content from TipTap editor
 */
export function htmlToMarkdown(html) {
  if (!html || html.trim() === '<p></p>') {
    return '';
  }
  return turndownService.turndown(html);
}

/**
 * Convert Markdown to HTML
 * Used when loading content into TipTap editor
 */
export function markdownToHtml(markdown) {
  if (!markdown) {
    return '<p></p>';
  }
  return marked.parse(markdown);
}

export default {
  htmlToMarkdown,
  markdownToHtml,
};
