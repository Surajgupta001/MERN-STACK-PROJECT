# Social Media App — Backend

## Overview

Node.js + Express backend for the Social Media App. Provides REST APIs for users, posts, stories, connections, and messaging. Supports Clerk authentication, MongoDB via Mongoose, image uploads with ImageKit, email via Nodemailer, and Server‑Sent Events (SSE) for real‑time messages. Inngest is configured for background jobs/webhooks.

## Tech Stack

- Node.js (ESM)
- Express 5
- Mongoose (MongoDB)
- Clerk (Authentication) via `@clerk/express`
- Multer (file uploads)
- ImageKit (media storage/transform)
- Nodemailer (email)
- Inngest (background jobs)
- CORS, dotenv

## Environment Variables

Create a `.env` file in the `Backend` folder. Example:

```dotenv
# Frontend URL (for CORS / cross‑links)
FRONTEND_URL=http://localhost:5173

# MongoDB Connection
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# Inngest
INNGEST_EVENT_KEY=xxxxxxxx
INNGEST_SIGNING_KEY=signkey-xxxxxxxx

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ImageKit
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your_endpoint>

# SMTP (email)
SENDER_EMAIL=you@example.com
SMPT_USER=...
SMPT_PASSWORD=...
```

> Note: Never commit real secrets. Values above are placeholders.

## Scripts

- `npm start` — start server (node server.js)
- `npm run server` — start with nodemon for local development

## Run Locally

1) Install dependencies

```bash
npm install
```

1) Configure environment

- Add a `.env` with the variables listed above.
- Ensure MongoDB URI is reachable.

1) Start the API

```bash
npm run server
# or
npm start
```

Server listens on `PORT` (default 5000). On start you should see MongoDB connection success and `Server is running on port <port>`.

## Project Structure

- `server.js` — app bootstrap, middleware, routes mounting, inngest serve
- `config/`
  - `database.js` — connect to MongoDB
  - `multer.js` — upload config
  - `imageKit.js` — ImageKit client
  - `nodeMailer.js` — email client
- `middlewares/`
  - `auth.js` — `protect` middleware using Clerk
- `routes/`
  - `userRoutes.js` — user profile, follow/connect, discovery, recent messages
  - `postRoutes.js` — posts add/feed/like
  - `storyRoutes.js` — stories CRUD/feed
  - `messageRoutes.js` — send/get chat and SSE endpoint
- `controllers/` — handlers for each domain
- `models/` — Mongoose schemas: `User`, `Post`, `Story`, `Message`, `Connections`
- `inngest/` — inngest client and functions

## Authentication

- Clerk middleware is enabled globally in `server.js` via `clerkMiddleware()`.
- Protected endpoints use `protect` (wraps Clerk) and controllers call `await req.auth()` to obtain `{ userId }`.

## API Routes (summary)

Base path: `/api`

- `/user`
  - `GET /data` — current user data (auto‑provisions if missing)
  - `POST /update` — update profile (supports `profile` and `cover` uploads)
  - `POST /discover` — search/discover users
  - `POST /follow` — follow user
  - `POST /unfollow` — unfollow user
  - `POST /connect` — send connection request (idempotent)
  - `POST /accept` — accept connection request
  - `GET /connections` — lists connections, pending, followers, following
  - `GET /recent-messages` — recent messages to the user

- `/post`
  - `POST /add` — create post (multipart `images` up to 4)
  - `GET /feed` — personalized feed
  - `POST /like` — like/unlike post

- `/story`
  - See `storyRoutes.js` for available endpoints

- `/message`
  - `GET /:userId` — SSE stream; subscribe to events for this userId
  - `POST /send` — send a message (multipart `image` optional)
  - `POST /get` — fetch chat messages with `{ to_user_id }`

## Messaging & SSE

- Server maintains an in‑memory `connections` map of SSE response streams.
- On `POST /api/message/send`, after persisting the message, the server writes an SSE frame to the recipient connection: `data: <json>\n\n`.
- Consumers subscribe via `EventSource(VITE_BASE_URL + '/api/message/:userId')`.

## Media Uploads

- Uses `multer` for multipart handling.
- For images, file buffer uploads to ImageKit; `imageKit.url` generates optimized URLs (webp, quality auto, width 1280).

## Inngest

- `serve({ client: inngest, functions })` is mounted at `/api/inngest`.
- Add background jobs/webhooks under `inngest/` and export them via `index.js`.

## CORS

- `cors()` is enabled globally. If you need stricter control, set explicit origin(s) (e.g., `FRONTEND_URL`).

## Production Notes

- Set all secrets via environment (never commit).
- Ensure persistent storage for MongoDB; do not depend on in‑memory connections map across replicas for SSE (use a pub/sub or WebSocket broker if scaling horizontally).
- Behind proxies/load balancers, keep‑alive and timeouts must be tuned for SSE.

## License

Part of the Social Media App (MERN) workspace.
