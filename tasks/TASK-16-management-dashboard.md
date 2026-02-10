# TASK-16: Management Dashboard

**Epic:** D2 — Progress without PM follow-up
**Difficulty:** Medium
**Dependencies:** TASK-07, TASK-08, TASK-17 (EWS feed), TASK-23 (rollup)

## Description

A high-level health dashboard for Management and Supervisors. Shows workspace-wide KPI cards and an epic status table with drill-down. Data is live — no manual reporting. Visible to Admin and Manager roles only.

## To-Do

- [ ] Dashboard route `/dashboard` (restricted to Admin + Manager)
- [ ] KPI summary cards row:
  - Total overdue tasks (due date < today, status ≠ Done)
  - Total in-progress tasks
  - Total "at risk" tasks (EWS-flagged)
  - Total epics on track / at risk / overdue (3 counts or a ratio)
- [ ] Epics health table: columns = Epic name, Project, % complete, Due date, Health status
- [ ] Health status logic: `On Track` (no at-risk/overdue tasks), `At Risk` (any child task at-risk), `Overdue` (epic's own due date < today)
- [ ] Row click or expand: drill down from Epic → show child tasks inline (or navigate to epic detail)
- [ ] EWS feed section: list of recent EWS events (task name, when triggered, owner) — limited to last 20 events
- [ ] KPI cards auto-update on page load; no manual refresh button required
- [ ] Empty state for workspaces with no epics/tasks yet
- [ ] Dashboard visible in sidebar nav for Admin + Manager only

## How to Verify

- Creating an overdue task increments the "overdue" KPI card on the dashboard
- An epic with an at-risk child task shows `At Risk` health status in the table
- Drilling into an epic row shows its tasks
- EWS feed shows the most recent EWS events, newest first
- A fresh workspace (no data) renders an empty state, not a blank/broken page
- Members and Viewers cannot access `/dashboard` (redirected or shown 403)
