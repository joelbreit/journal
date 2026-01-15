/**
 * Login Page
 * Email/password authentication with AWS Cognito
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from "../components/ui/Link";

export function Login() {
	const navigate = useNavigate();
	const { checkAuth } = useAuth();

	const debugNavigate = (path, options) => {
		console.log("[DEBUG] useNavigate called:", { path, options });
		return navigate(path, options);
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		console.log("[DEBUG] onSubmit: Login form", { email });
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await signIn(email, password);

			if (result.isSignedIn) {
				await checkAuth();
				debugNavigate("/");
			} else {
				setError(
					"Sign in incomplete. Please check your email for verification."
				);
			}
		} catch (err) {
			console.error("Login error:", err);

			if (err.name === "UserNotConfirmedException") {
				setError("Please verify your email before signing in.");
				debugNavigate("/signup", {
					state: { email, needsConfirmation: true },
				});
			} else if (err.name === "NotAuthorizedException") {
				setError("Incorrect email or password.");
			} else if (err.name === "UserNotFoundException") {
				setError("No account found with this email.");
			} else {
				setError(err.message || "An error occurred during sign in.");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-5xl font-serif font-bold text-amber-950 mb-2">
						Journal
					</h1>
					<p className="text-amber-700">Welcome back</p>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
					<form
						onSubmit={(e) => {
							console.log(
								"[DEBUG] onSubmit: form submission triggered"
							);
							handleSubmit(e);
						}}
						className="space-y-6"
					>
						<Input
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							autoComplete="email"
							autoFocus
						/>

						<Input
							label="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							autoComplete="current-password"
						/>

						{error && (
							<div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

						<Button
							type="submit"
							variant="primary"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing in..." : "Sign In"}
						</Button>
					</form>

					<div className="mt-6 text-center space-y-2">
						<div className="text-sm text-amber-700">
							<Link to="/forgot-password">
								Forgot your password?
							</Link>
						</div>
						<div className="text-sm text-amber-700">
							Don't have an account?{" "}
							<Link to="/signup">Sign up</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
