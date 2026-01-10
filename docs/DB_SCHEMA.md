```
create table categories (
  id bigint generated always as identity primary key,
  code text not null unique,
  description text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

```

-- ===================================
create table sub_categories (
  id bigint generated always as identity primary key,
  category_id bigint not null references categories(id) on delete restrict,
  code text not null,
  description text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, code)
);

``


```
create table expenses (
  id bigint generated always as identity primary key,

  amount numeric(12,2) not null check (amount > 0),
  expense_date date not null,

  category_id bigint not null references categories(id) on delete restrict,
  sub_category_id bigint null references sub_categories(id) on delete set null,

  description text null,
  item_name text null,      -- phone / laptop / appliance (CAPEX)
  notes text null,

  priority expense_priority not null,
  payment_type payment_type not null,

  -- optional fields of expenses table
  is_emi boolean default false,
  is_vacation boolean default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);
```