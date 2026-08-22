import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import SuggestionModal from '../components/SuggestionModal.jsx';
import { apiRequest } from '../lib/api.js';
import { directoryConfig } from '../lib/directory.js';

function DirectoryPage({ resource }) {
  const config = directoryConfig[resource];
  const isCompanyDirectory = resource === 'companies';
  const pageSize = 10;
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

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

  const visibleItems = useMemo(() => {
    if (!isCompanyDirectory) return items;

    const searchTerm = search.trim().toLocaleLowerCase();
    return [...items]
      .filter((item) => !searchTerm || (item.name || '').toLocaleLowerCase().includes(searchTerm))
      .sort((first, second) => {
        const comparison = (first.name || '').localeCompare(second.name || '', undefined, { sensitivity: 'base' });
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [isCompanyDirectory, items, search, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const paginatedItems = isCompanyDirectory
    ? visibleItems.slice((page - 1) * pageSize, page * pageSize)
    : visibleItems;

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function updateSortOrder(value) {
    setSortOrder(value);
    setPage(1);
  }

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
      {state === 'ready' && isCompanyDirectory && (
        <div className="flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-end sm:justify-between">
          <label className="flex w-full max-w-md flex-col gap-2 text-sm font-medium" htmlFor="company-search">
            Search companies
            <span className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden="true" />
              <input className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary" id="company-search" type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search by company name" />
            </span>
          </label>
          <label className="flex items-center gap-3 text-sm font-medium" htmlFor="company-sort">
            Sort
            <select className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary" id="company-sort" value={sortOrder} onChange={(event) => updateSortOrder(event.target.value)}>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </label>
        </div>
      )}
      {state === 'ready' && isCompanyDirectory && items.length > 0 && paginatedItems.length === 0 && (
        <p className="py-16 text-sm text-muted-foreground">No companies match your search.</p>
      )}
      {state === 'ready' && paginatedItems.length > 0 && (
        <div className="divide-y divide-border">
          {paginatedItems.map((item) => (
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
      {state === 'ready' && isCompanyDirectory && visibleItems.length > 0 && pageCount > 1 && (
        <nav className="flex items-center justify-between border-t border-border pt-6" aria-label="Company pages">
          <p className="text-sm text-muted-foreground">Page {page} of {pageCount}</p>
          <div className="flex gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => setPage((currentPage) => currentPage - 1)} disabled={page === 1}>
              <ChevronLeft size={16} aria-hidden="true" /> Previous
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => setPage((currentPage) => currentPage + 1)} disabled={page === pageCount}>
              Next <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
      {suggestionOpen && <SuggestionModal type={config.submissionType} onClose={() => setSuggestionOpen(false)} onSubmitted={() => {}} />}
    </section>
  );
}

export default DirectoryPage;
