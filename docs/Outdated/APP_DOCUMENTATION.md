# Expense Tracker PWA - Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Application Flow](#application-flow)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Color System](#color-system)
6. [File Structure](#file-structure)

---

## Overview

**Expense Tracker PWA** is a Progressive Web App for tracking personal expenses with real-time analytics. Built with React, React Router, Tailwind CSS, and Recharts, it provides a seamless mobile-first experience for managing spending across multiple categories.

### Key Features
- Add expenses with categories and subcategories
- View recent expenses with quick-access summary
- Analyze spending patterns with interactive pie charts
- Filter analytics by time period (This Month, Last Month, Last 6 Months)
- Mobile-optimized interface with bottom navigation
- Fast, responsive performance with Lucide React icons

---

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

### Three Main Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | View recent expenses and monthly summary |
| `/add` | `AddExpensePage` | Create new expense entry |
| `/analytics` | `AnalyticsPage` | Analyze spending patterns |

---

## Component Architecture

### Layout & Navigation

#### `AppLayout` (Core Container)
- **Purpose**: Main router wrapper managing all routes
- **Features**:
  - Defines route configuration
  - Manages page transitions (fade animation)
  - Integrates Header and BottomNavigation
- **Location**: `components/app-layout.tsx`

#### `Header` (Top Navigation)
- **Purpose**: Display page title with back button
- **Features**:
  - Shows only on non-home pages
  - Back button navigates to home
  - Sticky positioning
- **Props**:
  - `title?: string` - Page title
- **Location**: `components/header.tsx`

#### `BottomNavigation` (Mobile Nav Bar)
- **Purpose**: Fixed bottom navigation with 3 routes
- **Features**:
  - Fixed positioning with 3 navigation items
  - Active tab indicator (color + underline)
  - Highlighted circular plus icon for add route
  - Icons from Lucide React
- **Location**: `components/bottom-navigation.tsx`

### Pages

#### `HomePage`
- **Purpose**: Display expenses summary and recent transactions
- **Components Used**:
  - `ExpenseSummaryCard` - Tappable analytics preview
  - `ExpenseListItem` - Individual expense row
  - `FloatingActionButton` - Add expense button
- **Data**: Mock expense array with 7 transactions
- **Location**: `components/pages/home-page.tsx`

#### `AddExpensePage`
- **Purpose**: Form for creating new expenses
- **Features**:
  - Amount input with ₹ currency symbol (large, prominent)
  - Date picker (defaults to today)
  - Category dropdown (8 categories)
  - Subcategory dropdown (dynamically filtered)
  - Optional description textarea
  - Form validation with error styling
  - Close button (X icon) at top
- **Form Validation**:
  - Amount: Required, must be > 0
  - Category: Required selection
  - Subcategory: Required after category selection
  - Date: Required
- **Submission**: Resets form, navigates to home
- **Location**: `components/pages/add-expense-page.tsx`

#### `AnalyticsPage`
- **Purpose**: Visualize spending patterns with charts
- **Features**:
  - Date filter tabs (This Month, Last Month, Last 6 Months)
  - Pie chart using Recharts showing category breakdown
  - Legend with category, amount (₹), and percentage
  - Prominent total spent card with average per day
  - Weekly spending breakdown
  - AI-generated insights section
- **Data**: Mock categories with amounts and percentages
- **Location**: `components/pages/analytics-page.tsx`

### Reusable Components

#### `ExpenseSummaryCard`
- **Purpose**: Tappable card linking to analytics
- **Props**:
  - `totalAmount: number` - Monthly spending total
  - `onClick: () => void` - Navigation handler
- **Features**:
  - Left: "View Analytics" label
  - Center: PieChart icon
  - Right: ChevronRight icon
  - Hover: Scale + shadow increase
  - Touch-friendly styling
- **Location**: `components/expense-summary-card.tsx`

#### `ExpenseListItem`
- **Purpose**: Display single expense in a list
- **Props**:
  - `category: string` - Category name
  - `subcategory: string` - Expense subcategory
  - `date: string` - Transaction date
  - `amount: number` - Expense amount in rupees
  - `categoryColor: { bg, text }` - Color configuration
- **Features**:
  - Left: Colored circle with category first letter
  - Middle: Category name (bold) + subcategory and date (gray)
  - Right: Amount (large, bold, right-aligned)
  - Divider line between items
  - Hover effect (shadow + border color)
- **Location**: `components/expense-list-item.tsx`

#### `FloatingActionButton`
- **Purpose**: Fixed button for adding expenses
- **Props**:
  - `onClick: () => void` - Click handler
- **Features**:
  - Circular (56px × 56px)
  - Primary color background
  - White plus icon (Lucide React)
  - Fixed bottom-right position (above nav bar)
  - Shadow elevation
  - Smooth scale animation on hover
  - Active scale effect on press
- **Location**: `components/floating-action-button.tsx`

---

## Data Flow

### Expense Data Structure
```typescript
interface Expense {
  id: number
  category: string
  subcategory: string
  date: string
  amount: number
}
```

### Category/Subcategory Hierarchy
```typescript
{
  Food: ['Groceries', 'Dining Out', 'Coffee'],
  Transport: ['Fuel', 'Public Transit', 'Taxi'],
  Housing: ['Rent', 'Utilities', 'Maintenance'],
  Entertainment: ['Movies', 'Gaming', 'Hobbies'],
  Health: ['Medication', 'Fitness', 'Medical'],
  Shopping: ['Clothes', 'Electronics', 'Home'],
  Bills: ['Electricity', 'Internet', 'Phone'],
  Other: ['Misc', 'Gifts', 'Services'],
}
```

### State Management
- **Current Approach**: Props drilling with React hooks (useState, useNavigate)
- **Future**: Consider Context API or state management library for larger app
- **Mock Data**: All current data is hardcoded for demonstration

### Routing
- **Router**: React Router DOM v6
- **Layout**: Nested routes with shared header/nav
- **Navigation**: `useNavigate()` hook for programmatic navigation

---

## Color System

### Category Colors

All categories are assigned modern, vibrant colors optimized for:
- Contrast and readability
- Distinction in pie charts
- Visual hierarchy in lists

| Category | Background | Text | Chart Fill |
|----------|-----------|------|-----------|
| Food | orange-100 | orange-600 | #f97316 |
| Transport | blue-100 | blue-600 | #3b82f6 |
| Housing | amber-100 | amber-600 | #d97706 |
| Entertainment | purple-100 | purple-600 | #a855f7 |
| Health | green-100 | green-600 | #10b981 |
| Shopping | pink-100 | pink-600 | #ec4899 |
| Bills | red-100 | red-600 | #ef4444 |
| Other | slate-100 | slate-600 | #64748b |

### Using Colors in Components

```typescript
import { CATEGORY_COLORS, getCategoryColor, getCategoryHexColor } from '@/lib/constants/category-colors'

// Get full color object
const colors = getCategoryColor('Food')
// Returns: { bg: 'bg-orange-100', text: 'text-orange-600', fill: '#f97316' }

// Get hex color for charts
const hexColor = getCategoryHexColor('Food')
// Returns: '#f97316'

// List all categories
const categories = Object.keys(CATEGORY_COLORS)
```

---

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
└── docs/
    └── APP_DOCUMENTATION.md # This file
```

---

## Key Technologies

| Technology | Purpose |
|------------|---------|
| React | UI library |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling |
| Recharts | Data visualization (pie charts) |
| Lucide React | Icons |
| TypeScript | Type safety |
| shadcn/ui | Component library |

---

## Development Guidelines

### Adding a New Expense Category

1. Add category to `CATEGORY_COLORS` in `lib/constants/category-colors.ts`:
```typescript
YourCategory: {
  bg: 'bg-color-100',
  text: 'text-color-600',
  fill: '#hexcolor',
}
```

2. Add subcategories to `ADD_EXPENSE_PAGE` category mapping

3. Update mock data in `home-page.tsx` and `analytics-page.tsx`

### Adding New Features

1. **Pages**: Create component in `components/pages/`
2. **Components**: Create reusable components in `components/`
3. **Colors**: Use `getCategoryColor()` or `CATEGORY_COLORS`
4. **Routing**: Update `AppLayout` route configuration

### Mobile-First Approach

- Design for mobile (320px+) first
- Use Tailwind responsive prefixes: `md:`, `lg:`, etc.
- Test on actual devices or Chrome DevTools
- Ensure 48px+ touch targets for buttons
- Avoid hover-only interactions

---

## Future Enhancements

- [ ] Persist expenses to localStorage or backend database
- [ ] User authentication and cloud sync
- [ ] Expense search and filtering
- [ ] Budget limits and notifications
- [ ] Recurring expense templates
- [ ] Export reports (PDF, CSV)
- [ ] Dark mode support
- [ ] Multi-currency support
- [ ] Receipt image uploads
- [ ] Social sharing features

---

## Troubleshooting

### Navigation Issues
- Ensure React Router is wrapped around app
- Check route paths match component imports
- Verify `useNavigate()` is used in client components

### Styling Issues
- Check Tailwind CSS is compiled (globals.css imported in layout)
- Use design tokens from CSS variables for consistency
- Verify color classes exist (e.g., `bg-orange-100`)

### Chart Not Rendering
- Ensure Recharts is installed
- Check data format matches PieChart requirements
- Verify ResponsiveContainer parent has fixed height

---

**Last Updated**: January 2026
**Version**: 1.0.0
