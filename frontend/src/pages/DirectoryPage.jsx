import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import SuggestionModal from '../components/SuggestionModal.jsx';
import { apiRequest } from '../lib/api.js';
import { directoryConfig } from '../lib/directory.js';

function DirectoryPage({ resource }) {
  const config = directoryConfig[resource];
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest(`/api/${resource}`)
      .then((data) => {
        if (!active) return;
        setItems(data);
        setState('ready');
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message);
        setState('error');
      });
    return () => { active = false; };
  }, [resource]);

  function openSuggestion() {
    if (authLoading) return;
    if (!user) {
      window.location.replace('/login');
      return;
    }
    setSuggestionOpen(true);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="border-b border-border pb-8">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{config.label}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{config.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{config.description}</p>
        <button className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" type="button" onClick={openSuggestion}>
          {config.suggestionLabel}
        </button>
      </div>

      {state === 'loading' && <p className="py-16 text-sm text-muted-foreground">Loading {config.title.toLowerCase()}...</p>}
      {state === 'error' && <p className="py-16 text-sm text-muted-foreground" role="alert">{error}</p>}
      {state === 'ready' && items.length === 0 && <p className="py-16 text-sm text-muted-foreground">{config.empty}</p>}
      {state === 'ready' && items.length > 0 && (
        <div className="divide-y divide-border">
          {items.map((item) => (
            <article className="flex flex-col gap-5 py-8 sm:flex-row sm:items-start sm:justify-between" key={item.id}>
              <div>
                <h2 className="text-xl font-medium">{item.name || item.title}</h2>
                {item.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>}
                {config.fields(item).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    {config.fields(item).map((field) => <span key={field}>{field}</span>)}
                  </div>
                )}
              </div>
              {config.link(item) && (
                <a className="inline-flex shrink-0 items-center gap-2 text-sm font-medium underline underline-offset-4" href={config.link(item)} target="_blank" rel="noreferrer">
                  Visit official link <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}
            </article>
          ))}
        </div>
      )}
      {suggestionOpen && <SuggestionModal type={config.submissionType} onClose={() => setSuggestionOpen(false)} onSubmitted={() => {}} />}
    </section>
  );
}

export default DirectoryPage;
