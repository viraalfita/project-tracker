# TASK-15: Team Utilization Overview

**Epic:** D1 — Utilization overview
**Difficulty:** Medium
**Dependencies:** TASK-02, TASK-08, TASK-09

## Description

A view that shows each team member's assigned estimated hours versus their weekly capacity, with over/under-capacity indicators. Helps supervisors spot workload imbalances before they become blockers. Capacity is configurable per user.

## To-Do

- [ ] User settings page: weekly capacity field (hours/week, default 40), editable by the user themselves or Admin
- [ ] API endpoint: compute utilization per user — sum of `estimate_hours` on all open (non-Done) tasks and subtasks assigned to them, bucketed by week
- [ ] Utilization page UI: table or card grid, one row/card per workspace member
- [ ] Columns: avatar + name, capacity (h/week), assigned this week (h), assigned next week (h), utilization % (assigned / capacity)
- [ ] Utilization color: green (<80%), yellow (80–100%), red (>100%)
- [ ] Filter bar: by project (multi-select), by date range (this week / next week / custom)
- [ ] Users with no capacity set: show "—" for utilization %, not 0% (to avoid false "under-capacity" signal)
- [ ] Users with no assigned tasks: show 0h / 0% (not an error)
- [ ] Drill-down: clicking a user's row expands their task list for the selected week

## How to Verify

- Assign a 20h task to a user with 40h/week capacity → utilization shows 50% (green)
- Assign tasks totaling 45h to a user with 40h/week capacity → shows red (>100%)
- Filtering by project narrows the utilization to that project's tasks only
- A user with no tasks assigned shows 0h, 0%, and green status
- A user with no capacity set shows "—" for utilization
- Changing weekly capacity in settings updates the utilization view without a page reload
