# TASK-03: App Shell and Navigation

**Difficulty:** Easy
**Dependencies:** TASK-01

## Description

Build the application shell that all features plug into: sidebar, topbar, routing, and responsive layout. This task should result in a working nav skeleton where every route resolves — even if the page contents are placeholders.

## To-Do

- [ ] Set up client-side routing with all MVP routes defined
- [ ] Create main layout: fixed sidebar (left) + scrollable content area (right)
- [ ] Sidebar contents: workspace name, project list (dynamic), nav links: `My Work`, `Dashboard`, `People`
- [ ] Topbar: current page title, user avatar, user dropdown (profile, logout)
- [ ] Sidebar collapses on narrow viewports (hamburger toggle)
- [ ] Active route is highlighted in sidebar
- [ ] Clicking a project in the sidebar navigates to that project's default view
- [ ] Build a 404 / not-found page
- [ ] Add loading/skeleton states for sidebar project list and main content area
- [ ] Confirm that logged-out users cannot access any shell page (redirect to login)

## How to Verify

- Navigating between routes updates the active highlight in the sidebar
- Sidebar collapses and expands correctly on a narrow viewport
- Logging out from the user dropdown clears the session and lands on `/login`
- All nav links resolve without a 404 (placeholder pages are fine)
- Refreshing any route lands on the correct page, not the root
