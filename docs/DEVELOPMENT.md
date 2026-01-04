# Development Guidelines

## Adding a New Expense Category

### Step 1: Update Color Palette

Edit `lib/constants/category-colors.ts`:

```typescript
YourCategory: {
  bg: 'bg-color-100',
  text: 'text-color-600',
  fill: '#hexcolor',
}
```

### Step 2: Update Category Dropdowns

Edit `components/pages/add-expense-page.tsx`:

```typescript
const categorySubcategories = {
  // ... existing categories
  YourCategory: [
    'Subcategory 1',
    'Subcategory 2',
    'Subcategory 3'
  ]
}
```

### Step 3: Update Mock Data

Edit `components/pages/home-page.tsx` and `components/pages/analytics-page.tsx`:

```typescript
const mockExpenses = [
  // ... existing expenses
  {
    id: 8,
    category: 'YourCategory',
    subcategory: 'Subcategory 1',
    date: 'Jan 20',
    amount: 500
  }
]
```

## Adding New Pages/Routes

### Step 1: Create Page Component

Create `components/pages/your-page.tsx`:

```typescript
'use client'

import { useNavigate } from 'react-router-dom'

export default function YourPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen pb-20 bg-background">
      <div className="flex-1 p-4">
        {/* Your content */}
      </div>
    </div>
  )
}
```

### Step 2: Register Route

Edit `components/app-layout.tsx` and add to routes:

```typescript
{
  path: '/your-path',
  element: <YourPage />
}
```

### Step 3: Update Navigation

Edit `components/bottom-navigation.tsx` to add nav item if needed.

## Adding New Components

### Component Template

Create `components/your-component.tsx`:

```typescript
'use client'

interface YourComponentProps {
  prop1: string
  prop2: number
  onClick?: () => void
}

export default function YourComponent({ 
  prop1, 
  prop2, 
  onClick 
}: YourComponentProps) {
  return (
    <div className="p-4 rounded-lg shadow-sm">
      {/* Component JSX */}
    </div>
  )
}
```

### Best Practices
- Use TypeScript interfaces for props
- Always include prop documentation
- Export as default for simplicity
- Use `'use client'` for client components
- Extract styles to Tailwind classes (no inline styles)

## Mobile-First Development

### Design for Mobile First
```typescript
// Start with mobile styles (no prefix)
<div className="w-full p-4">

// Then enhance for larger screens
<div className="w-full p-4 md:w-1/2 lg:p-8">
```

### Responsive Classes

| Screen | Prefix | Example |
|--------|--------|---------|
| Mobile | (none) | `p-4` |
| Tablet | `md:` | `md:p-6` |
| Desktop | `lg:` | `lg:p-8` |

### Touch Targets

- Minimum 48px height for buttons
- Use `py-4` or `h-12` minimum
- Adequate spacing between interactive elements

### Testing on Mobile
- Chrome DevTools device emulation
- Actual phone device testing
- Landscape and portrait orientations

## Styling Best Practices

### Use Design Tokens

```typescript
// Good: Use CSS variables/tokens
className="bg-background text-foreground border-border"

// Avoid: Direct color classes
className="bg-white text-black border-gray-200"
```

### Consistent Spacing

```typescript
// Good: Use Tailwind spacing scale
className="p-4 space-y-2 gap-4"

// Avoid: Arbitrary values
className="p-[16px] space-y-[8px] gap-[16px]"
```

### Shadow & Elevation

```typescript
// Subtle shadow for cards
className="shadow-sm"

// Medium shadow for elevated elements
className="shadow-lg"

// Use on hover for interaction
className="hover:shadow-lg transition-shadow"
```

## Performance Tips

- Lazy load heavy components with React.lazy()
- Memoize expensive calculations
- Use useCallback for event handlers
- Keep component re-renders minimal
- Test performance with React DevTools Profiler

## Common Issues & Solutions

### Navigation Not Working
```
Issue: `useNavigate()` not found
Solution: Ensure component is wrapped in React Router <BrowserRouter>
          Check that app-layout.tsx is rendering all routes correctly
```

### Colors Not Applying
```
Issue: Tailwind classes not showing
Solution: Check globals.css is imported in layout.tsx
          Verify Tailwind is configured in next.config
          Clear .next folder and restart dev server
```

### Form State Not Updating
```
Issue: Form fields not responding to input
Solution: Check onChange handlers are bound to state
          Verify useState is imported and initialized
          Look for console errors in browser DevTools
```

---

**Last Updated**: January 2026
```

```md file="docs/APP_DOCUMENTATION.md" isDeleted="true"
...deleted...
