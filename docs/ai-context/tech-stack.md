# Technology Stack

> **Reference Documentation** - Complete technology choices and versions

**Last Updated**: January 26, 2026

---

## Frontend Stack

### Core Framework

```yaml
Next.js:
  Version: 15+
  Router: App Router (not Pages Router)
  Rendering: Client-side (PWA requirements)
  Features:
    - File-based routing
    - Server Components (limited use for PWA)
    - Image optimization
    - Font optimization
```

### Language

```yaml
TypeScript:
  Version: 5+
  Mode: Strict
  Config: tsconfig.json
  Features:
    - Strict null checks
    - No implicit any
    - Strict function types
```

### Styling

```yaml
Tailwind CSS:
  Version: 4.0
  Config: tailwind.config.ts
  Approach: Utility-first
  Custom Tokens:
    - bg-background
    - text-foreground
    - border-border
    - (defined in globals.css)
  
Conventions:
  - Mobile-first responsive design
  - No arbitrary values (use scale)
  - Design tokens over direct colors
  - No inline styles
```

### UI Components

```yaml
shadcn/ui:
  Purpose: Base component library
  Installation: Manual (copy components)
  Customization: Full control
  Components Used:
    - Button
    - Card
    - Dialog
    - Dropdown
    - Input
    - Select
    - Toast
```

### Icons

```yaml
Lucide React:
  Version: Latest
  Purpose: Icon library
  Style: Outline icons
  Size: Configurable (default 24px)
  Usage: Import individual icons
  
Common Icons:
  - Home, Plus, TrendingUp (navigation)
  - Calendar, DollarSign (forms)
  - Settings, Upload, Download (actions)
```

### Charts

```yaml
Recharts:
  Version: Latest
  Purpose: Data visualization
  Chart Types Used:
    - PieChart (spending breakdown)
    - BarChart (monthly trends)
    - LineChart (time series)
  Features:
    - Responsive
    - Customizable
    - Animation support
```

---

## Data Layer

### Local Storage

```yaml
IndexedDB:
  Purpose: Primary data storage
  Library: Native browser API (wrapped in hooks)
  Database Name: "expense-tracker-db"
  Version: 1
  
Object Stores:
  - categories
  - sub_categories
  - expenses
  
Features:
  - Offline-first
  - Async API
  - Transaction support
  - Key-value pairs + indexes
```

### Cloud Backup

```yaml
Supabase:
  Purpose: Cloud backup only (not primary storage)
  Database: PostgreSQL 15+
  Features Used:
    - Authentication: None (local-only app)
    - Database: PostgreSQL tables
    - Storage: Not used
    - Realtime: Not used
  
Connection:
  - Client: @supabase/supabase-js
  - Auth: Anon key (read-only categories)
  - RLS: Not implemented (future feature)
```

---

## State Management

```yaml
Approach: React Hooks (no external state library)

Hooks Used:
  - useState: Local component state
  - useEffect: Side effects, data fetching
  - useContext: Theme provider
  - useMemo: Expensive computations
  - useCallback: Event handler optimization
  
Custom Hooks:
  - use-expenses.ts: IndexedDB CRUD
  - use-sync.ts: Supabase sync
  - use-reference-data.ts: Categories/subcategories
  - use-mobile.ts: Mobile detection
  - use-toast.ts: Notifications
```

---

## PWA Stack

### Service Worker

```yaml
Implementation: next-pwa plugin
Purpose:
  - Offline caching
  - Asset precaching
  - Runtime caching strategies
  
Cache Strategies:
  - Network First: API calls (future)
  - Cache First: Static assets
  - Stale While Revalidate: Images
```

### Manifest

```yaml
File: public/manifest.json
Purpose: PWA metadata
Fields:
  - name: "Expense Tracker"
  - short_name: "Expenses"
  - theme_color: "#000000"
  - background_color: "#000000"
  - display: "standalone"
  - icons: [192x192, 512x512]
```

---

## Build Tools

### Package Manager

```yaml
npm:
  Version: 10+
  Lock File: package-lock.json
  Scripts:
    - dev: Development server
    - build: Production build
    - start: Production server
    - lint: ESLint
    - type-check: TypeScript check
```

### Bundler

```yaml
Turbopack:
  Purpose: Fast build tool (Next.js default)
  Features:
    - Incremental builds
    - Fast refresh
    - Optimized production builds
```

### Linting

```yaml
ESLint:
  Config: .eslintrc.json
  Plugins:
    - eslint-plugin-react
    - eslint-plugin-react-hooks
    - @typescript-eslint
  Rules: Next.js recommended + strict
```

### Formatting

```yaml
Prettier:
  Config: .prettierrc (if exists)
  Integration: ESLint
  Format on Save: Recommended
```

---

## Development Tools

### IDE Recommendations

```yaml
VS Code:
  Extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript + JavaScript
    - Next.js snippets
```

### Browser DevTools

```yaml
Required:
  - Chrome DevTools (IndexedDB inspection)
  - React Developer Tools
```

---

## Deployment Stack (Future)

```yaml
Hosting:
  Option 1: Vercel (Next.js optimized)
  Option 2: Netlify
  Option 3: Cloudflare Pages

Environment Variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY

Build:
  - Command: npm run build
  - Output: .next/ folder
  - Node Version: 20+
```

---

## Environment Requirements

### Development

```yaml
Node.js: 20+ (LTS recommended)
npm: 10+
Browser: Chrome 120+, Safari 17+, Firefox 120+
OS: macOS, Linux, Windows (WSL2 recommended)
```

### Production

```yaml
Node.js: 20+ (runtime)
Browser Support:
  - Chrome 120+
  - Safari 17+ (iOS 16+)
  - Firefox 120+
  - Edge 120+
  - No IE11 support
```

---

## Performance Considerations

### Bundle Size Targets

```yaml
Initial JS: < 200KB (gzipped)
Total JS: < 500KB (gzipped)
CSS: < 50KB (gzipped)
Images: WebP, optimized
```

## Third-Party Dependencies

### Production

```json
{
  "next": "^15.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "lucide-react": "^0.300.0",
  "recharts": "^2.10.0",
  "tailwindcss": "^4.0.0"
}
```

### Development

```json
{
  "eslint": "^8.0.0",
  "eslint-config-next": "^15.0.0",
  "@types/react": "^18.0.0",
  "@types/node": "^20.0.0"
}
```

---

## Decision Log

### Why Next.js?
- App Router for modern architecture
- Built-in PWA support
- Image/font optimization
- Zero-config TypeScript

### Why IndexedDB over LocalStorage?
- Larger storage capacity (>50MB)
- Async API (non-blocking)
- Complex queries with indexes
- Transaction support

### Why Supabase over Firebase?
- Open-source
- PostgreSQL (standard SQL)
- Self-hosting option
- Better TypeScript support

### Why Tailwind over CSS-in-JS?
- Zero runtime cost
- Better performance
- Smaller bundle size
- Familiar utility classes

### Why No State Library (Redux/Zustand)?
- App complexity doesn't warrant it
- React hooks sufficient
- Smaller bundle size
- Less boilerplate

---

**Technology Owner**: Frontend Team  
**Review Frequency**: Quarterly or on major version changes  
**Upgrade Policy**: LTS versions preferred, test thoroughly before upgrading