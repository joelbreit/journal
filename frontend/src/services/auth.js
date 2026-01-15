/**
 * Authentication Service
 * Handles all AWS Cognito authentication using AWS Amplify
 */

import { Amplify } from 'aws-amplify';
import {
	signUp as amplifySignUp,
	signIn as amplifySignIn,
	signOut as amplifySignOut,
	getCurrentUser as amplifyGetCurrentUser,
	confirmSignUp as amplifyConfirmSignUp,
	resetPassword as amplifyResetPassword,
	confirmResetPassword as amplifyConfirmResetPassword,
	fetchAuthSession,
} from 'aws-amplify/auth';

// Configure Amplify
Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
			userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
			region: import.meta.env.VITE_REGION || 'us-east-1',
		},
	},
});

/**
 * Sign up a new user
 */
export async function signUp(email, password) {
	console.log("[DEBUG] signUp called", { email });
	try {
		const { userId, isSignUpComplete, nextStep } = await amplifySignUp({
			username: email,
			password,
			options: {
				userAttributes: {
					email,
				},
			},
		});

		return {
			userId,
			isSignUpComplete,
			nextStep,
		};
	} catch (error) {
		console.error('Error signing up:', error);
		throw error;
	}
}

/**
 * Confirm sign up with verification code
 */
export async function confirmSignUp(email, code) {
	console.log("[DEBUG] confirmSignUp called", { email });
	try {
		const result = await amplifyConfirmSignUp({
			username: email,
			confirmationCode: code,
		});
		return result;
	} catch (error) {
		console.error('Error confirming sign up:', error);
		throw error;
	}
}

/**
 * Sign in user
 */
export async function signIn(email, password) {
	console.log("[DEBUG] signIn called", { email });
	try {
		const { isSignedIn, nextStep } = await amplifySignIn({
			username: email,
			password,
		});

		return {
			isSignedIn,
			nextStep,
		};
	} catch (error) {
		console.error('Error signing in:', error);
		throw error;
	}
}

/**
 * Sign out user
 */
export async function signOut() {
	console.log("[DEBUG] signOut called");
	try {
		await amplifySignOut();
	} catch (error) {
		console.error('Error signing out:', error);
		throw error;
	}
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
	console.log("[DEBUG] getCurrentUser called");
	try {
		const user = await amplifyGetCurrentUser();
		return user;
	} catch (error) {
		// User not signed in
		return null;
	}
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
	console.log("[DEBUG] isAuthenticated called");
	try {
		await amplifyGetCurrentUser();
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Get auth session (includes tokens)
 */
export async function getAuthSession() {
	console.log("[DEBUG] getAuthSession called");
	try {
		const session = await fetchAuthSession();
		return session;
	} catch (error) {
		console.error('Error getting auth session:', error);
		return null;
	}
}

/**
 * Reset password - send reset code
 */
export async function resetPassword(email) {
	console.log("[DEBUG] resetPassword called", { email });
	try {
		const result = await amplifyResetPassword({
			username: email,
		});
		return result;
	} catch (error) {
		console.error('Error resetting password:', error);
		throw error;
	}
}

/**
 * Confirm password reset with code and new password
 */
export async function confirmPasswordReset(email, code, newPassword) {
	console.log("[DEBUG] confirmPasswordReset called", { email });
	try {
		await amplifyConfirmResetPassword({
			username: email,
			confirmationCode: code,
			newPassword,
		});
	} catch (error) {
		console.error('Error confirming password reset:', error);
		throw error;
	}
}

export default {
	signUp,
	confirmSignUp,
	signIn,
	signOut,
	getCurrentUser,
	isAuthenticated,
	getAuthSession,
	resetPassword,
	confirmPasswordReset,
};
