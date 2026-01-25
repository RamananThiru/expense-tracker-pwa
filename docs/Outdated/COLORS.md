# Color System

## Category Color Palette

All categories are assigned modern, vibrant colors optimized for:
- Contrast and readability
- Distinction in pie charts
- Visual hierarchy in lists

### Color Reference Table

| Category | Background | Text | Hex Fill | Usage |
|----------|-----------|------|----------|-------|
| Food | bg-orange-100 | text-orange-600 | #f97316 | Groceries, dining, coffee |
| Transport | bg-blue-100 | text-blue-600 | #3b82f6 | Fuel, transit, taxi |
| Housing | bg-amber-100 | text-amber-600 | #d97706 | Rent, utilities, maintenance |
| Entertainment | bg-purple-100 | text-purple-600 | #a855f7 | Movies, gaming, hobbies |
| Health | bg-green-100 | text-green-600 | #10b981 | Medicine, fitness, medical |
| Shopping | bg-pink-100 | text-pink-600 | #ec4899 | Clothes, electronics, home |
| Bills | bg-red-100 | text-red-600 | #ef4444 | Electricity, internet, phone |
| Other | bg-slate-100 | text-slate-600 | #64748b | Miscellaneous items |

## Using Colors in Components

### Import Helper Functions

```typescript
import { 
  CATEGORY_COLORS,        // Full color object
  getCategoryColor,       // Get color by category name
  getCategoryHexColor     // Get hex color for charts
} from '@/lib/constants/category-colors'
```

### Get Full Color Object

```typescript
const colors = getCategoryColor('Food')
// Returns:
// {
//   bg: 'bg-orange-100',
//   text: 'text-orange-600',
//   fill: '#f97316'
// }
```

### Get Hex Color for Charts

```typescript
const hexColor = getCategoryHexColor('Food')
// Returns: '#f97316'

// Use in Recharts
<pie dataKey="value" fill={getCategoryHexColor(category)} />
```

### List All Categories

```typescript
const categories = Object.keys(CATEGORY_COLORS)
// Returns: ['Food', 'Transport', 'Housing', ...]

// Use in dropdowns
categories.map(cat => <option key={cat}>{cat}</option>)
```

### Apply Colors in JSX

```typescript
// Get colors
const { bg, text, fill } = getCategoryColor('Food')

// Use in component
<div className={`${bg} ${text} rounded-full`}>
  F
</div>
```

## Design Principles

### Color Selection Criteria
- **Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Distinctness**: Each color is visually unique
- **Accessibility**: Colorblind-friendly palette
- **Modern**: Contemporary, not dated
- **Chart Optimized**: Works well in pie/bar charts

### Mobile Considerations
- Colors remain distinct on small screens
- Sufficient saturation for touch UI clarity
- No pure black/white to reduce eye strain

---

**Last Updated**: January 2026
