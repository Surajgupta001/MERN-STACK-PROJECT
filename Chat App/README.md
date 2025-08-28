# Chat App (MERN + Socket.IO)

Real‑time chat application featuring authentication, online presence, direct messaging with unseen badge counts, profile management, and image support.

## Features

- User signup / login (JWT auth)
- Profile (name, bio, avatar upload via Cloudinary)
- Online user presence (Socket.IO)
- Real‑time direct messaging
- Unseen message counters
- Responsive layout (Sidebar / Chat / Right panel)
- Toast notifications for feedback
- Searchable user list

## Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | React 19, Vite, Tailwind CSS v4, React Router v7 |
| State mgmt | React Context (AuthContext, ChatContext) |
| Backend    | Node.js, Express, Socket.IO |
| Database   | MongoDB + Mongoose |
| Auth       | JWT (custom header: `token`) |
| Media      | Cloudinary (profile images & message images) |

## Monorepo Structure

```text
Chat App/
	Backend/    # Express + Socket.IO server
	Frontend/   # React + Vite client
	README.md   # (this file)
```

Detailed READMEs exist in `Backend/Readme.md` and `Frontend/README.md`.

## High-Level Architecture

1. User authenticates → receives JWT.
2. Frontend stores token (localStorage) and sets axios default header `token`.
3. Authenticated client opens Socket.IO connection with `?userId=<id>`.
4. Server tracks sockets in an in‑memory `userSocketMap` and broadcasts online users.
5. Messages persisted in MongoDB; when sent the receiver’s socket (if online) receives `newMessage`.
6. Unseen counts are fetched via `/api/messages/users` and updated in real‑time for non‑active chats.

## Environment Variables

Backend `.env` (example):

```bash
PORT=8080
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster/<db>
JWT_SECRET=super_secret_string
CLOUDINARY_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CORS=http://localhost:5173
```

Frontend `.env`:

```bash
VITE_BACKEND_URL=http://localhost:8080
```

## Quick Start (Development)

In two terminals:

Backend:

```bash
cd "Chat App/Backend"
npm install
npm run server
```

Frontend:

```bash
cd "Chat App/Frontend"
npm install
npm run dev
```

Then open: http://localhost:xxxx

Then open: <http://localhost:xxxx>

Health check (backend): <http://localhost:xxxx/api/status>

## Core API Endpoints (Summary)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Create user |
| POST | /api/auth/login | Login user |
| GET  | /api/auth/check | Validate token & return user |
| PUT  | /api/auth/update-profile | Update profile data |
| GET  | /api/messages/users | Sidebar users (query: includeSelf=true) |
| GET  | /api/messages/:id | Conversation with user |
| POST | /api/messages/send/:id | Send message to user |
| PUT  | /api/messages/mark/:messageId | Mark single message seen |

## Socket Events

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| client→server | (connection) | query.userId | Register/track presence |
| server→client | getOnlineUsers | string[] userIds | Broadcast presence list |
| server→client | newMessage | Message object | Push incoming direct message |

## Development Notes

- Axios uses a custom header `token` (not `Authorization`).
- Unseen counts currently recomputed per user fetch; consider aggregation or incremental strategy for large scale.
- Presence map resets upon server restart (in‑memory) — fine for dev; use Redis for production resilience.
- Message list loads fully; implement pagination / lazy load for long threads as a next step.

## Testing Ideas (Not Implemented Yet)

- Unit: util for JWT generation, unseen counts logic.
- Integration: signup → login → fetch users → send message flow.
- E2E: Cypress test for two browsers exchanging messages and unseen badge updates.

## Production Hardening Checklist

- [ ] Add rate limiting (login/signup + message send)
- [ ] Add request validation (Zod / Joi)
- [ ] Use HTTPS + secure cookies (if migrating from header token)
- [ ] Add logging (pino / winston) & structured error responses
- [ ] Swap in persistent pub/sub (Redis) for horizontal socket scaling
- [ ] Implement message pagination + index optimization
- [ ] Image size & mime validation before Cloudinary upload

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| 401 on protected routes | Missing `token` header | Ensure login succeeded & axios default header set |
| Empty sidebar | Backend URL mismatch | Verify `VITE_BACKEND_URL` and backend running |
| No online users | Socket blocked / CORS mismatch | Check backend CORS env + browser console |
| Unseen counts incorrect | Using stale backend logic | Ensure updated backend deployed (includes self logic) |
| Avatar not saving | Cloudinary env vars missing | Recheck credentials and network calls |

## License

ISC (see per-folder README for more details) — adjust as needed.

---
Last updated: 2025-08-08.
