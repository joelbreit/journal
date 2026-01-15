/**
 * Auto-save Hook
 * Debounced auto-save with status tracking
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Auto-save hook that debounces saves and tracks status
 * @param {*} content - Content to save
 * @param {Function} saveFunction - Async function to call for saving
 * @param {number} delay - Debounce delay in milliseconds (default 5000)
 * @returns {string} Status: 'saved' | 'pending' | 'saving' | 'error'
 */
export function useAutoSave(content, saveFunction, delay = 5000) {
	const [status, setStatus] = useState('saved');
	const timeoutRef = useRef(null);
	const previousContent = useRef(content);
	const isMounted = useRef(true);

	useEffect(() => {
		console.log("[DEBUG] useEffect: useAutoSave mount/unmount tracking");
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		console.log("[DEBUG] useEffect: useAutoSave content change", { 
			contentLength: content?.length, 
			previousLength: previousContent.current?.length,
			delay 
		});
		// Clear existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// If content hasn't changed, don't save
		if (content === previousContent.current) {
			return;
		}

		// Mark as pending
		setStatus('pending');

		// Set up debounced save
		timeoutRef.current = setTimeout(async () => {
			if (!isMounted.current) return;

			setStatus('saving');
			try {
				await saveFunction(content);
				if (isMounted.current) {
					setStatus('saved');
					previousContent.current = content;
				}
			} catch (error) {
				console.error('Auto-save failed:', error);
				if (isMounted.current) {
					setStatus('error');
				}
			}
		}, delay);

		// Cleanup on unmount
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [content, saveFunction, delay]);

	return status;
}

export default useAutoSave;
