# TASK-18: KPI Data CSV Export

**Epic:** D5 — KPI-ready metrics export
**Difficulty:** Easy
**Dependencies:** TASK-08, TASK-02 (task_status_events for cycle time)

## Description

Allow Managers and Admins to export task data as a CSV file for external KPI reporting. Exports can be filtered before download. Cycle time is derived from `task_status_events`. This is the only data export format for MVP — no API endpoint needed.

## To-Do

- [ ] "Export CSV" button on: workspace-level task view, project-level task list, and filtered list view
- [ ] Pre-export filter modal: assignee (multi-select), project (multi-select), date range (this week / this month / last month / custom), status (multi-select)
- [ ] Active filters from the current list view are pre-filled into the export filter modal
- [ ] Server-side CSV generation (streamed to avoid loading all rows into memory for large exports)
- [ ] Exported columns:
  - `task_id`, `title`, `epic`, `project`, `assignee`, `status`, `priority`
  - `estimate_hours`, `due_date`, `created_at`, `completed_at`
  - `cycle_time_days` (days from first `In Progress` → `Done`; blank if task never completed)
- [ ] Filename: `export-{project-slug}-{YYYY-MM-DD}.csv` (workspace-level: `export-workspace-{date}.csv`)
- [ ] Empty export (no matching rows): returns CSV with headers only, not an error
- [ ] Restrict export to Admin and Manager roles

## How to Verify

- Export button appears for Admin/Manager, is absent for Member/Viewer
- Download produces a valid `.csv` file that opens in Excel and Google Sheets without encoding issues
- `cycle_time_days` is correct: a task moved to In Progress on day 1 and Done on day 4 shows `3`
- Filtering by assignee in the export modal produces a CSV with only their tasks
- Empty result set returns a CSV with headers only (not a 0-byte file or error)
- File name includes the project name and today's date
