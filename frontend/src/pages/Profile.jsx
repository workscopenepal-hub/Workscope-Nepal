import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest, createAuthHeaders } from '../lib/api.js';

function ProfileContent() {
  const { session, profile, user, signOut } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [reviewNote, setReviewNote] = useState({});

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

  async function reviewSubmission(id, status) {
    setReviewingId(id);
    setReviewError(null);
    try {
      const updated = await apiRequest(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { ...createAuthHeaders(session), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, review_note: reviewNote[id] || undefined }),
      });
      setSubmissions((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setReviewError(requestError.message);
    } finally {
      setReviewingId(null);
    }
  }

  const publicId = profile?.public_id || 'profile';
  const initials = `${publicId[0] || ''}${publicId.at(-1) || ''}`.toUpperCase();
  const canReview = ['admin', 'moderator'].includes(profile?.role);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-6 border-b border-border pb-10 sm:flex-row sm:items-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground" aria-hidden="true">{initials}</div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Your profile</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{publicId}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user?.email}</span>
            <span title="Your email address is private and is not publicly exposed." aria-label="Your email address is private and is not publicly exposed"><Info size={15} aria-hidden="true" /></span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{profile?.role || 'user'}</p>
        </div>
      </div>

      <div className="py-10">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Activity</p>
            <h2 className="mt-2 text-2xl font-semibold">{canReview ? 'Community submissions' : 'Your submissions'}</h2>
          </div>
          <span className="text-sm text-muted-foreground">{submissions.length} total</span>
        </div>
        {state === 'loading' && <p className="mt-8 text-sm text-muted-foreground">Loading submissions...</p>}
        {state === 'error' && <p className="mt-8 text-sm text-muted-foreground" role="alert">{error}</p>}
        {state === 'ready' && submissions.length === 0 && <p className="mt-8 text-sm text-muted-foreground">No submissions yet.</p>}
        {state === 'ready' && submissions.length > 0 && (
          <div className="mt-6 divide-y divide-border">
            {submissions.map((submission) => (
              <article className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between" key={submission.id}>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{submission.type}</p>
                  <h3 className="mt-2 font-medium">{submission.data?.name || submission.data?.title || 'Untitled submission'}</h3>
                  {canReview && <p className="mt-1 text-sm text-muted-foreground">Submitted by {submission.submitted_by}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{submission.status}</span>
                  {canReview && submission.status === 'pending' && (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <input className="w-48 rounded-md border border-input bg-background px-3 py-2 text-xs" placeholder="Optional review comment" value={reviewNote[submission.id] || ''} onChange={(event) => setReviewNote((current) => ({ ...current, [submission.id]: event.target.value }))} />
                      <button className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-60" type="button" disabled={reviewingId === submission.id} onClick={() => reviewSubmission(submission.id, 'approved')}>Approve</button>
                      <button className="rounded-md border border-border px-3 py-2 text-xs font-medium disabled:opacity-60" type="button" disabled={reviewingId === submission.id} onClick={() => reviewSubmission(submission.id, 'rejected')}>Reject</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {reviewError && <p className="mt-4 text-sm text-muted-foreground" role="alert">{reviewError}</p>}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-lg font-medium">Review comments</h2>
          {messages.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No review comments yet.</p> : <div className="mt-4 divide-y divide-border">{messages.map((message) => <p className="py-4 text-sm leading-6 text-muted-foreground" key={message.id}>{message.message}</p>)}</div>}
        </div>
      </div>
      <button className="mt-6 rounded-md border border-border px-4 py-2 text-sm font-medium" type="button" onClick={signOut}>Sign out</button>
    </section>
  );
}

function Profile() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}

export default Profile;
