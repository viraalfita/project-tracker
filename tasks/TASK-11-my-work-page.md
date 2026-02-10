# TASK-11: My Work Page and Unassigned Indicators

**Epic:** C1 — Assignment clarity
**Difficulty:** Easy
**Dependencies:** TASK-08, TASK-09

## Description

A personal work page that shows all tasks and subtasks assigned to the current user, grouped by status, with overdue items surfaced at the top. Unassigned tasks must be visually flagged everywhere they appear — not just on this page.

## To-Do

- [ ] "My Work" route and page (linked from sidebar)
- [ ] API endpoint: fetch all open tasks + subtasks where `assignee_id` = current user
- [ ] Group by status on the page: `To Do`, `In Progress`, `Review`
- [ ] Each group header shows item count
- [ ] Overdue items (due date < today) surfaced at the top of the page in a separate "Overdue" section
- [ ] Done tasks hidden by default; show a "Show completed" toggle to reveal them
- [ ] Each item links directly to its task detail
- [ ] Show parent epic/project context on each item (breadcrumb: Project > Epic)
- [ ] "Unassigned" visual badge on task and subtask cards across all views (list, board, epic detail)
- [ ] "Unassigned" badge should be visually distinct (e.g., grey italic text or an icon) — not just blank

## How to Verify

- Assigning a task to yourself makes it appear in My Work under the correct status group
- Overdue tasks appear in the "Overdue" section at the top, not duplicated in status groups
- Completed tasks are hidden until the toggle is activated
- Unassigning yourself from a task removes it from My Work
- An unassigned task shows the "Unassigned" indicator on its card in the list and board views
- Clicking an item in My Work opens the correct task detail
