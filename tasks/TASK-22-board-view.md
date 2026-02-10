# TASK-22: Kanban Board View

**Epic:** F2 — Board view
**Difficulty:** Medium
**Dependencies:** TASK-08, TASK-12 (filters)

## Description

A Kanban board with four status columns. Cards can be dragged between columns to update their status. The board is the most visually immediate view of work-in-progress. Uses the same filters as the list view.

## To-Do

- [ ] Board view route: `/projects/:id/board` and `/epics/:id/board`
- [ ] 4 columns: `To Do | In Progress | Review | Done`
- [ ] Column header: status label + item count (WIP count)
- [ ] Task card contents: title, assignee avatar (or "Unassigned"), priority color indicator, due date, subtask progress chip (e.g., `2/5`), "At Risk" badge if applicable
- [ ] Overdue cards: distinct visual treatment (e.g., red border or red due date text)
- [ ] Drag-and-drop card to a new column → PATCH `/tasks/:id` status updates immediately
- [ ] Optimistic update: card moves visually before server confirms; revert on failure with a toast error
- [ ] Card click → opens task detail slide-over panel (same as list view TASK-21)
- [ ] "Add task" button at the bottom of each column: opens quick-add modal with status pre-filled
- [ ] Integrate filter bar (TASK-12): filters narrow the cards shown per column (don't hide columns)
- [ ] Board scrolls horizontally if viewport is narrow (don't collapse columns)

## How to Verify

- Drag a card from "To Do" to "In Progress"; status is updated in DB and the column WIP count changes
- Drag a card and immediately check the DB: status reflects the new column before the next page load
- If the server returns an error on drag, the card snaps back to its original column with a toast
- Overdue card has a distinct visual style compared to non-overdue cards
- Clicking "Add task" in the "Review" column creates a task with status "Review" pre-filled
- Filtering by assignee narrows cards in every column simultaneously
- Board is horizontally scrollable on a narrow viewport without columns disappearing
