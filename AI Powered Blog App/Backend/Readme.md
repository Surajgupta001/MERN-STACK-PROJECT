## AI Powered Blog App — Backend

This is the Express/MongoDB backend for the AI Powered Blog App. It provides:
- Blog CRUD and publish toggling
- Comment moderation (approve/delete)
- Admin authentication (JWT)
- Image upload via ImageKit with on-the-fly optimization
- AI content generation using Google Gemini

## Tech
- Node.js, Express 5
- MongoDB with Mongoose 8
- JWT for admin auth
- Multer for file upload
- ImageKit for media storage and optimization
- Google Gemini via `@google/genai`

## Prerequisites
- Node.js 18+
- A MongoDB connection string
- ImageKit account (public/private key + URL endpoint)
- Google Gemini API key

## Setup
1. Install dependencies
	- From this folder:
	  - npm install
2. Environment variables: create a `.env` file in `Backend/` with the following:

	PORT=8080
	MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/ai_powered_blog_app
	ADMIN_EMAIL=xxxx@xxxxx.com
	ADMIN_PASSWORD=xxxxxxx
	JWT_SECRET=your_jwt_secret
	IMAGEKIT_PUBLIC_KEY=...
	IMAGEKIT_PRIVATE_KEY=...
	IMAGEKIT_URL_ENDPOINT=...
	GEMINI_API_KEY=...

Notes:
- Ensure your MongoDB database name has no spaces (e.g., `ai_powered_blog_app`).
- Keep keys secret; don’t commit `.env`.

3. Run the server
	- Development: npm run server
	- Production: npm start

The API will start on http://localhost:8080 by default.

## Key Files
- `server.js` — app entry, routes wiring, CORS, JSON parsing
- `config/database.js` — Mongo connection
- `config/imageKit.js` — ImageKit client
- `config/gemini.js` — Gemini client wrapper
- `controllers/*.js` — route controllers
- `routes/*.js` — routers
- `models/*.js` — Mongoose models

## Auth
Most admin routes are protected by a simple JWT check using the token returned by `/api/admin/login`.
- Send the token in `Authorization` header.

## Routes

Admin routes (prefix `/api/admin`):
- POST `/login` — returns JWT (body: `{ email, password }`)
- GET `/comments` — list all comments, newest first
- GET `/blogs` — list all blogs for admin
- POST `/delete-comment` — body `{ id }`
- POST `/approve-comment` — body `{ id }`
- GET `/dashboard` — counts and recent blogs

Blog routes (prefix `/api/blog`):
- POST `/add` — multipart form-data: field `blog` (JSON string with `title, subTitle, description, category, isPublished`) and `image` file
- GET `/all` — published blogs
- GET `/:blogId` — single blog
- POST `/delete` — body `{ id }`
- POST `/toggle-publish` — body `{ id }`
- POST `/add-comment` — body `{ blog, name, content }`
- POST `/comments` — body `{ blogId }`, returns approved comments
- POST `/generate` — body `{ prompt }` (requires Authorization header)

## Models
- `Blog` — title, subTitle, description, category, image, isPublished, timestamps
- `Comment` — blog (ref: Blog), name, content, isApproved, timestamps

## Image Upload
We use Multer to accept the image file, then upload to ImageKit and return an optimized WebP URL.

## AI Content Generation
Endpoint: `POST /api/blog/generate`
- Requires `Authorization` header (admin JWT)
- Requires `GEMINI_API_KEY` in `.env`
- Request: `{ prompt: string }`
- Response: `{ success, content }`

## Troubleshooting
- Invalid namespace specified: Ensure `MONGO_URI` database name has no spaces.
- 500 on `/api/admin/comments`: Make sure `Comment` model is imported in `admin.controllers.js` and `comment.models.js` uses `ref: "Blog"`.
- 500 on `/api/blog/generate`: Check `GEMINI_API_KEY` is set; see server logs for detailed message.
- Blogs not showing in `/api/blog/all`: Only `isPublished: true` are returned; ensure you set it on creation or toggle publish.

## License
This project is for educational/demo purposes.

