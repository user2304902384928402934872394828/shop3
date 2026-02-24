create table if not exists automotive_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),

  vehicle_type text not null, -- car, truck, quad, dirtbike, etc
  make text not null,
  model text not null,
  year integer not null,
  color text,
  engine_type text,

  notes text
);

-- Shopping list table
create table if not exists shop_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),

  project_id uuid references automotive_projects(id) on delete cascade,
  item_name text not null,
  quantity integer default 1,
  price numeric default 0,
  purchased boolean default false
);