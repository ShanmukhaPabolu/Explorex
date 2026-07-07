import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Compass } from 'lucide-react';

/**
 * Supabase redirects here after Google / GitHub OAuth.
 * Handles both PKCE (code in query params) and implicit (tokens in hash) flows.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const url = new URL(window.location.href);

      // Check for OAuth error from provider
      const oauthError = url.searchParams.get('error');
      const oauthErrorDesc = url.searchParams.get('error_description');
      if (oauthError) {
        setError(oauthErrorDesc ?? oauthError);
        return;
      }

      const code = url.searchParams.get('code');

      if (code) {
        // PKCE flow — exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (exchangeError) {
          // If PKCE verifier is missing, try getting the current session anyway
          // (Supabase may have already handled it via onAuthStateChange)
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            navigate('/dashboard', { replace: true });
            return;
          }
          setError(exchangeError.message);
          return;
        }
      }

      // For both PKCE (after exchange) and implicit flow (hash tokens),
      // wait for the session to be established via auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session) {
            navigate('/dashboard', { replace: true });
          }
        }
      );

      // Also check if session already exists right now
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        subscription.unsubscribe();
        navigate('/dashboard', { replace: true });
        return;
      }

      // Timeout after 10 seconds
      const timer = setTimeout(() => {
        subscription.unsubscribe();
        setError('Authentication timed out. Please try again.');
      }, 10000);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-black text-slate-900 mb-2">Authentication Failed</h1>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-5">
      <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center animate-pulse">
        <Compass className="w-7 h-7 text-white" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-slate-800">Signing you in…</p>
        <p className="text-slate-400 text-sm mt-1">Hang tight, almost there!</p>
      </div>
      <svg className="w-8 h-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
}
