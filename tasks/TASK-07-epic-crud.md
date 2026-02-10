# TASK-07: Epic CRUD

**Epic:** B1 — Create an Epic
**Difficulty:** Easy
**Dependencies:** TASK-02, TASK-06, TASK-23 (for % complete display)

## Description

Implement full create/read/update/delete for Epics within a project. An Epic is the highest level of work hierarchy. Its % complete rolls up from child tasks (wired in TASK-23 — display a placeholder until that task is done).

## To-Do

- [ ] Epics list tab within the project page
- [ ] "New Epic" button (visible to Admin/Manager/Member)
- [ ] Create epic form/modal: title (required), description, owner (user picker), status, start date, end date, tags
- [ ] POST `/projects/:id/epics` — create epic
- [ ] Epic card in list: title, owner avatar, status badge, due date, % complete bar
- [ ] Epic detail page: shows all fields + child tasks list
- [ ] Edit epic: inline field editing or edit modal
- [ ] PATCH `/epics/:id` — update epic
- [ ] Delete epic: confirmation modal that warns if child tasks exist
- [ ] DELETE `/epics/:id` — delete (cascade to tasks/subtasks, or block if children exist — decide and document)
- [ ] Status options: `Not Started | In Progress | Done | On Hold`
- [ ] Tags: stored as array, rendered as chips

## How to Verify

- Create an epic with all fields; it appears in the project's epics list
- Edit the epic title; the updated title appears on the card without a page refresh
- Delete an epic that has tasks; the confirmation modal warns about child tasks
- % complete shows `0%` for a new epic with no tasks (not an error or blank)
- Tags render as chips and are editable
