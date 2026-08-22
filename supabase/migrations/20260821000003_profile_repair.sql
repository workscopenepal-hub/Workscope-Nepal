-- Restore profile creation for future auth users and backfill users created
-- before the profile trigger was installed.
create extension if not exists pgcrypto;

create or replace function public.generate_public_id()
returns varchar(10)
language plpgsql
security definer
set search_path = public, extensions
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

revoke execute on function public.handle_new_user() from public, anon, authenticated;