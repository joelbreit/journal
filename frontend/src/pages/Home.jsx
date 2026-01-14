/**
 * Home Page
 * Main journal page with entry list and navigation
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EntryList } from '../components/Journal/EntryList';
import { Button } from '../components/ui/Button';
import { PenSquare, LogOut } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-950">Journal</h1>
              {user?.username && (
                <p className="text-xs text-amber-600">{user.username}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/entry/new')}
                className="flex items-center gap-2"
              >
                <PenSquare size={18} />
                New Entry
              </Button>

              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EntryList />
      </main>
    </div>
  );
}

export default Home;
