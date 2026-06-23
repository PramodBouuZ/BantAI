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

    // Requirement: Maximum callback processing = 5 seconds
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("AuthCallback: Safety timeout triggered (5s). Forcing redirect...");
        navigate('/dashboard', { replace: true });
      }
    }, 5000);

    const handleAuthCallback = async () => {
      // Requirement: Add logs for token received (check hash for implicit flow)
      const hasHashToken = window.location.hash.includes('access_token');
      console.log("AuthCallback: Processing callback... Hash token detected:", hasHashToken);

      if (!supabase) {
        navigate('/login');
        return;
      }

      try {
        // Requirement: Log session creation attempt
        console.log("AuthCallback: Attempting to fetch session...");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('AuthCallback: Error getting session:', error.message);
          navigate('/login');
          return;
        }

        if (data.session) {
          // Requirement: Log session created
          console.log("AuthCallback: Session successfully created for:", data.session.user.email);

          const user = data.session.user;
          const meta = user.user_metadata || {};

          // Requirement: Log user loaded
          console.log("AuthCallback: User loaded from Supabase Auth:", user.id);

          // Requirement: Profile lookup (still redirect if it fails)
          let userData = null;
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            if (profileError) throw profileError;
            userData = profile;
            // Requirement: Log profile loaded
            console.log("AuthCallback: Public profile loaded successfully");
          } catch (profileErr) {
            console.error("AuthCallback: Profile lookup failed, proceeding with metadata fallbacks:", profileErr);
          }

          // Requirement: Logic for Admin vs All others
          const role = user.email === 'info.bouuz@gmail.com' ? 'admin' : (userData?.role || meta.role || 'user');

          if (mounted) {
            setCurrentUser({
              id: user.id,
              name: userData?.full_name || meta.full_name || meta.name || 'User',
              email: user.email || '',
              role: role as any,
              joinedDate: user.created_at,
              company: userData?.company || meta.company,
              status: userData?.status || meta.status,
              logoUrl: userData?.logo_url || meta.logo_url
            });

            // Trigger Welcome Email (Non-blocking)
            if (role === 'user' && !userData) { // Only for first time new users
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: user.email,
                  type: 'user_welcome',
                  userId: user.id,
                  data: { userName: meta.full_name || meta.name || 'User' }
                })
              }).catch(err => console.error('Welcome email error:', err));
            }

            // Requirement: Specific redirect logic and Log redirect
            const redirectPath = role === 'admin' ? '/admin' : '/user/dashboard';
            console.log(`AuthCallback: Redirecting ${role} to ${redirectPath}`);

            clearTimeout(timeoutId);
            navigate(redirectPath, { replace: true });
          }
        } else {
          console.warn("AuthCallback: No session found in Supabase Auth");
          // Check if session might be in process of being set by the client
          // Wait a brief moment before giving up
          await new Promise(r => setTimeout(r, 1000));
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData.session) {
              console.log("AuthCallback: Session found on retry.");
              // Recurse once or handle here - for simplicity just reload or navigate dashboard
              navigate('/dashboard', { replace: true });
          } else {
              navigate('/login');
          }
        }
      } catch (err) {
        console.error("AuthCallback: Unexpected exception during callback processing:", err);
        navigate('/login');
      }
    };

    handleAuthCallback();
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
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
