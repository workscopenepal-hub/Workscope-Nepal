import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { getProfile } from '../lib/api.js';

const AuthContext = createContext(null);

function getSafeUrlDetails(url) {
  const parsedUrl = new URL(url);

  return {
    origin: parsedUrl.origin,
    pathname: parsedUrl.pathname,
    queryKeys: [...parsedUrl.searchParams.keys()],
    hashKeys: [...new URLSearchParams(parsedUrl.hash.slice(1)).keys()],
  };
}

function getSafeAuthError(error) {
  if (!error) return null;

  return {
    name: error.name,
    message: error.message,
    code: error.code,
    status: error.status,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProfile(nextSession) {
    if (!nextSession?.access_token) {
      setProfile(null);
      return;
    }

    try {
      setProfile(await getProfile(nextSession));
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    let active = true;

    const currentUrl = new URL(window.location.href);
    const callbackError = currentUrl.searchParams.get('error') || currentUrl.hash.includes('error=');

    if (callbackError) {
      console.error('[Auth] OAuth callback error', {
        url: getSafeUrlDetails(window.location.href),
        error: currentUrl.searchParams.get('error'),
        errorCode: currentUrl.searchParams.get('error_code'),
        errorDescription: currentUrl.searchParams.get('error_description'),
      });
    } else {
      console.info('[Auth] Initializing session', {
        url: getSafeUrlDetails(window.location.href),
      });
    }

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;

      if (sessionError) {
        console.error('[Auth] Initial session error', getSafeAuthError(sessionError));
        setError('Unable to load your session. Please try again.');
      }

      setSession(data.session);
      loadProfile(data.session).catch(() => setProfile(null));
      setLoading(false);
      console.info('[Auth] Initial session result', {
        hasSession: Boolean(data.session),
        hasUser: Boolean(data.session?.user),
        userId: data.session?.user?.id ?? null,
        error: getSafeAuthError(sessionError),
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      console.info('[Auth] State change', {
        event,
        hasSession: Boolean(nextSession),
        hasUser: Boolean(nextSession?.user),
        userId: nextSession?.user?.id ?? null,
      });
      setSession(nextSession);
      loadProfile(nextSession).catch(() => setProfile(null));
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    setError(null);
    const redirectTo = `${window.location.origin}/companies`;

    console.info('[Auth] Starting Google OAuth', {
      provider: 'google',
      redirectTo,
      origin: window.location.origin,
    });

    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    console.info('[Auth] Google OAuth initiation result', {
      hasUrl: Boolean(data?.url),
      url: data?.url ? getSafeUrlDetails(data.url) : null,
      error: getSafeAuthError(signInError),
    });

    if (signInError) {
      console.error('[Auth] Google OAuth initiation error', getSafeAuthError(signInError));
      const message = 'Unable to start Google sign-in. Please try again.';
      setError(message);
      return { error: new Error(message) };
    }

    return { error: null };
  }

  async function signOut() {
    setError(null);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError('Unable to sign out. Please try again.');
    }

    return { error: signOutError };
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        profile,
        session,
        loading,
        error,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
