create policy submissions_moderator_select on public.submissions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
);

create policy submissions_moderator_update on public.submissions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
);

create policy messages_moderator_insert on public.submission_messages for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin'))
);