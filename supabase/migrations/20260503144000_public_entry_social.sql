create table if not exists entry_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references entries(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  body text not null,
  author_name text,
  author_avatar text,
  created_at timestamptz not null default now()
);

create table if not exists entry_reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references entries(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (entry_id, user_id, emoji)
);

alter table entry_comments enable row level security;
alter table entry_reactions enable row level security;

drop policy if exists "entry_comments_public_read" on entry_comments;
drop policy if exists "entry_comments_public_insert" on entry_comments;
create policy "entry_comments_public_read"
  on entry_comments
  for select
  using (exists (select 1 from entries where entries.id = entry_comments.entry_id and entries.pub = true));
create policy "entry_comments_public_insert"
  on entry_comments
  for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from entries where entries.id = entry_comments.entry_id and entries.pub = true)
  );

drop policy if exists "entry_reactions_public_read" on entry_reactions;
drop policy if exists "entry_reactions_public_insert" on entry_reactions;
drop policy if exists "entry_reactions_own_delete" on entry_reactions;
create policy "entry_reactions_public_read"
  on entry_reactions
  for select
  using (exists (select 1 from entries where entries.id = entry_reactions.entry_id and entries.pub = true));
create policy "entry_reactions_public_insert"
  on entry_reactions
  for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from entries where entries.id = entry_reactions.entry_id and entries.pub = true)
  );
create policy "entry_reactions_own_delete"
  on entry_reactions
  for delete
  using (auth.uid() = user_id);
