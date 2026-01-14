/**
 * Tag Component
 * Pill-shaped tags with muted, sun-faded colors
 */

export function Tag({
  children,
  color = 'amber',
  className = '',
  ...props
}) {
  const colors = {
    personal: 'bg-rose-200 text-rose-900',
    work: 'bg-amber-200 text-amber-900',
    gratitude: 'bg-emerald-200 text-emerald-900',
    goals: 'bg-blue-200 text-blue-900',
    reflection: 'bg-purple-200 text-purple-900',
    amber: 'bg-amber-200 text-amber-900',
    sage: 'bg-emerald-200 text-emerald-900',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Tag;
