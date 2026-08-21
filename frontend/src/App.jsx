import { useEffect, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import { routes } from './routes.jsx';

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const Page = routes[currentPath] || routes['/'];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader currentPath={currentPath} />
      <main>
        <Page />
      </main>
    </div>
  );
}

function getCurrentPath() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

export default App;
