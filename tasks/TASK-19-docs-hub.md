# TASK-19: Project and Epic Documentation Hub

**Epic:** E1 — Project documentation hub
**Difficulty:** Medium
**Dependencies:** TASK-06, TASK-07

## Description

A documentation section attached to each Project and Epic. Supports rich-text pages and file/link attachments. For MVP, full-text search across docs is deferred — the scope here is creation, editing, and navigation within a single project or epic's docs.

## To-Do

- [ ] "Docs" tab on Project detail and Epic detail pages
- [ ] Doc page list in a left sidebar within the Docs tab: page title + last updated timestamp
- [ ] "New page" button: prompts for title, creates a blank page, opens it for editing
- [ ] Rich-text editor with support for:
  - Headings H1, H2, H3
  - Bold, italic, inline code
  - Bullet list, numbered list
  - Code block (monospace, no syntax highlighting required for MVP)
- [ ] Auto-save on change (debounced, e.g., 2s after last keystroke) OR explicit save button — pick one and be consistent
- [ ] Edit page title inline (click to edit in the sidebar or page header)
- [ ] Delete page: confirmation dialog, then removes from list
- [ ] File attachments section below the editor:
  - Upload file → stored and served via cloud storage (e.g., S3)
  - List of attached files with filename, size, upload date, download link
- [ ] External links section: add URL + label, rendered as clickable list
- [ ] Page navigation: clicking a page name in the sidebar loads that page

## How to Verify

- Create a new page; it appears in the sidebar with the correct title
- Apply all rich-text formats (heading, bold, code block, list); reload and confirm they persist
- Upload a file attachment; it appears in the attachment list and the download link works
- Add an external link; it renders as a clickable hyperlink (opens in new tab)
- Delete a page; it disappears from the sidebar
- Docs tab is accessible from both Project and Epic detail pages independently
