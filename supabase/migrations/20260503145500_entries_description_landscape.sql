alter table entries
  add column if not exists description text,
  add column if not exists pub boolean not null default false;
