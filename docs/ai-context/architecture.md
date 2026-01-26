# Architecture

> **System Design** - How the app works

**Last Updated**: January 26, 2026

---

## Overview

**Expense Tracker PWA** is an offline-first Progressive Web App for personal expense tracking with manual cloud backup.

---

## Core Principles

1. **Offline-First**: App works without internet connection
2. **IndexedDB Primary**: All data stored locally first
3. **Manual Sync**: User controls when data syncs to cloud
4. **Supabase Backup Only**: Cloud storage is for backup/restore, not primary storage

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     USER ACTIONS                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   React Components    │
         │   (Forms, Lists)      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Custom Hooks        │
         │   (use-expenses.ts,   │
         │    use-sync.ts)       │
         └───────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  IndexedDB   │          │   Supabase   │
│  (Primary)   │◄────────►│   (Backup)   │
│              │  Manual  │              │
│  • expenses  │   Sync   │  • expenses  │
│  • categories│          │  • categories│
│  • sub_cat   │          │  • sub_cat   │
└──────────────┘          └──────────────┘
```

---

## Storage Strategy

### IndexedDB (Primary Storage)

**Purpose**: Live application data
**Location**: Browser storage
**Operations**: 
- ✅ Create expense
- ✅ Read expenses
- ✅ Update expense
- ✅ Delete expense (soft delete)

**Tables**:
- `expenses` - User expense records
- `categories` - Expense categories (synced from Supabase)
- `sub_categories` - Subcategories (synced from Supabase)

### Supabase (Cloud Backup)

**Purpose**: Cloud backup and restore only
**Location**: Cloud PostgreSQL database
**Operations**:
- ✅ Manual export (IndexedDB → Supabase)
- ✅ Manual import (Supabase → IndexedDB)
- ✅ Categories/subcategories source (predefined)

**Schema**: Identical to IndexedDB

---

## Sync Strategy

### Manual Export (IndexedDB → Supabase)

**Trigger**: User clicks "Export" button in `/sync` page

**Process**:
1. Read all expenses from IndexedDB
2. Send to Supabase via API
3. Upsert (insert or update) based on ID
4. Show success/error toast

**Code**: `hooks/use-sync.ts` → `exportToSupabase()`

### Manual Import (Supabase → IndexedDB)

**Trigger**: User clicks "Import" button in `/sync` page

**Process**:
1. Fetch all expenses from Supabase
2. Clear IndexedDB expenses (optional)
3. Insert into IndexedDB
4. Show success/error toast

**Code**: `hooks/use-sync.ts` → `importFromSupabase()`

### Categories/Subcategories Sync

**Trigger**: On app load OR when needed

**Process**:
1. Check if categories exist in IndexedDB
2. If empty, fetch from Supabase (predefined list)
3. Cache in IndexedDB for offline use
4. Never sync back to Supabase (read-only)

**Code**: `hooks/use-reference-data.ts`

---

## Future: Sync Toggle

**Planned Feature**: Toggle to control expense sync direction

**Options**:
- Device → Supabase only (export only)
- Supabase → Device only (import only)
- Both directions (current behavior)

**Purpose**: Prevent accidental data overwrite

---

## Data Model

### Foreign Key Relationships

```
categories (predefined)
    ↓ (FK: category_id, ON DELETE RESTRICT)
sub_categories (predefined)
    ↓ (FK: sub_category_id, ON DELETE SET NULL)
expenses (user data)
```

**Rules**:
- Cannot delete category if subcategories exist
- Cannot delete category if expenses exist
- Can delete subcategory (expense.sub_category_id becomes NULL)

---

## UI Architecture

### Pages

```
app/
├── page.tsx               # Home - Recent expenses list
├── add/page.tsx           # Add expense form
├── analytics/page.tsx     # Charts with real data from API
├── categories/page.tsx    # Manage categories
├── subcategories/page.tsx # Manage subcategories
├── settings/page.tsx      # App settings
└── sync/page.tsx          # Manual sync controls
```

### Navigation

**Bottom Navigation Bar** (Mobile-First):
- Home (recent expenses)
- Add (expense form)
- Analytics (charts)
- Settings

### Design Principles

1. **Minimal UI**: Primarily black and white
2. **Card-Based**: Use cards for data grouping
3. **Scrollable**: Custom scrollbars for large datasets
4. **Mobile-First**: Touch targets, responsive breakpoints
5. **Single Theme**: No dark/light toggle (yet)

---

## Component Patterns

### Data Display

**Card-Based Approach**:
```tsx
<ExpenseSummaryCard 
  expense={expense}
  onClick={handleClick}
/>
```

**Scrollable Lists**:
```tsx
<div className="overflow-y-auto max-h-[500px]">
  {expenses.map(expense => (
    <ExpenseItem key={expense.id} {...expense} />
  ))}
</div>
```

### Data Operations

**Always Use Hooks**:
```tsx
const { expenses, addExpense } = useExpenses()
const { exportToSupabase } = useSync()
const { categories } = useReferenceData()
```

**Never Direct Access**:
```tsx
// ❌ WRONG
const db = await openDB('expense-tracker')
await db.add('expenses', data)

// ✅ CORRECT
await addExpense(data)
```

---

## PWA Features

### Offline Capability

**Service Worker**: Caches static assets
**IndexedDB**: Stores all data locally
**Behavior**: App fully functional offline

### Installation

**Manifest**: `public/manifest.json`
**Icons**: 192x192, 512x512
**Display Mode**: Standalone (no browser chrome)

---

## Analytics Architecture (⚠️ TODO)

**Current State**: Shows mock data

**Required Integration**:
1. Connect to `use-expenses.ts` hook
2. Aggregate expenses by category
3. Calculate totals by date range
4. Feed data to Recharts components

**Location**: `app/analytics/page.tsx`

---

## Security Considerations

### Data Privacy

- ✅ All data stored locally first
- ✅ No auto-sync to cloud
- ✅ User controls data export
- ⚠️ No encryption at rest (browser security model)
- ⚠️ No authentication (future feature)

### Best Practices

- Use HTTPS in production
- Validate all user inputs
- Sanitize data before storage
- Handle sync errors gracefully

---

## Performance Strategy

### IndexedDB Optimization

- Indexed fields: `expense_date`, `category_id`
- Batch operations where possible
- Soft delete instead of hard delete

### UI Performance

- Virtualization for long lists (future)
- Lazy load pages with React.lazy()
- Memoize expensive calculations

---

## Error Handling

### Network Errors

**Current**: Fails silently (⚠️ bug)
**Needed**: Toast notifications, retry logic

### Data Errors

**Current**: Basic validation
**Needed**: Comprehensive Zod schemas

---

## Deployment Architecture

**Current**: Local development only

**Future**:
- Static hosting (Vercel/Netlify)
- CDN for assets
- Service worker for caching
- No backend needed (Supabase handles DB)

---

**Architecture Owner**: Development Team  
**Last Review**: January 26, 2026  
**Next Review**: On major architecture changes