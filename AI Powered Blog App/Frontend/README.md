# AI Powered Blog App — Frontend

React frontend for the AI Powered Blog App. It provides:

- Public blog listing and detail pages
- Admin dashboard: add blog, manage comments, view metrics
- AI-assisted blog content generation

## Tech

- React 19 (Vite)
- React Router DOM 7
- Tailwind CSS 4
- Motion for small animations
- Quill editor for rich text
- react-hot-toast for notifications

## Prerequisites

- Node.js 18+
- Backend running (defaults to [http://localhost:8080](http://localhost:8080))

## Setup

1. Install dependencies
	 - From this folder:
		 - npm install

2. Development
	 - npm run dev
	 - App runs at [http://localhost:5173](http://localhost:5173) by default

## Environment

If your backend URL differs, set a base URL in your Axios wrapper/context or use a `.env` with Vite (e.g., `VITE_API_BASE_URL`). This project’s `AppContext` already injects axios with headers for admin routes.

## Key Features

- Blog list with category filters (`src/components/BlogList.jsx`)
- Blog card and detail view
- Admin:
	- Add Blog (`src/pages/Admin/AddBlog.jsx`) with thumbnail upload and Quill editor
	- Generate content with AI button (requires backend auth and GEMINI_API_KEY set)
	- Comments moderation (`src/pages/Admin/Comments.jsx`)
	- Dashboard metrics

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build

## Notes and Tips

- Ensure your backend is running and reachable; admin endpoints require an Authorization token from `/api/admin/login`.
- In `BlogList`, we ensure unique keys and correct props to `Blogcard`.
- Comments table guards against deleted blogs and shows fallback labels.

## Troubleshooting

- 401 from admin routes: make sure the token is set in the Authorization header (handled by `AppContext`).
- 500 on AI generation: check backend `.env` has `GEMINI_API_KEY` and the backend restarted.
- Images not showing: confirm ImageKit URL from backend is valid and reachable.

## License

For educational/demo use.

