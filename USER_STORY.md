# User Story

Cool—let’s turn this into a clean MVP backlog with user stories + acceptance criteria, designed to iterate fast and still feel “Jira-like” without becoming Jira.

(You mentioned past tool friction with ClickUp and Jira, and the current patchwork using Figma + Notion—so the MVP should be simple, opinionated, and internal-first.)

---

## Personas (MVP roles)

- **Management (Owner/Director)**: wants high-level visibility + early warnings, no PM chasing.
- **Supervisor/Manager**: wants workload/utilization + progress control.
- **PM**: wants structure, assignments, docs, predictable reporting.
- **Contributor (Designer/Dev/Marketer/etc.)**: wants clear task list, due dates, docs, and “what’s next”.

---

## MVP Epics + User Stories

### Epic A — Workspace + Access (stop “locked out”)

#### A1 — Workspace membership

**User story:**  
As an Admin/PM, I want to invite team members into a workspace/project, so that everyone who needs access can participate.

**Acceptance criteria:**

- Can add user by email to workspace
- Roles at minimum: Admin, Manager, Member, Viewer
- User can see projects they have access to

#### A2 — Permissions basics

**User story:**  
As a Manager, I want read access across all projects by default, so that I can monitor without asking PMs.

**Acceptance criteria:**

- Manager role can view all projects and tasks
- Members only see projects they’re assigned to (or explicitly added)
- Viewers can read but not edit

---

### Epic B — Hierarchical Work Tracking (Epic → Task → Subtask)

#### B1 — Create an Epic

**User story:**  
As Management/PM, I want to create an Epic (big initiative), so that leadership can see progress at a high level.

**Acceptance criteria:**

- Epic has: title, description, owner, status, start/end (optional), tags
- Epic shows aggregated progress from child Tasks (e.g., % complete)

#### B2 — Create a Task under an Epic

**User story:**  
As a Supervisor/PM, I want to create Tasks under an Epic, so that I can define focus areas and assign ownership.

**Acceptance criteria:**

- Task belongs to one Epic (required)
- Task has: title, description, assignee, status, priority, estimate (time), due date
- Task displays assignee prominently (“who is doing what”)

#### B3 — Break Task into Subtasks

**User story:**  
As a Contributor/PM, I want to create Subtasks under a Task, so that execution steps are granular and trackable.

**Acceptance criteria:**

- Subtask belongs to one Task (required)
- Subtask has: title, assignee (optional but recommended), status, estimate, due date
- Subtasks roll up progress to the parent Task

#### B4 — Task granularity quick-capture

**User story:**  
As a Contributor, I want to quickly write a messy task and refine it into subtasks later, so that capturing work is frictionless.

**Acceptance criteria:**

- “Quick add” from anywhere (project/board/list)
- Convert bullet list in description into subtasks (basic parser)
- No mandatory fields beyond title at creation time (except parent link)

---

### Epic C — Accountability (who’s doing what)

#### C1 — Assignment clarity

**User story:**  
As a Manager, I want every Task/Subtask to have a visible assignee and status, so that responsibility is never ambiguous.

**Acceptance criteria:**

- Task without assignee is flagged visually (e.g., “Unassigned”)
- Filter by assignee, status, due date
- “My Work” page shows tasks/subtasks assigned to me

#### C2 — Ownership + watchers

**User story:**  
As a PM, I want to set an owner and watchers on an Epic/Task, so that accountability and visibility are explicit.

**Acceptance criteria:**

- Owner is single user; watchers is a list
- Watchers receive notifications on key changes (status change, overdue, EWS)

---

### Epic D — Monitoring & Oversight

#### D1 — Utilization overview

**User story:**  
As a Supervisor, I want to see utilization per person (assigned estimate vs capacity), so that I can balance workload.

**Acceptance criteria:**

- Each user has weekly capacity setting (e.g., 40h/week default)
- Utilization view shows: assigned estimated hours (open work) per week
- Can filter by project and by date range (this week/next week)

#### D2 — Progress without PM follow-up

**User story:**  
As Management, I want a single dashboard that shows project/epic health, so that I don’t need to ask PMs for updates.

**Acceptance criteria:**

- Dashboard shows: overdue count, tasks in progress, blocked count (if you include “Blocked”), top epics by risk
- Drill-down from Epic → Tasks → Subtasks
- Updated automatically from task activity (no manual report required)

#### D3 — Early Warning System (EWS)

**User story:**  
As a Manager, I want alerts when a task exceeds its estimate, so that we can review immediately before it snowballs.

**Acceptance criteria:**

- Task has estimate (e.g., 6h). System tracks time spent (see D4) or at least “age in status” if time tracking is not MVP
- When actual > estimate (or threshold like 120%), mark as “At Risk” and notify owner/watchers
- EWS events are visible in dashboard (“EWS feed”)

#### D4 — Time tracking (minimum viable)

**User story:**  
As a Contributor, I want to log time spent on a task, so that estimates become real data and EWS works.

**Acceptance criteria:**

- Start/stop timer OR manual entry (start with manual if you want faster MVP)
- Time entries attach to Task/Subtask and have date + duration + optional note
- Task shows total time spent vs estimate

#### D5 — KPI-ready metrics export

**User story:**  
As Management/Ops, I want task data to feed KPI calculations, so that performance reporting is automatic.

**Acceptance criteria:**

- Export (CSV) or API endpoint for: tasks completed, cycle time, overdue rate, utilization, estimate accuracy (actual/estimate)
- Filters by team member and time window (weekly/monthly)

---

### Epic E — Information & Collaboration (Docs hub)

#### E1 — Project documentation hub

**User story:**  
As a PM, I want a documentation section per project/epic, so that the tracker becomes the source of truth (not scattered).

**Acceptance criteria:**

- Each Project/Epic has a “Docs” area
- Supports: rich text pages + attachments/links
- Docs are searchable within the project

#### E2 — Task-level context

**User story:**  
As a Contributor, I want to attach links/files and write notes on tasks, so that execution doesn’t depend on DMs.

**Acceptance criteria:**

- Task supports: description, checklist (optional), attachments, links
- Comment thread exists for updates and decisions
- Mention/tag a teammate in comments (optional for MVP, but huge value)

---

### Epic F — Visualization / Views (make navigation intuitive)

#### F1 — List view (MVP must-have)

**User story:**  
As a Manager, I want a list view with filters/sorting, so that I can audit progress quickly.

**Acceptance criteria:**

- Sort by due date, priority, status
- Filter by assignee, status, epic, overdue, “at risk”
- Saved views (at least 1–3 per role)

#### F2 — Board view (nice MVP, high impact)

**User story:**  
As a Team, I want a Kanban board by status, so that work-in-progress is obvious.

**Acceptance criteria:**

- Columns = statuses (To Do / In Progress / Review / Done — or your custom)
- Drag & drop changes status
- WIP visibility: count per column

#### F3 — Timeline (post-MVP)

**User story:**  
As Management, I want a timeline view for epics, so that planning and overlaps are visible.

**Acceptance criteria:**

- Epic start/end dates render on timeline
- Dependencies optional (later)

---

### Future Iteration Epic — Client Collaboration (not MVP)

#### G1 — Client portal access

**User story:**  
As a PM, I want to invite a client as an external collaborator, so that onboarding/offboarding and feedback happen in one place.

**Acceptance criteria:**

- Client role can only access selected projects/epics
- Redacted internal fields (e.g., utilization, internal notes)
- Offboarding removes access cleanly but keeps audit history

---

## MVP Cutline (what I’d ship first)

If we’re truly doing “start MVP now”, the smallest lovable set is:

- Hierarchy: Epic → Task → Subtask (B1–B3)
- Accountability: assignee + “My Work” + filters (C1)
- Views: List view + basic Board (F1 + F2)
- Docs: Docs area + task attachments/comments (E1 + E2)
- Monitoring: Utilization (estimates-based) + simple EWS (D1 + D3)
- KPI export: CSV export (D5)

Time tracking (D4) can be phase 1.5 if you want to move faster—EWS can initially trigger based on task age (e.g., “In Progress > X days”) until time logging exists.
