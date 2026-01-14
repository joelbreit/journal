/**
 * Entry Card Component
 * Displays a journal entry preview in a card format
 */

import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Calendar } from 'lucide-react';

export function EntryCard({ entry }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/entry/${entry.id}`);
  };

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const relativeTime = entry.getRelativeTime?.() || '';

  return (
    <Card
      hover
      onClick={handleClick}
      className="cursor-pointer transition-all duration-300"
    >
      <div className="space-y-2">
        {/* Title */}
        <h3 className="text-xl font-serif font-semibold text-amber-950 line-clamp-2">
          {entry.title || 'Untitled'}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Calendar size={14} />
          <span>{formattedDate}</span>
          {relativeTime && (
            <>
              <span className="text-amber-400">•</span>
              <span className="text-amber-600">{relativeTime}</span>
            </>
          )}
        </div>

        {/* Preview */}
        {entry.preview && (
          <p className="text-amber-800 line-clamp-3 leading-relaxed">
            {entry.preview}
          </p>
        )}

        {/* Word count */}
        {entry.getWordCount?.() > 0 && (
          <div className="text-xs text-amber-600 pt-2 border-t border-amber-100">
            {entry.getWordCount()} words
          </div>
        )}
      </div>
    </Card>
  );
}

export default EntryCard;
