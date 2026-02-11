# Epics Requiring Attention Feature

## Overview

The Dashboard now includes a dedicated **"Epics Requiring Attention"** section that provides actionable insight into which epics need immediate intervention. This is a monitoring layer focused on proactive project management.

## Location

- **Page**: Dashboard (`/dashboard`)
- **Position**: Below Health Dashboard section, above Quick Actions

## Attention Criteria

An epic requires attention if it meets **at least one** of the following conditions:

1. **Has overdue tasks** - Any task past its due date and not completed
2. **Has tasks marked "At Risk"** - Tasks with High priority and In Progress status (EWS triggered)
3. **Progress < 30% and status = In Progress** - Epic started but making minimal progress
4. **More than 30% of tasks are overdue** - Significant portion of work is behind schedule
5. **Owner has utilization > 120%** - Epic owner is significantly over capacity

## Risk Level Calculation

Each attention epic is assigned a risk level:

### High Risk

- ≥3 overdue tasks **OR**
- ≥2 At Risk tasks

### Medium Risk

- 1–2 overdue tasks **OR**
- 1 At Risk task

### Low Risk

- No overdue tasks and no EWS-triggered tasks
- (Epic requires attention for other reasons like low progress or owner capacity)

## Display Format

Each epic row shows:

| Column                     | Description                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| **Epic Name + Risk Badge** | Title with color-coded risk level (High=Red, Medium=Amber, Low=Blue)                                |
| **Attention Reasons**      | Specific reasons why epic requires attention (e.g., "3 overdue tasks · Owner over capacity (142%)") |
| **Owner**                  | Avatar and name of epic owner                                                                       |
| **Progress %**             | Current completion percentage                                                                       |
| **Status**                 | Epic status badge (In Progress, Done, etc.)                                                         |

## Role-Based Visibility

### Admin & Manager

- See **all** epics requiring attention across the workspace
- Full visibility into all project health issues

### Member

- See **only** attention epics within their assigned epics
- Limited to epics they have membership in (based on `EPIC_MEMBERS`)

### Viewer

- See **only** attention epics within their assigned epics
- Read-only access, no action buttons

## Behavior

- **Clicking an epic row**: Navigates to the epic detail page (`/epic/{epicId}`)
- **Empty state**: When no epics require attention, displays:
  > "No Epics require attention at this time"
  > "All epics are on track"
- **Sorting**: Epics are sorted by risk level (High → Medium → Low)

## Visual Design

### Risk Badges

- **High Risk**: Red badge with AlertCircle icon
- **Medium Risk**: Amber badge with AlertTriangle icon
- **Low Risk**: Blue badge with Clock icon

### Section Header

- AlertCircle icon (red) to indicate priority
- Count of epics requiring attention
- Example: "Epics Requiring Attention" with "3 epics need intervention"

### Interactive States

- Hover effect on rows for better clickability
- Responsive layout that adapts to screen size
- Hidden owner details on small screens (showing only avatar)

## Integration with Existing Features

### Does NOT Replace

- ❌ Health Dashboard cards (Overdue Tasks, High Priority Tasks)
- ❌ Early Warning System section
- ❌ Key Metrics KPIs
- ❌ Quick Actions links

### Complements

- ✅ Provides **actionable** epic-level insights
- ✅ Aggregates multiple health signals into risk levels
- ✅ Shows **who** is responsible (owner) for each attention epic
- ✅ Links attention reasons to specific metrics

## Example Scenarios

### Scenario 1: High Risk Epic

```
Epic: "Payment Gateway Integration"
Risk: High Risk (Red)
Reasons: 3 overdue tasks · 2 at-risk tasks
Owner: Backend Dev
Progress: 45%
Status: In Progress
```

### Scenario 2: Medium Risk Epic

```
Epic: "Mobile App MVP"
Risk: Medium Risk (Amber)
Reasons: 1 overdue task · Low progress (25%)
Owner: Frontend Dev
Progress: 25%
Status: In Progress
```

### Scenario 3: Low Risk Epic (Owner Capacity Issue)

```
Epic: "E-Commerce Platform Redesign"
Risk: Low Risk (Blue)
Reasons: Owner over capacity (142%)
Owner: Admin User
Progress: 58%
Status: In Progress
```

## Technical Implementation

### Data Calculation

- Real-time calculation based on current task states
- Filters applied based on user role and epic membership
- Utilization data cross-referenced from team capacity metrics

### Performance

- All calculations done in-memory on client side
- No additional API calls required
- Leverages existing DataStore context

### Code Location

- **File**: `/app/dashboard/page.tsx`
- **Function**: `attentionEpics` calculation
- **Helper**: `getRiskBadge()` for risk level styling
- **Filter**: `canViewEpic()` from permissions helper

## Future Enhancements (Not Implemented)

- Email notifications for new attention epics
- Export attention epic list to CSV
- Historical trend tracking (how long epic has been at risk)
- Action items/remediation suggestions
- Integration with task reassignment workflow
