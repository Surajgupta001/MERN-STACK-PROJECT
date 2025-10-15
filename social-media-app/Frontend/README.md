# Social Media App — Frontend

Overview

This is the React + Vite frontend for the Social Media App. It includes authentication (Clerk), state management (Redux Toolkit), routing, Tailwind CSS (via @tailwindcss/vite), and real-time message notifications via Server-Sent Events (SSE).

Tech Stack

- React 19 + Vite 7
- React Router 7
- Redux Toolkit + React Redux
- Clerk (Authentication)
- Axios (API client)
- Tailwind CSS 4 (via @tailwindcss/vite plugin)

## Overview

This is the React + Vite frontend for the Social Media App. It includes authentication (Clerk), state management (Redux Toolkit), routing, Tailwind CSS (via @tailwindcss/vite), and real-time message notifications via Server-Sent Events (SSE).

## Tech Stack

- React 19 + Vite 7
- React Router 7
- Redux Toolkit + React Redux
- Clerk (Authentication)
- Axios (API client)
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- lucide-react (icons)
- react-hot-toast (notifications)

## Environment Variables

Create a `.env` file in the `Frontend` folder (already present):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASE_URL=http://localhost:5000
```

- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key; required by `src/main.jsx`.
- `VITE_BASE_URL`: Backend API base URL; used by `src/api/axios.js` and SSE in `App.jsx`.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment

Ensure `Frontend/.env` has `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_BASE_URL` pointing to your backend (default `http://localhost:5000`).

3. Start the app

```bash
npm run dev
```

4. Log in with Clerk

The app requires Clerk authentication. The `ClerkProvider` is initialized in `src/main.jsx`.

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## Project Structure

`src/`

- `App.jsx` — App routes and global SSE subscription/notifications
- `main.jsx` — App bootstrap with ClerkProvider, BrowserRouter, and Redux store
- `api/axios.js` — Preconfigured Axios instance using `VITE_BASE_URL`
- `app/store.js` — Redux store configuration
- `assets/` — Static assets config
- `components/` — Reusable UI components
- `features/` — Redux slices (user, connections, messages)
- `pages/` — Route pages (Feed, Messages, ChatBox, etc.)

## State Management

High level:

- `userSlice` — loads current user after Clerk login
- `connectionsSlice` — loads your connections, pending, followers, following
- `messagesSlice` — fetches the active thread messages and appends new ones (SSE/send)

### Slices

- user (`src/features/user/userSlice.js`)
  - State: `{ value: null | User }`
  - Thunks:
    - `fetchUser(token)` → GET `/api/user/data`, stores the authenticated user in `state.value`.
    - `updateUser({ token, userData })` → POST `/api/user/update`, updates and replaces `state.value`.
  - Selector:
    - `state.user.value`

- connections (`src/features/connections/connectionsSlice.js`)
  - State: `{ connections: [], pendingConnections: [], followers: [], following: [] }`
  - Thunks:
    - `fetchConnections(token)` → GET `/api/user/connections`, populates all arrays.
  - Selectors:
    - `state.connections.connections`
    - `state.connections.pendingConnections`
    - `state.connections.followers`
    - `state.connections.following`

- messages (`src/features/messages/messagesSlice.js`)
  - State: `{ messages: [] }`
  - Thunks:
    - `fetchMessages({ token, userId })` → POST `/api/message/get` with `{ to_user_id: userId }`, loads the thread.
  - Reducers:
    - `setMessages(messages)` — replace entire list
    - `addMessage(message)` — append one message (used after send and SSE)
    - `resetMessages()` — clear on unmount/route change
  - Selector:
    - `state.messages.messages`

### Quick Tips

- After Clerk sign-in, `App.jsx` dispatches `fetchUser(token)` and `fetchConnections(token)`.
- On `/messages/:userId`, `ChatBox` dispatches `fetchMessages({ token, userId })` and receives live updates via `App.jsx` SSE.
- Use `resetMessages()` on chat unmount or when switching threads to avoid mixing messages.

## Routes

- `/` — Feed page
- `/messages` — Messages list
- `/messages/:userId` — Chat thread
- `/connections` — Connections page
- `/discover` — Discover users
- `/profile` — My profile
- `/profile/:profileId` — Other user’s profile
- `/create-post` — Create a post

## Real-time Messaging (SSE)

- The frontend opens an EventSource to `${VITE_BASE_URL}/api/message/:currentUserId` in `App.jsx` when the user is logged in.
- Incoming messages:
  - If you’re on `/messages/:senderId`, the message is appended live to the chat.
  - Otherwise, a toast notification appears (`Notification` component) with a Reply button to open the chat.

## Styling

- Tailwind CSS 4 via the `@tailwindcss/vite` plugin (see `vite.config.js`).
- Global styles in `src/index.css`.

## Common Issues & Fixes

- Could not resolve `./pages/layout` in `App.jsx`
  - Use `import Layout from './pages/Layout'` (match filename case).

- Could not resolve `../components/recentMessages` in `Feed.jsx`
  - Use `import RecentMessages from '../components/RecentMessages'` (match filename case).

- Nothing happens when clicking Reply in notification
  - The button navigates to `/messages/:senderId`; ensure sender id exists on message object.

- No live updates in chat until refresh
  - Ensure `VITE_BASE_URL` points to your backend, backend is running, and SSE endpoint `/api/message/:userId` is reachable.

## Backend Expectations

- Backend must run on the URL specified by `VITE_BASE_URL` and expose:
  - `/api/user/*` — user data and connections
  - `/api/post/*` — posts feed
  - `/api/story/*` — stories
  - `/api/message/*` — messaging + SSE endpoint

## Build & Deploy Notes

- This project is configured as an ESM module (`"type": "module"`).
- Tailwind CSS 4 uses the Vite plugin; no separate PostCSS config is required.
- For production, build with `npm run build` and serve via your preferred hosting.

## License

This project is part of the Social Media App (MERN) workspace.
