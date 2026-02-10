# TASK-14: Email Notification Delivery

**Difficulty:** Medium
**Dependencies:** TASK-01, TASK-13

## Description

Set up a transactional email provider and implement email delivery for all notification types. Emails are sent via a background job/queue to avoid blocking the request thread. In local dev, emails are logged to the console — never sent.

## To-Do

- [ ] Choose and configure transactional email provider (Resend or AWS SES)
- [ ] Email sending service/module: wraps provider SDK, supports retry on transient failure
- [ ] Background job/queue integration: email sends are enqueued, not inline (e.g., Sidekiq, BullMQ, or similar)
- [ ] Test mode: `NODE_ENV=development` (or equivalent) logs email content to console, does not call provider
- [ ] **Template 1 — Workspace invitation:** "You've been invited to [Workspace Name]" + activation link (TASK-04)
- [ ] **Template 2 — Task status changed:** "Task [name] was moved to [status] by [user]" with a direct link
- [ ] **Template 3 — Task/subtask overdue:** "[Task name] is overdue (due [date])" + link
- [ ] **Template 4 — @mention in comment:** "[User] mentioned you in [Task name]" + comment excerpt + link
- [ ] **Template 5 — EWS triggered:** "[Task name] may be at risk — it has been In Progress for [N] days" + link
- [ ] Unsubscribe link in footer of every notification email; clicking it sets `unsubscribed_at` on the user and stops future notification emails (invite emails are exempt)
- [ ] Rendering test: render each template with realistic fixture data and confirm no broken variables

## How to Verify

- In local dev: trigger each notification type and confirm the email content is logged to console
- In staging: send a workspace invite and confirm delivery within 60 seconds
- Unsubscribe link marks user as opted-out; subsequent notifications are not sent to that user
- All 5 templates render correctly with real data (no `{{undefined}}` or broken links)
- Background job queue processes emails without blocking API responses
