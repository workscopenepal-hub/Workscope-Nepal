import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  const oauthInFlight = useRef(false);
  const profileToken = useRef(null);
  const profileRequestId = useRef(0);
  const authEventVersion = useRef(0);

  async function loadProfile(nextSession) {
    if (!nextSession?.access_token) {
      profileRequestId.current += 1;
      profileToken.current = null;
      setProfile(null);
      return;
    }

    if (profileToken.current === nextSession.access_token) return;
    profileToken.current = nextSession.access_token;
    const requestId = profileRequestId.current + 1;
    profileRequestId.current = requestId;

    try {
      const nextProfile = await getProfile(nextSession);
      if (requestId === profileRequestId.current) setProfile(nextProfile);
    } catch {
      if (requestId === profileRequestId.current) {
        profileToken.current = null;
        setProfile(null);
      }
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authEventVersion.current += 1;
      console.info('[Auth] State change', {
        event,
        hasSession: Boolean(nextSession),
        hasUser: Boolean(nextSession?.user),
        userId: nextSession?.user?.id ?? null,
      });
      if (event === 'SIGNED_OUT') profileToken.current = null;
      setSession(nextSession);
      loadProfile(nextSession).catch(() => setProfile(null));
      setLoading(false);
    });

    const initialAuthEventVersion = authEventVersion.current;
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || authEventVersion.current !== initialAuthEventVersion) return;

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

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    if (oauthInFlight.current) return { error: null };
    oauthInFlight.current = true;
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
      oauthInFlight.current = false;
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
