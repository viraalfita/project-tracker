# TASK-08: Task CRUD

**Epic:** B2 — Create a Task under an Epic
**Difficulty:** Easy
**Dependencies:** TASK-02, TASK-07

## Description

Implement full CRUD for Tasks within an Epic. Tasks are the primary unit of work. Every task should have a prominent assignee display, and unassigned tasks must be visually flagged so they can't quietly slip through.

## To-Do

- [ ] Tasks list within Epic detail (expandable or inline)
- [ ] "New Task" button within epic context
- [ ] Create task form/modal: title (required), description, assignee (user picker), status, priority, estimate (hours), due date
- [ ] POST `/epics/:id/tasks` — create task
- [ ] Task card: title, assignee avatar (or "Unassigned" badge), priority badge, status chip, due date
- [ ] Task detail page / slide-over panel: all fields editable inline
- [ ] Edit task fields: support inline editing on each field (click to edit pattern)
- [ ] PATCH `/tasks/:id` — update task
- [ ] Delete task: confirmation modal if subtasks exist
- [ ] DELETE `/tasks/:id`
- [ ] Priority options: `Low | Medium | High`
- [ ] Status options: `To Do | In Progress | Review | Done`
- [ ] Log a `task_status_events` record whenever status changes (needed for EWS and cycle time)
- [ ] Set `completed_at` when status transitions to `Done`; clear it if status moves back

## How to Verify

- Create a task under an epic; it appears in the epic's task list
- A task with no assignee displays the "Unassigned" badge, not a blank space
- Changing priority updates the badge color immediately (no page reload)
- Deleting a task with subtasks shows a confirmation warning
- `task_status_events` has a new record each time status changes
- `completed_at` is set when task is marked Done and cleared when moved back
