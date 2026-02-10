# TASK-20: Task Comments, Attachments, and @Mentions

**Epic:** E2 — Task-level context
**Difficulty:** Medium
**Dependencies:** TASK-08, TASK-13, TASK-14

## Description

Allow contributors to attach execution context directly to a task: threaded comments, file attachments, external links, and @mentions that trigger notifications. This replaces DM-driven coordination for task-specific discussion.

## To-Do

- [ ] Comment thread at the bottom of the task detail: chronological, oldest first
- [ ] Comment composer: text area with basic formatting (bold, italic) + submit button
- [ ] POST `/tasks/:id/comments` — create comment
- [ ] Edit own comment: show "edit" option on hover; inline edit with save/cancel
- [ ] Delete own comment: soft delete — replace body with "(comment deleted)", keep the record
- [ ] Admin can delete any comment
- [ ] @mention: typing `@` in the comment composer opens a filtered user picker
- [ ] Selecting a user from the picker inserts `@name` token into the comment body
- [ ] On comment save: for each @mention token, create a `notifications` record and queue an email (TASK-14 Template 4)
- [ ] File attachments section on task detail:
  - Upload file → stored in cloud storage
  - List of attachments: filename, size, uploader, upload date, download/delete
- [ ] External links section on task detail: add URL + label, render as clickable list with delete
- [ ] Comment count badge on task cards in list and board views
- [ ] Timestamps on all comments (absolute + relative on hover)

## How to Verify

- Post a comment; it appears at the bottom of the thread with timestamp
- Edit a comment; the updated text replaces the original with an "(edited)" label
- Delete a comment; it shows "(comment deleted)" — not fully removed
- @mention a user in a comment; a notification record is created for them
- Upload a file attachment; it appears in the list and the download link works
- Add an external link with a label; it renders as a clickable link
- Comment count badge on the task card increments after posting
