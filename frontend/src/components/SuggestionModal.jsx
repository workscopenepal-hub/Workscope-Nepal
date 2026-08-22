import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { submissionConfig, submitSuggestion } from '../lib/submissions.js';

function SuggestionModal({ type, onClose, onSubmitted }) {
  const { session } = useAuth();
  const config = submissionConfig[type];
  const [values, setValues] = useState({});
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && state !== 'submitting') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, state]);

  function updateField(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setState('idle');
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setState('submitting');
    setError(null);
    try {
      const submission = await submitSuggestion(type, values, session);
      onSubmitted(submission);
      setState('submitted');
    } catch (requestError) {
      setState('idle');
      setError(requestError.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && state !== 'submitting') onClose(); }}>
      <div className="max-h-full w-full max-w-lg overflow-y-auto rounded-md border border-border bg-background p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="suggestion-title">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="suggestion-title" className="text-2xl font-semibold">{config.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{config.description}</p>
          </div>
          <button className="rounded-md p-1 text-muted-foreground hover:bg-muted" type="button" aria-label="Close suggestion form" onClick={onClose} disabled={state === 'submitting'}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {state === 'submitted' ? (
          <div className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">Your suggestion was submitted for admin review.</p>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" type="button" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {config.fields.map((field) => <Field key={field.key} field={field} value={values[field.key]} onChange={(value) => updateField(field.key, value)} />)}
            {error && <p className="text-sm text-muted-foreground" role="alert">{error}</p>}
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60" type="submit" disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Submitting...' : 'Submit for review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function Field({ field, value, onChange }) {
  if (field.component === 'checkbox') {
    return <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span>{field.label}</span></label>;
  }

  if (field.component === 'textarea') {
    return <label className="block text-sm"><span className="mb-2 block text-muted-foreground">{field.label}</span><textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2" value={value || ''} onChange={(event) => onChange(event.target.value)} maxLength={field.maxLength} required={field.required} /></label>;
  }

  if (field.component === 'select') {
    return <label className="block text-sm"><span className="mb-2 block text-muted-foreground">{field.label}</span><select className="w-full rounded-md border border-input bg-background px-3 py-2" value={value || ''} onChange={(event) => onChange(event.target.value)} required={field.required}><option value="">Select one</option>{field.options.map((option) => <option key={option} value={option}>{option.replace('_', ' ')}</option>)}</select></label>;
  }

  return <label className="block text-sm"><span className="mb-2 block text-muted-foreground">{field.label}</span><input className="w-full rounded-md border border-input bg-background px-3 py-2" type={field.type || 'text'} value={value || ''} onChange={(event) => onChange(event.target.value)} required={field.required} /></label>;
}

export default SuggestionModal;
