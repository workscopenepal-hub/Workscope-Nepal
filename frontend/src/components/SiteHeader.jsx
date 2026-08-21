import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { handleInternalNavigation } from '../lib/navigation.js';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/companies', label: 'Companies' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/events', label: 'Events' },
  { href: '/communities', label: 'Communities' },
];

function SiteHeader({ currentPath }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
        <a className="text-sm font-semibold tracking-tight" href="/">
          Workscope Nepal
        </a>
        <div className="flex items-center gap-5">
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-5 text-sm text-muted-foreground sm:gap-7">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    className={
                      currentPath === item.href
                        ? 'font-medium text-foreground'
                        : 'hover:text-foreground'
                    }
                    href={item.href}
                    onClick={(event) => handleInternalNavigation(event, item.href)}
                    aria-current={currentPath === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {user && (
            <>
              <a className="text-sm text-muted-foreground hover:text-foreground" href="/submissions" onClick={(event) => handleInternalNavigation(event, '/submissions')}>Submissions</a>
              <button className="text-sm text-muted-foreground hover:text-foreground" type="button" onClick={signOut}>Sign out</button>
            </>
          )}
          <button
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon aria-hidden="true" size={16} />
            ) : (
              <Sun aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
