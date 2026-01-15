/**
 * Authentication Context
 * Provides global authentication state and methods
 */

import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, signOut as authSignOut } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Check auth status on mount
	useEffect(() => {
		console.log("[DEBUG] useEffect: AuthContext checkAuth on mount");
		checkAuth();
	}, []);

	async function checkAuth() {
		console.log("[DEBUG] checkAuth called");
		try {
			const currentUser = await getCurrentUser();
			setUser(currentUser);
		} catch (error) {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}

	async function signOut() {
		console.log("[DEBUG] signOut called");
		try {
			await authSignOut();
			setUser(null);
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		}
	}

	const value = {
		user,
		loading,
		signOut,
		checkAuth,
		isAuthenticated: !!user,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export default AuthContext;
