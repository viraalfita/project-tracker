# TASK-06: Project Creation and Management

**Difficulty:** Easy
**Dependencies:** TASK-02, TASK-03, TASK-05

## Description

Allow Admins and PMs to create, edit, and archive projects within the workspace. Projects are the top-level container above Epics and appear in the sidebar. Managing project membership (who can access each project) is also scoped here.

## To-Do

- [ ] "New Project" button in sidebar (Admin/Manager only)
- [ ] Create project form/modal: name (required), description (optional), color or icon (optional)
- [ ] POST `/projects` — create project and add creator as a project member (Admin role within the project)
- [ ] Project detail page skeleton (placeholder tabs: Epics, Tasks, Board, Docs)
- [ ] Edit project: update name, description, color/icon
- [ ] Archive project: soft-delete (`archived_at`), remove from sidebar for non-Admins
- [ ] Project members tab: list current members, add new members (from workspace members), remove members
- [ ] Sidebar project list updates dynamically when a project is created or archived
- [ ] Archived projects accessible via an "Archived" section for Admins only

## How to Verify

- Admin creates a new project; it appears in the sidebar immediately
- Editing the project name reflects in the sidebar and on the project page
- Archiving a project hides it from the sidebar for Member/Viewer users
- Admin can still see the archived project under an "Archived" section
- Adding a user to project members gives them access; removing them revokes it
- Member who is not added to a project cannot see or navigate to it
