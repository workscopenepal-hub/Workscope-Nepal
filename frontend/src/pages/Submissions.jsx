import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest, createAuthHeaders } from '../lib/api.js';
import { submissionConfig, submitSuggestion } from '../lib/submissions.js';
import { Field } from '../components/SuggestionModal.jsx';

function SubmissionContent() {
  const { session, profile } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [type, setType] = useState('company');
  const [formData, setFormData] = useState({});
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState(null);
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = createAuthHeaders(session);
    Promise.all([
      apiRequest('/api/submissions', { headers }),
      apiRequest('/api/submission-messages', { headers }),
    ])
      .then(([nextSubmissions, nextMessages]) => {
        setSubmissions(nextSubmissions);
        setMessages(nextMessages);
        setState('ready');
      })
      .catch((requestError) => {
        setError(requestError.message);
        setState('error');
      });
  }, [session]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitState('submitting');
    setSubmitError(null);
    try {
      const submission = await submitSuggestion(type, formData, session);
      setSubmissions((current) => [submission, ...current]);
      setFormData({});
      setSubmitState('submitted');
    } catch (requestError) {
      setSubmitError(requestError.message);
      setSubmitState('idle');
    }
  }

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setSubmitState('idle');
  }

  function handleTypeChange(event) {
    setType(event.target.value);
    setFormData({});
    setSubmitError(null);
    setSubmitState('idle');
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="border-b border-border pb-8">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Your activity</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Submissions</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Track submissions connected to your profile {profile?.public_id ? `(${profile.public_id})` : ''}.
        </p>
      </div>
      <div className="grid gap-16 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="text-lg font-medium">Submission history</h2>
          {state === 'loading' && <p className="mt-6 text-sm text-muted-foreground">Loading your submissions...</p>}
          {state === 'error' && <p className="mt-6 text-sm text-muted-foreground" role="alert">{error}</p>}
          {state === 'ready' && submissions.length === 0 && <p className="mt-6 text-sm text-muted-foreground">You have not made any submissions.</p>}
          {state === 'ready' && submissions.length > 0 && (
            <div className="mt-6 divide-y divide-border">
              {submissions.map((submission) => (
                <article className="flex items-center justify-between gap-4 py-5" key={submission.id}>
                  <div>
                    <h3 className="font-medium capitalize">{submission.type}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{submission.data?.name || submission.data?.title || 'Untitled submission'}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{submission.status}</span>
                </article>
              ))}
            </div>
          )}
        </div>
        <div>
            <h2 className="text-lg font-medium">Suggest something</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm">
                <span className="mb-2 block text-muted-foreground">Submission type</span>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2" value={type} onChange={handleTypeChange}>
                  <option value="company">Company</option>
                  <option value="opportunity">Opportunity</option>
                    <option value="event">Event</option>
                    <option value="community">Community</option>
                </select>
              </label>
                {submissionConfig[type].fields.map((field) => <Field key={field.key} field={field} value={formData[field.key]} onChange={(value) => updateField(field.key, value)} />)}
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60" type="submit" disabled={submitState === 'submitting'}>
                {submitState === 'submitting' ? 'Submitting...' : 'Submit for review'}
              </button>
              {submitState === 'submitted' && <p className="text-sm text-muted-foreground">Submitted for admin review.</p>}
              {submitError && <p className="text-sm text-muted-foreground" role="alert">{submitError}</p>}
            </form>
            <h2 className="mt-16 text-lg font-medium">Review messages</h2>
            {state === 'loading' ? (
              <p className="mt-6 text-sm text-muted-foreground">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No review messages yet.</p>
            ) : (
              <div className="mt-6 divide-y divide-border">
                {messages.map((item) => <p className="py-5 text-sm leading-6 text-muted-foreground" key={item.id}>{item.message}</p>)}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

function Submissions() {
  return <ProtectedRoute><SubmissionContent /></ProtectedRoute>;
}

export default Submissions;
