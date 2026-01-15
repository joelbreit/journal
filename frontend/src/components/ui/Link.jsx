/**
 * Link Component
 * Styled links with warm aesthetic
 */

export function Link({ children, href, className = "", ...props }) {
	return (
		<a
			href={href}
			className={`text-rose-400 hover:text-rose-500 transition-colors duration-300 underline decoration-rose-200 hover:decoration-rose-300 ${className}`}
			{...props}
		>
			{children}
		</a>
	);
}

export default Link;
