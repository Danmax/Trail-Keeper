alter table entries
  add column if not exists pub boolean not null default false;

create index if not exists entries_pub_location_idx
  on entries (pub, lat, lng);

drop policy if exists "public_entries_read" on entries;
create policy "public_entries_read"
  on entries
  for select
  using (pub = true);
