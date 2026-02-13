# Before & After: Data Consistency Fix

## The Problem (Before)

### ❌ Dashboard Calculation

```typescript
// ❌ HARDCODED capacity for everyone
const CAPACITY_HOURS = 40;

const utilization = USERS.map((user) => {
  const userTasks = tasks.filter(
    (t) => t.assignee?.id === user.id && t.status !== "Done",
  );
  const totalEstimate = userTasks.reduce(
    (sum, t) => sum + (t.estimate ?? 0),
    0,
  );
  // ❌ Uses hardcoded 40 for everyone
  const pct = Math.round((totalEstimate / CAPACITY_HOURS) * 100);
  return { user, totalEstimate, pct };
});
```

**Issues:**

- ❌ Designer (32h capacity) calculated as if 40h
- ❌ Different logic from Utilization page
- ❌ Hardcoded value that doesn't match user profiles

---

### ❌ Utilization Page Calculation

```typescript
// ❌ DUPLICATE logic in separate file
const utilization = USERS.map((user) => {
  const userTasks = filteredTasks.filter((t) => t.assignee?.id === user.id);
  const totalEstimate = userTasks.reduce(
    (sum, t) => sum + (t.estimate ?? 0),
    0,
  );
  const capacity = user.weeklyCapacity; // ✅ This was correct
  const pct = capacity > 0 ? Math.round((totalEstimate / capacity) * 100) : 0;
  return { user, totalEstimate, pct, openTasks: userTasks.length, capacity };
});
```

**Issues:**

- ❌ Duplicated calculation logic
- ❌ Different from Dashboard
- ❌ Risk of divergence over time

---

## The Solution (After)

### ✅ Shared Utility Function (`/lib/utils.ts`)

```typescript
/**
 * Calculate utilization for a single user
 * SINGLE SOURCE OF TRUTH for utilization calculation
 */
export function calculateUserUtilization(user: User, tasks: Task[]) {
  const userTasks = tasks.filter((t) => t.assignee?.id === user.id);
  const totalEstimate = userTasks.reduce(
    (sum, t) => sum + (t.estimate ?? 0),
    0,
  );
  const capacity = user.weeklyCapacity; // ✅ Uses actual capacity
  const pct = capacity > 0 ? Math.round((totalEstimate / capacity) * 100) : 0;

  return {
    user,
    totalEstimate,
    pct,
    capacity,
    openTasks: userTasks.length,
  };
}

/**
 * Calculate utilization for all users with consistent filtering
 */
export function calculateUtilization(
  users: User[],
  allTasks: Task[],
  filters?: {
    epicId?: string;
    dateRange?: DateRangeFilter;
    excludeCompleted?: boolean;
  },
) {
  let filteredTasks = allTasks;

  // ✅ Apply filters consistently
  if (filters?.excludeCompleted !== false) {
    filteredTasks = filteredTasks.filter((t) => t.status !== "Done");
  }

  if (filters?.epicId) {
    filteredTasks = filteredTasks.filter((t) => t.epicId === filters.epicId);
  }

  if (filters?.dateRange && filters.dateRange !== "none") {
    filteredTasks = filterTasksByDateRange(filteredTasks, filters.dateRange);
  }

  // ✅ Calculate using shared function
  return users.map((user) => calculateUserUtilization(user, filteredTasks));
}
```

---

### ✅ Dashboard Implementation

```typescript
import {
  calculateUtilization,
  calculateUtilizationAggregates,
} from "@/lib/utils";

// ✅ Uses shared utility
const utilization = useMemo(
  () =>
    calculateUtilization(USERS, tasks, {
      excludeCompleted: true,
      dateRange: "none", // Dashboard shows all open work
    }),
  [tasks],
);

const { overCapacity, avgUtilization } = useMemo(
  () => calculateUtilizationAggregates(utilization),
  [utilization],
);
```

**Benefits:**

- ✅ Correctly uses `user.weeklyCapacity`
- ✅ Same logic as Utilization page
- ✅ No hardcoded values
- ✅ Guaranteed consistency

---

### ✅ Utilization Page Implementation

```typescript
import { calculateUtilization, DateRangeFilter } from "@/lib/utils";

// ✅ Uses same shared utility
const utilization = useMemo(
  () =>
    calculateUtilization(USERS, tasks, {
      epicId: epicFilter || undefined,
      dateRange: dateRange,
      excludeCompleted: true,
    }),
  [tasks, dateRange, epicFilter],
);
```

**Benefits:**

- ✅ Same calculation as Dashboard
- ✅ No duplicate logic
- ✅ Easy to maintain
- ✅ Type-safe filters

---

## Real Example

### Scenario: Designer with 40h of work

#### ❌ Before

```
Dashboard:
  Designer: 40h assigned / 40h capacity = 100% ❌ WRONG!
  (Used hardcoded 40h instead of actual 32h)

Utilization Page:
  Designer: 40h assigned / 32h capacity = 125% ✅ CORRECT

⚠️ DISCREPANCY: 100% vs 125%
```

#### ✅ After

```
Dashboard:
  Designer: 40h assigned / 32h capacity = 125% ✅ CORRECT

Utilization Page:
  Designer: 40h assigned / 32h capacity = 125% ✅ CORRECT

✅ CONSISTENT: 125% = 125%
```

---

## Architecture Comparison

### ❌ Before (Duplicated Logic)

```
┌─────────────────────┐         ┌─────────────────────┐
│   Dashboard Page    │         │ Utilization Page    │
│                     │         │                     │
│ Own calculation:    │         │ Own calculation:    │
│ • CAPACITY = 40     │         │ • user.capacity     │
│ • map(users)        │    ❌   │ • map(users)        │
│ • sum estimates     │ Different│ • sum estimates     │
│ • calc %            │   Logic │ • calc %            │
└─────────────────────┘         └─────────────────────┘
       ❌ Inconsistent Results
```

### ✅ After (Shared Utilities)

```
┌─────────────────────┐         ┌─────────────────────┐
│   Dashboard Page    │         │ Utilization Page    │
│                     │         │                     │
│ calculateUtil(...)  │         │ calculateUtil(...)  │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           └───────────┬───────────────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   lib/utils.ts        │
           │                       │
           │ calculateUtilization()│
           │ • user.weeklyCapacity │
           │ • shared logic        │
           │ • consistent filters  │
           └───────────────────────┘
                ✅ Guaranteed Consistency
```

---

## Data Flow

### ❌ Before

```
USERS (mock.ts)
  ├─> Dashboard ──> Own calculation (CAPACITY_HOURS = 40)
  └─> Utilization ──> Different calculation (user.weeklyCapacity)

Result: INCONSISTENT ❌
```

### ✅ After

```
USERS (mock.ts)
  ├─> Dashboard ──┐
  │               ├──> calculateUtilization() (lib/utils.ts)
  └─> Utilization ┘           ↓
                        Uses user.weeklyCapacity

Result: CONSISTENT ✅
```

---

## Testing Proof

### Test Case: All Users Utilization

```typescript
// Using MOCK_TASKS (40h for Admin, 40h for Designer, 30h for Backend Dev)

// BEFORE (Dashboard hardcoded 40):
Admin:    40h / 40h = 100% ✅
Designer: 40h / 40h = 100% ❌ WRONG (should be 125%)
Backend:  30h / 40h = 75%  ✅

Average: 91.67% ❌ WRONG

// AFTER (Shared utility with user.weeklyCapacity):
Admin:    40h / 40h = 100% ✅
Designer: 40h / 32h = 125% ✅ CORRECT
Backend:  30h / 40h = 75%  ✅

Average: 100% ✅ CORRECT
```

---

## Summary

| Aspect                 | Before                 | After             |
| ---------------------- | ---------------------- | ----------------- |
| Calculation Logic      | ❌ Duplicated          | ✅ Shared         |
| Capacity Source        | ❌ Hardcoded           | ✅ User Profile   |
| Dashboard Accuracy     | ❌ Wrong for part-time | ✅ Correct        |
| Cross-page Consistency | ❌ No guarantee        | ✅ Guaranteed     |
| Maintainability        | ❌ Update 2 places     | ✅ Update 1 place |
| Type Safety            | ⚠️ Partial             | ✅ Full           |
| Test Coverage          | ❌ None                | ✅ Test suite     |
| Documentation          | ❌ None                | ✅ Complete       |

---

## Verification Steps

1. **Check Capacity Display**
   - Dashboard: Look at user table → "Designer · 32h/wk" ✅
   - Utilization: Look at capacity column → "32h" ✅

2. **Check Calculations**
   - Designer with 40h work: Should show 125% on BOTH pages ✅

3. **Check Code**
   - Dashboard: No `CAPACITY_HOURS` constant ✅
   - Both pages: Import from `lib/utils` ✅

4. **Check Consistency**
   - Set both pages to "All Open Tasks" ✅
   - Average utilization should match ✅

---

✅ **Problem Solved!**  
✅ **Data Consistency Achieved!**  
✅ **Trust in Analytics Restored!**
