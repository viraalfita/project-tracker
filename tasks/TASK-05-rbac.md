# TASK-05: Role-Based Access Control (RBAC)

**Epic:** A2 — Permissions
**Difficulty:** Medium
**Dependencies:** TASK-02, TASK-04

## Description

Enforce the four-role permission model across all API endpoints and UI surfaces. Each role has a clearly defined set of allowed actions. Authorization must be enforced server-side — UI hiding alone is not sufficient.

## Permission Matrix

| Action | Admin | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|
| Invite users / manage roles | ✅ | ❌ | ❌ | ❌ |
| View all projects | ✅ | ✅ | ❌ | ❌ |
| Create/edit projects | ✅ | ❌ | ❌ | ❌ |
| Create/edit epics & tasks | ✅ | ✅ (assigned projects) | ✅ (assigned projects) | ❌ |
| Delete epics/tasks | ✅ | ✅ | ❌ | ❌ |
| Export CSV | ✅ | ✅ | ❌ | ❌ |
| View utilization/dashboard | ✅ | ✅ | ❌ | ❌ |

## To-Do

- [ ] Define a permission constants/policy file with the above matrix
- [ ] Implement server-side authorization middleware/guard that checks role before any mutation endpoint
- [ ] Return HTTP 403 with a clear message on unauthorized requests (not a silent redirect)
- [ ] UI: hide/disable action buttons (edit, delete, invite) when current user lacks permission
- [ ] Member can only see projects they are in `project_members` for
- [ ] Manager can see all projects regardless of `project_members`
- [ ] Viewer can see accessible projects and tasks but cannot submit any mutation
- [ ] Write at least one authorization test per role for a key action (e.g., create task, delete epic, view project)

## How to Verify

- Logged in as Viewer: all edit/delete buttons are hidden; direct API mutations return 403
- Logged in as Member: projects they're not added to are absent from the sidebar and return 403
- Logged in as Manager: all projects are visible; admin settings page is inaccessible
- Logged in as Admin: all actions succeed
- Changing a user's role takes effect immediately (no re-login required)
