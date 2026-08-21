-- Restrict application-facing execution privileges to trigger-only functions.
revoke execute on function public.generate_public_id() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.prevent_role_change() from public, anon, authenticated;
revoke execute on function public.materialize_approved_submission() from public, anon, authenticated;

-- A submission may be reviewed exactly once. This prevents duplicate publication
-- and duplicate rejection messages caused by repeated status changes.
create or replace function public.enforce_submission_review_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status <> 'pending' and new.status <> old.status then
    raise exception 'reviewed submissions cannot change status';
  end if;
  if new.status = 'pending' and (new.reviewed_by is not null or new.reviewed_at is not null) then
    raise exception 'pending submissions cannot have review metadata';
  end if;
  return new;
end;
$$;

create trigger submissions_enforce_review_transition
before update of status, reviewed_by, reviewed_at on public.submissions
for each row execute function public.enforce_submission_review_transition();

-- Authenticated users also need to read approved public content through PostgREST.
grant select on public.companies, public.opportunities, public.events, public.communities to authenticated;
revoke all on function public.enforce_submission_review_transition() from public, anon, authenticated;
