# TASK-10: Quick-Capture Task Entry

**Epic:** B4 — Task granularity quick-capture
**Difficulty:** Easy
**Dependencies:** TASK-08

## Description

A globally accessible "quick add" button that lets anyone capture a task with just a title — no friction. When triggered from within a project or epic, the parent context is pre-filled. Also includes a one-click utility to convert bullet-list descriptions into subtasks.

## To-Do

- [ ] Floating or header-anchored "Quick Add" button visible on any project/list/board page
- [ ] Quick-add modal: title field (auto-focused), parent project/epic auto-detected from current context
- [ ] Only required field at submission is title (status defaults to `To Do`)
- [ ] After save: option A — dismiss modal and show a "View task" toast link; option B — open full task detail immediately (choose one and be consistent)
- [ ] Keyboard shortcut to open quick-add: `N` key (or `Cmd+K` if using a command palette pattern)
- [ ] In task description editor: "Convert to subtasks" button
  - Parses lines beginning with `- ` or `* ` from the description
  - Creates one subtask per matching line, preserving the text
  - Removes parsed lines from the description after conversion
  - Shows a count: "Created 4 subtasks"

## How to Verify

- Pressing the quick-add button from inside a project pre-fills the project/epic context
- Submitting with only a title creates a valid task (no validation errors)
- Submitting with no title shows a validation error without closing the modal
- Keyboard shortcut opens the modal from any page
- A task description with 4 bullet lines converts to 4 subtasks; lines are removed from the description
- Conversion shows confirmation ("Created 4 subtasks") and does not create duplicates on re-run
