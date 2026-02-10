# TASK-23: Progress Rollup (Subtask → Task → Epic)

**Difficulty:** Easy
**Dependencies:** TASK-07, TASK-08, TASK-09

## Description

Implement the % complete rollup logic defined in PRD Appendix A. Progress must update reactively whenever a subtask or task status changes. This is a shared utility consumed by TASK-07 (epic cards), TASK-08 (task cards), TASK-21 (list view), and TASK-22 (board view).

## Rollup Rules (from PRD Appendix A)

| Scenario | Rule |
|---|---|
| Task **with** subtasks | `% = (# Done subtasks / total subtasks) × 100` |
| Task **without** subtasks | `0%` if To Do, `50%` if In Progress / Review, `100%` if Done |
| Epic % | Unweighted average of all child task % values |
| Epic with no tasks | `0%` |
| Task with no subtasks and status = Review | Treated as `50%` (same as In Progress) |

## To-Do

- [ ] Implement `task_progress(task)` function:
  - If task has subtasks: count Done subtasks / total subtasks
  - If no subtasks: map status → %
- [ ] Implement `epic_progress(epic)` function:
  - Average `task_progress` across all child tasks
  - Return 0 if no tasks
- [ ] Decide: compute on-the-fly (no stored value) OR cache as a column (updated via trigger/hook)
  - Recommendation: compute on-the-fly for MVP to avoid cache staleness bugs; revisit if performance is an issue
- [ ] Wire rollup recalculation: called whenever subtask status changes or subtask is created/deleted
- [ ] Wire epic rollup: called whenever a task's computed % changes
- [ ] Display on epic card: progress bar + `X%` text
- [ ] Display on task card: fraction chip (`2 / 5 subtasks`) + progress bar (if space allows)
- [ ] Unit tests for each rollup rule scenario (at minimum 5 test cases):
  - Epic with 2 tasks at 50% and 100% → 75%
  - Task with 3 subtasks, 2 Done → 66%
  - Task with no subtasks, status In Progress → 50%
  - Epic with no tasks → 0%
  - Task with 5 subtasks, all Done → 100%

## How to Verify

- Epic with 2 tasks (50% and 100%): dashboard and epic card show `75%`
- Task with 3 subtasks (2 Done, 1 To Do): task card shows `2 / 3` and `66%`
- Task with no subtasks in `In Progress`: shows `50%`
- Epic with no tasks: shows `0%` (not blank, not an error)
- Marking the last subtask Done: epic % updates immediately without a page reload
- All 5 unit tests pass
