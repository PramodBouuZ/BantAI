import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { User } from '../types';

interface AuthCallbackProps {
  setCurrentUser: (user: User | null) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
        navigate('/login');
        return;
      }

      if (data.session) {
        const user = data.session.user;
        const meta = user.user_metadata || {};
        const role = user.email === 'info.bouuz@gmail.com' ? 'admin' : 'user';

        setCurrentUser({
          id: user.id,
          name: meta.full_name || meta.name || 'User',
          email: user.email || '',
          role: role as any,
          joinedDate: user.created_at
        });

        // Trigger User Welcome Email (Send only once - handled by duplicate prevention in API)
        if (role === 'user') {
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.email,
              type: 'user_welcome',
              userId: user.id,
              data: {
                userName: meta.full_name || meta.name || 'User'
              }
            })
          }).catch(err => console.error('Welcome email error:', err));
        }

        // Redirect to /dashboard which App.tsx handles for role-based routing
        navigate('/dashboard', { replace: true });
      } else {
        // If no session after callback, go back to login
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Authenticating...</h2>
        <p className="text-slate-500 font-medium">Completing secure sign-in, please wait.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
