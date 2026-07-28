-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text default 'New chat',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions on delete cascade not null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table sessions enable row level security;
alter table messages enable row level security;

-- Sessions: users can only see/manage their own
create policy "Users can view own sessions"
  on sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on sessions for delete
  using (auth.uid() = user_id);

-- Messages: users can only see messages in their own sessions
create policy "Users can view own messages"
  on messages for select
  using (
    exists (
      select 1 from sessions
      where sessions.id = messages.session_id
      and sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert own messages"
  on messages for insert
  with check (
    exists (
      select 1 from sessions
      where sessions.id = messages.session_id
      and sessions.user_id = auth.uid()
    )
  );

-- Note: the backend uses the service_role key, which bypasses RLS.
-- These policies matter if you ever query Supabase directly from the frontend.


-- ---------------------------------------------------------------
-- Optional: a public "profiles" table, auto-populated on signup.
-- Supabase's built-in auth.users table already stores every signed-up
-- user (email, password hash, id) — you do NOT need this for login/
-- signup to work. This is only useful if you want a queryable table
-- of users (e.g. to show a display name) without exposing auth.users.
-- ---------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
