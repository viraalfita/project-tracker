# TASK-01: Project Setup and Authentication

**Difficulty:** Easy
**Dependencies:** None

## Description

Scaffold the web application, connect a database, and implement email/password authentication. This is the foundation everything else builds on. Authenticated routes must be protected — unauthenticated users should always be redirected to login.

## To-Do

- [ ] Initialize project repo and choose framework (e.g. Next.js, Rails, etc.)
- [ ] Set up database and ORM/query layer
- [ ] Create `users` table: `id, email, password_digest, name, created_at`
- [ ] Implement registration endpoint (POST `/auth/register`)
- [ ] Implement login endpoint (POST `/auth/login`) returning a session or JWT
- [ ] Implement logout (clear session/token)
- [ ] Build registration page (UI)
- [ ] Build login page (UI)
- [ ] Protect all authenticated routes — redirect to `/login` if unauthenticated
- [ ] Set up `.env` / config for secrets, DB URL, and environment flags
- [ ] Test mode: never send real emails in local dev (log to console instead)

## How to Verify

- A new user can register with name + email + password and is redirected to the app
- A returning user can log in and receive a valid session/token
- Visiting any protected route while logged out redirects to `/login`
- Invalid credentials return a clear error message (not a 500)
- Logging out clears the session and redirects to `/login`
