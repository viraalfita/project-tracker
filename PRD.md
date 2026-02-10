# PRD: Internal Project Tracker (MVP)

**Version:** 0.1
**Date:** 2026-02-10
**Audience:** Internal dev team
**Status:** Draft

---

## TL;DR

Build a lightweight, opinionated internal project tracker that replaces a patchwork of ClickUp, Figma, and Notion. Ship a Jira-like experience without the Jira overhead. MVP targets four internal personas and delivers accountability, visibility, and work structure in a single tool.

---

## Problem Statement

The current workflow is fragmented across tools that don't talk to each other. As a result:

- Management has no single view of project health — they must chase PMs for updates.
- Supervisors can't see workload distribution; they don't know who is at capacity.
- PMs lack structure: no canonical source of truth for tasks, docs, and assignments.
- Contributors don't know what "next" is; DMs fill the gap that a task system should.

Previous tools (ClickUp, Jira) added friction rather than clarity. The team needs something simple, internal-first, and opinionated enough that people actually use it.

---

## Goals

1. Eliminate manual status updates to leadership via a live dashboard.
2. Give supervisors a utilization view so workload imbalances are visible before they become blockers.
3. Give every task a clear owner so "who is doing this?" has a one-click answer.
4. Centralize project documentation and task context to reduce DM-driven coordination.
5. Produce KPI data (cycle time, estimate accuracy, utilization) as a byproduct of normal task use.

---

## Non-Goals (MVP — hard scope exclusions)

The following are **explicitly out of scope for MVP**. Do not design for them.

- **Timeline / Gantt view** — post-MVP feature (Epic F3)
- **Client portal / external collaborator access** — post-MVP (Epic G1)
- **SSO / OAuth login** — basic auth only for MVP
- **Custom task statuses** — default status set only
- **Time tracking (start/stop timer)** — deferred to phase 1.5; EWS uses task age instead
- **Slack / webhook integrations** — email notifications only
- **API endpoint for KPI data** — CSV export only
- **Dependency tracking between tasks** — no blocking/blocked-by for MVP
- **Mobile native app** — responsive web only

---

## Personas

| Persona                                 | Primary need                                             |
| --------------------------------------- | -------------------------------------------------------- |
| **Management** (Owner/Director)         | High-level health at a glance, no PM chasing             |
| **Supervisor/Manager**                  | Workload/utilization overview, progress control          |
| **PM**                                  | Work structure, assignments, docs, predictable reporting |
| **Contributor** (Designer/Dev/Marketer) | Clear task list, due dates, docs, "what's next"          |

---

## Assumptions

1. Single-tenant — one organization, one workspace instance.
2. User scale: <100 users for MVP; no special infrastructure requirements.
3. Auth: email + password (or magic link). SSO is post-MVP.
4. EWS triggers on task age in status (e.g., "In Progress > N days") not on logged hours, since time tracking is deferred.
5. Default statuses: `To Do → In Progress → Review → Done`. No custom statuses in MVP.
6. Email delivery via a transactional provider (e.g., Resend or SES). No batching or digest logic required for MVP.
7. CSV export is sufficient for KPI reporting in MVP. No public API.
8. Web app only (cloud-hosted). No offline mode, no mobile native app.

---

## Risks

| Risk                                                                       | Severity   | Mitigation                                                                                          |
| -------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| EWS false positives without time tracking                                  | Medium     | Tune age thresholds carefully; surface as "advisory" not "alert"                                    |
| Docs hub (rich text + attachments + search) underestimated                 | High       | Scope to a single rich-text editor per entity + file link attachments; defer full-text search to v2 |
| Rollup % complete has edge cases (no subtasks, mixed status)               | Medium     | Define explicit rollup rules before dev starts (see Appendix A)                                     |
| Email reliability not owned by the app                                     | Low–Medium | Choose transactional provider early; treat as infrastructure task                                   |
| Contributors not updating task status → "My Work" and utilization go stale | Medium     | UX friction reduction is a priority; keep status update to 1 click                                  |
| Auth mechanism not yet specified                                           | High       | Must be decided before dev starts; not a PRD decision but a blocker                                 |

---

## MVP Scope

### Epic A — Workspace & Access

#### A1 — Workspace membership

**As an** Admin/PM, **I want to** invite team members into the workspace by email, **so that** everyone who needs access can participate.

**Acceptance criteria:**

- Can invite a user by email address
- Roles available: Admin, Manager, Member, Viewer
- Invited user receives an email with an activation link
- User can see only the projects they have access to

#### A2 — Role-based permissions

**As a** Manager, **I want** read access across all projects by default, **so that** I can monitor without asking PMs to share things.

**Acceptance criteria:**

- Manager can view all projects and tasks (read-only by default)
- Member only sees projects they are explicitly added to
- Viewer can read but cannot create, edit, or delete
- Admin has full access across the workspace

---

### Epic B — Work Hierarchy (Epic → Task → Subtask)

#### B1 — Create an Epic

**As a** Management/PM user, **I want to** create an Epic (a large initiative), **so that** leadership can track progress at a high level.

**Acceptance criteria:**

- Epic fields: title (required), description, owner, status, start date (optional), end date (optional), tags
- Epic displays aggregated % complete calculated from child Tasks
- Epic status options: `Not Started | In Progress | Done | On Hold`

#### B2 — Create a Task under an Epic

**As a** Supervisor/PM, **I want to** create Tasks under an Epic, **so that** I can break work into focus areas with clear ownership.

**Acceptance criteria:**

- Task requires a parent Epic
- Task fields: title (required), description, assignee, status, priority (`Low / Medium / High`), estimate (hours), due date
- Assignee is displayed prominently in all list/board views
- Task without an assignee is flagged visually as "Unassigned"

#### B3 — Create Subtasks under a Task

**As a** Contributor/PM, **I want to** create Subtasks under a Task, **so that** execution steps are granular and trackable.

**Acceptance criteria:**

- Subtask requires a parent Task
- Subtask fields: title (required), assignee (optional), status, estimate, due date
- Subtask % complete rolls up to parent Task's progress

#### B4 — Quick-capture a task

**As a** Contributor, **I want to** quickly write a rough task and refine it later, **so that** capturing work is frictionless.

**Acceptance criteria:**

- "Quick add" button is accessible from any project/board/list context
- Only required field at creation is title (+ auto-linked parent context if triggered from within one)
- A bullet list in the task description can be converted into Subtasks via a one-click action

---

### Epic C — Accountability

#### C1 — Assignment clarity & "My Work"

**As a** Manager, **I want** every Task/Subtask to have a visible assignee and status, **so that** responsibility is never ambiguous.

**Acceptance criteria:**

- Tasks and Subtasks without an assignee display a visual "Unassigned" indicator
- Filter by: assignee, status, due date, priority, "at risk" flag
- A "My Work" page shows all Tasks/Subtasks assigned to the current user, grouped by status
- Overdue items are surfaced at the top of "My Work"

#### C2 — Owner & watchers

**As a** PM, **I want to** set an owner and watchers on an Epic/Task, **so that** accountability and visibility are explicit.

**Acceptance criteria:**

- Owner is a single user field
- Watchers is a multi-user list
- Watchers receive email notifications on: status change, item marked overdue, EWS trigger

---

### Epic D — Monitoring & Oversight

#### D1 — Utilization overview

**As a** Supervisor, **I want to** see estimated workload per person against their capacity, **so that** I can balance the team before someone burns out.

**Acceptance criteria:**

- Each user has a configurable weekly capacity (default: 40h/week)
- Utilization view shows: sum of estimated hours on open (non-Done) work per user per week
- Filterable by project and by time range (this week / next week / custom)
- Visual indicator for over-capacity (>100%) and under-capacity (<50%)

#### D2 — Management dashboard

**As** Management, **I want** a single dashboard showing project and epic health, **so that** I don't need to ask PMs for status updates.

**Acceptance criteria:**

- Dashboard shows: overdue task count, in-progress task count, at-risk task count, top Epics by risk score
- Drill-down: Epic → Tasks → Subtasks without leaving the dashboard
- Data refreshes automatically from task activity (no manual report entry)

#### D3 — Early Warning System (EWS)

**As a** Manager, **I want** an alert when a task has been "In Progress" longer than its estimate implies, **so that** we can intervene before it becomes a problem.

**Acceptance criteria:**

- EWS triggers when a Task has been in `In Progress` status for more than its estimated hours converted to days (configurable multiplier, default: 1.5×)
- Triggered tasks are marked "At Risk" visually in all views
- Owner and watchers receive an email notification on EWS trigger (one notification per trigger, not repeated daily)
- EWS events appear in a dedicated feed on the management dashboard

#### D5 — KPI data export

**As** Management/Ops, **I want** to export task data as CSV, **so that** KPI reports can be generated without manual data entry.

**Acceptance criteria:**

- CSV export available at: workspace level, project level, and filtered list view
- Exported columns include: task ID, title, epic, assignee, status, priority, estimate, due date, created date, completed date, cycle time (days from In Progress → Done)
- Filterable by assignee and date range (weekly/monthly presets + custom) before export

---

### Epic E — Information & Collaboration

#### E1 — Project documentation hub

**As a** PM, **I want** a documentation area per project and per epic, **so that** the tracker becomes the single source of truth.

**Acceptance criteria:**

- Each Project and Epic has a "Docs" tab
- Docs tab supports rich text pages (headings, lists, bold/italic, code blocks)
- File attachments (upload) and external links can be added to a page
- Pages are listed in the sidebar of the Docs tab (basic nav, no nested hierarchy in MVP)

#### E2 — Task-level context

**As a** Contributor, **I want to** attach context directly to a task, **so that** execution doesn't depend on Slack DMs.

**Acceptance criteria:**

- Task supports: rich text description, file attachments, external link list
- Comment thread on each task for updates and decisions
- Comments support @-mention of workspace members (mentioned user receives email notification)

---

### Epic F — Views

#### F1 — List view

**As a** Manager, **I want** a list view with sorting and filtering, **so that** I can audit all work quickly.

**Acceptance criteria:**

- Sortable by: due date, priority, status, assignee
- Filterable by: assignee, status, epic, overdue flag, "at risk" flag
- At least one saved view per user (saved filter + sort state)

#### F2 — Board view

**As a** Team member, **I want** a Kanban board view by status, **so that** work-in-progress is immediately visible.

**Acceptance criteria:**

- Columns map to statuses: `To Do | In Progress | Review | Done`
- Cards show: title, assignee avatar, priority indicator, due date
- Drag-and-drop a card to a new column updates its status
- Column header shows item count (WIP visibility)

---

## Success Metrics

The MVP will be considered successful when:

1. **Adoption**: >80% of team members have at least one assigned task within 2 weeks of launch.
2. **Status freshness**: Average task status staleness (days since last update, for in-progress items) < 3 days.
3. **Dashboard utility**: Management reports no need to request manual project updates for ≥1 sprint cycle.
4. **EWS signal quality**: <20% false-positive rate on EWS triggers (as assessed in a team retro after the first month).

---

## Open Questions

1. **Auth mechanism** — Email/password or magic link? Who owns user provisioning (self-signup vs admin-invite only)?
2. **EWS thresholds** — What is the default "at risk" multiplier and is it configurable per project or workspace-wide?
3. **Rollup rules** — How is Epic % complete calculated when some tasks have subtasks and others don't? (See Appendix A)
4. **Data retention** — How long are completed/archived projects retained? Any deletion policy?
5. **Email provider** — Which transactional email provider will be used? Budget approved?

---

## Appendix A — Rollup Rules (proposed)

These rules must be agreed on before dev starts to avoid ambiguity.

| Scenario             | Rule                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| Task has subtasks    | Task % complete = (# Done subtasks / total subtasks) × 100            |
| Task has no subtasks | Task % complete = 0% if `To Do`, 50% if `In Progress`, 100% if `Done` |
| Epic % complete      | Weighted average of child Task % complete (equal weight per task)     |
| Epic with no tasks   | 0%                                                                    |

---

_This PRD is scoped to MVP only. Post-MVP candidates: Timeline view (F3), Client portal (G1), SSO, time tracking (D4), custom statuses, API export, Slack integration._
