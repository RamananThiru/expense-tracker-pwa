# Application Architecture

## Application Flow

### User Journey

```
Launch App
    ↓
Home Page (View expenses & summary)
    ├→ View Analytics (Click summary card)
    │   ↓
    │   Analytics Page (View spending breakdown)
    │   ↓
    │   Back to Home
    │
    └→ Add Expense (Click FAB or nav)
        ↓
        Add Expense Page (Fill form)
        ↓
        Submit
        ↓
        Back to Home (Updated list)
```

## Three Main Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | View recent expenses and monthly summary |
| `/add` | `AddExpensePage` | Create new expense entry |
| `/analytics` | `AnalyticsPage` | Analyze spending patterns |

## File Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind v4
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry point (renders AppLayout)
│
├── components/
│   ├── app-layout.tsx       # Router & page manager
│   ├── header.tsx           # Top navigation with back button
│   ├── bottom-navigation.tsx # Fixed mobile navigation
│   ├── expense-summary-card.tsx  # Analytics preview card
│   ├── expense-list-item.tsx     # Single expense item
│   ├── floating-action-button.tsx # Add expense button
│   │
│   ├── pages/
│   │   ├── home-page.tsx    # View expenses & summary
│   │   ├── add-expense-page.tsx  # Add expense form
│   │   └── analytics-page.tsx    # Spending analysis
│   │
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx, card.tsx, input.tsx, etc.
│
├── lib/
│   ├── constants/
│   │   └── category-colors.ts   # Color palette
│   └── utils.ts             # Utility functions (cn helper)
│
└── docs/                    # Documentation
    ├── OVERVIEW.md          # Project overview
    ├── ARCHITECTURE.md      # App structure & flow (this file)
    ├── COMPONENTS.md        # Component reference
    ├── DATA_FLOW.md         # Data structures & routing
    ├── COLORS.md            # Color system
    └── DEVELOPMENT.md       # Dev guidelines
```

## Layout & Navigation Structure

### AppLayout (Core Container)
- **Purpose**: Main router wrapper managing all routes
- **Features**:
  - Defines route configuration
  - Manages page transitions (fade animation)
  - Integrates Header and BottomNavigation
- **Location**: `components/app-layout.tsx`

### Header (Top Navigation)
- **Purpose**: Display page title with back button
- **Features**:
  - Shows only on non-home pages
  - Back button navigates to home
  - Sticky positioning
- **Location**: `components/header.tsx`

### BottomNavigation (Mobile Nav Bar)
- **Purpose**: Fixed bottom navigation with 3 routes
- **Features**:
  - Fixed positioning with 3 navigation items
  - Active tab indicator (color + underline)
  - Highlighted circular plus icon for add route
  - Icons from Lucide React
- **Location**: `components/bottom-navigation.tsx`

## Routing Implementation

- **Router**: React Router DOM v6
- **Layout**: Nested routes with shared header/nav
- **Navigation**: `useNavigate()` hook for programmatic navigation
- **Active Routes**: Tracked via `useLocation()` for highlighting nav items

---

**Last Updated**: January 2026
