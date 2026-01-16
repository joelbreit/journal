/**
 * Journal Entry Model
 * Represents a single journal entry with metadata and content
 *
 * Shared between frontend and backend - uses ES6 modules
 */
export class Entry {
	constructor(data = {}) {
		this.id = data.id || null;
		this.userId = data.userId || null;
		this.title = data.title || 'Untitled';
		this.content = data.content || '';
		this.date = data.date || new Date().toISOString();
		this.preview = data.preview || '';
		this.createdAt = data.createdAt || new Date().toISOString();
		this.updatedAt = data.updatedAt || new Date().toISOString();
	}

	/**
	 * Create Entry from S3 object metadata (backend)
	 */
	static fromS3Object(s3Object, userId) {
		// Extract entryId from S3 key: "users/{userId}/{entryId}.md"
		const key = s3Object.Key;
		const entryId = key.split('/').pop().replace('.md', '');

		return new Entry({
			id: entryId,
			userId: userId,
			title: s3Object.Metadata?.['title'] || 'Untitled',
			date: s3Object.Metadata?.['date'] || s3Object.LastModified?.toISOString(),
			preview: s3Object.Metadata?.['preview'] || '',
			createdAt: s3Object.Metadata?.['created-at'] || s3Object.LastModified?.toISOString(),
			updatedAt: s3Object.Metadata?.['updated-at'] || s3Object.LastModified?.toISOString()
		});
	}

	/**
	 * Create Entry from S3 GetObject response with content (backend)
	 */
	static fromS3WithContent(s3Response, userId, entryId) {
		return new Entry({
			id: entryId,
			userId: userId,
			title: s3Response.Metadata?.['title'] || 'Untitled',
			content: s3Response.Body, // Already converted to string
			date: s3Response.Metadata?.['date'],
			preview: s3Response.Metadata?.['preview'],
			createdAt: s3Response.Metadata?.['created-at'],
			updatedAt: s3Response.Metadata?.['updated-at']
		});
	}

	/**
	 * Create Entry from API response
	 */
	static fromAPI(apiData) {
		return new Entry({
			id: apiData.id,
			userId: apiData.userId,
			title: apiData.title,
			content: apiData.content,
			date: apiData.date,
			preview: apiData.preview,
			createdAt: apiData.createdAt,
			updatedAt: apiData.updatedAt
		});
	}

	/**
	 * Generate preview from content
	 */
	generatePreview(maxLength = 200) {
		if (!this.content) return '';

		// Strip markdown formatting
		const plainText = this.content
			.replace(/^#+\s+/gm, '')        // Remove headers
			.replace(/[*_~`]/g, '')         // Remove formatting
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
			.replace(/\n+/g, ' ')           // Replace newlines with spaces
			.trim();

		this.preview = plainText.substring(0, maxLength) +
			(plainText.length > maxLength ? '...' : '');
		return this.preview;
	}

	/**
	 * Get word count
	 */
	getWordCount() {
		if (!this.content) return 0;
		return this.content.split(/\s+/).filter(word => word.length > 0).length;
	}

	/**
	 * Update timestamp
	 */
	touch() {
		this.updatedAt = new Date().toISOString();
		return this;
	}

	/**
	 * Validate entry data
	 */
	validate() {
		const errors = [];

		if (!this.userId) {
			errors.push('userId is required');
		}

		if (this.title && this.title.length > 200) {
			errors.push('title must be 200 characters or less');
		}

		if (this.content && this.content.length > 10 * 1024 * 1024) {
			errors.push('content must be 10MB or less');
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	/**
	 * Convert to plain object for JSON serialization
	 */
	toJSON() {
		return {
			id: this.id,
			userId: this.userId,
			title: this.title,
			content: this.content,
			date: this.date,
			preview: this.preview,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		};
	}

	/**
	 * Get S3 metadata object (backend)
	 */
	toS3Metadata() {
		return {
			'title': this.title || 'Untitled',
			'date': this.date,
			'preview': this.preview.substring(0, 200),
			'created-at': this.createdAt,
			'updated-at': this.updatedAt
		};
	}

	/**
	 * Get metadata only (no content) for list views
	 */
	toMetadata() {
		return {
			id: this.id,
			userId: this.userId,
			title: this.title,
			date: this.date,
			preview: this.preview,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		};
	}

	/**
	 * Format date for display
	 */
	getFormattedDate() {
		return new Date(this.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	/**
	 * Get relative time for display (e.g., "2 hours ago")
	 */
	getRelativeTime() {
		const date = new Date(this.date);
		const now = new Date();
		const diffMs = now - date;
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHour = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHour / 24);

		if (diffDay > 7) {
			return this.getFormattedDate();
		} else if (diffDay > 0) {
			return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
		} else if (diffHour > 0) {
			return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
		} else if (diffMin > 0) {
			return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
		} else {
			return 'Just now';
		}
	}

	/**
	 * Check if entry is new (no id yet)
	 */
	isNew() {
		return !this.id;
	}

	/**
	 * Clone entry (useful for React state updates)
	 */
	clone() {
		return new Entry(this.toJSON());
	}

	/**
	 * Update multiple properties at once
	 */
	update(updates) {
		Object.assign(this, updates);
		this.touch();
		return this;
	}
}

export default Entry;
