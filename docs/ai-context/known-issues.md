# Known Issues

> **Bug Tracker** - What's broken and where to fix it

**Last Updated**: January 26, 2026

---

## 🔴 Critical (Blocking Core Features)

### Analytics Page - No Data Integration
- **Location**: `app/analytics/page.tsx`
- **Symptom**: Shows mock data instead of real expenses
- **Cause**: Not connected to `use-expenses.ts` hook
- **Impact**: Users cannot see actual spending patterns
- **Fix Required**: 
  ```typescript
  // Replace mock data with:
  const { expenses } = useExpenses()
  // Then aggregate for charts (group by category, date range, etc.)
  ```

---

## 🟡 High Priority (User-Facing Issues)

### No Theme Toggle (Only One Theme Available)
- **Location**: `components/ui/theme-provider.tsx` (exists but no UI toggle)
- **Symptom**: Only single theme available, no dark/light mode switch
- **Cause**: Theme provider exists but no toggle button implemented
- **Impact**: Users stuck with default theme
- **Fix Required**:
  - Add theme toggle button in header or settings page
  - Wire up to theme provider's toggle function
  - Test both dark and light mode styles

---

## Fixed (Archive)

_Move resolved issues here with fix date for reference_

<!-- Example:
### Issue Name (FIXED 2026-01-25)
- **Fixed By**: Description of fix
- **Commit**: abc123
-->

---

## How to Use This File

**When you find a bug:**
1. Add it to the appropriate priority section
2. Include location (file path)
3. Describe symptom, cause, impact
4. Suggest fix if known

**When you fix a bug:**
1. Move to "Fixed (Archive)" section
2. Add fix date and brief description
3. Remove from current issues

**Priority Guide:**
- 🔴 **Critical**: Core feature broken, blocks main functionality
- 🟡 **High**: User-facing issue, impacts UX significantly
- 🟢 **Medium**: Nice to have, workarounds exist
- 🔵 **Low**: Edge cases, minor cosmetic issues

---

**Owner**: Development Team  
**Update**: Immediately when bugs found/fixed