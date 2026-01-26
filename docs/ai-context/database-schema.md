# Database Schema

> **Reference Documentation** - Complete schema definitions for IndexedDB and Supabase

**Schema Version**: 1.0  
**Last Updated**: January 26, 2026

---

## Schema Overview

```
categories (predefined, synced from Supabase)
    ↓ (FK: category_id, ON DELETE RESTRICT)
sub_categories (predefined, synced from Supabase)
    ↓ (FK: sub_category_id, ON DELETE SET NULL)
expenses (user data, manual sync to Supabase)
```

---

## Table: categories

**Purpose**: Predefined expense categories  
**Source**: Synced from Supabase  
**Mutability**: Read-only in app (managed in Supabase)

### Schema

```sql
CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Fields

| Field         | Type        | Constraints             | Description                               |
| ------------- | ----------- | ----------------------- | ----------------------------------------- |
| `id`          | bigint      | PK, auto-increment      | Unique identifier                         |
| `code`        | text        | NOT NULL, UNIQUE        | Machine-readable code (e.g., 'groceries') |
| `description` | text        | NOT NULL                | Human-readable name (e.g., 'Groceries')   |
| `is_active`   | boolean     | NOT NULL, DEFAULT true  | Whether category is available             |
| `sort_order`  | int         | NOT NULL, DEFAULT 0     | Display order in UI                       |
| `created_at`  | timestamptz | NOT NULL, DEFAULT NOW() | Creation timestamp                        |
| `updated_at`  | timestamptz | NOT NULL, DEFAULT NOW() | Last update timestamp                     |

### Indexes

```sql
CREATE UNIQUE INDEX idx_categories_code ON categories(code);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

---

## Table: sub_categories

**Purpose**: Subcategories linked to parent categories  
**Source**: Synced from Supabase  
**Mutability**: Read-only in app (managed in Supabase)

### Schema

```sql
CREATE TABLE sub_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, code)
);
```

### Fields

| Field         | Type        | Constraints                  | Description                      |
| ------------- | ----------- | ---------------------------- | -------------------------------- |
| `id`          | bigint      | PK, auto-increment           | Unique identifier                |
| `category_id` | bigint      | FK → categories.id, NOT NULL | Parent category                  |
| `code`        | text        | NOT NULL                     | Machine-readable code            |
| `description` | text        | NOT NULL                     | Human-readable name              |
| `is_active`   | boolean     | NOT NULL, DEFAULT true       | Whether subcategory is available |
| `sort_order`  | int         | NOT NULL, DEFAULT 0          | Display order within category    |
| `created_at`  | timestamptz | NOT NULL, DEFAULT NOW()      | Creation timestamp               |
| `updated_at`  | timestamptz | NOT NULL, DEFAULT NOW()      | Last update timestamp            |

### Foreign Keys

```sql
ALTER TABLE sub_categories
  ADD CONSTRAINT fk_sub_categories_category
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE RESTRICT;
```

**ON DELETE RESTRICT**: Prevents deleting a category if subcategories exist

### Indexes

```sql
CREATE INDEX idx_sub_categories_category ON sub_categories(category_id);
CREATE INDEX idx_sub_categories_active ON sub_categories(is_active);
CREATE UNIQUE INDEX idx_sub_categories_code ON sub_categories(category_id, code);
```

---

## Table: expenses

**Purpose**: User expense records  
**Source**: Created locally in IndexedDB  
**Mutability**: Full CRUD via app, manual sync to Supabase

### Schema

```sql
CREATE TABLE expenses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  sub_category_id BIGINT NULL REFERENCES sub_categories(id) ON DELETE SET NULL,
  description TEXT NULL,
  item_name TEXT NULL,
  notes TEXT NULL,
  priority expense_priority NOT NULL,
  payment_type payment_type NOT NULL,
  is_emi BOOLEAN DEFAULT false,
  is_vacation BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
```

### Fields

| Field             | Type             | Constraints                  | Description                          |
| ----------------- | ---------------- | ---------------------------- | ------------------------------------ |
| `id`              | bigint           | PK, auto-increment           | Unique identifier                    |
| `amount`          | numeric(12,2)    | NOT NULL, CHECK > 0          | Expense amount (2 decimal places)    |
| `expense_date`    | date             | NOT NULL                     | Date of expense                      |
| `category_id`     | bigint           | FK → categories.id, NOT NULL | Expense category                     |
| `sub_category_id` | bigint           | FK → sub_categories.id, NULL | Optional subcategory                 |
| `description`     | text             | NULL                         | Brief description                    |
| `item_name`       | text             | NULL                         | Item name (for CAPEX: phone, laptop) |
| `notes`           | text             | NULL                         | Additional notes                     |
| `priority`        | expense_priority | NOT NULL                     | Expense priority (low/medium/high)   |
| `payment_type`    | payment_type     | NOT NULL                     | Payment method                       |
| `is_emi`          | boolean          | DEFAULT false                | Whether paid via EMI                 |
| `is_vacation`     | boolean          | DEFAULT false                | Whether vacation-related             |
| `created_at`      | timestamptz      | NOT NULL, DEFAULT NOW()      | Creation timestamp                   |
| `updated_at`      | timestamptz      | NOT NULL, DEFAULT NOW()      | Last update timestamp                |
| `deleted_at`      | timestamptz      | NULL                         | Soft delete timestamp                |

### Enums

```sql
-- expense_priority enum
CREATE TYPE expense_priority AS ENUM ('low', 'medium', 'high');

-- payment_type enum
CREATE TYPE payment_type AS ENUM (
  'cash',
  'card',
  'upi',
  'emi',
  'other'
);
```

### Foreign Keys

```sql
-- Category FK (required, cannot be deleted if expenses exist)
ALTER TABLE expenses
  ADD CONSTRAINT fk_expenses_category
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE RESTRICT;

-- Subcategory FK (optional, set to NULL if subcategory deleted)
ALTER TABLE expenses
  ADD CONSTRAINT fk_expenses_sub_category
  FOREIGN KEY (sub_category_id)
  REFERENCES sub_categories(id)
  ON DELETE SET NULL;
```

**ON DELETE RESTRICT**: Prevents category deletion if expenses exist  
**ON DELETE SET NULL**: Sets subcategory to NULL if deleted

### Indexes

```sql
CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_sub_category ON expenses(sub_category_id);
CREATE INDEX idx_expenses_deleted ON expenses(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_expenses_created ON expenses(created_at DESC);
```

---

## Soft Delete Pattern

### Implementation

Expenses use soft delete via `deleted_at` field:

```sql
-- Soft delete (set deleted_at)
UPDATE expenses
SET deleted_at = NOW()
WHERE id = 1;

-- Query active expenses only
SELECT * FROM expenses
WHERE deleted_at IS NULL;

-- Restore soft-deleted expense
UPDATE expenses
SET deleted_at = NULL
WHERE id = 1;

-- Hard delete (permanent)
DELETE FROM expenses
WHERE id = 1 AND deleted_at IS NOT NULL;
```

### Benefits

- ✅ Preserves data for analytics
- ✅ Enables "undo" functionality
- ✅ Maintains referential integrity
- ✅ Audit trail

---
