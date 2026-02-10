# TASK-21: Task List View

**Epic:** F1 — List view
**Difficulty:** Medium
**Dependencies:** TASK-08, TASK-12 (filters), TASK-23 (% complete)

## Description

A sortable, filterable tabular list of tasks for a project or epic. Supports inline status/assignee changes and opens a task detail panel on row click without full-page navigation. Integrates filters from TASK-12 and saved views.

## To-Do

- [ ] List view route: `/projects/:id/tasks` and `/epics/:id/tasks`
- [ ] Table columns: title, assignee avatar, status, priority badge, due date, estimate (h), subtask progress (e.g., `2/5`), epic name (project-level only)
- [ ] Sticky column headers with sort arrows (click to cycle: asc → desc → default)
- [ ] Inline status change: click status badge → dropdown of allowed transitions
- [ ] Inline assignee change: click assignee avatar/chip → user picker
- [ ] Row click opens task detail as a slide-over panel (URL updates to `/tasks/:id`)
- [ ] Slide-over can be closed without navigating away from the list
- [ ] Integrate filter bar (TASK-12) above the table
- [ ] Integrate saved views dropdown (TASK-12) in the filter bar
- [ ] Overdue rows: highlighted (e.g., red due date text)
- [ ] At-risk rows: "At Risk" badge in the status column
- [ ] Pagination or virtual scroll for lists >100 items
- [ ] Empty state when no tasks match the current filters

## How to Verify

- List renders all tasks for a project sorted by due date ascending by default
- Clicking a column header sorts that column; clicking again reverses; third click resets
- Changing status inline updates immediately — no page reload required
- Row click opens the task detail panel and the URL changes to the task URL
- Closing the panel returns to the list without re-fetching all data
- A filter combination (e.g., assignee + status) narrows the table correctly
- Overdue tasks show highlighted due dates; at-risk tasks show their badge
