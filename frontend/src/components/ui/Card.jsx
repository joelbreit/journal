/**
 * Card Component
 * Warm, inviting container for content with soft borders and subtle shadows
 */

export function Card({ children, hover = false, className = "", ...props }) {
	const hoverStyles = hover
		? "hover:bg-amber-50 hover:shadow-md cursor-pointer"
		: "";

	return (
		<div
			className={`bg-white border border-amber-200 rounded-lg shadow-sm p-4 transition-all duration-300 ${hoverStyles} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export default Card;
