# TASK-04: Workspace Membership and User Invitation

**Epic:** A1 — Workspace membership
**Difficulty:** Medium
**Dependencies:** TASK-01, TASK-02, TASK-14 (email delivery)

## Description

Allow Admins and PMs to invite team members to the workspace by email. Invited users receive an activation link via email, accept it, and are added as workspace members with the designated role.

## To-Do

- [ ] Create `invitations` table: `id, email, token, role, workspace_id, invited_by_id, accepted_at, expires_at`
- [ ] Build invite form UI: email input + role selector (Admin / Manager / Member / Viewer)
- [ ] POST `/invitations` — generate a secure random token, store invitation, trigger invite email
- [ ] Invitation email: "You've been invited to [Workspace Name]" with an activation link
- [ ] GET `/invitations/:token` — accept invite page: shows workspace name + role, prompts to set name/password if new user
- [ ] POST `/invitations/:token/accept` — create or update user record, create `workspace_members` row, invalidate token
- [ ] Workspace members list page: show avatar, name, email, role, join date
- [ ] Allow Admin to change a member's role from the members list
- [ ] Allow Admin to remove a member (soft delete from `workspace_members`)
- [ ] Handle edge cases: expired token, already-used token, email already a member

## How to Verify

- Admin can fill in the invite form and submit; an invitation record is created
- Invited user receives an email with a valid activation link (log to console in local dev)
- Accepting the link creates a `workspace_members` record with the correct role
- Attempting to use an expired or already-accepted token shows a clear error
- Inviting an email that is already a member shows a validation error without re-sending
- New member appears in the workspace members list
