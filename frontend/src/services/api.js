/**
 * API Client
 * Handles all HTTP requests to the backend with authentication
 */

import axios from 'axios';
import { Entry } from '../../../shared/models/Entry';
import { fetchAuthSession } from 'aws-amplify/auth';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor: Add auth token to all requests
apiClient.interceptors.request.use(
	async (config) => {
		try {
			const session = await fetchAuthSession();
			const token = session.tokens?.idToken?.toString();

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch (error) {
			console.error('Error getting auth session:', error);
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Unauthorized - redirect to login
			window.location.href = '/login';
		}

		return Promise.reject(error);
	}
);

/**
 * API methods
 */
export const api = {
	/**
	 * Create a new entry
	 * @param {Entry} entry - Entry instance
	 * @returns {Promise<Entry>} Created entry
	 */
	async createEntry(entry) {
		console.log("[DEBUG] api.createEntry called", { entryId: entry.id, title: entry.title });
		const response = await apiClient.post('/entries', entry.toJSON());
		return Entry.fromAPI(response.data);
	},

	/**
	 * Get all entries (metadata only)
	 * @returns {Promise<Array<Entry>>} Array of entries
	 */
	async getEntries() {
		console.log("[DEBUG] api.getEntries called");
		const response = await apiClient.get('/entries');
		return response.data.map((data) => Entry.fromAPI(data));
	},

	/**
	 * Get a specific entry (full content)
	 * @param {string} id - Entry ID
	 * @returns {Promise<Entry>} Entry with full content
	 */
	async getEntry(id) {
		console.log("[DEBUG] api.getEntry called", { id });
		const response = await apiClient.get(`/entries/${id}`);
		return Entry.fromAPI(response.data);
	},

	/**
	 * Update an existing entry
	 * @param {Entry} entry - Entry instance with updates
	 * @returns {Promise<Entry>} Updated entry
	 */
	async updateEntry(entry) {
		console.log("[DEBUG] api.updateEntry called", { entryId: entry.id, title: entry.title });
		const response = await apiClient.put(`/entries/${entry.id}`, entry.toJSON());
		return Entry.fromAPI(response.data);
	},

	/**
	 * Delete an entry
	 * @param {string|Entry} entryOrId - Entry ID or Entry instance
	 * @returns {Promise<void>}
	 */
	async deleteEntry(entryOrId) {
		const id = typeof entryOrId === 'string' ? entryOrId : entryOrId.id;
		console.log("[DEBUG] api.deleteEntry called", { id });
		await apiClient.delete(`/entries/${id}`);
	},
};

export default api;
