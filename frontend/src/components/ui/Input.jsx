/**
 * Input Component
 * Warm, soft text input with amber accents
 */

export function Input({ label, error, className = "", ...props }) {
	return (
		<div className="w-full">
			{label && (
				<label className="block text-sm font-medium text-amber-900 mb-1.5">
					{label}
				</label>
			)}
			<input
				className={`w-full px-4 py-2 bg-white border rounded-lg text-amber-950 placeholder-amber-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent ${
					error ? "border-red-300" : "border-amber-200"
				} ${className}`}
				{...props}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}

export default Input;
