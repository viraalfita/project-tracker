# TASK-13: Owner and Watchers Fields

**Epic:** C2 — Ownership + watchers
**Difficulty:** Easy
**Dependencies:** TASK-08, TASK-14 (notifications wired here)

## Description

Add owner (single user) and watchers (list of users) fields to Epics and Tasks. These fields control who gets notified on key events — status changes, overdue alerts, and EWS triggers. Notification records are created here; actual email delivery is handled in TASK-14.

## To-Do

- [ ] `owner_id` field on `epics` and `tasks` (single user)
- [ ] `watchers` polymorphic join table: `(watchable_type, watchable_id, user_id)` (from TASK-02)
- [ ] Owner picker UI: single-user selector on epic/task detail (searchable dropdown)
- [ ] Watchers picker UI: multi-user selector on epic/task detail (add/remove chips)
- [ ] Saving owner/watchers persists immediately (no separate "save" button — autosave on change)
- [ ] Notification trigger: task/epic **status changed** → create `notifications` record for each watcher
- [ ] Notification trigger: task **overdue** (due date < today and status ≠ Done) → notify owner + watchers (checked at EWS cron time, see TASK-17)
- [ ] Notification trigger: **EWS fired** on a task → notify owner + watchers (wired from TASK-17)
- [ ] Do not duplicate notifications: if the same event fires twice, don't create a second record for the same trigger

## How to Verify

- Set owner on a task; the owner field shows the selected user
- Add 2 watchers; both appear as chips in the watchers picker
- Change task status; a notification record exists in `notifications` for each watcher
- Remove a watcher; they no longer receive notifications on subsequent status changes
- Overdue task at cron run time creates a notification record for owner + watchers
