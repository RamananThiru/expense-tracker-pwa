# Component Reference

## Pages

### HomePage
- **Purpose**: Display expenses summary and recent transactions
- **Location**: `components/pages/home-page.tsx`
- **Components Used**:
  - `ExpenseSummaryCard` - Tappable analytics preview
  - `ExpenseListItem` - Individual expense row
  - `FloatingActionButton` - Add expense button
- **Features**:
  - Monthly total display
  - Recent expenses list (7 transactions)
  - Tappable analytics card
  - Floating add button

### AddExpensePage
- **Purpose**: Form for creating new expenses
- **Location**: `components/pages/add-expense-page.tsx`
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
- **On Submit**: Resets form, navigates to home

### AnalyticsPage
- **Purpose**: Visualize spending patterns with charts
- **Location**: `components/pages/analytics-page.tsx`
- **Features**:
  - Date filter tabs (This Month, Last Month, Last 6 Months)
  - Pie chart using Recharts showing category breakdown
  - Legend with category, amount (₹), and percentage
  - Prominent total spent card with average per day
  - Weekly spending breakdown
  - AI-generated insights section

---

## Reusable Components

### ExpenseSummaryCard
- **Purpose**: Tappable card linking to analytics
- **Location**: `components/expense-summary-card.tsx`
- **Props**:
  ```typescript
  {
    totalAmount: number     // Monthly spending total
    onClick: () => void     // Navigation handler
  }
  ```
- **Features**:
  - Left: "View Analytics" label
  - Center: PieChart icon
  - Right: ChevronRight icon
  - Hover: Scale + shadow increase
  - Touch-friendly styling
- **Usage**:
  ```tsx
  <ExpenseSummaryCard 
    totalAmount={12120} 
    onClick={() => navigate('/analytics')} 
  />
  ```

### ExpenseListItem
- **Purpose**: Display single expense in a list
- **Location**: `components/expense-list-item.tsx`
- **Props**:
  ```typescript
  {
    category: string        // Category name
    subcategory: string     // Expense subcategory
    date: string           // Transaction date
    amount: number         // Expense amount in rupees
    categoryColor: {        // Color configuration
      bg: string           // Background class
      text: string         // Text class
      fill: string         // Chart fill hex
    }
  }
  ```
- **Features**:
  - Left: Colored circle with category first letter
  - Middle: Category name (bold) + subcategory and date (gray)
  - Right: Amount (large, bold, right-aligned)
  - Divider line between items
  - Hover effect (shadow + border color)
- **Usage**:
  ```tsx
  <ExpenseListItem 
    category="Food"
    subcategory="Groceries"
    date="Jan 15"
    amount={450}
    categoryColor={getCategoryColor('Food')}
  />
  ```

### FloatingActionButton
- **Purpose**: Fixed button for adding expenses
- **Location**: `components/floating-action-button.tsx`
- **Props**:
  ```typescript
  {
    onClick: () => void     // Click handler
  }
  ```
- **Features**:
  - Circular (56px × 56px)
  - Primary color background
  - White plus icon (Lucide React)
  - Fixed bottom-right position (above nav bar)
  - Shadow elevation
  - Smooth scale animation on hover
  - Active scale effect on press
- **Usage**:
  ```tsx
  <FloatingActionButton onClick={() => navigate('/add')} />
  ```

### Header
- **Purpose**: Top navigation bar with back button
- **Location**: `components/header.tsx`
- **Props**:
  ```typescript
  {
    title?: string          // Page title (optional)
  }
  ```
- **Features**:
  - Shows only on non-home pages
  - Back button navigates to home
  - Sticky positioning
- **Usage**:
  ```tsx
  <Header title="Add Expense" />
  ```

### BottomNavigation
- **Purpose**: Fixed mobile navigation bar
- **Location**: `components/bottom-navigation.tsx`
- **Features**:
  - 3 navigation items (Home, Add, Analytics)
  - Active tab indicator (color change + underline)
  - Highlighted circular plus icon
  - Touch-friendly (py-4)
  - Icons from Lucide React

---

**Last Updated**: January 2026
