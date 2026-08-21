create extension if not exists pgcrypto;

create type public.profile_role as enum ('user', 'admin');
create type public.submission_type as enum ('company', 'opportunity', 'event', 'community');
create type public.submission_status as enum ('pending', 'approved', 'rejected');

create or replace function public.generate_public_id()
returns varchar(10)
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate varchar(10);
begin
  loop
    candidate := substring(encode(gen_random_bytes(8), 'base64') from 1 for 10);
    candidate := replace(replace(replace(candidate, '/', 'A'), '+', 'B'), '=', 'C');
    exit when not exists (select 1 from public.profiles where public_id = candidate);
  end loop;
  return candidate;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_id varchar(10) not null unique default public.generate_public_id(),
  role public.profile_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security invoker
as $$
begin
  if new.role is distinct from old.role and current_user not in ('postgres', 'supabase_admin') and (auth.uid() is null or auth.uid() <> old.id or not exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )) then
    raise exception 'only an administrator may change a profile role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
before update on public.profiles
for each row execute function public.prevent_role_change();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.promote_initial_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid := nullif(current_setting('app.initial_admin_user_id', true), '')::uuid;
begin
  if target_id is null then
    raise exception 'app.initial_admin_user_id must be set in the controlled SQL session';
  end if;
  update public.profiles set role = 'admin' where id = target_id;
  if not found then
    raise exception 'no profile exists for the supplied user ID';
  end if;
end;
$$;

revoke all on function public.promote_initial_admin() from public, anon, authenticated;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  address text,
  websites jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description varchar(200),
  company_id uuid references public.companies(id) on delete set null,
  organizer_url text,
  details jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint opportunities_description_length check (char_length(description) <= 200)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description varchar(200),
  organizer_url text,
  event_type jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_description_length check (char_length(description) <= 200)
);

create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  discord_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  type public.submission_type not null,
  data jsonb not null,
  status public.submission_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.submission_messages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index opportunities_company_id_idx on public.opportunities(company_id);
create index submissions_submitted_by_idx on public.submissions(submitted_by);
create index submissions_status_idx on public.submissions(status);
create index submission_messages_recipient_id_idx on public.submission_messages(recipient_id);

create trigger companies_set_updated_at before update on public.companies for each row execute function public.set_updated_at();
create trigger opportunities_set_updated_at before update on public.opportunities for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger communities_set_updated_at before update on public.communities for each row execute function public.set_updated_at();
create trigger submissions_set_updated_at before update on public.submissions for each row execute function public.set_updated_at();

create or replace function public.materialize_approved_submission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and old.status <> 'approved' then
    case new.type
      when 'company' then
        insert into public.companies (name, country, address, websites)
        values (new.data->>'name', new.data->>'country', new.data->>'address', new.data->'websites');
      when 'opportunity' then
        insert into public.opportunities (name, description, company_id, organizer_url, details)
        values (new.data->>'name', new.data->>'description', (new.data->>'company_id')::uuid, new.data->>'organizer_url', new.data->'details');
      when 'event' then
        insert into public.events (title, description, organizer_url, event_type)
        values (new.data->>'title', new.data->>'description', new.data->>'organizer_url', new.data->'event_type');
      when 'community' then
        insert into public.communities (name, description, discord_url)
        values (new.data->>'name', new.data->>'description', new.data->>'discord_url');
    end case;
  end if;
  return new;
end;
$$;

create trigger submissions_materialize_approval
after update of status on public.submissions
for each row execute function public.materialize_approved_submission();

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.opportunities enable row level security;
alter table public.events enable row level security;
alter table public.communities enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_messages enable row level security;

create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_update_own_non_role on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy companies_public_read on public.companies for select using (true);
create policy opportunities_public_read on public.opportunities for select using (true);
create policy events_public_read on public.events for select using (true);
create policy communities_public_read on public.communities for select using (true);

create policy companies_admin_write on public.companies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy opportunities_admin_write on public.opportunities for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy events_admin_write on public.events for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy communities_admin_write on public.communities for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy submissions_insert_own on public.submissions for insert with check (auth.uid() = submitted_by);
create policy submissions_select_own_or_admin on public.submissions for select using (
  auth.uid() = submitted_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy submissions_admin_update on public.submissions for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy messages_select_recipient_or_admin on public.submission_messages for select using (
  auth.uid() = recipient_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy messages_update_recipient on public.submission_messages for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
create policy messages_admin_insert on public.submission_messages for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

revoke all on public.profiles, public.companies, public.opportunities, public.events, public.communities, public.submissions, public.submission_messages from anon;
grant select on public.companies, public.opportunities, public.events, public.communities to anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.submissions to authenticated;
grant select, update on public.submission_messages to authenticated;
