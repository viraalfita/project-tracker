# TASK-02: Core Data Model

**Difficulty:** Medium
**Dependencies:** TASK-01

## Description

Define and migrate the full database schema for all MVP entities. Getting this right early prevents painful refactors later. All foreign keys, nullable fields, and index decisions should be made here. Includes a seed script for local development.

## To-Do

- [ ] Sketch ERD covering all entities and their relationships
- [ ] Migration: `users` (id, email, password_digest, name, weekly_capacity_hours default 40, created_at)
- [ ] Migration: `workspaces` (id, name, created_at)
- [ ] Migration: `workspace_members` (user_id, workspace_id, role enum, created_at)
- [ ] Migration: `projects` (id, workspace_id, name, description, archived_at, created_at)
- [ ] Migration: `project_members` (user_id, project_id, created_at)
- [ ] Migration: `epics` (id, project_id, title, description, owner_id, status enum, start_date, end_date, tags array, created_at)
- [ ] Migration: `tasks` (id, epic_id, title, description, assignee_id, status enum, priority enum, estimate_hours, due_date, at_risk bool default false, created_at, completed_at)
- [ ] Migration: `subtasks` (id, task_id, title, assignee_id, status enum, estimate_hours, due_date, created_at, completed_at)
- [ ] Migration: `task_status_events` (id, task_id, status, recorded_at) — needed for cycle time and EWS
- [ ] Migration: `watchers` (watchable_type, watchable_id, user_id) — polymorphic
- [ ] Migration: `comments` (id, commentable_type, commentable_id, author_id, body, deleted_at, created_at)
- [ ] Migration: `attachments` (id, attachable_type, attachable_id, filename, url, created_at)
- [ ] Migration: `docs` (id, docable_type, docable_id, title, body, created_at, updated_at)
- [ ] Migration: `notifications` (id, user_id, type, payload jsonb, read_at, created_at)
- [ ] Write seed file: 1 workspace, 4 users (one per persona), 2 projects, 3 epics, 10 tasks, 15 subtasks
- [ ] Confirm all migrations run cleanly and are reversible

## How to Verify

- `db:migrate` runs to completion with no errors
- `db:rollback` and `db:migrate` again produces the same schema
- Seed script populates local dev DB with realistic data
- ERD sketch matches the implemented schema
- Status enums match the values defined in the PRD (`To Do`, `In Progress`, `Review`, `Done`)
