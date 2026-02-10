# TASK-17: Early Warning System (EWS)

**Epic:** D3 — Early Warning System
**Difficulty:** Medium
**Dependencies:** TASK-02, TASK-08, TASK-13, TASK-14

## Description

A background job that detects tasks that have been "In Progress" too long relative to their estimate. Marks them "At Risk," notifies owners and watchers, and surfaces events in the dashboard feed. For MVP, EWS uses task age in days since the estimate is in hours, not tracked actual time.

## EWS Logic

```
age_in_days = today - date task entered "In Progress" (from task_status_events)
threshold_days = (estimate_hours / 8) × multiplier   (default multiplier: 1.5)

if age_in_days > threshold_days AND status == "In Progress":
  mark task at_risk = true
  create EWS notification (if not already notified for this trigger)
```

Tasks with no estimate: use a flat default threshold (e.g., 5 business days — configurable).

## To-Do

- [ ] Workspace setting: EWS threshold multiplier (default 1.5), configurable by Admin
- [ ] Workspace setting: flat threshold for tasks with no estimate (default 5 days)
- [ ] Background job / cron: runs EWS check once daily (e.g., 8 AM workspace timezone)
- [ ] EWS check logic (see above): query all in-progress tasks, evaluate each against threshold
- [ ] On trigger: set `at_risk = true` on task, create record in `notifications` (type: `ews_triggered`)
- [ ] Avoid duplicate notifications: only fire notification if task was not already `at_risk = true` before this run
- [ ] When task moves to `Done` or `Review`: clear `at_risk = false` (reset)
- [ ] When task returns to `In Progress` after being cleared: re-evaluate from current date (fresh clock)
- [ ] "At Risk" badge on task cards in all views (list, board, epic detail)
- [ ] Filter option: "At Risk only" in task list filters (TASK-12)
- [ ] EWS feed on management dashboard (TASK-16): pulls `notifications` records where type = `ews_triggered`

## How to Verify

- Task with 8h estimate (= 1 day threshold × 1.5 = 1.5 days): triggers EWS after 2 days in progress
- Task with no estimate: triggers EWS after 5 days in progress (default)
- "At Risk" badge appears on the task card
- EWS event appears in the dashboard feed
- Completing the task clears the "At Risk" badge
- Re-opening a completed task and leaving it In Progress re-triggers EWS after threshold (not immediately)
- EWS does not fire a second notification for a task already marked `at_risk = true`
