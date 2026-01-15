/**
 * Signup Page
 * User registration with email verification
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signUp, confirmSignUp } from "../services/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from "../components/ui/Link";

export function Signup() {
	const navigate = useNavigate();
	const location = useLocation();

	const debugNavigate = (path, options) => {
		console.log("[DEBUG] useNavigate called:", { path, options });
		return navigate(path, options);
	};

	const [email, setEmail] = useState(location.state?.email || "");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmationCode, setConfirmationCode] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [needsConfirmation, setNeedsConfirmation] = useState(
		location.state?.needsConfirmation || false
	);

	useEffect(() => {
		console.log("[DEBUG] useEffect: Signup location state check", {
			locationState: location.state,
		});
		if (location.state?.needsConfirmation) {
			setNeedsConfirmation(true);
		}
	}, [location.state]);

	async function handleSignup(e) {
		console.log("[DEBUG] onSubmit: Signup form", { email });
		e.preventDefault();
		setError("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		// Validate password strength
		if (password.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}

		setLoading(true);

		try {
			const result = await signUp(email, password);

			if (result.isSignUpComplete) {
				debugNavigate("/login", {
					state: { message: "Account created! Please sign in." },
				});
			} else {
				setNeedsConfirmation(true);
			}
		} catch (err) {
			console.error("Signup error:", err);

			if (err.name === "UsernameExistsException") {
				setError("An account with this email already exists.");
			} else if (err.name === "InvalidPasswordException") {
				setError(
					"Password does not meet requirements. Must be at least 8 characters."
				);
			} else if (err.name === "InvalidParameterException") {
				setError("Invalid email or password format.");
			} else {
				setError(err.message || "An error occurred during sign up.");
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleConfirmation(e) {
		console.log("[DEBUG] onSubmit: Confirmation form", { email });
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await confirmSignUp(email, confirmationCode);
			debugNavigate("/login", {
				state: { message: "Email verified! Please sign in." },
			});
		} catch (err) {
			console.error("Confirmation error:", err);

			if (err.name === "CodeMismatchException") {
				setError(
					"Invalid verification code. Please check and try again."
				);
			} else if (err.name === "ExpiredCodeException") {
				setError(
					"Verification code has expired. Please request a new one."
				);
			} else {
				setError(
					err.message || "An error occurred during verification."
				);
			}
		} finally {
			setLoading(false);
		}
	}

	if (needsConfirmation) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-5xl font-serif font-bold text-amber-950 mb-2">
							Journal
						</h1>
						<p className="text-amber-700">Verify your email</p>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
						<div className="mb-6 text-center">
							<p className="text-amber-800 text-sm">
								We've sent a verification code to{" "}
								<strong>{email}</strong>. Please check your
								email and enter the code below.
							</p>
						</div>

						<form
							onSubmit={(e) => {
								console.log(
									"[DEBUG] onSubmit: form submission triggered (confirmation)"
								);
								handleConfirmation(e);
							}}
							className="space-y-6"
						>
							<Input
								label="Verification Code"
								type="text"
								value={confirmationCode}
								onChange={(e) =>
									setConfirmationCode(e.target.value)
								}
								placeholder="123456"
								required
								autoFocus
								pattern="[0-9]*"
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
								{loading ? "Verifying..." : "Verify Email"}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm text-amber-700">
							<Link to="/login">Back to sign in</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-5xl font-serif font-bold text-amber-950 mb-2">
						Journal
					</h1>
					<p className="text-amber-700">Create your account</p>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
					<form
						onSubmit={(e) => {
							console.log(
								"[DEBUG] onSubmit: form submission triggered (signup)"
							);
							handleSignup(e);
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
							autoComplete="new-password"
							helperText="At least 8 characters"
						/>

						<Input
							label="Confirm Password"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							required
							autoComplete="new-password"
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
							{loading ? "Creating account..." : "Sign Up"}
						</Button>
					</form>

					<div className="mt-6 text-center text-sm text-amber-700">
						Already have an account?{" "}
						<Link to="/login">Sign in</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Signup;
