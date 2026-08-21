create or replace function public.enforce_submission_review_transition()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.status := 'pending';
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.review_note := null;
    return new;
  end if;

  if old.status <> 'pending' and new.status <> old.status then
    raise exception 'reviewed submissions cannot change status';
  end if;
  if new.status = 'pending' and (new.reviewed_by is not null or new.reviewed_at is not null) then
    raise exception 'pending submissions cannot have review metadata';
  end if;
  return new;
end;
$$;

drop trigger submissions_enforce_review_transition on public.submissions;
create trigger submissions_enforce_review_transition
before insert or update of status, reviewed_by, reviewed_at, review_note on public.submissions
for each row execute function public.enforce_submission_review_transition();

revoke update on public.profiles from authenticated;
revoke update on public.submission_messages from authenticated;
grant update (read_at) on public.submission_messages to authenticated;
revoke all on function public.enforce_submission_review_transition() from public, anon, authenticated;
