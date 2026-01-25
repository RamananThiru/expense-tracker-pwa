# Data Flow & State Management

## Expense Data Structure

```typescript
interface Expense {
  id: number
  category: string        // Main category
  subcategory: string     // Specific subcategory
  date: string           // Transaction date (YYYY-MM-DD)
  amount: number         // Amount in rupees
}
```

## Category/Subcategory Hierarchy

```typescript
{
  Food: [
    'Groceries',
    'Dining Out',
    'Coffee'
  ],
  Transport: [
    'Fuel',
    'Public Transit',
    'Taxi'
  ],
  Housing: [
    'Rent',
    'Utilities',
    'Maintenance'
  ],
  Entertainment: [
    'Movies',
    'Gaming',
    'Hobbies'
  ],
  Health: [
    'Medication',
    'Fitness',
    'Medical'
  ],
  Shopping: [
    'Clothes',
    'Electronics',
    'Home'
  ],
  Bills: [
    'Electricity',
    'Internet',
    'Phone'
  ],
  Other: [
    'Misc',
    'Gifts',
    'Services'
  ]
}
```

## Current State Management

### Approach
- **Current**: Props drilling with React hooks (useState, useNavigate)
- **Future**: Consider Context API or state management library for larger app
- **Mock Data**: All current data is hardcoded for demonstration

### Key Hooks Used
- `useState()` - Form state and UI state in pages
- `useNavigate()` - Page navigation
- `useLocation()` - Track active route for nav highlighting
- `useEffect()` - Side effects like form initialization

### Data Flow in Pages

#### HomePage
```
Mock Expense Array
    ↓
map() over expenses
    ↓
Render ExpenseListItem for each
    ↓
ExpenseSummaryCard at top
    ↓
FloatingActionButton
```

#### AddExpensePage
```
Form State (amount, date, category, etc.)
    ↓
User fills fields
    ↓
Validation on submit
    ↓
Create new Expense object
    ↓
Navigate to home
```

#### AnalyticsPage
```
Date filter state (This Month, Last Month, etc.)
    ↓
Filter mock expenses by date
    ↓
Group by category
    ↓
Calculate totals & percentages
    ↓
Render PieChart with Recharts
```

## Routing

### React Router Configuration

All routes are defined in `AppLayout`:

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/add', element: <AddExpensePage /> },
  { path: '/analytics', element: <AnalyticsPage /> }
]
```

### Navigation Patterns

```typescript
// Navigate to page
const navigate = useNavigate()
navigate('/add')

// Get current location for active highlighting
const location = useLocation()
const isActive = location.pathname === '/add'
```

## Future: Database Integration

When adding persistent storage (backend database, localStorage, etc.):

1. **API Layer**: Create `lib/api/expenses.ts` for API calls
2. **Fetching**: Use `useEffect()` or SWR for data fetching
3. **Form Submission**: POST new expenses to backend
4. **Real-time Updates**: Refresh expense list after adding
5. **Error Handling**: Add try-catch and user feedback

Example structure:
```typescript
// lib/api/expenses.ts
export async function addExpense(expense: Expense) {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense)
  })
  return response.json()
}

// In AddExpensePage
const handleSubmit = async () => {
  await addExpense(formData)
  navigate('/')
}
```

---

**Last Updated**: January 2026
