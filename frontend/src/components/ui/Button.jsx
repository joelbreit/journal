/**
 * Button Component
 * Follows warm/personal aesthetic with terracotta primary and amber secondary
 */

export function Button({
	children,
	variant = "primary",
	size = "md",
	className = "",
	...props
}) {
	const baseStyles =
		"font-medium transition-all duration-300 ease-in-out rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	const variants = {
		primary:
			"bg-rose-400 text-white hover:bg-rose-500 active:bg-rose-600 focus:ring-rose-400",
		secondary:
			"border border-amber-300 text-amber-900 hover:bg-amber-50 active:bg-amber-100 focus:ring-amber-300",
		ghost: "text-amber-900 hover:bg-amber-50 active:bg-amber-100",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-sm",
		lg: "px-6 py-3 text-base",
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}

export default Button;
