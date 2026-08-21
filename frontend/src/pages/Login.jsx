import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { user, loading, error: authError, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      window.location.replace('/companies');
    }
  }, [loading, user]);

  if (!loading && user) return null;

  async function handleGoogleSignIn() {
    setIsSigningIn(true);
    setError(null);
    const result = await signInWithGoogle();

    if (result.error) {
      setError(result.error.message);
      setIsSigningIn(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center justify-center px-6 py-20 lg:px-8">
      <div className="w-full max-w-sm text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Workscope Nepal</p>
        <h1 className="text-3xl font-semibold tracking-tight">Sign in to continue</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Use your Google account to access the company directory.</p>
        <button
          className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? 'Connecting...' : 'Continue with Google'}
        </button>
        {(error || authError) && (
          <p className="mt-4 text-sm text-muted-foreground" role="alert">{error || authError}</p>
        )}
      </div>
    </section>
  );
}

export default Login;
