alter table caches
  add column if not exists story text,
  add column if not exists reward text,
  add column if not exists difficulty text not null default 'Easy',
  add column if not exists found_at timestamptz;
