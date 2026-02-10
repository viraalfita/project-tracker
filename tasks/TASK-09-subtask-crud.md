# TASK-09: Subtask CRUD

**Epic:** B3 — Break Task into Subtasks
**Difficulty:** Easy
**Dependencies:** TASK-08, TASK-23 (rollup)

## Description

Implement Subtasks as children of Tasks. Subtasks are rendered inline within the Task detail panel. Completing subtasks rolls up to the parent task's % complete (wired in TASK-23).

## To-Do

- [ ] Subtask list rendered inline inside Task detail, collapsible
- [ ] "Add subtask" inline input at the bottom of the subtask list (press Enter to save)
- [ ] Subtask fields: title (required), assignee (user picker), status, estimate (hours), due date
- [ ] Click subtask title to expand its own mini-detail (or inline-edit all fields)
- [ ] Status checkbox on subtask row: checking it marks the subtask `Done`
- [ ] Edit subtask fields inline
- [ ] Delete subtask (no confirmation needed — it's lightweight)
- [ ] Subtask count badge on parent task card: e.g., `3 / 5 subtasks done`
- [ ] PATCH `/subtasks/:id` — status change triggers parent task % recalculation (TASK-23)
- [ ] Log `task_status_events` for subtasks if you need subtask-level cycle time (optional)

## How to Verify

- Add 3 subtasks to a task; count badge on task card shows `0 / 3`
- Check one subtask as Done; badge updates to `1 / 3`
- Check all subtasks Done; parent task % complete updates to 100%
- Delete a subtask; badge count decrements and % recalculates
- Subtask fields (assignee, estimate, due date) save correctly on edit
