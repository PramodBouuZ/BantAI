import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { User } from '../types';
import { useData } from '../context/DataContext';

const AuthCallback: React.FC = () => {
  const { setCurrentUser } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const handleAuthCallback = async () => {
      console.log("AuthCallback: Processing callback...");
      if (!supabase) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthCallback: Error getting session:', error.message);
          navigate('/login');
          return;
        }

        if (data.session) {
          console.log("AuthCallback: Session established for", data.session.user.email);
          const user = data.session.user;
          const meta = user.user_metadata || {};

          // Fetch full profile to ensure we have the correct role/company
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          const role = user.email === 'info.bouuz@gmail.com' ? 'admin' : (userData?.role || 'user');

          if (mounted) {
            setCurrentUser({
              id: user.id,
              name: userData?.full_name || meta.full_name || meta.name || 'User',
              email: user.email || '',
              role: role as any,
              joinedDate: user.created_at,
              company: userData?.company,
              status: userData?.status,
              logoUrl: userData?.logo_url
            });

            console.log("AuthCallback: User profile set, redirecting to dashboard...");
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
          }
        } else {
          // If no session after callback, go back to login
          console.warn("AuthCallback: No session found after callback");
          navigate('/login');
        }
      } catch (err) {
        console.error("AuthCallback: Unexpected error:", err);
        navigate('/login');
      }
    };

    handleAuthCallback();
    return () => { mounted = false; };
  }, [navigate, setCurrentUser]);

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
