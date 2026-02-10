# TASK-12: Task Filtering and Sorting

**Epic:** C1, F1
**Difficulty:** Medium
**Dependencies:** TASK-08, TASK-21 (list view uses these filters)

## Description

Reusable filter and sort controls for task list views. Filters are combinable, shareable via URL, and can be saved as named views (up to 3 per user per project). This component is shared between the List View (TASK-21) and the My Work page (TASK-11).

## To-Do

- [ ] Filter controls component: assignee (multi-select), status (multi-select), priority (multi-select), epic (multi-select), overdue (toggle), "at risk" (toggle)
- [ ] Multiple active filters combine with AND logic
- [ ] Sort controls: by due date, priority, status, assignee — ascending/descending toggle
- [ ] Active filter state is reflected in URL query params (e.g., `?assignee=1,2&status=In+Progress`)
- [ ] Shareable: pasting the URL into a new tab loads the same filter state
- [ ] "Clear filters" button resets all active filters at once
- [ ] "Save view" button: prompts for a view name, saves current filter + sort combo
- [ ] Saved views stored per user per project (max 3)
- [ ] Saved views dropdown to load any saved view
- [ ] Overwriting a saved view: if at max (3), prompt to replace an existing one

## How to Verify

- Filter by one assignee: only their tasks are shown
- Apply assignee + status filters together: results satisfy both conditions
- Sort by due date ascending: tasks with earliest due date appear first; tasks with no due date appear last
- Copy URL with active filters, paste in new tab: same filters are active
- Save a view, reload page, load saved view: filter/sort state is restored correctly
- Clearing all filters shows all tasks
