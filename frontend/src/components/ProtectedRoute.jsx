import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.replace('/login');
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <section className="mx-auto flex min-h-64 max-w-6xl items-center justify-center px-6 py-20 lg:px-8">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
