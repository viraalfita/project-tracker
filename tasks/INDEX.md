# Task Index

23 tasks broken down from the MVP PRD. Ordered by suggested implementation sequence.

## Foundation (do these first)

| Task | Title | Difficulty | Blocks |
|---|---|---|---|
| [TASK-01](TASK-01-project-setup-auth.md) | Project Setup and Authentication | Easy | Everything |
| [TASK-02](TASK-02-data-model.md) | Core Data Model | Medium | Most tasks |
| [TASK-03](TASK-03-app-shell-navigation.md) | App Shell and Navigation | Easy | All UI tasks |
| [TASK-23](TASK-23-progress-rollup.md) | Progress Rollup Logic | Easy | TASK-07, 08, 21, 22 |

## Access & Permissions

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-04](TASK-04-workspace-membership.md) | Workspace Membership & Invitations | Medium | 01, 02, 14 |
| [TASK-05](TASK-05-rbac.md) | Role-Based Access Control | Medium | 02, 04 |
| [TASK-06](TASK-06-project-management.md) | Project Creation & Management | Easy | 02, 03, 05 |

## Work Hierarchy

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-07](TASK-07-epic-crud.md) | Epic CRUD | Easy | 02, 06, 23 |
| [TASK-08](TASK-08-task-crud.md) | Task CRUD | Easy | 02, 07 |
| [TASK-09](TASK-09-subtask-crud.md) | Subtask CRUD | Easy | 08, 23 |
| [TASK-10](TASK-10-quick-capture.md) | Quick-Capture Task Entry | Easy | 08 |

## Accountability

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-11](TASK-11-my-work-page.md) | My Work Page & Unassigned Indicators | Easy | 08, 09 |
| [TASK-12](TASK-12-filtering-sorting.md) | Task Filtering and Sorting | Medium | 08, 21 |
| [TASK-13](TASK-13-owner-watchers.md) | Owner and Watchers Fields | Easy | 08, 14 |
| [TASK-14](TASK-14-email-notifications.md) | Email Notification Delivery | Medium | 01, 13 |

## Monitoring

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-15](TASK-15-utilization-view.md) | Team Utilization Overview | Medium | 02, 08, 09 |
| [TASK-16](TASK-16-management-dashboard.md) | Management Dashboard | Medium | 07, 08, 17, 23 |
| [TASK-17](TASK-17-ews.md) | Early Warning System (EWS) | Medium | 02, 08, 13, 14 |
| [TASK-18](TASK-18-csv-export.md) | KPI Data CSV Export | Easy | 08, 02 |

## Information & Collaboration

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-19](TASK-19-docs-hub.md) | Project & Epic Docs Hub | Medium | 06, 07 |
| [TASK-20](TASK-20-task-context.md) | Task Comments, Attachments & @Mentions | Medium | 08, 13, 14 |

## Views

| Task | Title | Difficulty | Depends On |
|---|---|---|---|
| [TASK-21](TASK-21-list-view.md) | Task List View | Medium | 08, 12, 23 |
| [TASK-22](TASK-22-board-view.md) | Kanban Board View | Medium | 08, 12 |

---

## Suggested Build Order

```
Phase 1 — Core (parallelizable after 01 + 02)
  TASK-01 → TASK-02 → TASK-03
                    ↘ TASK-23

Phase 2 — Access
  TASK-04 → TASK-05 → TASK-06

Phase 3 — Work Hierarchy
  TASK-07 → TASK-08 → TASK-09
                    ↘ TASK-10

Phase 4 — Accountability + Notifications
  TASK-11, TASK-12, TASK-13, TASK-14  (can run in parallel)

Phase 5 — Views
  TASK-21, TASK-22  (depend on 08 + 12)

Phase 6 — Monitoring
  TASK-15, TASK-16, TASK-17, TASK-18  (can run in parallel)

Phase 7 — Collaboration
  TASK-19, TASK-20
```
