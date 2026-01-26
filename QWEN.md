
> **Tier 1 Foundation Context** - Auto-loaded for all AI sessions

## Project Identity

**Next.js PWA Expense Tracker** - Offline-first personal finance tracking with manual cloud backup.

**Current Status**: See `docs/ai-context/project-status.md`

---

## Critical Architecture Rules

### 🔴 Non-Negotiables

1. **IndexedDB is Primary Storage**
   - All writes go to IndexedDB first
   - App must function 100% offline
   - Never depend on Supabase availability

2. **Supabase is Backup Only**
   - Manual sync via export/import buttons
   - No auto-sync allowed
   - User controls all cloud operations

3. **Foreign Key Integrity**
   ```
   categories ← sub_categories ← expenses
   ```
   - Never break FK relationships
   - ON DELETE RESTRICT for categories
   - ON DELETE SET NULL for sub_categories

4. **Mobile-First Design**
   - Touch targets: minimum 48px height
   - Responsive breakpoints: mobile → md → lg
   - No desktop-only features

5. **Minimal UI Aesthetic**
   - Primarily black/white
   - Use design tokens (bg-background, text-foreground)
   - Avoid excessive colors/gradients

---

## Tech Stack

See `docs/ai-context/tech-stack.md` for complete details.

**Core Technologies:**
- Next.js 15+ (App Router)
- TypeScript 5+
- Tailwind CSS v4
- IndexedDB + Supabase
- Recharts, Lucide React

---

## Database Schema

**Reference**: See `docs/ai-context/database-schema.md` for complete schema definitions.

**Quick Reference:**
```
categories (predefined)
  ↓ (FK: category_id)
sub_categories (predefined)
  ↓ (FK: sub_category_id)
expenses (user data)
```

**FK Constraints:**
- `sub_categories.category_id` → `categories.id` ON DELETE RESTRICT
- `expenses.category_id` → `categories.id` ON DELETE RESTRICT
- `expenses.sub_category_id` → `sub_categories.id` ON DELETE SET NULL

---

## Core Development Patterns

### 1. Data Operations (ALWAYS Use Hooks)

```typescript
// ✅ Correct: Use custom hooks
import { useExpenses } from '@/hooks/use-expenses'

function Component() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses()
  
  const handleAdd = async (data) => {
    await addExpense(data) // Writes to IndexedDB
  }
}

// ❌ Wrong: Direct IndexedDB access
const db = await openDB('expense-tracker')
await db.add('expenses', data)
```

### 2. Sync Operations (Manual Only)

```typescript
import { useSync } from '@/hooks/use-sync'

function SyncPage() {
  const { exportToSupabase, importFromSupabase, isSyncing } = useSync()
  
  // User clicks "Export" button
  const handleExport = () => exportToSupabase()
  
  // User clicks "Import" button  
  const handleImport = () => importFromSupabase()
}
```

### 3. Reference Data (Categories/Subcategories)

```typescript
import { useReferenceData } from '@/hooks/use-reference-data'

function AddExpensePage() {
  const { categories, subcategories, loading } = useReferenceData()
  
  // Categories are pre-loaded from Supabase on first use
  // Cached in IndexedDB for offline access
}
```

---

## Styling Standards

### Design Tokens (ALWAYS Use These)

```tsx
// ✅ Correct
<div className="bg-background text-foreground border-border">

// ❌ Wrong
<div className="bg-white text-black border-gray-200">
```

### Responsive Design Pattern

```tsx
// ✅ Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ❌ Desktop-first
<div className="lg:p-8 md:p-6 p-4">

// ❌ Arbitrary values
<div className="p-[16px]">
```

### Touch Target Minimums

```tsx
// ✅ Adequate touch target
<button className="h-12 px-4 py-3">

// ❌ Too small for mobile
<button className="h-8 px-2 py-1">
```

---

## File Organization Reference

For detailed file structure, see: `docs/ai-context/project-structure.md`

**Key locations:**
- **Pages**: `app/*/page.tsx` (Next.js App Router)
- **Components**: `components/` (UI, business logic)
- **Hooks**: `hooks/` (IndexedDB, sync, reference data)
- **Utilities**: `lib/` (helpers, constants)

---

## Project Status & Issues

**Reference**: See `docs/ai-context/project-status.md` for:
- ✅ Working features
- ⚠️ Known issues
- 🚧 Upcoming features
- 📝 Technical debt

---

## When Assisting, ALWAYS:

### DO ✅
- Use custom hooks for data operations
- Maintain FK relationships
- Follow mobile-first design
- Use design tokens (not direct colors)
- Keep IndexedDB as primary storage
- Write TypeScript (strict mode)
- Check `project-status.md` before claiming something works

### DON'T ❌
- Auto-sync to Supabase
- Break FK constraints
- Use inline styles
- Ignore soft delete pattern
- Make Supabase primary storage
- Skip error handling

---

## Documentation Structure

```
docs/ai-context/
├── project-structure.md    # Complete file tree & tech stack
├── project-status.md       # Features, issues, roadmap
├── database-schema.md      # Complete schema definitions
├── tech-stack.md           # Detailed technology choices
└── docs-overview.md        # Documentation navigation guide
```

**Auto-loaded files** (Tier 1):
- `CLAUDE.md` (this file)
- `docs/ai-context/project-structure.md`
- `docs/ai-context/docs-overview.md`

**On-demand files** (referenced when needed):
- `docs/ai-context/project-status.md`
- `docs/ai-context/database-schema.md`
- `docs/ai-context/tech-stack.md`

---

## Quick Commands Reference

```bash
# Start development
npm install
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

---

**For detailed component/feature documentation, see:**
- Component-level: `hooks/CONTEXT.md`, `components/CONTEXT.md`
- Feature-level: `app/[feature]/CONTEXT.md`
- Foundation: `docs/ai-context/`

**Last Updated**: January 2026  
**Maintainer**: Your Name  
**Version**: 1.0.0-beta