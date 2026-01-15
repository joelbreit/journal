/**
 * Forgot Password Page
 * Password reset with verification code
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword, confirmPasswordReset } from "../services/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Link } from "../components/ui/Link";

export function ForgotPassword() {
	const navigate = useNavigate();

	const debugNavigate = (path, options) => {
		console.log("[DEBUG] useNavigate called:", { path, options });
		return navigate(path, options);
	};

	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState("email"); // 'email' or 'reset'

	async function handleRequestReset(e) {
		console.log("[DEBUG] onSubmit: Request reset form", { email });
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await resetPassword(email);
			setStep("reset");
		} catch (err) {
			console.error("Reset request error:", err);

			if (err.name === "UserNotFoundException") {
				setError("No account found with this email.");
			} else if (err.name === "LimitExceededException") {
				setError("Too many attempts. Please try again later.");
			} else {
				setError(err.message || "An error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleResetPassword(e) {
		console.log("[DEBUG] onSubmit: Reset password form", { email });
		e.preventDefault();
		setError("");

		// Validate passwords match
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		// Validate password strength
		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters long.");
			return;
		}

		setLoading(true);

		try {
			await confirmPasswordReset(email, code, newPassword);
			debugNavigate("/login", {
				state: {
					message: "Password reset successful! Please sign in.",
				},
			});
		} catch (err) {
			console.error("Password reset error:", err);

			if (err.name === "CodeMismatchException") {
				setError(
					"Invalid verification code. Please check and try again."
				);
			} else if (err.name === "ExpiredCodeException") {
				setError(
					"Verification code has expired. Please request a new one."
				);
				setStep("email");
			} else if (err.name === "InvalidPasswordException") {
				setError(
					"Password does not meet requirements. Must be at least 8 characters."
				);
			} else {
				setError(err.message || "An error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	}

	if (step === "reset") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<h1 className="text-5xl font-serif font-bold text-amber-950 mb-2">
							Journal
						</h1>
						<p className="text-amber-700">Reset your password</p>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
						<div className="mb-6 text-center">
							<p className="text-amber-800 text-sm">
								We've sent a verification code to{" "}
								<strong>{email}</strong>. Please check your
								email and enter the code below with your new
								password.
							</p>
						</div>

						<form
							onSubmit={(e) => {
								console.log(
									"[DEBUG] onSubmit: form submission triggered (reset password)"
								);
								handleResetPassword(e);
							}}
							className="space-y-6"
						>
							<Input
								label="Verification Code"
								type="text"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="123456"
								required
								autoFocus
								pattern="[0-9]*"
							/>

							<Input
								label="New Password"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="••••••••"
								required
								autoComplete="new-password"
								helperText="At least 8 characters"
							/>

							<Input
								label="Confirm New Password"
								type="password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
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
								{loading
									? "Resetting password..."
									: "Reset Password"}
							</Button>
						</form>

						<div className="mt-6 text-center text-sm text-amber-700">
							<button
								type="button"
								onClick={() => {
									console.log(
										"[DEBUG] onClick: Didn't receive code button"
									);
									setStep("email");
								}}
								className="text-rose-400 hover:text-rose-500 underline"
							>
								Didn't receive a code?
							</button>
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
					<p className="text-amber-700">Reset your password</p>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-8">
					<div className="mb-6 text-center">
						<p className="text-amber-800 text-sm">
							Enter your email address and we'll send you a
							verification code to reset your password.
						</p>
					</div>

					<form
						onSubmit={(e) => {
							console.log(
								"[DEBUG] onSubmit: form submission triggered (request reset)"
							);
							handleRequestReset(e);
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
							{loading
								? "Sending code..."
								: "Send Verification Code"}
						</Button>
					</form>

					<div className="mt-6 text-center text-sm text-amber-700">
						Remember your password? <Link to="/login">Sign in</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
