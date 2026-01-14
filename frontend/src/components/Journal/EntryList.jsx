/**
 * Entry List Component
 * Fetches and displays all journal entries
 */

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { EntryCard } from './EntryCard';
import { BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export function EntryList() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEntries();
      setEntries(data);
    } catch (err) {
      console.error('Error loading entries:', err);
      setError(err.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mb-4"></div>
          <p className="text-amber-700 font-medium">Loading your journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
        <AlertCircle className="inline-block text-rose-400 mb-2" size={32} />
        <p className="text-rose-700 mb-4">{error}</p>
        <Button variant="secondary" onClick={loadEntries}>
          Try Again
        </Button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4">
          <BookOpen size={40} className="text-amber-600" />
        </div>
        <h3 className="text-2xl font-serif font-semibold text-amber-950 mb-2">
          No entries yet
        </h3>
        <p className="text-amber-700 mb-6">
          Start your journaling journey by creating your first entry
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/entry/new')}
        >
          Create First Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-semibold text-amber-950">
          Your Journal
        </h2>
        <p className="text-sm text-amber-600">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default EntryList;
