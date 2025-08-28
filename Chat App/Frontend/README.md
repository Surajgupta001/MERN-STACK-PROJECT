# Chat App Frontend

React + Vite + Tailwind frontend for the real‑time chat application (pairs with the backend in `../Backend`).

## Features

- JWT authentication (login / signup / profile update)
- Real‑time online presence & messaging via Socket.IO client
- Unseen message badge counts
- Searchable user list (sidebar)
- Profile picture & bio update (Cloudinary via backend)
- Toast notifications (react-hot-toast)

## Tech Stack

- React 19 + Vite
- React Router DOM v7
- Context API (AuthContext, ChatContext)
- Socket.IO Client
- Axios
- Tailwind CSS (v4 via `@tailwindcss/vite`)

## Project Structure

```text
Frontend/
	src/
		main.jsx            # App bootstrap + Providers
		App.jsx             # Routes
		pages/
			HomePage.jsx      # Layout: Sidebar + Chat + RightSidebar
			LoginPage.jsx     # Signup/Login form flow
			ProfilePage.jsx   # Profile update
		components/
			Sidebar.jsx
			ChatContainer.jsx
			RightSiderbar.jsx
		context/
			AuthContext.jsx   # Auth + socket + axios base config
			ChatContext.jsx   # Users, messages, unseen counts
		assets/             # Images / icons
		index.css           # Tailwind entry
	.env                  # VITE_BACKEND_URL
	vite.config.js
	package.json
```

## Environment Variables

Create `./.env`:
```bash
VITE_BACKEND_URL=http://localhost:8080
```
Adjust if backend runs on a different host/port or is deployed.

## Scripts

```bash
npm run dev       # Start Vite dev server (default: http://localhost:5173)
npm run build     # Production build (outputs dist/)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Authentication Flow (Frontend Perspective)

1. User signs up or logs in → receive `{ token, user }`.
2. Token stored in `localStorage` & set on `axios.defaults.headers.common['token']`.
3. `AuthContext` calls `/api/auth/check` on refresh if a stored token exists.
4. Socket connection established with `?userId=<authUser._id>` once authenticated.

## Real‑Time Messaging Flow

1. `ChatContext` fetches `/api/messages/users?includeSelf=true` for sidebar.
2. Selecting a user triggers `GET /api/messages/:id` to load conversation.
3. Sending message: `POST /api/messages/send/:id` then optimistic append.
4. Incoming `newMessage` socket event:
	- If from currently selected user → added & marked seen (API call to mark).
	- Else increments unseen badge count for that sender.

## Styling
Tailwind CSS v4 (Next) through `@tailwindcss/vite`. Global styles in `index.css` plus utility classes inline. Background image defined via arbitrary value in `App.jsx` container.

## Adding a New Component

1. Create file under `src/components/`.
2. Import into relevant page (e.g., `HomePage.jsx`).
3. Keep side‑effects (API/socket) inside contexts or dedicated hooks – components should stay presentational where possible.

## Common Issues
| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| 401 responses after refresh | Token header missing | Ensure `localStorage` has token & not cleared; `AuthContext` sets header in effect |
| No users in sidebar | Not authenticated yet or backend unreachable | Check network tab for `/api/messages/users` & confirm `VITE_BACKEND_URL` |
| Online status not updating | Socket not connected | Verify backend URL, CORS env, and `userId` passed |
| Stale unseen counts | Not calling mark endpoint | Selecting user triggers fetch; ensure no console errors from PUT mark |

## Build & Deploy

1. Set production `VITE_BACKEND_URL` (e.g., deployed API URL) in environment of host platform.
2. Run `npm run build` → deploy `dist/` with a static host (Netlify, Vercel static, S3+CloudFront, etc.).
3. Ensure backend CORS env includes the deployed frontend origin.

## Accessibility & Improvements (Future)

- Focus management after route changes.
- Keyboard navigation for user list.
- Message virtualization for large threads.
- Error boundary around main layout.

## License

ISC (follows backend; adjust if needed).

---
Last updated: 2025-08-08.
